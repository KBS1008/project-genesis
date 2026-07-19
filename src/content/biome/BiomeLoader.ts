/**
 * @module @content/biome/BiomeLoader
 *
 * Loads and validates biome definitions from the file system.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { BiomeDefinition } from './BiomeDefinition.js';
import { BiomeRegistry } from './BiomeRegistry.js';
import { validateBiomeDefinition } from './BiomeValidator.js';

const BIOME_FILE_PATTERN = /\.(ya?ml)$/i;

/**
 * Loads biome definitions from a content directory.
 */
export class BiomeLoader {
  /** Loads all YAML biome files from the given directory. */
  async loadFromDirectory(
    directoryPath: string,
  ): Promise<Result<BiomeRegistry, ContentLoadError>> {
    const registry = new BiomeRegistry();

    let entries: string[];

    try {
      entries = await readdir(directoryPath);
    } catch {
      return Result.fail(
        new ContentLoadError(`Biome directory "${directoryPath}" could not be read.`, {
          filePath: directoryPath,
        }),
      );
    }

    const biomeFiles = entries
      .filter((entry) => BIOME_FILE_PATTERN.test(entry))
      .sort((left, right) => left.localeCompare(right));

    for (const fileName of biomeFiles) {
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

  /** Loads and validates a single biome file. */
  async loadFile(filePath: string): Promise<Result<BiomeDefinition, ContentLoadError>> {
    let fileContents: string;

    try {
      fileContents = await readFile(filePath, 'utf8');
    } catch {
      return Result.fail(
        new ContentLoadError(`Biome file "${filePath}" could not be read.`, { filePath }),
      );
    }

    let parsed: unknown;

    try {
      parsed = parseYaml(fileContents);
    } catch {
      return Result.fail(
        new ContentLoadError(`Biome file "${filePath}" contains invalid YAML.`, { filePath }),
      );
    }

    return validateBiomeDefinition(parsed, filePath);
  }
}
