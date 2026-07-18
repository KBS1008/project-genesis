/**
 * @module @content/logistics/TransportRouteRegistry
 *
 * Read-only registry of validated transport route definitions.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { TransportRouteDefinition } from './TransportRouteDefinition.js';

/**
 * Stores and provides access to loaded transport route definitions.
 */
export class TransportRouteRegistry {
  readonly #routes = new Map<string, TransportRouteDefinition>();

  /**
   * Registers a transport route definition.
   */
  register(definition: TransportRouteDefinition): Result<void, ContentLoadError> {
    if (this.#routes.has(definition.id)) {
      return Result.fail(
        new ContentLoadError(`Duplicate transport route id "${definition.id}".`, {
          contentId: definition.id,
        }),
      );
    }

    this.#routes.set(definition.id, definition);
    return Result.ok(undefined);
  }

  /** Returns a route definition by id. */
  get(id: string): TransportRouteDefinition | undefined {
    return this.#routes.get(id);
  }

  /** Returns all registered routes in deterministic id order. */
  getAll(): readonly TransportRouteDefinition[] {
    return Object.freeze(
      [...this.#routes.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  /** Returns whether a route is registered. */
  has(id: string): boolean {
    return this.#routes.has(id);
  }

  /** Returns the number of registered routes. */
  get size(): number {
    return this.#routes.size;
  }
}
