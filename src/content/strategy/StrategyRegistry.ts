/**
 * @module @content/strategy/StrategyRegistry
 *
 * Read-only registry of validated strategy definitions.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { StrategyDefinition } from './StrategyDefinition.js';

/**
 * Stores and provides access to loaded strategy definitions.
 */
export class StrategyRegistry {
  readonly #strategies = new Map<string, StrategyDefinition>();

  /** Registers a strategy definition. */
  register(definition: StrategyDefinition): Result<void, ContentLoadError> {
    if (this.#strategies.has(definition.id)) {
      return Result.fail(
        new ContentLoadError(`Duplicate strategy id "${definition.id}".`, {
          contentId: definition.id,
        }),
      );
    }

    this.#strategies.set(definition.id, definition);
    return Result.ok(undefined);
  }

  /** Returns a strategy definition by id. */
  get(id: string): StrategyDefinition | undefined {
    return this.#strategies.get(id);
  }

  /** Returns all registered strategies in deterministic id order. */
  getAll(): readonly StrategyDefinition[] {
    return Object.freeze(
      [...this.#strategies.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  /** Returns enabled strategies in deterministic id order. */
  getEnabled(): readonly StrategyDefinition[] {
    return Object.freeze(this.getAll().filter((strategy) => strategy.enabled));
  }

  /** Returns whether a strategy is registered. */
  has(id: string): boolean {
    return this.#strategies.has(id);
  }

  /** Returns the number of registered strategies. */
  get size(): number {
    return this.#strategies.size;
  }
}
