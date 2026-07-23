/**
 * @module @infrastructure/persistence/savegame/GameStateSerializer
 *
 * Serializes and restores in-memory game state snapshots.
 */

import { ValidationError } from '../../../common/errors/ValidationError.js';
import { Result } from '../../../common/result/Result.js';
import type { ManualClock } from '../../../common/time/ManualClock.js';
import {
  Building,
  createBuildingId,
  createBuildingTypeId,
} from '../../../domain/building/Building.js';
import { BuildingStatus } from '../../../domain/building/BuildingStatus.js';
import { Position } from '../../../domain/building/Position.js';
import type { BuildingRepository } from '../../../domain/building/BuildingRepository.js';
import { createRegionId } from '../../../domain/region/RegionId.js';
import { GLOBAL_MARKET_ID } from '../../../domain/market/MarketConstants.js';
import { DEFAULT_REGION_ID, DEFAULT_WORLD_ID } from '../../../domain/world/WorldConstants.js';
import { BuildingStorage } from '../../../domain/building/BuildingStorage.js';
import type { BuildingStorageRepository } from '../../../domain/building/BuildingStorageRepository.js';
import { Company, createCompanyId, createPlayerId } from '../../../domain/company/Company.js';
import type { CompanyRepository } from '../../../domain/company/CompanyRepository.js';
import {
  FinanceAccount,
  createFinanceAccountId,
  createFinanceTransactionId,
} from '../../../domain/finance/FinanceAccount.js';
import type { FinanceRepository } from '../../../domain/finance/FinanceRepository.js';
import type { FinanceTransactionDirection } from '../../../domain/finance/FinanceTransactionDirection.js';
import type { FinanceTransaction } from '../../../domain/finance/FinanceTransaction.js';
import type { FinanceTransactionType } from '../../../domain/finance/FinanceTransactionType.js';
import { Inventory, createInventoryId } from '../../../domain/inventory/Inventory.js';
import type { InventoryRepository } from '../../../domain/inventory/InventoryRepository.js';
import { Market, createMarketId } from '../../../domain/market/Market.js';
import type { MarketRepository } from '../../../domain/market/MarketRepository.js';
import { ProductionJob, createProductionJobId } from '../../../domain/production/ProductionJob.js';
import type { ProductionJobRepository } from '../../../domain/production/ProductionJobRepository.js';
import type { ResearchJobRepository } from '../../../domain/research/ResearchJobRepository.js';
import type { CompanyResearchRepository } from '../../../domain/research/CompanyResearchRepository.js';
import { CompanyResearch } from '../../../domain/research/CompanyResearch.js';
import { createCompanyResearchId } from '../../../domain/research/CompanyResearchId.js';
import type { CompanyMilestonesRepository } from '../../../domain/milestone/CompanyMilestonesRepository.js';
import {
  Employee,
  createEmployeeId,
  createEmployeeTypeId,
} from '../../../domain/employee/Employee.js';
import type { EmployeeStatus } from '../../../domain/employee/EmployeeStatus.js';
import { CompanyMilestones } from '../../../domain/milestone/CompanyMilestones.js';
import { createCompanyMilestonesId } from '../../../domain/milestone/CompanyMilestonesId.js';
import { ResearchJob, createResearchJobId } from '../../../domain/research/ResearchJob.js';
import { createTechnologyId } from '../../../domain/research/TechnologyId.js';
import { createRecipeId } from '../../../domain/production/RecipeId.js';
import { createResourceTypeId } from '../../../domain/shared/ResourceTypeId.js';
import { TransportOrder } from '../../../domain/transport/TransportOrder.js';
import { createTransportOrderId } from '../../../domain/transport/TransportOrderId.js';
import type { TransportOrderStatus } from '../../../domain/transport/TransportOrderStatus.js';
import type { TransportOrderRepository } from '../../../domain/transport/TransportOrderRepository.js';
import {
  SupplyContract,
  createSupplyContractId,
  type SupplyContractKind,
} from '../../../domain/contract/SupplyContract.js';
import type { TickHistorySnapshotProvider } from '../../../application/ports/TickHistorySnapshotProvider.js';
import type {
  GameStateSerializerPort,
  GameStateSource,
  GameStateTarget,
  RestoredSimulationMetadata,
} from '../../../application/ports/GameStateSerializerPort.js';
import type { SimulationEngine } from '../../../simulation/engine/SimulationEngine.js';
import { SimulationState } from '../../../simulation/state/SimulationState.js';
import {
  GAME_SAVE_SCHEMA_VERSION as GAME_SAVE_SCHEMA_VERSION_V1,
  type GameSaveSnapshotV1,
  type GameSaveSupplyContractSnapshotV1,
} from '../../../application/persistence/GameSaveSnapshotV1.js';
import {
  GAME_SAVE_SCHEMA_VERSION as GAME_SAVE_SCHEMA_VERSION_V2,
  type GameSaveSnapshotV2,
} from '../../../application/persistence/GameSaveSnapshotV2.js';
import { migrateGameSaveSnapshotV1ToV2 } from '../../../application/persistence/migrateGameSaveSnapshotV1ToV2.js';
import { migrateGameSaveSnapshotV2ToV3 } from '../../../application/persistence/migrateGameSaveSnapshotV2ToV3.js';
import { restoreCompanyBrain, serializeCompanyBrains } from '../../../application/persistence/companyBrainSnapshotMapper.js';
import { serializeRegionalMarkets } from '../../../application/persistence/regionalMarketSnapshotMapper.js';
import { orderGameSaveSnapshotV3 } from '../../../application/persistence/orderGameSaveSnapshotV3.js';
import {
  GAME_SAVE_SCHEMA_VERSION,
  type GameSaveRegionalMarketSnapshotV3,
  type GameSaveSnapshotV3,
} from '../../../application/persistence/GameSaveSnapshotV3.js';

