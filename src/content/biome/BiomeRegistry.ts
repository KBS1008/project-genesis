/**
 * @module @content/biome/BiomeRegistry
 *
 * Read-only registry of validated biome definitions.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { BiomeDefinition } from './BiomeDefinition.js';

/**
 * Stores and provides access to loaded biome definitions.
 */
export class BiomeRegistry {
  readonly #biomes = new Map<string, BiomeDefinition>();

  /** Registers a biome definition. */
  register(definition: BiomeDefinition): Result<void, ContentLoadError> {
    if (this.#biomes.has(definition.id)) {
      return Result.fail(
        new ContentLoadError(`Duplicate biome id "${definition.id}".`, {
          contentId: definition.id,
        }),
      );
    }

    this.#biomes.set(definition.id, definition);
    return Result.ok(undefined);
  }

  /** Returns a biome definition by id. */
  get(id: string): BiomeDefinition | undefined {
    return this.#biomes.get(id);
  }

  /** Returns all registered biomes in deterministic id order. */
  getAll(): readonly BiomeDefinition[] {
    return Object.freeze(
      [...this.#biomes.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  /** Returns whether a biome is registered. */
  has(id: string): boolean {
    return this.#biomes.has(id);
  }

  /** Returns the number of registered biomes. */
  get size(): number {
    return this.#biomes.size;
  }
}
