import { describe, expect, it } from 'vitest';
import {
  resolveScenicRegionLabelInverseScale,
  shouldRenderScenicRegionLabel,
} from '@/presentation/components/world/world-scenic-region-label-scale';

describe('world-scenic-region-label-scale', () => {
  it('inverse scale compensates for viewport zoom', () => {
    expect(resolveScenicRegionLabelInverseScale(2.5)).toBeCloseTo(0.4, 5);
    expect(resolveScenicRegionLabelInverseScale(1)).toBe(1);
  });

  it('hides unselected labels when zoomed out', () => {
    expect(shouldRenderScenicRegionLabel(false, 0.88, true)).toBe(false);
    expect(shouldRenderScenicRegionLabel(true, 0.88, true)).toBe(true);
    expect(shouldRenderScenicRegionLabel(false, 0.95, true)).toBe(true);
  });
});
