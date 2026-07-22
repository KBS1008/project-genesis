import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bootstrapApplication } from '../../../application/bootstrap/bootstrapApplication.js';
import { CreateCompanyUseCase } from '../../../application/use-cases/CreateCompanyUseCase.js';
import { CompanyBrain } from '../../../domain/brain/CompanyBrain.js';
import type { CompanyDecisionExecutionPort } from '../../../domain/brain/CompanyDecisionExecutionPort.js';
import type { CompanyPlanningPort } from '../../../domain/brain/CompanyPlanningPort.js';
import { createCompanyBrainId } from '../../../domain/brain/CompanyBrainId.js';
import { CompanyDecisionStatus } from '../../../domain/brain/CompanyDecisionStatus.js';
import { CompanyDecisionType } from '../../../domain/brain/CompanyDecisionType.js';
import { createCompanyId } from '../../../domain/company/Company.js';
import { createDefaultSimulationSystems } from '../createDefaultSimulationSystems.js';
import { SimulationEngine } from '../../engine/SimulationEngine.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../../game-content');

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireCompanyBrainId(value: string) {
  const result = createCompanyBrainId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

async function createEconomySimulationContext() {
  const bootstrapResult = await bootstrapApplication({ gameContentRoot });

  if (!bootstrapResult.ok) {
    throw new Error(bootstrapResult.error.message);
  }

  const application = bootstrapResult.value;
  const createCompany = new CreateCompanyUseCase(application);

  createCompany.execute({
    companyId: 'company_001',
    name: 'Genesis Industries',
    ownerId: 'player_001',
  });

  const companyId = requireCompanyId('company_001');
  const brainResult = CompanyBrain.create({
    id: requireCompanyBrainId('brain_company_001'),
    companyId,
    clock: application.clock,
    initialStrategyDefinitionId: 'strategy_balanced',
  });

  if (!brainResult.ok) {
    throw new Error(brainResult.error.message);
  }

  brainResult.value.pullDomainEvents();
  application.companyBrainRepository.save(brainResult.value);

  const companyPlanningPort: CompanyPlanningPort = {
    run(companyIdToPlan, tickNumber) {
      application.companyPlanningPipeline.run(companyIdToPlan, tickNumber);
    },
  };

  const companyDecisionExecutionPort: CompanyDecisionExecutionPort = {
    executePendingDecisions(companyIdToExecute) {
      application.companyDecisionExecutionService.executePendingDecisions(companyIdToExecute);
    },
  };

  const systems = createDefaultSimulationSystems({
    companyRepository: application.companyRepository,
    buildingRepository: application.buildingRepository,
    buildingStorageRepository: application.buildingStorageRepository,
    transportOrderRepository: application.transportOrderRepository,
    transportLogisticsService: application.transportLogisticsService,
    productionJobRepository: application.productionJobRepository,
    researchJobRepository: application.researchJobRepository,
    financeRepository: application.financeRepository,
    inventoryRepository: application.inventoryRepository,
    marketRepository: application.marketRepository,
    supplyContractRepository: application.supplyContractRepository,
    employeeRepository: application.employeeRepository,
    companyBrainRepository: application.companyBrainRepository,
    companyPlanningPort,
    companyDecisionExecutionPort,
    enqueueEvents: (events) => {
      application.simulationEngine.enqueueEvents(events);
    },
    onProductionJobCompleted: (job) => {
      application.productionInventoryService.completeJob(job);
    },
    energyBalanceService: application.energyBalanceService,
  });

  return {
    companyId,
    companyBrainRepository: application.companyBrainRepository,
    inventoryRepository: application.inventoryRepository,
    simulationEngine: new SimulationEngine({
      clock: application.clock,
      eventBus: application.eventBus,
      systems,
    }),
  };
}

describe('M8 company economy simulation integration', () => {
  it('executes queued decisions at tick start and plans after market updates', async () => {
    const context = await createEconomySimulationContext();

    expect(context.simulationEngine.tick().ok).toBe(true);

    const brainAfterTickOne = context.companyBrainRepository.findByCompanyId(context.companyId);

    expect(brainAfterTickOne?.getKnowledge().length).toBeGreaterThan(0);
    expect(brainAfterTickOne?.getGoals().length).toBeGreaterThan(0);

    expect(context.simulationEngine.tick().ok).toBe(true);

    const inventory = context.inventoryRepository.findByCompanyId(context.companyId);
    const hasPurchasedResources = inventory?.getItems().some((item) => item.quantity > 0);

    expect(hasPurchasedResources).toBe(true);

    const brainAfterTickTwo = context.companyBrainRepository.findByCompanyId(context.companyId);
    const completedPurchase = brainAfterTickTwo
      ?.getDecisions()
      .some(
        (decision) =>
          decision.type === CompanyDecisionType.PURCHASE_RESOURCE &&
          decision.status === CompanyDecisionStatus.COMPLETED,
      );

    expect(completedPurchase).toBe(true);
  });

  it('produces identical outcomes for identical initial state across two engines', async () => {
    const firstContext = await createEconomySimulationContext();
    const secondContext = await createEconomySimulationContext();

    for (let tick = 0; tick < 3; tick += 1) {
      expect(firstContext.simulationEngine.tick().ok).toBe(true);
      expect(secondContext.simulationEngine.tick().ok).toBe(true);
    }

    const firstInventory = firstContext.inventoryRepository
      .findByCompanyId(firstContext.companyId)
      ?.getItems()
      .map((item) => ({
        resourceId: item.resourceId.value,
        quantity: item.quantity,
        reserved: item.reserved,
      }))
      .sort((left, right) => left.resourceId.localeCompare(right.resourceId));

    const secondInventory = secondContext.inventoryRepository
      .findByCompanyId(secondContext.companyId)
      ?.getItems()
      .map((item) => ({
        resourceId: item.resourceId.value,
        quantity: item.quantity,
        reserved: item.reserved,
      }))
      .sort((left, right) => left.resourceId.localeCompare(right.resourceId));

    expect(firstInventory).toEqual(secondInventory);

    const firstBrain = firstContext.companyBrainRepository.findByCompanyId(firstContext.companyId);
    const secondBrain = secondContext.companyBrainRepository.findByCompanyId(secondContext.companyId);

    expect(firstBrain?.getDecisions().map((decision) => decision.id.value).sort()).toEqual(
      secondBrain?.getDecisions().map((decision) => decision.id.value).sort(),
    );
  });
});
