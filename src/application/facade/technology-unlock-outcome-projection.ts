/**
 * Read-only projection of recipe/building unlock outcomes for completed technologies.
 */

import type { BuildingTypeRegistry } from '../../content/building/BuildingTypeRegistry.js';
import type { MilestoneRegistry } from '../../content/milestone/MilestoneRegistry.js';
import type { RecipeRegistry } from '../../content/recipe/RecipeRegistry.js';
import type { TechnologyRegistry } from '../../content/research/TechnologyRegistry.js';
import {
  evaluateRecipeCatalogProgressionEligibility,
  type RecipeCatalogProgressionContext,
} from './recipe-catalog-progression-eligibility.js';

export type TechnologyUnlockOutcomeKind = 'recipe' | 'building';

export type TechnologyUnlockOutcomeReadModel = {
  readonly contentId: string;
  readonly name: string;
  readonly kind: TechnologyUnlockOutcomeKind;
  readonly progressionEligible: boolean;
  readonly progressionBlockerReason: string | null;
};

export type CompletedTechnologyUnlockOutcomesReadModel = {
  readonly technologyId: string;
  readonly technologyName: string;
  readonly outcomes: readonly TechnologyUnlockOutcomeReadModel[];
};

export type ProjectTechnologyUnlockOutcomesParams = {
  readonly progressionContext: RecipeCatalogProgressionContext;
  readonly recipes: RecipeRegistry;
  readonly buildingTypes: BuildingTypeRegistry;
  readonly milestones: MilestoneRegistry;
  readonly technologies: TechnologyRegistry;
};

function compareOutcomes(
  left: TechnologyUnlockOutcomeReadModel,
  right: TechnologyUnlockOutcomeReadModel,
): number {
  const kindOrder = left.kind.localeCompare(right.kind);

  if (kindOrder !== 0) {
    return kindOrder;
  }

  const nameOrder = left.name.localeCompare(right.name, 'de');

  if (nameOrder !== 0) {
    return nameOrder;
  }

  return left.contentId.localeCompare(right.contentId);
}

function resolveTechnologyName(
  technologyId: string,
  technologies: TechnologyRegistry,
): string {
  const technology = technologies.get(technologyId);
  const name = technology?.name.trim();

  if (name === undefined || name.length === 0) {
    return technologyId;
  }

  return name;
}

export function projectTechnologyUnlockOutcomes(
  params: ProjectTechnologyUnlockOutcomesParams,
): readonly CompletedTechnologyUnlockOutcomesReadModel[] {
  const evaluationBase = {
    completedMilestones: params.progressionContext.completedMilestones,
    completedResearch: params.progressionContext.completedResearch,
    milestones: params.milestones,
    technologies: params.technologies,
  };

  const completedSorted = [...params.progressionContext.completedResearch].sort((left, right) =>
    left.localeCompare(right),
  );

  return Object.freeze(
    completedSorted.map((technologyId) => {
      const recipeOutcomes = params.recipes
        .getAll()
        .filter(
          (recipe) => recipe.enabled && recipe.requiredResearch.includes(technologyId),
        )
        .map((recipe) => {
          const progression = evaluateRecipeCatalogProgressionEligibility({
            requiredMilestones: recipe.requiredMilestones,
            requiredResearch: recipe.requiredResearch,
            ...evaluationBase,
          });

          return Object.freeze({
            contentId: recipe.id,
            name: recipe.name,
            kind: 'recipe' as const,
            progressionEligible: progression.progressionEligible,
            progressionBlockerReason: progression.progressionBlockerReason,
          });
        });

      const buildingOutcomes = params.buildingTypes
        .getAll()
        .filter(
          (building) => building.enabled && building.requiredResearch.includes(technologyId),
        )
        .map((building) => {
          const progression = evaluateRecipeCatalogProgressionEligibility({
            requiredMilestones: building.requiredMilestones,
            requiredResearch: building.requiredResearch,
            ...evaluationBase,
          });

          return Object.freeze({
            contentId: building.id,
            name: building.name,
            kind: 'building' as const,
            progressionEligible: progression.progressionEligible,
            progressionBlockerReason: progression.progressionBlockerReason,
          });
        });

      return Object.freeze({
        technologyId,
        technologyName: resolveTechnologyName(technologyId, params.technologies),
        outcomes: Object.freeze([...recipeOutcomes, ...buildingOutcomes].sort(compareOutcomes)),
      });
    }),
  );
}