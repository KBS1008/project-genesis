/**
 * @module @application/services/PlayerEventLogService
 *
 * Bounded in-memory player-visible event log for the active browser session.
 */

import type { EventLogEntryReadModel } from '../read-models/EventLogEntryReadModel.js';

const DEFAULT_MAX_ENTRIES = 200;
const DEFAULT_QUERY_LIMIT = 50;

export type AppendPlayerEventInput = {
  readonly companyId: string;
  readonly tickNumber: number;
  readonly occurredAt: number;
  readonly category: string;
  readonly message: string;
  readonly severity?: EventLogEntryReadModel['severity'];
};

export type PlayerEventLogQuery = {
  readonly companyId?: string;
  readonly limit?: number;
  readonly category?: string;
};

/** Stores player-visible simulation and command events for UI reporting. */
export class PlayerEventLogService {
  readonly #maxEntries: number;
  #companyId: string | undefined;
  #sequence = 0;
  #entries: EventLogEntryReadModel[] = [];

  constructor(maxEntries = DEFAULT_MAX_ENTRIES) {
    this.#maxEntries = maxEntries;
  }

  /** Clears stored entries, optionally binding to a company. */
  clear(companyId?: string): void {
    this.#entries = [];
    this.#sequence = 0;
    this.#companyId = companyId;
  }

  /** Appends an event and returns its stable identifier. */
  append(input: AppendPlayerEventInput): string {
    if (this.#companyId !== input.companyId) {
      this.clear(input.companyId);
    }

    this.#sequence += 1;
    const id = `event_${String(this.#sequence).padStart(4, '0')}`;
    const entry = Object.freeze({
      id,
      tickNumber: input.tickNumber,
      occurredAt: input.occurredAt,
      category: input.category,
      message: input.message,
      severity: input.severity ?? 'INFO',
    } satisfies EventLogEntryReadModel);

    this.#entries.push(entry);

    if (this.#entries.length > this.#maxEntries) {
      this.#entries.shift();
    }

    return id;
  }

  /** Returns filtered events newest-first. */
  getEntries(query: PlayerEventLogQuery = {}): readonly EventLogEntryReadModel[] {
    if (this.#companyId === undefined) {
      return Object.freeze([]);
    }

    if (query.companyId !== undefined && query.companyId !== this.#companyId) {
      return Object.freeze([]);
    }

    let filtered = this.#entries;

    if (query.category !== undefined && query.category.length > 0) {
      filtered = filtered.filter((entry) => entry.category === query.category);
    }

    const limit = query.limit ?? DEFAULT_QUERY_LIMIT;
    const newestFirst = [...filtered].reverse();

    if (newestFirst.length <= limit) {
      return Object.freeze(newestFirst);
    }

    return Object.freeze(newestFirst.slice(0, limit));
  }

  /** Returns the company currently bound to this log buffer. */
  getCompanyId(): string | undefined {
    return this.#companyId;
  }

  /** Returns the most recently appended event id, if any. */
  getLatestEntryId(): string | undefined {
    return this.#entries.at(-1)?.id;
  }
}
