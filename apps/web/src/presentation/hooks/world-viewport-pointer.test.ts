import { describe, expect, it } from 'vitest';
import {
  isPointerDrag,
  viewportPointerToWorldLogical,
  WORLD_PLACEMENT_DRAG_THRESHOLD_PX,
} from '@/presentation/hooks/world-viewport-pointer';
import {
  projectDomainPlacementPosition,
  resolveCompanyPlacementProjectionContext,
  unprojectWorldLogicalPoint,
} from '@/presentation/adapters/mappers/company-building-placement-coordinates';

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

describe('world-viewport-pointer', () => {
  it('converts viewport-local coordinates through inverse camera transform', () => {
    const camera = Object.freeze({ scale: 2, translateX: 40, translateY: 20 });
    expect(viewportPointerToWorldLogical(140, 80, camera)).toEqual({ x: 50, y: 30 });
  });

  it('derives the same domain candidate for the same world-logical point under pan and zoom', () => {
    const context = resolveCompanyPlacementProjectionContext([REGION])!;
    const domain = Object.freeze({ x: 18, y: 6 });
    const worldLogical = projectDomainPlacementPosition(domain, context);

    const cameras = [
      Object.freeze({ scale: 1, translateX: 0, translateY: 0 }),
      Object.freeze({ scale: 1.75, translateX: -120, translateY: 44 }),
      Object.freeze({ scale: 0.6, translateX: 200, translateY: 90 }),
    ] as const;

    for (const camera of cameras) {
      const localX = worldLogical.x * camera.scale + camera.translateX;
      const localY = worldLogical.y * camera.scale + camera.translateY;
      const roundTrip = unprojectWorldLogicalPoint(
        viewportPointerToWorldLogical(localX, localY, camera),
        context,
      );
      expect(roundTrip).toEqual(domain);
    }
  });

  it('classifies small pointer movement as tap and larger movement as drag', () => {
    expect(isPointerDrag(0, 0, 4, 0, WORLD_PLACEMENT_DRAG_THRESHOLD_PX)).toBe(false);
    expect(isPointerDrag(0, 0, 6, 0, WORLD_PLACEMENT_DRAG_THRESHOLD_PX)).toBe(true);
  });
});
