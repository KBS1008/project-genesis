import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { CompanyBrain } from '../../domain/brain/CompanyBrain.js';
import { createCompanyBrainId } from '../../domain/brain/CompanyBrainId.js';
import { CompanyDecisionType } from '../../domain/brain/CompanyDecisionType.js';
import { GoalKind } from '../../domain/brain/GoalKind.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyBrainRepository } from '../../infrastructure/persistence/InMemoryCompanyBrainRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../../infrastructure/persistence/InMemoryCompanyMilestonesRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { InMemoryProductionJobRepository } from '../../infrastructure/persistence/InMemoryProductionJobRepository.js';
import { InMemoryResearchJobRepository } from '../../infrastructure/persistence/InMemoryResearchJobRepository.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { MarketPriceSeeder } from '../services/MarketPriceSeeder.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { CompanyPlanningPipeline } from './CompanyPlanningPipeline.js';
import { CompanyPlanningObserver } from './CompanyPlanningObserver.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

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

function snapshotInventory(inventoryRepository: InMemoryInventoryRepository, companyId: string) {
  const inventory = inventoryRepository.findByCompanyId(requireCompanyId(companyId));

  if (inventory === undefined) {
    return [];
  }

  return inventory
    .getItems()
    .map((item) => ({
      resourceId: item.resourceId.value,
      quantity: item.quantity,
      reserved: item.reserved,
    }))
    .sort((left, right) => left.resourceId.localeCompare(right.resourceId));
}

function snapshotFinance(financeRepository: InMemoryFinanceRepository, companyId: string) {
  const finance = financeRepository.findByCompanyId(requireCompanyId(companyId));

  if (finance === undefined) {
    return undefined;
  }

  return {
    cashBalance: finance.getCashBalance(),
    availableCash: finance.getAvailableCash(),
  };
}

function snapshotMarkets(marketRepository: InMemoryMarketRepository) {
  return marketRepository
    .findAll()
    .flatMap((market) =>
      market.getPrices().map((price) => ({
        regionId: market.getRegionId(),
        resourceId: price.resourceId.value,
        lastPrice: price.lastPrice,
        basePrice: price.basePrice,
      })),
    )
    .sort((left, right) => {
      if (left.regionId !== right.regionId) {
        return left.regionId.localeCompare(right.regionId);
      }

      return left.resourceId.localeCompare(right.resourceId);
    });
}

async function createPlanningContext(options?: { woodQuantity?: number }) {
  const contentResult = await validateGameContent(gameContentRoot);

  if (!contentResult.ok) {
    throw new Error(contentResult.error.message);
  }

  const clock = new ManualClock(100);
  const companyRepository = new InMemoryCompanyRepository();
  const companyBrainRepository = new InMemoryCompanyBrainRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const financeRepository = new InMemoryFinanceRepository();
  const buildingRepository = new InMemoryBuildingRepository();
  const marketRepository = new InMemoryMarketRepository();
  const productionJobRepository = new InMemoryProductionJobRepository();
  const researchJobRepository = new InMemoryResearchJobRepository();
  const companyResearchRepository = new InMemoryCompanyResearchRepository();
  const companyMilestonesRepository = new InMemoryCompanyMilestonesRepository();
  const eventBus = new InMemoryEventBus();
  const simulationEngine = new SimulationEngine({ clock, eventBus });

  new MarketPriceSeeder({ marketRepository, clock }).seed(
    contentResult.value.resourceTypes,
    contentResult.value.regions,
  );

  const createCompany = new CreateCompanyUseCase({
    clock,
    companyRepository,
    inventoryRepository,
    financeRepository,
    companyResearchRepository,
    companyMilestonesRepository,
    simulationEngine,
  });

  createCompany.execute({
    companyId: 'company_001',
    name: 'Genesis Industries',
    ownerId: 'player_001',
  });

  const companyId = requireCompanyId('company_001');
  const brainResult = CompanyBrain.create({
    id: requireCompanyBrainId('brain_company_001'),
    companyId,
    clock,
    initialStrategyDefinitionId: 'strategy_balanced',
  });

  if (!brainResult.ok) {
    throw new Error(brainResult.error.message);
  }

  brainResult.value.pullDomainEvents();
  companyBrainRepository.save(brainResult.value);

  const inventory = inventoryRepository.findByCompanyId(companyId);

  if (inventory !== undefined && options?.woodQuantity !== undefined) {
    inventory.addQuantity('wood', options.woodQuantity, clock);
    inventoryRepository.save(inventory);
    inventory.pullDomainEvents();
  }

  const pipeline = new CompanyPlanningPipeline({
    inventoryRepository,
    financeRepository,
    buildingRepository,
    marketRepository,
    productionJobRepository,
    companyResearchRepository,
    companyMilestonesRepository,
    researchJobRepository,
    companyBrainRepository,
    strategies: contentResult.value.strategies,
    gameContent: contentResult.value,
    clock,
  });

  const observer = new CompanyPlanningObserver({
    inventoryRepository,
    financeRepository,
    buildingRepository,
    marketRepository,
    productionJobRepository,
    companyResearchRepository,
    companyMilestonesRepository,
    researchJobRepository,
  });

  return {
    clock,
    companyId,
    companyBrainRepository,
    inventoryRepository,
    financeRepository,
    marketRepository,
    pipeline,
    observer,
  };
}

