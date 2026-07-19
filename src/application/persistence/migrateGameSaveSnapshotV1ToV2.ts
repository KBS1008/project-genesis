/**
 * @module @application/persistence/migrateGameSaveSnapshotV1ToV2
 *
 * Central v1→v2 savegame migration boundary.
 */

import { GLOBAL_MARKET_ID } from '../../domain/market/MarketConstants.js';
import { DEFAULT_REGION_ID, DEFAULT_WORLD_ID } from '../../domain/world/WorldConstants.js';
import type { GameSaveSnapshotV1 } from './GameSaveSnapshotV1.js';
import { GAME_SAVE_SCHEMA_VERSION, type GameSaveSnapshotV2 } from './GameSaveSnapshotV2.js';

/**
 * Upgrades a parsed v1 snapshot to the current v2 schema.
 */
export function migrateGameSaveSnapshotV1ToV2(v1: GameSaveSnapshotV1): GameSaveSnapshotV2 {
  const buildingRegionById = new Map(
    v1.buildings.map((building) => [building.id, building.regionId ?? DEFAULT_REGION_ID]),
  );

  const buildings = v1.buildings.map((building) =>
    Object.freeze({
      ...building,
      regionId: building.regionId ?? DEFAULT_REGION_ID,
    }),
  );

  const transportOrders = v1.transportOrders.map((order) =>
    Object.freeze({
      ...order,
      sourceRegionId:
        order.sourceRegionId ?? buildingRegionById.get(order.sourceBuildingId) ?? DEFAULT_REGION_ID,
      destinationRegionId:
        order.destinationRegionId ??
        buildingRegionById.get(order.destinationBuildingId) ??
        DEFAULT_REGION_ID,
    }),
  );

  const hasGlobalMarket = v1.markets.some((market) => market.id === GLOBAL_MARKET_ID);
  const marketRegionMappings = hasGlobalMarket
    ? Object.freeze([
        Object.freeze({
          marketId: GLOBAL_MARKET_ID,
          regionId: DEFAULT_REGION_ID,
        }),
      ])
    : Object.freeze([]);

  return Object.freeze({
    ...v1,
    schemaVersion: GAME_SAVE_SCHEMA_VERSION,
    world: Object.freeze({
      activeWorldId: DEFAULT_WORLD_ID,
    }),
    marketRegionMappings,
    buildings: Object.freeze(buildings),
    transportOrders: Object.freeze(transportOrders),
  });
}
