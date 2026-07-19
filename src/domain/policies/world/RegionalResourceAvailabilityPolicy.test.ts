import { Region } from '../../region/Region.js';
import { RegionalResourceAvailabilityPolicy } from './RegionalResourceAvailabilityPolicy.js';

function createRegion(
  regionalResources: readonly {
    readonly resourceTypeId: string;
    readonly available: boolean;
    readonly extractionModifier: number;
  }[],
): Region {
  const result = Region.fromContent({
    id: 'region_default',
    name: 'Central Basin',
    description: 'Starter region.',
    worldId: 'world_default',
    biomeId: 'biome_temperate_forest',
    mapPosition: { x: 0, y: 0 },
    neighborRegionIds: [],
    cityIds: [],
    regionalResources,
  });

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('RegionalResourceAvailabilityPolicy', () => {
  const region = createRegion([
    { resourceTypeId: 'planks', available: true, extractionModifier: 1.0 },
    { resourceTypeId: 'wood', available: true, extractionModifier: 1.0 },
  ]);

  it('returns availability for listed resources', () => {
    const result = RegionalResourceAvailabilityPolicy.resolveAvailability(region, 'wood');

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.extractionModifier).toBe(1.0);
    }
  });

  it('rejects resources that are not listed in the region', () => {
    const result = RegionalResourceAvailabilityPolicy.resolveAvailability(region, 'iron_ore');

    expect(result.ok).toBe(false);
  });

  it('rejects resources marked unavailable', () => {
    const restrictedRegion = createRegion([
      { resourceTypeId: 'wood', available: false, extractionModifier: 1.0 },
    ]);

    const result = RegionalResourceAvailabilityPolicy.resolveAvailability(restrictedRegion, 'wood');

    expect(result.ok).toBe(false);
  });

  it('validates recipe inputs in deterministic resource order', () => {
    const result = RegionalResourceAvailabilityPolicy.validateRecipeInputs(region, [
      { resource: 'wood' },
      { resource: 'planks' },
    ]);

    expect(result.ok).toBe(true);
  });

  it('fails recipe validation when an input is missing in the region', () => {
    const result = RegionalResourceAvailabilityPolicy.validateRecipeInputs(region, [
      { resource: 'steel' },
    ]);

    expect(result.ok).toBe(false);
  });
});
