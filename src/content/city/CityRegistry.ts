/**
 * @module @content/city/CityRegistry
 *
 * Read-only registry of validated city definitions.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { CityDefinition } from './CityDefinition.js';

/**
 * Stores and provides access to loaded city definitions.
 */
export class CityRegistry {
  readonly #cities = new Map<string, CityDefinition>();

  /** Registers a city definition. */
  register(definition: CityDefinition): Result<void, ContentLoadError> {
    if (this.#cities.has(definition.id)) {
      return Result.fail(
        new ContentLoadError(`Duplicate city id "${definition.id}".`, {
          contentId: definition.id,
        }),
      );
    }

    this.#cities.set(definition.id, definition);
    return Result.ok(undefined);
  }

  /** Returns a city definition by id. */
  get(id: string): CityDefinition | undefined {
    return this.#cities.get(id);
  }

  /** Returns all registered cities in deterministic id order. */
  getAll(): readonly CityDefinition[] {
    return Object.freeze(
      [...this.#cities.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  /** Returns whether a city is registered. */
  has(id: string): boolean {
    return this.#cities.has(id);
  }

  /** Returns the number of registered cities. */
  get size(): number {
    return this.#cities.size;
  }
}
