/**
 * @module @application/services/TickHistoryService
 *
 * In-memory ring buffer of per-tick dashboard metrics for chart history.
 */

import type {
  TickHistoryQuery,
  TickMetricsSnapshot,
} from '../read-models/TickMetricsSnapshot.js';

const DEFAULT_MAX_POINTS = 500;
const DEFAULT_QUERY_LIMIT = 200;

/**
 * Stores tick metrics for the active browser session.
 */
export class TickHistoryService {
  readonly #maxPoints: number;
  #companyId: string | undefined;
  #points: TickMetricsSnapshot[] = [];

  constructor(maxPoints = DEFAULT_MAX_POINTS) {
    this.#maxPoints = maxPoints;
  }

  /** Clears stored history, optionally binding to a company. */
  clear(companyId?: string): void {
    this.#points = [];
    this.#companyId = companyId;
  }

  /** Appends or replaces a snapshot for the current tick. */
  record(snapshot: TickMetricsSnapshot, companyId: string): void {
    if (this.#companyId !== companyId) {
      this.clear(companyId);
    }

    const lastPoint = this.#points.at(-1);

    if (lastPoint?.tickNumber === snapshot.tickNumber) {
      this.#points[this.#points.length - 1] = snapshot;
      return;
    }

    this.#points.push(snapshot);

    if (this.#points.length > this.#maxPoints) {
      this.#points.shift();
    }
  }

  /** Returns filtered tick history for chart queries. */
  getHistory(query: TickHistoryQuery = {}): readonly TickMetricsSnapshot[] {
    let filtered = this.#points;

    if (query.fromTick !== undefined) {
      filtered = filtered.filter((point) => point.tickNumber >= query.fromTick!);
    }

    if (query.toTick !== undefined) {
      filtered = filtered.filter((point) => point.tickNumber <= query.toTick!);
    }

    const limit = query.limit ?? DEFAULT_QUERY_LIMIT;

    if (filtered.length > limit) {
      filtered = filtered.slice(filtered.length - limit);
    }

    return Object.freeze([...filtered]);
  }
}
