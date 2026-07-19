/**
 * @module @application/services/WorldBootstrapService
 *
 * Initializes runtime world and region entities from validated game content.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { GameContentLoadResult } from '../../content/validateGameContent.js';
import { Region } from '../../domain/region/Region.js';
import type { RegionRepository } from '../../domain/region/RegionRepository.js';
import { World } from '../../domain/world/World.js';
import type { WorldRepository } from '../../domain/world/WorldRepository.js';

/** Dependencies for {@link WorldBootstrapService}. */
export type WorldBootstrapServiceDependencies = {
  readonly worldRepository: WorldRepository;
  readonly regionRepository: RegionRepository;
};

/**
 * Seeds runtime world and region state from static content registries.
 */
export class WorldBootstrapService {
  readonly #worldRepository: WorldBootstrapServiceDependencies['worldRepository'];
  readonly #regionRepository: WorldBootstrapServiceDependencies['regionRepository'];

  constructor(dependencies: WorldBootstrapServiceDependencies) {
    this.#worldRepository = dependencies.worldRepository;
    this.#regionRepository = dependencies.regionRepository;
  }

  /**
   * Initializes worlds and regions when repositories are empty.
   */
  bootstrap(content: GameContentLoadResult): Result<void, ValidationError> {
    if (this.#worldRepository.findAll().length > 0) {
      return Result.ok(undefined);
    }

    const enabledRegions = content.regions.getAll().filter((definition) => definition.enabled);

    for (const definition of enabledRegions) {
      const regionResult = Region.fromContent({
        id: definition.id,
        name: definition.name,
        description: definition.description,
        worldId: definition.worldId,
        biomeId: definition.biomeId,
        mapPosition: definition.mapPosition,
        neighborRegionIds: definition.neighborRegionIds,
        cityIds: definition.cityIds,
        regionalResources: definition.regionalResources.map((entry) => ({
          resourceTypeId: entry.resourceTypeId,
          available: entry.available,
          extractionModifier: entry.extractionModifier,
        })),
      });

      if (!regionResult.ok) {
        return Result.fail(regionResult.error);
      }

      this.#regionRepository.save(regionResult.value);
    }

    const enabledWorlds = content.worlds.getAll().filter((definition) => definition.enabled);

    for (const definition of enabledWorlds) {
      const worldResult = World.fromContent({
        id: definition.id,
        name: definition.name,
        regionIds: definition.regionIds,
      });

      if (!worldResult.ok) {
        return Result.fail(worldResult.error);
      }

      const membershipResult = this.#validateWorldMembership(worldResult.value);

      if (!membershipResult.ok) {
        return membershipResult;
      }

      this.#worldRepository.save(worldResult.value);
    }

    const orphanRegionResult = this.#validateRegionMembership();

    if (!orphanRegionResult.ok) {
      return orphanRegionResult;
    }

    return Result.ok(undefined);
  }

  #validateWorldMembership(world: World): Result<void, ValidationError> {
    for (const regionId of world.getRegionIds()) {
      const region = this.#regionRepository.findById(regionId);

      if (region === undefined) {
        return Result.fail(
          new ValidationError(
            `World "${world.getId().value}" references unknown region "${regionId.value}".`,
          ),
        );
      }

      if (!region.getWorldId().equals(world.getId())) {
        return Result.fail(
          new ValidationError(
            `Region "${region.getId().value}" belongs to world "${region.getWorldId().value}" but is listed on world "${world.getId().value}".`,
          ),
        );
      }
    }

    return Result.ok(undefined);
  }

  #validateRegionMembership(): Result<void, ValidationError> {
    for (const region of this.#regionRepository.findAll()) {
      const world = this.#worldRepository.findById(region.getWorldId());

      if (world === undefined) {
        return Result.fail(
          new ValidationError(
            `Region "${region.getId().value}" references unknown world "${region.getWorldId().value}".`,
          ),
        );
      }

      if (!world.containsRegion(region.getId())) {
        return Result.fail(
          new ValidationError(
            `Region "${region.getId().value}" is not listed in world "${world.getId().value}" regionIds.`,
          ),
        );
      }
    }

    for (const region of this.#regionRepository.findAll()) {
      const neighborResult = this.#validateNeighborMembership(region);

      if (!neighborResult.ok) {
        return neighborResult;
      }
    }

    return Result.ok(undefined);
  }

  #validateNeighborMembership(region: Region): Result<void, ValidationError> {
    for (const neighborId of region.getNeighborRegionIds()) {
      const neighbor = this.#regionRepository.findById(neighborId);

      if (neighbor === undefined) {
        return Result.fail(
          new ValidationError(
            `Region "${region.getId().value}" references unknown neighbor "${neighborId.value}".`,
          ),
        );
      }

      if (!neighbor.getWorldId().equals(region.getWorldId())) {
        return Result.fail(
          new ValidationError(
            `Region "${region.getId().value}" neighbor "${neighborId.value}" belongs to a different world.`,
          ),
        );
      }
    }

    return Result.ok(undefined);
  }
}
