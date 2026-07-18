/**
 * @module @common/errors/DomainError
 *
 * Base error type for domain-level failures in Project Genesis.
 *
 * @see docs/architecture/ERROR_HANDLING_STRATEGY.md
 */

import { ErrorCategory } from './ErrorCategory.js';
import { ErrorSeverity } from './ErrorSeverity.js';
import { ProjectGenesisError, type ProjectGenesisErrorOptions } from './ProjectGenesisError.js';

/** Options for constructing a {@link DomainError}. */
export type DomainErrorOptions = Omit<ProjectGenesisErrorOptions, 'category'> & {
  readonly category?: ErrorCategory.Domain;
};

/**
 * Base class for structured domain errors representing expected gameplay situations.
 */
export class DomainError extends ProjectGenesisError {
  /**
   * @param errorCode - Stable machine-readable error identifier.
   * @param message - Human-readable error description.
   * @param options - Optional cause, context and severity metadata.
   */
  constructor(
    errorCode: string,
    message: string,
    options: Omit<DomainErrorOptions, 'errorCode' | 'message'> = {},
  ) {
    super({
      errorCode,
      message,
      category: ErrorCategory.Domain,
      severity: ErrorSeverity.Warning,
      ...options,
    });

    if (new.target === DomainError) {
      Object.freeze(this);
    }
  }
}
