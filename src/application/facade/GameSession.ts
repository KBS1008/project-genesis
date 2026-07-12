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
import { BuyResourceUseCase } from '../use-cases/BuyResourceUseCase.js';
import { StartProductionUseCase } from '../use-cases/StartProductionUseCase.js';
import { StartResearchUseCase } from '../use-cases/StartResearchUseCase.js';
import { SaveGameUseCase } from '../use-cases/SaveGameUseCase.js';
import { LoadGameUseCase } from '../use-cases/LoadGameUseCase.js';
import { GetCompanyQueryHandler } from '../queries/GetCompanyQueryHandler.js';
import { ListBuildingsQueryHandler } from '../queries/ListBuildingsQueryHandler.js';
import { GetInventoryQueryHandler } from '../queries/GetInventoryQueryHandler.js';
import { GetFinanceQueryHandler } from '../queries/GetFinanceQueryHandler.js';
import { ListFinanceTransactionsQueryHandler } from '../queries/ListFinanceTransactionsQueryHandler.js';
import { GetMarketPricesQueryHandler } from '../queries/GetMarketPricesQueryHandler.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { ProductionJobStatus } from '../../domain/production/ProductionJobStatus.js';
import { TransportOrderStatus } from '../../domain/transport/TransportOrderStatus.js';
import type { BuildingReadModel } from '../read-models/BuildingReadModel.js';
import type {
  GameSessionDashboard,
  MilestoneCatalogEntry,
  ProductionJobSessionReadModel,
  ResearchJobSessionReadModel,
  TransportOrderSessionReadModel,
} from './GameSessionDashboard.js';
import { GameSessionDashboardBuilder } from './GameSessionDashboardBuilder.js';
import type {
  DashboardTickHistory,
  TickHistoryQuery,
} from '../read-models/TickMetricsSnapshot.js';

/** Options for creating a {@link GameSession}. */
export type CreateGameSessionOptions = {
  readonly gameContentRoot: string;
  readonly savePath?: string;
};

/** Input for placing a building through the session facade. */
export type PlaceBuildingInput = {
  readonly buildingTypeId: string;
  readonly name: string;
  readonly x: number;
  readonly y: number;
};

/** Input for market trades through the session facade. */
export type MarketTradeInput = {
  readonly resourceId: string;
  readonly amount: number;
};

/** @deprecated Use {@link MarketTradeInput}. */
export type SellResourceInput = MarketTradeInput;

/** Input for starting production through the session facade. */
export type StartProductionInput = {
  readonly buildingId: string;
  readonly recipeId: string;
};

/** Input for starting research through the session facade. */
export type StartResearchInput = {
  readonly technologyId: string;
};

const DEFAULT_COMPANY_ID = 'company_001';
const DEFAULT_PLAYER_ID = 'player_001';
const STARTER_WOOD = 20;
const DEFAULT_SAVE_PATH = 'saves/browser-session.json';
const MAX_TICK_BATCH = 500;

/**
 * Coordinates a single-player browser session against the application layer.
 */
export class GameSession {
  #context: ApplicationContext;
  #createCompany!: CreateCompanyUseCase;
  #placeBuilding!: PlaceBuildingUseCase;
  #sellResource!: SellResourceUseCase;
  #buyResource!: BuyResourceUseCase;
  #startProduction!: StartProductionUseCase;
  #startResearch!: StartResearchUseCase;
  #saveGame!: SaveGameUseCase;
  #loadGame!: LoadGameUseCase;
  #getCompany!: GetCompanyQueryHandler;
  #listBuildings!: ListBuildingsQueryHandler;
  #getInventory!: GetInventoryQueryHandler;
  #getFinance!: GetFinanceQueryHandler;
  #listFinanceTransactions!: ListFinanceTransactionsQueryHandler;
  #getMarketPrices!: GetMarketPricesQueryHandler;
  #dashboardBuilder!: GameSessionDashboardBuilder;
  readonly #gameContentRoot: string;
  readonly #savePath: string;
  #activeCompanyId: string | undefined;
  #buildingSequence = 0;
  #productionSequence = 0;
  #researchSequence = 0;

