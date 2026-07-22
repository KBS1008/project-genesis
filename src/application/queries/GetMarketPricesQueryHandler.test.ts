import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { MARKET_BASELINE_DEMAND } from '../../domain/market/MarketPriceConstants.js';
import { createRegionalMarketId } from '../../domain/market/MarketConstants.js';
import { DEFAULT_REGION_ID } from '../../domain/world/WorldConstants.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryBuildingStorageRepository } from '../../infrastructure/persistence/InMemoryBuildingStorageRepository.js';
import { InMemoryMarketRepository } from '../../infrastructure/persistence/InMemoryMarketRepository.js';
import { MarketPriceSeeder } from '../services/MarketPriceSeeder.js';
import { GetMarketPricesQueryHandler } from './GetMarketPricesQueryHandler.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

async function createSeededContext() {
  const contentResult = await validateGameContent(gameContentRoot);

  if (!contentResult.ok) {
    throw new Error(contentResult.error.message);
  }

  const clock = new ManualClock(100);
  const marketRepository = new InMemoryMarketRepository();
  const buildingRepository = new InMemoryBuildingRepository();
  const buildingStorageRepository = new InMemoryBuildingStorageRepository();
  const seeder = new MarketPriceSeeder({ marketRepository, clock });
  seeder.seed(contentResult.value.resourceTypes, contentResult.value.regions);

  return {
    getMarketPrices: new GetMarketPricesQueryHandler({
      marketRepository,
      buildingRepository,
      buildingStorageRepository,
    }),
    marketRepository,
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

  it('uses regional building storage for supply projections', async () => {
    const { getMarketPrices } = await createSeededContext();

    const result = getMarketPrices.execute({ regionId: DEFAULT_REGION_ID });
    const wood = result.ok ? result.value.find((price) => price.resourceId === 'wood') : undefined;

    expect(wood?.totalSupply).toBe(0);
    expect(wood?.pressureIndex).toBe(50);
  });

  it('rejects queries when the market was not initialized', () => {
    const getMarketPrices = new GetMarketPricesQueryHandler({
      marketRepository: new InMemoryMarketRepository(),
      buildingRepository: new InMemoryBuildingRepository(),
      buildingStorageRepository: new InMemoryBuildingStorageRepository(),
    });

    const result = getMarketPrices.execute({});

    expect(result.ok).toBe(false);
  });
});

describe('InMemoryMarketRepository', () => {
  it('persists regional market aggregates by region id', async () => {
    const { marketRepository } = await createSeededContext();

    expect(marketRepository.findByRegionId(DEFAULT_REGION_ID)).toBeDefined();
    expect(marketRepository.findAll().length).toBeGreaterThanOrEqual(3);
    expect(marketRepository.findByRegionId(DEFAULT_REGION_ID)?.getId().value).toBe(
      createRegionalMarketId(DEFAULT_REGION_ID),
    );
  });
});
