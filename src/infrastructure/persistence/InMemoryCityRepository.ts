/**
 * @module @infrastructure/persistence/InMemoryCityRepository
 *
 * In-memory implementation of {@link CityRepository}.
 */

import type { CityId } from '../../domain/region/CityId.js';
import type { RegionId } from '../../domain/region/RegionId.js';
import type { City } from '../../domain/city/City.js';
import type { CityRepository } from '../../domain/city/CityRepository.js';

/**
 * Stores city entities in memory.
 */
export class InMemoryCityRepository implements CityRepository {
  readonly #cities = new Map<string, City>();

  save(city: City): void {
    this.#cities.set(city.getId().value, city);
  }

  findById(id: CityId): City | undefined {
    return this.#cities.get(id.value);
  }

  findAll(): readonly City[] {
    return Object.freeze(
      [...this.#cities.values()].sort((left, right) =>
        left.getId().value.localeCompare(right.getId().value),
      ),
    );
  }

  findByRegionId(regionId: RegionId): readonly City[] {
    return Object.freeze(
      [...this.#cities.values()]
        .filter((city) => city.getRegionId().equals(regionId))
        .sort((left, right) => left.getId().value.localeCompare(right.getId().value)),
    );
  }
}
