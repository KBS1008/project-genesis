/**
 * @module @domain/world/WorldRepository
 *
 * Persistence contract for {@link World} runtime entities.
 */

import type { World } from './World.js';
import type { WorldId } from './WorldId.js';

/**
 * Provides access to persisted world runtime entities.
 */
export interface WorldRepository {
  /** Persists a world entity. */
  save(world: World): void;

  /** Returns a world by id, or undefined when not found. */
  findById(id: WorldId): World | undefined;

  /** Returns all worlds in deterministic id order. */
  findAll(): readonly World[];
}
