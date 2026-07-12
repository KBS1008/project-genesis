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
export { FileSavegameStore } from './savegame/FileSavegameStore.js';
export { GameStateSerializer } from './savegame/GameStateSerializer.js';
export type { GameSaveSnapshotV1 } from './savegame/GameSaveSnapshotV1.js';
export { GAME_SAVE_SCHEMA_VERSION } from './savegame/GameSaveSnapshotV1.js';
