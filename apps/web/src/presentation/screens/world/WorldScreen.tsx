'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  mapWorldOverlayViewData,
  mapWorldRegionInspectorViewData,
  mapWorldRegionOperationsViewData,
} from '@/presentation/adapters/mappers/world-overlay-mappers';
import { mapWorldMapViewData } from '@/presentation/adapters/mappers/world-view-mappers';
import { mapRegionDetailViewData } from '@/presentation/adapters/mappers/workspace-view-mappers';
import {
  fetchBuildingList,
  fetchProductionJobs,
  fetchRegionDetails,
  fetchTransportOrders,
} from '@/presentation/adapters/api/query-client';
import { fetchWorldMap } from '@/presentation/adapters/api/world-client';
import { EMPTY_WORLD_OVERLAY } from '@/presentation/adapters/view-data/world-view-data';
import { PGWorldBuildingInspector, PGWorldWorkspace } from '@/presentation/components/world';
import { buildWorldMapBuildingInspectorDetail } from '@/presentation/components/world/map-world-building-selection';
import { buildWorldBuildingInspectorNavigationViewData } from '@/presentation/components/world/world-building-inspector-navigation';
import { buildWorldBuildingInspectorProductionViewData } from '@/presentation/components/world/world-building-inspector-production';
import {
  buildBuildingNavigationTarget,
  buildProductionBuildingNavigationTarget,
} from '@/presentation/navigation/entity-navigation';
import { useScreenQuery, TICK_QUERY_DEBOUNCE_MS } from '@/presentation/hooks/useScreenQuery';
import { ScreenQueryFrame } from '@/presentation/screens/shared/ScreenQueryFrame';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';

