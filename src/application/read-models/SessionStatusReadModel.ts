/**
 * @module @application/read-models/SessionStatusReadModel
 *
 * Read-side projection of the active browser session.
 */

/** Immutable session status returned by queries. */
export type SessionStatusReadModel = {
  readonly hasActiveSession: boolean;
  readonly companyId: string | null;
  readonly companyName: string | null;
  readonly playerId: string | null;
  readonly savePath: string;
};
