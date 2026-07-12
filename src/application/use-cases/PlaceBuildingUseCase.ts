/**
 * @module @application/use-cases/PlaceBuildingUseCase
 *
 * Coordinates building placement, persistence and domain event enqueueing.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import {
  Building,
  createBuildingId,
  createBuildingTypeId,
} from '../../domain/building/Building.js';
import type { BuildingId } from '../../domain/building/BuildingId.js';
import { Position } from '../../domain/building/Position.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { FinanceTransactionType } from '../../domain/finance/FinanceTransactionType.js';
import { ConstructionCostPolicy } from '../../domain/policies/building/ConstructionCostPolicy.js';
import { BuildingPrerequisitesSpecification } from '../../domain/specifications/building/BuildingPrerequisitesSpecification.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { PlaceBuildingCommand } from '../commands/PlaceBuildingCommand.js';

/** Dependencies required by {@link PlaceBuildingUseCase}. */
export type PlaceBuildingUseCaseDependencies = Pick<
  ApplicationContext,
  | 'clock'
  | 'companyRepository'
  | 'buildingRepository'
  | 'financeRepository'
  | 'companyResearchRepository'
  | 'simulationEngine'
  | 'gameContent'
>;

/**
 * Places a building aggregate and persists it.
 */
export class PlaceBuildingUseCase {
  readonly #clock: PlaceBuildingUseCaseDependencies['clock'];
  readonly #companyRepository: PlaceBuildingUseCaseDependencies['companyRepository'];
  readonly #buildingRepository: PlaceBuildingUseCaseDependencies['buildingRepository'];
  readonly #financeRepository: PlaceBuildingUseCaseDependencies['financeRepository'];
  readonly #companyResearchRepository: PlaceBuildingUseCaseDependencies['companyResearchRepository'];
  readonly #simulationEngine: PlaceBuildingUseCaseDependencies['simulationEngine'];
  readonly #gameContent: PlaceBuildingUseCaseDependencies['gameContent'];
  readonly #constructionCostPolicy = new ConstructionCostPolicy();
  readonly #buildingPrerequisitesSpecification = new BuildingPrerequisitesSpecification();

  /**
   * @param dependencies - Application services required for building placement.
   */
  constructor(dependencies: PlaceBuildingUseCaseDependencies) {
    this.#clock = dependencies.clock;
    this.#companyRepository = dependencies.companyRepository;
    this.#buildingRepository = dependencies.buildingRepository;
    this.#financeRepository = dependencies.financeRepository;
    this.#companyResearchRepository = dependencies.companyResearchRepository;
    this.#simulationEngine = dependencies.simulationEngine;
    this.#gameContent = dependencies.gameContent;
  }

  /**
   * Executes the place-building workflow.
   *
   * @param command - Building placement input.
   */
  execute(command: PlaceBuildingCommand): Result<BuildingId, ValidationError> {
    const buildingIdResult = createBuildingId(command.buildingId);

    if (!buildingIdResult.ok) {
      return Result.fail(buildingIdResult.error);
    }

    const buildingTypeIdResult = createBuildingTypeId(command.buildingTypeId);

    if (!buildingTypeIdResult.ok) {
      return Result.fail(buildingTypeIdResult.error);
    }

    const companyIdResult = createCompanyId(command.companyId);

    if (!companyIdResult.ok) {
      return Result.fail(companyIdResult.error);
    }

    const buildingId = buildingIdResult.value;
    const buildingTypeId = buildingTypeIdResult.value;
    const companyId = companyIdResult.value;

    if (this.#companyRepository.findById(companyId) === undefined) {
      return Result.fail(
        new ValidationError(`Company id "${companyId.value}" was not found.`),
      );
    }

    if (this.#buildingRepository.findById(buildingId) !== undefined) {
      return Result.fail(
        new ValidationError(`Building id "${buildingId.value}" already exists.`),
      );
    }

    const buildingType = this.#gameContent.buildingTypes.get(buildingTypeId.value);

    if (buildingType === undefined) {
      return Result.fail(
        new ValidationError(`Building type "${buildingTypeId.value}" was not found.`),
      );
    }

    const costResult = this.#constructionCostPolicy.evaluate({
      buildingTypeId: buildingTypeId.value,
      constructionCost: buildingType.constructionCost,
      enabled: buildingType.enabled,
    });

    if (!costResult.ok) {
      return Result.fail(costResult.error);
    }

    const companyResearch = this.#companyResearchRepository.findByCompanyId(companyId);

    if (companyResearch === undefined) {
      return Result.fail(
        new ValidationError(`Research module for company "${companyId.value}" was not found.`),
      );
    }

    const prerequisitesResult = this.#buildingPrerequisitesSpecification.isSatisfiedBy(
      {
        buildingTypeId: buildingTypeId.value,
        requiredResearch: buildingType.requiredResearch,
        requiredMilestones: buildingType.requiredMilestones,
      },
      {
        completedResearch: new Set(companyResearch.getCompletedTechnologies()),
        completedMilestones: new Set<string>(),
      },
    );

    if (!prerequisitesResult.ok) {
      return Result.fail(prerequisitesResult.error);
    }

    const finance = this.#financeRepository.findByCompanyId(companyId);

    if (finance === undefined) {
      return Result.fail(
        new ValidationError(`Finance account for company "${companyId.value}" was not found.`),
      );
    }

    const buildingResult = Building.create({
      id: buildingId,
      buildingTypeId,
      companyId,
      name: command.name,
      position: new Position(command.x, command.y),
      clock: this.#clock,
    });

    if (!buildingResult.ok) {
      return Result.fail(buildingResult.error);
    }

    const constructionCost = costResult.value.cost;
    const debitResult = finance.debit(constructionCost, FinanceTransactionType.BUILDING_COST, this.#clock);

    if (!debitResult.ok) {
      return Result.fail(debitResult.error);
    }

    const building = buildingResult.value;
    this.#buildingRepository.save(building);
    this.#financeRepository.save(finance);
    this.#simulationEngine.enqueueEvents([
      ...building.pullDomainEvents(),
      ...finance.pullDomainEvents(),
    ]);

    return Result.ok(buildingId);
  }
}
