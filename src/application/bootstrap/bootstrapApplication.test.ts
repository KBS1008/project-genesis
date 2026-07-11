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
      expect(result.value.clock.now()).toBe(0);
      expect(result.value.simulationEngine.state.tickNumber).toBe(0);
    }
  });
});
