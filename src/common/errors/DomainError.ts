/**
 * @module @common/errors/DomainError
 *
 * Base error type for domain-level failures in Project Genesis.
 *
 * Expected business failures are represented as structured error objects
 * rather than thrown exceptions.
 *
 * @see docs/development/CURSOR_IMPLEMENTATION_GUIDE.md
 */

/**
 * Base class for structured domain errors.
 */
export class DomainError {
  /** Machine-readable error code. */
  readonly code: string;

  /** Human-readable error description. */
  readonly message: string;

  /**
   * @param code - Machine-readable error code.
   * @param message - Human-readable error description.
   */
  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;

    if (new.target === DomainError) {
      Object.freeze(this);
    }
  }
}
