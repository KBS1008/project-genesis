/**
 * @module @application/read-models/SaveMetadataReadModel
 *
 * Read-side metadata for persisted savegame files.
 */

/** Immutable save slot metadata returned by queries. */
export type SaveMetadataReadModel = {
  readonly filePath: string;
  readonly fileName: string;
  readonly schemaVersion: number | null;
  readonly tickNumber: number | null;
  readonly companyName: string | null;
  readonly modifiedAt: number | null;
};
