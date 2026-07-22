import { InMemoryCompanyBrainRepository } from '../../infrastructure/persistence/InMemoryCompanyBrainRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../../infrastructure/persistence/InMemoryCompanyMilestonesRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import type { CompanyFounded } from '../../domain/company/events/CompanyFounded.js';
import { STARTING_MONEY } from '../../domain/finance/FinanceConstants.js';
import { CreateCompanyUseCase } from './CreateCompanyUseCase.js';

function createUseCase(clock = new ManualClock(100)) {
  const companyRepository = new InMemoryCompanyRepository();
  const companyBrainRepository = new InMemoryCompanyBrainRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const financeRepository = new InMemoryFinanceRepository();
  const companyResearchRepository = new InMemoryCompanyResearchRepository();
  const companyMilestonesRepository = new InMemoryCompanyMilestonesRepository();
  const eventBus = new InMemoryEventBus();
  const simulationEngine = new SimulationEngine({ clock, eventBus });
  const useCase = new CreateCompanyUseCase({
    clock,
    companyRepository,
    inventoryRepository,
    financeRepository,
    companyResearchRepository,
    companyMilestonesRepository,
    simulationEngine,
    companyBrainRepository,
  });

  return {
    clock,
    companyRepository,
    companyBrainRepository,
    inventoryRepository,
    financeRepository,
    companyResearchRepository,
    companyMilestonesRepository,
    eventBus,
    simulationEngine,
    useCase,
  };
}

describe('CreateCompanyUseCase', () => {
  it('creates and persists a company with an inventory and finance account', () => {
    const {
      companyRepository,
      inventoryRepository,
      financeRepository,
      companyResearchRepository,
      companyMilestonesRepository,
      useCase,
    } = createUseCase();

    const result = useCase.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      const company = companyRepository.findById(result.value);
      expect(company?.getName()).toBe('Genesis Industries');
      expect(inventoryRepository.findByCompanyId(result.value)).toBeDefined();

      const finance = financeRepository.findByCompanyId(result.value);
      expect(finance?.getCashBalance()).toBe(STARTING_MONEY);
      expect(finance?.getAvailableCash()).toBe(STARTING_MONEY);
      expect(companyResearchRepository.findByCompanyId(result.value)).toBeDefined();
      expect(companyMilestonesRepository.findByCompanyId(result.value)).toBeDefined();
    }
  });

  it('bootstraps a company brain for autonomous companies', () => {
    const { companyBrainRepository, useCase } = createUseCase();

    const result = useCase.execute({
      companyId: 'company_npc_001',
      name: 'Autonomous Corp',
      ownerId: 'npc_001',
      autonomous: true,
      strategyDefinitionId: 'strategy_balanced',
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(companyBrainRepository.findByCompanyId(result.value)).toBeDefined();
    }
  });

  it('enqueues CompanyFounded events for the next simulation tick', () => {
    const { eventBus, simulationEngine, useCase } = createUseCase();
    const received: string[] = [];

    eventBus.subscribe('CompanyFounded', (event) => {
      received.push((event as CompanyFounded).companyId);
    });

    const createResult = useCase.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    expect(createResult.ok).toBe(true);

    const tickResult = simulationEngine.tick();

    expect(tickResult.ok).toBe(true);
    expect(received).toEqual(['company_001']);
  });

  it('rejects duplicate company ids', () => {
    const { useCase } = createUseCase();

    useCase.execute({
      companyId: 'company_001',
      name: 'First Corp',
      ownerId: 'player_001',
    });

    const secondResult = useCase.execute({
      companyId: 'company_001',
      name: 'Second Corp',
      ownerId: 'player_001',
    });

    expect(secondResult.ok).toBe(false);
  });
});
