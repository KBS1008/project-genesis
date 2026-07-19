/**
 * @module @content/region/RegionRegistry
 *
 * Read-only registry of validated region definitions.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { RegionDefinition } from './RegionDefinition.js';

/**
 * Stores and provides access to loaded region definitions.
 */
export class RegionRegistry {
  readonly #regions = new Map<string, RegionDefinition>();

  /** Registers a region definition. */
  register(definition: RegionDefinition): Result<void, ContentLoadError> {
    if (this.#regions.has(definition.id)) {
      return Result.fail(
        new ContentLoadError(`Duplicate region id "${definition.id}".`, {
          contentId: definition.id,
        }),
      );
    }

    this.#regions.set(definition.id, definition);
    return Result.ok(undefined);
  }

  /** Returns a region definition by id. */
  get(id: string): RegionDefinition | undefined {
    return this.#regions.get(id);
  }

  /** Returns all registered regions in deterministic id order. */
  getAll(): readonly RegionDefinition[] {
    return Object.freeze(
      [...this.#regions.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  /** Returns whether a region is registered. */
  has(id: string): boolean {
    return this.#regions.has(id);
  }

  /** Returns the number of registered regions. */
  get size(): number {
    return this.#regions.size;
  }
}
