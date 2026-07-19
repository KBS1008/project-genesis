/**
 * @module @content/map/MapRegistry
 *
 * Read-only registry of validated map definitions.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { MapDefinition } from './MapDefinition.js';

/**
 * Stores and provides access to loaded map definitions.
 */
export class MapRegistry {
  readonly #maps = new Map<string, MapDefinition>();

  /** Registers a map definition. */
  register(definition: MapDefinition): Result<void, ContentLoadError> {
    if (this.#maps.has(definition.id)) {
      return Result.fail(
        new ContentLoadError(`Duplicate map id "${definition.id}".`, {
          contentId: definition.id,
        }),
      );
    }

    this.#maps.set(definition.id, definition);
    return Result.ok(undefined);
  }

  /** Returns a map definition by id. */
  get(id: string): MapDefinition | undefined {
    return this.#maps.get(id);
  }

  /** Returns all registered maps in deterministic id order. */
  getAll(): readonly MapDefinition[] {
    return Object.freeze(
      [...this.#maps.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  /** Returns whether a map is registered. */
  has(id: string): boolean {
    return this.#maps.has(id);
  }

  /** Returns the number of registered maps. */
  get size(): number {
    return this.#maps.size;
  }
}
