/**
 * @module @application/services/TransportLogisticsService
 *
 * Coordinates warehouse storage and automated inbound transport for production.
 */

import type { TransportLogisticsPort } from '../../domain/transport/TransportLogisticsPort.js';
import type { DomainEvent } from '../../common/events/DomainEvent.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { BuildingCategory } from '../../content/building/BuildingTypeDefinition.js';
import type { GameContentLoadResult } from '../../content/validateGameContent.js';
import type { RecipeDefinition } from '../../content/recipe/RecipeDefinition.js';
import { BuildingStorage } from '../../domain/building/BuildingStorage.js';
import type { BuildingStorageRepository } from '../../domain/building/BuildingStorageRepository.js';
import type { BuildingRepository } from '../../domain/building/BuildingRepository.js';
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import type { Building } from '../../domain/building/Building.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { Inventory } from '../../domain/inventory/Inventory.js';
import type { InventoryRepository } from '../../domain/inventory/InventoryRepository.js';
import type { ProductionJobRepository } from '../../domain/production/ProductionJobRepository.js';
import { ProductionJobStatus } from '../../domain/production/ProductionJobStatus.js';
import { TransportOrderStatus } from '../../domain/transport/TransportOrderStatus.js';
import { createProductionJobId } from '../../domain/production/ProductionJob.js';
import {
  TransportOrder,
} from '../../domain/transport/TransportOrder.js';
import { createTransportOrderId } from '../../domain/transport/TransportOrderId.js';
import type { TransportOrderRepository } from '../../domain/transport/TransportOrderRepository.js';
import type { ProductionInventoryService } from './ProductionInventoryService.js';
import { createResourceTypeId } from '../../domain/shared/ResourceTypeId.js';

/** Default transport duration in simulation ticks (transport.md v1). */
export const DEFAULT_TRANSPORT_DURATION = 5;

export type TransportLogisticsServiceDependencies = {
  readonly clock: Clock;
  readonly buildingRepository: BuildingRepository;
  readonly buildingStorageRepository: BuildingStorageRepository;
  readonly transportOrderRepository: TransportOrderRepository;
  readonly productionJobRepository: ProductionJobRepository;
  readonly inventoryRepository: InventoryRepository;
  readonly productionInventoryService: ProductionInventoryService;
  readonly gameContent: GameContentLoadResult;
  readonly enqueueEvents: (events: readonly DomainEvent[]) => void;
};

/**
 * Plans and completes warehouse-to-production transport orders.
 */
export class TransportLogisticsService implements TransportLogisticsPort {
  readonly #clock: TransportLogisticsServiceDependencies['clock'];
  readonly #buildingRepository: TransportLogisticsServiceDependencies['buildingRepository'];
  readonly #buildingStorageRepository: TransportLogisticsServiceDependencies['buildingStorageRepository'];
  readonly #transportOrderRepository: TransportLogisticsServiceDependencies['transportOrderRepository'];
  readonly #productionJobRepository: TransportLogisticsServiceDependencies['productionJobRepository'];
  readonly #inventoryRepository: TransportLogisticsServiceDependencies['inventoryRepository'];
  readonly #productionInventoryService: TransportLogisticsServiceDependencies['productionInventoryService'];
  readonly #gameContent: TransportLogisticsServiceDependencies['gameContent'];
  readonly #enqueueEvents: TransportLogisticsServiceDependencies['enqueueEvents'];

  constructor(dependencies: TransportLogisticsServiceDependencies) {
    this.#clock = dependencies.clock;
    this.#buildingRepository = dependencies.buildingRepository;
    this.#buildingStorageRepository = dependencies.buildingStorageRepository;
    this.#transportOrderRepository = dependencies.transportOrderRepository;
    this.#productionJobRepository = dependencies.productionJobRepository;
    this.#inventoryRepository = dependencies.inventoryRepository;
    this.#productionInventoryService = dependencies.productionInventoryService;
    this.#gameContent = dependencies.gameContent;
    this.#enqueueEvents = dependencies.enqueueEvents;
  }

