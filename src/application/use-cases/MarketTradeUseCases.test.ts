import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { STARTING_MONEY } from '../../domain/finance/FinanceConstants.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { MarketPriceSeeder } from '../services/MarketPriceSeeder.js';
import { MarketTradeService } from '../services/MarketTradeService.js';
import { CreateCompanyUseCase } from './CreateCompanyUseCase.js';
import { SellResourceUseCase } from './SellResourceUseCase.js';
import { BuyResourceUseCase } from './BuyResourceUseCase.js';

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
    companyRepository,
    inventoryRepository,
    financeRepository,
    createCompany,
    sellResource: new SellResourceUseCase({ companyRepository, marketTradeService }),
    buyResource: new BuyResourceUseCase({ companyRepository, marketTradeService }),
  };
}

describe('SellResourceUseCase', () => {
  it('sells company inventory through the market trade service', async () => {
    const context = await createContext();

    context.createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const inventory = context.inventoryRepository.findByCompanyId(requireCompanyId('company_001'));
    inventory?.addQuantity('wood', 5, context.clock);
    context.inventoryRepository.save(inventory!);

    const result = context.sellResource.execute({
      companyId: 'company_001',
      resourceId: 'wood',
      amount: 2,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.totalAmount).toBe(50);
    }

    const finance = context.financeRepository.findByCompanyId(requireCompanyId('company_001'));
    expect(finance?.getCashBalance()).toBe(STARTING_MONEY + 50);
  });

  it('rejects sells for unknown companies', async () => {
    const context = await createContext();

    const result = context.sellResource.execute({
      companyId: 'company_missing',
      resourceId: 'wood',
      amount: 1,
    });

    expect(result.ok).toBe(false);
  });
});

describe('BuyResourceUseCase', () => {
  it('buys resources into company inventory', async () => {
    const context = await createContext();

    context.createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const result = context.buyResource.execute({
      companyId: 'company_001',
      resourceId: 'wood',
      amount: 3,
    });

    expect(result.ok).toBe(true);

    const inventory = context.inventoryRepository.findByCompanyId(requireCompanyId('company_001'));
    const wood = inventory?.getItems().find((item) => item.resourceId.value === 'wood');

    expect(wood?.quantity).toBe(3);
  });
});
