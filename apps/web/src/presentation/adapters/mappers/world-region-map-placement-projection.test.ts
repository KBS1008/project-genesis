import { describe, expect, it } from 'vitest';
import { computeObjectFitContainContentRect } from '@/presentation/adapters/mappers/object-fit-contain-geometry';
import {
  projectDomainCellCenterToRegionImageNormalized,
  projectDomainFootprintTopLeftToRegionImageNormalized,
  projectDomainPlacementToRegionImageNormalized,
  projectDomainPlacementToRegionMapContentPixels,
  REGION_MAP_DOMAIN_GRID_EXTENT,
  unprojectRegionImageNormalizedToDomainPlacement,
  unprojectRegionMapElementPointToDomainPlacement,
} from '@/presentation/adapters/mappers/world-region-map-placement-projection';

describe('world-region-map-placement-projection', () => {
  const headquarters = Object.freeze({ x: 12, y: 12 });

  it('uses the shared region-local grid extent', () => {
    expect(REGION_MAP_DOMAIN_GRID_EXTENT).toBe(88);
  });

  it('projects domain cell centers to normalized image space (terrain-aligned)', () => {
    const normalized = projectDomainPlacementToRegionImageNormalized(headquarters);
    expect(normalized.u).toBeCloseTo(12.5 / 88, 5);
    expect(normalized.v).toBeCloseTo(12.5 / 88, 5);
  });

  it('round-trips normalized coordinates through inverse projection', () => {
    const normalized = projectDomainPlacementToRegionImageNormalized(headquarters);
    expect(unprojectRegionImageNormalizedToDomainPlacement(normalized)).toEqual(headquarters);
  });

  it('maps domain coordinates into letterboxed content pixels', () => {
    const contentRect = computeObjectFitContainContentRect({
      elementWidth: 1440,
      elementHeight: 900,
      naturalWidth: 1536,
      naturalHeight: 1024,
    });
    const point = projectDomainPlacementToRegionMapContentPixels(headquarters, contentRect);
    const normalized = projectDomainPlacementToRegionImageNormalized(headquarters);

    expect(point.x).toBeCloseTo(contentRect.x + normalized.u * contentRect.width, 5);
    expect(point.y).toBeCloseTo(contentRect.y + normalized.v * contentRect.height, 5);
  });

  it('unprojects element-local pointer positions back to domain coordinates', () => {
    const contentRect = computeObjectFitContainContentRect({
      elementWidth: 1024,
      elementHeight: 768,
      naturalWidth: 1536,
      naturalHeight: 1024,
    });
    const pixel = projectDomainPlacementToRegionMapContentPixels(headquarters, contentRect);
    const domain = unprojectRegionMapElementPointToDomainPlacement(
      pixel.x,
      pixel.y,
      contentRect,
    );

    expect(domain).toEqual(headquarters);
  });

  it('separates footprint top-left from cell-center ground contact', () => {
    const center = projectDomainCellCenterToRegionImageNormalized(headquarters);
    const topLeft = projectDomainFootprintTopLeftToRegionImageNormalized(headquarters);
    expect(center.u - topLeft.u).toBeCloseTo(0.5 / REGION_MAP_DOMAIN_GRID_EXTENT, 6);
    expect(center.v - topLeft.v).toBeCloseTo(0.5 / REGION_MAP_DOMAIN_GRID_EXTENT, 6);
  });

  it('rejects pointer positions in letterbox margins', () => {
    const contentRect = computeObjectFitContainContentRect({
      elementWidth: 390,
      elementHeight: 844,
      naturalWidth: 1536,
      naturalHeight: 1024,
    });

    expect(unprojectRegionMapElementPointToDomainPlacement(10, 10, contentRect)).toBeNull();
  });
});
