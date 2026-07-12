/**
 * @module @content/validateGameContent
 *
 * Loads and validates all implemented game content registries in dependency order.
 */

import path from 'node:path';
import { Result } from '../common/result/Result.js';
import { BuildingTypeLoader } from './building/BuildingTypeLoader.js';
import type { BuildingTypeRegistry } from './building/BuildingTypeRegistry.js';
import { ContentLoadError } from './errors/ContentLoadError.js';
import { MilestoneLoader } from './milestone/MilestoneLoader.js';
import type { MilestoneRegistry } from './milestone/MilestoneRegistry.js';
import { RecipeLoader } from './recipe/RecipeLoader.js';
import type { RecipeRegistry } from './recipe/RecipeRegistry.js';
import { TechnologyLoader } from './research/TechnologyLoader.js';
import type { TechnologyRegistry } from './research/TechnologyRegistry.js';
import { ResourceTypeLoader } from './resource/ResourceTypeLoader.js';
import type { ResourceTypeRegistry } from './resource/ResourceTypeRegistry.js';
import { validateBuildingRecipeConsistency } from './validateBuildingRecipeConsistency.js';
import { validateMilestoneReferences } from './validateMilestoneReferences.js';
import { validateResearchReferences } from './validateResearchReferences.js';

/** Options for loading and validating game content. */
export type ValidateGameContentOptions = {
  /** When true, validates bidirectional building/recipe references after loading. */
  readonly strict?: boolean;
};

/** Successfully loaded and validated game content registries. */
export type GameContentLoadResult = {
  readonly resourceTypes: ResourceTypeRegistry;
  readonly milestones: MilestoneRegistry;
  readonly technologies: TechnologyRegistry;
  readonly buildingTypes: BuildingTypeRegistry;
  readonly recipes: RecipeRegistry;
};

/**
 * Loads and validates resource types, milestones, building types and recipes from a content root.
 *
 * Load order:
 * 1. Resource types
 * 2. Milestones
 * 3. Technologies
 * 4. Building types
 * 5. Recipes (with cross-reference validation)
 *
 * @param gameContentRoot - Path to the `game-content/` directory.
 * @param options - Optional validation options such as strict cross-reference checks.
 */
export async function validateGameContent(
  gameContentRoot: string,
  options: ValidateGameContentOptions = {},
): Promise<Result<GameContentLoadResult, ContentLoadError>> {
  const resourceLoader = new ResourceTypeLoader();
  const milestoneLoader = new MilestoneLoader();
  const technologyLoader = new TechnologyLoader();
  const buildingLoader = new BuildingTypeLoader();
  const recipeLoader = new RecipeLoader();

  const resourceTypesResult = await resourceLoader.loadFromDirectory(
    path.join(gameContentRoot, 'resources'),
  );

  if (!resourceTypesResult.ok) {
    return Result.fail(resourceTypesResult.error);
  }

  const milestonesResult = await milestoneLoader.loadFromDirectory(
    path.join(gameContentRoot, 'milestones'),
  );

  if (!milestonesResult.ok) {
    return Result.fail(milestonesResult.error);
  }

  const technologiesResult = await technologyLoader.loadFromDirectory(
    path.join(gameContentRoot, 'research'),
  );

  if (!technologiesResult.ok) {
    return Result.fail(technologiesResult.error);
  }

  const buildingTypesResult = await buildingLoader.loadFromDirectory(
    path.join(gameContentRoot, 'buildings'),
  );

  if (!buildingTypesResult.ok) {
    return Result.fail(buildingTypesResult.error);
  }

  const recipesResult = await recipeLoader.loadFromDirectory(
    path.join(gameContentRoot, 'recipes'),
    {
      resourceTypes: resourceTypesResult.value,
      buildingTypes: buildingTypesResult.value,
    },
  );

  if (!recipesResult.ok) {
    return Result.fail(recipesResult.error);
  }

  const researchReferencesResult = validateResearchReferences(
    technologiesResult.value,
    buildingTypesResult.value,
    recipesResult.value,
  );

  if (!researchReferencesResult.ok) {
    return Result.fail(researchReferencesResult.error);
  }

  const milestoneReferencesResult = validateMilestoneReferences(
    milestonesResult.value,
    buildingTypesResult.value,
    recipesResult.value,
    technologiesResult.value,
  );

  if (!milestoneReferencesResult.ok) {
    return Result.fail(milestoneReferencesResult.error);
  }

  const consistencyResult = validateBuildingRecipeConsistency(
    buildingTypesResult.value,
    recipesResult.value,
    { strict: options.strict ?? false },
  );

  if (!consistencyResult.ok) {
    return Result.fail(consistencyResult.error);
  }

  return Result.ok({
    resourceTypes: resourceTypesResult.value,
    milestones: milestonesResult.value,
    technologies: technologiesResult.value,
    buildingTypes: buildingTypesResult.value,
    recipes: recipesResult.value,
  });
}
