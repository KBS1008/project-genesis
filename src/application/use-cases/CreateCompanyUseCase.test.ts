import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { CompanyFounded } from '../../domain/company/events/CompanyFounded.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { CreateCompanyUseCase } from './CreateCompanyUseCase.js';

function createUseCase(clock = new ManualClock(100)) {
  const companyRepository = new InMemoryCompanyRepository();
  const eventBus = new InMemoryEventBus();
  const simulationEngine = new SimulationEngine({ clock, eventBus });
  const useCase = new CreateCompanyUseCase({
    clock,
    companyRepository,
    simulationEngine,
  });

  return { clock, companyRepository, eventBus, simulationEngine, useCase };
}

describe('CreateCompanyUseCase', () => {
  it('creates and persists a company', () => {
    const { companyRepository, useCase } = createUseCase();

    const result = useCase.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      const company = companyRepository.findById(result.value);
      expect(company?.getName()).toBe('Genesis Industries');
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
