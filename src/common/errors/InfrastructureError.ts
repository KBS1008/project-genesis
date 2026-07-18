/**
 * @module @common/errors/InfrastructureError
 *
 * Infrastructure-layer failures.
 *
 * @see docs/architecture/ERROR_HANDLING_STRATEGY.md
 */

import { ErrorCategory } from './ErrorCategory.js';
import { ErrorSeverity } from './ErrorSeverity.js';
import { ProjectGenesisError, type ProjectGenesisErrorOptions } from './ProjectGenesisError.js';

/** Stable infrastructure error codes. */
export const InfrastructureErrorCode = {
  FILESYSTEM: 'INF-0001',
  SERIALIZATION: 'INF-0002',
  ASSET_NOT_FOUND: 'INF-0003',
  REGISTRY_LOAD: 'INF-0004',
} as const;

/** Options for constructing an {@link InfrastructureError}. */
export type InfrastructureErrorOptions = Omit<ProjectGenesisErrorOptions, 'category'>;

/**
 * Describes a technical infrastructure failure.
 */
export class InfrastructureError extends ProjectGenesisError {
  /**
   * @param options - Infrastructure error metadata.
   */
  constructor(options: InfrastructureErrorOptions) {
    super({
      severity: ErrorSeverity.Error,
      ...options,
      category: ErrorCategory.Infrastructure,
    });
    Object.freeze(this);
  }
}
