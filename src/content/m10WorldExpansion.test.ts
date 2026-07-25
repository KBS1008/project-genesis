import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { CityCategory } from './city/CityDefinition.js';
import { createRegionalModifierResolver } from '../application/services/createRegionalModifierResolver.js';
import {
  resolveRegionalConstructionCostMultiplier,
  resolveRegionalPopulationDemandScale,
} from '../domain/region/RegionalModifierResolver.js';
import { validateGameContent } from './validateGameContent.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const gameContentRoot = path.join(projectRoot, 'game-content');

const PHASE_8_REGION_MODIFIERS = Object.freeze([
  {
    regionId: 'region_default',
    populationIndex: 65,
    constructionMultiplier: 1.14,
    populationDemandScale: 1.3,
  },
  {
    regionId: 'region_east',
    populationIndex: 80,
    constructionMultiplier: 1.19,
    populationDemandScale: 1.6,
  },
  {
    regionId: 'region_north',
    populationIndex: 40,
    constructionMultiplier: 0.94,
    populationDemandScale: 0.8,
  },
  {
    regionId: 'region_south',
    populationIndex: 55,
    constructionMultiplier: 1,
    populationDemandScale: 1.1,
  },
]);

const PHASE_8_CITIES = Object.freeze([
  { id: 'city_south_harbor', regionId: 'region_south', category: CityCategory.MARKET_HUB },
  {
    id: 'city_south_agricultural_yard',
    regionId: 'region_south',
    category: CityCategory.INDUSTRIAL,
  },
]);

describe('M10 world expansion content', () => {
  it('loads regional modifiers, southern region, coastal biome, and expanded world graph', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const { regions, cities, biomes, worlds, maps } = result.value;

    expect(regions.size).toBeGreaterThanOrEqual(4);
    expect(cities.size).toBeGreaterThanOrEqual(7);
    expect(biomes.has('biome_coastal_lowlands')).toBe(true);
    expect(regions.has('region_south')).toBe(true);

    const defaultWorld = worlds.get('world_default');
    expect(defaultWorld?.regionIds).toContain('region_south');

    const defaultMap = maps.get('map_world_default');
    expect(defaultMap?.regions.some((placement) => placement.regionId === 'region_south')).toBe(
      true,
    );
    expect(defaultMap?.connections.length).toBeGreaterThanOrEqual(5);

    const southRegion = regions.get('region_south');
    expect(southRegion?.biomeId).toBe('biome_coastal_lowlands');
    expect(southRegion?.neighborRegionIds).toEqual(['region_default', 'region_east']);
    expect(southRegion?.regionalResources.some((entry) => entry.resourceTypeId === 'wood')).toBe(
      true,
    );
    expect(
      southRegion?.regionalDemand.some((entry) => entry.resourceTypeId === 'consumer_goods'),
    ).toBe(true);

    const resolveModifiers = createRegionalModifierResolver(regions);

    for (const profile of PHASE_8_REGION_MODIFIERS) {
      const region = regions.get(profile.regionId);
      expect(region).toBeDefined();
      expect(region?.regionalModifiers.populationIndex).toBe(profile.populationIndex);

      const modifiers = resolveModifiers(profile.regionId);
      expect(resolveRegionalConstructionCostMultiplier(modifiers)).toBe(
        profile.constructionMultiplier,
      );
      expect(resolveRegionalPopulationDemandScale(modifiers)).toBe(profile.populationDemandScale);
    }

    for (const city of PHASE_8_CITIES) {
      const definition = cities.get(city.id);
      expect(definition).toBeDefined();
      expect(definition?.regionId).toBe(city.regionId);
      expect(definition?.category).toBe(city.category);
      expect(regions.get(city.regionId)?.cityIds).toContain(city.id);
    }
  });
});
