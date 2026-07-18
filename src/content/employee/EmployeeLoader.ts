/**
 * @module @content/employee/EmployeeLoader
 *
 * Loads and validates employee type definitions from the file system.
 *
 * @see docs/schemas/Employee.schema.md
 * @see docs/decisions/DD-031-Game-Content-Organization.md
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import { EmployeeDefinition } from './EmployeeDefinition.js';
import { EmployeeRegistry } from './EmployeeRegistry.js';
import { validateEmployeeDefinition } from './EmployeeValidator.js';

const EMPLOYEE_FILE_PATTERN = /\.(ya?ml)$/i;

/**
 * Loads employee type definitions from a content directory.
 */
export class EmployeeLoader {
  /**
   * Loads all YAML employee files from the given directory.
   *
   * Files are discovered deterministically by sorted file name.
   */
  async loadFromDirectory(
    directoryPath: string,
  ): Promise<Result<EmployeeRegistry, ContentLoadError>> {
    const registry = new EmployeeRegistry();

    let entries: string[];

    try {
      entries = await readdir(directoryPath);
    } catch {
      return Result.fail(
        new ContentLoadError(`Employee directory "${directoryPath}" could not be read.`, {
          filePath: directoryPath,
        }),
      );
    }

    const employeeFiles = entries
      .filter((entry) => EMPLOYEE_FILE_PATTERN.test(entry))
      .sort((left, right) => left.localeCompare(right));

    for (const fileName of employeeFiles) {
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
   * Loads and validates a single employee type file.
   */
  async loadFile(filePath: string): Promise<Result<EmployeeDefinition, ContentLoadError>> {
    let fileContents: string;

    try {
      fileContents = await readFile(filePath, 'utf8');
    } catch {
      return Result.fail(
        new ContentLoadError(`Employee file "${filePath}" could not be read.`, { filePath }),
      );
    }

    let parsed: unknown;

    try {
      parsed = parseYaml(fileContents);
    } catch {
      return Result.fail(
        new ContentLoadError(`Employee file "${filePath}" contains invalid YAML.`, { filePath }),
      );
    }

    return validateEmployeeDefinition(parsed, filePath);
  }
}
