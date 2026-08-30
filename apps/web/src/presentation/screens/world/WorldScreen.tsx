'use client';

import { useCallback, useMemo } from 'react';
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
import { PGWorldWorkspace } from '@/presentation/components/world';
import {
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
  } = useGameWorkspace();
  const selectedRegionId =
    navigation.entitySelection.kind === 'region' ? navigation.entitySelection.id : null;
  const labels = companyViewData.labels;
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
          overlays={overlayQuery.data ?? EMPTY_WORLD_OVERLAY}
          selectedRegionId={selectedRegionId}
          inspector={inspectorQuery.data}
          inspectorSectionActions={inspectorSectionActions}
          onSelectRegion={(regionId) => {
            selectEntity({ kind: 'region', id: regionId });
          }}
          onSelectBuilding={(buildingId) => {
            navigateToTarget(buildProductionBuildingNavigationTarget(buildingId));
          }}
          onClearSelection={clearEntitySelection}
        />
      )}
    </ScreenQueryFrame>
  );
}