/** World screen with interactive map framework and operations overlays (Phase 4A/4B). */
export function WorldScreen() {
  const {
    viewData,
    navigation,
    selectEntity,
    clearEntitySelection,
    navigateToTarget,
    regions,
    companyViewData,
    isBusy,
    buildingMapPlacementSession,
    setBuildingMapPlacementCandidate,
    setBuildingMapPlacementRegion,
    confirmBuildingMapPlacement,
    cancelBuildingMapPlacement,
    navigateProductionWorkforcePersonnel,
  } = useGameWorkspace();
  const selectedRegionId =
    navigation.entitySelection.kind === 'region' ? navigation.entitySelection.id : null;
  const [selectedMapBuildingId, setSelectedMapBuildingId] = useState<string | null>(null);
  const labels = companyViewData.labels;

  useEffect(() => {
    setSelectedMapBuildingId(null);
  }, [selectedRegionId]);

  useEffect(() => {
    if (buildingMapPlacementSession === null || selectedRegionId === null) {
      return;
    }

    if (buildingMapPlacementSession.regionId !== selectedRegionId) {
      setBuildingMapPlacementRegion(selectedRegionId);
    }
  }, [
    buildingMapPlacementSession,
    selectedRegionId,
    setBuildingMapPlacementRegion,
  ]);

  const mapQuery = useScreenQuery(
    'world-map',
    () => fetchWorldMap().then((map) => mapWorldMapViewData(map, regions)),
    viewData.session.hasGame,
    { debounceMs: TICK_QUERY_DEBOUNCE_MS },
  );

  const overlayQuery = useScreenQuery(
    `world-overlay:${mapQuery.data?.mapId ?? 'none'}`,
    async () => {
      if (mapQuery.data === null) {
        return EMPTY_WORLD_OVERLAY;
      }

      const regionIds = mapQuery.data.regions.map((region) => region.id);
      const [buildings, transportOrders, regionDetails] = await Promise.all([
        fetchBuildingList(),
        fetchTransportOrders(),
        Promise.all(regionIds.map((regionId) => fetchRegionDetails(regionId))),
      ]);

      return mapWorldOverlayViewData(
        mapQuery.data.regions,
        buildings,
        transportOrders,
        regionDetails,
        labels.building,
        labels.recipe,
      );
    },
    viewData.session.hasGame && mapQuery.data !== null,
    { debounceMs: TICK_QUERY_DEBOUNCE_MS },
  );

  const overlayData = overlayQuery.data ?? EMPTY_WORLD_OVERLAY;

  const productionJobsQuery = useScreenQuery(
    'world-building-inspector-production-jobs',
    () => fetchProductionJobs(),
    viewData.session.hasGame,
    { debounceMs: TICK_QUERY_DEBOUNCE_MS },
  );

  const productionJobs = productionJobsQuery.data ?? [];

  useEffect(() => {
    if (selectedMapBuildingId === null) {
      return;
    }

    const stillPresent = overlayData.buildingMarkers.some(
      (marker) => marker.id === selectedMapBuildingId,
    );
    if (!stillPresent) {
      setSelectedMapBuildingId(null);
    }
  }, [overlayData.buildingMarkers, selectedMapBuildingId]);

  useEffect(() => {
    if (selectedMapBuildingId === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSelectedMapBuildingId(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedMapBuildingId]);

  const selectedMapBuildingMarker = useMemo(() => {
    if (selectedMapBuildingId === null) {
      return undefined;
    }

    return overlayData.buildingMarkers.find((marker) => marker.id === selectedMapBuildingId);
  }, [overlayData.buildingMarkers, selectedMapBuildingId]);

  const selectedRegionName = useMemo(() => {
    if (selectedRegionId === null) {
      return null;
    }

    return mapQuery.data?.regions.find((region) => region.id === selectedRegionId)?.name ?? null;
  }, [mapQuery.data?.regions, selectedRegionId]);

  const mapBuildingInspectorDetail = useMemo(() => {
    if (selectedMapBuildingId === null) {
      return null;
    }

    return buildWorldMapBuildingInspectorDetail(
      selectedMapBuildingId,
      companyViewData.detail.buildings.get(selectedMapBuildingId),
      selectedMapBuildingMarker,
      selectedRegionName,
    );
  }, [
    companyViewData.detail.buildings,
    selectedMapBuildingId,
    selectedMapBuildingMarker,
    selectedRegionName,
  ]);

  const mapBuildingInspectorProduction = useMemo(() => {
    if (selectedMapBuildingId === null) {
      return null;
    }

    return buildWorldBuildingInspectorProductionViewData(
      selectedMapBuildingId,
      productionJobs,
      companyViewData.hints?.production ?? [],
      labels,
    );
  }, [
    companyViewData.hints?.production,
    labels,
    productionJobs,
    selectedMapBuildingId,
  ]);

  const mapBuildingInspectorNavigation = useMemo(() => {
    if (selectedMapBuildingId === null || mapBuildingInspectorDetail === null) {
      return null;
    }

    return buildWorldBuildingInspectorNavigationViewData(
      selectedMapBuildingId,
      productionJobs,
      companyViewData.hints?.production ?? [],
      true,
    );
  }, [
    companyViewData.hints?.production,
    mapBuildingInspectorDetail,
    productionJobs,
    selectedMapBuildingId,
  ]);

  const mapBuildingInspectorPanel = useMemo(() => {
    if (
      selectedMapBuildingId === null ||
      mapBuildingInspectorDetail === null ||
      mapBuildingInspectorNavigation === null
    ) {
      return undefined;
    }

    return (
      <PGWorldBuildingInspector
        buildingId={selectedMapBuildingId}
        detail={mapBuildingInspectorDetail}
        production={mapBuildingInspectorProduction}
        navigation={mapBuildingInspectorNavigation}
        onClose={() => {
          setSelectedMapBuildingId(null);
        }}
        onOpenBuilding={() => {
          navigateToTarget(buildBuildingNavigationTarget(selectedMapBuildingId));
        }}
        onOpenProduction={
          mapBuildingInspectorNavigation.showOpenProduction
            ? () => {
                navigateToTarget(buildProductionBuildingNavigationTarget(selectedMapBuildingId));
              }
            : undefined
        }
        onManageWorkforce={
          mapBuildingInspectorNavigation.showManageWorkforce
            ? () => {
                navigateProductionWorkforcePersonnel(selectedMapBuildingId);
              }
            : undefined
        }
      />
    );
  }, [
    mapBuildingInspectorDetail,
    mapBuildingInspectorNavigation,
    mapBuildingInspectorProduction,
    navigateProductionWorkforcePersonnel,
    navigateToTarget,
    selectedMapBuildingId,
  ]);

  const loadRegionInspector = useCallback(async () => {
    if (selectedRegionId === null) {
      return null;
    }

    const [detailDto, buildings, transportOrders, productionJobs] = await Promise.all([
      fetchRegionDetails(selectedRegionId),
      fetchBuildingList(),
      fetchTransportOrders(),
      fetchProductionJobs(),
    ]);

    const detail = mapRegionDetailViewData(detailDto);
    const operations = mapWorldRegionOperationsViewData(
      selectedRegionId,
      buildings,
      transportOrders,
      productionJobs,
      labels.building,
      labels.recipe,
    );

    return mapWorldRegionInspectorViewData(detail, operations);
  }, [labels.building, labels.recipe, selectedRegionId]);

  const inspectorQuery = useScreenQuery(
    `world-inspector:${selectedRegionId ?? 'none'}`,
    loadRegionInspector,
    selectedRegionId !== null && viewData.session.hasGame,
    { debounceMs: TICK_QUERY_DEBOUNCE_MS },
  );

  const inspectorSectionActions = useMemo(
    () =>
      Object.freeze({
        production: Object.freeze({
          actionLabel: 'Produktion öffnen',
          onAction: () => {
            navigateToTarget({ screen: 'production', entitySelection: { kind: 'none' } });
          },
        }),
      }),
    [navigateToTarget],
  );

  if (!viewData.session.hasGame) {
    return (
      <EmptyState title="Keine Session aktiv" hint="Starten Sie ein Spiel über das Hauptmenü." />
    );
  }

  if (viewData.world === null) {
    return (
      <EmptyState title="Welt konnte nicht geladen werden." hint="Bitte laden Sie die Session erneut." />
    );
  }

  return (
    <ScreenQueryFrame
      hasGame={viewData.session.hasGame}
      isLoading={mapQuery.isLoading || overlayQuery.isLoading}
      errorMessage={mapQuery.errorMessage ?? overlayQuery.errorMessage}
      loadingLabel="Weltkarte wird geladen…"
    >
      {mapQuery.data === null ? (
        <EmptyState title="Keine Kartendaten" hint="Für diese Session liegt keine Karte vor." />
      ) : (
        <PGWorldWorkspace
          world={viewData.world}
          map={mapQuery.data}
          overlays={overlayData}
          selectedRegionId={selectedRegionId}
          selectedBuildingId={selectedMapBuildingId}
          inspector={inspectorQuery.data}
          inspectorPanel={mapBuildingInspectorPanel}
          inspectorSectionActions={inspectorSectionActions}
          buildingMapPlacementSession={buildingMapPlacementSession}
          buildingTypeLabel={labels.building}
          isBusy={isBusy}
          onPickBuildingMapPlacementCandidate={setBuildingMapPlacementCandidate}
          onConfirmBuildingMapPlacement={() => {
            void confirmBuildingMapPlacement();
          }}
          onCancelBuildingMapPlacement={cancelBuildingMapPlacement}
          onSelectRegion={(regionId) => {
            selectEntity({ kind: 'region', id: regionId });
            if (buildingMapPlacementSession !== null) {
              setBuildingMapPlacementRegion(regionId);
            }
          }}
          onSelectBuilding={(buildingId) => {
            setSelectedMapBuildingId(buildingId);
          }}
          onClearBuildingSelection={() => {
            setSelectedMapBuildingId(null);
          }}
          onClearSelection={clearEntitySelection}
        />
      )}
    </ScreenQueryFrame>
  );
}
