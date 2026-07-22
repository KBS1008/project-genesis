import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGameContent } from './validateGameContent.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../game-content');

describe('validateGameContent', () => {
  it('loads and validates official game content', async () => {
    const result = await validateGameContent(gameContentRoot);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.resourceTypes.size).toBeGreaterThanOrEqual(3);
      expect(result.value.biomes.size).toBeGreaterThanOrEqual(2);
      expect(result.value.worlds.size).toBeGreaterThanOrEqual(1);
      expect(result.value.worlds.has('world_default')).toBe(true);
      expect(result.value.regions.size).toBeGreaterThanOrEqual(3);
      expect(result.value.regions.has('region_default')).toBe(true);
      expect(result.value.maps.size).toBeGreaterThanOrEqual(1);
      expect(result.value.maps.has('map_world_default')).toBe(true);
      expect(result.value.cities.size).toBeGreaterThanOrEqual(2);
      expect(result.value.cities.has('city_port_harbor')).toBe(true);
      expect(result.value.milestones.size).toBeGreaterThanOrEqual(1);
      expect(result.value.technologies.size).toBeGreaterThanOrEqual(1);
      expect(result.value.buildingTypes.size).toBeGreaterThanOrEqual(2);
      expect(result.value.employees.size).toBeGreaterThanOrEqual(5);
      expect(result.value.recipes.size).toBeGreaterThanOrEqual(1);
      expect(result.value.recipes.has('recipe_planks')).toBe(true);
      expect(result.value.transportRoutes.size).toBeGreaterThanOrEqual(1);
      expect(result.value.transportRoutes.has('route_storage_to_production')).toBe(true);
      expect(result.value.employees.has('employee_production_worker')).toBe(true);
      expect(result.value.strategies.size).toBeGreaterThanOrEqual(5);
      expect(result.value.strategies.has('strategy_balanced')).toBe(true);
    }
  });

  it('passes strict building/recipe consistency checks for official content', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);
  });
});
