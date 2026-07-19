import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TechnologyLoader } from './TechnologyLoader.js';
import { TechnologyRegistry } from './TechnologyRegistry.js';
import { validateTechnologyDefinition } from './TechnologyValidator.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const fixturesDirectory = path.resolve(testDirectory, '../../../tests/fixtures/research');
const gameContentDirectory = path.resolve(testDirectory, '../../../game-content/research');

describe('TechnologyLoader', () => {
  const loader = new TechnologyLoader();

  it('loads valid technology fixtures into a registry', async () => {
    const result = await loader.loadFromDirectory(fixturesDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.size).toBe(1);
      expect(result.value.has('basic_woodworking')).toBe(true);

      const technology = result.value.get('basic_woodworking');
      expect(technology?.category).toBe('PRODUCTION');
      expect(technology?.researchCost).toBe(1000);
    }
  });

  it('loads official game content technologies', async () => {
    const result = await loader.loadFromDirectory(gameContentDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.size).toBeGreaterThanOrEqual(1);
    }
  });

  it('rejects duplicate technology ids across files', async () => {
    const registry = new TechnologyRegistry();
    const loadResult = await loader.loadFile(
      path.join(fixturesDirectory, 'basic_woodworking.yaml'),
    );

    expect(loadResult.ok).toBe(true);

    if (loadResult.ok) {
      const firstRegister = registry.register(loadResult.value);
      const secondRegister = registry.register(loadResult.value);

      expect(firstRegister.ok).toBe(true);
      expect(secondRegister.ok).toBe(false);
    }
  });

  it('rejects invalid global ids', () => {
    const result = validateTechnologyDefinition({
      id: 'INVALID-ID',
      name: 'Invalid',
      description: 'Invalid id test.',
      category: 'PRODUCTION',
      requiredResearch: [],
      requiredMilestones: [],
      researchCost: 0,
      researchDuration: 0,
      enabled: true,
      version: 1,
    });

    expect(result.ok).toBe(false);
  });
});
