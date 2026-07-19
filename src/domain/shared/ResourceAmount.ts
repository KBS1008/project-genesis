/**
 * @module @domain/shared/ResourceAmount
 *
 * Immutable pairing of a resource type and a non-negative amount.
 */

import { ValueObject } from '../../common/core/ValueObject.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { Quantity } from './Quantity.js';
import { createResourceTypeId, type ResourceTypeId } from './ResourceTypeId.js';

/**
 * Immutable amount of a specific resource type.
 */
export class ResourceAmount extends ValueObject {
  readonly resourceId: ResourceTypeId;
  readonly quantity: Quantity;

  private constructor(resourceId: ResourceTypeId, quantity: Quantity) {
    super();
    this.resourceId = resourceId;
    this.quantity = quantity;
    Object.freeze(this);
  }

  /**
   * Creates a validated resource amount.
   *
   * @param resourceId - Global resource type identifier.
   * @param amount - Non-negative amount of the resource.
   */
  static create(resourceId: string, amount: number): Result<ResourceAmount, ValidationError> {
    const resourceIdResult = createResourceTypeId(resourceId);

    if (!resourceIdResult.ok) {
      return Result.fail(resourceIdResult.error);
    }

    const quantityResult = Quantity.create(amount);

    if (!quantityResult.ok) {
      return Result.fail(quantityResult.error);
    }

    return Result.ok(new ResourceAmount(resourceIdResult.value, quantityResult.value));
  }

  /** Numeric amount for convenience when interacting with recipes and inventory. */
  get amount(): number {
    return this.quantity.value;
  }

  protected getEqualityComponents(): readonly unknown[] {
    return [this.resourceId.value, this.quantity.value];
  }
}
