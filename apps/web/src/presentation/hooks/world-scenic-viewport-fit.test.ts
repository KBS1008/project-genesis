import { describe, expect, it } from 'vitest';
import { resolveScenicPlateLayoutInCanvas } from '@/presentation/adapters/mappers/world-scenic-calibration';
import { resolveScenicPlateWorldBounds } from '@/presentation/adapters/mappers/world-scenic-visual-projection';
import { fitWorldCamera } from '@/presentation/hooks/world-camera-math';

describe('world-scenic-viewport-fit', () => {
  it('fitWorldCamera upscales scenic plate to fill a larger viewport', () => {
    const viewportW = 540;
    const viewportH = 354;
    const layout = resolveScenicPlateLayoutInCanvas(288, 288);
    const bounds = resolveScenicPlateWorldBounds(layout);
    const legacyCamera = fitWorldCamera(bounds, viewportW, viewportH, 24);
    const scenicCamera = fitWorldCamera(bounds, viewportW, viewportH, 24, { allowUpscale: true });

    expect(legacyCamera.scale).toBe(1);
    expect(scenicCamera.scale).toBeGreaterThan(1);

    const plateCenterX = layout.x + layout.width / 2;
    const plateCenterY = layout.y + layout.height / 2;
    const screenX = plateCenterX * scenicCamera.scale + scenicCamera.translateX;
    const screenY = plateCenterY * scenicCamera.scale + scenicCamera.translateY;
    expect(screenX).toBeCloseTo(viewportW / 2, 0);
    expect(screenY).toBeCloseTo(viewportH / 2, 0);
  });
});
