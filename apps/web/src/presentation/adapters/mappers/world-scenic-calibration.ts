import {
  WORLD_SCENIC_PLATE_HEIGHT,
  WORLD_SCENIC_PLATE_WIDTH,
  type ScenicNormalizedAnchor,
  type WorldScenicPresentationProfile,
} from '@/presentation/adapters/mappers/world-scenic-presentation-profile';
import type { WorldLogicalPoint } from '@/presentation/adapters/mappers/company-building-placement-coordinates';
import type { WorldMapRegionCellViewData } from '@/presentation/adapters/view-data/world-view-data';

export type ScenicPlateLayoutRect = Readonly<{
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}>;

export type ScenicUvPoint = Readonly<{
  readonly u: number;
  readonly v: number;
}>;

/** Region cell center in authoritative world logical coordinates (SVG user space). */
export function resolveRegionWorldLogicalCenter(
  region: Pick<WorldMapRegionCellViewData, 'mapX' | 'mapY'>,
  cellSize: number,
): WorldLogicalPoint {
  return Object.freeze({
    x: region.mapX * cellSize + cellSize / 2,
    y: region.mapY * cellSize + cellSize / 2,
  });
}

/**
 * Letterbox the 16:9 scenic plate inside the world canvas without cropping the plate.
 * Independent of camera zoom/pan — layout is in world logical space.
 */
export function resolveScenicPlateLayoutInCanvas(
  canvasWidth: number,
  canvasHeight: number,
  plateWidth: number = WORLD_SCENIC_PLATE_WIDTH,
  plateHeight: number = WORLD_SCENIC_PLATE_HEIGHT,
): ScenicPlateLayoutRect {
  const plateAspect = plateWidth / plateHeight;
  const canvasAspect = canvasWidth / canvasHeight;

  if (canvasAspect >= plateAspect) {
    const height = canvasHeight;
    const width = height * plateAspect;
    return Object.freeze({
      x: (canvasWidth - width) / 2,
      y: 0,
      width,
      height,
    });
  }

  const width = canvasWidth;
  const height = width / plateAspect;
  return Object.freeze({
    x: 0,
    y: (canvasHeight - height) / 2,
    width,
    height,
  });
}

export function projectWorldLogicalToScenicUv(
  point: WorldLogicalPoint,
  layout: ScenicPlateLayoutRect,
): ScenicUvPoint {
  return Object.freeze({
    u: (point.x - layout.x) / layout.width,
    v: (point.y - layout.y) / layout.height,
  });
}

export function projectScenicUvToWorldLogical(
  uv: ScenicNormalizedAnchor,
  layout: ScenicPlateLayoutRect,
): WorldLogicalPoint {
  return Object.freeze({
    x: layout.x + uv.u * layout.width,
    y: layout.y + uv.v * layout.height,
  });
}

export type ScenicRegionAnchorDeviation = Readonly<{
  readonly regionId: string;
  readonly anchorUv: ScenicNormalizedAnchor;
  readonly regionCenterUv: ScenicUvPoint;
  readonly deltaU: number;
  readonly deltaV: number;
}>;

/** Compare provisional plate anchors to logical region centers (presentation QA only). */
export function measureScenicRegionAnchorDeviations(
  profile: WorldScenicPresentationProfile,
  regions: readonly WorldMapRegionCellViewData[],
  cellSize: number,
  canvasWidth: number,
  canvasHeight: number,
): readonly ScenicRegionAnchorDeviation[] {
  const layout = resolveScenicPlateLayoutInCanvas(canvasWidth, canvasHeight);

  return regions
    .map((region) => {
      const anchor = profile.regionAnchors[region.id];
      if (anchor === undefined) {
        return null;
      }

      const center = resolveRegionWorldLogicalCenter(region, cellSize);
      const centerUv = projectWorldLogicalToScenicUv(center, layout);

      return Object.freeze({
        regionId: region.id,
        anchorUv: anchor,
        regionCenterUv: centerUv,
        deltaU: centerUv.u - anchor.u,
        deltaV: centerUv.v - anchor.v,
      });
    })
    .filter((entry): entry is ScenicRegionAnchorDeviation => entry !== null);
}
