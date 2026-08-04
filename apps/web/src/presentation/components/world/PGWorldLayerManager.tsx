'use client';

import type { WorldLayerViewData } from '@/presentation/adapters/view-data/world-view-data';

/** Toggle panel for framework world map layers. */
export function PGWorldLayerManager({
  layers,
  onToggleLayer,
}: {
  readonly layers: readonly WorldLayerViewData[];
  readonly onToggleLayer: (layerId: WorldLayerViewData['id']) => void;
}) {
  return (
    <aside className="pg-world-layer-panel" aria-label="Ebenen">
      <h3 className="pg-world-layer-title">Ebenen</h3>
      <ul className="pg-world-layer-list">
        {layers.map((layer) => (
          <li key={layer.id} className="pg-world-layer-item">
            <label>
              <input
                type="checkbox"
                checked={layer.enabled}
                onChange={() => {
                  onToggleLayer(layer.id);
                }}
              />
              <span>
                <strong>{layer.label}</strong>
                <br />
                {layer.description}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </aside>
  );
}
