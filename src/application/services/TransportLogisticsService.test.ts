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
import { DEFAULT_TRANSPORT_DURATION } from './TransportLogisticsService.js';

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

    const inventoryAfterBuy = context.inventoryRepository.findByCompanyId(requireCompanyId('company_001'));
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
    expect(transports[0]?.getStatus()).toBe(TransportOrderStatus.IN_PROGRESS);

    for (let tick = 0; tick < DEFAULT_TRANSPORT_DURATION; tick += 1) {
      context.simulationEngine.tick();
    }

    const jobAfterTransport = context.productionJobRepository.findById(
      startResult.ok ? startResult.value : (undefined as never),
    );
    expect(jobAfterTransport?.getStatus()).toBe(ProductionJobStatus.RUNNING);

    const completedTransports = context.transportOrderRepository.findByProductionJobId('production_001');
    expect(completedTransports[0]?.getStatus()).toBe(TransportOrderStatus.COMPLETED);
  });
});
