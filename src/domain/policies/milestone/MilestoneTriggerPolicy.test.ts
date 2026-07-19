/**
 * @module @domain/policies/milestone/MilestoneTriggerPolicy.test
 *
 * Unit tests for {@link MilestoneTriggerPolicy}.
 */

import {
  MilestoneTriggerType,
  type MilestoneEvaluationCandidate,
} from '../../milestone/MilestoneTrigger.js';
import { MilestoneTriggerPolicy } from './MilestoneTriggerPolicy.js';

function createCandidate(
  overrides: Partial<MilestoneEvaluationCandidate> & Pick<MilestoneEvaluationCandidate, 'trigger'>,
): MilestoneEvaluationCandidate {
  return {
    milestoneId: 'first_profit',
    enabled: true,
    ...overrides,
  };
}

describe('MilestoneTriggerPolicy', () => {
  describe('isFinanceTriggerMet', () => {
    it('returns true for an enabled FIRST_SALE trigger', () => {
      const result = MilestoneTriggerPolicy.isFinanceTriggerMet(
        createCandidate({
          milestoneId: 'first_profit',
          trigger: { type: MilestoneTriggerType.FIRST_SALE },
        }),
        { cumulativeSaleRevenue: 1 },
      );

      expect(result).toBe(true);
    });

    it('returns false for a disabled FIRST_SALE trigger', () => {
      const result = MilestoneTriggerPolicy.isFinanceTriggerMet(
        createCandidate({
          enabled: false,
          trigger: { type: MilestoneTriggerType.FIRST_SALE },
        }),
        { cumulativeSaleRevenue: 1 },
      );

      expect(result).toBe(false);
    });

    it('returns true when cumulative sale revenue reaches the profit threshold', () => {
      const result = MilestoneTriggerPolicy.isFinanceTriggerMet(
        createCandidate({
          milestoneId: 'profit_100',
          trigger: { type: MilestoneTriggerType.PROFIT_THRESHOLD, amount: 100 },
        }),
        { cumulativeSaleRevenue: 100 },
      );

      expect(result).toBe(true);
    });

    it('returns false when cumulative sale revenue is below the profit threshold', () => {
      const result = MilestoneTriggerPolicy.isFinanceTriggerMet(
        createCandidate({
          milestoneId: 'profit_100',
          trigger: { type: MilestoneTriggerType.PROFIT_THRESHOLD, amount: 100 },
        }),
        { cumulativeSaleRevenue: 99 },
      );

      expect(result).toBe(false);
    });

    it('returns false for production volume triggers in finance evaluation', () => {
      const result = MilestoneTriggerPolicy.isFinanceTriggerMet(
        createCandidate({
          milestoneId: 'first_production',
          trigger: { type: MilestoneTriggerType.PRODUCTION_VOLUME, count: 1 },
        }),
        { cumulativeSaleRevenue: 1000 },
      );

      expect(result).toBe(false);
    });
  });

  describe('isProductionTriggerMet', () => {
    it('returns true when finished production count reaches the threshold', () => {
      const result = MilestoneTriggerPolicy.isProductionTriggerMet(
        createCandidate({
          milestoneId: 'first_production',
          trigger: { type: MilestoneTriggerType.PRODUCTION_VOLUME, count: 1 },
        }),
        { finishedProductionCount: 1 },
      );

      expect(result).toBe(true);
    });

    it('returns false when finished production count is below the threshold', () => {
      const result = MilestoneTriggerPolicy.isProductionTriggerMet(
        createCandidate({
          milestoneId: 'first_steel',
          trigger: {
            type: MilestoneTriggerType.PRODUCTION_VOLUME,
            count: 1,
            recipeId: 'recipe_steel',
          },
        }),
        { finishedProductionCount: 0 },
      );

      expect(result).toBe(false);
    });

    it('returns false for a disabled production volume trigger', () => {
      const result = MilestoneTriggerPolicy.isProductionTriggerMet(
        createCandidate({
          enabled: false,
          trigger: { type: MilestoneTriggerType.PRODUCTION_VOLUME, count: 1 },
        }),
        { finishedProductionCount: 5 },
      );

      expect(result).toBe(false);
    });

    it('returns false for finance triggers in production evaluation', () => {
      const result = MilestoneTriggerPolicy.isProductionTriggerMet(
        createCandidate({
          milestoneId: 'profit_100',
          trigger: { type: MilestoneTriggerType.PROFIT_THRESHOLD, amount: 100 },
        }),
        { finishedProductionCount: 5 },
      );

      expect(result).toBe(false);
    });
  });
});
