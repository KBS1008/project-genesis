import { ManualClock } from '../../../common/time/ManualClock.js';
import { MARKET_PRICE_UPDATE_INTERVAL_TICKS } from '../../../domain/market/MarketPriceConstants.js';
import { Market, createMarketId } from '../../../domain/market/Market.js';
import { createRegionalMarketId } from '../../../domain/market/MarketConstants.js';
import { MarketPriceChanged } from '../../../domain/market/events/MarketPriceChanged.js';
import type { DomainEvent } from '../../../common/events/DomainEvent.js';
import { InMemoryBuildingRepository } from '../../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryBuildingStorageRepository } from '../../../infrastructure/persistence/InMemoryBuildingStorageRepository.js';
import { InMemoryMarketRepository } from '../../../infrastructure/persistence/InMemoryMarketRepository.js';
import { MarketSimulationSystem } from './MarketSimulationSystem.js';

const REGION_ID = 'region_default';

function requireMarketId(value: string) {
  const result = createMarketId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function createRegionalMarket(clock: ManualClock) {
  return Market.seedFromResources({
    id: requireMarketId(createRegionalMarketId(REGION_ID)),
    regionId: REGION_ID,
    resources: [
      {
        id: 'wood',
        basePrice: 100,
        enabled: true,
        marketEnabled: true,
      },
    ],
    clock,
  });
}

function createSystem(
  marketRepository: InMemoryMarketRepository,
  buildingRepository: InMemoryBuildingRepository,
  buildingStorageRepository: InMemoryBuildingStorageRepository,
  enqueueEvents: (domainEvents: readonly DomainEvent[]) => void,
) {
  return new MarketSimulationSystem({
    marketRepository,
    buildingRepository,
    buildingStorageRepository,
    enqueueEvents,
  });
}

describe('MarketSimulationSystem', () => {
  it('raises prices when regional supply is scarce', () => {
    const clock = new ManualClock(100);
    const marketRepository = new InMemoryMarketRepository();
    const buildingRepository = new InMemoryBuildingRepository();
    const buildingStorageRepository = new InMemoryBuildingStorageRepository();

    const marketResult = createRegionalMarket(clock);

    expect(marketResult.ok).toBe(true);

    if (!marketResult.ok) {
      return;
    }

    marketRepository.save(marketResult.value);

    const system = createSystem(
      marketRepository,
      buildingRepository,
      buildingStorageRepository,
      () => undefined,
    );

    system.execute({ tickNumber: MARKET_PRICE_UPDATE_INTERVAL_TICKS, clock });

    const market = marketRepository.findByRegionId(REGION_ID);
    expect(market?.getPrice('wood')?.lastPrice).toBe(400);
    expect(market?.getPrice('wood')?.demand).toBe(50);
  });

  it('skips price updates between configured intervals', () => {
    const clock = new ManualClock(100);
    const marketRepository = new InMemoryMarketRepository();
    const buildingRepository = new InMemoryBuildingRepository();
    const buildingStorageRepository = new InMemoryBuildingStorageRepository();

    const marketResult = createRegionalMarket(clock);

    expect(marketResult.ok).toBe(true);

    if (!marketResult.ok) {
      return;
    }

    marketRepository.save(marketResult.value);

    const system = createSystem(
      marketRepository,
      buildingRepository,
      buildingStorageRepository,
      () => undefined,
    );

    system.execute({ tickNumber: MARKET_PRICE_UPDATE_INTERVAL_TICKS - 1, clock });

    const market = marketRepository.findByRegionId(REGION_ID);
    expect(market?.getPrice('wood')?.lastPrice).toBe(100);
  });

  it('records price history when quotes change', () => {
    const clock = new ManualClock(100);
    const marketRepository = new InMemoryMarketRepository();
    const buildingRepository = new InMemoryBuildingRepository();
    const buildingStorageRepository = new InMemoryBuildingStorageRepository();
    const capturedEvents: MarketPriceChanged[] = [];

    const marketResult = createRegionalMarket(clock);

    expect(marketResult.ok).toBe(true);

    if (!marketResult.ok) {
      return;
    }

    marketRepository.save(marketResult.value);

    const system = createSystem(
      marketRepository,
      buildingRepository,
      buildingStorageRepository,
      (domainEvents) => {
        for (const event of domainEvents) {
          if (event instanceof MarketPriceChanged) {
            capturedEvents.push(event);
          }
        }
      },
    );

    system.execute({ tickNumber: MARKET_PRICE_UPDATE_INTERVAL_TICKS, clock });

    const market = marketRepository.findByRegionId(REGION_ID);

    expect(capturedEvents).toHaveLength(1);
    expect(capturedEvents[0]?.previousPrice).toBe(100);
    expect(capturedEvents[0]?.lastPrice).toBe(400);
    expect(market?.getPriceHistory().length).toBeGreaterThan(0);
  });
});
