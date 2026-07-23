/**
 * @module @application/ports/SavegameStore
 *
 * Application port for savegame persistence.
 *
 * @see docs/architecture/DEPENDENCY_RULES.md
 */

import type { PersistenceError } from '../../common/errors/PersistenceError.js';
import type { Result } from '../../common/result/Result.js';
import type { GameSaveSnapshotV3 } from '../persistence/GameSaveSnapshotV3.js';
import type { SaveMetadataReadModel } from '../read-models/SaveMetadataReadModel.js';

/** Reads and writes versioned savegame snapshots. */
export interface SavegameStore {
  save(filePath: string, snapshot: GameSaveSnapshotV3): Promise<Result<void, PersistenceError>>;
  load(filePath: string): Promise<Result<GameSaveSnapshotV3, PersistenceError>>;
  listMetadata(
    directory: string,
  ): Promise<Result<readonly SaveMetadataReadModel[], PersistenceError>>;
}
