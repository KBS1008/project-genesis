/**
 * @module @content/recipe/RecipeLoader
 *
 * Loads and validates recipe definitions from the file system.
 *
 * @see docs/decisions/DD-031-Game-Content-Organization.md
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { RecipeDefinition } from './RecipeDefinition.js';
import type { RecipeReferenceContext } from './RecipeReferenceContext.js';
import { RecipeRegistry } from './RecipeRegistry.js';
import { validateRecipeDefinition } from './RecipeValidator.js';

const RECIPE_FILE_PATTERN = /\.(ya?ml)$/i;

/**
 * Loads recipe definitions from a content directory.
 */
export class RecipeLoader {
  /**
   * Loads all YAML recipe files from the given directory.
   *
   * Files are discovered deterministically by sorted file name.
   *
   * @param directoryPath - Path to the recipes content directory.
   * @param references - Registries used to validate resource and building type references.
   */
  async loadFromDirectory(
    directoryPath: string,
    references: RecipeReferenceContext,
  ): Promise<Result<RecipeRegistry, ContentLoadError>> {
    const registry = new RecipeRegistry();

    let entries: string[];

    try {
      entries = await readdir(directoryPath);
    } catch {
      return Result.fail(
        new ContentLoadError(`Recipe directory "${directoryPath}" could not be read.`, {
          filePath: directoryPath,
        }),
      );
    }

    const recipeFiles = entries
      .filter((entry) => RECIPE_FILE_PATTERN.test(entry))
      .sort((left, right) => left.localeCompare(right));

    for (const fileName of recipeFiles) {
      const filePath = path.join(directoryPath, fileName);
      const loadResult = await this.loadFile(filePath, references);

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
   * Loads and validates a single recipe file.
   *
   * @param filePath - Absolute or relative path to a YAML recipe file.
   * @param references - Registries used to validate resource and building type references.
   */
  async loadFile(
    filePath: string,
    references: RecipeReferenceContext,
  ): Promise<Result<RecipeDefinition, ContentLoadError>> {
    let fileContents: string;

    try {
      fileContents = await readFile(filePath, 'utf8');
    } catch {
      return Result.fail(
        new ContentLoadError(`Recipe file "${filePath}" could not be read.`, { filePath }),
      );
    }

    let parsed: unknown;

    try {
      parsed = parseYaml(fileContents);
    } catch {
      return Result.fail(
        new ContentLoadError(`Recipe file "${filePath}" contains invalid YAML.`, { filePath }),
      );
    }

    return validateRecipeDefinition(parsed, filePath, references);
  }
}
