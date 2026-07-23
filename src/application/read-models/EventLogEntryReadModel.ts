/**
 * @module @application/read-models/EventLogEntryReadModel
 *
 * Read-side projection of player-visible simulation events.
 */

/** Immutable event log entry returned by queries. */
export type EventLogEntryReadModel = {
  readonly id: string;
  readonly tickNumber: number;
  readonly occurredAt: number;
  readonly category: string;
  readonly message: string;
  readonly severity: 'INFO' | 'WARNING' | 'ERROR';
};
