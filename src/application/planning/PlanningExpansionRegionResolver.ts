/**
 * @module @application/planning/PlanningExpansionRegionResolver
 *
 * Resolves cross-region expansion targets from the world map graph.
 */

import { createRegionId } from '../../domain/region/RegionId.js';
import { DEFAULT_MAP_ID } from '../../domain/world/WorldConstants.js';
import type { WorldMapRepository } from '../../domain/world/WorldMapRepository.js';
import { createWorldMapId } from '../../domain/world/WorldMapId.js';

/** Resolves the next connected region suitable for expansion. */
export function resolveExpansionTargetRegion(params: {
  readonly primaryRegionId: string;
  readonly occupiedRegionIds: readonly string[];
  readonly worldMapRepository: WorldMapRepository;
}): string | undefined {
  const mapIdResult = createWorldMapId(DEFAULT_MAP_ID);

  if (!mapIdResult.ok) {
    return undefined;
  }

  const map = params.worldMapRepository.findById(mapIdResult.value);

  if (map === undefined) {
    return undefined;
  }

  const occupied = new Set(params.occupiedRegionIds);
  const candidates = new Set<string>();

  for (const connection of map.getConnections()) {
    const endpoints = Object.freeze([
      connection.fromRegionId.value,
      connection.toRegionId.value,
    ]);

    for (const endpoint of endpoints) {
      if (!occupied.has(endpoint)) {
        continue;
      }

      const otherEndpoint =
        endpoint === connection.fromRegionId.value
          ? connection.toRegionId.value
          : connection.fromRegionId.value;

      if (occupied.has(otherEndpoint)) {
        continue;
      }

      const otherRegionIdResult = createRegionId(otherEndpoint);

      if (!otherRegionIdResult.ok) {
        continue;
      }

      candidates.add(otherRegionIdResult.value.value);
    }
  }

  const sortedCandidates = [...candidates].sort((left, right) => left.localeCompare(right));

  if (sortedCandidates.length === 0) {
    return undefined;
  }

  if (occupied.size === 1 && occupied.has(params.primaryRegionId)) {
    return sortedCandidates.find((regionId) => regionId !== params.primaryRegionId) ?? sortedCandidates[0];
  }

  return sortedCandidates[0];
}
