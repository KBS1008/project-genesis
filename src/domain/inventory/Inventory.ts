/**
 * @module @domain/inventory/Inventory
 *
 * Inventory aggregate managing company resource stock.
 *
 * @see docs/schemas/Inventory.Schema.md
 */

import { AggregateRoot } from '../../common/core/AggregateRoot.js';
import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { Guard } from '../../common/validation/Guard.js';
import type { CompanyId } from '../company/CompanyId.js';
import { createResourceTypeId, type ResourceTypeId } from '../shared/ResourceTypeId.js';
import type { InventoryId } from './InventoryId.js';
import { InventoryStatus } from './InventoryStatus.js';
import { getAvailableQuantity, type InventoryItem } from './InventoryItem.js';
import { InventoryChanged } from './events/InventoryChanged.js';

/** Parameters required to create a new inventory. */
export type CreateInventoryParams = {
  readonly id: InventoryId;
  readonly companyId: CompanyId;
  readonly clock: Clock;
};

/**
 * Company inventory aggregate root.
 */
export class Inventory extends AggregateRoot<'Inventory'> {
  readonly #companyId: CompanyId;
  readonly #createdAt: number;
  readonly #status: InventoryStatus;
  readonly #items = new Map<string, InventoryItem>();

  private constructor(params: {
    id: InventoryId;
    companyId: CompanyId;
    createdAt: number;
  }) {
    super(params.id);
    this.#companyId = params.companyId;
    this.#createdAt = params.createdAt;
    this.#status = InventoryStatus.ACTIVE;
  }

  /**
   * Creates a new empty inventory for a company.
   */
  static create(params: CreateInventoryParams): Result<Inventory, ValidationError> {
    return Result.ok(
      new Inventory({
        id: params.id,
        companyId: params.companyId,
        createdAt: params.clock.now(),
      }),
    );
  }

  /** The owning company identifier. */
  getCompanyId(): CompanyId {
    return this.#companyId;
  }

  /** Simulation time when the inventory was created. */
  getCreatedAt(): number {
    return this.#createdAt;
  }

  /** Current inventory lifecycle status. */
  getStatus(): InventoryStatus {
    return this.#status;
  }

  /** Returns all inventory items in deterministic resource id order. */
  getItems(): readonly InventoryItem[] {
    return Object.freeze(
      [...this.#items.values()].sort((left, right) =>
        left.resourceId.value.localeCompare(right.resourceId.value),
      ),
    );
  }

  /** Returns one inventory item or undefined when the resource is not stocked. */
  getItem(resourceId: ResourceTypeId): InventoryItem | undefined {
    return this.#items.get(resourceId.value);
  }

  /** Returns available quantity for a resource. */
  getAvailableQuantity(resourceId: ResourceTypeId): number {
    const item = this.#items.get(resourceId.value);
    return item === undefined ? 0 : getAvailableQuantity(item);
  }

  /**
   * Adds quantity to a resource line.
   *
   * @param resourceId - Resource type identifier.
   * @param amount - Non-negative amount to add.
   * @param clock - Clock providing deterministic event time.
   */
  addQuantity(
    resourceId: string,
    amount: number,
    clock: Clock,
  ): Result<void, ValidationError> {
    const amountResult = Guard.againstNegative(amount, 'Added inventory amount must not be negative.');

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    if (amountResult.value === 0) {
      return Result.ok(undefined);
    }

    const resourceIdResult = createResourceTypeId(resourceId);

    if (!resourceIdResult.ok) {
      return Result.fail(resourceIdResult.error);
    }

    const resourceTypeId = resourceIdResult.value;
    const existing = this.#items.get(resourceTypeId.value);
    const nextQuantity = (existing?.quantity ?? 0) + amountResult.value;
    const nextReserved = existing?.reserved ?? 0;
    const nextItem: InventoryItem = Object.freeze({
      resourceId: resourceTypeId,
      quantity: nextQuantity,
      reserved: nextReserved,
    });

    this.#items.set(resourceTypeId.value, nextItem);
    this.#recordChange(nextItem, clock);

    return Result.ok(undefined);
  }

  /**
   * Reserves available quantity for downstream production or transport flows.
   *
   * @param resourceId - Resource type identifier.
   * @param amount - Non-negative amount to reserve.
   * @param clock - Clock providing deterministic event time.
   */
  reserveQuantity(
    resourceId: string,
    amount: number,
    clock: Clock,
  ): Result<void, ValidationError> {
    const amountResult = Guard.againstNegative(amount, 'Reserved inventory amount must not be negative.');

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    if (amountResult.value === 0) {
      return Result.ok(undefined);
    }

    const resourceIdResult = createResourceTypeId(resourceId);

    if (!resourceIdResult.ok) {
      return Result.fail(resourceIdResult.error);
    }

    const resourceTypeId = resourceIdResult.value;
    const existing = this.#items.get(resourceTypeId.value);

    if (existing === undefined || getAvailableQuantity(existing) < amountResult.value) {
      return Result.fail(
        new ValidationError(
          `Insufficient available quantity for resource "${resourceTypeId.value}".`,
        ),
      );
    }

    const nextItem: InventoryItem = Object.freeze({
      resourceId: resourceTypeId,
      quantity: existing.quantity,
      reserved: existing.reserved + amountResult.value,
    });

    this.#items.set(resourceTypeId.value, nextItem);
    this.#recordChange(nextItem, clock);

    return Result.ok(undefined);
  }

  #recordChange(item: InventoryItem, clock: Clock): void {
    this.addDomainEvent(
      new InventoryChanged(
        clock.now(),
        this.getId().value,
        this.#companyId.value,
        item.resourceId.value,
        item.quantity,
        item.reserved,
      ),
    );
  }
}

/** Creates a validated inventory identifier from a raw string. */
export function createInventoryId(rawValue: string): Result<InventoryId, ValidationError> {
  const result = Identifier.create<InventoryId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
