/**
 * @module @common/logging/LogEntry
 *
 * @see docs/architecture/LOGGING_STRATEGY.md
 */

import type { LogCategory } from './LogCategory.js';
import type { LogLevel } from './LogLevel.js';

/** Structured log entry emitted by the logging system. */
export type LogEntry = {
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly category: LogCategory;
  readonly message: string;
  readonly context?: Readonly<Record<string, unknown>>;
  readonly errorCode?: string;
  readonly correlationId?: string;
};
