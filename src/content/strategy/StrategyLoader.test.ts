import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { StrategyLoader } from './StrategyLoader.js';
import { StrategyRegistry } from './StrategyRegistry.js';
import { validateStrategyDefinition } from './StrategyValidator.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentDirectory = path.resolve(testDirectory, '../../../game-content/strategies');

describe('StrategyLoader', () => {
  const loader = new StrategyLoader();

  it('loads official game content strategies', async () => {
    const result = await loader.loadFromDirectory(gameContentDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.size).toBeGreaterThanOrEqual(5);
      expect(result.value.has('strategy_balanced')).toBe(true);

      const balanced = result.value.get('strategy_balanced');

      expect(balanced?.weights.productionWeight).toBe(50);
      expect(balanced?.enabled).toBe(true);
    }
  });

  it('rejects duplicate strategy ids across files', async () => {
    const registry = new StrategyRegistry();
    const loadResult = await loader.loadFile(
      path.join(gameContentDirectory, 'strategy_balanced.yaml'),
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
    const result = validateStrategyDefinition({
      id: 'INVALID-ID',
      name: 'Invalid',
      description: 'Invalid id test.',
      profile: 'INVALID',
      weights: {
        expansionWeight: 50,
        productionWeight: 50,
        tradingWeight: 50,
        researchWeight: 50,
        riskTolerance: 50,
        liquidityPreference: 50,
      },
      enabled: true,
      version: 1,
    });

    expect(result.ok).toBe(false);
  });

  it('rejects weight values outside the 0-100 range', () => {
    const result = validateStrategyDefinition({
      id: 'strategy_invalid',
      name: 'Invalid',
      description: 'Invalid weights.',
      profile: 'INVALID',
      weights: {
        expansionWeight: 101,
        productionWeight: 50,
        tradingWeight: 50,
        researchWeight: 50,
        riskTolerance: 50,
        liquidityPreference: 50,
      },
      enabled: true,
      version: 1,
    });

    expect(result.ok).toBe(false);
  });
});