  /** Returns the first active warehouse for a company, if any. */
  findActiveWarehouse(companyId: CompanyId): Building | undefined {
    return this.#buildingRepository
      .findByCompanyId(companyId)
      .find((building) => {
        if (building.getStatus() !== BuildingStatus.ACTIVE) {
          return false;
        }

        const buildingType = this.#gameContent.buildingTypes.get(building.getBuildingTypeId().value);
        return buildingType?.category === BuildingCategory.STORAGE;
      });
  }

  /** Ensures a storage record exists when a storage building becomes active. */
  ensureStorageForBuilding(building: Building): void {
    const buildingType = this.#gameContent.buildingTypes.get(building.getBuildingTypeId().value);

    if (buildingType?.category !== BuildingCategory.STORAGE) {
      return;
    }

    if (this.#buildingStorageRepository.findByBuildingId(building.getId()) !== undefined) {
      return;
    }

    this.#buildingStorageRepository.save(
      new BuildingStorage(building.getId(), building.getCompanyId()),
    );
  }

  /** Deposits purchased resources into the company warehouse when available. */
  depositMarketPurchase(
    companyId: CompanyId,
    resourceId: string,
    amount: number,
  ): Result<void, ValidationError> {
    const warehouse = this.findActiveWarehouse(companyId);

    if (warehouse === undefined) {
      return Result.ok(undefined);
    }

    this.ensureStorageForBuilding(warehouse);
    const storage = this.#buildingStorageRepository.findByBuildingId(warehouse.getId());

    if (storage === undefined) {
      return Result.fail(new ValidationError('Warehouse storage was not initialized.'));
    }

    const inventory = this.#inventoryRepository.findByCompanyId(companyId);

    if (inventory === undefined) {
      return Result.fail(new ValidationError('Company inventory was not found.'));
    }

    const removeResult = inventory.removeQuantity(resourceId, amount, this.#clock);

    if (!removeResult.ok) {
      return Result.fail(removeResult.error);
    }

    const addResult = storage.addQuantity(resourceId, amount);

    if (!addResult.ok) {
      inventory.addQuantity(resourceId, amount, this.#clock);
      return Result.fail(addResult.error);
    }

    this.#inventoryRepository.save(inventory);
    this.#buildingStorageRepository.save(storage);
    this.#enqueueEvents(inventory.pullDomainEvents());

    return Result.ok(undefined);
  }

  /** Whether recipe inputs are available in company inventory. */
  canFulfillFromGlobal(inventory: Inventory, recipe: RecipeDefinition): boolean {
    return recipe.inputs.every((input) => {
      const resourceIdResult = createResourceTypeId(input.resource);

      if (!resourceIdResult.ok) {
        return false;
      }

      return inventory.getAvailableQuantity(resourceIdResult.value) >= input.amount;
    });
  }

  /** Whether recipe inputs are available in warehouse storage. */
  canFulfillFromWarehouse(companyId: CompanyId, recipe: RecipeDefinition): boolean {
    const warehouse = this.findActiveWarehouse(companyId);

    if (warehouse === undefined) {
      return false;
    }

    const storage = this.#buildingStorageRepository.findByBuildingId(warehouse.getId());

    if (storage === undefined) {
      return false;
    }

    return recipe.inputs.every((input) => storage.getAvailable(input.resource) >= input.amount);
  }

  /** Whether inbound transport is required before production can start. */
  needsInboundTransport(
    companyId: CompanyId,
    inventory: Inventory,
    recipe: RecipeDefinition,
  ): boolean {
    const warehouse = this.findActiveWarehouse(companyId);

    if (warehouse === undefined) {
      return false;
    }

    if (this.canFulfillFromGlobal(inventory, recipe)) {
      return false;
    }

    return this.canFulfillFromWarehouse(companyId, recipe);
  }

  /** Creates transport orders from warehouse to a production building for a waiting job. */
  createInboundTransports(params: {
    readonly companyId: CompanyId;
    readonly destinationBuilding: Building;
    readonly recipe: RecipeDefinition;
    readonly productionJobId: string;
  }): Result<void, ValidationError> {
    const warehouse = this.findActiveWarehouse(params.companyId);

    if (warehouse === undefined) {
      return Result.fail(new ValidationError('No active warehouse is available for transport.'));
    }

    this.ensureStorageForBuilding(warehouse);
    const storage = this.#buildingStorageRepository.findByBuildingId(warehouse.getId());

    if (storage === undefined) {
      return Result.fail(new ValidationError('Warehouse storage was not initialized.'));
    }

    for (const input of params.recipe.inputs) {
      const orderId = `transport_${params.productionJobId}_${input.resource}`;
      const orderIdResult = createTransportOrderId(orderId);

      if (!orderIdResult.ok) {
        return Result.fail(orderIdResult.error);
      }

      if (this.#transportOrderRepository.findById(orderIdResult.value) !== undefined) {
        return Result.fail(new ValidationError(`Transport order id "${orderId}" already exists.`));
      }

      const reserveResult = storage.reserveQuantity(input.resource, input.amount);

      if (!reserveResult.ok) {
        return Result.fail(reserveResult.error);
      }

      const orderResult = TransportOrder.create({
        id: orderIdResult.value,
        companyId: params.companyId,
        sourceBuildingId: warehouse.getId(),
        destinationBuildingId: params.destinationBuilding.getId(),
        resourceId: input.resource,
        amount: input.amount,
        duration: DEFAULT_TRANSPORT_DURATION,
        productionJobId: params.productionJobId,
        clock: this.#clock,
      });

      if (!orderResult.ok) {
        storage.consumeReserved(input.resource, input.amount);
        return Result.fail(orderResult.error);
      }

      const order = orderResult.value;
      this.#transportOrderRepository.save(order);
      this.#buildingStorageRepository.save(storage);
      this.#enqueueEvents(order.pullDomainEvents());
    }

    return Result.ok(undefined);
  }

  /** Delivers transported resources and starts the linked production job. */
  completeTransportOrder(order: TransportOrder): Result<void, ValidationError> {
    const storage = this.#buildingStorageRepository.findByBuildingId(order.getSourceBuildingId());

    if (storage === undefined) {
      return Result.fail(new ValidationError('Warehouse storage was not found for transport.'));
    }

    const consumeResult = storage.consumeReserved(order.getResourceId(), order.getAmount());

    if (!consumeResult.ok) {
      return Result.fail(consumeResult.error);
    }

    const inventory = this.#inventoryRepository.findByCompanyId(order.getCompanyId());

    if (inventory === undefined) {
      return Result.fail(new ValidationError('Company inventory was not found.'));
    }

    const addResult = inventory.addQuantity(order.getResourceId(), order.getAmount(), this.#clock);

    if (!addResult.ok) {
      return Result.fail(addResult.error);
    }

    this.#buildingStorageRepository.save(storage);
    this.#inventoryRepository.save(inventory);
    this.#enqueueEvents(inventory.pullDomainEvents());

    const pendingTransports = this.#transportOrderRepository
      .findByProductionJobId(order.getProductionJobId())
      .filter((entry) => entry.getStatus() === TransportOrderStatus.IN_PROGRESS);

    if (pendingTransports.length > 0) {
      return Result.ok(undefined);
    }

    const jobIdResult = createProductionJobId(order.getProductionJobId());

    if (!jobIdResult.ok) {
      return Result.fail(jobIdResult.error);
    }

    const job = this.#productionJobRepository.findById(jobIdResult.value);

    if (job === undefined) {
      return Result.fail(
        new ValidationError(`Production job "${order.getProductionJobId()}" was not found.`),
      );
    }

    if (job.getStatus() !== ProductionJobStatus.WAITING) {
      return Result.ok(undefined);
    }

    const recipe = this.#gameContent.recipes.get(job.getRecipeId().value);

    if (recipe === undefined) {
      return Result.fail(new ValidationError(`Recipe "${job.getRecipeId().value}" was not found.`));
    }

    const reserveResult = this.#productionInventoryService.reserveInputs(job.getCompanyId(), recipe);

    if (!reserveResult.ok) {
      return Result.fail(reserveResult.error);
    }

    const startResult = job.start(this.#clock);

    if (!startResult.ok) {
      this.#productionInventoryService.releaseInputs(job.getCompanyId(), recipe);
      return Result.fail(startResult.error);
    }

    this.#productionJobRepository.save(job);
    this.#enqueueEvents(job.pullDomainEvents());

    return Result.ok(undefined);
  }
}
