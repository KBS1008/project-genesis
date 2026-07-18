import { ConsoleLogger } from '../../src/infrastructure/logging/ConsoleLogger.js';
import { NullLogger } from '../../src/infrastructure/logging/NullLogger.js';
import { LogCategory, LogLevel } from '../../src/common/logging/index.js';

describe('ConsoleLogger', () => {
  it('writes structured log entries', () => {
    const entries: string[] = [];
    const logger = new ConsoleLogger({
      minimumLevel: LogLevel.Info,
      write: (entry) => {
        entries.push(JSON.stringify(entry));
      },
    });

    logger.info(LogCategory.Application, 'Application started.', { version: '0.1.0' });

    expect(entries).toHaveLength(1);
    expect(entries[0]).toContain('"category":"Application"');
    expect(entries[0]).toContain('"message":"Application started."');
  });

  it('respects minimum log level', () => {
    const entries: unknown[] = [];
    const logger = new ConsoleLogger({
      minimumLevel: LogLevel.Error,
      write: (entry) => {
        entries.push(entry);
      },
    });

    logger.debug(LogCategory.Application, 'Hidden debug message.');
    logger.error(LogCategory.SaveSystem, 'Save failed.', { errorCode: 'PRS-0001' });

    expect(entries).toHaveLength(1);
  });
});

describe('NullLogger', () => {
  it('discards all log output', () => {
    const logger = new NullLogger();

    expect(() => {
      logger.info(LogCategory.Application, 'Ignored.');
      logger.error(LogCategory.Application, 'Ignored.');
    }).not.toThrow();
  });
});
