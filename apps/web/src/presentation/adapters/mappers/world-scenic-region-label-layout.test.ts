import { describe, expect, it } from 'vitest';
import { resolveScenicPlateLayoutInCanvas } from '@/presentation/adapters/mappers/world-scenic-calibration';
import { resolveScenicRegionLabelLayout } from '@/presentation/adapters/mappers/world-scenic-region-label-layout';
import {
  resolveScenicRegionAnchorWorld,
  resolveScenicPresentationContext,
} from '@/presentation/adapters/mappers/world-scenic-visual-projection';
import { WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT } from '@/presentation/adapters/mappers/world-scenic-presentation-profile';

const REGION_LABELS = Object.freeze({
  region_north: Object.freeze({ title: 'Northern Highlands', subtitle: 'Highlands' }),
  region_default: Object.freeze({ title: 'Central Basin', subtitle: 'Plains' }),
  region_east: Object.freeze({ title: 'Eastern Industrial Belt', subtitle: 'Industrial' }),
  region_south: Object.freeze({ title: 'Southern Coastal Belt', subtitle: 'Coastal' }),
});

describe('world-scenic-region-label-layout', () => {
  const profile = WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT;
  const layout = resolveScenicPlateLayoutInCanvas(288, 288);
  const context = resolveScenicPresentationContext(profile, 288, 288, 72);

  it('offsets labels away from the shared anchor without moving the anchor', () => {
    const northAnchor = resolveScenicRegionAnchorWorld('region_north', context)!;
    const defaultAnchor = resolveScenicRegionAnchorWorld('region_default', context)!;
    const northLabel = resolveScenicRegionLabelLayout('region_north', northAnchor, layout);
    const defaultLabel = resolveScenicRegionLabelLayout('region_default', defaultAnchor, layout);

    expect(northLabel.titleY).toBeLessThan(northAnchor.y);
    expect(defaultLabel.titleX).not.toBe(defaultAnchor.x);
  });

  it('clamps all four region titles inside horizontal plate margins when labels are provided', () => {
    const padX = layout.width * 0.065;
    const left = layout.x + padX;
    const right = layout.x + layout.width - padX;

    for (const regionId of ['region_north', 'region_default', 'region_east', 'region_south'] as const) {
      const anchor = resolveScenicRegionAnchorWorld(regionId, context)!;
      const labels = REGION_LABELS[regionId];
      const labelLayout = resolveScenicRegionLabelLayout(regionId, anchor, layout, labels);
      const halfWidth = labels.title.length * layout.width * 0.019 * 0.5;

      expect(labelLayout.titleX - halfWidth, regionId).toBeGreaterThanOrEqual(left - 0.5);
      expect(labelLayout.titleX + halfWidth, regionId).toBeLessThanOrEqual(right + 0.5);
      expect(labelLayout.titleY, regionId).toBeGreaterThanOrEqual(layout.y);
      expect(labelLayout.titleY, regionId).toBeLessThanOrEqual(layout.y + layout.height);
    }
  });

  it('separates central basin and eastern industrial title positions', () => {
    const eastAnchor = resolveScenicRegionAnchorWorld('region_east', context)!;
    const defaultAnchor = resolveScenicRegionAnchorWorld('region_default', context)!;
    const eastLabel = resolveScenicRegionLabelLayout(
      'region_east',
      eastAnchor,
      layout,
      REGION_LABELS.region_east,
    );
    const defaultLabel = resolveScenicRegionLabelLayout(
      'region_default',
      defaultAnchor,
      layout,
      REGION_LABELS.region_default,
    );

    expect(Math.abs(eastLabel.titleX - defaultLabel.titleX)).toBeGreaterThan(layout.width * 0.08);
  });
});
