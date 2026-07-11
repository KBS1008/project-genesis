import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { createMarketId } from '../../domain/market/Market.js';
import { GLOBAL_MARKET_ID } from '../../domain/market/MarketConstants.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { MarketPriceSeeder } from '../services/MarketPriceSeeder.js';
import { GetMarketPricesQueryHandler } from './GetMarketPricesQueryHandler.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

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
  const seeder = new MarketPriceSeeder({ marketRepository, clock });
  seeder.seed(contentResult.value.resourceTypes);

  return {
    getMarketPrices: new GetMarketPricesQueryHandler({ marketRepository }),
    marketRepository,
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
      });
    }
  });

  it('rejects queries when the market was not initialized', () => {
    const getMarketPrices = new GetMarketPricesQueryHandler({
      marketRepository: new InMemoryMarketRepository(),
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
