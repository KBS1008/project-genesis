/**
 * @module @domain/shared/Capacity
 *
 * Immutable non-negative capacity limit for building and storage models.
 *
 * @see docs/decisions/DD-021-Unified-Building-Capacity-Model.md
 */

import { ValueObject } from '../../common/core/ValueObject.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { Guard } from '../../common/validation/Guard.js';

/**
 * Immutable maximum capacity value.
 *
 * Unused capacity dimensions use zero per DD-021.
 */
export class Capacity extends ValueObject {
  readonly value: number;

  private constructor(value: number) {
    super();
    this.value = value;
    Object.freeze(this);
  }

  /**
   * Creates a validated capacity.
   *
   * @param value - Non-negative capacity limit.
   */
  static create(value: number): Result<Capacity, ValidationError> {
    const valueResult = Guard.againstNegative(value, 'Capacity must not be negative.');

    if (!valueResult.ok) {
      return Result.fail(valueResult.error);
    }

    return Result.ok(new Capacity(valueResult.value));
  }

  /** Returns zero capacity for unused building capacity dimensions. */
  static zero(): Capacity {
    return new Capacity(0);
  }

  protected getEqualityComponents(): readonly unknown[] {
    return [this.value];
  }
}
