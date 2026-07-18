/**
 * @module @common/logging/Logger
 *
 * @see docs/architecture/LOGGING_STRATEGY.md
 */

import type { LogCategory } from './LogCategory.js';
import type { LogLevel } from './LogLevel.js';

/** Context attached to structured log entries. */
export type LogContext = Readonly<Record<string, unknown>>;

/** Central logging contract for Project Genesis. */
export interface Logger {
  readonly minimumLevel: LogLevel;

  trace(category: LogCategory, message: string, context?: LogContext): void;
  debug(category: LogCategory, message: string, context?: LogContext): void;
  info(category: LogCategory, message: string, context?: LogContext): void;
  warn(category: LogCategory, message: string, context?: LogContext): void;
  error(
    category: LogCategory,
    message: string,
    context?: LogContext & { readonly errorCode?: string },
  ): void;
  fatal(
    category: LogCategory,
    message: string,
    context?: LogContext & { readonly errorCode?: string },
  ): void;

  child(context: LogContext): Logger;
}
