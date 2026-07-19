/**
 * @module @infrastructure/persistence/savegame/FileSavegameStore
 *
 * Persists savegame snapshots as JSON files on disk.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { SavegameStore } from '../../../application/ports/SavegameStore.js';
import type { GameSaveSnapshotV1 } from '../../../application/persistence/GameSaveSnapshotV1.js';
import { PersistenceError, PersistenceErrorCode } from '../../../common/errors/PersistenceError.js';
import { Result } from '../../../common/result/Result.js';
import { GameStateSerializer } from './GameStateSerializer.js';

/**
 * Reads and writes JSON savegame files.
 */
export class FileSavegameStore implements SavegameStore {
  readonly #serializer = new GameStateSerializer();

  /**
   * Writes a snapshot to disk, creating parent directories when needed.
   */
  async save(
    filePath: string,
    snapshot: GameSaveSnapshotV1,
  ): Promise<Result<void, PersistenceError>> {
    try {
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
      return Result.ok(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown file write error.';
      return Result.fail(
        new PersistenceError({
          errorCode: PersistenceErrorCode.WRITE_FAILED,
          message: `Failed to write savegame file: ${message}`,
          ...(error instanceof Error ? { cause: error } : {}),
          context: { filePath },
        }),
      );
    }
  }

  /**
   * Reads and validates a snapshot from disk.
   */
  async load(filePath: string): Promise<Result<GameSaveSnapshotV1, PersistenceError>> {
    try {
      const contents = await readFile(filePath, 'utf8');
      const parsed: unknown = JSON.parse(contents);
      const parseResult = this.#serializer.parse(parsed);

      if (!parseResult.ok) {
        return Result.mapError(
          parseResult,
          (validationError) =>
            new PersistenceError({
              errorCode: PersistenceErrorCode.INVALID_SNAPSHOT,
              message: validationError.message,
              cause: validationError,
              context: { filePath },
            }),
        );
      }

      return parseResult;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown file read error.';
      return Result.fail(
        new PersistenceError({
          errorCode: PersistenceErrorCode.READ_FAILED,
          message: `Failed to read savegame file: ${message}`,
          ...(error instanceof Error ? { cause: error } : {}),
          context: { filePath },
        }),
      );
    }
  }
}
