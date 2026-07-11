/**
 * @module @common/validation/Guard
 *
 * Shared validation helpers for Project Genesis.
 *
 * Guards return explicit {@link Result} values instead of throwing
 * for expected validation failures.
 */

import { ValidationError } from '../errors/ValidationError.js';
import { Result } from '../result/Result.js';

/**
 * Validation guard utilities.
 */
export const Guard = {
  /**
   * Rejects `null` and `undefined` values.
   *
   * @typeParam TValue - The expected non-nullish value type.
   * @param value - The value to validate.
   * @param message - Error message when validation fails.
   * @returns A result containing the value or a validation error.
   */
  againstNull<TValue>(
    value: TValue | null | undefined,
    message: string,
  ): Result<TValue, ValidationError> {
    if (value === null || value === undefined) {
      return Result.fail(new ValidationError(message));
    }

    return Result.ok(value);
  },

  /**
   * Rejects empty strings.
   *
   * @param value - The string to validate.
   * @param message - Error message when validation fails.
   * @returns A result containing the string or a validation error.
   */
  againstEmptyString(
    value: string,
    message: string,
  ): Result<string, ValidationError> {
    if (value.length === 0) {
      return Result.fail(new ValidationError(message));
    }

    return Result.ok(value);
  },

  /**
   * Rejects negative numbers.
   *
   * Zero is allowed.
   *
   * @param value - The number to validate.
   * @param message - Error message when validation fails.
   * @returns A result containing the number or a validation error.
   */
  againstNegative(value: number, message: string): Result<number, ValidationError> {
    if (value < 0) {
      return Result.fail(new ValidationError(message));
    }

    return Result.ok(value);
  },
} as const;
