/**
 * @module @domain/market/MarketRegionalSupplyAggregator
 *
 * Aggregates regional resource supply from building storage in one region.
 */

import type { Building } from '../building/Building.js';
import type { BuildingStorage } from '../building/BuildingStorage.js';

/**
 * Sums available resource quantity stored in buildings located within a region.
 */
export function aggregateRegionalResourceSupply(
  buildings: readonly Building[],
  buildingStorages: readonly BuildingStorage[],
  regionId: string,
  resourceId: string,
): number {
  const buildingIdsInRegion = new Set(
    buildings
      .filter((building) => building.getRegionId().value === regionId)
      .map((building) => building.getId().value),
  );

  let totalSupply = 0;

  for (const storage of buildingStorages) {
    if (!buildingIdsInRegion.has(storage.getBuildingId().value)) {
      continue;
    }

    totalSupply += storage.getAvailable(resourceId);
  }

  return totalSupply;
}
