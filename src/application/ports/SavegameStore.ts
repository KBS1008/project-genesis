/**
 * @module @application/ports/SavegameStore
 *
 * Application port for savegame persistence.
 *
 * @see docs/architecture/DEPENDENCY_RULES.md
 */

import type { PersistenceError } from '../../common/errors/PersistenceError.js';
import type { Result } from '../../common/result/Result.js';
import type { GameSaveSnapshotV1 } from '../persistence/GameSaveSnapshotV1.js';

/** Reads and writes versioned savegame snapshots. */
export interface SavegameStore {
  save(filePath: string, snapshot: GameSaveSnapshotV1): Promise<Result<void, PersistenceError>>;
  load(filePath: string): Promise<Result<GameSaveSnapshotV1, PersistenceError>>;
}
