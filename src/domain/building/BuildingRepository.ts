/**
 * @module @domain/building/BuildingRepository
 *
 * Persistence contract for {@link Building} aggregate roots.
 *
 * Concrete implementations belong to the Infrastructure layer.
 */

import type { CompanyId } from '../company/CompanyId.js';
import type { RegionId } from '../region/RegionId.js';
import type { Building } from './Building.js';
import type { BuildingId } from './BuildingId.js';

/**
 * Provides access to persisted building aggregates.
 */
export interface BuildingRepository {
  /** Persists a building aggregate. */
  save(building: Building): void;

  /** Returns a building by id, or undefined when not found. */
  findById(id: BuildingId): Building | undefined;

  /** Returns all buildings owned by a company in deterministic id order. */
  findByCompanyId(companyId: CompanyId): readonly Building[];

  /** Returns all buildings in a region in deterministic id order. */
  findByRegionId(regionId: RegionId): readonly Building[];

  /** Returns all buildings under construction in deterministic id order. */
  findUnderConstruction(): readonly Building[];

  /** Returns all persisted buildings in deterministic id order. */
  findAll(): readonly Building[];
}
