/**
 * @module @content/map/MapLoader
 *
 * Loads and validates map definitions from the file system.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { MapDefinition } from './MapDefinition.js';
import { MapRegistry } from './MapRegistry.js';
import { validateMapDefinition } from './MapValidator.js';

const MAP_FILE_PATTERN = /\.(ya?ml)$/i;

/**
 * Loads map definitions from a content directory.
 */
export class MapLoader {
  /** Loads all YAML map files from the given directory. */
  async loadFromDirectory(directoryPath: string): Promise<Result<MapRegistry, ContentLoadError>> {
    const registry = new MapRegistry();

    let entries: string[];

    try {
      entries = await readdir(directoryPath);
    } catch {
      return Result.fail(
        new ContentLoadError(`Map directory "${directoryPath}" could not be read.`, {
          filePath: directoryPath,
        }),
      );
    }

    const mapFiles = entries
      .filter((entry) => MAP_FILE_PATTERN.test(entry))
      .sort((left, right) => left.localeCompare(right));

    for (const fileName of mapFiles) {
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

  /** Loads and validates a single map file. */
  async loadFile(filePath: string): Promise<Result<MapDefinition, ContentLoadError>> {
    let fileContents: string;

    try {
      fileContents = await readFile(filePath, 'utf8');
    } catch {
      return Result.fail(
        new ContentLoadError(`Map file "${filePath}" could not be read.`, { filePath }),
      );
    }

    let parsed: unknown;

    try {
      parsed = parseYaml(fileContents);
    } catch {
      return Result.fail(
        new ContentLoadError(`Map file "${filePath}" contains invalid YAML.`, { filePath }),
      );
    }

    return validateMapDefinition(parsed, filePath);
  }
}
