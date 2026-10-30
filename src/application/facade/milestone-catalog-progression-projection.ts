/**
 * Read-only milestone criteria and direct-dependency projection for the dashboard (P4-PU-S3).
 */

import type { BuildingTypeRegistry } from '../../content/building/BuildingTypeRegistry.js';
import type { MilestoneDefinition } from '../../content/milestone/MilestoneDefinition.js';
import type { MilestoneRegistry } from '../../content/milestone/MilestoneRegistry.js';
import type { RecipeRegistry } from '../../content/recipe/RecipeRegistry.js';
import type { TechnologyRegistry } from '../../content/research/TechnologyRegistry.js';
import { formatPlayerFacingMilestoneTriggerSummary } from './player-facing-milestone-trigger-label.js';

/** Maximum dependency labels returned before overflow counting. */
export const MILESTONE_REQUIRED_BY_DISPLAY_LIMIT = 6;

/** German empty state when no content directly lists the milestone in requiredMilestones. */
export const MILESTONE_REQUIRED_BY_EMPTY_MESSAGE =
  'Keine direkten Abhängigkeiten in den Inhaltsdaten.';

/** Read-only milestone catalog enrichment for UI. */
export type MilestoneCatalogProgressionProjection = {
  readonly criteriaSummary: string;
  readonly requiredByLabels: readonly string[];
  readonly requiredByOverflowCount: number;
};

export type ProjectMilestoneCatalogProgressionParams = {
  readonly milestone: MilestoneDefinition;
  readonly milestones: MilestoneRegistry;
  readonly buildingTypes: BuildingTypeRegistry;
  readonly recipes: RecipeRegistry;
  readonly technologies: TechnologyRegistry;
  readonly displayLimit?: number;
};

type DependencySortKey = {
  readonly categoryOrder: number;
  readonly name: string;
  readonly contentId: string;
};

const CATEGORY_BUILDING = 0;
const CATEGORY_RECIPE = 1;
const CATEGORY_TECHNOLOGY = 2;

function compareDependencies(
  left: DependencySortKey & { readonly label: string },
  right: DependencySortKey & { readonly label: string },
): number {
  if (left.categoryOrder !== right.categoryOrder) {
    return left.categoryOrder - right.categoryOrder;
  }

  const nameCompare = left.name.localeCompare(right.name, 'de');

  if (nameCompare !== 0) {
    return nameCompare;
  }

  return left.contentId.localeCompare(right.contentId, 'en');
}

function milestoneListsId(
  requiredMilestones: readonly string[],
  milestoneId: string,
): boolean {
  return requiredMilestones.includes(milestoneId);
}

/**
 * Builds criteria text and direct dependency labels for one milestone.
 * Only includes content whose YAML explicitly lists the milestone in requiredMilestones.
 */
export function projectMilestoneCatalogProgression(
  params: ProjectMilestoneCatalogProgressionParams,
): MilestoneCatalogProgressionProjection {
  const limit = params.displayLimit ?? MILESTONE_REQUIRED_BY_DISPLAY_LIMIT;
  const milestoneId = params.milestone.id;

  const criteriaSummary = formatPlayerFacingMilestoneTriggerSummary({
    trigger: params.milestone.trigger,
    resolveRecipeName: (recipeId) => {
      const recipe = params.recipes.get(recipeId);
      const name = recipe?.name.trim();

      return name !== undefined && name.length > 0 ? name : recipeId;
    },
  });

  const dependencyEntries: Array<DependencySortKey & { readonly label: string }> = [];

  for (const buildingType of params.buildingTypes.getAll()) {
    if (!buildingType.enabled) {
      continue;
    }

    if (!milestoneListsId(buildingType.requiredMilestones, milestoneId)) {
      continue;
    }

    dependencyEntries.push(
      Object.freeze({
        categoryOrder: CATEGORY_BUILDING,
        name: buildingType.name,
        contentId: buildingType.id,
        label: `Gebäude: ${buildingType.name}`,
      }),
    );
  }

  for (const recipe of params.recipes.getAll()) {
    if (!recipe.enabled) {
      continue;
    }

    if (!milestoneListsId(recipe.requiredMilestones, milestoneId)) {
      continue;
    }

    dependencyEntries.push(
      Object.freeze({
        categoryOrder: CATEGORY_RECIPE,
        name: recipe.name,
        contentId: recipe.id,
        label: `Rezept: ${recipe.name}`,
      }),
    );
  }

  for (const technology of params.technologies.getAll()) {
    if (!technology.enabled) {
      continue;
    }

    if (!milestoneListsId(technology.requiredMilestones, milestoneId)) {
      continue;
    }

    dependencyEntries.push(
      Object.freeze({
        categoryOrder: CATEGORY_TECHNOLOGY,
        name: technology.name,
        contentId: technology.id,
        label: `Forschung: ${technology.name}`,
      }),
    );
  }

  dependencyEntries.sort(compareDependencies);

  const dedupedLabels: string[] = [];
  const seenLabels = new Set<string>();

  for (const entry of dependencyEntries) {
    if (seenLabels.has(entry.label)) {
      continue;
    }

    seenLabels.add(entry.label);
    dedupedLabels.push(entry.label);
  }

  const requiredByLabels = Object.freeze(dedupedLabels.slice(0, limit));
  const requiredByOverflowCount = Math.max(0, dedupedLabels.length - limit);

  return Object.freeze({
    criteriaSummary,
    requiredByLabels,
    requiredByOverflowCount,
  });
}
