/**
 * @module @domain/region/RegionalModifierResolver
 *
 * Resolves effective regional simulation modifiers from static content.
 */

/** Regional modifier profile used for multiplier resolution. */
export type RegionalModifierLookup = {
  readonly populationIndex: number;
  readonly infrastructureLevel: number;
  readonly educationIndex: number;
  readonly energyAvailabilityModifier: number;
  readonly environmentalModifier: number;
};

/** Neutral defaults when a region omits modifier content. */
export const DEFAULT_REGIONAL_MODIFIER_LOOKUP: RegionalModifierLookup = Object.freeze({
  populationIndex: 50,
  infrastructureLevel: 1,
  educationIndex: 1,
  energyAvailabilityModifier: 1,
  environmentalModifier: 1,
});

/**
 * Resolves a construction cost multiplier from regional infrastructure and environment.
 */
export function resolveRegionalConstructionCostMultiplier(
  modifiers: RegionalModifierLookup = DEFAULT_REGIONAL_MODIFIER_LOOKUP,
): number {
  return roundModifier(modifiers.infrastructureLevel * modifiers.environmentalModifier);
}

/**
 * Resolves an energy availability multiplier for regional production overhead.
 */
export function resolveRegionalEnergyAvailabilityMultiplier(
  modifiers: RegionalModifierLookup = DEFAULT_REGIONAL_MODIFIER_LOOKUP,
): number {
  return roundModifier(modifiers.energyAvailabilityModifier);
}

/**
 * Resolves a research throughput multiplier from regional education.
 */
export function resolveRegionalResearchMultiplier(
  modifiers: RegionalModifierLookup = DEFAULT_REGIONAL_MODIFIER_LOOKUP,
): number {
  return roundModifier(modifiers.educationIndex);
}

/**
 * Resolves a population-weighted demand scale for regional markets.
 */
export function resolveRegionalPopulationDemandScale(
  modifiers: RegionalModifierLookup = DEFAULT_REGIONAL_MODIFIER_LOOKUP,
): number {
  return roundModifier(modifiers.populationIndex / DEFAULT_REGIONAL_MODIFIER_LOOKUP.populationIndex);
}

/**
 * Applies regional infrastructure and environment modifiers to a base construction cost.
 */
export function resolveRegionalConstructionCost(
  baseCost: number,
  modifiers: RegionalModifierLookup = DEFAULT_REGIONAL_MODIFIER_LOOKUP,
): number {
  return Math.max(0, Math.round(baseCost * resolveRegionalConstructionCostMultiplier(modifiers)));
}

/**
 * Applies regional education to research duration (higher education shortens duration).
 */
export function resolveRegionalResearchDuration(
  baseDuration: number,
  modifiers: RegionalModifierLookup = DEFAULT_REGIONAL_MODIFIER_LOOKUP,
): number {
  const multiplier = resolveRegionalResearchMultiplier(modifiers);

  if (multiplier <= 0) {
    return Math.max(1, baseDuration);
  }

  return Math.max(1, Math.round(baseDuration / multiplier));
}

function roundModifier(value: number): number {
  return Math.round(value * 100) / 100;
}
