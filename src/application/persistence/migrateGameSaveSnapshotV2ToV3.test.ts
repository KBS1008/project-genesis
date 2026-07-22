import { GLOBAL_MARKET_ID } from '../../domain/market/MarketConstants.js';
import { DEFAULT_REGION_ID } from '../../domain/world/WorldConstants.js';
import type { GameSaveSnapshotV2 } from './GameSaveSnapshotV2.js';
import { migrateGameSaveSnapshotV2ToV3 } from './migrateGameSaveSnapshotV2ToV3.js';
import { GAME_SAVE_SCHEMA_VERSION } from './GameSaveSnapshotV3.js';

describe('migrateGameSaveSnapshotV2ToV3', () => {
  it('promotes transitional market rows into regionalMarkets and drops markets', () => {
    const v2 = {
      schemaVersion: 2 as const,
      savedAtUtc: '2026-07-22T12:00:00.000Z',
      world: { activeWorldId: 'world_default' },
      marketRegionMappings: [{ marketId: GLOBAL_MARKET_ID, regionId: DEFAULT_REGION_ID }],
      simulation: { clockTime: 0, tickNumber: 0, paused: false, tickDuration: 1 },
      companies: [],
      buildings: [],
      inventories: [],
      financeAccounts: [],
      markets: [
        {
          id: GLOBAL_MARKET_ID,
          createdAt: 0,
          regionId: DEFAULT_REGION_ID,
          prices: [
            {
              resourceId: 'wood',
              basePrice: 10,
              lastPrice: 12,
              tradeVolume: 5,
              updatedAt: 3,
              supply: 100,
              demand: 50,
              liquidity: 1.2,
            },
          ],
          priceHistory: [
            {
              tick: 1,
              resourceId: 'wood',
              price: 11,
              tradeVolume: 2,
              supply: 90,
              demand: 45,
              liquidity: 1.1,
            },
          ],
        },
      ],
      productionJobs: [],
      researchJobs: [],
      companyResearch: [],
      companyMilestones: [],
      buildingStorages: [],
      transportOrders: [],
      employees: [],
    } as unknown as GameSaveSnapshotV2 & {
      markets: Array<
        GameSaveSnapshotV2['markets'][number] & {
          regionId?: string;
          priceHistory?: unknown[];
          prices: Array<
            GameSaveSnapshotV2['markets'][number]['prices'][number] & {
              supply?: number;
              demand?: number;
              liquidity?: number;
            }
          >;
        }
      >;
    };

    const v3 = migrateGameSaveSnapshotV2ToV3(v2);

    expect(v3.schemaVersion).toBe(GAME_SAVE_SCHEMA_VERSION);
    expect(v3.companyBrains).toEqual([]);
    expect(v3).not.toHaveProperty('markets');
    expect(v3.regionalMarkets).toHaveLength(1);
    expect(v3.regionalMarkets[0]?.regionId).toBe(DEFAULT_REGION_ID);
    expect(v3.regionalMarkets[0]?.prices[0]?.supply).toBe(100);
    expect(v3.regionalMarkets[0]?.priceHistory).toHaveLength(1);
  });
});
