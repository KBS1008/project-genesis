/**
 * @module @common/logging/LogLevel
 *
 * @see docs/architecture/LOGGING_STRATEGY.md
 */

/** Supported log levels ordered from most to least verbose. */
export enum LogLevel {
  Trace = 'TRACE',
  Debug = 'DEBUG',
  Info = 'INFO',
  Warn = 'WARN',
  Error = 'ERROR',
  Fatal = 'FATAL',
}

const LOG_LEVEL_ORDER: Record<LogLevel, number> = {
  [LogLevel.Trace]: 0,
  [LogLevel.Debug]: 1,
  [LogLevel.Info]: 2,
  [LogLevel.Warn]: 3,
  [LogLevel.Error]: 4,
  [LogLevel.Fatal]: 5,
};

/** Returns whether `level` is enabled for the configured minimum level. */
export function isLogLevelEnabled(level: LogLevel, minimumLevel: LogLevel): boolean {
  return LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[minimumLevel];
}
