import { describe, expect, it } from 'vitest';
import {
  clampWorldScale,
  fitWorldCamera,
  resolveWorldBounds,
  zoomWorldScale,
} from '@/presentation/hooks/world-camera-math';

describe('world-camera-math', () => {
  it('clamps zoom scale within configured bounds', () => {
    expect(clampWorldScale(0.1)).toBeGreaterThan(0.4);
    expect(clampWorldScale(10)).toBeLessThan(3);
    expect(zoomWorldScale(1, 0.2)).toBeGreaterThan(1);
  });

  it('fitWorldCamera centers map content in the viewport', () => {
    const bounds = resolveWorldBounds([
      { mapX: 0, mapY: 0 },
      { mapX: 1, mapY: 0 },
    ]);

    const camera = fitWorldCamera(bounds, 400, 300);
    expect(camera.scale).toBeGreaterThan(0);
    expect(camera.translateX).not.toBe(0);
  });
});
