import { describe, expect, it } from 'vitest';
import { resolveRegionalBaselineDemand } from './RegionalDemandResolver.js';

describe('resolveRegionalBaselineDemand', () => {
  it('returns the default baseline when no regional entry exists', () => {
    expect(resolveRegionalBaselineDemand(undefined, 50)).toBe(50);
  });

  it('applies the regional demand modifier to the configured baseline', () => {
    expect(
      resolveRegionalBaselineDemand(
        {
          baselineDemand: 60,
          demandModifier: 1.25,
        },
        50,
      ),
    ).toBe(75);
  });
});
