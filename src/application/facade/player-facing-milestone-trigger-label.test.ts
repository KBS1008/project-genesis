import { describe, expect, it } from 'vitest';
import { MilestoneTriggerType } from '../../content/milestone/MilestoneDefinition.js';
import {
  formatPlayerFacingMilestoneTriggerSummary,
  PLAYER_FACING_MILESTONE_TRIGGER_UNKNOWN,
} from './player-facing-milestone-trigger-label.js';

describe('formatPlayerFacingMilestoneTriggerSummary', () => {
  it('formats FIRST_SALE', () => {
    expect(
      formatPlayerFacingMilestoneTriggerSummary({
        trigger: { type: MilestoneTriggerType.FIRST_SALE },
      }),
    ).toBe('Tätigen Sie den ersten Verkauf.');
  });

  it('formats PRODUCTION_VOLUME with singular job wording', () => {
    expect(
      formatPlayerFacingMilestoneTriggerSummary({
        trigger: { type: MilestoneTriggerType.PRODUCTION_VOLUME, count: 1 },
      }),
    ).toBe('Schließen Sie 1 Produktionsauftrag ab.');
  });

  it('formats PRODUCTION_VOLUME with plural job wording', () => {
    expect(
      formatPlayerFacingMilestoneTriggerSummary({
        trigger: { type: MilestoneTriggerType.PRODUCTION_VOLUME, count: 3 },
      }),
    ).toBe('Schließen Sie 3 Produktionsaufträge ab.');
  });

  it('formats PRODUCTION_VOLUME with recipe display name', () => {
    expect(
      formatPlayerFacingMilestoneTriggerSummary({
        trigger: {
          type: MilestoneTriggerType.PRODUCTION_VOLUME,
          count: 1,
          recipeId: 'recipe_steel',
        },
        resolveRecipeName: () => 'Stahlproduktion',
      }),
    ).toBe('Schließen Sie 1 Produktionsauftrag für „Stahlproduktion“ ab.');
  });

  it('formats PROFIT_THRESHOLD using cumulative sale revenue semantics', () => {
    expect(
      formatPlayerFacingMilestoneTriggerSummary({
        trigger: { type: MilestoneTriggerType.PROFIT_THRESHOLD, amount: 100 },
      }),
    ).toBe('Erzielen Sie kumulierte Verkaufserlöse von 100 $.');
  });

  it('returns neutral fallback for unknown trigger types', () => {
    expect(
      formatPlayerFacingMilestoneTriggerSummary({
        trigger: { type: 'UNKNOWN' as typeof MilestoneTriggerType.FIRST_SALE },
      }),
    ).toBe(PLAYER_FACING_MILESTONE_TRIGGER_UNKNOWN);
  });
});
