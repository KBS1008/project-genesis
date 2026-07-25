import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { CityCategory } from './city/CityDefinition.js';
import { createRegionalBaselineDemandResolver } from '../application/services/createRegionalBaselineDemandResolver.js';
import { validateGameContent } from './validateGameContent.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const gameContentRoot = path.join(projectRoot, 'game-content');

const REGION_DEMAND_PROFILES = Object.freeze([
  {
    regionId: 'region_default',
    resourceId: 'consumer_goods',
    expectedDemand: 127,
  },
  {
    regionId: 'region_east',
    resourceId: 'steel',
    expectedDemand: 136,
  },
  {
    regionId: 'region_north',
    resourceId: 'wood',
    expectedDemand: 44,
  },
]);

const PHASE_6_CITIES = Object.freeze([
  { id: 'city_central_market', regionId: 'region_default', category: CityCategory.MARKET_HUB },
  { id: 'city_north_trading_post', regionId: 'region_north', category: CityCategory.MARKET_HUB },
  { id: 'city_east_commercial_yard', regionId: 'region_east', category: CityCategory.MARKET_HUB },
]);

const PHASE_6_CONTRACTS = Object.freeze([
  {
    id: 'contract_npc_wood_001',
    resourceId: 'wood',
    autoGrantOnNewGame: true,
    regionId: 'region_default',
  },
  {
    id: 'contract_export_planks',
    resourceId: 'planks',
    buildingId: 'distribution_center',
    researchId: 'distribution_networks',
  },
  {
    id: 'contract_export_steel',
    resourceId: 'steel',
    buildingId: 'machine_shop',
    researchId: 'advanced_metallurgy',
  },
  {
    id: 'contract_export_machine_parts',
    resourceId: 'machine_parts',
    buildingId: 'assembly_plant',
    researchId: 'precision_machining',
  },
  {
    id: 'contract_export_industrial_machinery',
    resourceId: 'industrial_machinery',
    buildingId: 'electronics_factory',
    researchId: 'industrial_assembly',
  },
  {
    id: 'contract_export_advanced_electronics',
    resourceId: 'advanced_electronics',
    buildingId: 'electronics_factory',
    researchId: 'circuit_design',
  },
  {
    id: 'contract_export_consumer_goods',
    resourceId: 'consumer_goods',
    buildingId: 'consumer_goods_plant',
    researchId: 'distribution_networks',
  },
  {
    id: 'contract_port_bulk_wood',
    resourceId: 'wood',
    buildingId: 'port',
    researchId: 'intermodal_logistics',
  },
  {
    id: 'contract_rail_steel_freight',
    resourceId: 'steel',
    buildingId: 'rail_terminal',
    researchId: 'intermodal_logistics',
  },
]);

describe('M10 economy expansion content', () => {
  it('loads regional demand profiles, trade cities, and export contract templates', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const { regions, cities, supplyContractTemplates, resourceTypes, buildingTypes, technologies } =
      result.value;

    expect(supplyContractTemplates.size).toBeGreaterThanOrEqual(9);
    expect(cities.size).toBeGreaterThanOrEqual(5);

    const resolveDemand = createRegionalBaselineDemandResolver(regions);

    for (const profile of REGION_DEMAND_PROFILES) {
      const region = regions.get(profile.regionId);
      expect(region).toBeDefined();
      expect(
        region?.regionalDemand.some((entry) => entry.resourceTypeId === profile.resourceId),
      ).toBe(true);
      expect(resolveDemand(profile.regionId, profile.resourceId)).toBe(profile.expectedDemand);
    }

    expect(resolveDemand('region_default', 'iron_ore')).toBe(65);

    for (const city of PHASE_6_CITIES) {
      const definition = cities.get(city.id);
      expect(definition).toBeDefined();
      expect(definition?.regionId).toBe(city.regionId);
      expect(definition?.category).toBe(city.category);
      expect(regions.get(city.regionId)?.cityIds).toContain(city.id);
    }

    for (const contract of PHASE_6_CONTRACTS) {
      const template = supplyContractTemplates.get(contract.id);
      expect(template).toBeDefined();
      expect(template?.resourceId).toBe(contract.resourceId);
      expect(resourceTypes.has(contract.resourceId)).toBe(true);

      if ('autoGrantOnNewGame' in contract) {
        expect(template?.autoGrantOnNewGame).toBe(contract.autoGrantOnNewGame);
        expect(template?.regionId).toBe(contract.regionId);
      }

      if ('buildingId' in contract) {
        expect(template?.requirements.buildings).toContain(contract.buildingId);
        expect(buildingTypes.has(contract.buildingId)).toBe(true);
      }

      if ('researchId' in contract) {
        expect(template?.requirements.research).toContain(contract.researchId);
        expect(technologies.has(contract.researchId)).toBe(true);
      }
    }

    const starterContracts = supplyContractTemplates
      .getEnabled()
      .filter((template) => template.autoGrantOnNewGame);
    expect(starterContracts).toHaveLength(1);
    expect(starterContracts[0]?.id).toBe('contract_npc_wood_001');
  });
});
