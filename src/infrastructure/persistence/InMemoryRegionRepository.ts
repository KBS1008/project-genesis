/**
 * @module @infrastructure/persistence/InMemoryRegionRepository
 *
 * In-memory implementation of {@link RegionRepository}.
 */

import type { WorldId } from '../../domain/world/WorldId.js';
import type { Region } from '../../domain/region/Region.js';
import type { RegionId } from '../../domain/region/RegionId.js';
import type { RegionRepository } from '../../domain/region/RegionRepository.js';

/**
 * Stores region entities in memory.
 */
export class InMemoryRegionRepository implements RegionRepository {
  readonly #regions = new Map<string, Region>();

  save(region: Region): void {
    this.#regions.set(region.getId().value, region);
  }

  findById(id: RegionId): Region | undefined {
    return this.#regions.get(id.value);
  }

  findAll(): readonly Region[] {
    return Object.freeze(
      [...this.#regions.values()].sort((left, right) =>
        left.getId().value.localeCompare(right.getId().value),
      ),
    );
  }

  findByWorldId(worldId: WorldId): readonly Region[] {
    return Object.freeze(
      [...this.#regions.values()]
        .filter((region) => region.getWorldId().equals(worldId))
        .sort((left, right) => left.getId().value.localeCompare(right.getId().value)),
    );
  }
}
