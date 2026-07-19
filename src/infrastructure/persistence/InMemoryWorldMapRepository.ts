/**
 * @module @infrastructure/persistence/InMemoryWorldMapRepository
 *
 * In-memory implementation of {@link WorldMapRepository}.
 */

import type { WorldMap } from '../../domain/world/WorldMap.js';
import type { WorldMapId } from '../../domain/world/WorldMapId.js';
import type { WorldMapRepository } from '../../domain/world/WorldMapRepository.js';

/**
 * Stores world map entities in memory.
 */
export class InMemoryWorldMapRepository implements WorldMapRepository {
  readonly #maps = new Map<string, WorldMap>();

  save(worldMap: WorldMap): void {
    this.#maps.set(worldMap.getId().value, worldMap);
  }

  findById(id: WorldMapId): WorldMap | undefined {
    return this.#maps.get(id.value);
  }

  findAll(): readonly WorldMap[] {
    return Object.freeze(
      [...this.#maps.values()].sort((left, right) =>
        left.getId().value.localeCompare(right.getId().value),
      ),
    );
  }
}
