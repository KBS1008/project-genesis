import type { WorldBounds } from '@/presentation/hooks/world-camera-math';
import type { WorldMapRegionCellViewData } from '@/presentation/adapters/view-data/world-view-data';

/** Presentation-only grid bounds for a single region (authoritative mapX/mapY unchanged). */
export function resolveRegionGridWorldBounds(
  region: Pick<WorldMapRegionCellViewData, 'mapX' | 'mapY'>,
  cellSize: number,
  padding = 12,
): WorldBounds {
  return Object.freeze({
    minX: region.mapX * cellSize - padding,
    minY: region.mapY * cellSize - padding,
    maxX: (region.mapX + 1) * cellSize + padding,
    maxY: (region.mapY + 1) * cellSize + padding,
  });
}

/** Matches PGWorldCanvas region-focus layer-root translate(-minX, -minY). */
export function shiftWorldBoundsToLayerLocal(bounds: WorldBounds): WorldBounds {
  return Object.freeze({
    minX: 0,
    minY: 0,
    maxX: bounds.maxX - bounds.minX,
    maxY: bounds.maxY - bounds.minY,
  });
}
