import { describe, expect, it } from 'vitest';
import {
  listScenicRegionPresentationPoints,
  projectLogicalPointToScenicVisual,
  projectMarkerToScenicVisual,
  projectScenicVisualToRegionLogical,
  resolveScenicPlateWorldBounds,
  resolveScenicPresentationContext,
  resolveScenicRegionAnchorWorld,
  resolveScenicRegionHitRadius,
  SCENIC_REGION_HIT_RADIUS_FACTOR,
} from '@/presentation/adapters/mappers/world-scenic-visual-projection';
import {
  projectWorldLogicalToScenicUv,
  resolveRegionWorldLogicalCenter,
} from '@/presentation/adapters/mappers/world-scenic-calibration';
import { WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT } from '@/presentation/adapters/mappers/world-scenic-presentation-profile';
import {
  unprojectWorldLogicalPoint,
  projectDomainPlacementPosition,
  resolveCompanyPlacementProjectionContext,
} from '@/presentation/adapters/mappers/company-building-placement-coordinates';
import {
  WORLD_MAP_CELL_SIZE,
  type WorldMapRegionCellViewData,
} from '@/presentation/adapters/view-data/world-view-data';

const REGIONS: readonly WorldMapRegionCellViewData[] = [
  Object.freeze({
    id: 'region_default',
    name: 'Central Basin',
    biomeId: 'forest',
    biomeLabel: 'Forest',
    biomeCategory: 'FOREST',
    mapX: 0,
    mapY: 0,
    cityCount: 2,
  }),
  Object.freeze({
    id: 'region_east',
    name: 'Eastern Industrial Belt',
    biomeId: 'plains',
    biomeLabel: 'Plains',
    biomeCategory: 'PLAINS',
    mapX: 2,
    mapY: 0,
    cityCount: 2,
  }),
  Object.freeze({
    id: 'region_north',
    name: 'Northern Highlands',
    biomeId: 'forest',
    biomeLabel: 'Forest',
    biomeCategory: 'FOREST',
    mapX: 0,
    mapY: 2,
    cityCount: 1,
  }),
  Object.freeze({
    id: 'region_south',
    name: 'Southern Coastal Belt',
    biomeId: 'coastal',
    biomeLabel: 'Coastal',
    biomeCategory: 'COASTAL',
    mapX: 0,
    mapY: -2,
    cityCount: 2,
  }),
];

const CANVAS_W = 640;
const CANVAS_H = 480;

function context() {
  return resolveScenicPresentationContext(
    WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT,
    CANVAS_W,
    CANVAS_H,
    WORLD_MAP_CELL_SIZE,
  );
}

