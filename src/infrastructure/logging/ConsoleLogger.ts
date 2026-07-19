/**
 * @module @infrastructure/logging/ConsoleLogger
 *
 * Structured console logger for development and console bootstrap.
 *
 * @see docs/architecture/LOGGING_STRATEGY.md
 */

import {
  LogLevel,
  isLogLevelEnabled,
  type LogCategory,
  type LogContext,
  type LogEntry,
  type Logger,
} from '../../common/logging/index.js';

/** Options for {@link ConsoleLogger}. */
export type ConsoleLoggerOptions = {
  readonly minimumLevel?: LogLevel;
  readonly baseContext?: LogContext;
  readonly write?: (entry: LogEntry) => void;
};

/**
 * Writes structured log entries to the console.
 */
export class ConsoleLogger implements Logger {
  readonly minimumLevel: LogLevel;
  readonly #baseContext: LogContext;
  readonly #write: (entry: LogEntry) => void;

  constructor(options: ConsoleLoggerOptions = {}) {
    this.minimumLevel = options.minimumLevel ?? LogLevel.Info;
    this.#baseContext = options.baseContext ?? {};
    this.#write = options.write ?? ConsoleLogger.#defaultWrite;
  }

  trace(category: LogCategory, message: string, context?: LogContext): void {
    this.#log(LogLevel.Trace, category, message, context);
  }

  debug(category: LogCategory, message: string, context?: LogContext): void {
    this.#log(LogLevel.Debug, category, message, context);
  }

  info(category: LogCategory, message: string, context?: LogContext): void {
    this.#log(LogLevel.Info, category, message, context);
  }

  warn(category: LogCategory, message: string, context?: LogContext): void {
    this.#log(LogLevel.Warn, category, message, context);
  }

  error(
    category: LogCategory,
    message: string,
    context?: LogContext & { readonly errorCode?: string },
  ): void {
    this.#log(LogLevel.Error, category, message, context);
  }

  fatal(
    category: LogCategory,
    message: string,
    context?: LogContext & { readonly errorCode?: string },
  ): void {
    this.#log(LogLevel.Fatal, category, message, context);
  }

  child(context: LogContext): Logger {
    return new ConsoleLogger({
      minimumLevel: this.minimumLevel,
      baseContext: { ...this.#baseContext, ...context },
      write: this.#write,
    });
  }

  #log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    context?: LogContext & { readonly errorCode?: string },
  ): void {
    if (!isLogLevelEnabled(level, this.minimumLevel)) {
      return;
    }

    const entry: LogEntry = Object.freeze({
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      ...(context?.errorCode !== undefined ? { errorCode: context.errorCode } : {}),
      ...(context !== undefined
        ? {
            context: Object.freeze({
              ...this.#baseContext,
              ...context,
            }),
          }
        : Object.keys(this.#baseContext).length > 0
          ? { context: Object.freeze({ ...this.#baseContext }) }
          : {}),
    });

    this.#write(entry);
  }

  static #defaultWrite(entry: LogEntry): void {
    const payload = JSON.stringify(entry);

    switch (entry.level) {
      case LogLevel.Fatal:
      case LogLevel.Error:
        console.error(payload);
        break;
      case LogLevel.Warn:
        console.warn(payload);
        break;
      default:
        console.log(payload);
    }
  }
}
