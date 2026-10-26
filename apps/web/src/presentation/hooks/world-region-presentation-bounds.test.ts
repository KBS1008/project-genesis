import { describe, expect, it } from 'vitest';
import {
  resolveRegionGridWorldBounds,
  shiftWorldBoundsToLayerLocal,
} from '@/presentation/hooks/world-region-presentation-bounds';

describe('resolveRegionGridWorldBounds', () => {
  it('derives bounds from authoritative map grid coordinates', () => {
    const bounds = resolveRegionGridWorldBounds({ mapX: 2, mapY: 1 }, 64, 8);
    expect(bounds.minX).toBe(2 * 64 - 8);
    expect(bounds.maxX).toBe(3 * 64 + 8);
    expect(bounds.minY).toBe(1 * 64 - 8);
    expect(bounds.maxY).toBe(2 * 64 + 8);
  });

  it('shiftWorldBoundsToLayerLocal zeroes min corners for layer-root translate', () => {
    const world = resolveRegionGridWorldBounds({ mapX: 2, mapY: 1 }, 64, 24);
    const local = shiftWorldBoundsToLayerLocal(world);
    expect(local.minX).toBe(0);
    expect(local.minY).toBe(0);
    expect(local.maxX).toBe(world.maxX - world.minX);
    expect(local.maxY).toBe(world.maxY - world.minY);
  });
});
