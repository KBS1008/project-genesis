import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import type { DomainEvent } from '../../common/events/DomainEvent.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { createMilestoneId } from '../../domain/milestone/MilestoneId.js';
import { STARTING_MONEY } from '../../domain/finance/FinanceConstants.js';
import { ResearchCompleted } from '../../domain/research/events/ResearchCompleted.js';
import { ResearchStarted } from '../../domain/research/events/ResearchStarted.js';
import { TechnologyCompleted } from '../../domain/research/events/TechnologyCompleted.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../../infrastructure/persistence/InMemoryCompanyMilestonesRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { InMemoryEmployeeRepository } from '../../infrastructure/persistence/InMemoryEmployeeRepository.js';
import { InMemoryProductionJobRepository } from '../../infrastructure/persistence/InMemoryProductionJobRepository.js';
import { InMemoryResearchJobRepository } from '../../infrastructure/persistence/InMemoryResearchJobRepository.js';
import { FinanceTransactionType } from '../../domain/finance/FinanceTransactionType.js';
import { ResearchCompletionService } from '../services/ResearchCompletionService.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { createDefaultSimulationSystems } from '../../simulation/systems/createDefaultSimulationSystems.js';
import { createTransportTestServices } from '../../../tests/helpers/createTransportTestServices.js';
import { ProductionInventoryService } from '../services/ProductionInventoryService.js';
import { CreateCompanyUseCase } from './CreateCompanyUseCase.js';
import { StartResearchUseCase } from './StartResearchUseCase.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

