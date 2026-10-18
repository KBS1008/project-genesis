import type { WorldLogicalPoint } from '@/presentation/adapters/mappers/company-building-placement-coordinates';
import {
  projectScenicUvToWorldLogical,
  resolveRegionWorldLogicalCenter,
  resolveScenicPlateLayoutInCanvas,
  type ScenicPlateLayoutRect,
} from '@/presentation/adapters/mappers/world-scenic-calibration';
import type { WorldBounds } from '@/presentation/hooks/world-camera-math';
import type {
  ScenicNormalizedAnchor,
  WorldScenicPresentationProfile,
} from '@/presentation/adapters/mappers/world-scenic-presentation-profile';
import type { WorldMapRegionCellViewData } from '@/presentation/adapters/view-data/world-view-data';

/** Presentation-only hit radius around each scenic region anchor (world logical units). */
export const SCENIC_REGION_HIT_RADIUS_FACTOR = 0.085;

/** Scales in-cell logical offsets to scenic footprint around anchor. */
export const SCENIC_REGION_VISUAL_SCALE_FACTOR = 0.42;

export type ScenicPresentationContext = Readonly<{
  readonly profile: WorldScenicPresentationProfile;
  readonly layout: ScenicPlateLayoutRect;
  readonly cellSize: number;
}>;

export function resolveScenicPresentationContext(
  profile: WorldScenicPresentationProfile,
  canvasWidth: number,
  canvasHeight: number,
  cellSize: number,
): ScenicPresentationContext {
  return Object.freeze({
    profile,
    layout: resolveScenicPlateLayoutInCanvas(canvasWidth, canvasHeight),
    cellSize,
  });
}

export function resolveScenicRegionAnchorWorld(
  regionId: string,
  context: ScenicPresentationContext,
): WorldLogicalPoint | null {
  const anchor = context.profile.regionAnchors[regionId];
  if (anchor === undefined) {
    return null;
  }

  return projectScenicUvToWorldLogical(anchor, context.layout);
}

export function resolveScenicRegionHitRadius(context: ScenicPresentationContext): number {
  return context.layout.width * SCENIC_REGION_HIT_RADIUS_FACTOR;
}

/** World-logical bounds of the letterboxed scenic plate (presentation-only). */
export function resolveScenicPlateWorldBounds(layout: ScenicPlateLayoutRect): WorldBounds {
  return Object.freeze({
    minX: layout.x,
    minY: layout.y,
    maxX: layout.x + layout.width,
    maxY: layout.y + layout.height,
  });
}

function resolveScenicRegionVisualScale(
  region: WorldMapRegionCellViewData,
  context: ScenicPresentationContext,
): number {
  return (context.layout.width * SCENIC_REGION_VISUAL_SCALE_FACTOR) / (context.cellSize * 0.5);
}

/**
 * Maps authoritative world-logical coordinates to scenic visual coordinates.
 * PDM and domain placement remain on logical space; only rendering uses this.
 */
export function projectLogicalPointToScenicVisual(
  point: WorldLogicalPoint,
  region: WorldMapRegionCellViewData,
  context: ScenicPresentationContext,
): WorldLogicalPoint {
  const anchor = resolveScenicRegionAnchorWorld(region.id, context);
  if (anchor === null) {
    return point;
  }

  const center = resolveRegionWorldLogicalCenter(region, context.cellSize);
  const scale = resolveScenicRegionVisualScale(region, context);

  return Object.freeze({
    x: anchor.x + (point.x - center.x) * scale,
    y: anchor.y + (point.y - center.y) * scale,
  });
}

/**
 * Inverse of {@link projectLogicalPointToScenicVisual} for a single region.
 * Used only to interpret scenic map clicks into region-logical space before unproject.
 */
export function projectScenicVisualToRegionLogical(
  visualPoint: WorldLogicalPoint,
  region: WorldMapRegionCellViewData,
  context: ScenicPresentationContext,
): WorldLogicalPoint {
  const anchor = resolveScenicRegionAnchorWorld(region.id, context);
  if (anchor === null) {
    return visualPoint;
  }

  const center = resolveRegionWorldLogicalCenter(region, context.cellSize);
  const scale = resolveScenicRegionVisualScale(region, context);
  if (scale === 0) {
    return visualPoint;
  }

  return Object.freeze({
    x: center.x + (visualPoint.x - anchor.x) / scale,
    y: center.y + (visualPoint.y - anchor.y) / scale,
  });
}

export function projectMarkerToScenicVisual(
  marker: { readonly x: number; readonly y: number; readonly regionId: string },
  regionById: ReadonlyMap<string, WorldMapRegionCellViewData>,
  context: ScenicPresentationContext,
): WorldLogicalPoint {
  const region = regionById.get(marker.regionId);
  if (region === undefined) {
    return Object.freeze({ x: marker.x, y: marker.y });
  }

  return projectLogicalPointToScenicVisual(
    Object.freeze({ x: marker.x, y: marker.y }),
    region,
    context,
  );
}

export function listScenicRegionPresentationPoints(
  regions: readonly WorldMapRegionCellViewData[],
  context: ScenicPresentationContext,
): ReadonlyArray<
  Readonly<{
    readonly regionId: string;
    readonly anchor: WorldLogicalPoint;
    readonly hitRadius: number;
    readonly labelAnchor: ScenicNormalizedAnchor;
  }>
> {
  const hitRadius = resolveScenicRegionHitRadius(context);

  return regions
    .map((region) => {
      const anchor = resolveScenicRegionAnchorWorld(region.id, context);
      const labelUv = context.profile.regionAnchors[region.id];
      if (anchor === null || labelUv === undefined) {
        return null;
      }

      return Object.freeze({
        regionId: region.id,
        anchor,
        hitRadius,
        labelAnchor: labelUv,
      });
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}
