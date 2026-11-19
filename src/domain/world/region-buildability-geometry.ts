/**
 * Versioned, deterministic region buildability geometry (domain grid cells).
 * Not derived from runtime image pixels.
 */

import { REGION_LOCAL_PLACEMENT_GRID_EXTENT } from './RegionLocalPlacementGrid.js';

export const REGION_BUILDABILITY_GEOMETRY_VERSION = 1;

export type RegionGridPoint = {
  readonly x: number;
  readonly y: number;
};

export type RegionBuildabilityPolygon = readonly RegionGridPoint[];

type RegionBuildabilityDefinition = {
  readonly regionId: string;
  readonly buildablePolygons: readonly RegionBuildabilityPolygon[];
};

function pointInPolygon(x: number, y: number, polygon: RegionBuildabilityPolygon): boolean {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if (a === undefined || b === undefined) {
      continue;
    }

    const xi = a.x;
    const yi = a.y;
    const xj = b.x;
    const yj = b.y;
    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + Number.EPSILON) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function rasterizeRegion(definition: RegionBuildabilityDefinition): Uint8Array {
  const extent = REGION_LOCAL_PLACEMENT_GRID_EXTENT;
  const grid = new Uint8Array(extent * extent);

  for (let y = 0; y < extent; y++) {
    for (let x = 0; x < extent; x++) {
      const sampleX = x + 0.5;
      const sampleY = y + 0.5;
      let insideCount = 0;
      for (const polygon of definition.buildablePolygons) {
        if (pointInPolygon(sampleX, sampleY, polygon)) {
          insideCount += 1;
        }
      }
      const buildable = insideCount % 2 === 1;
      if (buildable) {
        grid[y * extent + x] = 1;
      }
    }
  }

  return grid;
}

/** Conservative buildable land approximations aligned with approved regional artwork. */
const REGION_DEFINITIONS: readonly RegionBuildabilityDefinition[] = Object.freeze([
  Object.freeze({
    regionId: 'region_default',
    buildablePolygons: Object.freeze([
      Object.freeze([
        { x: 0, y: 0 },
        { x: 88, y: 0 },
        { x: 88, y: 88 },
        { x: 0, y: 88 },
      ]),
      Object.freeze([
        { x: 38, y: 40 },
        { x: 52, y: 38 },
        { x: 54, y: 48 },
        { x: 40, y: 50 },
      ]),
    ]),
  }),
  Object.freeze({
    regionId: 'region_east',
    buildablePolygons: Object.freeze([
      Object.freeze([
        { x: 8, y: 12 },
        { x: 80, y: 8 },
        { x: 86, y: 70 },
        { x: 12, y: 76 },
        { x: 6, y: 36 },
      ]),
    ]),
  }),
  Object.freeze({
    regionId: 'region_north',
    buildablePolygons: Object.freeze([
      Object.freeze([
        { x: 10, y: 28 },
        { x: 78, y: 26 },
        { x: 82, y: 82 },
        { x: 8, y: 84 },
        { x: 6, y: 44 },
      ]),
      Object.freeze([
        { x: 34, y: 52 },
        { x: 56, y: 50 },
        { x: 58, y: 62 },
        { x: 36, y: 64 },
      ]),
    ]),
  }),
  Object.freeze({
    regionId: 'region_south',
    buildablePolygons: Object.freeze([
      Object.freeze([
        { x: 6, y: 6 },
        { x: 82, y: 8 },
        { x: 80, y: 36 },
        { x: 52, y: 40 },
        { x: 24, y: 38 },
        { x: 8, y: 28 },
      ]),
      Object.freeze([
        { x: 58, y: 14 },
        { x: 72, y: 16 },
        { x: 70, y: 26 },
        { x: 56, y: 24 },
      ]),
    ]),
  }),
]);

const REGION_BUILDABILITY_GRIDS = new Map<string, Uint8Array>(
  REGION_DEFINITIONS.map((definition) => [
    definition.regionId,
    rasterizeRegion(definition),
  ]),
);

export function isRegionGridCellBuildable(regionId: string, x: number, y: number): boolean {
  const grid = REGION_BUILDABILITY_GRIDS.get(regionId);
  const extent = REGION_LOCAL_PLACEMENT_GRID_EXTENT;

  if (grid === undefined || x < 0 || y < 0 || x >= extent || y >= extent) {
    return false;
  }

  return grid[y * extent + x] === 1;
}

export function listRegionBuildabilityRegionIds(): readonly string[] {
  return [...REGION_BUILDABILITY_GRIDS.keys()];
}