export type { GameStateSource, GameStateTarget, RestoredSimulationMetadata };

/**
 * Converts live repositories into a versioned save snapshot.
 */
export class GameStateSerializer implements GameStateSerializerPort {
  serialize(source: GameStateSource): Result<GameSaveSnapshotV3, ValidationError> {
    if (source.simulationEngine.hasPendingEvents()) {
      return Result.fail(
        new ValidationError(
          'Cannot save while domain events are still queued for the next simulation tick.',
        ),
      );
    }

    const tickMetricsHistory = this.#serializeTickMetricsHistory(source.tickHistoryService);
    const activeWorldId = this.#resolveActiveWorldId(source);
    const hasGlobalMarket = source.marketRepository
      .findAll()
      .some((market) => market.getId().value === GLOBAL_MARKET_ID);
    const marketRegionMappings = hasGlobalMarket
      ? Object.freeze([
          Object.freeze({
            marketId: GLOBAL_MARKET_ID,
            regionId: DEFAULT_REGION_ID,
          }),
        ])
      : Object.freeze([]);

    return Result.ok(
      orderGameSaveSnapshotV3(
        Object.freeze({
          schemaVersion: GAME_SAVE_SCHEMA_VERSION,
          savedAtUtc: new Date().toISOString(),
          world: Object.freeze({
            activeWorldId,
          }),
          marketRegionMappings,
          simulation: Object.freeze({
            clockTime: source.clock.now(),
            tickNumber: source.simulationEngine.state.tickNumber,
            paused: source.simulationEngine.state.paused,
            tickDuration: source.simulationEngine.tickDuration,
          }),
          companies: Object.freeze(
            source.companyRepository.findAll().map((company) =>
              Object.freeze({
                id: company.getId().value,
                name: company.getName(),
                ownerId: company.getOwnerId().value,
                foundedAt: company.getFoundedAt(),
                status: company.getStatus(),
              }),
            ),
          ),
          companyBrains: serializeCompanyBrains(source.companyBrainRepository),
          regionalMarkets: serializeRegionalMarkets(source.marketRepository),
        buildings: Object.freeze(
          source.buildingRepository.findAll().map((building) =>
            Object.freeze({
              id: building.getId().value,
              buildingTypeId: building.getBuildingTypeId().value,
              companyId: building.getCompanyId().value,
              regionId: building.getRegionId().value,
              name: building.getName(),
              position: Object.freeze({
                x: building.getPosition().x,
                y: building.getPosition().y,
              }),
              level: building.getLevel(),
              createdAt: building.getCreatedAt(),
              status: building.getStatus(),
              constructionDuration: building.getConstructionDuration(),
              constructionProgress: building.getConstructionProgress(),
              constructionStartTime: building.getConstructionStartTime(),
              constructionEndTime: building.getConstructionEndTime(),
            }),
          ),
        ),
        inventories: Object.freeze(
          source.inventoryRepository.findAll().map((inventory) =>
            Object.freeze({
              id: inventory.getId().value,
              companyId: inventory.getCompanyId().value,
              createdAt: inventory.getCreatedAt(),
              status: inventory.getStatus(),
              items: Object.freeze(
                inventory.getItems().map((item) =>
                  Object.freeze({
                    resourceId: item.resourceId.value,
                    quantity: item.quantity,
                    reserved: item.reserved,
                  }),
                ),
              ),
            }),
          ),
        ),
        financeAccounts: Object.freeze(
          source.financeRepository.findAll().map((account) =>
            Object.freeze({
              id: account.getId().value,
              companyId: account.getCompanyId().value,
              currency: account.getCurrency(),
              createdAt: account.getCreatedAt(),
              cashBalance: account.getCashBalance(),
              reservedCash: account.getReservedCash(),
              lastTaxCollectedAt: account.getLastTaxCollectedAt(),
              transactionSequence: account.getTransactionSequence(),
              transactions: Object.freeze(
                account.getTransactions().map((transaction) =>
                  Object.freeze({
                    id: transaction.id.value,
                    financeId: transaction.financeId,
                    companyId: transaction.companyId,
                    transactionType: transaction.transactionType,
                    direction: transaction.direction,
                    amount: transaction.amount,
                    balanceBefore: transaction.balanceBefore,
                    balanceAfter: transaction.balanceAfter,
                    reservedCashDelta: transaction.reservedCashDelta,
                    timestamp: transaction.timestamp,
                  }),
                ),
              ),
            }),
          ),
        ),
        productionJobs: Object.freeze(
          source.productionJobRepository.findAll().map((job) =>
            Object.freeze({
              id: job.getId().value,
              buildingId: job.getBuildingId().value,
              companyId: job.getCompanyId().value,
              recipeId: job.getRecipeId().value,
              duration: job.getDuration(),
              status: job.getStatus(),
              progress: job.getProgress(),
              createdAt: job.getCreatedAt(),
              startTime: job.getStartTime(),
              endTime: job.getEndTime(),
            }),
          ),
        ),
        researchJobs: Object.freeze(
          source.researchJobRepository.findAll().map((job) =>
            Object.freeze({
              id: job.getId().value,
              companyId: job.getCompanyId().value,
              technologyId: job.getTechnologyId().value,
              duration: job.getDuration(),
              cost: job.getCost(),
              status: job.getStatus(),
              progress: job.getProgress(),
              createdAt: job.getCreatedAt(),
              startTime: job.getStartTime(),
              endTime: job.getEndTime(),
            }),
          ),
        ),
        companyResearch: Object.freeze(
          source.companyResearchRepository.findAll().map((research) =>
            Object.freeze({
              id: research.getId().value,
              companyId: research.getCompanyId().value,
              createdAt: research.getCreatedAt(),
              completedTechnologies: research.getCompletedTechnologies(),
            }),
          ),
        ),
        companyMilestones: Object.freeze(
          source.companyMilestonesRepository.findAll().map((milestones) =>
            Object.freeze({
              id: milestones.getId().value,
              companyId: milestones.getCompanyId().value,
              createdAt: milestones.getCreatedAt(),
              completedMilestones: milestones.getCompletedMilestones(),
            }),
          ),
        ),
        buildingStorages: Object.freeze(
          source.companyRepository.findAll().flatMap((company) =>
            source.buildingStorageRepository.findByCompanyId(company.getId()).map((storage) =>
              Object.freeze({
                buildingId: storage.getBuildingId().value,
                companyId: storage.getCompanyId().value,
                storageCapacity: storage.getStorageCapacity(),
                items: Object.freeze(
                  storage.getLines().map((line) =>
                    Object.freeze({
                      resourceId: line.resourceId,
                      quantity: line.quantity,
                      reserved: line.reserved,
                    }),
                  ),
                ),
              }),
            ),
          ),
        ),
        transportOrders: Object.freeze(
          source.companyRepository.findAll().flatMap((company) =>
            source.transportOrderRepository.findByCompanyId(company.getId()).map((order) =>
              Object.freeze({
                id: order.getId().value,
                companyId: order.getCompanyId().value,
                sourceBuildingId: order.getSourceBuildingId().value,
                destinationBuildingId: order.getDestinationBuildingId().value,
                resourceId: order.getResourceId(),
                amount: order.getAmount(),
                duration: order.getDuration(),
                ...(order.getRouteId() !== null ? { routeId: order.getRouteId() } : {}),
                productionJobId: order.getProductionJobId(),
                sourceRegionId: order.getSourceRegionId(),
                destinationRegionId: order.getDestinationRegionId(),
                createdAt: order.getCreatedAt(),
                status: order.getStatus(),
                startTime: order.getStartTime(),
                endTime: order.getEndTime(),
                progress: order.getProgress(),
              }),
            ),
          ),
        ),
        employees: Object.freeze(
          source.employeeRepository.findAll().map((employee) =>
            Object.freeze({
              id: employee.getId().value,
              companyId: employee.getCompanyId().value,
              employeeTypeId: employee.getEmployeeTypeId().value,
              displayName: employee.getDisplayName(),
              salary: employee.getSalary(),
              productivity: employee.getProductivity(),
              hiredAt: employee.getHiredAt(),
              status: employee.getStatus(),
              assignedBuildingId: employee.getAssignedBuildingId()?.value,
            }),
          ),
        ),
        supplyContracts: Object.freeze(
          source.supplyContractRepository.findAll().map((contract) =>
            Object.freeze({
              id: contract.getId().value,
              companyId: contract.getCompanyId().value,
              kind: contract.getKind(),
              resourceId: contract.getResourceId(),
              amount: contract.getAmount(),
              paymentAmount: contract.getPaymentAmount(),
              intervalTicks: contract.getIntervalTicks(),
              createdAt: contract.getCreatedAt(),
              lastFulfilledTick: contract.getLastFulfilledTick(),
              active: contract.isActive(),
            }),
          ),
        ),
        ...(tickMetricsHistory !== undefined ? { tickMetricsHistory } : {}),
        }),
      ),
    );
  }

