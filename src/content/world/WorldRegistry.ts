/**
 * @module @content/world/WorldRegistry
 *
 * Read-only registry of validated world definitions.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { WorldDefinition } from './WorldDefinition.js';

/**
 * Stores and provides access to loaded world definitions.
 */
export class WorldRegistry {
  readonly #worlds = new Map<string, WorldDefinition>();

  /** Registers a world definition. */
  register(definition: WorldDefinition): Result<void, ContentLoadError> {
    if (this.#worlds.has(definition.id)) {
      return Result.fail(
        new ContentLoadError(`Duplicate world id "${definition.id}".`, {
          contentId: definition.id,
        }),
      );
    }

    this.#worlds.set(definition.id, definition);
    return Result.ok(undefined);
  }

  /** Returns a world definition by id. */
  get(id: string): WorldDefinition | undefined {
    return this.#worlds.get(id);
  }

  /** Returns all registered worlds in deterministic id order. */
  getAll(): readonly WorldDefinition[] {
    return Object.freeze(
      [...this.#worlds.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  /** Returns whether a world is registered. */
  has(id: string): boolean {
    return this.#worlds.has(id);
  }

  /** Returns the number of registered worlds. */
  get size(): number {
    return this.#worlds.size;
  }
}
