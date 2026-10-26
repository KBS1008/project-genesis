'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import {
  COMPANY_PLACEMENT_DEFAULT_REGION_ID,
  projectDomainPlacementPosition,
  resolveCompanyPlacementProjectionContext,
  resolveWorldCanvasExtent,
  unprojectWorldLogicalPoint,
} from '@/presentation/adapters/mappers/company-building-placement-coordinates';
import {
  projectScenicVisualToRegionLogical,
  resolveScenicPlateWorldBounds,
  resolveScenicPresentationContext,
  resolveScenicRegionAnchorWorld,
} from '@/presentation/adapters/mappers/world-scenic-visual-projection';
import type { WorldOverviewViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import type {
  WorldInspectorViewData,
  WorldMapViewData,
  WorldOverlayViewData,
} from '@/presentation/adapters/view-data/world-view-data';
import { PGWorkspaceFrame } from '@/presentation/components/layout';
import { PGMiniMap } from '@/presentation/components/world/PGMiniMap';
import { PGWorldInspector } from '@/presentation/components/world/PGWorldInspector';
import { PGWorldLayerManager } from '@/presentation/components/world/PGWorldLayerManager';
import { PGWorldLegend } from '@/presentation/components/world/PGWorldLegend';
import { PGWorldToolbar } from '@/presentation/components/world/PGWorldToolbar';
import { PGRegionMapView } from '@/presentation/components/world/PGRegionMapView';
import { PGWorldViewport } from '@/presentation/components/world/PGWorldViewport';
import { buildWorldBiomeLegendEntries } from '@/presentation/formatting/world-biome-presentation';
import {
  isPointerDrag,
  viewportPointerToWorldLogical,
} from '@/presentation/hooks/world-viewport-pointer';
import { useWorldCamera } from '@/presentation/hooks/useWorldCamera';
import {
  filterBuildingMarkersForRegionFocus,
  isRegionFocusViewMode,
  shouldShowIndividualBuildingMarkers,
  type WorldMapViewMode,
} from '@/presentation/hooks/world-map-view-mode';
import {
  resolveRegionGridWorldBounds,
  shiftWorldBoundsToLayerLocal,
} from '@/presentation/hooks/world-region-presentation-bounds';
import {
  WORLD_CAMERA_OVERVIEW_SCALE_LIMITS,
  WORLD_CAMERA_REGION_FOCUS_SCALE_LIMITS,
  type WorldCameraState,
} from '@/presentation/hooks/world-camera-math';
import { useWorldLayers } from '@/presentation/hooks/useWorldLayers';
import type { BuildingMapPlacementSession } from '@/presentation/navigation/building-map-placement-session';
import { Button } from '@/presentation/primitives/Button';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';
import { resolveWorldScenicPresentationProfile } from '@/presentation/adapters/mappers/world-scenic-presentation-profile';
import {
  isWorldScenicBackgroundEnabled,
  isWorldScenicIntegrationBannerVisible,
} from '@/presentation/config/world-scenic-feature';

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
  const placementMode = buildingMapPlacementSession !== null;
  const placementDragStartRef = useRef<{ readonly x: number; readonly y: number } | null>(null);
  const [mapViewMode, setMapViewMode] = useState<WorldMapViewMode>('overview');
  const regionCameraFocusRef = useRef<string | null>(null);
  const overviewCameraRef = useRef<WorldCameraState | null>(null);

  const regionFocusRegionId = isRegionFocusViewMode(mapViewMode, selectedRegionId)
    ? selectedRegionId
    : null;

  const regionMapBuildingMarkers = useMemo(
    () =>
      filterBuildingMarkersForRegionFocus(
        overlays.buildingMarkers,
        mapViewMode,
        regionFocusRegionId,
      ),
    [mapViewMode, overlays.buildingMarkers, regionFocusRegionId],
  );

  const placementProjectionContext = useMemo(
    () => resolveCompanyPlacementProjectionContext(map.regions),
    [map.regions],
  );

  const scenicPresentationProfile = useMemo(() => {
    if (!isWorldScenicBackgroundEnabled()) {
      return null;
    }

    return resolveWorldScenicPresentationProfile(map.mapId);
  }, [map.mapId]);

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

  const scenicPresentationContext = useMemo(() => {
    if (scenicPresentationProfile === null) {
      return null;
    }

    return resolveScenicPresentationContext(
      scenicPresentationProfile,
      canvasExtent.width,
      canvasExtent.height,
      map.cellSize,
    );
  }, [canvasExtent.height, canvasExtent.width, map.cellSize, scenicPresentationProfile]);

  const resolveScenicRegionFocusWorldCenter = useMemo(() => {
    if (scenicPresentationContext === null) {
      return undefined;
    }

    const context = scenicPresentationContext;
    return (region: (typeof map.regions)[number]) =>
      resolveScenicRegionAnchorWorld(region.id, context);
  }, [scenicPresentationContext]);

  const scenicFitWorldBounds = useMemo(() => {
    if (scenicPresentationContext === null) {
      return null;
    }

    return resolveScenicPlateWorldBounds(scenicPresentationContext.layout);
  }, [scenicPresentationContext]);

  const resolveFitWorldBounds = useMemo(() => {
    if (scenicFitWorldBounds === null) {
      return undefined;
    }

    return () => scenicFitWorldBounds;
  }, [scenicFitWorldBounds]);

  const placementRegion = useMemo(
    () =>
      map.regions.find((entry) => entry.id === COMPANY_PLACEMENT_DEFAULT_REGION_ID) ??
      map.regions[0],
    [map.regions],
  );

  const resolveRegionFitBounds = useCallback(
    (regionId: string) => {
      const region = map.regions.find((entry) => entry.id === regionId);
      if (region === undefined) {
        return null;
      }

      return resolveRegionGridWorldBounds(region, map.cellSize, 24);
    },
    [map.cellSize, map.regions],
  );

  const resolveInteractionBounds = useCallback(() => {
    if (regionFocusRegionId === null) {
      return null;
    }

    const region = map.regions.find((entry) => entry.id === regionFocusRegionId);
    if (region === undefined) {
      return null;
    }

    return shiftWorldBoundsToLayerLocal(resolveRegionGridWorldBounds(region, map.cellSize, 24));
  }, [map.cellSize, map.regions, regionFocusRegionId]);

  const regionPresentationBounds = useMemo(() => {
    if (regionFocusRegionId === null) {
      return null;
    }

    const region = map.regions.find((entry) => entry.id === regionFocusRegionId);
    if (region === undefined) {
      return null;
    }

    return resolveRegionGridWorldBounds(region, map.cellSize, 24);
  }, [map.cellSize, map.regions, regionFocusRegionId]);

  const viewportCanvasExtent = useMemo(() => {
    if (regionFocusRegionId === null) {
      return canvasExtent;
    }

    const region = map.regions.find((entry) => entry.id === regionFocusRegionId);
    if (region === undefined) {
      return canvasExtent;
    }

    const bounds = resolveRegionGridWorldBounds(region, map.cellSize, 24);
    return Object.freeze({
      width: bounds.maxX - bounds.minX,
      height: bounds.maxY - bounds.minY,
    });
  }, [canvasExtent, map.cellSize, map.regions, regionFocusRegionId]);

  const resolveCameraScaleLimits = useCallback(() => {
    if (regionFocusRegionId === null) {
      return WORLD_CAMERA_OVERVIEW_SCALE_LIMITS;
    }

    return WORLD_CAMERA_REGION_FOCUS_SCALE_LIMITS;
  }, [regionFocusRegionId]);

  const viewportScenicProfile =
    regionFocusRegionId === null ? scenicPresentationProfile : null;

  const minimapScenicContext =
    regionFocusRegionId === null ? scenicPresentationContext : null;

  const {
    camera,
    viewportRef,
    fitWorld,
    zoomIn,
    zoomOut,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    isDragging,
    bindViewportElement,
  } = useWorldCamera(map.regions, {
    resolveRegionFocusWorldCenter: resolveScenicRegionFocusWorldCenter,
    resolveFitWorldBounds,
    resolveInteractionBounds,
    resolveRegionFitBounds,
    resolveCameraScaleLimits,
  });

  const handleSelectRegion = useCallback(
    (regionId: string) => {
      if (placementMode) {
        onSelectRegion(regionId);
        setMapViewMode('region_focus');
        return;
      }

      overviewCameraRef.current = camera;
      onSelectRegion(regionId);
      setMapViewMode('region_focus');
    },
    [camera, onSelectRegion, placementMode],
  );

  const handleBackToWorldOverview = useCallback(() => {
    setMapViewMode('overview');
    regionCameraFocusRef.current = null;
    onClearSelection?.();
    if (placementMode) {
      onPickBuildingMapPlacementCandidate?.(null);
    }
    fitWorld();
    overviewCameraRef.current = null;
  }, [fitWorld, onClearSelection, onPickBuildingMapPlacementCandidate, placementMode]);

  useEffect(() => {
    if (placementMode) {
      return;
    }

    if (mapViewMode !== 'region_focus' || selectedRegionId === null) {
      return;
    }

    if (regionCameraFocusRef.current === selectedRegionId) {
      return;
    }

    regionCameraFocusRef.current = selectedRegionId;
    // REGION_MAP (Slice 1): static landscape — no overview camera fitRegion transform.
  }, [mapViewMode, placementMode, selectedRegionId]);

  useEffect(() => {
    if (selectedRegionId === null && mapViewMode === 'region_focus') {
      setMapViewMode('overview');
      regionCameraFocusRef.current = null;
    }
  }, [mapViewMode, selectedRegionId]);

  useEffect(() => {
    if (selectedRegionId === null || mapViewMode !== 'overview') {
      return;
    }

    if (
      placementMode &&
      (buildingMapPlacementSession?.regionId === null ||
        buildingMapPlacementSession?.regionId !== selectedRegionId)
    ) {
      return;
    }

    setMapViewMode('region_focus');
  }, [buildingMapPlacementSession?.regionId, mapViewMode, placementMode, selectedRegionId]);

  const selectedRegionName = useMemo(() => {
    if (selectedRegionId === null) {
      return null;
    }

    return map.regions.find((region) => region.id === selectedRegionId)?.name ?? selectedRegionId;
  }, [map.regions, selectedRegionId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (scenicFitWorldBounds === null) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      fitWorld();
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
    // Initial scenic fit when plate bounds resolve; omit fitWorld to avoid resetting user zoom/pan.
  }, [scenicFitWorldBounds]);

  const resolvePlacementPick = useCallback(
    (localX: number, localY: number) => {
      if (placementProjectionContext === null || onPickBuildingMapPlacementCandidate === undefined) {
        return;
      }

      const worldVisual = viewportPointerToWorldLogical(localX, localY, camera);
      const logicalForDomain =
        scenicPresentationContext !== null && placementRegion !== undefined
          ? projectScenicVisualToRegionLogical(
              worldVisual,
              placementRegion,
              scenicPresentationContext,
            )
          : worldVisual;

      onPickBuildingMapPlacementCandidate(
        unprojectWorldLogicalPoint(logicalForDomain, placementProjectionContext),
      );
    },
    [
      camera,
      onPickBuildingMapPlacementCandidate,
      placementProjectionContext,
      placementRegion,
      scenicPresentationContext,
    ],
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
        buildings: shouldShowIndividualBuildingMarkers(
          mapViewMode,
          selectedRegionId,
          isLayerEnabled('buildings'),
        ),
        transport: isLayerEnabled('transport'),
        presence: isLayerEnabled('presence'),
      }),
    [isLayerEnabled, mapViewMode, selectedRegionId],
  );

  const placementTypeLabel =
    buildingMapPlacementSession !== null && buildingTypeLabel !== undefined
      ? buildingTypeLabel(buildingMapPlacementSession.buildingTypeId)
      : null;

  const canConfirmPlacement =
    buildingMapPlacementSession !== null &&
    buildingMapPlacementSession.candidate !== null &&
    buildingMapPlacementSession.canPlace &&
    buildingMapPlacementSession.validation?.valid === true &&
    regionFocusRegionId !== null &&
    buildingMapPlacementSession.regionId === regionFocusRegionId &&
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
                ? handleBackToWorldOverview
                : undefined
            }
          />
        )
      }
    >
      <div className="pg-world-workspace pg-world-with-assets pg-world-with-assets--map-focus">
        <div className="pg-world-asset-frame" aria-hidden="true" data-asset-id="WM-SVG-GRID" />
        <header className="pg-world-header">
          <div>
            <h2 className="pg-widget-title">{world.worldName}</h2>
            <p className="pg-world-header-copy">
              {world.regionCountLabel} Regionen · {world.cityCountLabel} Städte · {map.mapName}
            </p>
          </div>
          <PGWorldLegend compact layers={layers} biomeEntries={biomeLegendEntries} />
        </header>

        {placementMode && buildingMapPlacementSession !== null ? (
          <section
            className={`pg-world-placement-mode${canConfirmPlacement ? ' pg-world-placement-mode--ready' : ''}`}
            aria-label="Gebäudeplatzierung auf der Karte"
          >
            <div className="pg-world-placement-mode-copy">
              <p className="pg-widget-title">{buildingMapPlacementSession.name}</p>
              {placementTypeLabel !== null ? (
                <p className="pg-world-header-copy">{placementTypeLabel}</p>
              ) : null}
              <p className="pg-world-placement-mode-instruction">
                {regionFocusRegionId === null
                  ? 'Wählen Sie eine Region, um das Gebäude zu platzieren.'
                  : canConfirmPlacement
                    ? 'Position gewählt. Klicken Sie auf «Gebäude platzieren», um den Bau zu bestätigen.'
                    : buildingMapPlacementSession.candidate !== null &&
                        buildingMapPlacementSession.validation?.valid === false
                      ? 'Ungültige Position. Wählen Sie eine andere Stelle auf der Landschaft.'
                      : 'Bewegen Sie den Zeiger über die Landschaft und klicken Sie auf die grüne Vorschau oder eine gültige Stelle.'}
              </p>
              {buildingMapPlacementSession.validation?.valid === false &&
              buildingMapPlacementSession.validation.reason !== null ? (
                <p className="pg-world-placement-mode-invalid-reason" role="alert">
                  {buildingMapPlacementSession.validation.reason}
                </p>
              ) : null}
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

        {isWorldScenicIntegrationBannerVisible() ? (
          <p className="pg-world-scenic-integration-banner" role="note">
            QA / Entwicklung: 2D-Scenic (Placement-Konsistenz & Viewport-Fit). Standard-Welt bleibt bei
            deaktiviertem Schalter unverändert.
          </p>
        ) : null}

        {regionFocusRegionId !== null && selectedRegionName !== null ? (
          <div className="pg-world-region-focus-bar" role="status" aria-live="polite">
            <p className="pg-world-region-focus-bar-title">
              Region: <strong>{selectedRegionName}</strong>
            </p>
            <Button variant="secondary" type="button" onClick={handleBackToWorldOverview}>
              Zur Weltübersicht
            </Button>
          </div>
        ) : null}

        {regionFocusRegionId === null ? (
          <PGWorldToolbar
            camera={camera}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onFitWorld={fitWorld}
            onFitRegion={() => {
              if (selectedRegionId !== null) {
                setMapViewMode('region_focus');
                regionCameraFocusRef.current = null;
                regionCameraFocusRef.current = selectedRegionId;
              }
            }}
            hasRegionSelection={selectedRegionId !== null}
          />
        ) : null}

        <div className="pg-world-layout pg-world-layout--map-focus">
          <div className="pg-world-map-column">
            <div
              className={`pg-world-map-stage${regionFocusRegionId !== null ? ' is-region-landscape-map' : ''}`}
            >
              {regionFocusRegionId !== null && selectedRegionName !== null ? (
                <PGRegionMapView
                  regionId={regionFocusRegionId}
                  regionName={selectedRegionName}
                  buildingMarkers={regionMapBuildingMarkers}
                  selectedBuildingId={selectedBuildingId}
                  onSelectBuilding={onSelectBuilding}
                  placementSession={placementMode ? buildingMapPlacementSession : null}
                  onPickPlacementCandidate={
                    placementMode ? onPickBuildingMapPlacementCandidate : undefined
                  }
                />
              ) : (
                <>
                  <PGWorldViewport
                    map={map}
                    overlays={overlays}
                    selectedRegionId={selectedRegionId}
                    layers={layerState}
                    camera={camera}
                    isDragging={isDragging}
                    regionPresentationBounds={regionPresentationBounds}
                    viewportRef={viewportRef}
                    bindViewportElement={bindViewportElement}
                    onSelectRegion={handleSelectRegion}
                    regionFocusRegionId={regionFocusRegionId}
                    onSelectBuilding={onSelectBuilding}
                    selectedBuildingId={selectedBuildingId}
                    onWheel={onWheel}
                    onPointerDown={handleViewportPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={handleViewportPointerUp}
                    canvasWidth={viewportCanvasExtent.width}
                    canvasHeight={viewportCanvasExtent.height}
                    buildingPlacementMode={false}
                    suppressMapEntitySelection={placementMode && regionFocusRegionId !== null}
                    placementPreviewMarker={null}
                    scenicPresentationProfile={viewportScenicProfile}
                  />
                  <div className="pg-world-minimap-dock" aria-hidden={false}>
                    <PGMiniMap
                      map={map}
                      selectedRegionId={selectedRegionId}
                      camera={camera}
                      viewportRef={viewportRef}
                      scenicPresentationContext={minimapScenicContext}
                      regionFocusRegionId={regionFocusRegionId}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <details className="pg-world-layer-panel-shell pg-world-layer-panel-shell--compact" aria-label="Ebenen">
            <summary className="pg-widget-title">Ebenen</summary>
            <PGWorldLayerManager layers={layers} onToggleLayer={toggleLayer} />
          </details>
        </div>

        {placementMode ? null : (
          <details className="pg-world-region-table pg-world-region-table--compact" aria-label="Regionenliste">
            <summary className="pg-widget-title">Regionen</summary>
            <QueryRows
              columns={['Region', 'Biom', 'Karte', 'Städte']}
              selectedRowId={selectedRegionId}
              onRowClick={handleSelectRegion}
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
          </details>
        )}
      </div>
    </PGWorkspaceFrame>
  );
}
