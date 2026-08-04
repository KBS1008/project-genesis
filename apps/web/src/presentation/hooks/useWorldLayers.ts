'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  DEFAULT_WORLD_LAYERS,
  type WorldLayerId,
  type WorldLayerViewData,
} from '@/presentation/adapters/view-data/world-view-data';

/** Layer visibility state for the world map framework. */
export function useWorldLayers() {
  const [enabledLayers, setEnabledLayers] = useState<ReadonlySet<WorldLayerId>>(
    () => new Set(DEFAULT_WORLD_LAYERS.map((layer) => layer.id)),
  );

  const layers = useMemo(
    (): readonly WorldLayerViewData[] =>
      DEFAULT_WORLD_LAYERS.map((layer) =>
        Object.freeze({
          ...layer,
          enabled: enabledLayers.has(layer.id),
        }),
      ),
    [enabledLayers],
  );

  const toggleLayer = useCallback((layerId: WorldLayerId) => {
    setEnabledLayers((current) => {
      const next = new Set(current);
      if (next.has(layerId)) {
        next.delete(layerId);
      } else {
        next.add(layerId);
      }
      return next;
    });
  }, []);

  const isLayerEnabled = useCallback(
    (layerId: WorldLayerId) => enabledLayers.has(layerId),
    [enabledLayers],
  );

  return { layers, toggleLayer, isLayerEnabled };
}
