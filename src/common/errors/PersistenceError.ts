/**
 * @module @common/errors/PersistenceError
 *
 * Persistence-layer failures.
 *
 * @see docs/architecture/ERROR_HANDLING_STRATEGY.md
 */

import { ErrorCategory } from './ErrorCategory.js';
import { ErrorSeverity } from './ErrorSeverity.js';
import { ProjectGenesisError, type ProjectGenesisErrorOptions } from './ProjectGenesisError.js';

/** Stable persistence error codes. */
export const PersistenceErrorCode = {
  SAVE_FAILED: 'PRS-0001',
  LOAD_FAILED: 'PRS-0002',
  INVALID_SNAPSHOT: 'PRS-0003',
  SERIALIZATION_FAILED: 'PRS-0004',
  WRITE_FAILED: 'PRS-0005',
  READ_FAILED: 'PRS-0006',
} as const;

/** Options for constructing a {@link PersistenceError}. */
export type PersistenceErrorOptions = Omit<ProjectGenesisErrorOptions, 'category'>;

/**
 * Describes a persistence or savegame failure.
 */
export class PersistenceError extends ProjectGenesisError {
  /**
   * @param options - Persistence error metadata.
   */
  constructor(options: PersistenceErrorOptions) {
    super({
      severity: ErrorSeverity.Error,
      ...options,
      category: ErrorCategory.Persistence,
    });
    Object.freeze(this);
  }
}
