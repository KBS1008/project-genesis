/**
 * @module @application/ports/TickHistorySnapshotProvider
 *
 * Read/write access to tick metrics history for savegame persistence.
 */

import type { TickMetricsSnapshot } from '../read-models/TickMetricsSnapshot.js';

/** Tick history state required by savegame serialization. */
export interface TickHistorySnapshotProvider {
  getCompanyId(): string | undefined;
  exportForSave(): readonly TickMetricsSnapshot[];
  replaceHistory(companyId: string, points: readonly TickMetricsSnapshot[]): void;
  clear(): void;
}
