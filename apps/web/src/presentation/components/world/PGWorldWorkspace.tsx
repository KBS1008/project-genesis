'use client';

import { useMemo } from 'react';
import type { WorldOverviewViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import type { WorldInspectorViewData, WorldMapViewData } from '@/presentation/adapters/view-data/world-view-data';
import { PGWorkspaceFrame } from '@/presentation/components/layout';
import { PGMiniMap } from '@/presentation/components/world/PGMiniMap';
import { PGWorldInspector } from '@/presentation/components/world/PGWorldInspector';
import { PGWorldLayerManager } from '@/presentation/components/world/PGWorldLayerManager';
import { PGWorldToolbar } from '@/presentation/components/world/PGWorldToolbar';
import { PGWorldViewport } from '@/presentation/components/world/PGWorldViewport';
import { useWorldCamera } from '@/presentation/hooks/useWorldCamera';
import { useWorldLayers } from '@/presentation/hooks/useWorldLayers';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';

/** World map workspace shell (Phase 4A framework). */
export function PGWorldWorkspace({
  world,
  map,
  selectedRegionId,
  inspector,
  onSelectRegion,
  onClearSelection,
}: {
  readonly world: WorldOverviewViewData;
  readonly map: WorldMapViewData;
  readonly selectedRegionId: string | null;
  readonly inspector: WorldInspectorViewData | null;
  readonly onSelectRegion: (regionId: string) => void;
  readonly onClearSelection?: () => void;
}) {
  const { layers, toggleLayer, isLayerEnabled } = useWorldLayers();
  const {
    camera,
    viewportRef,
    fitWorld,
    fitRegion,
    zoomIn,
    zoomOut,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useWorldCamera(map.regions);

  const layerState = useMemo(
    () =>
      Object.freeze({
        grid: isLayerEnabled('grid'),
        regions: isLayerEnabled('regions'),
        connections: isLayerEnabled('connections'),
        labels: isLayerEnabled('labels'),
        selection: isLayerEnabled('selection'),
      }),
    [isLayerEnabled],
  );

  return (
    <PGWorkspaceFrame
      inspector={
        <PGWorldInspector
          inspector={inspector}
          onClose={
            onClearSelection !== undefined && selectedRegionId !== null
              ? onClearSelection
              : undefined
          }
        />
      }
    >
      <div className="pg-world-workspace">
        <header className="pg-world-header">
          <div>
            <h2 className="pg-widget-title">{world.worldName}</h2>
            <p className="pg-world-header-copy">
              {world.regionCountLabel} Regionen · {world.cityCountLabel} Städte · {map.mapName}
            </p>
          </div>
        </header>

        <PGWorldToolbar
          camera={camera}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onFitWorld={fitWorld}
          onFitRegion={() => {
            fitRegion(selectedRegionId);
          }}
          hasRegionSelection={selectedRegionId !== null}
        />

        <div className="pg-world-layout">
          <div className="pg-world-map-column">
            <PGWorldViewport
              map={map}
              selectedRegionId={selectedRegionId}
              layers={layerState}
              camera={camera}
              viewportRef={viewportRef}
              onSelectRegion={onSelectRegion}
              onWheel={onWheel}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            />
            <PGMiniMap
              map={map}
              selectedRegionId={selectedRegionId}
              camera={camera}
              viewportRef={viewportRef}
            />
          </div>

          <PGWorldLayerManager layers={layers} onToggleLayer={toggleLayer} />
        </div>

        <section className="pg-world-region-table" aria-label="Regionenliste">
          <h3 className="pg-widget-title">Regionen</h3>
          <QueryRows
            columns={['Region', 'Biom', 'Karte', 'Städte']}
            selectedRowId={selectedRegionId}
            onRowClick={onSelectRegion}
            rows={world.regions.map((region) => ({
              id: region.id,
              cells: [
                region.name,
                region.biomeId,
                region.mapPositionLabel,
                String(region.cityCount),
              ],
            }))}
          />
        </section>
      </div>
    </PGWorkspaceFrame>
  );
}
