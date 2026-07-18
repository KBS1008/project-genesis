import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { createInventoryId, Inventory } from '../../domain/inventory/Inventory.js';
import { MARKET_BASELINE_DEMAND } from '../../domain/market/MarketPriceConstants.js';
import { createMarketId } from '../../domain/market/Market.js';
import { GLOBAL_MARKET_ID } from '../../domain/market/MarketConstants.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { MarketPriceSeeder } from '../services/MarketPriceSeeder.js';
import { GetMarketPricesQueryHandler } from './GetMarketPricesQueryHandler.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireInventoryId(value: string) {
  const result = createInventoryId(value);

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

async function createSeededContext() {
  const contentResult = await validateGameContent(gameContentRoot);

  if (!contentResult.ok) {
    throw new Error(contentResult.error.message);
  }

  const clock = new ManualClock(100);
  const marketRepository = new InMemoryMarketRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const seeder = new MarketPriceSeeder({ marketRepository, clock });
  seeder.seed(contentResult.value.resourceTypes);

  return {
    getMarketPrices: new GetMarketPricesQueryHandler({ marketRepository, inventoryRepository }),
    marketRepository,
    inventoryRepository,
    clock,
  };
}

describe('GetMarketPricesQueryHandler', () => {
  it('returns seeded market prices in deterministic order', async () => {
    const { getMarketPrices } = await createSeededContext();

    const result = getMarketPrices.execute({});

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.length).toBeGreaterThanOrEqual(3);
      expect(result.value[0]?.resourceId).toBe('iron_ore');
      expect(result.value.find((price) => price.resourceId === 'wood')).toEqual({
        resourceId: 'wood',
        basePrice: 25,
        lastPrice: 25,
        tradeVolume: 0,
        updatedAt: 100,
        totalSupply: 0,
        baselineDemand: MARKET_BASELINE_DEMAND,
        pressureIndex: 50,
        changeFromBase: 0,
        changePercent: 0,
        trend: 'STABLE',
      });
    }
  });

  it('includes aggregate inventory supply in market projections', async () => {
    const { getMarketPrices, inventoryRepository, clock } = await createSeededContext();
    const inventoryResult = Inventory.create({
      id: requireInventoryId('inventory_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(inventoryResult.ok).toBe(true);

    if (!inventoryResult.ok) {
      return;
    }

    inventoryResult.value.addQuantity('wood', 100, clock);
    inventoryRepository.save(inventoryResult.value);

    const result = getMarketPrices.execute({});
    const wood = result.ok ? result.value.find((price) => price.resourceId === 'wood') : undefined;

    expect(wood?.totalSupply).toBe(100);
    expect(wood?.pressureIndex).toBe(0.5);
  });

  it('rejects queries when the market was not initialized', () => {
    const getMarketPrices = new GetMarketPricesQueryHandler({
      marketRepository: new InMemoryMarketRepository(),
      inventoryRepository: new InMemoryInventoryRepository(),
    });

    const result = getMarketPrices.execute({});

    expect(result.ok).toBe(false);
  });
});

describe('InMemoryMarketRepository', () => {
  it('persists a market aggregate by id', async () => {
    const { marketRepository } = await createSeededContext();

    expect(marketRepository.findById(requireMarketId(GLOBAL_MARKET_ID))).toBeDefined();
    expect(marketRepository.findAll()).toHaveLength(1);
  });
});
