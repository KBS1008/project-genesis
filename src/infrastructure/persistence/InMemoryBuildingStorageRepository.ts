/**
 * @module @infrastructure/persistence/InMemoryBuildingStorageRepository
 */

import type { BuildingId } from '../../domain/building/BuildingId.js';
import type { BuildingStorage } from '../../domain/building/BuildingStorage.js';
import type { BuildingStorageRepository } from '../../domain/building/BuildingStorageRepository.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';

export class InMemoryBuildingStorageRepository implements BuildingStorageRepository {
  readonly #storages = new Map<string, BuildingStorage>();

  save(storage: BuildingStorage): void {
    this.#storages.set(storage.getBuildingId().value, storage);
  }

  findByBuildingId(buildingId: BuildingId): BuildingStorage | undefined {
    return this.#storages.get(buildingId.value);
  }

  findByCompanyId(companyId: CompanyId): readonly BuildingStorage[] {
    return Object.freeze(
      [...this.#storages.values()]
        .filter((storage) => storage.getCompanyId().value === companyId.value)
        .sort((left, right) =>
          left.getBuildingId().value.localeCompare(right.getBuildingId().value),
        ),
    );
  }
}