async function createContext() {
  const contentResult = await validateGameContent(gameContentRoot);

  if (!contentResult.ok) {
    throw new Error(contentResult.error.message);
  }

  const clock = new ManualClock(100);
  const companyRepository = new InMemoryCompanyRepository();
  const buildingRepository = new InMemoryBuildingRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const financeRepository = new InMemoryFinanceRepository();
  const marketRepository = new InMemoryMarketRepository();
  const employeeRepository = new InMemoryEmployeeRepository();
  const productionJobRepository = new InMemoryProductionJobRepository();
  const researchJobRepository = new InMemoryResearchJobRepository();
  const companyResearchRepository = new InMemoryCompanyResearchRepository();
  const companyMilestonesRepository = new InMemoryCompanyMilestonesRepository();
  const eventBus = new InMemoryEventBus();

  let simulationEngine: SimulationEngine;
  const enqueueEvents = (events: readonly DomainEvent[]): void => {
    simulationEngine.enqueueEvents(events);
  };

  let researchCompletionService: ResearchCompletionService;

  const productionInventoryService = new ProductionInventoryService({
    inventoryRepository,
    recipes: contentResult.value.recipes,
    clock,
    enqueueEvents,
  });

  const transport = createTransportTestServices({
    clock,
    buildingRepository,
    productionJobRepository,
    inventoryRepository,
    productionInventoryService,
    gameContent: contentResult.value,
    enqueueEvents,
  });

  simulationEngine = new SimulationEngine({
    clock,
    eventBus,
    systems: createDefaultSimulationSystems({
      companyRepository,
      buildingRepository,
      transportOrderRepository: transport.transportOrderRepository,
      transportLogisticsService: transport.transportLogisticsService,
      productionJobRepository,
      researchJobRepository,
      financeRepository,
      inventoryRepository,
      marketRepository,
      employeeRepository,
      enqueueEvents,
      onResearchJobCompleted: (job) => {
        researchCompletionService.completeJob(job);
      },
    }),
  });

  researchCompletionService = new ResearchCompletionService({
    clock,
    companyRepository,
    companyResearchRepository,
    simulationEngine,
    gameContent: contentResult.value,
  });

  return {
    clock,
    eventBus,
    companyRepository,
    buildingRepository,
    inventoryRepository,
    financeRepository,
    researchJobRepository,
    companyResearchRepository,
    companyMilestonesRepository,
    simulationEngine,
    gameContent: contentResult.value,
  };
}

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function grantMilestone(
  context: Awaited<ReturnType<typeof createContext>>,
  companyId: string,
  milestoneId: string,
) {
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

describe('StartResearchUseCase', () => {
  it('starts a research job, debits cost and completes the technology after duration', async () => {
    const context = await createContext();
    const createCompany = new CreateCompanyUseCase(context);
    const startResearch = new StartResearchUseCase(context);
    const started: string[] = [];
    const completed: string[] = [];
    const technologyCompleted: string[] = [];

    context.eventBus.subscribe('ResearchStarted', (event) => {
      started.push((event as ResearchStarted).jobId);
    });
    context.eventBus.subscribe('ResearchCompleted', (event) => {
      completed.push((event as ResearchCompleted).jobId);
    });
    context.eventBus.subscribe('TechnologyCompleted', (event) => {
      technologyCompleted.push((event as TechnologyCompleted).technologyId);
    });

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });
    grantMilestone(context, 'company_001', 'profit_100');

    const financeBefore = context.financeRepository.findByCompanyId(requireCompanyId('company_001'));
    expect(financeBefore?.getCashBalance()).toBe(STARTING_MONEY);

    const result = startResearch.execute({
      jobId: 'research_job_001',
      companyId: 'company_001',
      technologyId: 'basic_woodworking',
    });

    expect(result.ok).toBe(true);

    const financeAfterStart = context.financeRepository.findByCompanyId(requireCompanyId('company_001'));
    expect(financeAfterStart?.getCashBalance()).toBe(STARTING_MONEY - 1000);

    context.simulationEngine.tick();
    expect(started).toEqual(['research_job_001']);

    const research = context.companyResearchRepository.findByCompanyId(requireCompanyId('company_001'));
    expect(research?.hasCompletedTechnology('basic_woodworking')).toBe(false);

    context.clock.advance(60);
    context.simulationEngine.tick();

    const researchAfter = context.companyResearchRepository.findByCompanyId(requireCompanyId('company_001'));

    expect(completed).toEqual(['research_job_001']);
    expect(technologyCompleted).toEqual(['basic_woodworking']);
    expect(researchAfter?.hasCompletedTechnology('basic_woodworking')).toBe(true);
  });

  it('rejects research when cash is insufficient', async () => {
    const context = await createContext();
    const createCompany = new CreateCompanyUseCase(context);
    const startResearch = new StartResearchUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });
    grantMilestone(context, 'company_001', 'profit_100');

    const finance = context.financeRepository.findByCompanyId(requireCompanyId('company_001'));

    if (finance === undefined) {
      throw new Error('Finance account was not found.');
    }

    const debitResult = finance.debit(STARTING_MONEY, FinanceTransactionType.ADMIN, context.clock);
    expect(debitResult.ok).toBe(true);
    context.financeRepository.save(finance);
    finance.pullDomainEvents();

    const result = startResearch.execute({
      jobId: 'research_job_001',
      companyId: 'company_001',
      technologyId: 'basic_woodworking',
    });

    expect(result.ok).toBe(false);
    expect(context.researchJobRepository.findAll()).toHaveLength(0);
  });

  it('rejects duplicate in-progress research for the same technology', async () => {
    const context = await createContext();
    const createCompany = new CreateCompanyUseCase(context);
    const startResearch = new StartResearchUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });
    grantMilestone(context, 'company_001', 'profit_100');

    const firstResult = startResearch.execute({
      jobId: 'research_job_001',
      companyId: 'company_001',
      technologyId: 'basic_woodworking',
    });

    expect(firstResult.ok).toBe(true);

    const duplicateResult = startResearch.execute({
      jobId: 'research_job_002',
      companyId: 'company_001',
      technologyId: 'basic_woodworking',
    });

    expect(duplicateResult.ok).toBe(false);
  });

  it('rejects research when required milestones are not completed', async () => {
    const context = await createContext();
    const createCompany = new CreateCompanyUseCase(context);
    const startResearch = new StartResearchUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const result = startResearch.execute({
      jobId: 'research_job_001',
      companyId: 'company_001',
      technologyId: 'basic_woodworking',
    });

    expect(result.ok).toBe(false);
  });
});
