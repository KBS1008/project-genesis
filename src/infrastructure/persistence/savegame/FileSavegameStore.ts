/**
 * @module @infrastructure/persistence/savegame/FileSavegameStore
 *
 * Persists savegame snapshots as JSON files on disk.
 */

import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { SavegameStore } from '../../../application/ports/SavegameStore.js';
import type { GameSaveSnapshotV3 } from '../../../application/persistence/GameSaveSnapshotV3.js';
import type { SaveMetadataReadModel } from '../../../application/read-models/SaveMetadataReadModel.js';
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
    snapshot: GameSaveSnapshotV3,
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
  async load(filePath: string): Promise<Result<GameSaveSnapshotV3, PersistenceError>> {
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

  /** Lists savegame metadata for JSON files in a directory. */
  async listMetadata(
    directory: string,
  ): Promise<Result<readonly SaveMetadataReadModel[], PersistenceError>> {
    try {
      const entries = await readdir(directory, { withFileTypes: true });
      const metadata: SaveMetadataReadModel[] = [];

      for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith('.json')) {
          continue;
        }

        const filePath = path.join(directory, entry.name);
        const fileStat = await stat(filePath);
        const contents = await readFile(filePath, 'utf8');
        const extracted = extractSaveMetadata(filePath, entry.name, contents, fileStat.mtimeMs);

        if (extracted !== null) {
          metadata.push(extracted);
        }
      }

      metadata.sort((left, right) => (right.modifiedAt ?? 0) - (left.modifiedAt ?? 0));
      return Result.ok(Object.freeze(metadata));
    } catch (error) {
      if (isMissingDirectoryError(error)) {
        return Result.ok(Object.freeze([]));
      }

      const message = error instanceof Error ? error.message : 'Unknown directory read error.';
      return Result.fail(
        new PersistenceError({
          errorCode: PersistenceErrorCode.READ_FAILED,
          message: `Failed to list savegames: ${message}`,
          ...(error instanceof Error ? { cause: error } : {}),
          context: { directory },
        }),
      );
    }
  }
}

function isMissingDirectoryError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'ENOENT'
  );
}

function extractSaveMetadata(
  filePath: string,
  fileName: string,
  contents: string,
  modifiedAt: number,
): SaveMetadataReadModel | null {
  try {
    const parsed = JSON.parse(contents) as {
      schemaVersion?: number;
      simulation?: { tickNumber?: number };
      companies?: readonly { name?: string }[];
    };

    return Object.freeze({
      filePath,
      fileName,
      schemaVersion:
        typeof parsed.schemaVersion === 'number' ? parsed.schemaVersion : null,
      tickNumber:
        typeof parsed.simulation?.tickNumber === 'number'
          ? parsed.simulation.tickNumber
          : null,
      companyName:
        typeof parsed.companies?.[0]?.name === 'string' ? parsed.companies[0].name : null,
      modifiedAt,
    });
  } catch {
    return Object.freeze({
      filePath,
      fileName,
      schemaVersion: null,
      tickNumber: null,
      companyName: null,
      modifiedAt,
    });
  }
}
