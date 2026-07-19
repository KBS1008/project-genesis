/**
 * @module @infrastructure/persistence/InMemoryWorldRepository
 *
 * In-memory implementation of {@link WorldRepository}.
 */

import type { World } from '../../domain/world/World.js';
import type { WorldId } from '../../domain/world/WorldId.js';
import type { WorldRepository } from '../../domain/world/WorldRepository.js';

/**
 * Stores world entities in memory.
 */
export class InMemoryWorldRepository implements WorldRepository {
  readonly #worlds = new Map<string, World>();

  save(world: World): void {
    this.#worlds.set(world.getId().value, world);
  }

  findById(id: WorldId): World | undefined {
    return this.#worlds.get(id.value);
  }

  findAll(): readonly World[] {
    return Object.freeze(
      [...this.#worlds.values()].sort((left, right) =>
        left.getId().value.localeCompare(right.getId().value),
      ),
    );
  }
}
