/**
 * @module @content/city/CityLoader
 *
 * Loads and validates city definitions from the file system.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { CityDefinition } from './CityDefinition.js';
import { CityRegistry } from './CityRegistry.js';
import { validateCityDefinition } from './CityValidator.js';

const CITY_FILE_PATTERN = /\.(ya?ml)$/i;

/**
 * Loads city definitions from a content directory.
 */
export class CityLoader {
  /** Loads all YAML city files from the given directory. */
  async loadFromDirectory(directoryPath: string): Promise<Result<CityRegistry, ContentLoadError>> {
    const registry = new CityRegistry();

    let entries: string[];

    try {
      entries = await readdir(directoryPath);
    } catch {
      return Result.fail(
        new ContentLoadError(`City directory "${directoryPath}" could not be read.`, {
          filePath: directoryPath,
        }),
      );
    }

    const cityFiles = entries
      .filter((entry) => CITY_FILE_PATTERN.test(entry))
      .sort((left, right) => left.localeCompare(right));

    for (const fileName of cityFiles) {
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

  /** Loads and validates a single city file. */
  async loadFile(filePath: string): Promise<Result<CityDefinition, ContentLoadError>> {
    let fileContents: string;

    try {
      fileContents = await readFile(filePath, 'utf8');
    } catch {
      return Result.fail(
        new ContentLoadError(`City file "${filePath}" could not be read.`, { filePath }),
      );
    }

    let parsed: unknown;

    try {
      parsed = parseYaml(fileContents);
    } catch {
      return Result.fail(
        new ContentLoadError(`City file "${filePath}" contains invalid YAML.`, { filePath }),
      );
    }

    return validateCityDefinition(parsed, filePath);
  }
}
