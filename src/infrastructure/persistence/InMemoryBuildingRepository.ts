/**
 * @module @infrastructure/persistence/InMemoryBuildingRepository
 *
 * In-memory implementation of {@link BuildingRepository} for tests and local sessions.
 */

import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { Building } from '../../domain/building/Building.js';
import type { BuildingId } from '../../domain/building/BuildingId.js';
import type { BuildingRepository } from '../../domain/building/BuildingRepository.js';

/**
 * Stores building aggregates in memory.
 */
export class InMemoryBuildingRepository implements BuildingRepository {
  readonly #buildings = new Map<string, Building>();

  save(building: Building): void {
    this.#buildings.set(building.getId().value, building);
  }

  findById(id: BuildingId): Building | undefined {
    return this.#buildings.get(id.value);
  }

  findByCompanyId(companyId: CompanyId): readonly Building[] {
    return Object.freeze(
      [...this.#buildings.values()]
        .filter((building) => building.getCompanyId().value === companyId.value)
        .sort((left, right) => left.getId().value.localeCompare(right.getId().value)),
    );
  }
}
