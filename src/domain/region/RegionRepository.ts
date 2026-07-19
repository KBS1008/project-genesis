/**
 * @module @domain/region/RegionRepository
 *
 * Persistence contract for {@link Region} runtime entities.
 */

import type { WorldId } from '../world/WorldId.js';
import type { Region } from './Region.js';
import type { RegionId } from './RegionId.js';

/**
 * Provides access to persisted region runtime entities.
 */
export interface RegionRepository {
  /** Persists a region entity. */
  save(region: Region): void;

  /** Returns a region by id, or undefined when not found. */
  findById(id: RegionId): Region | undefined;

  /** Returns all regions in deterministic id order. */
  findAll(): readonly Region[];

  /** Returns regions belonging to a world in deterministic id order. */
  findByWorldId(worldId: WorldId): readonly Region[];
}
