/**
 * @module @common/errors/ErrorCategory
 *
 * Error categories for Project Genesis.
 *
 * @see docs/architecture/ERROR_HANDLING_STRATEGY.md
 */

/** Architectural error categories. */
export enum ErrorCategory {
  Domain = 'Domain',
  Validation = 'Validation',
  Application = 'Application',
  Infrastructure = 'Infrastructure',
  Persistence = 'Persistence',
  Configuration = 'Configuration',
  Network = 'Network',
  Unexpected = 'Unexpected',
}
