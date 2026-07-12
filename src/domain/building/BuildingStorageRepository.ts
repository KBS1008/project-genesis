/**
 * @module @domain/building/BuildingStorageRepository
 */

import type { BuildingId } from './BuildingId.js';
import type { CompanyId } from '../company/CompanyId.js';
import type { BuildingStorage } from './BuildingStorage.js';

export interface BuildingStorageRepository {
  save(storage: BuildingStorage): void;
  findByBuildingId(buildingId: BuildingId): BuildingStorage | undefined;
  findByCompanyId(companyId: CompanyId): readonly BuildingStorage[];
}
