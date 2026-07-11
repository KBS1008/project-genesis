/**
 * @module @content/recipe/RecipeRegistry
 *
 * Read-only registry of validated recipe definitions.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { RecipeDefinition } from './RecipeDefinition.js';

/**
 * Stores and provides access to loaded recipe definitions.
 */
export class RecipeRegistry {
  readonly #recipes = new Map<string, RecipeDefinition>();

  /**
   * Registers a recipe definition.
   *
   * @param definition - A validated recipe definition.
   * @returns A result indicating success or a duplicate-id error.
   */
  register(definition: RecipeDefinition): Result<void, ContentLoadError> {
    if (this.#recipes.has(definition.id)) {
      return Result.fail(
        new ContentLoadError(`Duplicate recipe id "${definition.id}".`, {
          contentId: definition.id,
        }),
      );
    }

    this.#recipes.set(definition.id, definition);
    return Result.ok(undefined);
  }

  /** Returns a recipe definition by id. */
  get(id: string): RecipeDefinition | undefined {
    return this.#recipes.get(id);
  }

  /** Returns a recipe definition or a structured not-found error. */
  getRequired(id: string): Result<RecipeDefinition, ContentLoadError> {
    const definition = this.#recipes.get(id);

    if (definition === undefined) {
      return Result.fail(
        new ContentLoadError(`Recipe id "${id}" was not found in the registry.`, {
          contentId: id,
        }),
      );
    }

    return Result.ok(definition);
  }

  /** Returns all registered recipes in deterministic id order. */
  getAll(): readonly RecipeDefinition[] {
    return Object.freeze(
      [...this.#recipes.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  /** Returns whether a recipe is registered. */
  has(id: string): boolean {
    return this.#recipes.has(id);
  }

  /** Returns the number of registered recipes. */
  get size(): number {
    return this.#recipes.size;
  }
}
