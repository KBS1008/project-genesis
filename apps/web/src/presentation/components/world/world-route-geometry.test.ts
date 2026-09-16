import { describe, expect, it } from 'vitest';
import { buildWorldRoutePath } from '@/presentation/components/world/world-route-geometry';

describe('world-route-geometry', () => {
  it('builds deterministic curved route paths', () => {
    const first = buildWorldRoutePath(0, 0, 100, 0, 'region_a-region_b');
    const second = buildWorldRoutePath(0, 0, 100, 0, 'region_a-region_b');

    expect(first).toBe(second);
    expect(first.startsWith('M 0 0 Q')).toBe(true);
  });
});
