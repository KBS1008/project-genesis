import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../../infrastructure/persistence/InMemoryCompanyMilestonesRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { FinanceTransactionType } from '../../domain/finance/FinanceTransactionType.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { ListFinanceTransactionsQueryHandler } from './ListFinanceTransactionsQueryHandler.js';

function createContext(clock = new ManualClock(100)) {
  const companyRepository = new InMemoryCompanyRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const financeRepository = new InMemoryFinanceRepository();
  const companyResearchRepository = new InMemoryCompanyResearchRepository();
  const companyMilestonesRepository = new InMemoryCompanyMilestonesRepository();
  const eventBus = new InMemoryEventBus();
  const simulationEngine = new SimulationEngine({ clock, eventBus });
  const createCompany = new CreateCompanyUseCase({
    clock,
    companyRepository,
    inventoryRepository,
    financeRepository,
    companyResearchRepository,
    companyMilestonesRepository,
    simulationEngine,
  });
  const listFinanceTransactions = new ListFinanceTransactionsQueryHandler({ financeRepository });

  return { createCompany, financeRepository, listFinanceTransactions, clock };
}

describe('ListFinanceTransactionsQueryHandler', () => {
  it('returns ledger entries newest first for an existing company', () => {
    const { createCompany, financeRepository, listFinanceTransactions, clock } = createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const companyId = createCompanyId('company_001');

    if (!companyId.ok) {
      throw new Error('Expected valid company id.');
    }

    const account = financeRepository.findByCompanyId(companyId.value);

    if (account === undefined) {
      throw new Error('Expected finance account.');
    }

    account.debit(1_000, FinanceTransactionType.ADMIN, clock);
    financeRepository.save(account);
    account.pullDomainEvents();

    const advanceResult = clock.advance(50);

    if (!advanceResult.ok) {
      throw new Error('Expected clock advance to succeed.');
    }

    account.credit(250, FinanceTransactionType.SALE, clock);
    financeRepository.save(account);
    account.pullDomainEvents();

    const result = listFinanceTransactions.execute({ companyId: 'company_001' });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.length).toBeGreaterThanOrEqual(2);
      expect(result.value[0]?.transactionType).toBe(FinanceTransactionType.SALE);
      expect(result.value[1]?.transactionType).toBe(FinanceTransactionType.ADMIN);
    }
  });

  it('rejects unknown company finance accounts', () => {
    const { listFinanceTransactions } = createContext();

    const result = listFinanceTransactions.execute({ companyId: 'company_missing' });

    expect(result.ok).toBe(false);
  });
});
