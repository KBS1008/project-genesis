import {
  WORLD_MAP_CELL_SIZE,
  type WorldMapRegionCellViewData,
} from '@/presentation/adapters/view-data/world-view-data';

/** Matches `DEFAULT_REGION_ID` in domain world constants. */
export const COMPANY_PLACEMENT_DEFAULT_REGION_ID = 'region_default';

export const COMPANY_PLACEMENT_REGION_INSET = 4;

export const COMPANY_PLACEMENT_SCALE = 1;

export type CompanyPlacementProjectionContext = {
  readonly originWorldX: number;
  readonly originWorldY: number;
  readonly scale: number;
};

export type DomainPlacementPoint = {
  readonly x: number;
  readonly y: number;
};

export type WorldLogicalPoint = {
  readonly x: number;
  readonly y: number;
};

export function resolveCompanyPlacementProjectionContext(
  regions: readonly WorldMapRegionCellViewData[],
  regionId: string = COMPANY_PLACEMENT_DEFAULT_REGION_ID,
  cellSize: number = WORLD_MAP_CELL_SIZE,
  inset: number = COMPANY_PLACEMENT_REGION_INSET,
): CompanyPlacementProjectionContext | null {
  const region = regions.find((entry) => entry.id === regionId);
  if (region === undefined) {
    return null;
  }

  return Object.freeze({
    originWorldX: region.mapX * cellSize + inset,
    originWorldY: region.mapY * cellSize + inset,
    scale: COMPANY_PLACEMENT_SCALE,
  });
}

export function projectDomainPlacementPosition(
  position: DomainPlacementPoint,
  context: CompanyPlacementProjectionContext,
): WorldLogicalPoint {
  return Object.freeze({
    x: context.originWorldX + position.x * context.scale,
    y: context.originWorldY + position.y * context.scale,
  });
}

export function unprojectWorldLogicalPoint(
  point: WorldLogicalPoint,
  context: CompanyPlacementProjectionContext,
): DomainPlacementPoint | null {
  const rawX = (point.x - context.originWorldX) / context.scale;
  const rawY = (point.y - context.originWorldY) / context.scale;

  if (rawX < 0 || rawY < 0) {
    return null;
  }

  const x = Math.round(rawX);
  const y = Math.round(rawY);

  if (x < 0 || y < 0) {
    return null;
  }

  return Object.freeze({ x, y });
}

export function resolveWorldCanvasExtent(params: {
  readonly baseWidth: number;
  readonly baseHeight: number;
  readonly worldPoints: readonly WorldLogicalPoint[];
  readonly margin?: number;
}): { readonly width: number; readonly height: number } {
  const margin = params.margin ?? 48;
  let maxX = params.baseWidth;
  let maxY = params.baseHeight;

  for (const point of params.worldPoints) {
    maxX = Math.max(maxX, point.x + margin);
    maxY = Math.max(maxY, point.y + margin);
  }

  return Object.freeze({ width: maxX, height: maxY });
}
