import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ManualClock } from '../../../common/time/ManualClock.js';
import { createBuildingId } from '../../../domain/building/Building.js';
import { BuildingStatus } from '../../../domain/building/BuildingStatus.js';
import { createCompanyId } from '../../../domain/company/Company.js';
import { STARTING_MONEY } from '../../../domain/finance/FinanceConstants.js';
import { FinanceTransactionType } from '../../../domain/finance/FinanceTransactionType.js';
import { STARTER_NPC_WOOD_CONTRACT_ID } from '../../../domain/contract/SupplyContractConstants.js';
import { GAME_SAVE_SCHEMA_VERSION } from '../../../application/persistence/GameSaveSnapshotV1.js';
import { bootstrapApplication } from '../../../application/bootstrap/bootstrapApplication.js';
import { TickHistoryService } from '../../../application/services/TickHistoryService.js';
import { CreateCompanyUseCase } from '../../../application/use-cases/CreateCompanyUseCase.js';
import { PlaceBuildingUseCase } from '../../../application/use-cases/PlaceBuildingUseCase.js';
import { StartNewGameUseCase } from '../../../application/use-cases/StartNewGameUseCase.js';
import { InMemoryBuildingRepository } from '../InMemoryBuildingRepository.js';
import { InMemoryBuildingStorageRepository } from '../InMemoryBuildingStorageRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../InMemoryCompanyMilestonesRepository.js';
import { InMemoryCompanyRepository } from '../InMemoryCompanyRepository.js';
import { InMemoryCompanyResearchRepository } from '../InMemoryCompanyResearchRepository.js';
import { InMemoryFinanceRepository } from '../InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../InMemoryInventoryRepository.js';
import { InMemoryMarketRepository } from '../InMemoryMarketRepository.js';
import { InMemoryProductionJobRepository } from '../InMemoryProductionJobRepository.js';
import { InMemoryResearchJobRepository } from '../InMemoryResearchJobRepository.js';
import { InMemoryTransportOrderRepository } from '../InMemoryTransportOrderRepository.js';
import { InMemoryEmployeeRepository } from '../InMemoryEmployeeRepository.js';
import { InMemorySupplyContractRepository } from '../InMemorySupplyContractRepository.js';
import { GameStateSerializer } from './GameStateSerializer.js';
import { HireEmployeeUseCase } from '../../../application/use-cases/HireEmployeeUseCase.js';
import { AssignEmployeeUseCase } from '../../../application/use-cases/AssignEmployeeUseCase.js';
import { completeBuildingConstruction } from '../../../../tests/helpers/completeBuildingConstruction.js';
import { EmployeeStatus } from '../../../domain/employee/EmployeeStatus.js';
import { createEmployeeId } from '../../../domain/employee/Employee.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../../game-content');

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function createEmptyHydrateTarget() {
  return {
    companyRepository: new InMemoryCompanyRepository(),
    buildingRepository: new InMemoryBuildingRepository(),
    buildingStorageRepository: new InMemoryBuildingStorageRepository(),
    transportOrderRepository: new InMemoryTransportOrderRepository(),
    inventoryRepository: new InMemoryInventoryRepository(),
    financeRepository: new InMemoryFinanceRepository(),
    marketRepository: new InMemoryMarketRepository(),
    productionJobRepository: new InMemoryProductionJobRepository(),
    researchJobRepository: new InMemoryResearchJobRepository(),
    companyResearchRepository: new InMemoryCompanyResearchRepository(),
    companyMilestonesRepository: new InMemoryCompanyMilestonesRepository(),
    employeeRepository: new InMemoryEmployeeRepository(),
    supplyContractRepository: new InMemorySupplyContractRepository(),
    tickHistoryService: new TickHistoryService(),
  };
}

function createMinimalSnapshot(overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: GAME_SAVE_SCHEMA_VERSION,
    savedAtUtc: '2026-07-18T12:00:00.000Z',
    simulation: Object.freeze({
      clockTime: 0,
      tickNumber: 0,
      paused: false,
      tickDuration: 1,
    }),
    companies: Object.freeze([]),
    buildings: Object.freeze([]),
    inventories: Object.freeze([]),
    financeAccounts: Object.freeze([]),
    markets: Object.freeze([]),
    productionJobs: Object.freeze([]),
    employees: Object.freeze([]),
    ...overrides,
  };
}

