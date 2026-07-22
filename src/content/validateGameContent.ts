/**
 * @module @content/validateGameContent
 *
 * Loads and validates all implemented game content registries in dependency order.
 */

import path from 'node:path';
import { Result } from '../common/result/Result.js';
import { BiomeLoader } from './biome/BiomeLoader.js';
import type { BiomeRegistry } from './biome/BiomeRegistry.js';
import { BuildingTypeLoader } from './building/BuildingTypeLoader.js';
import type { BuildingTypeRegistry } from './building/BuildingTypeRegistry.js';
import { CityLoader } from './city/CityLoader.js';
import type { CityRegistry } from './city/CityRegistry.js';
import { EmployeeLoader } from './employee/EmployeeLoader.js';
import type { EmployeeRegistry } from './employee/EmployeeRegistry.js';
import type { ContentLoadError } from './errors/ContentLoadError.js';
import { TransportRouteLoader } from './logistics/TransportRouteLoader.js';
import type { TransportRouteRegistry } from './logistics/TransportRouteRegistry.js';
import { MapLoader } from './map/MapLoader.js';
import type { MapRegistry } from './map/MapRegistry.js';
import { MilestoneLoader } from './milestone/MilestoneLoader.js';
import type { MilestoneRegistry } from './milestone/MilestoneRegistry.js';
import { StrategyLoader } from './strategy/StrategyLoader.js';
import type { StrategyRegistry } from './strategy/StrategyRegistry.js';
import { RecipeLoader } from './recipe/RecipeLoader.js';
import type { RecipeRegistry } from './recipe/RecipeRegistry.js';
import { RegionLoader } from './region/RegionLoader.js';
import type { RegionRegistry } from './region/RegionRegistry.js';
import { TechnologyLoader } from './research/TechnologyLoader.js';
import type { TechnologyRegistry } from './research/TechnologyRegistry.js';
import { ResourceTypeLoader } from './resource/ResourceTypeLoader.js';
import type { ResourceTypeRegistry } from './resource/ResourceTypeRegistry.js';
import { WorldLoader } from './world/WorldLoader.js';
import type { WorldRegistry } from './world/WorldRegistry.js';
import { validateBuildingRecipeConsistency } from './validateBuildingRecipeConsistency.js';
import { validateEmployeeReferences } from './validateEmployeeReferences.js';
import { validateMilestoneReferences } from './validateMilestoneReferences.js';
import { validateResearchReferences } from './validateResearchReferences.js';
import { validateTransportRouteReferences } from './validateTransportRouteReferences.js';
import { validateWorldReferences } from './validateWorldReferences.js';

/** Options for loading and validating game content. */
export type ValidateGameContentOptions = {
  /** When true, validates bidirectional building/recipe references after loading. */
  readonly strict?: boolean;
};

/** Successfully loaded and validated game content registries. */
export type GameContentLoadResult = {
  readonly resourceTypes: ResourceTypeRegistry;
  readonly biomes: BiomeRegistry;
  readonly worlds: WorldRegistry;
  readonly regions: RegionRegistry;
  readonly maps: MapRegistry;
  readonly cities: CityRegistry;
  readonly milestones: MilestoneRegistry;
  readonly technologies: TechnologyRegistry;
  readonly buildingTypes: BuildingTypeRegistry;
  readonly employees: EmployeeRegistry;
  readonly recipes: RecipeRegistry;
  readonly transportRoutes: TransportRouteRegistry;
  readonly strategies: StrategyRegistry;
};

/**
 * Loads and validates all game content registries from a content root.
 *
 * Load order:
 * 1. Resource types
 * 2. Biomes
 * 3. Worlds
 * 4. Regions
 * 5. Maps
 * 6. Cities
 * 7. Milestones
 * 8. Technologies
 * 9. Building types
 * 10. Employees
 * 11. Recipes (with cross-reference validation)
 * 12. Transport routes
 *
 * Cross-registry validation runs after all loaders succeed.
 *
 * @param gameContentRoot - Path to the `game-content/` directory.
 * @param options - Optional validation options such as strict cross-reference checks.
 */
