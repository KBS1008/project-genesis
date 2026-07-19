/**
 * @module @common/errors/ValidationError
 *
 * Validation-specific error for Project Genesis.
 *
 * @see docs/architecture/VALIDATION_STRATEGY.md
 */

import { ErrorCategory } from './ErrorCategory.js';
import { ErrorSeverity } from './ErrorSeverity.js';
import { ProjectGenesisError } from './ProjectGenesisError.js';

/** Stable validation error codes. */
export const ValidationErrorCode = {
  VALIDATION: 'VAL-0001',
  INVALID_FIELD: 'VAL-0002',
  MISSING_FIELD: 'VAL-0003',
  CONSTRAINT_VIOLATION: 'VAL-0004',
} as const;

/** Options for constructing a {@link ValidationError}. */
export type ValidationErrorOptions = {
  readonly errorCode?: string;
  readonly field?: string;
  readonly constraint?: string;
  readonly value?: unknown;
  readonly context?: Readonly<Record<string, unknown>>;
};

/**
 * Describes a validation failure in domain, application or infrastructure logic.
 */
export class ValidationError extends ProjectGenesisError {
  /** Name of the invalid field or property. */
  readonly field: string | undefined;

  /** Constraint that was violated. */
  readonly constraint: string | undefined;

  /** Invalid value when safe to expose. */
  readonly value: unknown;

  /**
   * @param message - Human-readable validation message.
   * @param options - Optional field, constraint and value metadata.
   */
  constructor(message: string, options: ValidationErrorOptions = {}, freeze = true) {
    super({
      errorCode: options.errorCode ?? ValidationErrorCode.VALIDATION,
      category: ErrorCategory.Validation,
      message,
      severity: ErrorSeverity.Warning,
      context: {
        ...(options.field !== undefined ? { field: options.field } : {}),
        ...(options.constraint !== undefined ? { constraint: options.constraint } : {}),
        ...(options.value !== undefined ? { value: options.value } : {}),
        ...options.context,
      },
    });
    this.field = options.field;
    this.constraint = options.constraint;
    this.value = options.value;

    if (freeze) {
      Object.freeze(this);
    }
  }
}

/**
 * Aggregates multiple validation failures for a single operation.
 */
export class ValidationErrors extends ValidationError {
  /** Individual validation failures. */
  readonly errors: readonly ValidationError[];

  /**
   * @param errors - Non-empty collection of validation failures.
   */
  constructor(errors: readonly ValidationError[]) {
    if (errors.length === 0) {
      throw new ValidationError('ValidationErrors requires at least one validation error.');
    }

    super(
      `${errors.length} validation error(s) occurred.`,
      {
        errorCode: ValidationErrorCode.CONSTRAINT_VIOLATION,
        context: { errorCount: errors.length },
      },
      false,
    );
    this.errors = Object.freeze([...errors]);
    Object.freeze(this);
  }
}
