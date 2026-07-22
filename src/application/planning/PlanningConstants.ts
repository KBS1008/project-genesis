/**
 * @module @application/planning/PlanningConstants
 *
 * Deterministic planning frequency and stock thresholds for M8.
 */

import { PlanningLayer as PlanningLayerValues, type PlanningLayer } from '../../domain/brain/PlanningLayer.js';

/** Tick intervals between planning runs per layer. */
export const PLANNING_TICK_INTERVALS: Readonly<Record<PlanningLayer, number>> = Object.freeze({
  [PlanningLayerValues.STRATEGIC]: 100,
  [PlanningLayerValues.OPERATIONAL]: 10,
  [PlanningLayerValues.TACTICAL]: 1,
});

/** Default target inventory units derived from strategy production weight. */
export function computeTargetStock(productionWeight: number): number {
  return Math.round(10 + productionWeight * 0.2);
}

/** Minimum stock before a shortage is reported. */
export function computeMinimumStock(liquidityPreference: number): number {
  return Math.round(5 + liquidityPreference * 0.05);
}

/** Cash threshold below which liquidity pressure is reported. */
export function computeLiquidityThreshold(liquidityPreference: number): number {
  return Math.round(500 + liquidityPreference * 10);
}

/** Returns whether a planning layer should execute on the given tick. */
export function shouldRunPlanningLayer(tickNumber: number, layer: PlanningLayer): boolean {
  if (tickNumber <= 0) {
    return false;
  }

  return tickNumber % PLANNING_TICK_INTERVALS[layer] === 0;
}

/** Returns layers that should run on a tick in deterministic order. */
export function resolvePlanningLayersForTick(tickNumber: number): readonly PlanningLayer[] {
  const layers: PlanningLayer[] = [];

  if (shouldRunPlanningLayer(tickNumber, PlanningLayerValues.STRATEGIC)) {
    layers.push(PlanningLayerValues.STRATEGIC);
  }

  if (shouldRunPlanningLayer(tickNumber, PlanningLayerValues.OPERATIONAL)) {
    layers.push(PlanningLayerValues.OPERATIONAL);
  }

  if (shouldRunPlanningLayer(tickNumber, PlanningLayerValues.TACTICAL)) {
    layers.push(PlanningLayerValues.TACTICAL);
  }

  return Object.freeze(layers);
}

/** Maximum units considered in a single planned trade. */
export const PLANNING_MAX_TRADE_BATCH = 50;

/** Memory retention in simulation ticks. */
export const PLANNING_MEMORY_RETENTION_TICKS = 1000;
