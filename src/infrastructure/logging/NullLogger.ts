/**
 * @module @infrastructure/logging/NullLogger
 *
 * No-op logger for tests and performance-sensitive paths.
 */

import { LogLevel, type LogContext, type Logger } from '../../common/logging/index.js';
import type { LogCategory } from '../../common/logging/LogCategory.js';

/** Discards all log output. */
export class NullLogger implements Logger {
  readonly minimumLevel = LogLevel.Fatal;

  trace(_category: LogCategory, _message: string, _context?: LogContext): void {}

  debug(_category: LogCategory, _message: string, _context?: LogContext): void {}

  info(_category: LogCategory, _message: string, _context?: LogContext): void {}

  warn(_category: LogCategory, _message: string, _context?: LogContext): void {}

  error(
    _category: LogCategory,
    _message: string,
    _context?: LogContext & { readonly errorCode?: string },
  ): void {}

  fatal(
    _category: LogCategory,
    _message: string,
    _context?: LogContext & { readonly errorCode?: string },
  ): void {}

  child(_context: LogContext): Logger {
    return this;
  }
}
