'use client';

import { useCallback, useMemo, useRef, type PointerEvent } from 'react';
import type { WorldOverviewViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import type {
  WorldBuildingMarkerViewData,
  WorldInspectorViewData,
  WorldMapViewData,
  WorldOverlayViewData,
} from '@/presentation/adapters/view-data/world-view-data';
import {
  projectDomainPlacementPosition,
  resolveCompanyPlacementProjectionContext,
  resolveWorldCanvasExtent,
  unprojectWorldLogicalPoint,
} from '@/presentation/adapters/mappers/company-building-placement-coordinates';
import { PGWorkspaceFrame } from '@/presentation/components/layout';
import { PGMiniMap } from '@/presentation/components/world/PGMiniMap';
import { PGWorldInspector } from '@/presentation/components/world/PGWorldInspector';
import { PGWorldLayerManager } from '@/presentation/components/world/PGWorldLayerManager';
import { PGWorldLegend } from '@/presentation/components/world/PGWorldLegend';
import { PGWorldToolbar } from '@/presentation/components/world/PGWorldToolbar';
import { PGWorldViewport } from '@/presentation/components/world/PGWorldViewport';
import { buildWorldBiomeLegendEntries } from '@/presentation/formatting/world-biome-presentation';
import {
  isPointerDrag,
  viewportPointerToWorldLogical,
} from '@/presentation/hooks/world-viewport-pointer';
import { useWorldCamera } from '@/presentation/hooks/useWorldCamera';
import { useWorldLayers } from '@/presentation/hooks/useWorldLayers';
import type { BuildingMapPlacementSession } from '@/presentation/navigation/building-map-placement-session';
import { Button } from '@/presentation/primitives/Button';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';

/** World map workspace shell (Phase 4A framework + Phase 4B overlays). */
export function PGWorldWorkspace({
  world,
  map,
  overlays,
  selectedRegionId,
  inspector,
  onSelectRegion,
  onSelectBuilding,
  onClearSelection,
  selectedBuildingId = null,
  inspectorSectionActions,
  buildingMapPlacementSession = null,
  buildingTypeLabel,
  onPickBuildingMapPlacementCandidate,
  onConfirmBuildingMapPlacement,
  onCancelBuildingMapPlacement,
  isBusy = false,
}: {
  readonly world: WorldOverviewViewData;
  readonly map: WorldMapViewData;
  readonly overlays: WorldOverlayViewData;
  readonly selectedRegionId: string | null;
  readonly selectedBuildingId?: string | null;
  readonly inspector: WorldInspectorViewData | null;
  readonly onSelectRegion: (regionId: string) => void;
  readonly onSelectBuilding?: (buildingId: string) => void;
  readonly onClearSelection?: () => void;
  readonly inspectorSectionActions?: Readonly<Record<string, { readonly actionLabel: string; readonly onAction: () => void }>>;
  readonly buildingMapPlacementSession?: BuildingMapPlacementSession | null;
  readonly buildingTypeLabel?: (buildingTypeId: string) => string;
  readonly onPickBuildingMapPlacementCandidate?: (
    candidate: { readonly x: number; readonly y: number } | null,
  ) => void;
  readonly onConfirmBuildingMapPlacement?: () => void;
  readonly onCancelBuildingMapPlacement?: () => void;
  readonly isBusy?: boolean;
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

  const placementMode = buildingMapPlacementSession !== null;
  const placementDragStartRef = useRef<{ readonly x: number; readonly y: number } | null>(null);

  const placementProjectionContext = useMemo(
    () => resolveCompanyPlacementProjectionContext(map.regions),
    [map.regions],
  );

  const canvasExtent = useMemo(() => {
    const baseWidth = map.columns * map.cellSize;
    const baseHeight = map.rows * map.cellSize;
    const worldPoints = overlays.buildingMarkers.map((marker) =>
      Object.freeze({ x: marker.x, y: marker.y }),
    );

    const candidate = buildingMapPlacementSession?.candidate;
    if (candidate !== null && candidate !== undefined && placementProjectionContext !== null) {
      worldPoints.push(projectDomainPlacementPosition(candidate, placementProjectionContext));
    }

    return resolveWorldCanvasExtent({
      baseWidth,
      baseHeight,
      worldPoints,
    });
  }, [
    buildingMapPlacementSession?.candidate,
    map.cellSize,
    map.columns,
    map.rows,
    overlays.buildingMarkers,
    placementProjectionContext,
  ]);

  const placementPreviewMarker = useMemo((): WorldBuildingMarkerViewData | null => {
    const session = buildingMapPlacementSession;
    if (session === null || session.candidate === null || placementProjectionContext === null) {
      return null;
    }

    const anchor = projectDomainPlacementPosition(session.candidate, placementProjectionContext);

    return Object.freeze({
      id: '__building_map_placement_preview__',
      buildingTypeId: session.buildingTypeId,
      regionId: '',
      label: session.name,
      statusLabel: 'PREVIEW',
      clusterSize: 1,
      x: anchor.x,
      y: anchor.y,
    });
  }, [buildingMapPlacementSession, placementProjectionContext]);

  const resolvePlacementPick = useCallback(
    (localX: number, localY: number) => {
      if (placementProjectionContext === null || onPickBuildingMapPlacementCandidate === undefined) {
        return;
      }

      const worldLogical = viewportPointerToWorldLogical(localX, localY, camera);
      onPickBuildingMapPlacementCandidate(
        unprojectWorldLogicalPoint(worldLogical, placementProjectionContext),
      );
    },
    [camera, onPickBuildingMapPlacementCandidate, placementProjectionContext],
  );

  const handleViewportPointerDown = useCallback(
    (event: PointerEvent) => {
      onPointerDown(event);

      if (!placementMode || viewportRef.current === null) {
        return;
      }

      const rect = viewportRef.current.getBoundingClientRect();
      placementDragStartRef.current = Object.freeze({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    },
    [onPointerDown, placementMode, viewportRef],
  );

  const handleViewportPointerUp = useCallback(
    (event: PointerEvent) => {
      onPointerUp(event);

      const dragStart = placementDragStartRef.current;
      placementDragStartRef.current = null;

      if (!placementMode || viewportRef.current === null || dragStart === null) {
        return;
      }

      const rect = viewportRef.current.getBoundingClientRect();
      const endX = event.clientX - rect.left;
      const endY = event.clientY - rect.top;

      if (isPointerDrag(dragStart.x, dragStart.y, endX, endY)) {
        return;
      }

      resolvePlacementPick(endX, endY);
    },
    [onPointerUp, placementMode, resolvePlacementPick, viewportRef],
  );

  const biomeLegendEntries = useMemo(
    () => buildWorldBiomeLegendEntries(map.regions),
    [map.regions],
  );

  const layerState = useMemo(
    () =>
      Object.freeze({
        grid: isLayerEnabled('grid'),
        regions: isLayerEnabled('regions'),
        connections: isLayerEnabled('connections'),
        labels: isLayerEnabled('labels'),
        selection: isLayerEnabled('selection'),
        resources: isLayerEnabled('resources'),
        buildings: isLayerEnabled('buildings'),
        transport: isLayerEnabled('transport'),
        presence: isLayerEnabled('presence'),
      }),
    [isLayerEnabled],
  );

  const placementTypeLabel =
    buildingMapPlacementSession !== null && buildingTypeLabel !== undefined
      ? buildingTypeLabel(buildingMapPlacementSession.buildingTypeId)
      : null;

  const canConfirmPlacement =
    buildingMapPlacementSession !== null &&
    buildingMapPlacementSession.candidate !== null &&
    buildingMapPlacementSession.canPlace &&
    !isBusy;

  return (
    <PGWorkspaceFrame
      inspector={
        placementMode ? null : (
          <PGWorldInspector
            inspector={inspector}
            sectionActions={inspectorSectionActions}
            onClose={
              onClearSelection !== undefined && selectedRegionId !== null
                ? onClearSelection
                : undefined
            }
          />
        )
      }
    >
      <div className="pg-world-workspace pg-world-with-assets">
        <div className="pg-world-asset-frame" aria-hidden="true" data-asset-id="WM-SVG-GRID" />
        <header className="pg-world-header">
          <div>
            <h2 className="pg-widget-title">{world.worldName}</h2>
            <p className="pg-world-header-copy">
              {world.regionCountLabel} Regionen · {world.cityCountLabel} Städte · {map.mapName}
            </p>
          </div>
          <PGWorldLegend layers={layers} biomeEntries={biomeLegendEntries} />
        </header>

        {placementMode && buildingMapPlacementSession !== null ? (
          <section
            className="pg-world-placement-mode"
            aria-label="Gebäudeplatzierung auf der Karte"
          >
            <div className="pg-world-placement-mode-copy">
              <p className="pg-widget-title">{buildingMapPlacementSession.name}</p>
              {placementTypeLabel !== null ? (
                <p className="pg-world-header-copy">{placementTypeLabel}</p>
              ) : null}
              <p className="pg-world-placement-mode-instruction">
                Tippen oder klicken Sie auf die Karte, um die Position zu wählen.
              </p>
              <p className="pg-world-placement-mode-candidate" aria-live="polite">
                {buildingMapPlacementSession.candidate === null
                  ? 'Noch keine Position gewählt.'
                  : `Gewählte Position: ${buildingMapPlacementSession.candidate.x}, ${buildingMapPlacementSession.candidate.y}`}
              </p>
            </div>
            <div className="pg-world-placement-mode-actions">
              <Button
                disabled={!canConfirmPlacement}
                onClick={() => {
                  onConfirmBuildingMapPlacement?.();
                }}
              >
                Gebäude platzieren
              </Button>
              <Button
                variant="secondary"
                disabled={isBusy}
                onClick={() => {
                  onCancelBuildingMapPlacement?.();
                }}
              >
                Abbrechen
              </Button>
            </div>
          </section>
        ) : null}

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
              overlays={overlays}
              selectedRegionId={selectedRegionId}
              layers={layerState}
              camera={camera}
              viewportRef={viewportRef}
              onSelectRegion={onSelectRegion}
              onSelectBuilding={onSelectBuilding}
              selectedBuildingId={selectedBuildingId}
              onWheel={onWheel}
              onPointerDown={handleViewportPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={handleViewportPointerUp}
              canvasWidth={canvasExtent.width}
              canvasHeight={canvasExtent.height}
              buildingPlacementMode={placementMode}
              suppressMapEntitySelection={placementMode}
              placementPreviewMarker={placementPreviewMarker}
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

        {placementMode ? null : (
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
                  region.biomeLabel,
                  region.mapPositionLabel,
                  String(region.cityCount),
                ],
              }))}
            />
          </section>
        )}
      </div>
    </PGWorkspaceFrame>
  );
}
