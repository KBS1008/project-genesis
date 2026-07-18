/**
 * @module @common/validation/Guard
 *
 * Shared validation helpers for Project Genesis.
 *
 * Guards return explicit {@link Result} values instead of throwing
 * for expected validation failures.
 *
 * @see docs/architecture/VALIDATION_STRATEGY.md
 */

import { ValidationError } from '../errors/ValidationError.js';
import { Result } from '../result/Result.js';

/** Options for guard validation failures. */
export type GuardValidationOptions = {
  readonly field?: string | undefined;
  readonly constraint?: string | undefined;
  readonly value?: unknown;
};

function createValidationError(
  message: string,
  options: GuardValidationOptions,
  defaultConstraint: string,
  value: unknown,
): ValidationError {
  const validationOptions: {
    field?: string;
    constraint?: string;
    value?: unknown;
  } = {
    constraint: options.constraint ?? defaultConstraint,
    value: options.value ?? value,
  };

  if (options.field !== undefined) {
    validationOptions.field = options.field;
  }

  return new ValidationError(message, validationOptions);
}

/**
 * Validation guard utilities.
 */
export const Guard = {
  /**
   * Rejects `null` and `undefined` values.
   */
  againstNull<TValue>(
    value: TValue | null | undefined,
    message: string,
    options: GuardValidationOptions = {},
  ): Result<TValue, ValidationError> {
    if (value === null || value === undefined) {
      return Result.fail(
        createValidationError(message, options, 'required', value),
      );
    }

    return Result.ok(value);
  },

  /**
   * Rejects empty strings.
   */
  againstEmptyString(
    value: string,
    message: string,
    options: GuardValidationOptions = {},
  ): Result<string, ValidationError> {
    if (value.length === 0) {
      return Result.fail(createValidationError(message, options, 'nonEmpty', value));
    }

    return Result.ok(value);
  },

  /**
   * Rejects negative numbers.
   *
   * Zero is allowed.
   */
  againstNegative(
    value: number,
    message: string,
    options: GuardValidationOptions = {},
  ): Result<number, ValidationError> {
    if (value < 0) {
      return Result.fail(createValidationError(message, options, 'value >= 0', value));
    }

    return Result.ok(value);
  },

  /**
   * Rejects zero and negative numbers.
   */
  againstZeroOrNegative(
    value: number,
    message: string,
    options: GuardValidationOptions = {},
  ): Result<number, ValidationError> {
    if (value <= 0) {
      return Result.fail(createValidationError(message, options, 'value > 0', value));
    }

    return Result.ok(value);
  },
} as const;
