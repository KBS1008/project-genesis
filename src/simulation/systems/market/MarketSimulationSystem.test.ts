import { ManualClock } from '../../../common/time/ManualClock.js';
import { createCompanyId } from '../../../domain/company/Company.js';
import { createInventoryId, Inventory } from '../../../domain/inventory/Inventory.js';
import { MARKET_PRICE_UPDATE_INTERVAL_TICKS } from '../../../domain/market/MarketPriceConstants.js';
import { Market, createMarketId } from '../../../domain/market/Market.js';
import { GLOBAL_MARKET_ID } from '../../../domain/market/MarketConstants.js';
import { MarketPriceChanged } from '../../../domain/market/events/MarketPriceChanged.js';
import { InMemoryInventoryRepository } from '../../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryMarketRepository } from '../../../infrastructure/persistence/InMemoryMarketRepository.js';
import { MarketSimulationSystem } from './MarketSimulationSystem.js';

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

describe('MarketSimulationSystem', () => {
  it('lowers prices when aggregate supply exceeds baseline demand', () => {
    const clock = new ManualClock(100);
    const marketRepository = new InMemoryMarketRepository();
    const inventoryRepository = new InMemoryInventoryRepository();
    const events: string[] = [];

    const marketResult = Market.seedFromResources({
      id: requireMarketId(GLOBAL_MARKET_ID),
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

    expect(marketResult.ok).toBe(true);

    if (!marketResult.ok) {
      return;
    }

    marketRepository.save(marketResult.value);

    const inventoryResult = Inventory.create({
      id: requireInventoryId('inventory_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(inventoryResult.ok).toBe(true);

    if (!inventoryResult.ok) {
      return;
    }

    const inventory = inventoryResult.value;
    inventory.addQuantity('wood', 100, clock);
    inventory.pullDomainEvents();
    inventoryRepository.save(inventory);

    const system = new MarketSimulationSystem({
      marketRepository,
      inventoryRepository,
      enqueueEvents: (domainEvents) => {
        events.push(...domainEvents.map((event) => event.eventName));
      },
    });

    system.execute({ tickNumber: MARKET_PRICE_UPDATE_INTERVAL_TICKS, clock });

    const market = marketRepository.findById(requireMarketId(GLOBAL_MARKET_ID));
    expect(market?.getPrice('wood')?.lastPrice).toBe(96);
    expect(events).toContain('MarketPriceChanged');
  });

  it('raises prices when aggregate supply is scarce', () => {
    const clock = new ManualClock(100);
    const marketRepository = new InMemoryMarketRepository();
    const inventoryRepository = new InMemoryInventoryRepository();

    const marketResult = Market.seedFromResources({
      id: requireMarketId(GLOBAL_MARKET_ID),
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

    expect(marketResult.ok).toBe(true);

    if (!marketResult.ok) {
      return;
    }

    marketRepository.save(marketResult.value);

    const inventoryResult = Inventory.create({
      id: requireInventoryId('inventory_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(inventoryResult.ok).toBe(true);

    if (!inventoryResult.ok) {
      return;
    }

    const inventory = inventoryResult.value;
    inventory.addQuantity('wood', 25, clock);
    inventory.pullDomainEvents();
    inventoryRepository.save(inventory);

    const system = new MarketSimulationSystem({
      marketRepository,
      inventoryRepository,
      enqueueEvents: () => undefined,
    });

    system.execute({ tickNumber: MARKET_PRICE_UPDATE_INTERVAL_TICKS, clock });

    const market = marketRepository.findById(requireMarketId(GLOBAL_MARKET_ID));
    expect(market?.getPrice('wood')?.lastPrice).toBe(108);
  });

  it('skips price updates between configured intervals', () => {
    const clock = new ManualClock(100);
    const marketRepository = new InMemoryMarketRepository();
    const inventoryRepository = new InMemoryInventoryRepository();

    const marketResult = Market.seedFromResources({
      id: requireMarketId(GLOBAL_MARKET_ID),
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

    expect(marketResult.ok).toBe(true);

    if (!marketResult.ok) {
      return;
    }

    marketRepository.save(marketResult.value);

    const system = new MarketSimulationSystem({
      marketRepository,
      inventoryRepository,
      enqueueEvents: () => undefined,
    });

    system.execute({ tickNumber: MARKET_PRICE_UPDATE_INTERVAL_TICKS - 1, clock });

    const market = marketRepository.findById(requireMarketId(GLOBAL_MARKET_ID));
    expect(market?.getPrice('wood')?.lastPrice).toBe(100);
  });

  it('emits MarketPriceChanged with the adjusted quote', () => {
    const clock = new ManualClock(100);
    const marketRepository = new InMemoryMarketRepository();
    const inventoryRepository = new InMemoryInventoryRepository();
    const capturedEvents: MarketPriceChanged[] = [];

    const marketResult = Market.seedFromResources({
      id: requireMarketId(GLOBAL_MARKET_ID),
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

    expect(marketResult.ok).toBe(true);

    if (!marketResult.ok) {
      return;
    }

    marketRepository.save(marketResult.value);

    const inventoryResult = Inventory.create({
      id: requireInventoryId('inventory_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(inventoryResult.ok).toBe(true);

    if (!inventoryResult.ok) {
      return;
    }

    const inventory = inventoryResult.value;
    inventory.addQuantity('wood', 100, clock);
    inventory.pullDomainEvents();
    inventoryRepository.save(inventory);

    const system = new MarketSimulationSystem({
      marketRepository,
      inventoryRepository,
      enqueueEvents: (domainEvents) => {
        for (const event of domainEvents) {
          if (event instanceof MarketPriceChanged) {
            capturedEvents.push(event);
          }
        }
      },
    });

    system.execute({ tickNumber: MARKET_PRICE_UPDATE_INTERVAL_TICKS, clock });

    expect(capturedEvents).toHaveLength(1);
    expect(capturedEvents[0]?.previousPrice).toBe(100);
    expect(capturedEvents[0]?.lastPrice).toBe(96);
  });
});
