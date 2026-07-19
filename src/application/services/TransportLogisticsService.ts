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
import type { BuildingId } from '../../domain/building/BuildingId.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { Inventory } from '../../domain/inventory/Inventory.js';
import type { InventoryRepository } from '../../domain/inventory/InventoryRepository.js';
import type { ProductionJobRepository } from '../../domain/production/ProductionJobRepository.js';
import { ProductionJobStatus } from '../../domain/production/ProductionJobStatus.js';
import { RegionConnectivityPolicy } from '../../domain/policies/world/RegionConnectivityPolicy.js';
import type { RegionRepository } from '../../domain/region/RegionRepository.js';
import { TransportOrderStatus } from '../../domain/transport/TransportOrderStatus.js';
import { DEFAULT_MAP_ID } from '../../domain/world/WorldConstants.js';
import type { WorldMapRepository } from '../../domain/world/WorldMapRepository.js';
import { createWorldMapId } from '../../domain/world/WorldMapId.js';
import { createProductionJobId } from '../../domain/production/ProductionJob.js';
import { TransportOrder } from '../../domain/transport/TransportOrder.js';
import { createTransportOrderId } from '../../domain/transport/TransportOrderId.js';
import type { TransportOrderRepository } from '../../domain/transport/TransportOrderRepository.js';
import type { ProductionInventoryService } from './ProductionInventoryService.js';
import { createResourceTypeId } from '../../domain/shared/ResourceTypeId.js';
import {
  FALLBACK_TRANSPORT_DURATION_TICKS,
  FALLBACK_TRANSPORT_THROUGHPUT_CAPACITY,
  TransportRouteDurationPolicy,
  type ResolvedTransportRoute,
} from '../../domain/policies/transport/TransportRouteDurationPolicy.js';
import { RegionalTransportRoutePolicy } from '../../domain/policies/transport/RegionalTransportRoutePolicy.js';
import { TransportNetworkThroughputPolicy } from '../../domain/policies/transport/TransportNetworkThroughputPolicy.js';

/** Documented fallback when no content route matches a building pair. */
export const DEFAULT_TRANSPORT_DURATION = FALLBACK_TRANSPORT_DURATION_TICKS;

