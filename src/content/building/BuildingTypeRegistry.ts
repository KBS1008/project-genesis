/**
 * @module @content/building/BuildingTypeRegistry
 *
 * Read-only registry of validated building type definitions.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { BuildingTypeDefinition } from './BuildingTypeDefinition.js';

/**
 * Stores and provides access to loaded building type definitions.
 */
export class BuildingTypeRegistry {
  readonly #buildingTypes = new Map<string, BuildingTypeDefinition>();

  /**
   * Registers a building type definition.
   *
   * @param definition - A validated building type definition.
   * @returns A result indicating success or a duplicate-id error.
   */
  register(definition: BuildingTypeDefinition): Result<void, ContentLoadError> {
    if (this.#buildingTypes.has(definition.id)) {
      return Result.fail(
        new ContentLoadError(`Duplicate building type id "${definition.id}".`, {
          contentId: definition.id,
        }),
      );
    }

    this.#buildingTypes.set(definition.id, definition);
    return Result.ok(undefined);
  }

  /** Returns a building type definition by id. */
  get(id: string): BuildingTypeDefinition | undefined {
    return this.#buildingTypes.get(id);
  }

  /** Returns a building type definition or a structured not-found error. */
  getRequired(id: string): Result<BuildingTypeDefinition, ContentLoadError> {
    const definition = this.#buildingTypes.get(id);

    if (definition === undefined) {
      return Result.fail(
        new ContentLoadError(`Building type id "${id}" was not found in the registry.`, {
          contentId: id,
        }),
      );
    }

    return Result.ok(definition);
  }

  /** Returns all registered building types in deterministic id order. */
  getAll(): readonly BuildingTypeDefinition[] {
    return Object.freeze(
      [...this.#buildingTypes.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  /** Returns whether a building type is registered. */
  has(id: string): boolean {
    return this.#buildingTypes.has(id);
  }

  /** Returns the number of registered building types. */
  get size(): number {
    return this.#buildingTypes.size;
  }
}
