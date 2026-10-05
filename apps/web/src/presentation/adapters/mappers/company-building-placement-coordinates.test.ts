import { describe, expect, it } from 'vitest';
import {
  COMPANY_PLACEMENT_SCALE,
  projectDomainPlacementPosition,
  resolveCompanyPlacementProjectionContext,
  unprojectWorldLogicalPoint,
} from '@/presentation/adapters/mappers/company-building-placement-coordinates';
import { WORLD_MAP_CELL_SIZE } from '@/presentation/adapters/view-data/world-view-data';

const REGION = Object.freeze({
  id: 'region_default',
  name: 'Central',
  biomeId: 'b',
  biomeLabel: 'B',
  biomeCategory: 'FOREST',
  mapX: 0,
  mapY: 0,
  cityCount: 1,
});

describe('company-building-placement-coordinates', () => {
  const context = resolveCompanyPlacementProjectionContext([REGION])!;

  it('projects and unprojects domain origin', () => {
    const world = projectDomainPlacementPosition({ x: 0, y: 0 }, context);
    expect(world).toEqual({ x: 4, y: 4 });
    expect(unprojectWorldLogicalPoint(world, context)).toEqual({ x: 0, y: 0 });
  });

  it('round-trips a representative position', () => {
    const domain = Object.freeze({ x: 12, y: 7 });
    const world = projectDomainPlacementPosition(domain, context);
    expect(unprojectWorldLogicalPoint(world, context)).toEqual(domain);
  });

  it('allows positions beyond old region-art footprint without adapter rejection', () => {
    const domain = Object.freeze({ x: 200, y: 100 });
    const world = projectDomainPlacementPosition(domain, context);
    expect(unprojectWorldLogicalPoint(world, context)).toEqual(domain);
  });

  it('returns no-pick below domain origin', () => {
    expect(unprojectWorldLogicalPoint({ x: 3, y: 4 }, context)).toBeNull();
    expect(unprojectWorldLogicalPoint({ x: 4, y: 3 }, context)).toBeNull();
  });

  it('uses scale 1 per contract', () => {
    expect(context.scale).toBe(COMPANY_PLACEMENT_SCALE);
    expect(context.originWorldX).toBe(REGION.mapX * WORLD_MAP_CELL_SIZE + 4);
  });

  it('keeps preview and final marker anchors aligned for the same domain position', () => {
    const domain = Object.freeze({ x: 12, y: 7 });
    const previewAnchor = projectDomainPlacementPosition(domain, context);
    const finalAnchor = projectDomainPlacementPosition(domain, context);
    expect(finalAnchor).toEqual(previewAnchor);
    expect(unprojectWorldLogicalPoint(previewAnchor, context)).toEqual(domain);
  });
});
