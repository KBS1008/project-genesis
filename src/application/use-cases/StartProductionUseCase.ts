/**
 * @module @application/use-cases/StartProductionUseCase
 *
 * Coordinates production job creation, start and persistence.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createBuildingId } from '../../domain/building/Building.js';
import type { ProductionJobId } from '../../domain/production/ProductionJobId.js';
import {
  ProductionJob,
  createProductionJobId,
} from '../../domain/production/ProductionJob.js';
import { createRecipeId } from '../../domain/production/RecipeId.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { StartProductionCommand } from '../commands/StartProductionCommand.js';

/** Dependencies required by {@link StartProductionUseCase}. */
export type StartProductionUseCaseDependencies = Pick<
  ApplicationContext,
  'clock' | 'buildingRepository' | 'productionJobRepository' | 'simulationEngine' | 'gameContent'
>;

/**
 * Starts a recipe-based production job on a building.
 */
export class StartProductionUseCase {
  readonly #clock: StartProductionUseCaseDependencies['clock'];
  readonly #buildingRepository: StartProductionUseCaseDependencies['buildingRepository'];
  readonly #productionJobRepository: StartProductionUseCaseDependencies['productionJobRepository'];
  readonly #simulationEngine: StartProductionUseCaseDependencies['simulationEngine'];
  readonly #gameContent: StartProductionUseCaseDependencies['gameContent'];

  /**
   * @param dependencies - Application services required to start production.
   */
  constructor(dependencies: StartProductionUseCaseDependencies) {
    this.#clock = dependencies.clock;
    this.#buildingRepository = dependencies.buildingRepository;
    this.#productionJobRepository = dependencies.productionJobRepository;
    this.#simulationEngine = dependencies.simulationEngine;
    this.#gameContent = dependencies.gameContent;
  }

  /**
   * Executes the start-production workflow.
   *
   * @param command - Production start input.
   */
  execute(command: StartProductionCommand): Result<ProductionJobId, ValidationError> {
    const jobIdResult = createProductionJobId(command.jobId);

    if (!jobIdResult.ok) {
      return Result.fail(jobIdResult.error);
    }

    const buildingIdResult = createBuildingId(command.buildingId);

    if (!buildingIdResult.ok) {
      return Result.fail(buildingIdResult.error);
    }

    const recipeIdResult = createRecipeId(command.recipeId);

    if (!recipeIdResult.ok) {
      return Result.fail(recipeIdResult.error);
    }

    const jobId = jobIdResult.value;
    const buildingId = buildingIdResult.value;
    const recipeId = recipeIdResult.value;

    if (this.#productionJobRepository.findById(jobId) !== undefined) {
      return Result.fail(new ValidationError(`Production job id "${jobId.value}" already exists.`));
    }

    const building = this.#buildingRepository.findById(buildingId);

    if (building === undefined) {
      return Result.fail(new ValidationError(`Building id "${buildingId.value}" was not found.`));
    }

    const recipe = this.#gameContent.recipes.get(recipeId.value);

    if (recipe === undefined) {
      return Result.fail(new ValidationError(`Recipe id "${recipeId.value}" was not found.`));
    }

    if (!recipe.enabled) {
      return Result.fail(new ValidationError(`Recipe id "${recipeId.value}" is disabled.`));
    }

    if (!recipe.buildingTypes.includes(building.getBuildingTypeId().value)) {
      return Result.fail(
        new ValidationError(
          `Building type "${building.getBuildingTypeId().value}" cannot execute recipe "${recipeId.value}".`,
        ),
      );
    }

    const jobResult = ProductionJob.create({
      id: jobId,
      buildingId,
      companyId: building.getCompanyId(),
      recipeId,
      duration: recipe.duration,
      clock: this.#clock,
    });

    if (!jobResult.ok) {
      return Result.fail(jobResult.error);
    }

    const job = jobResult.value;
    const startResult = job.start(this.#clock);

    if (!startResult.ok) {
      return Result.fail(startResult.error);
    }

    this.#productionJobRepository.save(job);
    this.#simulationEngine.enqueueEvents(job.pullDomainEvents());

    return Result.ok(jobId);
  }
}