function brainSignature(companyBrainRepository: InMemoryCompanyBrainRepository, companyId: string) {
  const brain = companyBrainRepository.findByCompanyId(requireCompanyId(companyId));

  if (brain === undefined) {
    throw new Error('Brain not found');
  }

  return {
    goalIds: brain.getGoals().map((goal) => goal.id.value).sort(),
    decisionIds: brain.getPendingDecisions().map((decision) => decision.id.value).sort(),
    knowledgeIds: brain.getKnowledge().map((entry) => entry.id.value).sort(),
    memoryIds: brain.getMemory().map((entry) => entry.id.value).sort(),
  };
}

describe('CompanyPlanningObserver', () => {
  it('builds a read-only observation without mutating repositories', async () => {
    const context = await createPlanningContext();
    const inventoryBefore = snapshotInventory(context.inventoryRepository, 'company_001');
    const financeBefore = snapshotFinance(context.financeRepository, 'company_001');
    const marketsBefore = snapshotMarkets(context.marketRepository);

    const observationResult = context.observer.observe(context.companyId, 10);

    expect(observationResult.ok).toBe(true);
    expect(snapshotInventory(context.inventoryRepository, 'company_001')).toEqual(inventoryBefore);
    expect(snapshotFinance(context.financeRepository, 'company_001')).toEqual(financeBefore);
    expect(snapshotMarkets(context.marketRepository)).toEqual(marketsBefore);

    if (observationResult.ok) {
      expect(observationResult.value.tickNumber).toBe(10);
      expect(observationResult.value.marketPrices.length).toBeGreaterThan(0);
    }
  });
});

describe('CompanyPlanningPipeline', () => {
  it('skips planning when no layer is scheduled for the tick', async () => {
    const context = await createPlanningContext();
    const result = context.pipeline.run(context.companyId, 0);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.layersExecuted).toEqual([]);
      expect(result.value.goalsAdded).toBe(0);
      expect(result.value.decisionsQueued).toBe(0);
    }
  });

  it('fails when the company brain is missing', async () => {
    const context = await createPlanningContext();
    const missingBrainCompany = requireCompanyId('company_missing');
    const result = context.pipeline.run(missingBrainCompany, 10);

    expect(result.ok).toBe(false);
  });

  it('produces identical brain updates for identical initial state', async () => {
    const firstContext = await createPlanningContext();
    const secondContext = await createPlanningContext();

    const firstResult = firstContext.pipeline.run(firstContext.companyId, 10);
    const secondResult = secondContext.pipeline.run(secondContext.companyId, 10);

    expect(firstResult.ok).toBe(true);
    expect(secondResult.ok).toBe(true);
    expect(brainSignature(firstContext.companyBrainRepository, 'company_001')).toEqual(
      brainSignature(secondContext.companyBrainRepository, 'company_001'),
    );
  });

  it('does not mutate inventory, finance, or market repositories', async () => {
    const context = await createPlanningContext();
    const inventoryBefore = snapshotInventory(context.inventoryRepository, 'company_001');
    const financeBefore = snapshotFinance(context.financeRepository, 'company_001');
    const marketsBefore = snapshotMarkets(context.marketRepository);

    const result = context.pipeline.run(context.companyId, 10);

    expect(result.ok).toBe(true);
    expect(snapshotInventory(context.inventoryRepository, 'company_001')).toEqual(inventoryBefore);
    expect(snapshotFinance(context.financeRepository, 'company_001')).toEqual(financeBefore);
    expect(snapshotMarkets(context.marketRepository)).toEqual(marketsBefore);
  });

  it('queues purchase decisions when tracked resources are below minimum stock', async () => {
    const context = await createPlanningContext();
    const result = context.pipeline.run(context.companyId, 10);

    expect(result.ok).toBe(true);

    const brain = context.companyBrainRepository.findByCompanyId(context.companyId);

    expect(brain).toBeDefined();
    expect(brain?.getGoals().some((goal) => goal.kind === GoalKind.SECURE_SUPPLY)).toBe(true);
    expect(
      brain?.getPendingDecisions().some(
        (decision) => decision.type === CompanyDecisionType.PURCHASE_RESOURCE,
      ),
    ).toBe(true);

    if (result.ok) {
      expect(result.value.decisionsQueued).toBeGreaterThan(0);
    }
  });

  it('queues sell decisions when surplus inventory exceeds target stock', async () => {
    const context = await createPlanningContext({ woodQuantity: 100 });
    const result = context.pipeline.run(context.companyId, 10);

    expect(result.ok).toBe(true);

    const brain = context.companyBrainRepository.findByCompanyId(context.companyId);

    expect(brain?.getGoals().some((goal) => goal.kind === GoalKind.IMPROVE_PROFITABILITY)).toBe(
      true,
    );
    expect(
      brain?.getPendingDecisions().some(
        (decision) => decision.type === CompanyDecisionType.SELL_RESOURCE,
      ),
    ).toBe(true);
  });
});
