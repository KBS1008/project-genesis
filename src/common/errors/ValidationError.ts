/**
 * @module @common/errors/ValidationError
 *
 * Validation-specific domain error for Project Genesis.
 */

import { DomainError } from './DomainError.js';

/** Machine-readable code for validation failures. */
export const ValidationErrorCode = {
  VALIDATION: 'VALIDATION',
} as const;

/**
 * Describes a validation failure in domain or application logic.
 */
export class ValidationError extends DomainError {
  /** Optional name of the invalid field or property. */
  readonly field: string | undefined;

  /**
   * @param message - Human-readable validation message.
   * @param field - Optional field name associated with the failure.
   */
  constructor(message: string, field: string | undefined = undefined) {
    super(ValidationErrorCode.VALIDATION, message);
    this.field = field;
    Object.freeze(this);
  }
}
