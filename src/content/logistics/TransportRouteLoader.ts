/**
 * @module @content/logistics/TransportRouteLoader
 *
 * Loads and validates transport route definitions from the file system.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import { TransportRouteDefinition } from './TransportRouteDefinition.js';
import { TransportRouteRegistry } from './TransportRouteRegistry.js';
import { validateTransportRouteDefinition } from './TransportRouteValidator.js';

const ROUTE_FILE_PATTERN = /\.(ya?ml)$/i;

/**
 * Loads transport route definitions from a content directory.
 */
export class TransportRouteLoader {
  /**
   * Loads all YAML route files from the given directory.
   */
  async loadFromDirectory(
    directoryPath: string,
  ): Promise<Result<TransportRouteRegistry, ContentLoadError>> {
    const registry = new TransportRouteRegistry();

    let entries: string[];

    try {
      entries = await readdir(directoryPath);
    } catch {
      return Result.fail(
        new ContentLoadError(`Transport route directory "${directoryPath}" could not be read.`, {
          filePath: directoryPath,
        }),
      );
    }

    const routeFiles = entries
      .filter((entry) => ROUTE_FILE_PATTERN.test(entry))
      .sort((left, right) => left.localeCompare(right));

    for (const fileName of routeFiles) {
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

  /** Loads and validates a single transport route file. */
  async loadFile(
    filePath: string,
  ): Promise<Result<TransportRouteDefinition, ContentLoadError>> {
    let fileContents: string;

    try {
      fileContents = await readFile(filePath, 'utf8');
    } catch {
      return Result.fail(
        new ContentLoadError(`Transport route file "${filePath}" could not be read.`, { filePath }),
      );
    }

    let parsed: unknown;

    try {
      parsed = parseYaml(fileContents);
    } catch {
      return Result.fail(
        new ContentLoadError(`Transport route file "${filePath}" contains invalid YAML.`, {
          filePath,
        }),
      );
    }

    return validateTransportRouteDefinition(parsed, filePath);
  }
}
