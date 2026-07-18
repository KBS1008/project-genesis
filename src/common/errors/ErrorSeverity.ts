/**
 * @module @common/errors/ErrorSeverity
 *
 * Error severity levels for Project Genesis.
 *
 * @see docs/architecture/ERROR_HANDLING_STRATEGY.md
 */

/** Severity levels that drive logging and recovery behaviour. */
export enum ErrorSeverity {
  Debug = 'Debug',
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
  Critical = 'Critical',
}
