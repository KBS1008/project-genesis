/**
 * @module @content/company/NpcCompanyLoader
 *
 * Loads and validates NPC company definitions from the file system.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { NpcCompanyDefinition } from './NpcCompanyDefinition.js';
import { NpcCompanyRegistry } from './NpcCompanyRegistry.js';
import { validateNpcCompanyDefinition } from './NpcCompanyValidator.js';

const NPC_COMPANY_FILE_PATTERN = /\.(ya?ml)$/i;

/**
 * Loads NPC company definitions from a content directory.
 */
export class NpcCompanyLoader {
  /** Loads all YAML NPC company files from the given directory. */
  async loadFromDirectory(
    directoryPath: string,
  ): Promise<Result<NpcCompanyRegistry, ContentLoadError>> {
    const registry = new NpcCompanyRegistry();

    let entries: string[];

    try {
      entries = await readdir(directoryPath);
    } catch {
      return Result.fail(
        new ContentLoadError(`NPC company directory "${directoryPath}" could not be read.`, {
          filePath: directoryPath,
        }),
      );
    }

    const companyFiles = entries
      .filter((entry) => NPC_COMPANY_FILE_PATTERN.test(entry))
      .sort((left, right) => left.localeCompare(right));

    for (const fileName of companyFiles) {
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

  /** Loads and validates a single NPC company file. */
  async loadFile(filePath: string): Promise<Result<NpcCompanyDefinition, ContentLoadError>> {
    let fileContents: string;

    try {
      fileContents = await readFile(filePath, 'utf8');
    } catch {
      return Result.fail(
        new ContentLoadError(`NPC company file "${filePath}" could not be read.`, { filePath }),
      );
    }

    let parsed: unknown;

    try {
      parsed = parseYaml(fileContents);
    } catch {
      return Result.fail(
        new ContentLoadError(`NPC company file "${filePath}" contains invalid YAML.`, { filePath }),
      );
    }

    return validateNpcCompanyDefinition(parsed, filePath);
  }
}
