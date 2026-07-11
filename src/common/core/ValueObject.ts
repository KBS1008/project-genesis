/**
 * @module @common/core/ValueObject
 *
 * Base class for immutable domain values compared by structure in Project Genesis.
 *
 * @see docs/architecture/DDD.md
 */

/**
 * Base class for immutable objects compared by value rather than identity.
 *
 * Subclasses define their structural components through
 * {@link ValueObject.getEqualityComponents}. Two value objects of the same
 * concrete type are equal when all components are strictly equal.
 *
 * @example
 * ```typescript
 * class Money extends ValueObject {
 *   constructor(
 *     readonly amount: number,
 *     readonly currency: string,
 *   ) {
 *     super();
 *     Object.freeze(this);
 *   }
 *
 *   protected getEqualityComponents(): readonly unknown[] {
 *     return [this.amount, this.currency];
 *   }
 * }
 * ```
 */
export abstract class ValueObject {
  /**
   * Compares this value object with another by structural equality.
   *
   * Returns `false` for `null`, `undefined`, different types, or
   * value objects of a different concrete class.
   *
   * @param other - The value to compare against.
   * @returns `true` when both objects share equal components.
   */
  equals(other: unknown): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (other.constructor !== this.constructor) {
      return false;
    }

    if (!(other instanceof ValueObject)) {
      return false;
    }

    const left = this.getEqualityComponents();
    const right = other.getEqualityComponents();

    if (left.length !== right.length) {
      return false;
    }

    return left.every((component, index) => component === right[index]);
  }

  /**
   * Returns the ordered components used for structural equality.
   */
  protected abstract getEqualityComponents(): readonly unknown[];
}
