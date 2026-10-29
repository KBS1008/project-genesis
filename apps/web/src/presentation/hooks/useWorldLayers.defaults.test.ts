import { describe, expect, it } from 'vitest';
import { DEFAULT_WORLD_LAYERS } from '@/presentation/adapters/view-data/world-view-data';

describe('DEFAULT_WORLD_LAYERS (Slice 6 defaults)', () => {
  it('enables transport by default and keeps resources heatmap off', () => {
    const byId = Object.fromEntries(DEFAULT_WORLD_LAYERS.map((layer) => [layer.id, layer.enabled]));

    expect(byId.transport).toBe(true);
    expect(byId.resources).toBe(false);
    expect(byId.buildings).toBe(true);
    expect(byId.presence).toBe(true);
  });
});
