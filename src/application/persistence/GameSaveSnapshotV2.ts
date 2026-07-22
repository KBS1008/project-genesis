/**
 * @module @application/persistence/GameSaveSnapshotV2
 *
 * Version 2 savegame snapshot schema with world and region ownership metadata.
 *
 * **Frozen contract:** docs/schemas/GameSaveSnapshotV2.schema.md (commit 03dc747).
 * `markets[]` uses the V1 global market shape. Regional market economics and price history are V3-only.
 *
 * @see docs/decisions/DD-033-Savegame-and-Persistence-Strategy.md
 */

import type {
  GameSaveBuildingSnapshotV1,
  GameSaveCompanyMilestonesSnapshotV1,
  GameSaveCompanyResearchSnapshotV1,
  GameSaveCompanySnapshotV1,
  GameSaveEmployeeSnapshotV1,
  GameSaveFinanceAccountSnapshotV1,
  GameSaveInventorySnapshotV1,
  GameSaveMarketSnapshotV1,
  GameSaveProductionJobSnapshotV1,
  GameSaveResearchJobSnapshotV1,
  GameSaveSimulationSnapshotV1,
  GameSaveSupplyContractSnapshotV1,
  GameSaveTickMetricsHistorySnapshotV1,
  GameSaveTransportOrderSnapshotV1,
  GameSaveBuildingStorageSnapshotV1,
} from './GameSaveSnapshotV1.js';

/** Supported savegame schema version. */
export const GAME_SAVE_SCHEMA_VERSION = 2 as const;

/** World metadata captured at save time. */
export type GameSaveWorldSnapshotV2 = {
  readonly activeWorldId: string;
};

/** Maps a market aggregate to its owning region. */
export type GameSaveMarketRegionMappingSnapshotV2 = {
  readonly marketId: string;
  readonly regionId: string;
};

/** Persisted building aggregate state with required region ownership. */
export type GameSaveBuildingSnapshotV2 = Omit<GameSaveBuildingSnapshotV1, 'regionId'> & {
  readonly regionId: string;
};

/** Persisted transport order state with required region endpoints. */
export type GameSaveTransportOrderSnapshotV2 = Omit<
  GameSaveTransportOrderSnapshotV1,
  'sourceRegionId' | 'destinationRegionId'
> & {
  readonly sourceRegionId: string;
  readonly destinationRegionId: string;
};

/** Full deterministic game session snapshot. */
export type GameSaveSnapshotV2 = {
  readonly schemaVersion: typeof GAME_SAVE_SCHEMA_VERSION;
  readonly savedAtUtc: string;
  readonly world: GameSaveWorldSnapshotV2;
  readonly marketRegionMappings: readonly GameSaveMarketRegionMappingSnapshotV2[];
  readonly simulation: GameSaveSimulationSnapshotV1;
  readonly companies: readonly GameSaveCompanySnapshotV1[];
  readonly buildings: readonly GameSaveBuildingSnapshotV2[];
  readonly inventories: readonly GameSaveInventorySnapshotV1[];
  readonly financeAccounts: readonly GameSaveFinanceAccountSnapshotV1[];
  readonly markets: readonly GameSaveMarketSnapshotV1[];
  readonly productionJobs: readonly GameSaveProductionJobSnapshotV1[];
  readonly researchJobs: readonly GameSaveResearchJobSnapshotV1[];
  readonly companyResearch: readonly GameSaveCompanyResearchSnapshotV1[];
  readonly companyMilestones: readonly GameSaveCompanyMilestonesSnapshotV1[];
  readonly buildingStorages: readonly GameSaveBuildingStorageSnapshotV1[];
  readonly transportOrders: readonly GameSaveTransportOrderSnapshotV2[];
  readonly employees: readonly GameSaveEmployeeSnapshotV1[];
  readonly supplyContracts?: readonly GameSaveSupplyContractSnapshotV1[];
  readonly tickMetricsHistory?: GameSaveTickMetricsHistorySnapshotV1;
};
