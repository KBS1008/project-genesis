import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { STARTING_MONEY } from '../../domain/finance/FinanceConstants.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { GetFinanceQueryHandler } from './GetFinanceQueryHandler.js';

function createContext(clock = new ManualClock(100)) {
  const companyRepository = new InMemoryCompanyRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const financeRepository = new InMemoryFinanceRepository();
  const companyResearchRepository = new InMemoryCompanyResearchRepository();
  const eventBus = new InMemoryEventBus();
  const simulationEngine = new SimulationEngine({ clock, eventBus });
  const createCompany = new CreateCompanyUseCase({
    clock,
    companyRepository,
    inventoryRepository,
    financeRepository,
    companyResearchRepository,
    simulationEngine,
  });
  const getFinance = new GetFinanceQueryHandler({ financeRepository });

  return { createCompany, getFinance };
}

describe('GetFinanceQueryHandler', () => {
  it('returns finance balances for an existing company', () => {
    const { createCompany, getFinance } = createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const result = getFinance.execute({ companyId: 'company_001' });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toEqual({
        id: 'finance_company_001',
        companyId: 'company_001',
        currency: 'GC',
        cashBalance: STARTING_MONEY,
        reservedCash: 0,
        availableCash: STARTING_MONEY,
      });
    }
  });

  it('rejects unknown company finance accounts', () => {
    const { getFinance } = createContext();

    const result = getFinance.execute({ companyId: 'company_missing' });

    expect(result.ok).toBe(false);
  });
});
