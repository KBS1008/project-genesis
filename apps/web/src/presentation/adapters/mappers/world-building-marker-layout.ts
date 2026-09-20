import type { WorldMapRegionCellViewData } from '@/presentation/adapters/view-data/world-view-data';

/** Normalized slots within a region cell (u,v) — lower band avoids title/biome labels. */
const REGION_MARKER_SLOTS = Object.freeze([
  Object.freeze({ u: 0.2, v: 0.58 }),
  Object.freeze({ u: 0.38, v: 0.82 }),
  Object.freeze({ u: 0.5, v: 0.7 }),
  Object.freeze({ u: 0.62, v: 0.82 }),
  Object.freeze({ u: 0.8, v: 0.58 }),
  Object.freeze({ u: 0.28, v: 0.68 }),
  Object.freeze({ u: 0.72, v: 0.68 }),
  Object.freeze({ u: 0.44, v: 0.52 }),
  Object.freeze({ u: 0.56, v: 0.52 }),
] as const);

/**
 * Deterministic building marker positions inside the region footprint (presentation-only).
 * Keeps geography fixed; separates industrial cluster from centered region labels.
 */
export function distributeMarkerPosition(
  region: WorldMapRegionCellViewData,
  index: number,
  cellSize: number,
): { readonly x: number; readonly y: number } {
  const innerLeft = region.mapX * cellSize + 4;
  const innerTop = region.mapY * cellSize + 4;
  const innerSize = cellSize - 8;
  const slot = REGION_MARKER_SLOTS[index % REGION_MARKER_SLOTS.length]!;

  return Object.freeze({
    x: innerLeft + slot.u * innerSize,
    y: innerTop + slot.v * innerSize,
  });
}
