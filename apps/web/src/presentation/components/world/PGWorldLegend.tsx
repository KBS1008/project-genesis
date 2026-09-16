'use client';

import type { WorldBiomeLegendEntry } from '@/presentation/formatting/world-biome-presentation';
import type { WorldLayerViewData } from '@/presentation/adapters/view-data/world-view-data';

/** Legend for active world map layers and biome surfaces. */
export function PGWorldLegend({
  layers,
  biomeEntries,
}: {
  readonly layers: readonly WorldLayerViewData[];
  readonly biomeEntries: readonly WorldBiomeLegendEntry[];
}) {
  const activeLayers = layers.filter((layer) => layer.enabled);

  if (activeLayers.length === 0 && biomeEntries.length === 0) {
    return null;
  }

  return (
    <aside className="pg-world-legend" aria-label="Kartenlegende">
      <h4 className="pg-world-legend-title">Legende</h4>
      {biomeEntries.length > 0 ? (
        <>
          <p className="pg-world-legend-group-label">Biome</p>
          <ul className="pg-world-legend-list">
            {biomeEntries.map((entry) => (
              <li key={entry.biomeId}>
                <span
                  className={`pg-world-legend-swatch pg-world-legend-swatch-biome-${entry.categoryKey}`}
                />
                {entry.label}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {activeLayers.length > 0 ? (
        <>
          <p className="pg-world-legend-group-label">Ebenen</p>
          <ul className="pg-world-legend-list">
            {activeLayers.map((layer) => (
              <li key={layer.id}>
                <span className={`pg-world-legend-swatch pg-world-legend-swatch-${layer.id}`} />
                {layer.label}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </aside>
  );
}
