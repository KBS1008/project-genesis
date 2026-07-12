/**
 * @module @domain/building/BuildingStorage
 *
 * Per-building resource storage used by warehouse hubs and transport delivery.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { Guard } from '../../common/validation/Guard.js';
import type { BuildingId } from './BuildingId.js';
import type { CompanyId } from '../company/CompanyId.js';

type StorageLine = {
  quantity: number;
  reserved: number;
};

/** Resource stock held at one building. */
export class BuildingStorage {
  readonly #buildingId: BuildingId;
  readonly #companyId: CompanyId;
  readonly #items = new Map<string, StorageLine>();

  constructor(buildingId: BuildingId, companyId: CompanyId) {
    this.#buildingId = buildingId;
    this.#companyId = companyId;
  }

  getBuildingId(): BuildingId {
    return this.#buildingId;
  }

  getCompanyId(): CompanyId {
    return this.#companyId;
  }

  getAvailable(resourceId: string): number {
    const line = this.#items.get(resourceId);
    return line === undefined ? 0 : Math.max(0, line.quantity - line.reserved);
  }

  getQuantity(resourceId: string): number {
    return this.#items.get(resourceId)?.quantity ?? 0;
  }

  getReserved(resourceId: string): number {
    return this.#items.get(resourceId)?.reserved ?? 0;
  }

  getLines(): readonly { readonly resourceId: string; readonly quantity: number; readonly reserved: number }[] {
    return Object.freeze(
      [...this.#items.entries()]
        .map(([resourceId, line]) =>
          Object.freeze({ resourceId, quantity: line.quantity, reserved: line.reserved }),
        )
        .sort((left, right) => left.resourceId.localeCompare(right.resourceId)),
    );
  }

  addQuantity(resourceId: string, amount: number): Result<void, ValidationError> {
    const amountResult = Guard.againstNegative(amount, 'Storage amount must not be negative.');

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    if (amountResult.value === 0) {
      return Result.ok(undefined);
    }

    const line = this.#items.get(resourceId) ?? { quantity: 0, reserved: 0 };
    line.quantity += amountResult.value;
    this.#items.set(resourceId, line);

    return Result.ok(undefined);
  }

  reserveQuantity(resourceId: string, amount: number): Result<void, ValidationError> {
    const amountResult = Guard.againstNegative(amount, 'Reserve amount must not be negative.');

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    if (this.getAvailable(resourceId) < amountResult.value) {
      return Result.fail(
        new ValidationError(`Insufficient storage for resource "${resourceId}" at building.`),
      );
    }

    const line = this.#items.get(resourceId) ?? { quantity: 0, reserved: 0 };
    line.reserved += amountResult.value;
    this.#items.set(resourceId, line);

    return Result.ok(undefined);
  }

  consumeReserved(resourceId: string, amount: number): Result<void, ValidationError> {
    const amountResult = Guard.againstNegative(amount, 'Consume amount must not be negative.');

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    const line = this.#items.get(resourceId);

    if (line === undefined || line.reserved < amountResult.value || line.quantity < amountResult.value) {
      return Result.fail(
        new ValidationError(`Cannot consume reserved resource "${resourceId}" from building storage.`),
      );
    }

    line.quantity -= amountResult.value;
    line.reserved -= amountResult.value;

    if (line.quantity === 0 && line.reserved === 0) {
      this.#items.delete(resourceId);
    } else {
      this.#items.set(resourceId, line);
    }

    return Result.ok(undefined);
  }

  /** Rehydrates storage lines from a persisted snapshot. */
  static restore(params: {
    readonly buildingId: BuildingId;
    readonly companyId: CompanyId;
    readonly items: readonly { readonly resourceId: string; readonly quantity: number; readonly reserved: number }[];
  }): BuildingStorage {
    const storage = new BuildingStorage(params.buildingId, params.companyId);

    for (const item of params.items) {
      storage.#items.set(item.resourceId, {
        quantity: item.quantity,
        reserved: item.reserved,
      });
    }

    return storage;
  }
}
