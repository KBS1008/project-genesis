/**
 * @module @application/persistence/GameSaveSnapshotV3
 *
 * Version 3 savegame snapshot schema with company brain and regional market state.
 *
 * @see docs/schemas/GameSaveSnapshotV3.schema.md
 */

import type {
  GameSaveBuildingSnapshotV2,
  GameSaveMarketRegionMappingSnapshotV2,
  GameSaveTransportOrderSnapshotV2,
  GameSaveWorldSnapshotV2,
} from './GameSaveSnapshotV2.js';
import type {
  GameSaveBuildingStorageSnapshotV1,
  GameSaveCompanyMilestonesSnapshotV1,
  GameSaveCompanyResearchSnapshotV1,
  GameSaveCompanySnapshotV1,
  GameSaveEmployeeSnapshotV1,
  GameSaveFinanceAccountSnapshotV1,
  GameSaveInventorySnapshotV1,
  GameSaveProductionJobSnapshotV1,
  GameSaveResearchJobSnapshotV1,
  GameSaveSimulationSnapshotV1,
  GameSaveSupplyContractSnapshotV1,
  GameSaveTickMetricsHistorySnapshotV1,
} from './GameSaveSnapshotV1.js';

/** Supported savegame schema version. */
export const GAME_SAVE_SCHEMA_VERSION = 3 as const;

/** Active strategy runtime state for a company brain. */
export type GameSaveActiveStrategySnapshotV3 = {
  readonly strategyDefinitionId: string;
  readonly appliedAtTick: number;
};

/** Persisted company goal state. */
export type GameSaveGoalSnapshotV3 = {
  readonly id: string;
  readonly kind: string;
  readonly description: string;
  readonly priority: number;
  readonly status: string;
  readonly createdAtTick: number;
  readonly regionId?: string;
  readonly resourceId?: string;
  readonly buildingTypeId?: string;
  readonly technologyId?: string;
};

/** Persisted knowledge value. */
export type GameSaveKnowledgeValueSnapshotV3 =
  | { readonly kind: 'NUMBER'; readonly value: number }
  | { readonly kind: 'STRING'; readonly value: string }
  | { readonly kind: 'BOOLEAN'; readonly value: boolean };

/** Persisted company knowledge entry. */
export type GameSaveKnowledgeSnapshotV3 = {
  readonly id: string;
  readonly kind: string;
  readonly key: string;
  readonly observedAtTick: number;
  readonly value: GameSaveKnowledgeValueSnapshotV3;
  readonly regionId?: string;
  readonly resourceId?: string;
  readonly companyId?: string;
  readonly technologyId?: string;
};

/** Persisted company memory entry. */
export type GameSaveMemorySnapshotV3 = {
  readonly id: string;
  readonly kind: string;
  readonly observedAtTick: number;
  readonly payload: Readonly<Record<string, string | number | boolean>>;
  readonly expiresAtTick?: number;
  readonly regionId?: string;
  readonly resourceId?: string;
  readonly companyId?: string;
};

/** Persisted company decision payload. */
export type GameSaveCompanyDecisionPayloadSnapshotV3 =
  | {
      readonly type: 'PURCHASE_RESOURCE';
      readonly data: { readonly resourceId: string; readonly quantity: number; readonly regionId: string };
    }
  | {
      readonly type: 'SELL_RESOURCE';
      readonly data: { readonly resourceId: string; readonly quantity: number; readonly regionId: string };
    }
  | {
      readonly type: 'START_PRODUCTION';
      readonly data: {
        readonly jobId: string;
        readonly buildingId: string;
        readonly recipeId: string;
        readonly batches: number;
      };
    }
  | {
      readonly type: 'PLACE_BUILDING';
      readonly data: {
        readonly buildingId: string;
        readonly buildingTypeId: string;
        readonly name: string;
        readonly regionId: string;
        readonly mapX: number;
        readonly mapY: number;
      };
    }
  | {
      readonly type: 'START_RESEARCH';
      readonly data: { readonly jobId: string; readonly technologyId: string };
    }
  | {
      readonly type: 'EXPAND_REGION';
      readonly data: { readonly targetRegionId: string };
    };

/** Persisted queued company decision. */
export type GameSaveCompanyDecisionSnapshotV3 = {
  readonly id: string;
  readonly type: string;
  readonly status: string;
  readonly layer: string;
  readonly priority: number;
  readonly createdAtTick: number;
  readonly payload: GameSaveCompanyDecisionPayloadSnapshotV3;
};

/** Persisted company brain aggregate state. */
export type GameSaveCompanyBrainSnapshotV3 = {
  readonly brainId: string;
  readonly companyId: string;
  readonly createdAt: number;
  readonly activeStrategy?: GameSaveActiveStrategySnapshotV3;
  readonly goals: readonly GameSaveGoalSnapshotV3[];
  readonly knowledge: readonly GameSaveKnowledgeSnapshotV3[];
  readonly memory: readonly GameSaveMemorySnapshotV3[];
  readonly decisionQueue: readonly GameSaveCompanyDecisionSnapshotV3[];
};

/** Persisted regional market price line. */
export type GameSaveRegionalMarketPriceSnapshotV3 = {
  readonly resourceId: string;
  readonly basePrice: number;
  readonly lastPrice: number;
  readonly tradeVolume: number;
  readonly updatedAt: number;
  readonly supply: number;
  readonly demand: number;
  readonly liquidity: number;
};

/** Persisted regional market price history entry. */
export type GameSaveRegionalMarketPriceHistorySnapshotV3 = {
  readonly tick: number;
  readonly resourceId: string;
  readonly price: number;
  readonly tradeVolume: number;
  readonly supply: number;
  readonly demand: number;
  readonly liquidity: number;
};

/** Persisted regional market aggregate state. */
export type GameSaveRegionalMarketSnapshotV3 = {
  readonly id: string;
  readonly regionId: string;
  readonly createdAt: number;
  readonly prices: readonly GameSaveRegionalMarketPriceSnapshotV3[];
  readonly priceHistory: readonly GameSaveRegionalMarketPriceHistorySnapshotV3[];
};

/** Full deterministic game session snapshot (schema version 3). */
export type GameSaveSnapshotV3 = {
  readonly schemaVersion: typeof GAME_SAVE_SCHEMA_VERSION;
  readonly savedAtUtc: string;
  readonly world: GameSaveWorldSnapshotV2;
  readonly marketRegionMappings: readonly GameSaveMarketRegionMappingSnapshotV2[];
  readonly simulation: GameSaveSimulationSnapshotV1;
  readonly companies: readonly GameSaveCompanySnapshotV1[];
  readonly companyBrains: readonly GameSaveCompanyBrainSnapshotV3[];
  readonly regionalMarkets: readonly GameSaveRegionalMarketSnapshotV3[];
  readonly buildings: readonly GameSaveBuildingSnapshotV2[];
  readonly inventories: readonly GameSaveInventorySnapshotV1[];
  readonly financeAccounts: readonly GameSaveFinanceAccountSnapshotV1[];
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
