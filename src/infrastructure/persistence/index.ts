/**
 * @module @infrastructure/persistence
 *
 * In-memory repository implementations.
 */

export { InMemoryBuildingRepository } from './InMemoryBuildingRepository.js';
export { InMemoryCompanyRepository } from './InMemoryCompanyRepository.js';
export { InMemoryInventoryRepository } from './InMemoryInventoryRepository.js';
export { InMemoryProductionJobRepository } from './InMemoryProductionJobRepository.js';
export { InMemoryResearchJobRepository } from './InMemoryResearchJobRepository.js';
export { InMemoryFinanceRepository } from './InMemoryFinanceRepository.js';
export { InMemoryMarketRepository } from './InMemoryMarketRepository.js';
export { InMemoryCompanyResearchRepository } from './InMemoryCompanyResearchRepository.js';
export { InMemoryCompanyMilestonesRepository } from './InMemoryCompanyMilestonesRepository.js';
export { InMemoryEmployeeRepository } from './InMemoryEmployeeRepository.js';
export { FileSavegameStore } from './savegame/FileSavegameStore.js';
export { GameStateSerializer } from './savegame/GameStateSerializer.js';
export type { GameSaveSnapshotV1 } from './savegame/GameSaveSnapshotV1.js';
export { GAME_SAVE_SCHEMA_VERSION as GAME_SAVE_SCHEMA_VERSION_V1 } from './savegame/GameSaveSnapshotV1.js';
export type { GameSaveSnapshotV2 } from './savegame/GameSaveSnapshotV2.js';
export { GAME_SAVE_SCHEMA_VERSION as GAME_SAVE_SCHEMA_VERSION_V2 } from './savegame/GameSaveSnapshotV2.js';
export type { GameSaveSnapshotV3 } from './savegame/GameSaveSnapshotV3.js';
export { GAME_SAVE_SCHEMA_VERSION } from './savegame/GameSaveSnapshotV3.js';
