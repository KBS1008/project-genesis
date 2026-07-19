import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bootstrapApplication } from './bootstrapApplication.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

describe('bootstrapApplication', () => {
  it('loads game content and wires application dependencies', async () => {
    const result = await bootstrapApplication({ gameContentRoot });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.gameContent.resourceTypes.size).toBeGreaterThanOrEqual(3);
      expect(result.value.gameContent.buildingTypes.size).toBeGreaterThanOrEqual(2);
      expect(result.value.gameContent.worlds.has('world_default')).toBe(true);
      expect(result.value.gameContent.regions.has('region_default')).toBe(true);
      expect(result.value.worldRepository.findAll()).toHaveLength(1);
      expect(result.value.regionRepository.findAll()).toHaveLength(3);
      expect(result.value.cityRepository.findAll()).toHaveLength(2);
      expect(result.value.worldMapRepository.findAll()).toHaveLength(1);
      expect(result.value.marketRepository.findAll()).toHaveLength(1);
      expect(result.value.clock.now()).toBe(0);
      expect(result.value.simulationEngine.state.tickNumber).toBe(0);
    }
  });
});
