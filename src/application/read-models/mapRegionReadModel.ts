/**
 * @module @application/read-models/mapRegionReadModel
 *
 * Maps domain regions to read models with authoritative biome presentation metadata.
 */

import type { BiomeRegistry } from '../../content/biome/BiomeRegistry.js';
import type { Region } from '../../domain/region/Region.js';
import type { RegionReadModel } from './RegionReadModel.js';

/** Maps a region aggregate to a read model enriched from game content biomes. */
export function mapRegionReadModel(region: Region, biomes: BiomeRegistry): RegionReadModel {
  const mapPosition = region.getMapPosition();
  const biomeId = region.getBiomeId();
  const biome = biomes.get(biomeId);

  return Object.freeze({
    id: region.getId().value,
    name: region.getName(),
    description: region.getDescription(),
    worldId: region.getWorldId().value,
    biomeId,
    biomeName: biome?.name ?? biomeId,
    biomeCategory: biome?.category ?? 'UNKNOWN',
    mapX: mapPosition.x,
    mapY: mapPosition.y,
    neighborRegionIds: Object.freeze(
      region.getNeighborRegionIds().map((neighborId) => neighborId.value),
    ),
    cityIds: Object.freeze(region.getCityIds().map((cityId) => cityId.value)),
  });
}
