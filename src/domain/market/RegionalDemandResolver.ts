/**
 * @module @domain/market/RegionalDemandResolver
 *
 * Resolves regional baseline demand from static content modifiers.
 */

/** Regional demand entry used for baseline demand resolution. */
export type RegionalDemandLookup = {
  readonly baselineDemand: number;
  readonly demandModifier: number;
};

/**
 * Computes effective baseline demand for one resource in a region.
 */
export function resolveRegionalBaselineDemand(
  entry: RegionalDemandLookup | undefined,
  defaultBaseline: number,
): number {
  if (entry === undefined) {
    return defaultBaseline;
  }

  return Math.round(entry.baselineDemand * entry.demandModifier);
}
