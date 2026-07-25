/**
 * @module @content/economy/SupplyContractTemplateRegistry
 *
 * Read-only registry of validated supply contract templates.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { SupplyContractTemplateDefinition } from './SupplyContractTemplateDefinition.js';

/**
 * Stores and provides access to loaded supply contract templates.
 */
export class SupplyContractTemplateRegistry {
  readonly #templates = new Map<string, SupplyContractTemplateDefinition>();

  /** Registers a supply contract template. */
  register(definition: SupplyContractTemplateDefinition): Result<void, ContentLoadError> {
    if (this.#templates.has(definition.id)) {
      return Result.fail(
        new ContentLoadError(`Duplicate supply contract template id "${definition.id}".`, {
          contentId: definition.id,
        }),
      );
    }

    this.#templates.set(definition.id, definition);
    return Result.ok(undefined);
  }

  /** Returns a template by id. */
  get(id: string): SupplyContractTemplateDefinition | undefined {
    return this.#templates.get(id);
  }

  /** Returns all registered templates in deterministic id order. */
  getAll(): readonly SupplyContractTemplateDefinition[] {
    return Object.freeze(
      [...this.#templates.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  /** Returns enabled templates in deterministic id order. */
  getEnabled(): readonly SupplyContractTemplateDefinition[] {
    return Object.freeze(this.getAll().filter((template) => template.enabled));
  }

  /** Returns whether a template is registered. */
  has(id: string): boolean {
    return this.#templates.has(id);
  }

  /** Returns the number of registered templates. */
  get size(): number {
    return this.#templates.size;
  }
}
