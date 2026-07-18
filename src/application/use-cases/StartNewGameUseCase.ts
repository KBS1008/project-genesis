/**
 * @module @application/use-cases/StartNewGameUseCase
 *
 * Initializes a new playable company with starter buildings and resources.
 *
 * @see docs/gameplay/core-gameplay.md
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { BuildingCategory } from '../../content/building/BuildingTypeDefinition.js';
import {
  Building,
  createBuildingId,
  createBuildingTypeId,
} from '../../domain/building/Building.js';
import type { BuildingId } from '../../domain/building/BuildingId.js';
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import { Position } from '../../domain/building/Position.js';
import { createCompanyId } from '../../domain/company/Company.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { StartNewGameCommand } from '../commands/StartNewGameCommand.js';
import {
  NEW_GAME_STARTER_BUILDINGS,
  NEW_GAME_STARTER_RESOURCES,
  type NewGameStarterBuilding,
} from '../new-game/NewGameSetupConstants.js';
import { CreateCompanyUseCase } from './CreateCompanyUseCase.js';

/** Dependencies required by {@link StartNewGameUseCase}. */
export type StartNewGameUseCaseDependencies = Pick<
  ApplicationContext,
  | 'clock'
  | 'companyRepository'
  | 'buildingRepository'
  | 'inventoryRepository'
  | 'financeRepository'
  | 'companyResearchRepository'
  | 'companyMilestonesRepository'
  | 'simulationEngine'
  | 'gameContent'
  | 'transportLogisticsService'
>;

/**
 * Creates a company and grants the documented starter infrastructure and resources.
 */
export class StartNewGameUseCase {
  readonly #clock: StartNewGameUseCaseDependencies['clock'];
  readonly #companyRepository: StartNewGameUseCaseDependencies['companyRepository'];
  readonly #buildingRepository: StartNewGameUseCaseDependencies['buildingRepository'];
  readonly #inventoryRepository: StartNewGameUseCaseDependencies['inventoryRepository'];
  readonly #simulationEngine: StartNewGameUseCaseDependencies['simulationEngine'];
  readonly #gameContent: StartNewGameUseCaseDependencies['gameContent'];
  readonly #transportLogisticsService: StartNewGameUseCaseDependencies['transportLogisticsService'];
  readonly #createCompany: CreateCompanyUseCase;

  /**
   * @param dependencies - Application services required for new-game setup.
   */
  constructor(dependencies: StartNewGameUseCaseDependencies) {
    this.#clock = dependencies.clock;
    this.#companyRepository = dependencies.companyRepository;
    this.#buildingRepository = dependencies.buildingRepository;
    this.#inventoryRepository = dependencies.inventoryRepository;
    this.#simulationEngine = dependencies.simulationEngine;
    this.#gameContent = dependencies.gameContent;
    this.#transportLogisticsService = dependencies.transportLogisticsService;
    this.#createCompany = new CreateCompanyUseCase(dependencies);
  }

  /**
   * Executes the new-game setup workflow.
   */
  execute(command: StartNewGameCommand): Result<CompanyId, ValidationError> {
    const createResult = this.#createCompany.execute({
      companyId: command.companyId,
      name: command.name,
      ownerId: command.ownerId,
    });

    if (!createResult.ok) {
      return Result.fail(createResult.error);
    }

    const companyId = createResult.value;

    for (const starterBuilding of NEW_GAME_STARTER_BUILDINGS) {
      const placeResult = this.#placeStarterBuilding(companyId, starterBuilding);

      if (!placeResult.ok) {
        return Result.fail(placeResult.error);
      }
    }

    const inventory = this.#inventoryRepository.findByCompanyId(companyId);

    if (inventory === undefined) {
      return Result.fail(new ValidationError('Starter inventory was not created.'));
    }

    for (const starterResource of NEW_GAME_STARTER_RESOURCES) {
      const addResult = inventory.addQuantity(
        starterResource.resourceId,
        starterResource.quantity,
        this.#clock,
      );

      if (!addResult.ok) {
        return Result.fail(addResult.error);
      }
    }

    this.#inventoryRepository.save(inventory);
    this.#simulationEngine.enqueueEvents(inventory.pullDomainEvents());
    this.#simulationEngine.tick();

    return Result.ok(companyId);
  }

  #placeStarterBuilding(
    companyId: CompanyId,
    starterBuilding: NewGameStarterBuilding,
  ): Result<BuildingId, ValidationError> {
    const buildingIdResult = createBuildingId(starterBuilding.buildingId);

    if (!buildingIdResult.ok) {
      return Result.fail(buildingIdResult.error);
    }

    const buildingTypeIdResult = createBuildingTypeId(starterBuilding.buildingTypeId);

    if (!buildingTypeIdResult.ok) {
      return Result.fail(buildingTypeIdResult.error);
    }

    const buildingId = buildingIdResult.value;
    const buildingTypeId = buildingTypeIdResult.value;

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

    if (!buildingType.enabled) {
      return Result.fail(
        new ValidationError(`Building type "${buildingTypeId.value}" is disabled.`),
      );
    }

    const buildingResult = Building.create({
      id: buildingId,
      buildingTypeId,
      companyId,
      name: starterBuilding.name,
      position: new Position(starterBuilding.x, starterBuilding.y),
      clock: this.#clock,
    });

    if (!buildingResult.ok) {
      return Result.fail(buildingResult.error);
    }

    const building = buildingResult.value;
    const beginConstructionResult = building.beginConstruction(0, this.#clock);

    if (!beginConstructionResult.ok) {
      return Result.fail(beginConstructionResult.error);
    }

    this.#buildingRepository.save(building);
    this.#simulationEngine.enqueueEvents(building.pullDomainEvents());

    if (
      building.getStatus() === BuildingStatus.ACTIVE &&
      buildingType.category === BuildingCategory.STORAGE
    ) {
      this.#transportLogisticsService.ensureStorageForBuilding(building);
    }

    return Result.ok(buildingId);
  }
}
