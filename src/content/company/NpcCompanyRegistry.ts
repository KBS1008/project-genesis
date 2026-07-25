/**
 * @module @content/company/NpcCompanyRegistry
 *
 * Read-only registry of validated NPC company definitions.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { NpcCompanyDefinition } from './NpcCompanyDefinition.js';

/**
 * Stores and provides access to loaded NPC company definitions.
 */
export class NpcCompanyRegistry {
  readonly #companies = new Map<string, NpcCompanyDefinition>();

  /** Registers an NPC company definition. */
  register(definition: NpcCompanyDefinition): Result<void, ContentLoadError> {
    if (this.#companies.has(definition.id)) {
      return Result.fail(
        new ContentLoadError(`Duplicate NPC company id "${definition.id}".`, {
          contentId: definition.id,
        }),
      );
    }

    this.#companies.set(definition.id, definition);
    return Result.ok(undefined);
  }

  /** Returns an NPC company definition by id. */
  get(id: string): NpcCompanyDefinition | undefined {
    return this.#companies.get(id);
  }

  /** Returns all registered NPC companies in deterministic id order. */
  getAll(): readonly NpcCompanyDefinition[] {
    return Object.freeze(
      [...this.#companies.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  /** Returns enabled NPC companies in deterministic id order. */
  getEnabled(): readonly NpcCompanyDefinition[] {
    return Object.freeze(this.getAll().filter((company) => company.enabled));
  }

  /** Returns whether an NPC company is registered. */
  has(id: string): boolean {
    return this.#companies.has(id);
  }

  /** Returns the number of registered NPC companies. */
  get size(): number {
    return this.#companies.size;
  }
}
