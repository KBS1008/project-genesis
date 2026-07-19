/**
 * @module @domain/milestone/MilestoneTrigger
 *
 * Domain-owned milestone trigger shapes supplied by the application layer.
 */

/** Supported milestone trigger types for version 1. */
export const MilestoneTriggerType = {
  FIRST_SALE: 'FIRST_SALE',
  PRODUCTION_VOLUME: 'PRODUCTION_VOLUME',
  PROFIT_THRESHOLD: 'PROFIT_THRESHOLD',
} as const;

export type MilestoneTriggerType = (typeof MilestoneTriggerType)[keyof typeof MilestoneTriggerType];

/** Trigger configuration for the first market sale. */
export type FirstSaleMilestoneTrigger = {
  readonly type: typeof MilestoneTriggerType.FIRST_SALE;
};

/** Trigger configuration based on completed production jobs. */
export type ProductionVolumeMilestoneTrigger = {
  readonly type: typeof MilestoneTriggerType.PRODUCTION_VOLUME;
  readonly count: number;
  readonly recipeId?: string;
};

/** Trigger configuration based on cumulative sale revenue. */
export type ProfitThresholdMilestoneTrigger = {
  readonly type: typeof MilestoneTriggerType.PROFIT_THRESHOLD;
  readonly amount: number;
};

/** Trigger configuration for automatic milestone detection. */
export type MilestoneTrigger =
  | FirstSaleMilestoneTrigger
  | ProductionVolumeMilestoneTrigger
  | ProfitThresholdMilestoneTrigger;

/** Milestone metadata required for trigger evaluation. */
export type MilestoneEvaluationCandidate = {
  readonly milestoneId: string;
  readonly enabled: boolean;
  readonly trigger: MilestoneTrigger;
};
