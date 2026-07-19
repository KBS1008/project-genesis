/**
 * @module @content/milestone/MilestoneLoader
 *
 * Loads and validates milestone definitions from the file system.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { MilestoneDefinition } from './MilestoneDefinition.js';
import { MilestoneRegistry } from './MilestoneRegistry.js';
import { validateMilestoneDefinition } from './MilestoneValidator.js';

const MILESTONE_FILE_PATTERN = /\.(ya?ml)$/i;

/**
 * Loads milestone definitions from a content directory.
 */
export class MilestoneLoader {
  /**
   * Loads all YAML milestone files from the given directory.
   */
  async loadFromDirectory(
    directoryPath: string,
  ): Promise<Result<MilestoneRegistry, ContentLoadError>> {
    const registry = new MilestoneRegistry();

    let entries: string[];

    try {
      entries = await readdir(directoryPath);
    } catch {
      return Result.fail(
        new ContentLoadError(`Milestone directory "${directoryPath}" could not be read.`, {
          filePath: directoryPath,
        }),
      );
    }

    const milestoneFiles = entries
      .filter((entry) => MILESTONE_FILE_PATTERN.test(entry))
      .sort((left, right) => left.localeCompare(right));

    for (const fileName of milestoneFiles) {
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
   * Loads and validates a single milestone file.
   */
  async loadFile(filePath: string): Promise<Result<MilestoneDefinition, ContentLoadError>> {
    let fileContents: string;

    try {
      fileContents = await readFile(filePath, 'utf8');
    } catch {
      return Result.fail(
        new ContentLoadError(`Milestone file "${filePath}" could not be read.`, { filePath }),
      );
    }

    let parsed: unknown;

    try {
      parsed = parseYaml(fileContents);
    } catch {
      return Result.fail(
        new ContentLoadError(`Milestone file "${filePath}" contains invalid YAML.`, {
          filePath,
        }),
      );
    }

    return validateMilestoneDefinition(parsed, filePath);
  }
}
