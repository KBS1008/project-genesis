/**
 * @module @application/services/createRegionalBaselineDemandResolver
 *
 * Builds a deterministic regional demand lookup from loaded region content.
 */

import type { RegionRegistry } from '../../content/region/RegionRegistry.js';
import { MARKET_BASELINE_DEMAND } from '../../domain/market/MarketPriceConstants.js';
import { resolveRegionalBaselineDemand } from '../../domain/market/RegionalDemandResolver.js';

/** Resolves baseline demand for one resource in one region. */
export type RegionalBaselineDemandResolver = (
  regionId: string,
  resourceId: string,
) => number;

/**
 * Creates a lookup function from validated region demand profiles.
 */
export function createRegionalBaselineDemandResolver(
  regions: RegionRegistry,
): RegionalBaselineDemandResolver {
  const demandByRegion = new Map<
    string,
    ReadonlyMap<string, { readonly baselineDemand: number; readonly demandModifier: number }>
  >();

  for (const region of regions.getAll()) {
    const resourceDemand = new Map<
      string,
      { readonly baselineDemand: number; readonly demandModifier: number }
    >();

    for (const entry of region.regionalDemand) {
      resourceDemand.set(entry.resourceTypeId, entry);
    }

    demandByRegion.set(region.id, resourceDemand);
  }

  return (regionId: string, resourceId: string): number => {
    const regionDemand = demandByRegion.get(regionId);
    const entry = regionDemand?.get(resourceId);

    return resolveRegionalBaselineDemand(entry, MARKET_BASELINE_DEMAND);
  };
}
