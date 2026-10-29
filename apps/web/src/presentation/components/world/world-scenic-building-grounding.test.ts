import { describe, expect, it } from 'vitest';
import {
  resolveScenicBuildingContactShadowLayout,
  SCENIC_BUILDING_GROUNDING_SHADOW_OFFSET_X,
} from '@/presentation/components/world/world-scenic-building-grounding';

describe('world-scenic-building-grounding', () => {
  it('places contact shadow down-right of anchor center', () => {
    const layout = resolveScenicBuildingContactShadowLayout(23, 16);
    expect(layout.cx).toBeGreaterThan(23);
    expect(layout.cy).toBeGreaterThan(23);
    expect(layout.rx).toBeCloseTo(15.68, 1);
  });

  it('uses stable shadow offset constants', () => {
    expect(SCENIC_BUILDING_GROUNDING_SHADOW_OFFSET_X).toBeGreaterThan(0);
  });
});
