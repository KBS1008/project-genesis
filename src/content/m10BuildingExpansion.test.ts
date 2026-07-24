import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { BuildingCategory } from './building/BuildingTypeDefinition.js';
import { validateGameContent } from './validateGameContent.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const gameContentRoot = path.join(projectRoot, 'game-content');

const PHASE_2_BUILDINGS = Object.freeze([
  { id: 'distribution_center', category: BuildingCategory.STORAGE, storageCapacity: 1200 },
  { id: 'regional_headquarters', category: BuildingCategory.ADMINISTRATION },
  { id: 'corporate_headquarters', category: BuildingCategory.ADMINISTRATION },
  { id: 'training_center', category: BuildingCategory.ADMINISTRATION },
  { id: 'research_campus', category: BuildingCategory.RESEARCH },
  { id: 'university', category: BuildingCategory.RESEARCH },
  { id: 'logistics_hub', category: BuildingCategory.INFRASTRUCTURE },
  { id: 'rail_terminal', category: BuildingCategory.INFRASTRUCTURE },
  { id: 'port', category: BuildingCategory.INFRASTRUCTURE },
  { id: 'maintenance_facility', category: BuildingCategory.INFRASTRUCTURE },
  { id: 'recycling_facility', category: BuildingCategory.INFRASTRUCTURE },
  { id: 'solar_power_plant', category: BuildingCategory.ENERGY, energyGeneration: 35 },
]);

describe('M10 building expansion content', () => {
  it('loads Phase 2 buildings across administration, storage, research, infrastructure, and energy', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const { buildingTypes, milestones } = result.value;

    for (const building of PHASE_2_BUILDINGS) {
      const definition = buildingTypes.get(building.id);
      expect(definition).toBeDefined();
      expect(definition?.category).toBe(building.category);
      expect(definition?.requiredMilestones.length).toBeGreaterThan(0);

      for (const milestoneId of definition?.requiredMilestones ?? []) {
        expect(milestones.has(milestoneId)).toBe(true);
      }
    }

    expect(buildingTypes.get('distribution_center')?.storageCapacity).toBe(1200);
    expect(buildingTypes.get('solar_power_plant')?.energyGeneration).toBe(35);
    expect(buildingTypes.size).toBeGreaterThanOrEqual(23);
  });
});
