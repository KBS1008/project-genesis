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
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import { BuildingSupportsRecipeSpecification } from '../../domain/specifications/production/BuildingSupportsRecipeSpecification.js';
import { RequiredResearchSpecification } from '../../domain/specifications/research/RequiredResearchSpecification.js';
import { RequiredMilestonesSpecification } from '../../domain/specifications/research/RequiredMilestonesSpecification.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { StartProductionCommand } from '../commands/StartProductionCommand.js';

/** Dependencies required by {@link StartProductionUseCase}. */
export type StartProductionUseCaseDependencies = Pick<
  ApplicationContext,
  | 'clock'
  | 'buildingRepository'
  | 'productionJobRepository'
  | 'simulationEngine'
  | 'gameContent'
  | 'productionInventoryService'
  | 'companyResearchRepository'
  | 'companyMilestonesRepository'
  | 'energyBalanceService'
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
  readonly #productionInventoryService: StartProductionUseCaseDependencies['productionInventoryService'];
  readonly #companyResearchRepository: StartProductionUseCaseDependencies['companyResearchRepository'];
  readonly #companyMilestonesRepository: StartProductionUseCaseDependencies['companyMilestonesRepository'];
  readonly #energyBalanceService: StartProductionUseCaseDependencies['energyBalanceService'];
  readonly #buildingSupportsRecipeSpecification = new BuildingSupportsRecipeSpecification();
  readonly #requiredResearchSpecification = new RequiredResearchSpecification();
  readonly #requiredMilestonesSpecification = new RequiredMilestonesSpecification();

  /**
   * @param dependencies - Application services required to start production.
   */
  constructor(dependencies: StartProductionUseCaseDependencies) {
    this.#clock = dependencies.clock;
    this.#buildingRepository = dependencies.buildingRepository;
    this.#productionJobRepository = dependencies.productionJobRepository;
    this.#simulationEngine = dependencies.simulationEngine;
    this.#gameContent = dependencies.gameContent;
    this.#productionInventoryService = dependencies.productionInventoryService;
    this.#companyResearchRepository = dependencies.companyResearchRepository;
    this.#companyMilestonesRepository = dependencies.companyMilestonesRepository;
    this.#energyBalanceService = dependencies.energyBalanceService;
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

    if (building.getStatus() !== BuildingStatus.ACTIVE) {
      return Result.fail(
        new ValidationError(`Building id "${buildingId.value}" is not active yet.`),
      );
    }

    const recipe = this.#gameContent.recipes.get(recipeId.value);

    if (recipe === undefined) {
      return Result.fail(new ValidationError(`Recipe id "${recipeId.value}" was not found.`));
    }

    if (!recipe.enabled) {
      return Result.fail(new ValidationError(`Recipe id "${recipeId.value}" is disabled.`));
    }

    const supportsRecipeResult = this.#buildingSupportsRecipeSpecification.isSatisfiedBy(
      {
        buildingTypeId: building.getBuildingTypeId().value,
        recipeId: recipeId.value,
      },
      {
        allowedBuildingTypes: recipe.buildingTypes,
      },
    );

    if (!supportsRecipeResult.ok) {
      return Result.fail(supportsRecipeResult.error);
    }

    const companyResearch = this.#companyResearchRepository.findByCompanyId(building.getCompanyId());

    if (companyResearch === undefined) {
      return Result.fail(
        new ValidationError(
          `Research module for company "${building.getCompanyId().value}" was not found.`,
        ),
      );
    }

    const requiredResearchResult = this.#requiredResearchSpecification.isSatisfiedBy(
      {
        subjectId: recipeId.value,
        requiredResearch: recipe.requiredResearch,
      },
      {
        completedResearch: new Set(companyResearch.getCompletedTechnologies()),
      },
    );

    if (!requiredResearchResult.ok) {
      return Result.fail(requiredResearchResult.error);
    }

    const companyMilestones = this.#companyMilestonesRepository.findByCompanyId(building.getCompanyId());

    if (companyMilestones === undefined) {
      return Result.fail(
        new ValidationError(
          `Milestones module for company "${building.getCompanyId().value}" was not found.`,
        ),
      );
    }

    const requiredMilestonesResult = this.#requiredMilestonesSpecification.isSatisfiedBy(
      {
        subjectId: recipeId.value,
        requiredMilestones: recipe.requiredMilestones,
      },
      {
        completedMilestones: new Set(companyMilestones.getCompletedMilestones()),
      },
    );

    if (!requiredMilestonesResult.ok) {
      return Result.fail(requiredMilestonesResult.error);
    }

    if (
      !this.#energyBalanceService.canAffordRecipeEnergy(building.getCompanyId(), recipeId.value, {
        includeRecipeLoad: true,
      })
    ) {
      return Result.fail(
        new ValidationError('Insufficient energy to start production. Build a power plant.'),
      );
    }

    const reserveResult = this.#productionInventoryService.reserveInputs(
      building.getCompanyId(),
      recipe,
    );

    if (!reserveResult.ok) {
      return Result.fail(reserveResult.error);
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
      this.#productionInventoryService.releaseInputs(building.getCompanyId(), recipe);
      return Result.fail(jobResult.error);
    }

    const job = jobResult.value;
    const startResult = job.start(this.#clock);

    if (!startResult.ok) {
      this.#productionInventoryService.releaseInputs(building.getCompanyId(), recipe);
      return Result.fail(startResult.error);
    }

    this.#productionJobRepository.save(job);
    this.#simulationEngine.enqueueEvents(job.pullDomainEvents());

    return Result.ok(jobId);
  }
}
