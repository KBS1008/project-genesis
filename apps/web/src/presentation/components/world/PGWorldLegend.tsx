'use client';

import type { WorldBiomeLegendEntry } from '@/presentation/formatting/world-biome-presentation';
import type { WorldLayerViewData } from '@/presentation/adapters/view-data/world-view-data';

/** Legend for active world map layers and biome surfaces. */
export function PGWorldLegend({
  layers,
  biomeEntries,
  compact = false,
  activeTransportRouteCount = null,
}: {
  readonly layers: readonly WorldLayerViewData[];
  readonly biomeEntries: readonly WorldBiomeLegendEntry[];
  readonly compact?: boolean;
  /** When transport layer is enabled, number of active inter-region routes (Slice 6). */
  readonly activeTransportRouteCount?: number | null;
}) {
  const activeLayers = layers.filter((layer) => layer.enabled);

  if (activeLayers.length === 0 && biomeEntries.length === 0) {
    return null;
  }

  const legendBody = (
    <>
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
                {layer.id === 'transport' &&
                layer.enabled &&
                activeTransportRouteCount !== null &&
                activeTransportRouteCount > 0 ? (
                  <span className="pg-world-legend-meta">
                    {' '}
                    · {activeTransportRouteCount}{' '}
                    {activeTransportRouteCount === 1 ? 'Route aktiv' : 'Routen aktiv'}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );

  if (compact) {
    return (
      <details className="pg-world-legend pg-world-legend--compact">
        <summary className="pg-world-legend-title">Legende</summary>
        {legendBody}
      </details>
    );
  }

  return (
    <aside className="pg-world-legend" aria-label="Kartenlegende">
      <h4 className="pg-world-legend-title">Legende</h4>
      {legendBody}
    </aside>
  );
}
