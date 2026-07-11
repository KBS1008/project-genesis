import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { GetCompanyQueryHandler } from './GetCompanyQueryHandler.js';

function createContext(clock = new ManualClock(100)) {
  const companyRepository = new InMemoryCompanyRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const eventBus = new InMemoryEventBus();
  const simulationEngine = new SimulationEngine({ clock, eventBus });
  const createCompany = new CreateCompanyUseCase({
    clock,
    companyRepository,
    inventoryRepository,
    simulationEngine,
  });
  const getCompany = new GetCompanyQueryHandler({ companyRepository });

  return { createCompany, getCompany };
}

describe('GetCompanyQueryHandler', () => {
  it('returns a company read model for an existing company', () => {
    const { createCompany, getCompany } = createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const result = getCompany.execute({ companyId: 'company_001' });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toEqual({
        id: 'company_001',
        name: 'Genesis Industries',
        ownerId: 'player_001',
        foundedAt: 100,
        status: 'ACTIVE',
      });
    }
  });

  it('rejects unknown company ids', () => {
    const { getCompany } = createContext();

    const result = getCompany.execute({ companyId: 'company_missing' });

    expect(result.ok).toBe(false);
  });

  it('rejects invalid company id format', () => {
    const { getCompany } = createContext();

    const result = getCompany.execute({ companyId: 'Invalid Id' });

    expect(result.ok).toBe(false);
  });
});