describe('GameStateSerializer', () => {
  const serializer = new GameStateSerializer();

  describe('serialize', () => {
    it('rejects serialization while domain events are still queued', async () => {
      const bootstrapResult = await bootstrapApplication({ gameContentRoot });

      if (!bootstrapResult.ok) {
        throw new Error(bootstrapResult.error.message);
      }

      const context = bootstrapResult.value;
      const createCompany = new CreateCompanyUseCase(context);

      createCompany.execute({
        companyId: 'company_001',
        name: 'Genesis Industries',
        ownerId: 'player_001',
      });

      const serializeResult = serializer.serialize({
        clock: context.clock,
        simulationEngine: context.simulationEngine,
        companyRepository: context.companyRepository,
        buildingRepository: context.buildingRepository,
        buildingStorageRepository: context.buildingStorageRepository,
        transportOrderRepository: context.transportOrderRepository,
        inventoryRepository: context.inventoryRepository,
        financeRepository: context.financeRepository,
        marketRepository: context.marketRepository,
        productionJobRepository: context.productionJobRepository,
        researchJobRepository: context.researchJobRepository,
        companyResearchRepository: context.companyResearchRepository,
        companyMilestonesRepository: context.companyMilestonesRepository,
        employeeRepository: context.employeeRepository,
        supplyContractRepository: context.supplyContractRepository,
        tickHistoryService: context.tickHistoryService,
      });

      expect(serializeResult.ok).toBe(false);

      if (serializeResult.ok) {
        return;
      }

      expect(serializeResult.error.message).toContain('domain events are still queued');
    });

    it('captures tick metrics history when history is recorded', async () => {
      const bootstrapResult = await bootstrapApplication({ gameContentRoot });

      if (!bootstrapResult.ok) {
        throw new Error(bootstrapResult.error.message);
      }

      const context = bootstrapResult.value;
      const createCompany = new CreateCompanyUseCase(context);

      createCompany.execute({
        companyId: 'company_001',
        name: 'Genesis Industries',
        ownerId: 'player_001',
      });

      context.simulationEngine.tick();

      context.tickHistoryService.record(
        Object.freeze({
          tickNumber: context.simulationEngine.state.tickNumber,
          simulationTime: context.clock.now(),
          availableCash: STARTING_MONEY,
          energyReserve: 30,
          activeTransportCount: 0,
          warehouseTotalUnits: 0,
          onSiteTotalUnits: 0,
          priceIndex: 1,
          energyGeneration: 0,
          energyConsumption: 0,
          marketPrices: Object.freeze([]),
        }),
        'company_001',
      );

      const serializeResult = serializer.serialize({
        clock: context.clock,
        simulationEngine: context.simulationEngine,
        companyRepository: context.companyRepository,
        buildingRepository: context.buildingRepository,
        buildingStorageRepository: context.buildingStorageRepository,
        transportOrderRepository: context.transportOrderRepository,
        inventoryRepository: context.inventoryRepository,
        financeRepository: context.financeRepository,
        marketRepository: context.marketRepository,
        productionJobRepository: context.productionJobRepository,
        researchJobRepository: context.researchJobRepository,
        companyResearchRepository: context.companyResearchRepository,
        companyMilestonesRepository: context.companyMilestonesRepository,
        employeeRepository: context.employeeRepository,
        supplyContractRepository: context.supplyContractRepository,
        tickHistoryService: context.tickHistoryService,
      });

      expect(serializeResult.ok).toBe(true);

      if (!serializeResult.ok) {
        return;
      }

      expect(serializeResult.value.tickMetricsHistory).toEqual(
        Object.freeze({
          companyId: 'company_001',
          points: Object.freeze([
            Object.freeze({
              tickNumber: context.simulationEngine.state.tickNumber,
              simulationTime: context.clock.now(),
              availableCash: STARTING_MONEY,
              energyReserve: 30,
              activeTransportCount: 0,
              warehouseTotalUnits: 0,
              onSiteTotalUnits: 0,
              priceIndex: 1,
              energyGeneration: 0,
              energyConsumption: 0,
              marketPrices: Object.freeze([]),
            }),
          ]),
        }),
      );
    });

    it('omits tick metrics history when no points are recorded', async () => {
      const bootstrapResult = await bootstrapApplication({ gameContentRoot });

      if (!bootstrapResult.ok) {
        throw new Error(bootstrapResult.error.message);
      }

      const context = bootstrapResult.value;
      const createCompany = new CreateCompanyUseCase(context);

      createCompany.execute({
        companyId: 'company_001',
        name: 'Genesis Industries',
        ownerId: 'player_001',
      });

      context.simulationEngine.tick();

      const serializeResult = serializer.serialize({
        clock: context.clock,
        simulationEngine: context.simulationEngine,
        companyRepository: context.companyRepository,
        buildingRepository: context.buildingRepository,
        buildingStorageRepository: context.buildingStorageRepository,
        transportOrderRepository: context.transportOrderRepository,
        inventoryRepository: context.inventoryRepository,
        financeRepository: context.financeRepository,
        marketRepository: context.marketRepository,
        productionJobRepository: context.productionJobRepository,
        researchJobRepository: context.researchJobRepository,
        companyResearchRepository: context.companyResearchRepository,
        companyMilestonesRepository: context.companyMilestonesRepository,
        employeeRepository: context.employeeRepository,
        supplyContractRepository: context.supplyContractRepository,
        tickHistoryService: context.tickHistoryService,
      });

      expect(serializeResult.ok).toBe(true);

      if (!serializeResult.ok) {
        return;
      }

      expect(serializeResult.value.tickMetricsHistory).toBeUndefined();
    });
  });

  describe('parse', () => {
    it('rejects non-object payloads', () => {
      const parseResult = serializer.parse('not-an-object');

      expect(parseResult.ok).toBe(false);

      if (parseResult.ok) {
        return;
      }

      expect(parseResult.error.message).toBe('Savegame payload must be a JSON object.');
    });

    it('rejects unsupported schema versions', () => {
      const parseResult = serializer.parse(
        createMinimalSnapshot({
          schemaVersion: 99,
        }),
      );

      expect(parseResult.ok).toBe(false);

      if (parseResult.ok) {
        return;
      }

      expect(parseResult.error.message).toContain('Unsupported savegame schema version');
    });

    it('rejects snapshots missing required metadata', () => {
      const parseResult = serializer.parse({
        schemaVersion: GAME_SAVE_SCHEMA_VERSION,
      });

      expect(parseResult.ok).toBe(false);

      if (parseResult.ok) {
        return;
      }

      expect(parseResult.error.message).toBe('Savegame payload is missing required metadata.');
    });

    it('applies defaults for optional snapshot collections', () => {
      const parseResult = serializer.parse(createMinimalSnapshot());

      expect(parseResult.ok).toBe(true);

      if (!parseResult.ok) {
        return;
      }

      expect(parseResult.value.researchJobs).toEqual([]);
      expect(parseResult.value.companyResearch).toEqual([]);
      expect(parseResult.value.companyMilestones).toEqual([]);
      expect(parseResult.value.buildingStorages).toEqual([]);
      expect(parseResult.value.transportOrders).toEqual([]);
      expect(parseResult.value.employees).toEqual([]);
      expect(parseResult.value.supplyContracts).toEqual([]);
    });
  });

  describe('hydrate', () => {
    it('rejects invalid aggregate identifiers during restore', () => {
      const parseResult = serializer.parse(
        createMinimalSnapshot({
          buildings: Object.freeze([
            Object.freeze({
              id: '',
              buildingTypeId: 'sawmill',
              companyId: 'company_001',
              name: 'Invalid Building',
              position: Object.freeze({ x: 0, y: 0 }),
              level: 1,
              createdAt: 0,
              status: BuildingStatus.ACTIVE,
              constructionDuration: 0,
              constructionProgress: 0,
              constructionStartTime: undefined,
              constructionEndTime: undefined,
            }),
          ]),
        }),
      );

      expect(parseResult.ok).toBe(true);

      if (!parseResult.ok) {
        return;
      }

      const hydrateResult = serializer.hydrate(parseResult.value, createEmptyHydrateTarget());

      expect(hydrateResult.ok).toBe(false);
    });

    it('maps planned zero-duration buildings to active on restore', () => {
      const parseResult = serializer.parse(
        createMinimalSnapshot({
          companies: Object.freeze([
            Object.freeze({
              id: 'company_001',
              name: 'Genesis Industries',
              ownerId: 'player_001',
              foundedAt: 0,
              status: 'ACTIVE',
            }),
          ]),
          buildings: Object.freeze([
            Object.freeze({
              id: 'building_001',
              buildingTypeId: 'warehouse',
              companyId: 'company_001',
              name: 'Starter Warehouse',
              position: Object.freeze({ x: 1, y: 1 }),
              level: 1,
              createdAt: 0,
              status: BuildingStatus.PLANNED,
              constructionDuration: 0,
              constructionProgress: 0,
              constructionStartTime: undefined,
              constructionEndTime: undefined,
            }),
          ]),
        }),
      );

      expect(parseResult.ok).toBe(true);

      if (!parseResult.ok) {
        return;
      }

      const target = createEmptyHydrateTarget();
      const hydrateResult = serializer.hydrate(parseResult.value, target);

      expect(hydrateResult.ok).toBe(true);

      if (!hydrateResult.ok) {
        return;
      }

      const buildingId = createBuildingId('building_001');

      if (!buildingId.ok) {
        throw new Error(buildingId.error.message);
      }

      const building = target.buildingRepository.findById(buildingId.value);

      expect(building?.getStatus()).toBe(BuildingStatus.ACTIVE);
    });

    it('assigns default region when snapshot omits regionId', () => {
      const parseResult = serializer.parse(
        createMinimalSnapshot({
          companies: Object.freeze([
            Object.freeze({
              id: 'company_001',
              name: 'Genesis Industries',
              ownerId: 'player_001',
              foundedAt: 0,
              status: 'ACTIVE',
            }),
          ]),
          buildings: Object.freeze([
            Object.freeze({
              id: 'building_001',
              buildingTypeId: 'warehouse',
              companyId: 'company_001',
              name: 'Starter Warehouse',
              position: Object.freeze({ x: 1, y: 1 }),
              level: 1,
              createdAt: 0,
              status: BuildingStatus.ACTIVE,
              constructionDuration: 0,
              constructionProgress: 100,
              constructionStartTime: undefined,
              constructionEndTime: 0,
            }),
          ]),
        }),
      );

      expect(parseResult.ok).toBe(true);

      if (!parseResult.ok) {
        return;
      }

      const target = createEmptyHydrateTarget();
      const hydrateResult = serializer.hydrate(parseResult.value, target);

      expect(hydrateResult.ok).toBe(true);

      const buildingId = createBuildingId('building_001');

      if (!buildingId.ok) {
        throw new Error(buildingId.error.message);
      }

      const building = target.buildingRepository.findById(buildingId.value);

      expect(building?.getRegionId().value).toBe('region_default');
    });

    it('restores tick metrics history into the target history service', () => {
      const parseResult = serializer.parse(
        createMinimalSnapshot({
          tickMetricsHistory: Object.freeze({
            companyId: 'company_001',
            points: Object.freeze([
              Object.freeze({
                tickNumber: 3,
                simulationTime: 120,
                availableCash: 240_000,
                energyReserve: 15,
                activeTransportCount: 1,
                warehouseTotalUnits: 5,
                onSiteTotalUnits: 10,
                priceIndex: 1,
                energyGeneration: 2,
                energyConsumption: 1,
                marketPrices: Object.freeze([
                  Object.freeze({
                    resourceId: 'wood',
                    lastPrice: 12,
                  }),
                ]),
              }),
            ]),
          }),
        }),
      );

      expect(parseResult.ok).toBe(true);

      if (!parseResult.ok) {
        return;
      }

      const target = createEmptyHydrateTarget();
      const hydrateResult = serializer.hydrate(parseResult.value, target);

      expect(hydrateResult.ok).toBe(true);
      expect(target.tickHistoryService.getCompanyId()).toBe('company_001');
      expect(target.tickHistoryService.getHistory()).toEqual([
        Object.freeze({
          tickNumber: 3,
          simulationTime: 120,
          availableCash: 240_000,
          energyReserve: 15,
          activeTransportCount: 1,
          warehouseTotalUnits: 5,
          onSiteTotalUnits: 10,
          priceIndex: 1,
          energyGeneration: 2,
          energyConsumption: 1,
          marketPrices: Object.freeze([
            Object.freeze({
              resourceId: 'wood',
              lastPrice: 12,
              totalSupply: 0,
              baselineDemand: 0,
              pressureIndex: 0,
            }),
          ]),
        }),
      ]);
    });

    it('restores assigned and unassigned employees after buildings', () => {
      const parseResult = serializer.parse(
        createMinimalSnapshot({
          companies: Object.freeze([
            Object.freeze({
              id: 'company_001',
              name: 'Genesis Industries',
              ownerId: 'player_001',
              foundedAt: 0,
              status: 'ACTIVE',
            }),
          ]),
          buildings: Object.freeze([
            Object.freeze({
              id: 'building_001',
              buildingTypeId: 'warehouse',
              companyId: 'company_001',
              name: 'Starter Warehouse',
              position: Object.freeze({ x: 1, y: 1 }),
              level: 1,
              createdAt: 0,
              status: BuildingStatus.ACTIVE,
              constructionDuration: 0,
              constructionProgress: 0,
              constructionStartTime: undefined,
              constructionEndTime: undefined,
            }),
          ]),
          employees: Object.freeze([
            Object.freeze({
              id: 'employee_001',
              companyId: 'company_001',
              employeeTypeId: 'employee_logistics_operator',
              displayName: 'Alex Operator',
              salary: 1200,
              productivity: 1,
              hiredAt: 50,
              status: EmployeeStatus.ACTIVE,
              assignedBuildingId: 'building_001',
            }),
            Object.freeze({
              id: 'employee_002',
              companyId: 'company_001',
              employeeTypeId: 'employee_production_worker',
              displayName: 'Sam Worker',
              salary: 900,
              productivity: 0.8,
              hiredAt: 75,
              status: EmployeeStatus.ACTIVE,
              assignedBuildingId: undefined,
            }),
          ]),
        }),
      );

      expect(parseResult.ok).toBe(true);

      if (!parseResult.ok) {
        return;
      }

      const target = createEmptyHydrateTarget();
      const hydrateResult = serializer.hydrate(parseResult.value, target);

      expect(hydrateResult.ok).toBe(true);

      if (!hydrateResult.ok) {
        return;
      }

      const assignedEmployeeId = createEmployeeId('employee_001');
      const unassignedEmployeeId = createEmployeeId('employee_002');

      if (!assignedEmployeeId.ok || !unassignedEmployeeId.ok) {
        throw new Error('Invalid employee id in test fixture.');
      }

      const assignedEmployee = target.employeeRepository.findById(assignedEmployeeId.value);
      const unassignedEmployee = target.employeeRepository.findById(unassignedEmployeeId.value);

      expect(target.employeeRepository.findAll()).toHaveLength(2);
      expect(assignedEmployee?.getAssignedBuildingId()?.value).toBe('building_001');
      expect(assignedEmployee?.getSalary()).toBe(1200);
      expect(unassignedEmployee?.getAssignedBuildingId()).toBeUndefined();
      expect(unassignedEmployee?.getProductivity()).toBe(0.8);
    });

    it('rejects invalid assigned building ids during employee restore', () => {
      const parseResult = serializer.parse(
        createMinimalSnapshot({
          companies: Object.freeze([
            Object.freeze({
              id: 'company_001',
              name: 'Genesis Industries',
              ownerId: 'player_001',
              foundedAt: 0,
              status: 'ACTIVE',
            }),
          ]),
          employees: Object.freeze([
            Object.freeze({
              id: 'employee_001',
              companyId: 'company_001',
              employeeTypeId: 'employee_logistics_operator',
              displayName: 'Alex Operator',
              salary: 1200,
              productivity: 1,
              hiredAt: 50,
              status: EmployeeStatus.ACTIVE,
              assignedBuildingId: '',
            }),
          ]),
        }),
      );

      expect(parseResult.ok).toBe(true);

      if (!parseResult.ok) {
        return;
      }

      const hydrateResult = serializer.hydrate(parseResult.value, createEmptyHydrateTarget());

      expect(hydrateResult.ok).toBe(false);
    });
  });

  describe('round trip', () => {
    it('preserves session state through serialize, parse and hydrate', async () => {
      const bootstrapResult = await bootstrapApplication({ gameContentRoot });

      if (!bootstrapResult.ok) {
        throw new Error(bootstrapResult.error.message);
      }

      const sourceContext = bootstrapResult.value;
      const createCompany = new CreateCompanyUseCase(sourceContext);
      const placeBuilding = new PlaceBuildingUseCase(sourceContext);

      createCompany.execute({
        companyId: 'company_001',
        name: 'Genesis Industries',
        ownerId: 'player_001',
      });

      placeBuilding.execute({
        buildingId: 'building_001',
        buildingTypeId: 'sawmill',
        companyId: 'company_001',
        name: 'Northern Sawmill',
        x: 2,
        y: 3,
      });

      sourceContext.simulationEngine.tick();

      sourceContext.tickHistoryService.record(
        Object.freeze({
          tickNumber: sourceContext.simulationEngine.state.tickNumber,
          simulationTime: sourceContext.clock.now(),
          availableCash: STARTING_MONEY,
          energyReserve: 30,
          activeTransportCount: 0,
          warehouseTotalUnits: 0,
          onSiteTotalUnits: 20,
          priceIndex: 1,
          energyGeneration: 0,
          energyConsumption: 0,
          marketPrices: Object.freeze([]),
        }),
        'company_001',
      );

      const serializeResult = serializer.serialize({
        clock: sourceContext.clock,
        simulationEngine: sourceContext.simulationEngine,
        companyRepository: sourceContext.companyRepository,
        buildingRepository: sourceContext.buildingRepository,
        buildingStorageRepository: sourceContext.buildingStorageRepository,
        transportOrderRepository: sourceContext.transportOrderRepository,
        inventoryRepository: sourceContext.inventoryRepository,
        financeRepository: sourceContext.financeRepository,
        marketRepository: sourceContext.marketRepository,
        productionJobRepository: sourceContext.productionJobRepository,
        researchJobRepository: sourceContext.researchJobRepository,
        companyResearchRepository: sourceContext.companyResearchRepository,
        companyMilestonesRepository: sourceContext.companyMilestonesRepository,
        employeeRepository: sourceContext.employeeRepository,
        supplyContractRepository: sourceContext.supplyContractRepository,
        tickHistoryService: sourceContext.tickHistoryService,
      });

      expect(serializeResult.ok).toBe(true);

      if (!serializeResult.ok) {
        return;
      }

      const jsonRoundTrip: unknown = JSON.parse(JSON.stringify(serializeResult.value));
      const parseResult = serializer.parse(jsonRoundTrip);

      expect(parseResult.ok).toBe(true);

      if (!parseResult.ok) {
        return;
      }

      const target = createEmptyHydrateTarget();
      const hydrateResult = serializer.hydrate(parseResult.value, target);

      expect(hydrateResult.ok).toBe(true);

      if (!hydrateResult.ok) {
        return;
      }

      const finance = target.financeRepository.findByCompanyId(requireCompanyId('company_001'));
      const buildingId = createBuildingId('building_001');

      if (!buildingId.ok) {
        throw new Error(buildingId.error.message);
      }

      const building = target.buildingRepository.findById(buildingId.value);

      expect(hydrateResult.value.clockTime).toBe(sourceContext.clock.now());
      expect(hydrateResult.value.simulationState.tickNumber).toBe(
        sourceContext.simulationEngine.state.tickNumber,
      );
      expect(finance?.getCashBalance()).toBe(STARTING_MONEY - 5000);
      expect(building?.getName()).toBe('Northern Sawmill');
      expect(building?.getRegionId().value).toBe('region_default');
      expect(building?.getPosition().x).toBe(2);
      expect(building?.getPosition().y).toBe(3);
      expect(building?.getStatus()).toBe(BuildingStatus.UNDER_CONSTRUCTION);
      expect(building?.getConstructionDuration()).toBe(120);
      expect(building?.getConstructionProgress()).toBeGreaterThan(0);
      expect(target.marketRepository.findAll()).toHaveLength(1);
      expect(target.tickHistoryService.getHistory()).toEqual([
        Object.freeze({
          tickNumber: sourceContext.simulationEngine.state.tickNumber,
          simulationTime: sourceContext.clock.now(),
          availableCash: STARTING_MONEY,
          energyReserve: 30,
          activeTransportCount: 0,
          warehouseTotalUnits: 0,
          onSiteTotalUnits: 20,
          priceIndex: 1,
          energyGeneration: 0,
          energyConsumption: 0,
          marketPrices: Object.freeze([]),
        }),
      ]);
    });

    it('preserves supply contracts and tax assessment timestamps through serialize, parse and hydrate', async () => {
      const bootstrapResult = await bootstrapApplication({ gameContentRoot });

      if (!bootstrapResult.ok) {
        throw new Error(bootstrapResult.error.message);
      }

      const sourceContext = bootstrapResult.value;
      const startNewGame = new StartNewGameUseCase(sourceContext);
      const startResult = startNewGame.execute({
        companyId: 'company_001',
        name: 'Economy Save Corp',
        ownerId: 'player_001',
      });

      expect(startResult.ok).toBe(true);

      for (let index = 0; index < 29; index += 1) {
        const tickResult = sourceContext.simulationEngine.tick();

        expect(tickResult.ok).toBe(true);
      }

      expect(sourceContext.simulationEngine.state.tickNumber).toBe(30);
      expect(sourceContext.simulationEngine.hasPendingEvents()).toBe(false);

      const companyId = requireCompanyId('company_001');
      const contractsBefore = sourceContext.supplyContractRepository.findByCompanyId(companyId);
      const financeBefore = sourceContext.financeRepository.findByCompanyId(companyId);

      expect(contractsBefore).toHaveLength(1);
      expect(contractsBefore[0]?.getId().value).toBe(STARTER_NPC_WOOD_CONTRACT_ID);
      expect(contractsBefore[0]?.getLastFulfilledTick()).toBe(20);
      expect(contractsBefore[0]?.isActive()).toBe(true);
      expect(financeBefore).toBeDefined();
      expect(
        financeBefore
          ?.getTransactions()
          .some(
            (transaction) =>
              transaction.transactionType === FinanceTransactionType.CONTRACT_PAYMENT,
          ),
      ).toBe(true);
      expect(
        financeBefore
          ?.getTransactions()
          .some((transaction) => transaction.transactionType === FinanceTransactionType.TAX),
      ).toBe(true);

      const lastTaxCollectedAtBefore = financeBefore!.getLastTaxCollectedAt();

      const serializeResult = serializer.serialize({
        clock: sourceContext.clock,
        simulationEngine: sourceContext.simulationEngine,
        companyRepository: sourceContext.companyRepository,
        buildingRepository: sourceContext.buildingRepository,
        buildingStorageRepository: sourceContext.buildingStorageRepository,
        transportOrderRepository: sourceContext.transportOrderRepository,
        inventoryRepository: sourceContext.inventoryRepository,
        financeRepository: sourceContext.financeRepository,
        marketRepository: sourceContext.marketRepository,
        productionJobRepository: sourceContext.productionJobRepository,
        researchJobRepository: sourceContext.researchJobRepository,
        companyResearchRepository: sourceContext.companyResearchRepository,
        companyMilestonesRepository: sourceContext.companyMilestonesRepository,
        employeeRepository: sourceContext.employeeRepository,
        supplyContractRepository: sourceContext.supplyContractRepository,
        tickHistoryService: sourceContext.tickHistoryService,
      });

      expect(serializeResult.ok).toBe(true);

      if (!serializeResult.ok) {
        return;
      }

      expect(serializeResult.value.supplyContracts).toHaveLength(1);
      expect(serializeResult.value.supplyContracts?.[0]?.lastFulfilledTick).toBe(20);
      expect(serializeResult.value.financeAccounts[0]?.lastTaxCollectedAt).toBe(
        lastTaxCollectedAtBefore,
      );

      const jsonRoundTrip: unknown = JSON.parse(JSON.stringify(serializeResult.value));
      const parseResult = serializer.parse(jsonRoundTrip);

      expect(parseResult.ok).toBe(true);

      if (!parseResult.ok) {
        return;
      }

      const target = createEmptyHydrateTarget();
      const hydrateResult = serializer.hydrate(parseResult.value, target);

      expect(hydrateResult.ok).toBe(true);

      if (!hydrateResult.ok) {
        return;
      }

      const contractsAfter = target.supplyContractRepository.findByCompanyId(companyId);
      const financeAfter = target.financeRepository.findByCompanyId(companyId);

      expect(contractsAfter).toHaveLength(1);
      expect(contractsAfter[0]?.getId().value).toBe(STARTER_NPC_WOOD_CONTRACT_ID);
      expect(contractsAfter[0]?.getLastFulfilledTick()).toBe(20);
      expect(contractsAfter[0]?.getPaymentAmount()).toBe(125);
      expect(financeAfter?.getLastTaxCollectedAt()).toBe(lastTaxCollectedAtBefore);
    });

    it('preserves hired and assigned employees through serialize, parse and hydrate', async () => {
      const bootstrapResult = await bootstrapApplication({ gameContentRoot });

      if (!bootstrapResult.ok) {
        throw new Error(bootstrapResult.error.message);
      }

      const sourceContext = bootstrapResult.value;
      const createCompany = new CreateCompanyUseCase(sourceContext);
      const placeBuilding = new PlaceBuildingUseCase(sourceContext);
      const hireEmployee = new HireEmployeeUseCase(sourceContext);
      const assignEmployee = new AssignEmployeeUseCase(sourceContext);

      createCompany.execute({
        companyId: 'company_001',
        name: 'Genesis Industries',
        ownerId: 'player_001',
      });

      placeBuilding.execute({
        buildingId: 'building_001',
        buildingTypeId: 'sawmill',
        companyId: 'company_001',
        name: 'Northern Sawmill',
        x: 0,
        y: 0,
      });

      completeBuildingConstruction({
        buildingId: 'building_001',
        clock: sourceContext.clock,
        simulationEngine: sourceContext.simulationEngine,
        buildingRepository: sourceContext.buildingRepository,
      });

      const hireResult = hireEmployee.execute({
        employeeId: 'employee_001',
        companyId: 'company_001',
        employeeTypeId: 'employee_production_worker',
        displayName: 'Production Worker',
      });

      expect(hireResult.ok).toBe(true);

      if (!hireResult.ok) {
        return;
      }

      const assignResult = assignEmployee.execute({
        employeeId: 'employee_001',
        buildingId: 'building_001',
      });

      expect(assignResult.ok).toBe(true);

      sourceContext.simulationEngine.tick();

      const sourceEmployeeId = createEmployeeId('employee_001');

      if (!sourceEmployeeId.ok) {
        throw new Error(sourceEmployeeId.error.message);
      }

      const sourceEmployee = sourceContext.employeeRepository.findById(sourceEmployeeId.value);

      if (sourceEmployee === undefined) {
        throw new Error('Expected hired employee in source context.');
      }

      const serializeResult = serializer.serialize({
        clock: sourceContext.clock,
        simulationEngine: sourceContext.simulationEngine,
        companyRepository: sourceContext.companyRepository,
        buildingRepository: sourceContext.buildingRepository,
        buildingStorageRepository: sourceContext.buildingStorageRepository,
        transportOrderRepository: sourceContext.transportOrderRepository,
        inventoryRepository: sourceContext.inventoryRepository,
        financeRepository: sourceContext.financeRepository,
        marketRepository: sourceContext.marketRepository,
        productionJobRepository: sourceContext.productionJobRepository,
        researchJobRepository: sourceContext.researchJobRepository,
        companyResearchRepository: sourceContext.companyResearchRepository,
        companyMilestonesRepository: sourceContext.companyMilestonesRepository,
        employeeRepository: sourceContext.employeeRepository,
        supplyContractRepository: sourceContext.supplyContractRepository,
        tickHistoryService: sourceContext.tickHistoryService,
      });

      expect(serializeResult.ok).toBe(true);

      if (!serializeResult.ok) {
        return;
      }

      expect(serializeResult.value.employees).toEqual([
        Object.freeze({
          id: 'employee_001',
          companyId: 'company_001',
          employeeTypeId: 'employee_production_worker',
          displayName: 'Production Worker',
          salary: sourceEmployee.getSalary(),
          productivity: sourceEmployee.getProductivity(),
          hiredAt: sourceEmployee.getHiredAt(),
          status: EmployeeStatus.ACTIVE,
          assignedBuildingId: 'building_001',
        }),
      ]);

      const jsonRoundTrip: unknown = JSON.parse(JSON.stringify(serializeResult.value));
      const parseResult = serializer.parse(jsonRoundTrip);

      expect(parseResult.ok).toBe(true);

      if (!parseResult.ok) {
        return;
      }

      const target = createEmptyHydrateTarget();
      const hydrateResult = serializer.hydrate(parseResult.value, target);

      expect(hydrateResult.ok).toBe(true);

      if (!hydrateResult.ok) {
        return;
      }

      const employeeId = createEmployeeId('employee_001');

      if (!employeeId.ok) {
        throw new Error(employeeId.error.message);
      }

      const restoredEmployee = target.employeeRepository.findById(employeeId.value);

      expect(target.employeeRepository.findAll()).toHaveLength(1);
      expect(restoredEmployee?.getDisplayName()).toBe('Production Worker');
      expect(restoredEmployee?.getSalary()).toBe(sourceEmployee.getSalary());
      expect(restoredEmployee?.getProductivity()).toBe(sourceEmployee.getProductivity());
      expect(restoredEmployee?.getHiredAt()).toBe(sourceEmployee.getHiredAt());
      expect(restoredEmployee?.getAssignedBuildingId()?.value).toBe('building_001');
    });
  });
});
