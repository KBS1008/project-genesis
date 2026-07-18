/**
 * @module @common/result/Result
 *
 * Generic result type for explicit success and failure handling in Project Genesis.
 *
 * Expected business failures are represented as values rather than thrown exceptions.
 *
 * @see docs/architecture/RESULT_PATTERN.md
 */

/**
 * Represents a successful or failed operation.
 *
 * @typeParam TValue - The type of the success value.
 * @typeParam TError - The type of the failure error. Defaults to {@link unknown}.
 */
export type Result<TValue, TError = unknown> =
  | { readonly ok: true; readonly value: TValue }
  | { readonly ok: false; readonly error: TError };

/**
 * Represents a successful {@link Result}.
 *
 * @typeParam TValue - The type of the success value.
 */
export type Success<TValue> = Extract<Result<TValue, never>, { ok: true }>;

/**
 * Represents a failed {@link Result}.
 *
 * @typeParam TError - The type of the failure error.
 */
export type Failure<TError> = Extract<Result<never, TError>, { ok: false }>;

/**
 * Factory functions and utilities for working with {@link Result} values.
 */
export const Result = {
  /**
   * Creates a successful result.
   *
   * @typeParam TValue - The type of the success value.
   * @param value - The success value.
   * @returns A successful result wrapping the value.
   */
  ok<TValue>(value: TValue): Result<TValue, never> {
    return Object.freeze({ ok: true, value });
  },

  /**
   * Creates a failed result.
   *
   * @typeParam TError - The type of the failure error.
   * @param error - The failure error.
   * @returns A failed result wrapping the error.
   */
  fail<TError>(error: TError): Result<never, TError> {
    return Object.freeze({ ok: false, error });
  },

  /**
   * Type guard that narrows a result to {@link Success}.
   *
   * @param result - The result to inspect.
   * @returns `true` when the result is successful.
   */
  isOk<TValue, TError>(result: Result<TValue, TError>): result is Success<TValue> {
    return result.ok;
  },

  /**
   * Alias for {@link Result.isOk} aligned with the architecture documentation.
   */
  isSuccess<TValue, TError>(result: Result<TValue, TError>): result is Success<TValue> {
    return result.ok;
  },

  /**
   * Type guard that narrows a result to {@link Failure}.
   *
   * @param result - The result to inspect.
   * @returns `true` when the result is a failure.
   */
  isFailure<TValue, TError>(result: Result<TValue, TError>): result is Failure<TError> {
    return !result.ok;
  },

  /**
   * Returns the success value or throws when the result failed.
   *
   * Use only at boundaries where failure is considered unexpected.
   */
  getValue<TValue, TError>(result: Result<TValue, TError>): TValue {
    if (result.ok) {
      return result.value;
    }

    throw result.error;
  },

  /**
   * Returns the failure error or throws when the result succeeded.
   */
  getError<TValue, TError>(result: Result<TValue, TError>): TError {
    if (!result.ok) {
      return result.error;
    }

    throw new Error('Cannot read error from a successful result.');
  },

  /**
   * Maps the success value while preserving a failure unchanged.
   *
   * @typeParam TValue - The original success value type.
   * @typeParam TError - The failure error type.
   * @typeParam TMapped - The mapped success value type.
   * @param result - The result to map.
   * @param mapper - Function applied to the success value.
   * @returns A new result with the mapped value or the original error.
   */
  map<TValue, TError, TMapped>(
    result: Result<TValue, TError>,
    mapper: (value: TValue) => TMapped,
  ): Result<TMapped, TError> {
    if (result.ok) {
      return Result.ok(mapper(result.value));
    }

    return result;
  },

  /**
   * Chains result-producing operations, short-circuiting on failure.
   *
   * @typeParam TValue - The original success value type.
   * @typeParam TError - The failure error type.
   * @typeParam TMapped - The chained success value type.
   * @param result - The result to chain from.
   * @param mapper - Function returning the next result.
   * @returns The chained result or the original failure.
   */
  flatMap<TValue, TError, TMapped>(
    result: Result<TValue, TError>,
    mapper: (value: TValue) => Result<TMapped, TError>,
  ): Result<TMapped, TError> {
    if (result.ok) {
      return mapper(result.value);
    }

    return result;
  },

  /**
   * Maps the failure error while preserving a success unchanged.
   *
   * @typeParam TValue - The success value type.
   * @typeParam TError - The original failure error type.
   * @typeParam TMappedError - The mapped failure error type.
   * @param result - The result whose error should be mapped.
   * @param mapper - Function applied to the failure error.
   * @returns A new result with the mapped error or the original success value.
   */
  mapError<TValue, TError, TMappedError>(
    result: Result<TValue, TError>,
    mapper: (error: TError) => TMappedError,
  ): Result<TValue, TMappedError> {
    if (result.ok) {
      return result;
    }

    return Result.fail(mapper(result.error));
  },

  /**
   * Returns the success value or a provided default when the result failed.
   *
   * @typeParam TValue - The success value type.
   * @typeParam TError - The failure error type.
   * @param result - The result to unwrap.
   * @param defaultValue - Value returned when the result failed.
   * @returns The success value or the default value.
   */
  unwrapOr<TValue, TError>(result: Result<TValue, TError>, defaultValue: TValue): TValue {
    return result.ok ? result.value : defaultValue;
  },

  /**
   * Returns the success value or computes a fallback from the failure error.
   *
   * @typeParam TValue - The success value type.
   * @typeParam TError - The failure error type.
   * @param result - The result to unwrap.
   * @param handler - Function producing a fallback value from the error.
   * @returns The success value or the computed fallback value.
   */
  unwrapOrElse<TValue, TError>(
    result: Result<TValue, TError>,
    handler: (error: TError) => TValue,
  ): TValue {
    return result.ok ? result.value : handler(result.error);
  },

  /**
   * Handles both success and failure branches explicitly.
   */
  fold<TValue, TError, TResult>(
    result: Result<TValue, TError>,
    handlers: {
      readonly onSuccess: (value: TValue) => TResult;
      readonly onFailure: (error: TError) => TResult;
    },
  ): TResult {
    return result.ok ? handlers.onSuccess(result.value) : handlers.onFailure(result.error);
  },
} as const;