  private constructor(context: ApplicationContext, gameContentRoot: string, savePath: string) {
    this.#context = context;
    this.#gameContentRoot = gameContentRoot;
    this.#savePath = savePath;
    this.#wireUseCases();
    this.#syncSessionState();
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

    return Result.ok(
      new GameSession(
        bootstrapResult.value,
        options.gameContentRoot,
        options.savePath ?? DEFAULT_SAVE_PATH,
      ),
    );
  }

  /** Starts a fresh company with starter inventory for the browser shell. */
  startNewGame(name = 'Genesis Industries'): Result<void, ValidationError> {
    this.#buildingSequence = 0;
    this.#productionSequence = 0;
    this.#researchSequence = 0;

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
    this.#context.tickHistoryService.clear(DEFAULT_COMPANY_ID);
    this.#recordTickSnapshot();
    return Result.ok(undefined);
  }

  /** Returns the aggregated dashboard snapshot for the active company. */
  getDashboard(): Result<GameSessionDashboard, ValidationError> {
    if (this.#activeCompanyId === undefined) {
      return Result.ok(this.#emptyDashboard());
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

    const financeTransactionsResult = this.#listFinanceTransactions.execute({ companyId });

    if (!financeTransactionsResult.ok) {
      return Result.fail(financeTransactionsResult.error);
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
    const completedMilestones = Object.freeze(milestones?.getCompletedMilestones() ?? []);
    const completedSet = new Set(completedMilestones);

    const companyResearch = this.#context.companyResearchRepository.findByCompanyId(
      companyIdResult.value,
    );
    const completedResearch = Object.freeze(companyResearch?.getCompletedTechnologies() ?? []);

    const productionJobs = Object.freeze(this.#readProductionJobs(companyId));
    const transportOrders = Object.freeze(
      this.#readTransportOrders(companyId, buildingsResult.value, productionJobs),
    );
    const warehouseStorage = Object.freeze(
      this.#dashboardBuilder.readWarehouseStorage(companyId, buildingsResult.value),
    );
    const researchJobs = Object.freeze(this.#readResearchJobs(companyId));
    const marketPrices = this.#readMarketPrices();
    const energy = this.#dashboardBuilder.readEnergy(companyId);
    const logistics = this.#dashboardBuilder.readLogisticsSummary({
      warehouseStorage,
      productionJobs,
      transportOrders,
    });
    const kpis = this.#dashboardBuilder.readKpis({
      finance: financeResult.value,
      energy,
      inventory: inventoryResult.value,
      logistics,
    });

    const hintInput = {
      companyId,
      buildings: buildingsResult.value,
      inventory: inventoryResult.value,
      warehouseStorage,
      finance: financeResult.value,
      marketPrices,
      completedMilestones: completedSet,
      completedResearch: new Set(completedResearch),
      researchJobs,
      productionJobs,
      transportOrders,
    };

    return Result.ok({
      tickNumber: this.#context.simulationEngine.state.tickNumber,
      simulationTime: this.#context.clock.now(),
      company: companyResult.value,
      finance: financeResult.value,
      financeTransactions: financeTransactionsResult.value,
      inventory: inventoryResult.value,
      warehouseStorage,
      buildings: buildingsResult.value,
      marketPrices,
      milestones: this.#readMilestoneCatalog(completedSet),
      completedMilestones,
      completedResearch,
      productionJobs,
      transportOrders,
      researchJobs,
      contentNames: this.#dashboardBuilder.readContentNames(),
      energy,
      logistics,
      kpis,
      hints: this.#dashboardBuilder.readHints(hintInput),
    });
  }

  /** Returns recorded tick metrics for dashboard charts. */
  getTickHistory(query: TickHistoryQuery = {}): Result<DashboardTickHistory, ValidationError> {
    return Result.ok(
      Object.freeze({
        companyId: this.#activeCompanyId ?? null,
        points: this.#context.tickHistoryService.getHistory(query),
      }),
    );
  }

