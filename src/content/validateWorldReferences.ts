/**
 * @module @content/validateWorldReferences
 *
 * Validates cross-registry references for world content graph.
 */

import { Result } from '../common/result/Result.js';
import type { BiomeRegistry } from './biome/BiomeRegistry.js';
import type { CityRegistry } from './city/CityRegistry.js';
import { ContentLoadError } from './errors/ContentLoadError.js';
import type { MapRegistry } from './map/MapRegistry.js';
import type { RegionRegistry } from './region/RegionRegistry.js';
import type { ResourceTypeRegistry } from './resource/ResourceTypeRegistry.js';
import type { WorldRegistry } from './world/WorldRegistry.js';

function validateReference(
  ownerId: string,
  field: string,
  reference: string,
  has: (id: string) => boolean,
  registryName: string,
): Result<void, ContentLoadError> {
  if (!has(reference)) {
    return Result.fail(
      new ContentLoadError(
        `${ownerId} references unknown ${registryName} "${reference}" in "${field}".`,
        { contentId: ownerId },
      ),
    );
  }

  return Result.ok(undefined);
}

function validateReferenceList(
  ownerId: string,
  field: string,
  references: readonly string[],
  has: (id: string) => boolean,
  registryName: string,
): Result<void, ContentLoadError> {
  for (const reference of references) {
    const result = validateReference(ownerId, field, reference, has, registryName);

    if (!result.ok) {
      return result;
    }
  }

  return Result.ok(undefined);
}

/**
 * Ensures world, region, map and city references resolve across registries.
 */
export function validateWorldReferences(
  worlds: WorldRegistry,
  regions: RegionRegistry,
  biomes: BiomeRegistry,
  maps: MapRegistry,
  cities: CityRegistry,
  resourceTypes: ResourceTypeRegistry,
): Result<void, ContentLoadError> {
  for (const world of worlds.getAll()) {
    const regionResult = validateReferenceList(
      world.id,
      'regionIds',
      world.regionIds,
      regions.has.bind(regions),
      'region',
    );

    if (!regionResult.ok) {
      return regionResult;
    }
  }

  for (const region of regions.getAll()) {
    const worldResult = validateReference(
      region.id,
      'worldId',
      region.worldId,
      worlds.has.bind(worlds),
      'world',
    );

    if (!worldResult.ok) {
      return worldResult;
    }

    const biomeResult = validateReference(
      region.id,
      'biomeId',
      region.biomeId,
      biomes.has.bind(biomes),
      'biome',
    );

    if (!biomeResult.ok) {
      return biomeResult;
    }

    const neighborResult = validateReferenceList(
      region.id,
      'neighborRegionIds',
      region.neighborRegionIds,
      regions.has.bind(regions),
      'region',
    );

    if (!neighborResult.ok) {
      return neighborResult;
    }

    const cityResult = validateReferenceList(
      region.id,
      'cityIds',
      region.cityIds,
      cities.has.bind(cities),
      'city',
    );

    if (!cityResult.ok) {
      return cityResult;
    }

    for (const entry of region.regionalResources) {
      const resourceResult = validateReference(
        region.id,
        'regionalResources.resourceTypeId',
        entry.resourceTypeId,
        resourceTypes.has.bind(resourceTypes),
        'resource type',
      );

      if (!resourceResult.ok) {
        return resourceResult;
      }
    }

    const world = worlds.get(region.worldId);

    if (world !== undefined && !world.regionIds.includes(region.id)) {
      return Result.fail(
        new ContentLoadError(
          `Region "${region.id}" is not listed in world "${world.id}" regionIds.`,
          { contentId: region.id },
        ),
      );
    }
  }

  for (const map of maps.getAll()) {
    for (const placement of map.regions) {
      const regionResult = validateReference(
        map.id,
        'regions.regionId',
        placement.regionId,
        regions.has.bind(regions),
        'region',
      );

      if (!regionResult.ok) {
        return regionResult;
      }
    }

    for (const connection of map.connections) {
      const fromResult = validateReference(
        map.id,
        'connections.fromRegionId',
        connection.fromRegionId,
        regions.has.bind(regions),
        'region',
      );

      if (!fromResult.ok) {
        return fromResult;
      }

      const toResult = validateReference(
        map.id,
        'connections.toRegionId',
        connection.toRegionId,
        regions.has.bind(regions),
        'region',
      );

      if (!toResult.ok) {
        return toResult;
      }
    }
  }

  for (const city of cities.getAll()) {
    const regionResult = validateReference(
      city.id,
      'regionId',
      city.regionId,
      regions.has.bind(regions),
      'region',
    );

    if (!regionResult.ok) {
      return regionResult;
    }

    const region = regions.get(city.regionId);

    if (region !== undefined && !region.cityIds.includes(city.id)) {
      return Result.fail(
        new ContentLoadError(
          `City "${city.id}" is not listed in region "${region.id}" cityIds.`,
          { contentId: city.id },
        ),
      );
    }
  }

  return Result.ok(undefined);
}
