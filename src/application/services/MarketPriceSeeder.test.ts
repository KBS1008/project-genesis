import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { createMarketId } from '../../domain/market/Market.js';
import { createRegionalMarketId } from '../../domain/market/MarketConstants.js';
import { DEFAULT_REGION_ID } from '../../domain/world/WorldConstants.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { MarketPriceSeeder } from './MarketPriceSeeder.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

function requireMarketId(value: string) {
  const result = createMarketId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('MarketPriceSeeder', () => {
  it('seeds regional market prices from loaded resource content', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    if (!contentResult.ok) {
      throw new Error(contentResult.error.message);
    }

    const clock = new ManualClock(100);
    const marketRepository = new InMemoryMarketRepository();
    const seeder = new MarketPriceSeeder({ marketRepository, clock });

    const result = seeder.seed(contentResult.value.resourceTypes, contentResult.value.regions);

    expect(result.ok).toBe(true);

    const market = marketRepository.findByRegionId(DEFAULT_REGION_ID);
    const prices = market?.getPrices();

    expect(prices?.length).toBeGreaterThanOrEqual(3);
    expect(prices?.find((price) => price.resourceId.value === 'wood')?.basePrice).toBe(25);
  });

  it('does not overwrite an existing market', async () => {
    const contentResult = await validateGameContent(gameContentRoot);

    if (!contentResult.ok) {
      throw new Error(contentResult.error.message);
    }

    const clock = new ManualClock(100);
    const marketRepository = new InMemoryMarketRepository();
    const seeder = new MarketPriceSeeder({ marketRepository, clock });

    seeder.seed(contentResult.value.resourceTypes, contentResult.value.regions);
    seeder.seed(contentResult.value.resourceTypes, contentResult.value.regions);

    const market = marketRepository.findByRegionId(DEFAULT_REGION_ID);
    market?.updateLastPrice('wood', 99, 0, clock);

    expect(market?.getPrice('wood')?.lastPrice).toBe(99);
  });
});
