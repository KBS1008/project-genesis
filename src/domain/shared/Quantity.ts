/**
 * @module @domain/shared/Quantity
 *
 * Immutable non-negative quantity value.
 */

import { ValueObject } from '../../common/core/ValueObject.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { Guard } from '../../common/validation/Guard.js';

/**
 * Immutable quantity representing a non-negative count.
 */
export class Quantity extends ValueObject {
  readonly value: number;

  private constructor(value: number) {
    super();
    this.value = value;
    Object.freeze(this);
  }

  /**
   * Creates a validated quantity.
   *
   * @param value - Non-negative quantity.
   */
  static create(value: number): Result<Quantity, ValidationError> {
    const valueResult = Guard.againstNegative(value, 'Quantity must not be negative.');

    if (!valueResult.ok) {
      return Result.fail(valueResult.error);
    }

    return Result.ok(new Quantity(valueResult.value));
  }

  /** Returns a zero quantity. */
  static zero(): Quantity {
    return new Quantity(0);
  }

  protected getEqualityComponents(): readonly unknown[] {
    return [this.value];
  }
}
