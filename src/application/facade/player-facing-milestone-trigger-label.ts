/**
 * Player-facing German summaries for milestone completion triggers (read-only UI copy).
 */

import {
  MilestoneTriggerType,
  type MilestoneTriggerDefinition,
} from '../../content/milestone/MilestoneDefinition.js';
import { formatPlayerFacingCurrencyAmount } from './player-facing-currency-format.js';

/** Neutral fallback when a trigger shape is unknown or unsupported for display. */
export const PLAYER_FACING_MILESTONE_TRIGGER_UNKNOWN =
  'Voraussetzung gemäß Meilenstein-Definition.';

export type FormatPlayerFacingMilestoneTriggerSummaryParams = {
  readonly trigger: MilestoneTriggerDefinition;
  readonly resolveRecipeName?: (recipeId: string) => string;
};

/**
 * Formats the authoritative milestone trigger as a German criteria sentence.
 * Wording matches {@link MilestoneTriggerPolicy} evaluation semantics.
 */
export function formatPlayerFacingMilestoneTriggerSummary(
  params: FormatPlayerFacingMilestoneTriggerSummaryParams,
): string {
  const { trigger, resolveRecipeName } = params;

  switch (trigger.type) {
    case MilestoneTriggerType.FIRST_SALE:
      return 'Tätigen Sie den ersten Verkauf.';

    case MilestoneTriggerType.PRODUCTION_VOLUME: {
      const count = trigger.count;
      const jobNoun =
        count === 1 ? 'Produktionsauftrag' : 'Produktionsaufträge';

      if (trigger.recipeId !== undefined) {
        const recipeName =
          resolveRecipeName?.(trigger.recipeId) ?? trigger.recipeId;
        return `Schließen Sie ${count} ${jobNoun} für „${recipeName}“ ab.`;
      }

      return `Schließen Sie ${count} ${jobNoun} ab.`;
    }

    case MilestoneTriggerType.PROFIT_THRESHOLD:
      return `Erzielen Sie kumulierte Verkaufserlöse von ${formatPlayerFacingCurrencyAmount(trigger.amount)}.`;

    default:
      return PLAYER_FACING_MILESTONE_TRIGGER_UNKNOWN;
  }
}
