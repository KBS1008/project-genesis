import { describe, expect, it } from 'vitest';
import {
  measureScenicRegionAnchorDeviations,
  projectScenicUvToWorldLogical,
  projectWorldLogicalToScenicUv,
  resolveRegionWorldLogicalCenter,
  resolveScenicPlateLayoutInCanvas,
} from '@/presentation/adapters/mappers/world-scenic-calibration';
import { WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT } from '@/presentation/adapters/mappers/world-scenic-presentation-profile';
import { WORLD_MAP_CELL_SIZE } from '@/presentation/adapters/view-data/world-view-data';

const REGIONS = [
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
] as const;

describe('world-scenic-calibration', () => {
  it('letterboxes the 16:9 plate inside a taller canvas without cropping', () => {
    const layout = resolveScenicPlateLayoutInCanvas(288, 480);
    expect(layout.width).toBe(288);
    expect(layout.height).toBeCloseTo(288 * (9 / 16), 5);
    expect(layout.x).toBe(0);
    expect(layout.y).toBeGreaterThan(0);
  });

  it('round-trips world logical points through scenic UV within the layout rect', () => {
    const layout = resolveScenicPlateLayoutInCanvas(640, 480);
    const uv = Object.freeze({ u: 0.25, v: 0.6 });
    const world = projectScenicUvToWorldLogical(uv, layout);
    const back = projectWorldLogicalToScenicUv(world, layout);
    expect(back.u).toBeCloseTo(uv.u, 10);
    expect(back.v).toBeCloseTo(uv.v, 10);
  });

  it('maps region centers deterministically (zoom-independent inputs)', () => {
    const center = resolveRegionWorldLogicalCenter(REGIONS[0], WORLD_MAP_CELL_SIZE);
    expect(center).toEqual({ x: 48, y: 48 });
  });

  it('documents provisional anchor deviation for all regions (not zero)', () => {
    const deviations = measureScenicRegionAnchorDeviations(
      WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT,
      REGIONS,
      WORLD_MAP_CELL_SIZE,
      288,
      480,
    );
    expect(deviations).toHaveLength(4);
    expect(deviations.some((entry) => Math.abs(entry.deltaU) > 0.05)).toBe(true);
  });
});
