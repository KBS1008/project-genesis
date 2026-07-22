/**
 * @module @domain/brain/GoalKind
 *
 * Categories of long-term company objectives generated during planning.
 */

/** Supported goal kinds for company planning. */
export const GoalKind = {
  INCREASE_PRODUCTION: 'INCREASE_PRODUCTION',
  SECURE_SUPPLY: 'SECURE_SUPPLY',
  EXPAND_REGION: 'EXPAND_REGION',
  REDUCE_COSTS: 'REDUCE_COSTS',
  IMPROVE_PROFITABILITY: 'IMPROVE_PROFITABILITY',
  INVEST_RESEARCH: 'INVEST_RESEARCH',
  STABILIZE_LIQUIDITY: 'STABILIZE_LIQUIDITY',
} as const;

/** Union of all goal kind values. */
export type GoalKind = (typeof GoalKind)[keyof typeof GoalKind];

/** All supported goal kinds in deterministic order. */
export const GOAL_KINDS: readonly GoalKind[] = Object.freeze([
  GoalKind.EXPAND_REGION,
  GoalKind.IMPROVE_PROFITABILITY,
  GoalKind.INCREASE_PRODUCTION,
  GoalKind.INVEST_RESEARCH,
  GoalKind.REDUCE_COSTS,
  GoalKind.SECURE_SUPPLY,
  GoalKind.STABILIZE_LIQUIDITY,
]);

/** Returns whether a value is a supported goal kind. */
export function isGoalKind(value: string): value is GoalKind {
  return (GOAL_KINDS as readonly string[]).includes(value);
}
