import { describe, expect, it } from 'vitest';
import {
  clampWorldCameraTranslation,
  clampWorldScale,
  fitWorldCamera,
  resolveWorldBounds,
  WORLD_CAMERA_REGION_FOCUS_MAX_SCALE,
  WORLD_CAMERA_REGION_FOCUS_SCALE_LIMITS,
  zoomWorldCameraAtViewportPoint,
  zoomWorldScale,
} from '@/presentation/hooks/world-camera-math';
import {
  resolveRegionGridWorldBounds,
  shiftWorldBoundsToLayerLocal,
} from '@/presentation/hooks/world-region-presentation-bounds';
import { worldLogicalToViewportLocal } from '@/presentation/hooks/world-viewport-pointer';

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

  it('region-focus fit reaches at least 85% viewport height at reference desktop map size', () => {
    const bounds = shiftWorldBoundsToLayerLocal(resolveRegionGridWorldBounds({ mapX: 2, mapY: 1 }, 64, 24));
    const camera = fitWorldCamera(bounds, 1116, 558, 24, {
      allowUpscale: true,
      maxScale: WORLD_CAMERA_REGION_FOCUS_MAX_SCALE,
    });
    const visibleHeight = (bounds.maxY - bounds.minY) * camera.scale;
    expect(visibleHeight / 558).toBeGreaterThanOrEqual(0.85);
    expect(camera.scale).toBeGreaterThan(2.5);
  });

  it('layer-local region fit centers non-zero map origins in the viewport', () => {
    const worldBounds = resolveRegionGridWorldBounds({ mapX: 2, mapY: 1 }, 64, 24);
    const localBounds = shiftWorldBoundsToLayerLocal(worldBounds);
    const camera = fitWorldCamera(localBounds, 1116, 558, 24, {
      allowUpscale: true,
      maxScale: WORLD_CAMERA_REGION_FOCUS_MAX_SCALE,
    });
    const contentWidth = localBounds.maxX * camera.scale;
    const contentHeight = localBounds.maxY * camera.scale;
    const regionCenterX = camera.translateX + contentWidth / 2;
    const regionCenterY = camera.translateY + contentHeight / 2;
    expect(regionCenterX).toBeCloseTo(1116 / 2, 0);
    expect(regionCenterY).toBeCloseTo(558 / 2, 0);
  });

  it('region-focus wheel zoom does not snap to overview max scale', () => {
    const fittedScale = 3.52778;
    const camera = Object.freeze({ scale: fittedScale, translateX: 100, translateY: 50 });
    const zoomedIn = zoomWorldCameraAtViewportPoint(
      camera,
      558,
      279,
      0.15,
      WORLD_CAMERA_REGION_FOCUS_SCALE_LIMITS,
    );
    expect(zoomedIn.scale).toBeGreaterThan(2.5);
    expect(zoomedIn.scale).toBeCloseTo(fittedScale + 0.15, 3);

    const zoomedOut = zoomWorldCameraAtViewportPoint(
      camera,
      558,
      279,
      -0.15,
      WORLD_CAMERA_REGION_FOCUS_SCALE_LIMITS,
    );
    expect(zoomedOut.scale).toBeCloseTo(fittedScale - 0.15, 3);
  });

  it('overview wheel zoom still caps at global max scale', () => {
    expect(zoomWorldScale(2.4, 0.2)).toBeLessThanOrEqual(2.5);
    expect(zoomWorldScale(2.5, 0.2)).toBe(2.5);
  });

  it('zoomWorldCameraAtViewportPoint keeps the anchor world point stable', () => {
    const camera = Object.freeze({ scale: 1, translateX: 40, translateY: 30 });
    const anchor = worldLogicalToViewportLocal(120, 80, camera);
    const zoomed = zoomWorldCameraAtViewportPoint(camera, anchor.x, anchor.y, 0.3);
    const after = worldLogicalToViewportLocal(120, 80, zoomed);
    expect(after.x).toBeCloseTo(anchor.x, 4);
    expect(after.y).toBeCloseTo(anchor.y, 4);
  });

  it('clampWorldCameraTranslation prevents panning the world completely away', () => {
    const bounds = resolveWorldBounds([{ mapX: 0, mapY: 0 }, { mapX: 3, mapY: 3 }]);
    const camera = Object.freeze({ scale: 1.2, translateX: -500, translateY: -500 });
    const clamped = clampWorldCameraTranslation(camera, bounds, 400, 300, 24);
    expect(clamped.translateX).toBeGreaterThan(-500);
    expect(clamped.translateY).toBeGreaterThan(-500);
  });
});
