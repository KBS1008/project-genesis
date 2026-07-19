/**
 * @module @domain/region/RegionProcessingOrder
 *
 * Deterministic ordering helpers for region-scoped simulation processing.
 */

import type { RegionId } from './RegionId.js';

/** Compares two region ids in stable lexicographic order. */
export function compareRegionIds(left: RegionId, right: RegionId): number {
  return left.value.localeCompare(right.value);
}

/** Returns region ids sorted in deterministic order. */
export function sortRegionIds(regionIds: readonly RegionId[]): readonly RegionId[] {
  return Object.freeze([...regionIds].sort(compareRegionIds));
}