  /** Advances the simulation by one or more ticks. */
  tick(count = 1): Result<void, ValidationError> {
    if (!Number.isInteger(count) || count < 1 || count > MAX_TICK_BATCH) {
      return Result.fail(
        new ValidationError(`Tick count must be an integer between 1 and ${MAX_TICK_BATCH}.`),
      );
    }

    for (let index = 0; index < count; index += 1) {
      const tickResult = this.#context.simulationEngine.tick();

      if (!tickResult.ok) {
        return Result.fail(tickResult.error);
      }

      this.#recordTickSnapshot();
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

  /** Starts a production job on an active building. */
  startProduction(input: StartProductionInput): Result<string, ValidationError> {
    if (this.#activeCompanyId === undefined) {
      return Result.fail(new ValidationError('Start a new game before starting production.'));
    }

    this.#productionSequence += 1;
    const jobId = `production_${String(this.#productionSequence).padStart(3, '0')}`;

    const startResult = this.#startProduction.execute({
      jobId,
      buildingId: input.buildingId,
      recipeId: input.recipeId,
    });

    if (!startResult.ok) {
      return Result.fail(startResult.error);
    }

    return Result.ok(startResult.value.value);
  }

  /** Starts a research job for the active company. */
  startResearch(input: StartResearchInput): Result<string, ValidationError> {
    if (this.#activeCompanyId === undefined) {
      return Result.fail(new ValidationError('Start a new game before starting research.'));
    }

    this.#researchSequence += 1;
    const jobId = `research_${String(this.#researchSequence).padStart(3, '0')}`;

    const startResult = this.#startResearch.execute({
      jobId,
      companyId: this.#activeCompanyId,
      technologyId: input.technologyId,
    });

    if (!startResult.ok) {
      return Result.fail(startResult.error);
    }

    return Result.ok(startResult.value.value);
  }

  /** Sells resources for the active company. */
  sellResource(input: MarketTradeInput): Result<void, ValidationError> {
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

    return this.tick();
  }

  /** Buys resources for the active company. */
  buyResource(input: MarketTradeInput): Result<void, ValidationError> {
    if (this.#activeCompanyId === undefined) {
      return Result.fail(new ValidationError('Start a new game before trading.'));
    }

    const buyResult = this.#buyResource.execute({
      companyId: this.#activeCompanyId,
      resourceId: input.resourceId,
      amount: input.amount,
    });

    if (!buyResult.ok) {
      return Result.fail(buyResult.error);
    }

    return this.tick();
  }

  /** Persists the current session to the configured save path. */
  async saveGame(): Promise<Result<string, ValidationError>> {
    if (this.#activeCompanyId === undefined) {
      return Result.fail(new ValidationError('Start a new game before saving.'));
    }

    return this.#saveGame.execute({ filePath: this.#savePath });
  }

  /** Restores a session from the configured save path. */
  async loadGame(): Promise<Result<void, ValidationError>> {
    const loadResult = await this.#loadGame.execute({
      filePath: this.#savePath,
      gameContentRoot: this.#gameContentRoot,
    });

    if (!loadResult.ok) {
      return Result.fail(new ValidationError(loadResult.error.message));
    }

    this.#replaceContext(loadResult.value);
    this.#syncSessionState();

    if (
      this.#activeCompanyId !== undefined &&
      this.#context.tickHistoryService.getHistory().length === 0
    ) {
      this.#recordTickSnapshot();
    }

    return Result.ok(undefined);
  }

  #wireUseCases(): void {
    this.#createCompany = new CreateCompanyUseCase(this.#context);
    this.#placeBuilding = new PlaceBuildingUseCase(this.#context);
    this.#sellResource = new SellResourceUseCase(this.#context);
    this.#buyResource = new BuyResourceUseCase(this.#context);
    this.#startProduction = new StartProductionUseCase(this.#context);
    this.#startResearch = new StartResearchUseCase(this.#context);
    this.#saveGame = new SaveGameUseCase(this.#context);
    this.#loadGame = new LoadGameUseCase();
    this.#getCompany = new GetCompanyQueryHandler(this.#context);
    this.#listBuildings = new ListBuildingsQueryHandler(this.#context);
    this.#getInventory = new GetInventoryQueryHandler(this.#context);
    this.#getFinance = new GetFinanceQueryHandler(this.#context);
    this.#listFinanceTransactions = new ListFinanceTransactionsQueryHandler(this.#context);
    this.#getMarketPrices = new GetMarketPricesQueryHandler(this.#context);
    this.#dashboardBuilder = new GameSessionDashboardBuilder(
      this.#context,
      this.#context.energyBalanceService,
    );
  }

  #replaceContext(context: ApplicationContext): void {
    this.#context = context;
    this.#wireUseCases();
    this.#syncSessionState();
  }

  #syncSessionState(): void {
    const companies = this.#context.companyRepository.findAll();

    if (companies.length === 0) {
      this.#activeCompanyId = undefined;
      this.#buildingSequence = 0;
      this.#productionSequence = 0;
      this.#researchSequence = 0;
      return;
    }

    const preferredCompany = companies.find(
      (company) => company.getId().value === DEFAULT_COMPANY_ID,
    );
    const activeCompany = preferredCompany ?? companies[0];

    if (activeCompany === undefined) {
      this.#activeCompanyId = undefined;
      return;
    }

    this.#activeCompanyId = activeCompany.getId().value;

    const companyIdResult = createCompanyId(this.#activeCompanyId);

    if (!companyIdResult.ok) {
      return;
    }

    const companyId = companyIdResult.value;
    const buildings = this.#context.buildingRepository.findByCompanyId(companyId);
    const productionJobs = this.#context.productionJobRepository
      .findAll()
      .filter((job) => job.getCompanyId().value === companyId.value);
    const researchJobs = this.#context.researchJobRepository.findByCompanyId(companyId);

    this.#buildingSequence = this.#maxSequenceFromIds(
      'building_',
      buildings.map((building) => building.getId().value),
    );
    this.#productionSequence = this.#maxSequenceFromIds(
      'production_',
      productionJobs.map((job) => job.getId().value),
    );
    this.#researchSequence = this.#maxSequenceFromIds(
      'research_',
      researchJobs.map((job) => job.getId().value),
    );
  }

  #maxSequenceFromIds(prefix: string, ids: readonly string[]): number {
    return ids.reduce((max, id) => {
      if (!id.startsWith(prefix)) {
        return max;
      }

      const numericPart = Number.parseInt(id.slice(prefix.length), 10);
      return Number.isFinite(numericPart) ? Math.max(max, numericPart) : max;
    }, 0);
  }

  #recordTickSnapshot(): void {
    if (this.#activeCompanyId === undefined) {
      return;
    }

    const companyId = this.#activeCompanyId;
    const financeResult = this.#getFinance.execute({ companyId });

    if (!financeResult.ok) {
      return;
    }

    const buildingsResult = this.#listBuildings.execute({ companyId });

    if (!buildingsResult.ok) {
      return;
    }

    const productionJobs = this.#readProductionJobs(companyId);
    const transportOrders = this.#readTransportOrders(
      companyId,
      buildingsResult.value,
      productionJobs,
    );
    const warehouseStorage = this.#dashboardBuilder.readWarehouseStorage(
      companyId,
      buildingsResult.value,
    );
    const energy = this.#dashboardBuilder.readEnergy(companyId);
    const logistics = this.#dashboardBuilder.readLogisticsSummary({
      warehouseStorage,
      productionJobs,
      transportOrders,
    });
    const inventoryResult = this.#getInventory.execute({ companyId });

    if (!inventoryResult.ok) {
      return;
    }

    this.#context.tickHistoryService.record(
      this.#dashboardBuilder.captureTickMetrics({
        tickNumber: this.#context.simulationEngine.state.tickNumber,
        simulationTime: this.#context.clock.now(),
        finance: financeResult.value,
        energy,
        logistics,
        inventory: inventoryResult.value,
      }),
      companyId,
    );
  }

  #emptyDashboard(): GameSessionDashboard {
    const emptyHints = Object.freeze({
      placeBuilding: Object.freeze([]),
      production: Object.freeze([]),
      research: Object.freeze([]),
      market: Object.freeze([]),
    });

    return {
      tickNumber: this.#context.simulationEngine.state.tickNumber,
      simulationTime: this.#context.clock.now(),
      company: null,
      finance: null,
      financeTransactions: Object.freeze([]),
      inventory: null,
      warehouseStorage: Object.freeze([]),
      buildings: Object.freeze([]),
      marketPrices: this.#readMarketPrices(),
      milestones: this.#readMilestoneCatalog(new Set()),
      completedMilestones: Object.freeze([]),
      completedResearch: Object.freeze([]),
      productionJobs: Object.freeze([]),
      transportOrders: Object.freeze([]),
      researchJobs: Object.freeze([]),
      contentNames: this.#dashboardBuilder.readContentNames(),
      energy: null,
      logistics: null,
      kpis: null,
      hints: emptyHints,
    };
  }

  #readMilestoneCatalog(completedSet: ReadonlySet<string>): readonly MilestoneCatalogEntry[] {
    return Object.freeze(
      this.#context.gameContent.milestones.getAll().map((milestone) =>
        Object.freeze({
          id: milestone.id,
          name: milestone.name,
          completed: completedSet.has(milestone.id),
        }),
      ),
    );
  }

  #readProductionJobs(companyId: string): readonly ProductionJobSessionReadModel[] {
    const companyIdResult = createCompanyId(companyId);

    if (!companyIdResult.ok) {
      return Object.freeze([]);
    }

    return Object.freeze(
      this.#context.productionJobRepository
        .findAll()
        .filter((job) => job.getCompanyId().value === companyIdResult.value.value)
        .map((job) => {
          const activeTransportCount = this.#context.transportOrderRepository
            .findByProductionJobId(job.getId().value)
            .filter((order) => order.getStatus() === TransportOrderStatus.IN_PROGRESS).length;
          const linkedTransportCount = this.#context.transportOrderRepository.findByProductionJobId(
            job.getId().value,
          ).length;

          return Object.freeze({
            id: job.getId().value,
            buildingId: job.getBuildingId().value,
            recipeId: job.getRecipeId().value,
            status: job.getStatus(),
            progress: job.getProgress(),
            awaitingTransport:
              job.getStatus() === ProductionJobStatus.WAITING && linkedTransportCount > 0,
            activeTransportCount,
          });
        }),
    );
  }

  #readTransportOrders(
    companyId: string,
    buildings: readonly BuildingReadModel[],
    productionJobs: readonly ProductionJobSessionReadModel[],
  ): readonly TransportOrderSessionReadModel[] {
    const companyIdResult = createCompanyId(companyId);

    if (!companyIdResult.ok) {
      return Object.freeze([]);
    }

    const buildingNameById = new Map(buildings.map((building) => [building.id, building.name]));
    const recipeByJobId = new Map(
      productionJobs.map((job) => [job.id, { recipeId: job.recipeId }]),
    );

    return Object.freeze(
      this.#context.transportOrderRepository
        .findByCompanyId(companyIdResult.value)
        .map((order) => {
          const recipeId = recipeByJobId.get(order.getProductionJobId())?.recipeId ?? null;
          const recipe = recipeId === null ? undefined : this.#context.gameContent.recipes.get(recipeId);

          return Object.freeze({
            id: order.getId().value,
            resourceId: order.getResourceId(),
            amount: order.getAmount(),
            status: order.getStatus(),
            progress: order.getProgress(),
            sourceBuildingId: order.getSourceBuildingId().value,
            sourceBuildingName:
              buildingNameById.get(order.getSourceBuildingId().value) ??
              order.getSourceBuildingId().value,
            destinationBuildingId: order.getDestinationBuildingId().value,
            destinationBuildingName:
              buildingNameById.get(order.getDestinationBuildingId().value) ??
              order.getDestinationBuildingId().value,
            productionJobId: order.getProductionJobId(),
            recipeId,
            recipeName: recipe?.name ?? null,
          });
        }),
    );
  }

  #readResearchJobs(companyId: string): readonly ResearchJobSessionReadModel[] {
    const companyIdResult = createCompanyId(companyId);

    if (!companyIdResult.ok) {
      return Object.freeze([]);
    }

    return Object.freeze(
      this.#context.researchJobRepository
        .findByCompanyId(companyIdResult.value)
        .map((job) =>
          Object.freeze({
            id: job.getId().value,
            technologyId: job.getTechnologyId().value,
            status: job.getStatus(),
            progress: job.getProgress(),
          }),
        ),
    );
  }

  #readMarketPrices() {
    const marketResult = this.#getMarketPrices.execute({});

    if (!marketResult.ok) {
      return Object.freeze([]);
    }

    return marketResult.value;
  }
}
