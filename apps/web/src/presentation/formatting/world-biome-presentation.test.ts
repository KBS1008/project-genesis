import { describe, expect, it } from 'vitest';
import {
  buildWorldBiomeLegendEntries,
  normalizeBiomeCategoryKey,
  worldBiomeSurfaceClass,
} from '@/presentation/formatting/world-biome-presentation';

describe('world-biome-presentation', () => {
  it('normalizes authoritative biome categories for presentation keys', () => {
    expect(normalizeBiomeCategoryKey('FOREST')).toBe('forest');
    expect(worldBiomeSurfaceClass('PLAINS')).toBe('pg-world-region-surface-plains');
  });

  it('builds legend entries from map regions without raw biome ids as labels', () => {
    const entries = buildWorldBiomeLegendEntries([
      {
        biomeId: 'biome_temperate_forest',
        biomeLabel: 'Temperate Forest',
        biomeCategory: 'FOREST',
      },
      {
        biomeId: 'biome_industrial_plains',
        biomeLabel: 'Industrial Plains',
        biomeCategory: 'PLAINS',
      },
    ]);

    expect(entries.map((entry) => entry.label)).toEqual(['Industrial Plains', 'Temperate Forest']);
    expect(entries.every((entry) => entry.label.startsWith('biome_') === false)).toBe(true);
  });
});
