'use client';

import type { WorldLayerViewData } from '@/presentation/adapters/view-data/world-view-data';

/** Legend for active world map layers. */
export function PGWorldLegend({
  layers,
}: {
  readonly layers: readonly WorldLayerViewData[];
}) {
  const activeLayers = layers.filter((layer) => layer.enabled);

  if (activeLayers.length === 0) {
    return null;
  }

  return (
    <aside className="pg-world-legend" aria-label="Kartenlegende">
      <h4 className="pg-world-legend-title">Legende</h4>
      <ul className="pg-world-legend-list">
        {activeLayers.map((layer) => (
          <li key={layer.id}>
            <span className={`pg-world-legend-swatch pg-world-legend-swatch-${layer.id}`} />
            {layer.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
