import { describe, expect, it } from 'vitest';
import {
  DEFAULT_REGIONAL_MODIFIER_LOOKUP,
  resolveRegionalConstructionCostMultiplier,
  resolveRegionalConstructionCost,
  resolveRegionalEnergyAvailabilityMultiplier,
  resolveRegionalPopulationDemandScale,
  resolveRegionalResearchMultiplier,
  resolveRegionalResearchDuration,
} from './RegionalModifierResolver.js';

describe('RegionalModifierResolver', () => {
  const coastalProfile = Object.freeze({
    populationIndex: 55,
    infrastructureLevel: 0.95,
    educationIndex: 0.85,
    energyAvailabilityModifier: 1,
    environmentalModifier: 1.05,
  });

  it('returns neutral multipliers for default lookup', () => {
    expect(resolveRegionalConstructionCostMultiplier()).toBe(1);
    expect(resolveRegionalEnergyAvailabilityMultiplier()).toBe(1);
    expect(resolveRegionalResearchMultiplier()).toBe(1);
    expect(resolveRegionalPopulationDemandScale()).toBe(1);
  });

  it('combines infrastructure and environmental modifiers for construction', () => {
    expect(resolveRegionalConstructionCostMultiplier(coastalProfile)).toBe(1);
  });

  it('scales population demand relative to the default index', () => {
    expect(resolveRegionalPopulationDemandScale(coastalProfile)).toBe(1.1);
    expect(resolveRegionalPopulationDemandScale(DEFAULT_REGIONAL_MODIFIER_LOOKUP)).toBe(1);
  });

  it('applies infrastructure and environment to construction cost', () => {
    expect(resolveRegionalConstructionCost(5000, DEFAULT_REGIONAL_MODIFIER_LOOKUP)).toBe(5000);
    expect(resolveRegionalConstructionCost(5000, coastalProfile)).toBe(5000);
    expect(
      resolveRegionalConstructionCost(5000, {
        populationIndex: 65,
        infrastructureLevel: 1.2,
        educationIndex: 1.1,
        energyAvailabilityModifier: 1.15,
        environmentalModifier: 0.95,
      }),
    ).toBe(5700);
  });

  it('shortens research duration when education index is above one', () => {
    expect(resolveRegionalResearchDuration(100, DEFAULT_REGIONAL_MODIFIER_LOOKUP)).toBe(100);
    expect(
      resolveRegionalResearchDuration(100, {
        ...DEFAULT_REGIONAL_MODIFIER_LOOKUP,
        educationIndex: 1.1,
      }),
    ).toBe(91);
  });
});
