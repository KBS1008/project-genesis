/**
 * @module @application/mappers/MilestoneDefinitionMapper
 *
 * Maps static milestone content into domain evaluation candidates.
 */

import {
  MilestoneTriggerType as ContentMilestoneTriggerType,
  type MilestoneDefinition,
  type MilestoneTriggerDefinition,
} from '../../content/milestone/MilestoneDefinition.js';
import {
  MilestoneTriggerType,
  type MilestoneEvaluationCandidate,
  type MilestoneTrigger,
} from '../../domain/milestone/MilestoneTrigger.js';

function mapTrigger(trigger: MilestoneTriggerDefinition): MilestoneTrigger {
  switch (trigger.type) {
    case ContentMilestoneTriggerType.FIRST_SALE:
      return { type: MilestoneTriggerType.FIRST_SALE };
    case ContentMilestoneTriggerType.PRODUCTION_VOLUME:
      return trigger.recipeId === undefined
        ? {
            type: MilestoneTriggerType.PRODUCTION_VOLUME,
            count: trigger.count,
          }
        : {
            type: MilestoneTriggerType.PRODUCTION_VOLUME,
            count: trigger.count,
            recipeId: trigger.recipeId,
          };
    case ContentMilestoneTriggerType.PROFIT_THRESHOLD:
      return {
        type: MilestoneTriggerType.PROFIT_THRESHOLD,
        amount: trigger.amount,
      };
  }
}

/**
 * Converts one content milestone definition into a domain evaluation candidate.
 */
export function toMilestoneEvaluationCandidate(
  definition: MilestoneDefinition,
): MilestoneEvaluationCandidate {
  return {
    milestoneId: definition.id,
    enabled: definition.enabled,
    trigger: mapTrigger(definition.trigger),
  };
}
