/**
 * @module @common/errors/ProjectGenesisError
 *
 * Root error type for Project Genesis.
 *
 * @see docs/architecture/ERROR_HANDLING_STRATEGY.md
 */

import type { ErrorCategory } from './ErrorCategory.js';
import { ErrorSeverity } from './ErrorSeverity.js';

/** Options for constructing a {@link ProjectGenesisError}. */
export type ProjectGenesisErrorOptions = {
  readonly errorCode: string;
  readonly category: ErrorCategory;
  readonly message: string;
  readonly cause?: ProjectGenesisError | Error;
  readonly context?: Readonly<Record<string, unknown>>;
  readonly severity?: ErrorSeverity;
  readonly timestamp?: number;
};

/**
 * Base class for all structured Project Genesis errors.
 */
export class ProjectGenesisError {
  /** Stable machine-readable error identifier (format AAA-0001). */
  readonly errorCode: string;

  /** Architectural error category. */
  readonly category: ErrorCategory;

  /** Human-readable error description. */
  readonly message: string;

  /** Optional underlying cause. */
  readonly cause: ProjectGenesisError | Error | undefined;

  /** Creation timestamp in milliseconds since epoch. */
  readonly timestamp: number;

  /** Structured diagnostic context. */
  readonly context: Readonly<Record<string, unknown>>;

  /** Error severity for logging and recovery. */
  readonly severity: ErrorSeverity;

  /**
   * @param options - Error metadata.
   */
  constructor(options: ProjectGenesisErrorOptions) {
    this.errorCode = options.errorCode;
    this.category = options.category;
    this.message = options.message;
    this.cause = options.cause;
    this.timestamp = options.timestamp ?? Date.now();
    this.context = Object.freeze({ ...(options.context ?? {}) });
    this.severity = options.severity ?? ErrorSeverity.Error;

    if (new.target === ProjectGenesisError) {
      Object.freeze(this);
    }
  }

  /** Backward-compatible alias for {@link errorCode}. */
  get code(): string {
    return this.errorCode;
  }
}
