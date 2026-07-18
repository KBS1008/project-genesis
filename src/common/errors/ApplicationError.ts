/**
 * @module @common/errors/ApplicationError
 *
 * Application-layer orchestration failures.
 *
 * @see docs/architecture/ERROR_HANDLING_STRATEGY.md
 */

import { ErrorCategory } from './ErrorCategory.js';
import { ErrorSeverity } from './ErrorSeverity.js';
import { ProjectGenesisError, type ProjectGenesisErrorOptions } from './ProjectGenesisError.js';

/** Options for constructing an {@link ApplicationError}. */
export type ApplicationErrorOptions = Omit<ProjectGenesisErrorOptions, 'category'>;

/**
 * Describes a failure while orchestrating an application workflow.
 */
export class ApplicationError extends ProjectGenesisError {
  /**
   * @param options - Application error metadata.
   */
  constructor(options: ApplicationErrorOptions) {
    super({
      severity: ErrorSeverity.Error,
      ...options,
      category: ErrorCategory.Application,
    });
    Object.freeze(this);
  }
}
