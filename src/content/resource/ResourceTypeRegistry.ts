/**
 * @module @content/resource/ResourceTypeRegistry
 *
 * Read-only registry of validated resource type definitions.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { ResourceTypeDefinition } from './ResourceTypeDefinition.js';

/**
 * Stores and provides access to loaded resource type definitions.
 */
export class ResourceTypeRegistry {
  readonly #resources = new Map<string, ResourceTypeDefinition>();

  /**
   * Registers a resource type definition.
   *
   * @param definition - A validated resource type definition.
   * @returns A result indicating success or a duplicate-id error.
   */
  register(definition: ResourceTypeDefinition): Result<void, ContentLoadError> {
    if (this.#resources.has(definition.id)) {
      return Result.fail(
        new ContentLoadError(`Duplicate resource id "${definition.id}".`, {
          contentId: definition.id,
        }),
      );
    }

    this.#resources.set(definition.id, definition);
    return Result.ok(undefined);
  }

  /**
   * Returns a resource type definition by id.
   */
  get(id: string): ResourceTypeDefinition | undefined {
    return this.#resources.get(id);
  }

  /**
   * Returns a resource type definition or a structured not-found error.
   */
  getRequired(id: string): Result<ResourceTypeDefinition, ContentLoadError> {
    const definition = this.#resources.get(id);

    if (definition === undefined) {
      return Result.fail(
        new ContentLoadError(`Resource id "${id}" was not found in the registry.`, {
          contentId: id,
        }),
      );
    }

    return Result.ok(definition);
  }

  /** Returns all registered resource type definitions in deterministic id order. */
  getAll(): readonly ResourceTypeDefinition[] {
    return Object.freeze(
      [...this.#resources.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  /** Returns whether a resource type is registered. */
  has(id: string): boolean {
    return this.#resources.has(id);
  }

  /** Returns the number of registered resource types. */
  get size(): number {
    return this.#resources.size;
  }
}
