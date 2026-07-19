/**
 * @module @domain/policies/milestone/MilestoneTriggerPolicy
 *
 * Evaluates milestone trigger conditions against domain state snapshots.
 */

import {
  MilestoneTriggerType,
  type MilestoneEvaluationCandidate,
} from '../../milestone/MilestoneTrigger.js';

/** Finance-related milestone evaluation context. */
export type MilestoneFinanceEvaluationContext = {
  readonly cumulativeSaleRevenue: number;
};

/** Production-related milestone evaluation context. */
export type MilestoneProductionEvaluationContext = {
  readonly finishedProductionCount: number;
};

/**
 * Determines whether a milestone trigger is satisfied for finance events.
 */
export class MilestoneTriggerPolicy {
  static isFinanceTriggerMet(
    candidate: MilestoneEvaluationCandidate,
    context: MilestoneFinanceEvaluationContext,
  ): boolean {
    if (!candidate.enabled) {
      return false;
    }

    switch (candidate.trigger.type) {
      case MilestoneTriggerType.FIRST_SALE:
        return true;
      case MilestoneTriggerType.PROFIT_THRESHOLD:
        return context.cumulativeSaleRevenue >= candidate.trigger.amount;
      default:
        return false;
    }
  }

  static isProductionTriggerMet(
    candidate: MilestoneEvaluationCandidate,
    context: MilestoneProductionEvaluationContext,
  ): boolean {
    if (!candidate.enabled || candidate.trigger.type !== MilestoneTriggerType.PRODUCTION_VOLUME) {
      return false;
    }

    return context.finishedProductionCount >= candidate.trigger.count;
  }
}
