import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { CompanyMilestoneReached } from '../../domain/milestone/events/CompanyMilestoneReached.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../../infrastructure/persistence/InMemoryCompanyMilestonesRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { MarketPriceSeeder } from './MarketPriceSeeder.js';
import { MarketTradeService } from './MarketTradeService.js';
import { MilestoneEvaluationService } from './MilestoneEvaluationService.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

async function createContext() {
  const contentResult = await validateGameContent(gameContentRoot);

  if (!contentResult.ok) {
    throw new Error(contentResult.error.message);
  }

  const clock = new ManualClock(100);
  const companyRepository = new InMemoryCompanyRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const financeRepository = new InMemoryFinanceRepository();
  const companyResearchRepository = new InMemoryCompanyResearchRepository();
  const companyMilestonesRepository = new InMemoryCompanyMilestonesRepository();
  const marketRepository = new InMemoryMarketRepository();
  const eventBus = new InMemoryEventBus();
  const simulationEngine = new SimulationEngine({ clock, eventBus });

  new MarketPriceSeeder({ marketRepository, clock }).seed(contentResult.value.resourceTypes);

  new MilestoneEvaluationService({
    eventBus,
    clock,
    companyMilestonesRepository,
    simulationEngine,
    milestones: contentResult.value.milestones,
  });

  const createCompany = new CreateCompanyUseCase({
    clock,
    companyRepository,
    inventoryRepository,
    financeRepository,
    companyResearchRepository,
    companyMilestonesRepository,
    simulationEngine,
  });

  const marketTradeService = new MarketTradeService({
    inventoryRepository,
    financeRepository,
    marketRepository,
    clock,
    enqueueEvents: (events) => {
      simulationEngine.enqueueEvents(events);
    },
  });

  return {
    clock,
    eventBus,
    inventoryRepository,
    companyMilestonesRepository,
    createCompany,
    marketTradeService,
    simulationEngine,
  };
}

describe('MilestoneEvaluationService', () => {
  it('completes first_profit after the first market sale', async () => {
    const context = await createContext();
    const reached: string[] = [];

    context.eventBus.subscribe('CompanyMilestoneReached', (event) => {
      reached.push((event as CompanyMilestoneReached).milestoneId);
    });

    context.createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const inventory = context.inventoryRepository.findByCompanyId(requireCompanyId('company_001'));
    inventory?.addQuantity('wood', 5, context.clock);
    context.inventoryRepository.save(inventory!);

    const sellResult = context.marketTradeService.sell(
      requireCompanyId('company_001'),
      'wood',
      2,
    );

    expect(sellResult.ok).toBe(true);

    context.simulationEngine.tick();

    const milestones = context.companyMilestonesRepository.findByCompanyId(
      requireCompanyId('company_001'),
    );

    expect(milestones?.hasCompletedMilestone('first_profit')).toBe(true);

    context.simulationEngine.tick();
    expect(reached).toEqual(['first_profit']);
  });
});
