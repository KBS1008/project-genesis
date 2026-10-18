import { describe, expect, it } from 'vitest';
import {
  resolveScenicPresentationContext,
  resolveScenicRegionAnchorWorld,
} from '@/presentation/adapters/mappers/world-scenic-visual-projection';
import { WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT } from '@/presentation/adapters/mappers/world-scenic-presentation-profile';
import { WORLD_MAP_CELL_SIZE } from '@/presentation/adapters/view-data/world-view-data';
import {
  fitRegionCamera,
  fitRegionCameraAtWorldCenter,
} from '@/presentation/hooks/world-camera-math';

const REGION_DEFAULT = Object.freeze({
  id: 'region_default',
  name: 'Central Basin',
  biomeId: 'forest',
  biomeLabel: 'Forest',
  biomeCategory: 'FOREST',
  mapX: 0,
  mapY: 0,
  cityCount: 2,
});

describe('world-scenic-camera-focus', () => {
  it('fitRegionCameraAtWorldCenter places the given world point in the viewport center', () => {
    const camera = fitRegionCameraAtWorldCenter(320, 180, 640, 480);
    const worldX = (640 / 2 - camera.translateX) / camera.scale;
    const worldY = (480 / 2 - camera.translateY) / camera.scale;
    expect(worldX).toBeCloseTo(320, 8);
    expect(worldY).toBeCloseTo(180, 8);
  });

  it('scenic anchor differs from grid center for region_default', () => {
    const context = resolveScenicPresentationContext(
      WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT,
      640,
      480,
      WORLD_MAP_CELL_SIZE,
    );
    const scenicAnchor = resolveScenicRegionAnchorWorld('region_default', context);
    const gridCamera = fitRegionCamera(REGION_DEFAULT, 640, 480, WORLD_MAP_CELL_SIZE);
    const scenicCamera = fitRegionCameraAtWorldCenter(
      scenicAnchor!.x,
      scenicAnchor!.y,
      640,
      480,
    );

    expect(scenicAnchor).not.toBeNull();
    expect(scenicCamera.translateX).not.toBe(gridCamera.translateX);
    expect(scenicCamera.translateY).not.toBe(gridCamera.translateY);
  });

  it('resolves scenic anchors for all four production region IDs', () => {
    const context = resolveScenicPresentationContext(
      WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT,
      1280,
      720,
      WORLD_MAP_CELL_SIZE,
    );
    for (const regionId of [
      'region_default',
      'region_north',
      'region_east',
      'region_south',
    ]) {
      expect(resolveScenicRegionAnchorWorld(regionId, context)).not.toBeNull();
    }
  });
});
