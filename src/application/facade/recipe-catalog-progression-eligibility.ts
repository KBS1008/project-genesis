/**
 * Read-only recipe progression eligibility for the production recipe catalog (P4-PU-S2).
 *
 * Uses the same milestone-then-research ordering as production hints and start commands.
 */

import type { MilestoneRegistry } from '../../content/milestone/MilestoneRegistry.js';
import type { TechnologyRegistry } from '../../content/research/TechnologyRegistry.js';
import { formatMissingMilestoneReason } from './player-facing-milestone-label.js';
import { formatMissingTechnologyReason } from './player-facing-technology-label.js';

/** Session progression state for recipe catalog projection. */
export type RecipeCatalogProgressionContext = {
  readonly completedMilestones: ReadonlySet<string>;
  readonly completedResearch: ReadonlySet<string>;
};

/** Progression-only eligibility for a recipe catalog entry. */
export type RecipeCatalogProgressionEligibility = {
  readonly progressionEligible: boolean;
  readonly progressionBlockerReason: string | null;
};

/** Inputs required to evaluate recipe progression visibility. */
export type EvaluateRecipeCatalogProgressionEligibilityParams = {
  readonly requiredMilestones: readonly string[];
  readonly requiredResearch: readonly string[];
  readonly completedMilestones: ReadonlySet<string>;
  readonly completedResearch: ReadonlySet<string>;
  readonly milestones: MilestoneRegistry;
  readonly technologies: TechnologyRegistry;
};

/**
 * Determines whether milestone and research prerequisites are satisfied.
 * Does not consider buildings, inventory, energy, or transport.
 */
export function evaluateRecipeCatalogProgressionEligibility(
  params: EvaluateRecipeCatalogProgressionEligibilityParams,
): RecipeCatalogProgressionEligibility {
  const missingMilestone = params.requiredMilestones.find(
    (milestoneId) => !params.completedMilestones.has(milestoneId),
  );

  if (missingMilestone !== undefined) {
    return Object.freeze({
      progressionEligible: false,
      progressionBlockerReason: formatMissingMilestoneReason(
        missingMilestone,
        params.milestones,
      ),
    });
  }

  const missingResearch = params.requiredResearch.find(
    (technologyId) => !params.completedResearch.has(technologyId),
  );

  if (missingResearch !== undefined) {
    return Object.freeze({
      progressionEligible: false,
      progressionBlockerReason: formatMissingTechnologyReason(
        missingResearch,
        params.technologies,
      ),
    });
  }

  return Object.freeze({
    progressionEligible: true,
    progressionBlockerReason: null,
  });
}
