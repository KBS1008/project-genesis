/**
 * @module @application/facade/GameSession
 *
 * Browser-facing application facade that coordinates use cases and queries.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { PlaceBuildingUseCase } from '../use-cases/PlaceBuildingUseCase.js';
import { SellResourceUseCase } from '../use-cases/SellResourceUseCase.js';
import { GetCompanyQueryHandler } from '../queries/GetCompanyQueryHandler.js';
import { ListBuildingsQueryHandler } from '../queries/ListBuildingsQueryHandler.js';
import { GetInventoryQueryHandler } from '../queries/GetInventoryQueryHandler.js';
import { GetFinanceQueryHandler } from '../queries/GetFinanceQueryHandler.js';
import { GetMarketPricesQueryHandler } from '../queries/GetMarketPricesQueryHandler.js';
import { createCompanyId } from '../../domain/company/Company.js';
import type { GameSessionDashboard } from './GameSessionDashboard.js';

/** Options for creating a {@link GameSession}. */
export type CreateGameSessionOptions = {
  readonly gameContentRoot: string;
};

/** Input for placing a building through the session facade. */
export type PlaceBuildingInput = {
  readonly buildingTypeId: string;
  readonly name: string;
  readonly x: number;
  readonly y: number;
};

/** Input for selling resources through the session facade. */
export type SellResourceInput = {
  readonly resourceId: string;
  readonly amount: number;
};

const DEFAULT_COMPANY_ID = 'company_001';
const DEFAULT_PLAYER_ID = 'player_001';
const STARTER_WOOD = 20;

/**
 * Coordinates a single-player browser session against the application layer.
 */
export class GameSession {
  readonly #context: ApplicationContext;
  readonly #createCompany: CreateCompanyUseCase;
  readonly #placeBuilding: PlaceBuildingUseCase;
  readonly #sellResource: SellResourceUseCase;
  readonly #getCompany: GetCompanyQueryHandler;
  readonly #listBuildings: ListBuildingsQueryHandler;
  readonly #getInventory: GetInventoryQueryHandler;
  readonly #getFinance: GetFinanceQueryHandler;
  readonly #getMarketPrices: GetMarketPricesQueryHandler;
  #activeCompanyId: string | undefined;
  #buildingSequence = 0;

  private constructor(context: ApplicationContext) {
    this.#context = context;
    this.#createCompany = new CreateCompanyUseCase(context);
    this.#placeBuilding = new PlaceBuildingUseCase(context);
    this.#sellResource = new SellResourceUseCase(context);
    this.#getCompany = new GetCompanyQueryHandler(context);
    this.#listBuildings = new ListBuildingsQueryHandler(context);
    this.#getInventory = new GetInventoryQueryHandler(context);
    this.#getFinance = new GetFinanceQueryHandler(context);
    this.#getMarketPrices = new GetMarketPricesQueryHandler(context);
  }

  /**
   * Bootstraps application dependencies and returns a new session.
   */
  static async create(
    options: CreateGameSessionOptions,
  ): Promise<Result<GameSession, ValidationError>> {
    const bootstrapResult = await bootstrapApplication({
      gameContentRoot: options.gameContentRoot,
    });

    if (!bootstrapResult.ok) {
      return Result.fail(new ValidationError(bootstrapResult.error.message));
    }

    return Result.ok(new GameSession(bootstrapResult.value));
  }