describe('world-scenic-visual-projection', () => {
  it('resolves four scenic region presentation points with stable hit radius', () => {
    const ctx = context();
    const points = listScenicRegionPresentationPoints(REGIONS, ctx);
    expect(points.map((p) => p.regionId).sort()).toEqual([
      'region_default',
      'region_east',
      'region_north',
      'region_south',
    ]);
    const expectedRadius = resolveScenicRegionHitRadius(ctx);
    expect(expectedRadius).toBe(ctx.layout.width * SCENIC_REGION_HIT_RADIUS_FACTOR);
    for (const point of points) {
      expect(point.hitRadius).toBe(expectedRadius);
      expect(point.anchor.x).toBeGreaterThan(0);
      expect(point.anchor.y).toBeGreaterThan(0);
    }
  });

  it('maps region south anchor into lower plate area (Southern Coastal visibility)', () => {
    const ctx = context();
    const southAnchor = resolveScenicRegionAnchorWorld('region_south', ctx);
    expect(southAnchor).not.toBeNull();
    const uv = WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT.regionAnchors.region_south;
    expect(uv.v).toBeGreaterThan(0.65);
    expect(southAnchor!.y).toBeGreaterThan(ctx.layout.height * 0.55 + ctx.layout.y);
  });

  it('projects logical region center to scenic anchor (deterministic, camera-independent)', () => {
    const ctx = context();
    const region = REGIONS[0];
    const center = resolveRegionWorldLogicalCenter(region, WORLD_MAP_CELL_SIZE);
    const visual = projectLogicalPointToScenicVisual(center, region, ctx);
    const anchor = resolveScenicRegionAnchorWorld(region.id, ctx)!;
    expect(visual.x).toBeCloseTo(anchor.x, 8);
    expect(visual.y).toBeCloseTo(anchor.y, 8);
  });

  it('round-trips region logical points through scenic visual projection', () => {
    const ctx = context();
    const region = REGIONS[0];
    const logical = Object.freeze({ x: 60, y: 72 });
    const visual = projectLogicalPointToScenicVisual(logical, region, ctx);
    const back = projectScenicVisualToRegionLogical(visual, region, ctx);
    expect(back.x).toBeCloseTo(logical.x, 8);
    expect(back.y).toBeCloseTo(logical.y, 8);
  });

  it('keeps scenic pick round-trip within rounding tolerance for placement display', () => {
    const ctx = context();
    const region = REGIONS[0];
    const placementContext = resolveCompanyPlacementProjectionContext(REGIONS)!;
    const visualPick = Object.freeze({ x: 140, y: 118 });
    const logical = projectScenicVisualToRegionLogical(visualPick, region, ctx);
    const domain = unprojectWorldLogicalPoint(logical, placementContext);
    expect(domain).not.toBeNull();
    const anchor = projectDomainPlacementPosition(domain!, placementContext);
    const confirmedVisual = projectLogicalPointToScenicVisual(anchor, region, ctx);
    const delta = Math.hypot(confirmedVisual.x - visualPick.x, confirmedVisual.y - visualPick.y);
    expect(delta).toBeLessThan(12);
  });

  it('derives scenic plate world bounds from letterboxed layout', () => {
    const ctx = context();
    const bounds = resolveScenicPlateWorldBounds(ctx.layout);
    expect(bounds.minX).toBe(ctx.layout.x);
    expect(bounds.minY).toBe(ctx.layout.y);
    expect(bounds.maxX - bounds.minX).toBeCloseTo(ctx.layout.width, 8);
    expect(bounds.maxY - bounds.minY).toBeCloseTo(ctx.layout.height, 8);
  });

  it('offsets markers relative to region center without mutating unknown regions', () => {
    const ctx = context();
    const regionById = new Map(REGIONS.map((r) => [r.id, r]));
    const region = REGIONS[0];
    const center = resolveRegionWorldLogicalCenter(region, WORLD_MAP_CELL_SIZE);
    const marker = { x: center.x + 10, y: center.y - 5, regionId: region.id };
    const visual = projectMarkerToScenicVisual(marker, regionById, ctx);
    expect(visual.x).not.toBe(marker.x);
    expect(visual.y).not.toBe(marker.y);

    const unknown = projectMarkerToScenicVisual(
      { x: 100, y: 100, regionId: 'region_missing' },
      regionById,
      ctx,
    );
    expect(unknown).toEqual({ x: 100, y: 100 });
  });

  it('keeps scenic UV stable across canvas sizes (camera-independent adapter)', () => {
    const ctxSmall = resolveScenicPresentationContext(
      WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT,
      320,
      240,
      WORLD_MAP_CELL_SIZE,
    );
    const ctxLarge = resolveScenicPresentationContext(
      WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT,
      1280,
      720,
      WORLD_MAP_CELL_SIZE,
    );
    const region = REGIONS[2];
    const center = resolveRegionWorldLogicalCenter(region, WORLD_MAP_CELL_SIZE);
    const vSmall = projectLogicalPointToScenicVisual(center, region, ctxSmall);
    const vLarge = projectLogicalPointToScenicVisual(center, region, ctxLarge);
    const uvSmall = projectWorldLogicalToScenicUv(vSmall, ctxSmall.layout);
    const uvLarge = projectWorldLogicalToScenicUv(vLarge, ctxLarge.layout);
    expect(uvLarge.u).toBeCloseTo(uvSmall.u, 8);
    expect(uvLarge.v).toBeCloseTo(uvSmall.v, 8);
  });
});
