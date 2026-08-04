'use client';

import { useCallback } from 'react';
import { mapRegionDetailViewData } from '@/presentation/adapters/mappers/workspace-view-mappers';
import { mapWorldInspectorViewData, mapWorldMapViewData } from '@/presentation/adapters/mappers/world-view-mappers';
import { fetchRegionDetails } from '@/presentation/adapters/api/query-client';
import { fetchWorldMap } from '@/presentation/adapters/api/world-client';
import { PGWorldWorkspace } from '@/presentation/components/world';
import { useScreenQuery } from '@/presentation/hooks/useScreenQuery';
import { ScreenQueryFrame } from '@/presentation/screens/shared/ScreenQueryFrame';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';

/** World screen with interactive map framework (Phase 4A). */
export function WorldScreen() {
  const { viewData, navigation, selectEntity, clearEntitySelection, regions } = useGameWorkspace();
  const selectedRegionId =
    navigation.entitySelection.kind === 'region' ? navigation.entitySelection.id : null;

  const mapQuery = useScreenQuery(
    'world-map',
    () => fetchWorldMap().then((map) => mapWorldMapViewData(map, regions)),
    viewData.session.hasGame,
  );

  const loadRegionInspector = useCallback(async () => {
    if (selectedRegionId === null) {
      return null;
    }

    return mapWorldInspectorViewData(
      mapRegionDetailViewData(await fetchRegionDetails(selectedRegionId)),
    );
  }, [selectedRegionId]);

  const inspectorQuery = useScreenQuery(
    `world-inspector:${selectedRegionId ?? 'none'}`,
    loadRegionInspector,
    selectedRegionId !== null && viewData.session.hasGame,
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
      isLoading={mapQuery.isLoading}
      errorMessage={mapQuery.errorMessage}
      loadingLabel="Weltkarte wird geladen…"
    >
      {mapQuery.data === null ? (
        <EmptyState title="Keine Kartendaten" hint="Für diese Session liegt keine Karte vor." />
      ) : (
        <PGWorldWorkspace
          world={viewData.world}
          map={mapQuery.data}
          selectedRegionId={selectedRegionId}
          inspector={inspectorQuery.data}
          onSelectRegion={(regionId) => {
            selectEntity({ kind: 'region', id: regionId });
          }}
          onClearSelection={clearEntitySelection}
        />
      )}
    </ScreenQueryFrame>
  );
}
