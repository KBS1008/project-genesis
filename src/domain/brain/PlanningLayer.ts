/**
 * @module @domain/brain/PlanningLayer
 *
 * Deterministic planning layers for company decisions.
 */

/** Supported planning layers ordered from long-term to short-term. */
export const PlanningLayer = {
  STRATEGIC: 'STRATEGIC',
  OPERATIONAL: 'OPERATIONAL',
  TACTICAL: 'TACTICAL',
} as const;

/** Union of all planning layer values. */
export type PlanningLayer = (typeof PlanningLayer)[keyof typeof PlanningLayer];

/** All supported planning layers in deterministic order. */
export const PLANNING_LAYERS: readonly PlanningLayer[] = Object.freeze([
  PlanningLayer.OPERATIONAL,
  PlanningLayer.STRATEGIC,
  PlanningLayer.TACTICAL,
]);

/** Returns whether a value is a supported planning layer. */
export function isPlanningLayer(value: string): value is PlanningLayer {
  return (PLANNING_LAYERS as readonly string[]).includes(value);
}

/** Default priority weight offsets per planning layer (higher executes first). */
export const PLANNING_LAYER_PRIORITY_BASE: Readonly<Record<PlanningLayer, number>> = Object.freeze({
  [PlanningLayer.STRATEGIC]: 300,
  [PlanningLayer.OPERATIONAL]: 200,
  [PlanningLayer.TACTICAL]: 100,
});
