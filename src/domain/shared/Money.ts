/**
 * @module @domain/shared/Money
 *
 * Immutable monetary amount with currency.
 */

import { ValueObject } from '../../common/core/ValueObject.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { Guard } from '../../common/validation/Guard.js';

/** Default in-game currency (Genesis Credits). */
export const DEFAULT_CURRENCY = 'GC';

/**
 * Immutable monetary value.
 */
export class Money extends ValueObject {
  readonly amount: number;
  readonly currency: string;

  private constructor(amount: number, currency: string) {
    super();
    this.amount = amount;
    this.currency = currency;
    Object.freeze(this);
  }

  /**
   * Creates a validated money value.
   *
   * @param amount - Non-negative monetary amount.
   * @param currency - Currency code. Defaults to {@link DEFAULT_CURRENCY}.
   */
  static create(
    amount: number,
    currency: string = DEFAULT_CURRENCY,
  ): Result<Money, ValidationError> {
    const amountResult = Guard.againstNegative(amount, 'Money amount must not be negative.');

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    const currencyResult = Guard.againstEmptyString(currency, 'Money currency must not be empty.');

    if (!currencyResult.ok) {
      return Result.fail(currencyResult.error);
    }

    return Result.ok(new Money(amountResult.value, currencyResult.value));
  }

  /** Returns a zero amount in the default currency. */
  static zero(currency: string = DEFAULT_CURRENCY): Result<Money, ValidationError> {
    return Money.create(0, currency);
  }

  /**
   * Adds another money value with the same currency.
   */
  add(other: Money): Result<Money, ValidationError> {
    const currencyCheck = this.#assertSameCurrency(other);

    if (!currencyCheck.ok) {
      return Result.fail(currencyCheck.error);
    }

    return Money.create(this.amount + other.amount, this.currency);
  }

  /**
   * Subtracts another money value with the same currency.
   */
  subtract(other: Money): Result<Money, ValidationError> {
    const currencyCheck = this.#assertSameCurrency(other);

    if (!currencyCheck.ok) {
      return Result.fail(currencyCheck.error);
    }

    if (this.amount < other.amount) {
      return Result.fail(new ValidationError('Money subtraction would result in a negative amount.'));
    }

    return Money.create(this.amount - other.amount, this.currency);
  }

  /** Returns whether this amount is greater than or equal to another amount in the same currency. */
  isGreaterThanOrEqual(other: Money): boolean {
    return this.currency === other.currency && this.amount >= other.amount;
  }

  /** Returns whether this amount is less than another amount in the same currency. */
  isLessThan(other: Money): boolean {
    return this.currency === other.currency && this.amount < other.amount;
  }

  #assertSameCurrency(other: Money): Result<void, ValidationError> {
    if (this.currency !== other.currency) {
      return Result.fail(
        new ValidationError(
          `Money currency mismatch: expected "${this.currency}" but received "${other.currency}".`,
        ),
      );
    }

    return Result.ok(undefined);
  }

  protected getEqualityComponents(): readonly unknown[] {
    return [this.amount, this.currency];
  }
}
