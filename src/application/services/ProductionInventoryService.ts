/**
 * @module @application/services/ProductionInventoryService
 *
 * Coordinates inventory reservations and deliveries for production jobs.
 */

import type { DomainEvent } from '../../common/events/DomainEvent.js';
import type { RecipeDefinition } from '../../content/recipe/RecipeDefinition.js';
import type { RecipeRegistry } from '../../content/recipe/RecipeRegistry.js';
import type { Clock } from '../../common/time/Clock.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { Inventory } from '../../domain/inventory/Inventory.js';
import type { InventoryRepository } from '../../domain/inventory/InventoryRepository.js';
import type { ProductionJob } from '../../domain/production/ProductionJob.js';

/** Dependencies for {@link ProductionInventoryService}. */
export type ProductionInventoryServiceDependencies = {
  readonly inventoryRepository: InventoryRepository;
  readonly recipes: RecipeRegistry;
  readonly clock: Clock;
  readonly enqueueEvents: (events: readonly DomainEvent[]) => void;
};

/**
 * Applies inventory changes for production input reservation and completion.
 */
export class ProductionInventoryService {
  readonly #inventoryRepository: ProductionInventoryServiceDependencies['inventoryRepository'];
  readonly #recipes: ProductionInventoryServiceDependencies['recipes'];
  readonly #clock: ProductionInventoryServiceDependencies['clock'];
  readonly #enqueueEvents: ProductionInventoryServiceDependencies['enqueueEvents'];

  /**
   * @param dependencies - Repositories and callbacks required for inventory updates.
   */
  constructor(dependencies: ProductionInventoryServiceDependencies) {
    this.#inventoryRepository = dependencies.inventoryRepository;
    this.#recipes = dependencies.recipes;
    this.#clock = dependencies.clock;
    this.#enqueueEvents = dependencies.enqueueEvents;
  }

  /**
   * Reserves recipe inputs in the company inventory.
   */
  reserveInputs(companyId: CompanyId, recipe: RecipeDefinition): Result<void, ValidationError> {
    const inventoryResult = this.#findInventory(companyId);

    if (!inventoryResult.ok) {
      return Result.fail(inventoryResult.error);
    }

    const inventory = inventoryResult.value;
    const reservedInputs: { resource: string; amount: number }[] = [];

    for (const input of recipe.inputs) {
      const reserveResult = inventory.reserveQuantity(input.resource, input.amount, this.#clock);

      if (!reserveResult.ok) {
        this.#releaseInputs(inventory, reservedInputs);
        return Result.fail(reserveResult.error);
      }

      reservedInputs.push({ resource: input.resource, amount: input.amount });
    }

    this.#inventoryRepository.save(inventory);
    this.#enqueueEvents(inventory.pullDomainEvents());

    return Result.ok(undefined);
  }

  /**
   * Releases previously reserved recipe inputs without consuming stock.
   */
  releaseInputs(companyId: CompanyId, recipe: RecipeDefinition): Result<void, ValidationError> {
    const inventoryResult = this.#findInventory(companyId);

    if (!inventoryResult.ok) {
      return Result.fail(inventoryResult.error);
    }

    const inventory = inventoryResult.value;

    for (const input of recipe.inputs) {
      const releaseResult = inventory.releaseReserved(input.resource, input.amount, this.#clock);

      if (!releaseResult.ok) {
        return Result.fail(releaseResult.error);
      }
    }

    this.#inventoryRepository.save(inventory);
    this.#enqueueEvents(inventory.pullDomainEvents());

    return Result.ok(undefined);
  }

  /**
   * Consumes reserved inputs and adds recipe outputs when a job completes.
   */
  completeJob(job: ProductionJob): Result<void, ValidationError> {
    const recipe = this.#recipes.get(job.getRecipeId().value);

    if (recipe === undefined) {
      return Result.fail(
        new ValidationError(`Recipe id "${job.getRecipeId().value}" was not found.`),
      );
    }

    const inventoryResult = this.#findInventory(job.getCompanyId());

    if (!inventoryResult.ok) {
      return Result.fail(inventoryResult.error);
    }

    const inventory = inventoryResult.value;

    for (const input of recipe.inputs) {
      const consumeResult = inventory.consumeReserved(input.resource, input.amount, this.#clock);

      if (!consumeResult.ok) {
        return Result.fail(consumeResult.error);
      }
    }

    for (const output of recipe.outputs) {
      const addResult = inventory.addQuantity(output.resource, output.amount, this.#clock);

      if (!addResult.ok) {
        return Result.fail(addResult.error);
      }
    }

    this.#inventoryRepository.save(inventory);
    this.#enqueueEvents(inventory.pullDomainEvents());

    return Result.ok(undefined);
  }

  #findInventory(companyId: CompanyId): Result<Inventory, ValidationError> {
    const inventory = this.#inventoryRepository.findByCompanyId(companyId);

    if (inventory === undefined) {
      return Result.fail(
        new ValidationError(`Inventory for company "${companyId.value}" was not found.`),
      );
    }

    return Result.ok(inventory);
  }

  #releaseInputs(
    inventory: Inventory,
    reservedInputs: readonly { resource: string; amount: number }[],
  ): void {
    for (const input of reservedInputs) {
      inventory.releaseReserved(input.resource, input.amount, this.#clock);
    }

    if (reservedInputs.length > 0) {
      this.#inventoryRepository.save(inventory);
      this.#enqueueEvents(inventory.pullDomainEvents());
    }
  }
}
