import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { validateGameContent } from './validateGameContent.js';
import { validateProductionGraphAcyclicity } from './validateProductionGraphAcyclicity.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const gameContentRoot = path.join(projectRoot, 'game-content');

const M10_CATALOG_MINIMUMS = Object.freeze({
  resources: 9,
  buildings: 23,
  recipes: 7,
  technologies: 21,
  employees: 19,
  transportRoutes: 14,
  supplyContractTemplates: 9,
  strategies: 11,
  npcCompanies: 6,
  regions: 4,
  cities: 7,
});

const M10_INDUSTRIAL_RESOURCE_IDS = Object.freeze([
  'steel',
  'machine_parts',
  'industrial_machinery',
  'advanced_electronics',
  'consumer_goods',
]);

describe('M10 final integration', () => {
  it('loads the complete M10 catalog under strict validation', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const content = result.value;

    expect(content.resourceTypes.size).toBeGreaterThanOrEqual(M10_CATALOG_MINIMUMS.resources);
    expect(content.buildingTypes.size).toBeGreaterThanOrEqual(M10_CATALOG_MINIMUMS.buildings);
    expect(content.recipes.size).toBeGreaterThanOrEqual(M10_CATALOG_MINIMUMS.recipes);
    expect(content.technologies.size).toBeGreaterThanOrEqual(M10_CATALOG_MINIMUMS.technologies);
    expect(content.employees.size).toBeGreaterThanOrEqual(M10_CATALOG_MINIMUMS.employees);
    expect(content.transportRoutes.size).toBeGreaterThanOrEqual(M10_CATALOG_MINIMUMS.transportRoutes);
    expect(content.supplyContractTemplates.size).toBeGreaterThanOrEqual(
      M10_CATALOG_MINIMUMS.supplyContractTemplates,
    );
    expect(content.strategies.size).toBeGreaterThanOrEqual(M10_CATALOG_MINIMUMS.strategies);
    expect(content.npcCompanies.size).toBeGreaterThanOrEqual(M10_CATALOG_MINIMUMS.npcCompanies);
    expect(content.regions.size).toBeGreaterThanOrEqual(M10_CATALOG_MINIMUMS.regions);
    expect(content.cities.size).toBeGreaterThanOrEqual(M10_CATALOG_MINIMUMS.cities);

    for (const resourceId of M10_INDUSTRIAL_RESOURCE_IDS) {
      expect(content.resourceTypes.has(resourceId)).toBe(true);
    }

    for (const region of content.regions.getAll()) {
      expect(region.regionalDemand.length).toBeGreaterThan(0);
      expect(region.regionalModifiers).toBeDefined();
    }
  });

  it('keeps the production graph acyclic across the full recipe catalog', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const cycleResult = validateProductionGraphAcyclicity(result.value.recipes);

    expect(cycleResult.ok).toBe(true);
  });
});
