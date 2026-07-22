/**
 * @module @content/strategy/StrategyLoader
 *
 * Loads and validates strategy definitions from the file system.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { StrategyDefinition } from './StrategyDefinition.js';
import { StrategyRegistry } from './StrategyRegistry.js';
import { validateStrategyDefinition } from './StrategyValidator.js';

const STRATEGY_FILE_PATTERN = /\.(ya?ml)$/i;

/**
 * Loads strategy definitions from a content directory.
 */
export class StrategyLoader {
  /** Loads all YAML strategy files from the given directory. */
  async loadFromDirectory(
    directoryPath: string,
  ): Promise<Result<StrategyRegistry, ContentLoadError>> {
    const registry = new StrategyRegistry();

    let entries: string[];

    try {
      entries = await readdir(directoryPath);
    } catch {
      return Result.fail(
        new ContentLoadError(`Strategy directory "${directoryPath}" could not be read.`, {
          filePath: directoryPath,
        }),
      );
    }

    const strategyFiles = entries
      .filter((entry) => STRATEGY_FILE_PATTERN.test(entry))
      .sort((left, right) => left.localeCompare(right));

    for (const fileName of strategyFiles) {
      const filePath = path.join(directoryPath, fileName);
      const loadResult = await this.loadFile(filePath);

      if (!loadResult.ok) {
        return Result.fail(loadResult.error);
      }

      const registerResult = registry.register(loadResult.value);

      if (!registerResult.ok) {
        return Result.fail(registerResult.error);
      }
    }

    return Result.ok(registry);
  }

  /** Loads and validates a single strategy file. */
  async loadFile(filePath: string): Promise<Result<StrategyDefinition, ContentLoadError>> {
    let fileContents: string;

    try {
      fileContents = await readFile(filePath, 'utf8');
    } catch {
      return Result.fail(
        new ContentLoadError(`Strategy file "${filePath}" could not be read.`, { filePath }),
      );
    }

    let parsed: unknown;

    try {
      parsed = parseYaml(fileContents);
    } catch {
      return Result.fail(
        new ContentLoadError(`Strategy file "${filePath}" contains invalid YAML.`, { filePath }),
      );
    }

    return validateStrategyDefinition(parsed, filePath);
  }
}
