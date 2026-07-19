/**
 * @module @content/resource/ResourceTypeLoader
 *
 * Loads and validates resource type definitions from the file system.
 *
 * @see docs/decisions/DD-031-Game-Content-Organization.md
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { ResourceTypeDefinition } from './ResourceTypeDefinition.js';
import { ResourceTypeRegistry } from './ResourceTypeRegistry.js';
import { validateResourceTypeDefinition } from './ResourceTypeValidator.js';

const RESOURCE_FILE_PATTERN = /\.(ya?ml)$/i;

/**
 * Loads resource type definitions from a content directory.
 */
export class ResourceTypeLoader {
  /**
   * Loads all YAML resource files from the given directory.
   *
   * Files are discovered deterministically by sorted file name.
   *
   * @param directoryPath - Path to the resources content directory.
   */
  async loadFromDirectory(
    directoryPath: string,
  ): Promise<Result<ResourceTypeRegistry, ContentLoadError>> {
    const registry = new ResourceTypeRegistry();

    let entries: string[];

    try {
      entries = await readdir(directoryPath);
    } catch {
      return Result.fail(
        new ContentLoadError(`Resource directory "${directoryPath}" could not be read.`, {
          filePath: directoryPath,
        }),
      );
    }

    const resourceFiles = entries
      .filter((entry) => RESOURCE_FILE_PATTERN.test(entry))
      .sort((left, right) => left.localeCompare(right));

    for (const fileName of resourceFiles) {
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
   * Loads and validates a single resource type file.
   *
   * @param filePath - Absolute or relative path to a YAML resource file.
   */
  async loadFile(filePath: string): Promise<Result<ResourceTypeDefinition, ContentLoadError>> {
    let fileContents: string;

    try {
      fileContents = await readFile(filePath, 'utf8');
    } catch {
      return Result.fail(
        new ContentLoadError(`Resource file "${filePath}" could not be read.`, { filePath }),
      );
    }

    let parsed: unknown;

    try {
      parsed = parseYaml(fileContents);
    } catch {
      return Result.fail(
        new ContentLoadError(`Resource file "${filePath}" contains invalid YAML.`, { filePath }),
      );
    }

    return validateResourceTypeDefinition(parsed, filePath);
  }
}