  /** Starts a fresh company with starter inventory for the browser shell. */
  startNewGame(name = 'Genesis Industries'): Result<void, ValidationError> {
    this.#buildingSequence = 0;

    const createResult = this.#createCompany.execute({
      companyId: DEFAULT_COMPANY_ID,
      name,
      ownerId: DEFAULT_PLAYER_ID,
    });

    if (!createResult.ok) {
      return Result.fail(createResult.error);
    }

    const companyIdResult = createCompanyId(DEFAULT_COMPANY_ID);

    if (!companyIdResult.ok) {
      return Result.fail(companyIdResult.error);
    }

    const inventory = this.#context.inventoryRepository.findByCompanyId(companyIdResult.value);

    if (inventory === undefined) {
      return Result.fail(new ValidationError('Starter inventory was not created.'));
    }

    inventory.addQuantity('wood', STARTER_WOOD, this.#context.clock);
    this.#context.inventoryRepository.save(inventory);
    inventory.pullDomainEvents();

    this.#activeCompanyId = DEFAULT_COMPANY_ID;
    return Result.ok(undefined);
  }

  /** Returns the aggregated dashboard snapshot for the active company. */
  getDashboard(): Result<GameSessionDashboard, ValidationError> {
    if (this.#activeCompanyId === undefined) {
      return Result.ok({
        tickNumber: this.#context.simulationEngine.state.tickNumber,
        simulationTime: this.#context.clock.now(),
        company: null,
        finance: null,
        inventory: null,
        buildings: Object.freeze([]),
        marketPrices: this.#readMarketPrices(),
        completedMilestones: Object.freeze([]),
      });
    }

    const companyId = this.#activeCompanyId;
    const companyIdResult = createCompanyId(companyId);

    if (!companyIdResult.ok) {
      return Result.fail(companyIdResult.error);
    }

    const companyResult = this.#getCompany.execute({ companyId });

    if (!companyResult.ok) {
      return Result.fail(companyResult.error);
    }

    const financeResult = this.#getFinance.execute({ companyId });

    if (!financeResult.ok) {
      return Result.fail(financeResult.error);
    }

    const inventoryResult = this.#getInventory.execute({ companyId });

    if (!inventoryResult.ok) {
      return Result.fail(inventoryResult.error);
    }

    const buildingsResult = this.#listBuildings.execute({ companyId });

    if (!buildingsResult.ok) {
      return Result.fail(buildingsResult.error);
    }

    const milestones = this.#context.companyMilestonesRepository.findByCompanyId(
      companyIdResult.value,
    );

    return Result.ok({
      tickNumber: this.#context.simulationEngine.state.tickNumber,
      simulationTime: this.#context.clock.now(),
      company: companyResult.value,
      finance: financeResult.value,
      inventory: inventoryResult.value,
      buildings: buildingsResult.value,
      marketPrices: this.#readMarketPrices(),
      completedMilestones: Object.freeze(milestones?.getCompletedMilestones() ?? []),
    });
  }

  /** Advances the simulation by one tick. */
  tick(): Result<void, ValidationError> {
    const tickResult = this.#context.simulationEngine.tick();

    if (!tickResult.ok) {
      return Result.fail(tickResult.error);
    }

    return Result.ok(undefined);
  }

  /** Places a building for the active company. */
  placeBuilding(input: PlaceBuildingInput): Result<string, ValidationError> {
    if (this.#activeCompanyId === undefined) {
      return Result.fail(new ValidationError('Start a new game before placing buildings.'));
    }

    this.#buildingSequence += 1;
    const buildingId = `building_${String(this.#buildingSequence).padStart(3, '0')}`;

    const placeResult = this.#placeBuilding.execute({
      buildingId,
      buildingTypeId: input.buildingTypeId,
      companyId: this.#activeCompanyId,
      name: input.name,
      x: input.x,
      y: input.y,
    });

    if (!placeResult.ok) {
      return Result.fail(placeResult.error);
    }

    return Result.ok(placeResult.value.value);
  }

  /** Sells resources for the active company. */
  sellResource(input: SellResourceInput): Result<void, ValidationError> {
    if (this.#activeCompanyId === undefined) {
      return Result.fail(new ValidationError('Start a new game before trading.'));
    }

    const sellResult = this.#sellResource.execute({
      companyId: this.#activeCompanyId,
      resourceId: input.resourceId,
      amount: input.amount,
    });

    if (!sellResult.ok) {
      return Result.fail(sellResult.error);
    }

    const tickResult = this.#context.simulationEngine.tick();

    if (!tickResult.ok) {
      return Result.fail(tickResult.error);
    }

    return Result.ok(undefined);
  }

  #readMarketPrices() {
    const marketResult = this.#getMarketPrices.execute({});

    if (!marketResult.ok) {
      return Object.freeze([]);
    }

    return marketResult.value;
  }
}
