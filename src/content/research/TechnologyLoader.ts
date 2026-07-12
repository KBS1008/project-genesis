/**
 * @module @content/research/TechnologyLoader
 *
 * Loads and validates technology definitions from the file system.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import { TechnologyDefinition } from './TechnologyDefinition.js';
import { TechnologyRegistry } from './TechnologyRegistry.js';
import { validateTechnologyDefinition } from './TechnologyValidator.js';

const TECHNOLOGY_FILE_PATTERN = /\.(ya?ml)$/i;

/**
 * Loads technology definitions from a content directory.
 */
export class TechnologyLoader {
  /**
   * Loads all YAML technology files from the given directory.
   */
  async loadFromDirectory(
    directoryPath: string,
  ): Promise<Result<TechnologyRegistry, ContentLoadError>> {
    const registry = new TechnologyRegistry();

    let entries: string[];

    try {
      entries = await readdir(directoryPath);
    } catch {
      return Result.fail(
        new ContentLoadError(`Technology directory "${directoryPath}" could not be read.`, {
          filePath: directoryPath,
        }),
      );
    }

    const technologyFiles = entries
      .filter((entry) => TECHNOLOGY_FILE_PATTERN.test(entry))
      .sort((left, right) => left.localeCompare(right));

    for (const fileName of technologyFiles) {
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

  /**
   * Loads and validates a single technology file.
   */
  async loadFile(filePath: string): Promise<Result<TechnologyDefinition, ContentLoadError>> {
    let fileContents: string;

    try {
      fileContents = await readFile(filePath, 'utf8');
    } catch {
      return Result.fail(
        new ContentLoadError(`Technology file "${filePath}" could not be read.`, { filePath }),
      );
    }

    let parsed: unknown;

    try {
      parsed = parseYaml(fileContents);
    } catch {
      return Result.fail(
        new ContentLoadError(`Technology file "${filePath}" contains invalid YAML.`, {
          filePath,
        }),
      );
    }

    return validateTechnologyDefinition(parsed, filePath);
  }
}
