import { ManualClock } from '../../common/time/ManualClock.js';
import { ResourceTypeDefinition } from '../../content/resource/ResourceTypeDefinition.js';
import { ResourceTypeRegistry } from '../../content/resource/ResourceTypeRegistry.js';
import { Market, createMarketId } from './Market.js';
import { GLOBAL_MARKET_ID } from './MarketConstants.js';
import { MarketPriceChanged } from './events/MarketPriceChanged.js';

function createRegistry(resources: ResourceTypeDefinition[]) {
  const registry = new ResourceTypeRegistry();

  for (const resource of resources) {
    const result = registry.register(resource);

    if (!result.ok) {
      throw new Error(result.error.message);
    }
  }

  return registry;
}

function createResource(overrides: Partial<ConstructorParameters<typeof ResourceTypeDefinition>[0]> = {}) {
  return new ResourceTypeDefinition({
    id: 'wood',
    name: 'Holz',
    description: 'Rohholz',
    category: 'PRIMARY_RESOURCE',
    tier: 1,
    state: 'SOLID',
    weight: 5,
    volume: 6,
    basePrice: 25,
    marketEnabled: true,
    tradable: true,
    stackSize: 999999,
    storageType: 'WAREHOUSE',
    transportType: 'TRUCK',
    qualityEnabled: false,
    decayEnabled: false,
    hazardous: false,
    flammable: true,
    recyclable: true,
    energyValue: 0,
    requiredResearch: [],
    tags: ['wood'],
    enabled: true,
    version: 1,
    ...overrides,
  });
}

function requireMarketId(value: string) {
  const result = createMarketId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('Market', () => {
  it('seeds prices from enabled market resources', () => {
    const clock = new ManualClock(100);
    const registry = createRegistry([
      createResource(),
      createResource({
        id: 'iron_ore',
        name: 'Eisenerz',
        basePrice: 40,
        tags: ['ore'],
      }),
      createResource({
        id: 'hidden_resource',
        marketEnabled: false,
      }),
    ]);

    const result = Market.seedFromResources({
      id: requireMarketId(GLOBAL_MARKET_ID),
      resources: registry.getAll().map((resource) => ({
        id: resource.id,
        basePrice: resource.basePrice,
        enabled: resource.enabled,
        marketEnabled: resource.marketEnabled,
      })),
      clock,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      const prices = result.value.getPrices();
      expect(prices).toHaveLength(2);
      expect(prices[0]?.resourceId.value).toBe('iron_ore');
      expect(prices[0]?.lastPrice).toBe(40);
      expect(prices[1]?.resourceId.value).toBe('wood');
      expect(prices[1]?.basePrice).toBe(25);
    }
  });

  it('updates last price and emits MarketPriceChanged', () => {
    const clock = new ManualClock(100);
    const marketResult = Market.seedFromResources({
      id: requireMarketId(GLOBAL_MARKET_ID),
      resources: [
        {
          id: 'wood',
          basePrice: 25,
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

    const market = marketResult.value;
    market.pullDomainEvents();

    const updateResult = market.updateLastPrice('wood', 30, 5, clock);

    expect(updateResult.ok).toBe(true);
    expect(market.getPrice('wood')?.lastPrice).toBe(30);
    expect(market.getPrice('wood')?.tradeVolume).toBe(5);

    const events = market.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect((events[0] as MarketPriceChanged).lastPrice).toBe(30);
  });
});
