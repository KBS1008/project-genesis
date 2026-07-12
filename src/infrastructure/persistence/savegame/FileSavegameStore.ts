/**
 * @module @infrastructure/persistence/savegame/FileSavegameStore
 *
 * Persists savegame snapshots as JSON files on disk.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ValidationError } from '../../../common/errors/ValidationError.js';
import { Result } from '../../../common/result/Result.js';
import type { GameSaveSnapshotV1 } from './GameSaveSnapshotV1.js';
import { GameStateSerializer } from './GameStateSerializer.js';

/**
 * Reads and writes JSON savegame files.
 */
export class FileSavegameStore {
  readonly #serializer = new GameStateSerializer();

  /**
   * Writes a snapshot to disk, creating parent directories when needed.
   */
  async save(
    filePath: string,
    snapshot: GameSaveSnapshotV1,
  ): Promise<Result<void, ValidationError>> {
    try {
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
      return Result.ok(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown file write error.';
      return Result.fail(new ValidationError(`Failed to write savegame file: ${message}`));
    }
  }

  /**
   * Reads and validates a snapshot from disk.
   */
  async load(filePath: string): Promise<Result<GameSaveSnapshotV1, ValidationError>> {
    try {
      const contents = await readFile(filePath, 'utf8');
      const parsed: unknown = JSON.parse(contents);
      return this.#serializer.parse(parsed);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown file read error.';
      return Result.fail(new ValidationError(`Failed to read savegame file: ${message}`));
    }
  }
}
