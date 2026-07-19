/**
 * @module @domain/city/CityRepository
 *
 * Persistence contract for {@link City} runtime entities.
 */

import type { RegionId } from '../region/RegionId.js';
import type { City } from './City.js';
import type { CityId } from '../region/CityId.js';

/**
 * Provides access to persisted city runtime entities.
 */
export interface CityRepository {
  /** Persists a city entity. */
  save(city: City): void;

  /** Returns a city by id, or undefined when not found. */
  findById(id: CityId): City | undefined;

  /** Returns all cities in deterministic id order. */
  findAll(): readonly City[];

  /** Returns cities belonging to a region in deterministic id order. */
  findByRegionId(regionId: RegionId): readonly City[];
}
