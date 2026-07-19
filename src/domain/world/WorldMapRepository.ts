/**
 * @module @domain/world/WorldMapRepository
 *
 * Persistence contract for {@link WorldMap} runtime entities.
 */

import type { WorldMap } from './WorldMap.js';
import type { WorldMapId } from './WorldMapId.js';

/**
 * Provides access to persisted world map runtime entities.
 */
export interface WorldMapRepository {
  /** Persists a world map entity. */
  save(worldMap: WorldMap): void;

  /** Returns a world map by id, or undefined when not found. */
  findById(id: WorldMapId): WorldMap | undefined;

  /** Returns all world maps in deterministic id order. */
  findAll(): readonly WorldMap[];
}
