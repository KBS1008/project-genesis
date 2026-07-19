import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import { createBuildingId } from '../../domain/building/Building.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { createMilestoneId } from '../../domain/milestone/MilestoneId.js';
import { ProductionJobStatus } from '../../domain/production/ProductionJobStatus.js';
import { createResourceTypeId } from '../../domain/shared/ResourceTypeId.js';
import { TransportOrderStatus } from '../../domain/transport/TransportOrderStatus.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { PlaceBuildingUseCase } from '../use-cases/PlaceBuildingUseCase.js';
import { StartProductionUseCase } from '../use-cases/StartProductionUseCase.js';
import { BuyResourceUseCase } from '../use-cases/BuyResourceUseCase.js';
import { completeBuildingConstruction } from '../../../tests/helpers/completeBuildingConstruction.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireBuildingId(value: string) {
  const result = createBuildingId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireResourceTypeId(value: string) {
  const result = createResourceTypeId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function grantMilestone(context: ApplicationContext, companyId: string, milestoneId: string) {
  const companyIdResult = createCompanyId(companyId);

  if (!companyIdResult.ok) {
    throw new Error(companyIdResult.error.message);
  }

  const milestones = context.companyMilestonesRepository.findByCompanyId(companyIdResult.value);

  if (milestones === undefined) {
    throw new Error(`Milestones for company "${companyId}" were not found.`);
  }

  const milestoneIdResult = createMilestoneId(milestoneId);

  if (!milestoneIdResult.ok) {
    throw new Error(milestoneIdResult.error.message);
  }

  milestones.completeMilestone(milestoneIdResult.value, context.clock);
  context.companyMilestonesRepository.save(milestones);
}

describe('TransportLogisticsService integration', () => {
  it('routes market purchases through warehouse and delivers inputs before steel production', async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot });

    expect(bootstrapResult.ok).toBe(true);

    if (!bootstrapResult.ok) {
      return;
    }

    const context = bootstrapResult.value;
    const createCompany = new CreateCompanyUseCase(context);
    const placeBuilding = new PlaceBuildingUseCase(context);
    const buyResource = new BuyResourceUseCase(context);
    const startProduction = new StartProductionUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    grantMilestone(context, 'company_001', 'first_profit');
    grantMilestone(context, 'company_001', 'first_production');

    placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'warehouse',
      companyId: 'company_001',
      name: 'Central Warehouse',
      x: 0,
      y: 0,
    });
    placeBuilding.execute({
      buildingId: 'building_002',
      buildingTypeId: 'coal_power_plant',
      companyId: 'company_001',
      name: 'Coal Plant',
      x: 1,
      y: 0,
    });
    placeBuilding.execute({
      buildingId: 'building_003',
      buildingTypeId: 'smelter',
      companyId: 'company_001',
      name: 'Steel Smelter',
      x: 2,
      y: 0,
      regionId: 'region_east',
    });

    for (const buildingId of ['building_001', 'building_002', 'building_003']) {
      completeBuildingConstruction({
        clock: context.clock,
        simulationEngine: context.simulationEngine,
        buildingRepository: context.buildingRepository,
        buildingId,
      });
    }

    const buyResult = buyResource.execute({
      companyId: 'company_001',
      resourceId: 'iron_ore',
      amount: 10,
    });

    expect(buyResult.ok).toBe(true);

    const inventoryAfterBuy = context.inventoryRepository.findByCompanyId(
      requireCompanyId('company_001'),
    );
    expect(inventoryAfterBuy?.getAvailableQuantity(requireResourceTypeId('iron_ore'))).toBe(0);

    const warehouseStorage = context.buildingStorageRepository.findByBuildingId(
      requireBuildingId('building_001'),
    );
    expect(warehouseStorage?.getQuantity('iron_ore')).toBe(10);

    const startResult = startProduction.execute({
      jobId: 'production_001',
      buildingId: 'building_003',
      recipeId: 'recipe_steel',
    });

    expect(startResult.ok).toBe(true);

    const job = context.productionJobRepository.findById(
      startResult.ok ? startResult.value : (undefined as never),
    );
    expect(job?.getStatus()).toBe(ProductionJobStatus.WAITING);

    const transports = context.transportOrderRepository.findByProductionJobId('production_001');
    expect(transports).toHaveLength(1);
    expect(transports[0]?.getRouteId()).toBe(
      'route_storage_to_production::region_default->region_east',
    );
    expect(transports[0]?.getStatus()).toBe(TransportOrderStatus.IN_PROGRESS);
    expect(transports[0]?.getDuration()).toBe(10);
    expect(transports[0]?.getSourceRegionId()).toBe('region_default');
    expect(transports[0]?.getDestinationRegionId()).toBe('region_east');

    for (let tick = 0; tick < transports[0]!.getDuration(); tick += 1) {
      context.simulationEngine.tick();
    }

    const jobAfterTransport = context.productionJobRepository.findById(
      startResult.ok ? startResult.value : (undefined as never),
    );
    expect(jobAfterTransport?.getStatus()).toBe(ProductionJobStatus.RUNNING);

    const completedTransports =
      context.transportOrderRepository.findByProductionJobId('production_001');
    expect(completedTransports[0]?.getStatus()).toBe(TransportOrderStatus.COMPLETED);
  });

  it('queues transports when route throughput capacity is saturated', async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot });

    expect(bootstrapResult.ok).toBe(true);

    if (!bootstrapResult.ok) {
      return;
    }

    const context = bootstrapResult.value;
    const createCompany = new CreateCompanyUseCase(context);
    const placeBuilding = new PlaceBuildingUseCase(context);
    const buyResource = new BuyResourceUseCase(context);
    const startProduction = new StartProductionUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Queue Test Co',
      ownerId: 'player_001',
    });

    grantMilestone(context, 'company_001', 'first_profit');
    grantMilestone(context, 'company_001', 'first_production');

    placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'warehouse',
      companyId: 'company_001',
      name: 'Central Warehouse',
      x: 0,
      y: 0,
    });

    placeBuilding.execute({
      buildingId: 'building_002',
      buildingTypeId: 'coal_power_plant',
      companyId: 'company_001',
      name: 'Coal Plant',
      x: 1,
      y: 0,
    });

    for (const [buildingId, name, x] of [
      ['building_003', 'Smelter A', 2],
      ['building_004', 'Smelter B', 3],
      ['building_005', 'Smelter C', 4],
    ] as const) {
      placeBuilding.execute({
        buildingId,
        buildingTypeId: 'smelter',
        companyId: 'company_001',
        name,
        x,
        y: 0,
        regionId: 'region_east',
      });
    }

    for (const buildingId of [
      'building_001',
      'building_002',
      'building_003',
      'building_004',
      'building_005',
    ]) {
      completeBuildingConstruction({
        clock: context.clock,
        simulationEngine: context.simulationEngine,
        buildingRepository: context.buildingRepository,
        buildingId,
      });
    }

    const buyResult = buyResource.execute({
      companyId: 'company_001',
      resourceId: 'iron_ore',
      amount: 30,
    });

    expect(buyResult.ok).toBe(true);

    const recipe = context.gameContent.recipes.get('recipe_steel');

    expect(recipe).toBeDefined();

    if (recipe === undefined) {
      return;
    }

    for (const [jobId, buildingId] of [
      ['production_001', 'building_003'],
      ['production_002', 'building_004'],
      ['production_003', 'building_005'],
    ] as const) {
      const building = context.buildingRepository.findById(requireBuildingId(buildingId));

      expect(building).toBeDefined();

      if (building === undefined) {
        return;
      }

      const transportResult = context.transportLogisticsService.createInboundTransports({
        companyId: requireCompanyId('company_001'),
        destinationBuilding: building,
        recipe,
        productionJobId: jobId,
      });

      expect(transportResult.ok).toBe(true);
    }

    const allTransports = context.transportOrderRepository.findByCompanyId(
      requireCompanyId('company_001'),
    );

    expect(allTransports).toHaveLength(3);

    const inProgress = allTransports.filter(
      (order) => order.getStatus() === TransportOrderStatus.IN_PROGRESS,
    );
    const waiting = allTransports.filter(
      (order) => order.getStatus() === TransportOrderStatus.WAITING,
    );

    expect(inProgress).toHaveLength(2);
    expect(waiting).toHaveLength(1);

    for (let tick = 0; tick < 10; tick += 1) {
      context.simulationEngine.tick();
    }

    const afterFirstWave = context.transportOrderRepository.findByCompanyId(
      requireCompanyId('company_001'),
    );
    const completedCount = afterFirstWave.filter(
      (order) => order.getStatus() === TransportOrderStatus.COMPLETED,
    ).length;
    const stillInProgress = afterFirstWave.filter(
      (order) => order.getStatus() === TransportOrderStatus.IN_PROGRESS,
    ).length;

    expect(completedCount).toBe(2);

    const queuedAfterFirstWave = afterFirstWave.filter(
      (order) => order.getStatus() === TransportOrderStatus.WAITING,
    ).length;

    expect(stillInProgress + queuedAfterFirstWave).toBe(1);

    context.simulationEngine.tick();

    const afterPromotion = context.transportOrderRepository.findByCompanyId(
      requireCompanyId('company_001'),
    );

    expect(
      afterPromotion.filter((order) => order.getStatus() === TransportOrderStatus.IN_PROGRESS),
    ).toHaveLength(1);
  });

  it('keeps throughput queues isolated per cross-region route', async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot });

    expect(bootstrapResult.ok).toBe(true);

    if (!bootstrapResult.ok) {
      return;
    }

    const context = bootstrapResult.value;
    const createCompany = new CreateCompanyUseCase(context);
    const placeBuilding = new PlaceBuildingUseCase(context);
    const buyResource = new BuyResourceUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Route Isolation Co',
      ownerId: 'player_001',
    });

    grantMilestone(context, 'company_001', 'first_profit');
    grantMilestone(context, 'company_001', 'first_production');

    placeBuilding.execute({
      buildingId: 'building_001',
      buildingTypeId: 'warehouse',
      companyId: 'company_001',
      name: 'Central Warehouse',
      x: 0,
      y: 0,
    });
    placeBuilding.execute({
      buildingId: 'building_002',
      buildingTypeId: 'smelter',
      companyId: 'company_001',
      name: 'East Smelter',
      x: 1,
      y: 0,
      regionId: 'region_east',
    });
    placeBuilding.execute({
      buildingId: 'building_003',
      buildingTypeId: 'smelter',
      companyId: 'company_001',
      name: 'North Smelter',
      x: 2,
      y: 0,
      regionId: 'region_north',
    });

    for (const buildingId of ['building_001', 'building_002', 'building_003']) {
      completeBuildingConstruction({
        clock: context.clock,
        simulationEngine: context.simulationEngine,
        buildingRepository: context.buildingRepository,
        buildingId,
      });
    }

    const buyResult = buyResource.execute({
      companyId: 'company_001',
      resourceId: 'iron_ore',
      amount: 30,
    });

    expect(buyResult.ok).toBe(true);

    const recipe = context.gameContent.recipes.get('recipe_steel');

    expect(recipe).toBeDefined();

    if (recipe === undefined) {
      return;
    }

    const eastBuilding = context.buildingRepository.findById(requireBuildingId('building_002'));
    const northBuilding = context.buildingRepository.findById(requireBuildingId('building_003'));

    expect(eastBuilding).toBeDefined();
    expect(northBuilding).toBeDefined();

    if (eastBuilding === undefined || northBuilding === undefined) {
      return;
    }

    for (const [jobId, building] of [
      ['production_east_1', eastBuilding],
      ['production_east_2', eastBuilding],
      ['production_east_3', eastBuilding],
    ] as const) {
      const transportResult = context.transportLogisticsService.createInboundTransports({
        companyId: requireCompanyId('company_001'),
        destinationBuilding: building,
        recipe,
        productionJobId: jobId,
      });

      expect(transportResult.ok).toBe(true);
    }

    const northTransportResult = context.transportLogisticsService.createInboundTransports({
      companyId: requireCompanyId('company_001'),
      destinationBuilding: northBuilding,
      recipe,
      productionJobId: 'production_north_1',
    });

    expect(northTransportResult.ok).toBe(true);

    const allTransports = context.transportOrderRepository.findByCompanyId(
      requireCompanyId('company_001'),
    );

    expect(allTransports).toHaveLength(4);

    const eastRouteId = 'route_storage_to_production::region_default->region_east';
    const northRouteId = 'route_storage_to_production::region_default->region_north';

    const eastInProgress = allTransports.filter(
      (order) =>
        order.getRouteId() === eastRouteId &&
        order.getStatus() === TransportOrderStatus.IN_PROGRESS,
    );
    const eastWaiting = allTransports.filter(
      (order) =>
        order.getRouteId() === eastRouteId && order.getStatus() === TransportOrderStatus.WAITING,
    );
    const northInProgress = allTransports.filter(
      (order) =>
        order.getRouteId() === northRouteId &&
        order.getStatus() === TransportOrderStatus.IN_PROGRESS,
    );

    expect(eastInProgress).toHaveLength(2);
    expect(eastWaiting).toHaveLength(1);
    expect(northInProgress).toHaveLength(1);
  });

  it('rejects market deposits when warehouse storage capacity is full', async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot });

    expect(bootstrapResult.ok).toBe(true);

    if (!bootstrapResult.ok) {
      return;
    }

    const context = bootstrapResult.value;
    const createCompany = new CreateCompanyUseCase(context);
    const placeBuilding = new PlaceBuildingUseCase(context);
    const buyResource = new BuyResourceUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Capacity Test Co',
      ownerId: 'player_001',
    });

    grantMilestone(context, 'company_001', 'first_profit');

    placeBuilding.execute({
      buildingId: 'building_warehouse_001',
      buildingTypeId: 'warehouse',
      companyId: 'company_001',
      name: 'Central Warehouse',
      x: 0,
      y: 0,
    });

    completeBuildingConstruction({
      clock: context.clock,
      simulationEngine: context.simulationEngine,
      buildingRepository: context.buildingRepository,
      buildingId: 'building_warehouse_001',
    });

    const warehouse = context.buildingRepository.findById(
      requireBuildingId('building_warehouse_001'),
    );

    expect(warehouse).toBeDefined();

    if (warehouse === undefined) {
      return;
    }

    context.transportLogisticsService.ensureStorageForBuilding(warehouse);
    const storage = context.buildingStorageRepository.findByBuildingId(warehouse.getId());

    expect(storage).toBeDefined();

    if (storage === undefined) {
      return;
    }

    expect(storage.getStorageCapacity()).toBe(500);
    expect(storage.addQuantity('wood', 500).ok).toBe(true);
    context.buildingStorageRepository.save(storage);

    const buyResult = buyResource.execute({
      companyId: 'company_001',
      resourceId: 'wood',
      amount: 5,
    });

    expect(buyResult.ok).toBe(false);
    expect(
      context.transportLogisticsService.canDepositToWarehouse(requireCompanyId('company_001'), 5),
    ).toBe(false);
  });
});
