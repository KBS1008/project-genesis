/**
 * @module @application/services/createRegionalModifierResolver
 *
 * Builds deterministic regional modifier lookups from loaded region content.
 */

import type { RegionRegistry } from '../../content/region/RegionRegistry.js';
import type { RegionalModifierLookup } from '../../domain/region/RegionalModifierResolver.js';
import { DEFAULT_REGIONAL_MODIFIER_LOOKUP } from '../../domain/region/RegionalModifierResolver.js';

/** Resolves regional modifier profile for one region. */
export type RegionalModifierResolver = (regionId: string) => RegionalModifierLookup;

/**
 * Creates a lookup function from validated region modifier profiles.
 */
export function createRegionalModifierResolver(regions: RegionRegistry): RegionalModifierResolver {
  const modifiersByRegion = new Map<string, RegionalModifierLookup>();

  for (const region of regions.getAll()) {
    modifiersByRegion.set(region.id, region.regionalModifiers);
  }

  return (regionId: string): RegionalModifierLookup => {
    return modifiersByRegion.get(regionId) ?? DEFAULT_REGIONAL_MODIFIER_LOOKUP;
  };
}
