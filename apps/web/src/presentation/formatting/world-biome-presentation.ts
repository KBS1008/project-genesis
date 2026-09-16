/** Player-facing biome presentation for the world map (Slice 1). */

export type WorldBiomeLegendEntry = {
  readonly biomeId: string;
  readonly label: string;
  readonly categoryKey: string;
};

/** Normalizes authoritative biome category strings for CSS/presentation keys. */
export function normalizeBiomeCategoryKey(category: string): string {
  return category.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/** CSS surface class for a biome category from authoritative content. */
export function worldBiomeSurfaceClass(category: string): string {
  return `pg-world-region-surface-${normalizeBiomeCategoryKey(category)}`;
}

/** SVG pattern id for a biome category (must match PGWorldCanvas defs). */
export function worldBiomePatternId(category: string): string {
  return `pg-world-biome-pattern-${normalizeBiomeCategoryKey(category)}`;
}

/** Minimap fill class aligned with main-map biome surfaces. */
export function worldBiomeMinimapClass(category: string): string {
  return `pg-world-minimap-region-surface-${normalizeBiomeCategoryKey(category)}`;
}

/** Builds compact legend entries for biomes present on the current map. */
export function buildWorldBiomeLegendEntries(
  regions: readonly { readonly biomeId: string; readonly biomeLabel: string; readonly biomeCategory: string }[],
): readonly WorldBiomeLegendEntry[] {
  const byId = new Map<string, WorldBiomeLegendEntry>();

  for (const region of regions) {
    if (byId.has(region.biomeId)) {
      continue;
    }

    byId.set(
      region.biomeId,
      Object.freeze({
        biomeId: region.biomeId,
        label: region.biomeLabel,
        categoryKey: normalizeBiomeCategoryKey(region.biomeCategory),
      }),
    );
  }

  return Object.freeze(
    [...byId.values()].sort((left, right) => left.label.localeCompare(right.label, 'de')),
  );
}
