/**
 * @module @content/building/BuildingTypeLoader
 *
 * Loads and validates building type definitions from the file system.
 *
 * @see docs/decisions/DD-031-Game-Content-Organization.md
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { BuildingTypeDefinition } from './BuildingTypeDefinition.js';
import { BuildingTypeRegistry } from './BuildingTypeRegistry.js';
import { validateBuildingTypeDefinition } from './BuildingTypeValidator.js';

const BUILDING_FILE_PATTERN = /\.(ya?ml)$/i;

/**
 * Loads building type definitions from a content directory.
 */
export class BuildingTypeLoader {
  /**
   * Loads all YAML building type files from the given directory.
   *
   * Files are discovered deterministically by sorted file name.
   *
   * @param directoryPath - Path to the buildings content directory.
   */
  async loadFromDirectory(
    directoryPath: string,
  ): Promise<Result<BuildingTypeRegistry, ContentLoadError>> {
    const registry = new BuildingTypeRegistry();

    let entries: string[];

    try {
      entries = await readdir(directoryPath);
    } catch {
      return Result.fail(
        new ContentLoadError(`Building type directory "${directoryPath}" could not be read.`, {
          filePath: directoryPath,
        }),
      );
    }

    const buildingFiles = entries
      .filter((entry) => BUILDING_FILE_PATTERN.test(entry))
      .sort((left, right) => left.localeCompare(right));

    for (const fileName of buildingFiles) {
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
   * Loads and validates a single building type file.
   *
   * @param filePath - Absolute or relative path to a YAML building type file.
   */
  async loadFile(filePath: string): Promise<Result<BuildingTypeDefinition, ContentLoadError>> {
    let fileContents: string;

    try {
      fileContents = await readFile(filePath, 'utf8');
    } catch {
      return Result.fail(
        new ContentLoadError(`Building type file "${filePath}" could not be read.`, { filePath }),
      );
    }

    let parsed: unknown;

    try {
      parsed = parseYaml(fileContents);
    } catch {
      return Result.fail(
        new ContentLoadError(`Building type file "${filePath}" contains invalid YAML.`, {
          filePath,
        }),
      );
    }

    return validateBuildingTypeDefinition(parsed, filePath);
  }
}
