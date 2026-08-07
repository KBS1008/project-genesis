/**
 * @module @application/read-models/EventLogEntryReadModel
 *
 * Read-side projection of player-visible simulation events.
 */

/** Authoritative gameplay entity types referenced by event log entries. */
export type EventLogEntityType =
  | 'building'
  | 'production'
  | 'research'
  | 'transport'
  | 'resource'
  | 'employee'
  | 'event'
  | 'none';

/** Immutable event log entry returned by queries. */
export type EventLogEntryReadModel = {
  readonly id: string;
  readonly tickNumber: number;
  readonly occurredAt: number;
  readonly category: string;
  readonly message: string;
  readonly severity: 'INFO' | 'WARNING' | 'ERROR';
  readonly entityId?: string;
  readonly entityType?: EventLogEntityType;
};