export type TransportLogisticsServiceDependencies = {
  readonly clock: Clock;
  readonly buildingRepository: BuildingRepository;
  readonly regionRepository: RegionRepository;
  readonly worldMapRepository: WorldMapRepository;
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
  readonly #regionRepository: TransportLogisticsServiceDependencies['regionRepository'];
  readonly #worldMapRepository: TransportLogisticsServiceDependencies['worldMapRepository'];
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
    this.#regionRepository = dependencies.regionRepository;
    this.#worldMapRepository = dependencies.worldMapRepository;
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
    return this.#buildingRepository.findByCompanyId(companyId).find((building) => {
      if (building.getStatus() !== BuildingStatus.ACTIVE) {
        return false;
      }

      const buildingType = this.#gameContent.buildingTypes.get(building.getBuildingTypeId().value);
      return buildingType?.category === BuildingCategory.STORAGE;
    });
  }

  /** Resolves inbound warehouse→destination duration from content routes (fallback when unknown). */
  resolveInboundTransportDurationTicks(
    companyId: CompanyId,
    destinationBuildingId: BuildingId,
  ): number {
    const warehouse = this.findActiveWarehouse(companyId);
    const destination = this.#buildingRepository.findById(destinationBuildingId);

    if (warehouse === undefined || destination === undefined) {
      return FALLBACK_TRANSPORT_DURATION_TICKS;
    }

    const durationResult = this.#resolveTransportDuration(warehouse, destination);

    return durationResult.ok ? durationResult.value : FALLBACK_TRANSPORT_DURATION_TICKS;
  }

  /** Ensures a storage record exists when a storage building becomes active. */
  ensureStorageForBuilding(building: Building): void {
    const buildingType = this.#gameContent.buildingTypes.get(building.getBuildingTypeId().value);

    if (buildingType?.category !== BuildingCategory.STORAGE) {
      return;
    }

    const existing = this.#buildingStorageRepository.findByBuildingId(building.getId());

    if (existing !== undefined) {
      existing.syncStorageCapacity(buildingType.storageCapacity);
      this.#buildingStorageRepository.save(existing);
      return;
    }

    this.#buildingStorageRepository.save(
      new BuildingStorage(building.getId(), building.getCompanyId(), buildingType.storageCapacity),
    );
  }

  /** Returns whether a warehouse can accept additional units. */
  canDepositToWarehouse(companyId: CompanyId, amount: number): boolean {
    if (amount <= 0) {
      return true;
    }

    const warehouse = this.findActiveWarehouse(companyId);

    if (warehouse === undefined) {
      return true;
    }

    this.ensureStorageForBuilding(warehouse);
    const storage = this.#buildingStorageRepository.findByBuildingId(warehouse.getId());

    return storage !== undefined && storage.getAvailableCapacity() >= amount;
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

    const durationResult = this.#resolveTransportRoute(warehouse, params.destinationBuilding);

    if (!durationResult.ok) {
      return Result.fail(durationResult.error);
    }

    const resolvedRoute = durationResult.value;

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
        duration: resolvedRoute.durationTicks,
        routeId: resolvedRoute.routeId,
        productionJobId: params.productionJobId,
        sourceRegionId: warehouse.getRegionId().value,
        destinationRegionId: params.destinationBuilding.getRegionId().value,
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

    this.dispatchPendingTransports();

    return Result.ok(undefined);
  }

  /** Promotes waiting transport orders when abstract route throughput allows. */
  dispatchPendingTransports(): void {
    const orderSnapshots = this.#collectThroughputSnapshots();
    const waitingOrders = [...this.#transportOrderRepository.findWaiting()].sort((left, right) => {
      const routeCompare = (left.getRouteId() ?? '').localeCompare(right.getRouteId() ?? '');

      if (routeCompare !== 0) {
        return routeCompare;
      }

      const sourceRegionCompare = left.getSourceRegionId().localeCompare(right.getSourceRegionId());

      if (sourceRegionCompare !== 0) {
        return sourceRegionCompare;
      }

      const destinationRegionCompare = left
        .getDestinationRegionId()
        .localeCompare(right.getDestinationRegionId());

      if (destinationRegionCompare !== 0) {
        return destinationRegionCompare;
      }

      return left.getCreatedAt() - right.getCreatedAt();
    });

    for (const order of waitingOrders) {
      const throughputCapacity = this.#resolveThroughputCapacity(order.getRouteId());
      const activeCount = TransportNetworkThroughputPolicy.countActiveOnRoute(
        orderSnapshots,
        order.getRouteId(),
      );

      if (!TransportNetworkThroughputPolicy.canDispatch(activeCount, throughputCapacity)) {
        continue;
      }

      const dispatchResult = order.dispatch(this.#clock);

      if (!dispatchResult.ok) {
        continue;
      }

      this.#transportOrderRepository.save(order);
      this.#enqueueEvents(order.pullDomainEvents());
      orderSnapshots.push({
        routeId: order.getRouteId(),
        status: order.getStatus(),
        createdAt: order.getCreatedAt(),
      });
    }
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
      .filter(
        (entry) =>
          entry.getStatus() === TransportOrderStatus.IN_PROGRESS ||
          entry.getStatus() === TransportOrderStatus.WAITING,
      );

    if (pendingTransports.length > 0) {
      this.dispatchPendingTransports();
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

    const reserveResult = this.#productionInventoryService.reserveInputs(
      job.getCompanyId(),
      recipe,
    );

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

  #collectThroughputSnapshots() {
    return [
      ...this.#transportOrderRepository.findInProgress(),
      ...this.#transportOrderRepository.findWaiting(),
    ].map((order) =>
      Object.freeze({
        routeId: order.getRouteId(),
        status: order.getStatus(),
        createdAt: order.getCreatedAt(),
      }),
    );
  }

  #resolveThroughputCapacity(routeId: string | null): number {
    if (routeId === null) {
      return FALLBACK_TRANSPORT_THROUGHPUT_CAPACITY;
    }

    const baseRouteId = routeId.includes('::') ? (routeId.split('::')[0] ?? routeId) : routeId;
    const route = this.#gameContent.transportRoutes.get(baseRouteId);

    return route?.throughputCapacity ?? FALLBACK_TRANSPORT_THROUGHPUT_CAPACITY;
  }

  #resolveTransportRoute(
    sourceBuilding: Building,
    destinationBuilding: Building,
  ): Result<ResolvedTransportRoute, ValidationError> {
    const sourceType = this.#gameContent.buildingTypes.get(
      sourceBuilding.getBuildingTypeId().value,
    );
    const destinationType = this.#gameContent.buildingTypes.get(
      destinationBuilding.getBuildingTypeId().value,
    );

    if (sourceType === undefined || destinationType === undefined) {
      return Result.fail(
        new ValidationError('Building type was not found for transport route resolution.'),
      );
    }

    const sourceRegion = this.#regionRepository.findById(sourceBuilding.getRegionId());
    const destinationRegion = this.#regionRepository.findById(destinationBuilding.getRegionId());

    if (sourceRegion === undefined) {
      return Result.fail(
        new ValidationError(
          `Region id "${sourceBuilding.getRegionId().value}" for source building was not found.`,
        ),
      );
    }

    if (destinationRegion === undefined) {
      return Result.fail(
        new ValidationError(
          `Region id "${destinationBuilding.getRegionId().value}" for destination building was not found.`,
        ),
      );
    }

    const baseRoute = TransportRouteDurationPolicy.resolve({
      routes: this.#gameContent.transportRoutes.getAll(),
      sourceBuildingTypeId: sourceBuilding.getBuildingTypeId().value,
      destinationBuildingTypeId: destinationBuilding.getBuildingTypeId().value,
      sourceCategory: sourceType.category,
      destinationCategory: destinationType.category,
    });

    const mapDistanceResult = this.#resolveMapDistance(sourceBuilding, destinationBuilding);

    if (!mapDistanceResult.ok) {
      return mapDistanceResult;
    }

    return RegionalTransportRoutePolicy.resolve({
      baseRoute,
      sourceRegionId: sourceRegion.getId().value,
      destinationRegionId: destinationRegion.getId().value,
      mapDistance: mapDistanceResult.value,
      sourceTransportDurationModifier: this.#resolveTransportDurationModifier(
        sourceRegion.getBiomeId(),
      ),
      destinationTransportDurationModifier: this.#resolveTransportDurationModifier(
        destinationRegion.getBiomeId(),
      ),
    });
  }

  #resolveMapDistance(
    sourceBuilding: Building,
    destinationBuilding: Building,
  ): Result<number, ValidationError> {
    if (sourceBuilding.getRegionId().equals(destinationBuilding.getRegionId())) {
      return Result.ok(0);
    }

    const mapIdResult = createWorldMapId(DEFAULT_MAP_ID);

    if (!mapIdResult.ok) {
      return Result.fail(mapIdResult.error);
    }

    const worldMap = this.#worldMapRepository.findById(mapIdResult.value);

    if (worldMap === undefined) {
      return Result.fail(
        new ValidationError(`Default world map "${DEFAULT_MAP_ID}" was not bootstrapped.`),
      );
    }

    return RegionConnectivityPolicy.resolveDistance({
      map: worldMap,
      fromRegionId: sourceBuilding.getRegionId(),
      toRegionId: destinationBuilding.getRegionId(),
    });
  }

  #resolveTransportDurationModifier(biomeId: string): number {
    return this.#gameContent.biomes.get(biomeId)?.transportDurationModifier ?? 1;
  }

  #resolveTransportDuration(
    sourceBuilding: Building,
    destinationBuilding: Building,
  ): Result<number, ValidationError> {
    const routeResult = this.#resolveTransportRoute(sourceBuilding, destinationBuilding);

    if (!routeResult.ok) {
      return routeResult;
    }

    return Result.ok(routeResult.value.durationTicks);
  }
}