export async function validateGameContent(
  gameContentRoot: string,
  options: ValidateGameContentOptions = {},
): Promise<Result<GameContentLoadResult, ContentLoadError>> {
  const resourceLoader = new ResourceTypeLoader();
  const biomeLoader = new BiomeLoader();
  const worldLoader = new WorldLoader();
  const regionLoader = new RegionLoader();
  const mapLoader = new MapLoader();
  const cityLoader = new CityLoader();
  const milestoneLoader = new MilestoneLoader();
  const technologyLoader = new TechnologyLoader();
  const buildingLoader = new BuildingTypeLoader();
  const employeeLoader = new EmployeeLoader();
  const recipeLoader = new RecipeLoader();
  const transportRouteLoader = new TransportRouteLoader();
  const strategyLoader = new StrategyLoader();

  const resourceTypesResult = await resourceLoader.loadFromDirectory(
    path.join(gameContentRoot, 'resources'),
  );

  if (!resourceTypesResult.ok) {
    return Result.fail(resourceTypesResult.error);
  }

  const biomesResult = await biomeLoader.loadFromDirectory(path.join(gameContentRoot, 'biomes'));

  if (!biomesResult.ok) {
    return Result.fail(biomesResult.error);
  }

  const worldsResult = await worldLoader.loadFromDirectory(path.join(gameContentRoot, 'worlds'));

  if (!worldsResult.ok) {
    return Result.fail(worldsResult.error);
  }

  const regionsResult = await regionLoader.loadFromDirectory(path.join(gameContentRoot, 'regions'));

  if (!regionsResult.ok) {
    return Result.fail(regionsResult.error);
  }

  const mapsResult = await mapLoader.loadFromDirectory(path.join(gameContentRoot, 'maps'));

  if (!mapsResult.ok) {
    return Result.fail(mapsResult.error);
  }

  const citiesResult = await cityLoader.loadFromDirectory(path.join(gameContentRoot, 'cities'));

  if (!citiesResult.ok) {
    return Result.fail(citiesResult.error);
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

  const employeesResult = await employeeLoader.loadFromDirectory(
    path.join(gameContentRoot, 'employees'),
  );

  if (!employeesResult.ok) {
    return Result.fail(employeesResult.error);
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

  const transportRoutesResult = await transportRouteLoader.loadFromDirectory(
    path.join(gameContentRoot, 'logistics'),
  );

  if (!transportRoutesResult.ok) {
    return Result.fail(transportRoutesResult.error);
  }

  const strategiesResult = await strategyLoader.loadFromDirectory(
    path.join(gameContentRoot, 'strategies'),
  );

  if (!strategiesResult.ok) {
    return Result.fail(strategiesResult.error);
  }

  const worldReferencesResult = validateWorldReferences(
    worldsResult.value,
    regionsResult.value,
    biomesResult.value,
    mapsResult.value,
    citiesResult.value,
    resourceTypesResult.value,
  );

  if (!worldReferencesResult.ok) {
    return Result.fail(worldReferencesResult.error);
  }

  const employeeReferencesResult = validateEmployeeReferences(
    employeesResult.value,
    technologiesResult.value,
    buildingTypesResult.value,
  );

  if (!employeeReferencesResult.ok) {
    return Result.fail(employeeReferencesResult.error);
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

  const transportRouteReferencesResult = validateTransportRouteReferences(
    transportRoutesResult.value,
    buildingTypesResult.value,
  );

  if (!transportRouteReferencesResult.ok) {
    return Result.fail(transportRouteReferencesResult.error);
  }

  return Result.ok({
    resourceTypes: resourceTypesResult.value,
    biomes: biomesResult.value,
    worlds: worldsResult.value,
    regions: regionsResult.value,
    maps: mapsResult.value,
    cities: citiesResult.value,
    milestones: milestonesResult.value,
    technologies: technologiesResult.value,
    buildingTypes: buildingTypesResult.value,
    employees: employeesResult.value,
    recipes: recipesResult.value,
    transportRoutes: transportRoutesResult.value,
    strategies: strategiesResult.value,
  });
}
