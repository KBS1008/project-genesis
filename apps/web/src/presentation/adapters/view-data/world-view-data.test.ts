import { describe, expect, it } from 'vitest';
import { DEFAULT_WORLD_LAYERS } from '@/presentation/adapters/view-data/world-view-data';

describe('world-view-data defaults', () => {
  it('keeps the orientation grid off by default', () => {
    const gridLayer = DEFAULT_WORLD_LAYERS.find((layer) => layer.id === 'grid');
    expect(gridLayer?.enabled).toBe(false);
    expect(gridLayer?.label).toBe('Orientierungsraster');
  });
});