  #serializeTickMetricsHistory(
    tickHistoryService: TickHistorySnapshotProvider,
  ): GameSaveSnapshotV3['tickMetricsHistory'] {
    const companyId = tickHistoryService.getCompanyId();
    const points = tickHistoryService.exportForSave();

    if (companyId === undefined || points.length === 0) {
      return undefined;
    }

    return Object.freeze({
      companyId,
      points: Object.freeze(
        points.map((point) =>
          Object.freeze({
            tickNumber: point.tickNumber,
            simulationTime: point.simulationTime,
            availableCash: point.availableCash,
            energyReserve: point.energyReserve,
            activeTransportCount: point.activeTransportCount,
            warehouseTotalUnits: point.warehouseTotalUnits,
            onSiteTotalUnits: point.onSiteTotalUnits,
            priceIndex: point.priceIndex,
            energyGeneration: point.energyGeneration,
            energyConsumption: point.energyConsumption,
            marketPrices: Object.freeze(
              point.marketPrices.map((entry) =>
                Object.freeze({
                  resourceId: entry.resourceId,
                  lastPrice: entry.lastPrice,
                  totalSupply: entry.totalSupply,
                  baselineDemand: entry.baselineDemand,
                  pressureIndex: entry.pressureIndex,
                }),
              ),
            ),
          }),
        ),
      ),
    });
  }

  parse(raw: unknown): Result<GameSaveSnapshotV3, ValidationError> {
    if (typeof raw !== 'object' || raw === null) {
      return Result.fail(new ValidationError('Savegame payload must be a JSON object.'));
    }

    const record = raw as Record<string, unknown>;
    const schemaVersion = record['schemaVersion'];

    if (schemaVersion === GAME_SAVE_SCHEMA_VERSION_V1) {
      const v1Result = this.#parseV1(raw as Partial<GameSaveSnapshotV1>);

      if (!v1Result.ok) {
        return v1Result;
      }

      return Result.ok(migrateGameSaveSnapshotV2ToV3(migrateGameSaveSnapshotV1ToV2(v1Result.value)));
    }

    if (schemaVersion === GAME_SAVE_SCHEMA_VERSION_V2) {
      const v2Result = this.#parseV2(raw as Partial<GameSaveSnapshotV2>);

      if (!v2Result.ok) {
        return v2Result;
      }

      return Result.ok(migrateGameSaveSnapshotV2ToV3(v2Result.value));
    }

    if (schemaVersion !== GAME_SAVE_SCHEMA_VERSION) {
      return Result.fail(
        new ValidationError(
          `Unsupported savegame schema version "${String(schemaVersion)}".`,
        ),
      );
    }

    return this.#parseV3(raw as Partial<GameSaveSnapshotV3>);
  }

  #parseV1(raw: Partial<GameSaveSnapshotV1>): Result<GameSaveSnapshotV1, ValidationError> {
    if (typeof raw.savedAtUtc !== 'string' || raw.simulation === undefined) {
      return Result.fail(new ValidationError('Savegame payload is missing required metadata.'));
    }

    return Result.ok({
      ...raw,
      schemaVersion: GAME_SAVE_SCHEMA_VERSION_V1,
      markets: raw.markets ?? [],
      researchJobs: raw.researchJobs ?? [],
      companyResearch: raw.companyResearch ?? [],
      companyMilestones: raw.companyMilestones ?? [],
      buildingStorages: raw.buildingStorages ?? [],
      transportOrders: raw.transportOrders ?? [],
      employees: raw.employees ?? [],
      supplyContracts: raw.supplyContracts ?? [],
      tickMetricsHistory: raw.tickMetricsHistory,
    } as GameSaveSnapshotV1);
  }

  #parseV2(raw: Partial<GameSaveSnapshotV2>): Result<GameSaveSnapshotV2, ValidationError> {
    if (
      typeof raw.savedAtUtc !== 'string' ||
      raw.simulation === undefined ||
      raw.world === undefined ||
      typeof raw.world.activeWorldId !== 'string'
    ) {
      return Result.fail(new ValidationError('Savegame payload is missing required metadata.'));
    }

    return Result.ok({
      ...raw,
      schemaVersion: GAME_SAVE_SCHEMA_VERSION_V2,
      world: raw.world,
      marketRegionMappings: raw.marketRegionMappings ?? [],
      researchJobs: raw.researchJobs ?? [],
      companyResearch: raw.companyResearch ?? [],
      companyMilestones: raw.companyMilestones ?? [],
      buildingStorages: raw.buildingStorages ?? [],
      transportOrders: raw.transportOrders ?? [],
      employees: raw.employees ?? [],
      supplyContracts: raw.supplyContracts ?? [],
      tickMetricsHistory: raw.tickMetricsHistory,
    } as GameSaveSnapshotV2);
  }

  #parseV3(raw: Partial<GameSaveSnapshotV3>): Result<GameSaveSnapshotV3, ValidationError> {
    if (
      typeof raw.savedAtUtc !== 'string' ||
      raw.simulation === undefined ||
      raw.world === undefined ||
      typeof raw.world.activeWorldId !== 'string' ||
      raw.regionalMarkets === undefined ||
      raw.companyBrains === undefined
    ) {
      return Result.fail(new ValidationError('Savegame payload is missing required metadata.'));
    }

    return Result.ok(
      orderGameSaveSnapshotV3({
        ...raw,
        schemaVersion: GAME_SAVE_SCHEMA_VERSION,
        world: raw.world,
        marketRegionMappings: raw.marketRegionMappings ?? [],
        companyBrains: raw.companyBrains ?? [],
        regionalMarkets: raw.regionalMarkets ?? [],
        researchJobs: raw.researchJobs ?? [],
        companyResearch: raw.companyResearch ?? [],
        companyMilestones: raw.companyMilestones ?? [],
        buildingStorages: raw.buildingStorages ?? [],
        transportOrders: raw.transportOrders ?? [],
        employees: raw.employees ?? [],
        supplyContracts: raw.supplyContracts ?? [],
        tickMetricsHistory: raw.tickMetricsHistory,
      } as GameSaveSnapshotV3),
    );
  }

  #resolveActiveWorldId(source: GameStateSource): string {
    const worlds = source.worldRepository.findAll();
    const preferredWorld = worlds.find((world) => world.getId().value === DEFAULT_WORLD_ID);

    if (preferredWorld !== undefined) {
      return preferredWorld.getId().value;
    }

    if (worlds.length > 0) {
      return worlds[0]!.getId().value;
    }

    return DEFAULT_WORLD_ID;
  }

  hydrate(
    snapshot: GameSaveSnapshotV3,
    target: GameStateTarget,
  ): Result<RestoredSimulationMetadata, ValidationError> {
    for (const companySnapshot of snapshot.companies) {
      const restoreResult = this.#restoreCompany(companySnapshot);

      if (!restoreResult.ok) {
        return Result.fail(restoreResult.error);
      }

      target.companyRepository.save(restoreResult.value);
    }

    for (const buildingSnapshot of snapshot.buildings) {
      const restoreResult = this.#restoreBuilding(buildingSnapshot);

      if (!restoreResult.ok) {
        return Result.fail(restoreResult.error);
      }

      target.buildingRepository.save(restoreResult.value);
    }

    for (const employeeSnapshot of snapshot.employees) {
      const restoreResult = this.#restoreEmployee(employeeSnapshot);

      if (!restoreResult.ok) {
        return Result.fail(restoreResult.error);
      }

      target.employeeRepository.save(restoreResult.value);
    }

    for (const inventorySnapshot of snapshot.inventories) {
      const restoreResult = this.#restoreInventory(inventorySnapshot);

      if (!restoreResult.ok) {
        return Result.fail(restoreResult.error);
      }

      target.inventoryRepository.save(restoreResult.value);
    }

    for (const financeSnapshot of snapshot.financeAccounts) {
      const restoreResult = this.#restoreFinanceAccount(financeSnapshot);

      if (!restoreResult.ok) {
        return Result.fail(restoreResult.error);
      }

      target.financeRepository.save(restoreResult.value);
    }

    for (const marketSnapshot of snapshot.regionalMarkets) {
      const restoreResult = this.#restoreRegionalMarket(marketSnapshot);

      if (!restoreResult.ok) {
        return Result.fail(restoreResult.error);
      }

      target.marketRepository.save(restoreResult.value);
    }

    for (const brainSnapshot of snapshot.companyBrains) {
      const restoreResult = restoreCompanyBrain(brainSnapshot);

      if (!restoreResult.ok) {
        return Result.fail(restoreResult.error);
      }

      target.companyBrainRepository.save(restoreResult.value);
    }

    for (const jobSnapshot of snapshot.productionJobs) {
      const restoreResult = this.#restoreProductionJob(jobSnapshot);

      if (!restoreResult.ok) {
        return Result.fail(restoreResult.error);
      }

      target.productionJobRepository.save(restoreResult.value);
    }

    for (const jobSnapshot of snapshot.researchJobs) {
      const restoreResult = this.#restoreResearchJob(jobSnapshot);

      if (!restoreResult.ok) {
        return Result.fail(restoreResult.error);
      }

      target.researchJobRepository.save(restoreResult.value);
    }

    for (const researchSnapshot of snapshot.companyResearch) {
      const restoreResult = this.#restoreCompanyResearch(researchSnapshot);

      if (!restoreResult.ok) {
        return Result.fail(restoreResult.error);
      }

      target.companyResearchRepository.save(restoreResult.value);
    }

    for (const milestonesSnapshot of snapshot.companyMilestones) {
      const restoreResult = this.#restoreCompanyMilestones(milestonesSnapshot);

      if (!restoreResult.ok) {
        return Result.fail(restoreResult.error);
      }

      target.companyMilestonesRepository.save(restoreResult.value);
    }

    for (const storageSnapshot of snapshot.buildingStorages) {
      const restoreResult = this.#restoreBuildingStorage(storageSnapshot);

      if (!restoreResult.ok) {
        return Result.fail(restoreResult.error);
      }

      target.buildingStorageRepository.save(restoreResult.value);
    }

    for (const transportSnapshot of snapshot.transportOrders) {
      const restoreResult = this.#restoreTransportOrder(transportSnapshot);

      if (!restoreResult.ok) {
        return Result.fail(restoreResult.error);
      }

      target.transportOrderRepository.save(restoreResult.value);
    }

    for (const contractSnapshot of snapshot.supplyContracts ?? []) {
      const restoreResult = this.#restoreSupplyContract(contractSnapshot);

      if (!restoreResult.ok) {
        return Result.fail(restoreResult.error);
      }

      target.supplyContractRepository.save(restoreResult.value);
    }

    this.#restoreTickMetricsHistory(snapshot, target.tickHistoryService);

    return Result.ok(
      Object.freeze({
        clockTime: snapshot.simulation.clockTime,
        simulationState: new SimulationState(
          snapshot.simulation.tickNumber,
          snapshot.simulation.paused,
        ),
        tickDuration: snapshot.simulation.tickDuration,
      }),
    );
  }

  #restoreTickMetricsHistory(
    snapshot: GameSaveSnapshotV3,
    tickHistoryService: TickHistorySnapshotProvider,
  ): void {
    const history = snapshot.tickMetricsHistory;

    if (history === undefined || history.points.length === 0) {
      tickHistoryService.clear();
      return;
    }

    tickHistoryService.replaceHistory(
      history.companyId,
      history.points.map((point) =>
        Object.freeze({
          tickNumber: point.tickNumber,
          simulationTime: point.simulationTime,
          availableCash: point.availableCash,
          energyReserve: point.energyReserve,
          activeTransportCount: point.activeTransportCount,
          warehouseTotalUnits: point.warehouseTotalUnits ?? 0,
          onSiteTotalUnits: point.onSiteTotalUnits ?? 0,
          priceIndex: point.priceIndex ?? 1,
          energyGeneration: point.energyGeneration ?? 0,
          energyConsumption: point.energyConsumption ?? 0,
          marketPrices: Object.freeze(
            (point.marketPrices ?? []).map((entry) =>
              Object.freeze({
                resourceId: entry.resourceId,
                lastPrice: entry.lastPrice,
                totalSupply: entry.totalSupply ?? 0,
                baselineDemand: entry.baselineDemand ?? 0,
                pressureIndex: entry.pressureIndex ?? 0,
              }),
            ),
          ),
        }),
      ),
    );
  }

  #restoreCompany(snapshot: GameSaveSnapshotV1['companies'][number]) {
    const idResult = createCompanyId(snapshot.id);

    if (!idResult.ok) {
      return idResult;
    }

    const ownerIdResult = createPlayerId(snapshot.ownerId);

    if (!ownerIdResult.ok) {
      return ownerIdResult;
    }

    return Company.restore({
      id: idResult.value,
      name: snapshot.name,
      ownerId: ownerIdResult.value,
      foundedAt: snapshot.foundedAt,
      status: snapshot.status as ReturnType<Company['getStatus']>,
    });
  }

  #restoreBuilding(snapshot: GameSaveSnapshotV2['buildings'][number]) {
    const idResult = createBuildingId(snapshot.id);

    if (!idResult.ok) {
      return idResult;
    }

    const buildingTypeIdResult = createBuildingTypeId(snapshot.buildingTypeId);

    if (!buildingTypeIdResult.ok) {
      return buildingTypeIdResult;
    }

    const companyIdResult = createCompanyId(snapshot.companyId);

    if (!companyIdResult.ok) {
      return companyIdResult;
    }

    const regionIdResult = createRegionId(snapshot.regionId);

    if (!regionIdResult.ok) {
      return regionIdResult;
    }

    return Building.restore({
      id: idResult.value,
      buildingTypeId: buildingTypeIdResult.value,
      companyId: companyIdResult.value,
      regionId: regionIdResult.value,
      name: snapshot.name,
      position: new Position(snapshot.position.x, snapshot.position.y),
      level: snapshot.level,
      createdAt: snapshot.createdAt,
      status: this.#resolveBuildingStatus(snapshot),
      constructionDuration: snapshot.constructionDuration ?? 0,
      constructionProgress: snapshot.constructionProgress ?? 0,
      constructionStartTime: snapshot.constructionStartTime,
      constructionEndTime: snapshot.constructionEndTime,
    });
  }

  #resolveBuildingStatus(snapshot: GameSaveSnapshotV2['buildings'][number]): BuildingStatus {
    const duration = snapshot.constructionDuration ?? 0;
    const status = snapshot.status as BuildingStatus;

    if (duration === 0 && status === BuildingStatus.PLANNED) {
      return BuildingStatus.ACTIVE;
    }

    return status;
  }

  #restoreEmployee(snapshot: GameSaveSnapshotV1['employees'][number]) {
    const idResult = createEmployeeId(snapshot.id);

    if (!idResult.ok) {
      return idResult;
    }

    const companyIdResult = createCompanyId(snapshot.companyId);

    if (!companyIdResult.ok) {
      return companyIdResult;
    }

    const employeeTypeIdResult = createEmployeeTypeId(snapshot.employeeTypeId);

    if (!employeeTypeIdResult.ok) {
      return employeeTypeIdResult;
    }

    let assignedBuildingId: ReturnType<Employee['getAssignedBuildingId']> = undefined;

    if (snapshot.assignedBuildingId !== undefined) {
      const buildingIdResult = createBuildingId(snapshot.assignedBuildingId);

      if (!buildingIdResult.ok) {
        return buildingIdResult;
      }

      assignedBuildingId = buildingIdResult.value;
    }

    return Employee.restore({
      id: idResult.value,
      companyId: companyIdResult.value,
      employeeTypeId: employeeTypeIdResult.value,
      displayName: snapshot.displayName,
      salary: snapshot.salary,
      productivity: snapshot.productivity,
      hiredAt: snapshot.hiredAt,
      status: snapshot.status as EmployeeStatus,
      assignedBuildingId,
    });
  }

  #restoreInventory(snapshot: GameSaveSnapshotV1['inventories'][number]) {
    const idResult = createInventoryId(snapshot.id);

    if (!idResult.ok) {
      return idResult;
    }

    const companyIdResult = createCompanyId(snapshot.companyId);

    if (!companyIdResult.ok) {
      return companyIdResult;
    }

    const items = [];

    for (const itemSnapshot of snapshot.items) {
      const resourceIdResult = createResourceTypeId(itemSnapshot.resourceId);

      if (!resourceIdResult.ok) {
        return resourceIdResult;
      }

      items.push(
        Object.freeze({
          resourceId: resourceIdResult.value,
          quantity: itemSnapshot.quantity,
          reserved: itemSnapshot.reserved,
        }),
      );
    }

    return Inventory.restore({
      id: idResult.value,
      companyId: companyIdResult.value,
      createdAt: snapshot.createdAt,
      status: snapshot.status as ReturnType<Inventory['getStatus']>,
      items,
    });
  }

  #restoreFinanceAccount(snapshot: GameSaveSnapshotV1['financeAccounts'][number]) {
    const idResult = createFinanceAccountId(snapshot.id);

    if (!idResult.ok) {
      return idResult;
    }

    const companyIdResult = createCompanyId(snapshot.companyId);

    if (!companyIdResult.ok) {
      return companyIdResult;
    }

    const transactions: FinanceTransaction[] = [];

    for (const transactionSnapshot of snapshot.transactions) {
      const transactionIdResult = createFinanceTransactionId(transactionSnapshot.id);

      if (!transactionIdResult.ok) {
        return transactionIdResult;
      }

      transactions.push(
        Object.freeze({
          id: transactionIdResult.value,
          financeId: transactionSnapshot.financeId,
          companyId: transactionSnapshot.companyId,
          transactionType: transactionSnapshot.transactionType as FinanceTransactionType,
          direction: transactionSnapshot.direction as FinanceTransactionDirection,
          amount: transactionSnapshot.amount,
          balanceBefore: transactionSnapshot.balanceBefore,
          balanceAfter: transactionSnapshot.balanceAfter,
          reservedCashDelta: transactionSnapshot.reservedCashDelta,
          timestamp: transactionSnapshot.timestamp,
        }),
      );
    }

    return FinanceAccount.restore({
      id: idResult.value,
      companyId: companyIdResult.value,
      currency: snapshot.currency,
      createdAt: snapshot.createdAt,
      cashBalance: snapshot.cashBalance,
      reservedCash: snapshot.reservedCash,
      ...(snapshot.lastTaxCollectedAt !== undefined
        ? { lastTaxCollectedAt: snapshot.lastTaxCollectedAt }
        : {}),
      transactionSequence: snapshot.transactionSequence,
      transactions,
    });
  }

  #restoreSupplyContract(snapshot: GameSaveSupplyContractSnapshotV1) {
    const idResult = createSupplyContractId(snapshot.id);

    if (!idResult.ok) {
      return idResult;
    }

    const companyIdResult = createCompanyId(snapshot.companyId);

    if (!companyIdResult.ok) {
      return companyIdResult;
    }

    return SupplyContract.restore({
      id: idResult.value,
      companyId: companyIdResult.value,
      kind: snapshot.kind as SupplyContractKind,
      resourceId: snapshot.resourceId,
      amount: snapshot.amount,
      paymentAmount: snapshot.paymentAmount,
      intervalTicks: snapshot.intervalTicks,
      createdAt: snapshot.createdAt,
      lastFulfilledTick: snapshot.lastFulfilledTick,
      active: snapshot.active,
    });
  }

  #restoreRegionalMarket(snapshot: GameSaveRegionalMarketSnapshotV3) {
    const idResult = createMarketId(snapshot.id);

    if (!idResult.ok) {
      return idResult;
    }

    const prices = [];

    for (const priceSnapshot of snapshot.prices) {
      const resourceIdResult = createResourceTypeId(priceSnapshot.resourceId);

      if (!resourceIdResult.ok) {
        return resourceIdResult;
      }

      prices.push(
        Object.freeze({
          resourceId: resourceIdResult.value,
          basePrice: priceSnapshot.basePrice,
          lastPrice: priceSnapshot.lastPrice,
          tradeVolume: priceSnapshot.tradeVolume,
          updatedAt: priceSnapshot.updatedAt,
          supply: priceSnapshot.supply,
          demand: priceSnapshot.demand,
          liquidity: priceSnapshot.liquidity,
        }),
      );
    }

    return Market.restore({
      id: idResult.value,
      regionId: snapshot.regionId,
      createdAt: snapshot.createdAt,
      prices,
      priceHistory: snapshot.priceHistory,
    });
  }

  #restoreProductionJob(snapshot: GameSaveSnapshotV1['productionJobs'][number]) {
    const idResult = createProductionJobId(snapshot.id);

    if (!idResult.ok) {
      return idResult;
    }

    const buildingIdResult = createBuildingId(snapshot.buildingId);

    if (!buildingIdResult.ok) {
      return buildingIdResult;
    }

    const companyIdResult = createCompanyId(snapshot.companyId);

    if (!companyIdResult.ok) {
      return companyIdResult;
    }

    const recipeIdResult = createRecipeId(snapshot.recipeId);

    if (!recipeIdResult.ok) {
      return recipeIdResult;
    }

    return ProductionJob.restore({
      id: idResult.value,
      buildingId: buildingIdResult.value,
      companyId: companyIdResult.value,
      recipeId: recipeIdResult.value,
      duration: snapshot.duration,
      createdAt: snapshot.createdAt,
      status: snapshot.status as ReturnType<ProductionJob['getStatus']>,
      progress: snapshot.progress,
      startTime: snapshot.startTime,
      endTime: snapshot.endTime,
    });
  }

  #restoreResearchJob(snapshot: GameSaveSnapshotV1['researchJobs'][number]) {
    const idResult = createResearchJobId(snapshot.id);

    if (!idResult.ok) {
      return idResult;
    }

    const companyIdResult = createCompanyId(snapshot.companyId);

    if (!companyIdResult.ok) {
      return companyIdResult;
    }

    const technologyIdResult = createTechnologyId(snapshot.technologyId);

    if (!technologyIdResult.ok) {
      return technologyIdResult;
    }

    return ResearchJob.restore({
      id: idResult.value,
      companyId: companyIdResult.value,
      technologyId: technologyIdResult.value,
      duration: snapshot.duration,
      cost: snapshot.cost,
      createdAt: snapshot.createdAt,
      status: snapshot.status as ReturnType<ResearchJob['getStatus']>,
      progress: snapshot.progress,
      startTime: snapshot.startTime,
      endTime: snapshot.endTime,
    });
  }

  #restoreCompanyResearch(snapshot: GameSaveSnapshotV1['companyResearch'][number]) {
    const idResult = createCompanyResearchId(snapshot.id);

    if (!idResult.ok) {
      return idResult;
    }

    const companyIdResult = createCompanyId(snapshot.companyId);

    if (!companyIdResult.ok) {
      return companyIdResult;
    }

    return CompanyResearch.restore({
      id: idResult.value,
      companyId: companyIdResult.value,
      createdAt: snapshot.createdAt,
      completedTechnologies: snapshot.completedTechnologies,
    });
  }

  #restoreCompanyMilestones(snapshot: GameSaveSnapshotV1['companyMilestones'][number]) {
    const idResult = createCompanyMilestonesId(snapshot.id);

    if (!idResult.ok) {
      return idResult;
    }

    const companyIdResult = createCompanyId(snapshot.companyId);

    if (!companyIdResult.ok) {
      return companyIdResult;
    }

    return CompanyMilestones.restore({
      id: idResult.value,
      companyId: companyIdResult.value,
      createdAt: snapshot.createdAt,
      completedMilestones: snapshot.completedMilestones,
    });
  }

  #restoreBuildingStorage(snapshot: GameSaveSnapshotV1['buildingStorages'][number]) {
    const buildingIdResult = createBuildingId(snapshot.buildingId);

    if (!buildingIdResult.ok) {
      return buildingIdResult;
    }

    const companyIdResult = createCompanyId(snapshot.companyId);

    if (!companyIdResult.ok) {
      return companyIdResult;
    }

    return Result.ok(
      BuildingStorage.restore({
        buildingId: buildingIdResult.value,
        companyId: companyIdResult.value,
        ...(snapshot.storageCapacity !== undefined
          ? { storageCapacity: snapshot.storageCapacity }
          : {}),
        items: snapshot.items,
      }),
    );
  }

  #restoreTransportOrder(snapshot: GameSaveSnapshotV2['transportOrders'][number]) {
    const idResult = createTransportOrderId(snapshot.id);

    if (!idResult.ok) {
      return idResult;
    }

    const companyIdResult = createCompanyId(snapshot.companyId);

    if (!companyIdResult.ok) {
      return companyIdResult;
    }

    const sourceBuildingIdResult = createBuildingId(snapshot.sourceBuildingId);

    if (!sourceBuildingIdResult.ok) {
      return sourceBuildingIdResult;
    }

    const destinationBuildingIdResult = createBuildingId(snapshot.destinationBuildingId);

    if (!destinationBuildingIdResult.ok) {
      return destinationBuildingIdResult;
    }

    return Result.ok(
      TransportOrder.restore({
        id: idResult.value,
        companyId: companyIdResult.value,
        sourceBuildingId: sourceBuildingIdResult.value,
        destinationBuildingId: destinationBuildingIdResult.value,
        resourceId: snapshot.resourceId,
        amount: snapshot.amount,
        duration: snapshot.duration,
        ...(snapshot.routeId !== undefined ? { routeId: snapshot.routeId } : {}),
        productionJobId: snapshot.productionJobId,
        sourceRegionId: snapshot.sourceRegionId,
        destinationRegionId: snapshot.destinationRegionId,
        createdAt: snapshot.createdAt,
        status: snapshot.status as TransportOrderStatus,
        startTime: snapshot.startTime,
        endTime: snapshot.endTime,
        progress: snapshot.progress,
      }),
    );
  }
}
