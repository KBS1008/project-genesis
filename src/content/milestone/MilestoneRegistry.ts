/**
 * @module @content/milestone/MilestoneRegistry
 *
 * Read-only registry of validated milestone definitions.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { MilestoneDefinition } from './MilestoneDefinition.js';

/**
 * Stores and provides access to loaded milestone definitions.
 */
export class MilestoneRegistry {
  readonly #milestones = new Map<string, MilestoneDefinition>();

  /**
   * Registers a milestone definition.
   */
  register(definition: MilestoneDefinition): Result<void, ContentLoadError> {
    if (this.#milestones.has(definition.id)) {
      return Result.fail(
        new ContentLoadError(`Duplicate milestone id "${definition.id}".`, {
          contentId: definition.id,
        }),
      );
    }

    this.#milestones.set(definition.id, definition);
    return Result.ok(undefined);
  }

  /** Returns a milestone definition by id. */
  get(id: string): MilestoneDefinition | undefined {
    return this.#milestones.get(id);
  }

  /** Returns all registered milestones in deterministic id order. */
  getAll(): readonly MilestoneDefinition[] {
    return Object.freeze(
      [...this.#milestones.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  /** Returns whether a milestone is registered. */
  has(id: string): boolean {
    return this.#milestones.has(id);
  }

  /** Returns the number of registered milestones. */
  get size(): number {
    return this.#milestones.size;
  }
}
