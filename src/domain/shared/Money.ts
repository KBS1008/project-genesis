/**
 * @module @domain/shared/Money
 *
 * Immutable monetary amount with currency.
 */

import { ValueObject } from '../../common/core/ValueObject.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
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

  protected getEqualityComponents(): readonly unknown[] {
    return [this.amount, this.currency];
  }
}
