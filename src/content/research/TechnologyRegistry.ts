/**
 * @module @content/research/TechnologyRegistry
 *
 * Read-only registry of validated technology definitions.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { TechnologyDefinition } from './TechnologyDefinition.js';

/**
 * Stores and provides access to loaded technology definitions.
 */
export class TechnologyRegistry {
  readonly #technologies = new Map<string, TechnologyDefinition>();

  /**
   * Registers a technology definition.
   */
  register(definition: TechnologyDefinition): Result<void, ContentLoadError> {
    if (this.#technologies.has(definition.id)) {
      return Result.fail(
        new ContentLoadError(`Duplicate technology id "${definition.id}".`, {
          contentId: definition.id,
        }),
      );
    }

    this.#technologies.set(definition.id, definition);
    return Result.ok(undefined);
  }

  /** Returns a technology definition by id. */
  get(id: string): TechnologyDefinition | undefined {
    return this.#technologies.get(id);
  }

  /** Returns all registered technologies in deterministic id order. */
  getAll(): readonly TechnologyDefinition[] {
    return Object.freeze(
      [...this.#technologies.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  /** Returns whether a technology is registered. */
  has(id: string): boolean {
    return this.#technologies.has(id);
  }

  /** Returns the number of registered technologies. */
  get size(): number {
    return this.#technologies.size;
  }
}
