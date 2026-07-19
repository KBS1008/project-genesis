/**
 * @module @application/services/WorldBootstrapService
 *
 * Initializes runtime world, region, city and map entities from validated game content.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { GameContentLoadResult } from '../../content/validateGameContent.js';
import { City } from '../../domain/city/City.js';
import type { CityRepository } from '../../domain/city/CityRepository.js';
import { RegionConnectivityPolicy } from '../../domain/policies/world/RegionConnectivityPolicy.js';
import { Region } from '../../domain/region/Region.js';
import type { RegionRepository } from '../../domain/region/RegionRepository.js';
import { World } from '../../domain/world/World.js';
import { DEFAULT_MAP_ID, DEFAULT_WORLD_ID } from '../../domain/world/WorldConstants.js';
import { WorldMap } from '../../domain/world/WorldMap.js';
import type { WorldMapRepository } from '../../domain/world/WorldMapRepository.js';
import { createWorldId } from '../../domain/world/WorldId.js';
import { createWorldMapId } from '../../domain/world/WorldMapId.js';
import type { WorldRepository } from '../../domain/world/WorldRepository.js';

/** Dependencies for {@link WorldBootstrapService}. */
export type WorldBootstrapServiceDependencies = {
  readonly worldRepository: WorldRepository;
  readonly regionRepository: RegionRepository;
  readonly cityRepository: CityRepository;
  readonly worldMapRepository: WorldMapRepository;
};

/**
 * Seeds runtime world graph state from static content registries.
 */
export class WorldBootstrapService {
  readonly #worldRepository: WorldBootstrapServiceDependencies['worldRepository'];
  readonly #regionRepository: WorldBootstrapServiceDependencies['regionRepository'];
  readonly #cityRepository: WorldBootstrapServiceDependencies['cityRepository'];
  readonly #worldMapRepository: WorldBootstrapServiceDependencies['worldMapRepository'];

  constructor(dependencies: WorldBootstrapServiceDependencies) {
    this.#worldRepository = dependencies.worldRepository;
    this.#regionRepository = dependencies.regionRepository;
    this.#cityRepository = dependencies.cityRepository;
    this.#worldMapRepository = dependencies.worldMapRepository;
  }

  /**
   * Initializes worlds, regions, cities and maps when repositories are empty.
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

    const enabledCities = content.cities.getAll().filter((definition) => definition.enabled);

    for (const definition of enabledCities) {
      const cityResult = City.fromContent({
        id: definition.id,
        name: definition.name,
        regionId: definition.regionId,
        category: definition.category,
      });

      if (!cityResult.ok) {
        return Result.fail(cityResult.error);
      }

      this.#cityRepository.save(cityResult.value);
    }

    const enabledMaps = content.maps.getAll().filter((definition) => definition.enabled);

    for (const definition of enabledMaps) {
      const mapResult = WorldMap.fromContent({
        id: definition.id,
        name: definition.name,
        regions: definition.regions.map((placement) => ({
          regionId: placement.regionId,
          x: placement.x,
          y: placement.y,
        })),
        connections: definition.connections.map((connection) => ({
          fromRegionId: connection.fromRegionId,
          toRegionId: connection.toRegionId,
          distance: connection.distance,
        })),
      });

      if (!mapResult.ok) {
        return Result.fail(mapResult.error);
      }

      this.#worldMapRepository.save(mapResult.value);
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

    const cityMembershipResult = this.#validateCityMembership();

    if (!cityMembershipResult.ok) {
      return cityMembershipResult;
    }

    const mapGraphResult = this.#validateDefaultMapGraph(content);

    if (!mapGraphResult.ok) {
      return mapGraphResult;
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

  #validateCityMembership(): Result<void, ValidationError> {
    for (const city of this.#cityRepository.findAll()) {
      const region = this.#regionRepository.findById(city.getRegionId());

      if (region === undefined) {
        return Result.fail(
          new ValidationError(
            `City "${city.getId().value}" references unknown region "${city.getRegionId().value}".`,
          ),
        );
      }

      if (!region.getCityIds().some((cityId) => cityId.equals(city.getId()))) {
        return Result.fail(
          new ValidationError(
            `City "${city.getId().value}" is not listed in region "${region.getId().value}" cityIds.`,
          ),
        );
      }
    }

    return Result.ok(undefined);
  }

  #validateDefaultMapGraph(content: GameContentLoadResult): Result<void, ValidationError> {
    const defaultWorldIdResult = createWorldId(DEFAULT_WORLD_ID);

    if (!defaultWorldIdResult.ok) {
      return Result.fail(defaultWorldIdResult.error);
    }

    const defaultMapIdResult = createWorldMapId(DEFAULT_MAP_ID);

    if (!defaultMapIdResult.ok) {
      return Result.fail(defaultMapIdResult.error);
    }

    const defaultWorld = this.#worldRepository.findById(defaultWorldIdResult.value);

    if (defaultWorld === undefined) {
      return Result.fail(
        new ValidationError(`Default world "${DEFAULT_WORLD_ID}" was not bootstrapped.`),
      );
    }

    const defaultMap = this.#worldMapRepository.findById(defaultMapIdResult.value);

    if (defaultMap === undefined) {
      return Result.fail(
        new ValidationError(`Default world map "${DEFAULT_MAP_ID}" was not bootstrapped.`),
      );
    }

    for (const regionId of defaultWorld.getRegionIds()) {
      if (defaultMap.getRegionPlacement(regionId) === undefined) {
        return Result.fail(
          new ValidationError(
            `Default world map "${DEFAULT_MAP_ID}" is missing placement for region "${regionId.value}".`,
          ),
        );
      }
    }

    for (const region of this.#regionRepository.findAll()) {
      if (!region.getWorldId().equals(defaultWorld.getId())) {
        continue;
      }

      for (const neighborId of region.getNeighborRegionIds()) {
        const connectivityResult = RegionConnectivityPolicy.resolveDistance({
          map: defaultMap,
          fromRegionId: region.getId(),
          toRegionId: neighborId,
        });

        if (!connectivityResult.ok) {
          return Result.fail(
            new ValidationError(
              `Region "${region.getId().value}" neighbor "${neighborId.value}" is not connected on map "${DEFAULT_MAP_ID}".`,
            ),
          );
        }

        const contentRegion = content.regions.get(region.getId().value);
        const contentNeighbor = content.regions.get(neighborId.value);

        if (contentRegion !== undefined && contentNeighbor !== undefined) {
          const reverseNeighbor = contentNeighbor.neighborRegionIds.includes(region.getId().value);

          if (!reverseNeighbor) {
            return Result.fail(
              new ValidationError(
                `Region neighbor relation between "${region.getId().value}" and "${neighborId.value}" is not symmetric in content.`,
              ),
            );
          }
        }
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
