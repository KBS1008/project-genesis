import {
  COMPANY_PLACEMENT_REGION_INSET,
  type DomainPlacementPoint,
} from '@/presentation/adapters/mappers/company-building-placement-coordinates';
import type { ObjectFitContainContentRect } from '@/presentation/adapters/mappers/object-fit-contain-geometry';
import { WORLD_MAP_CELL_SIZE } from '@/presentation/adapters/view-data/world-view-data';

/** Playable region-local grid span aligned with world map inner cell (`cellSize - 2×inset`). */
export const REGION_MAP_DOMAIN_GRID_EXTENT =
  WORLD_MAP_CELL_SIZE - 2 * COMPANY_PLACEMENT_REGION_INSET;

export type RegionImageNormalizedPoint = {
  readonly u: number;
  readonly v: number;
};

export type RegionMapScreenPoint = {
  readonly x: number;
  readonly y: number;
};

function clamp01(value: number): number {
  if (value <= 0) {
    return 0;
  }

  if (value >= 1) {
    return 1;
  }

  return value;
}

/**
 * Domain cell top-left → normalized image coordinates (0–1).
 * Used for multi-cell placement footprint rectangles aligned to the grid.
 */
export function projectDomainFootprintTopLeftToRegionImageNormalized(
  position: DomainPlacementPoint,
  extent: number = REGION_MAP_DOMAIN_GRID_EXTENT,
): RegionImageNormalizedPoint {
  return Object.freeze({
    u: clamp01(position.x / extent),
    v: clamp01(position.y / extent),
  });
}

/**
 * Domain cell index → normalized coordinates at the cell center (ground contact).
 * Matches regional terrain sampling at (x + 0.5, y + 0.5).
 */
export function projectDomainCellCenterToRegionImageNormalized(
  position: DomainPlacementPoint,
  extent: number = REGION_MAP_DOMAIN_GRID_EXTENT,
): RegionImageNormalizedPoint {
  return Object.freeze({
    u: clamp01((position.x + 0.5) / extent),
    v: clamp01((position.y + 0.5) / extent),
  });
}

/** @deprecated Use {@link projectDomainCellCenterToRegionImageNormalized} for markers and picks. */
export function projectDomainPlacementToRegionImageNormalized(
  position: DomainPlacementPoint,
  extent: number = REGION_MAP_DOMAIN_GRID_EXTENT,
): RegionImageNormalizedPoint {
  return projectDomainCellCenterToRegionImageNormalized(position, extent);
}

/** Normalized image coordinates → domain cell index (inverse of cell-center projection). */
export function unprojectRegionImageNormalizedToDomainPlacement(
  normalized: RegionImageNormalizedPoint,
  extent: number = REGION_MAP_DOMAIN_GRID_EXTENT,
): DomainPlacementPoint {
  const u = clamp01(normalized.u);
  const v = clamp01(normalized.v);
  return Object.freeze({
    x: Math.round(u * extent - 0.5),
    y: Math.round(v * extent - 0.5),
  });
}

/** Normalized image coordinates → pixel offset inside the element (top-left of content rect). */
export function projectRegionImageNormalizedToContentPixels(
  normalized: RegionImageNormalizedPoint,
  contentRect: ObjectFitContainContentRect,
): RegionMapScreenPoint {
  return Object.freeze({
    x: contentRect.x + normalized.u * contentRect.width,
    y: contentRect.y + normalized.v * contentRect.height,
  });
}

/** Domain cell center → pixel offset inside the map element (building ground contact). */
export function projectDomainPlacementToRegionMapContentPixels(
  position: DomainPlacementPoint,
  contentRect: ObjectFitContainContentRect,
  extent: number = REGION_MAP_DOMAIN_GRID_EXTENT,
): RegionMapScreenPoint {
  const normalized = projectDomainCellCenterToRegionImageNormalized(position, extent);
  return projectRegionImageNormalizedToContentPixels(normalized, contentRect);
}

/** Footprint top-left domain cell → pixel offset (placement preview top-left). */
export function projectDomainFootprintTopLeftToRegionMapContentPixels(
  position: DomainPlacementPoint,
  contentRect: ObjectFitContainContentRect,
  extent: number = REGION_MAP_DOMAIN_GRID_EXTENT,
): RegionMapScreenPoint {
  const normalized = projectDomainFootprintTopLeftToRegionImageNormalized(position, extent);
  return projectRegionImageNormalizedToContentPixels(normalized, contentRect);
}

/** Pointer position relative to element top-left → domain placement, or null if outside content. */
export function unprojectRegionMapElementPointToDomainPlacement(
  elementLocalX: number,
  elementLocalY: number,
  contentRect: ObjectFitContainContentRect,
  extent: number = REGION_MAP_DOMAIN_GRID_EXTENT,
): DomainPlacementPoint | null {
  if (contentRect.width <= 0 || contentRect.height <= 0) {
    return null;
  }

  const u = (elementLocalX - contentRect.x) / contentRect.width;
  const v = (elementLocalY - contentRect.y) / contentRect.height;

  if (u < 0 || u > 1 || v < 0 || v > 1) {
    return null;
  }

  return unprojectRegionImageNormalizedToDomainPlacement({ u, v }, extent);
}
