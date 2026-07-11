import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { STARTING_MONEY } from '../../domain/finance/FinanceConstants.js';
import { FinanceTransactionType } from '../../domain/finance/FinanceTransactionType.js';
import { createMarketId } from '../../domain/market/Market.js';
import { GLOBAL_MARKET_ID } from '../../domain/market/MarketConstants.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { MarketPriceSeeder } from './MarketPriceSeeder.js';
import { MarketTradeService } from './MarketTradeService.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireMarketId(value: string) {
  const result = createMarketId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

async function createTradeContext() {
  const contentResult = await validateGameContent(gameContentRoot);

  if (!contentResult.ok) {
    throw new Error(contentResult.error.message);
  }

  const clock = new ManualClock(100);
  const companyRepository = new InMemoryCompanyRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const financeRepository = new InMemoryFinanceRepository();
  const marketRepository = new InMemoryMarketRepository();
  const eventBus = new InMemoryEventBus();
  const simulationEngine = new SimulationEngine({ clock, eventBus });

  new MarketPriceSeeder({ marketRepository, clock }).seed(contentResult.value.resourceTypes);

  const createCompany = new CreateCompanyUseCase({
    clock,
    companyRepository,
    inventoryRepository,
    financeRepository,
    simulationEngine,
  });

  createCompany.execute({
    companyId: 'company_001',
    name: 'Genesis Industries',
    ownerId: 'player_001',
  });

  const inventory = inventoryRepository.findByCompanyId(requireCompanyId('company_001'));

  if (inventory === undefined) {
    throw new Error('Inventory was not found.');
  }

  inventory.addQuantity('wood', 10, clock);
  inventoryRepository.save(inventory);
  inventory.pullDomainEvents();

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
    inventoryRepository,
    financeRepository,
    marketRepository,
    marketTradeService,
  };
}

describe('MarketTradeService', () => {
  it('sells inventory and credits finance at the market price', async () => {
    const { marketTradeService, inventoryRepository, financeRepository, marketRepository } =
      await createTradeContext();

    const result = marketTradeService.sell(requireCompanyId('company_001'), 'wood', 4);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toEqual({
        totalAmount: 100,
        unitPrice: 25,
        amount: 4,
      });
    }

    const inventory = inventoryRepository.findByCompanyId(requireCompanyId('company_001'));
    const finance = financeRepository.findByCompanyId(requireCompanyId('company_001'));
    const market = marketRepository.findById(requireMarketId(GLOBAL_MARKET_ID));
    const wood = inventory?.getItems().find((item) => item.resourceId.value === 'wood');

    expect(wood?.quantity).toBe(6);
    expect(finance?.getCashBalance()).toBe(STARTING_MONEY + 100);
    expect(market?.getPrice('wood')?.tradeVolume).toBe(4);
  });

  it('buys inventory and debits finance at the market price', async () => {
    const { marketTradeService, inventoryRepository, financeRepository } =
      await createTradeContext();

    const result = marketTradeService.buy(requireCompanyId('company_001'), 'iron_ore', 2);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.totalAmount).toBe(80);
    }

    const inventory = inventoryRepository.findByCompanyId(requireCompanyId('company_001'));
    const finance = financeRepository.findByCompanyId(requireCompanyId('company_001'));
    const iron = inventory?.getItems().find((item) => item.resourceId.value === 'iron_ore');

    expect(iron?.quantity).toBe(2);
    expect(finance?.getCashBalance()).toBe(STARTING_MONEY - 80);
  });

  it('rejects sells when stock is insufficient', async () => {
    const { marketTradeService } = await createTradeContext();

    const result = marketTradeService.sell(requireCompanyId('company_001'), 'wood', 20);

    expect(result.ok).toBe(false);
  });

  it('rejects buys when cash is insufficient', async () => {
    const { marketTradeService, financeRepository, clock } = await createTradeContext();
    const finance = financeRepository.findByCompanyId(requireCompanyId('company_001'));

    if (finance === undefined) {
      throw new Error('Finance account was not found.');
    }

    finance.debit(STARTING_MONEY, FinanceTransactionType.PURCHASE, clock);
    financeRepository.save(finance);

    const result = marketTradeService.buy(requireCompanyId('company_001'), 'wood', 1);

    expect(result.ok).toBe(false);
  });
});
