/**
 * @module @content/region/RegionLoader
 *
 * Loads and validates region definitions from the file system.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { RegionDefinition } from './RegionDefinition.js';
import { RegionRegistry } from './RegionRegistry.js';
import { validateRegionDefinition } from './RegionValidator.js';

const REGION_FILE_PATTERN = /\.(ya?ml)$/i;

/**
 * Loads region definitions from a content directory.
 */
export class RegionLoader {
  /** Loads all YAML region files from the given directory. */
  async loadFromDirectory(
    directoryPath: string,
  ): Promise<Result<RegionRegistry, ContentLoadError>> {
    const registry = new RegionRegistry();

    let entries: string[];

    try {
      entries = await readdir(directoryPath);
    } catch {
      return Result.fail(
        new ContentLoadError(`Region directory "${directoryPath}" could not be read.`, {
          filePath: directoryPath,
        }),
      );
    }

    const regionFiles = entries
      .filter((entry) => REGION_FILE_PATTERN.test(entry))
      .sort((left, right) => left.localeCompare(right));

    for (const fileName of regionFiles) {
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

  /** Loads and validates a single region file. */
  async loadFile(filePath: string): Promise<Result<RegionDefinition, ContentLoadError>> {
    let fileContents: string;

    try {
      fileContents = await readFile(filePath, 'utf8');
    } catch {
      return Result.fail(
        new ContentLoadError(`Region file "${filePath}" could not be read.`, { filePath }),
      );
    }

    let parsed: unknown;

    try {
      parsed = parseYaml(fileContents);
    } catch {
      return Result.fail(
        new ContentLoadError(`Region file "${filePath}" contains invalid YAML.`, { filePath }),
      );
    }

    return validateRegionDefinition(parsed, filePath);
  }
}
