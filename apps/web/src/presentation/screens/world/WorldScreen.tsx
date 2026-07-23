'use client';

import { useCallback, useMemo } from 'react';
import { mapBuildingListRow } from '@/presentation/adapters/mappers/company-dashboard-view-mappers';
import { mapRegionDetailViewData } from '@/presentation/adapters/mappers/workspace-view-mappers';
import { fetchBuildingList, fetchRegionDetails } from '@/presentation/adapters/api/query-client';
import { buildBuildingNavigationTarget } from '@/presentation/navigation/entity-navigation';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { useScreenQuery } from '@/presentation/hooks/useScreenQuery';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';
import { ScreenQueryFrame } from '@/presentation/screens/shared/ScreenQueryFrame';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import './world-company.css';

function buildWorldMapCells(regions: readonly { readonly id: string; readonly name: string; readonly mapX: number; readonly mapY: number; readonly biomeId: string }[]) {
  if (regions.length === 0) {
    return { columns: 1, rows: 1, cells: Object.freeze([]) };
  }

  const maxX = Math.max(...regions.map((region) => region.mapX));
  const maxY = Math.max(...regions.map((region) => region.mapY));
  const regionByPosition = new Map(regions.map((region) => [`${region.mapX}:${region.mapY}`, region]));

  const cells = [];
  for (let y = 0; y <= maxY; y += 1) {
    for (let x = 0; x <= maxX; x += 1) {
      cells.push(regionByPosition.get(`${x}:${y}`) ?? null);
    }
  }

  return {
    columns: maxX + 1,
    rows: maxY + 1,
    cells: Object.freeze(cells),
  };
}

/** World overview screen with region list, schematic map, and region detail. */
export function WorldScreen() {
  const { viewData, navigation, selectEntity, navigateToTarget, regions, companyViewData } =
    useGameWorkspace();
  const selectedRegionId =
    navigation.entitySelection.kind === 'region' ? navigation.entitySelection.id : null;
  const regionNames = useMemo(
    () => new Map(regions.map((region) => [region.id, region.name])),
    [regions],
  );

  const loadRegionDetail = useCallback(async () => {
    if (selectedRegionId === null) {
      return null;
    }

    return mapRegionDetailViewData(await fetchRegionDetails(selectedRegionId));
  }, [selectedRegionId]);

  const regionDetailQuery = useScreenQuery(
    `region-detail:${selectedRegionId ?? 'none'}`,
    loadRegionDetail,
    selectedRegionId !== null && viewData.session.hasGame,
  );

  const loadRegionalBuildings = useCallback(
    () =>
      fetchBuildingList().then((buildings) =>
        buildings
          .filter((building) => building.regionId === selectedRegionId)
          .map((building) => mapBuildingListRow(building, companyViewData.labels, regionNames)),
      ),
    [companyViewData.labels, regionNames, selectedRegionId],
  );

  const regionalBuildingsQuery = useScreenQuery(
    `region-buildings:${selectedRegionId ?? 'none'}`,
    loadRegionalBuildings,
    selectedRegionId !== null && viewData.session.hasGame,
  );

  const worldRegions = useMemo(() => {
    if (viewData.world === null) {
      return [];
    }

    return viewData.world.regions.map((region) => {
      const source = regions.find((entry) => entry.id === region.id);
      return {
        id: region.id,
        name: region.name,
        biomeId: region.biomeId,
        mapX: source?.mapX ?? 0,
        mapY: source?.mapY ?? 0,
      };
    });
  }, [regions, viewData.world]);

  const worldMap = useMemo(() => buildWorldMapCells(worldRegions), [worldRegions]);

  if (!viewData.session.hasGame) {
    return (
      <EmptyState
        title="Keine Session aktiv"
        hint="Starten Sie ein Spiel über das Hauptmenü."
      />
    );
  }

  if (viewData.world === null) {
    return <EmptyState title="Welt konnte nicht geladen werden." hint="Bitte laden Sie die Session erneut." />;
  }

  return (
    <div className="pg-screen-placeholder">
      <Card title={viewData.world.worldName}>
        <p className="pg-workspace-subtitle">
          {viewData.world.regionCountLabel} Regionen · {viewData.world.cityCountLabel} Städte
        </p>

        <h3 className="pg-card-title">Regionenkarte</h3>
        <div
          className="pg-world-map"
          style={{ gridTemplateColumns: `repeat(${worldMap.columns}, minmax(6rem, 1fr))` }}
          role="list"
          aria-label="Regionenkarte"
        >
          {worldMap.cells.map((region, index) => {
            if (region === null) {
              return <div key={`empty-${index}`} className="pg-world-map-cell is-empty" aria-hidden="true" />;
            }

            const isSelected = selectedRegionId === region.id;

            return (
              <button
                key={region.id}
                type="button"
                className={`pg-world-map-cell${isSelected ? ' is-selected' : ''}`.trim()}
                aria-current={isSelected ? 'true' : undefined}
                onClick={() => {
                  selectEntity({ kind: 'region', id: region.id });
                }}
              >
                <strong>{region.name}</strong>
                <span>{region.biomeId}</span>
              </button>
            );
          })}
        </div>

        <h3 className="pg-card-title">Regionen</h3>
        <QueryRows
          columns={['Region', 'Biom', 'Karte', 'Städte']}
          selectedRowId={selectedRegionId}
          onRowClick={(regionId) => {
            selectEntity({ kind: 'region', id: regionId });
          }}
          rows={viewData.world.regions.map((region) => ({
            id: region.id,
            cells: [
              region.name,
              region.biomeId,
              region.mapPositionLabel,
              String(region.cityCount),
            ],
          }))}
        />
      </Card>

      {selectedRegionId !== null ? (
        <Card title="Regionsdetails">
          <ScreenQueryFrame
            hasGame={viewData.session.hasGame}
            isLoading={regionDetailQuery.isLoading}
            errorMessage={regionDetailQuery.errorMessage}
            loadingLabel="Region wird geladen…"
          >
            {regionDetailQuery.data === null ? (
              <EmptyState
                title="Region nicht gefunden."
                hint="Die Auswahl wurde zurückgesetzt."
              />
            ) : (
              <>
                <p>{regionDetailQuery.data.description}</p>
                <p className="pg-workspace-subtitle">Biom: {regionDetailQuery.data.biomeId}</p>

                <h3 className="pg-card-title">Regionale Ressourcen</h3>
                {regionDetailQuery.data.resources.length === 0 ? (
                  <EmptyState title="Keine regionalen Ressourcen erfasst." />
                ) : (
                  <QueryRows
                    columns={['Ressource', 'Verfügbar']}
                    rows={regionDetailQuery.data.resources.map((resource, index) => ({
                      id: `${resource.label}-${index}`,
                      cells: [resource.label, resource.amountLabel],
                    }))}
                  />
                )}

                <h3 className="pg-card-title">Städte</h3>
                {regionDetailQuery.data.cities.length === 0 ? (
                  <EmptyState title="Keine Städte in dieser Region." />
                ) : (
                  <QueryRows
                    columns={['Stadt', 'Kategorie']}
                    rows={regionDetailQuery.data.cities.map((city) => ({
                      id: city.id,
                      cells: [city.name, city.category],
                    }))}
                  />
                )}

                <h3 className="pg-card-title">Unternehmenspräsenz</h3>
                <ScreenQueryFrame
                  hasGame={viewData.session.hasGame}
                  isLoading={regionalBuildingsQuery.isLoading}
                  errorMessage={regionalBuildingsQuery.errorMessage}
                  loadingLabel="Gebäude in der Region werden geladen…"
                >
                  {regionalBuildingsQuery.data === null || regionalBuildingsQuery.data.length === 0 ? (
                    <EmptyState title="Keine Gebäude in dieser Region." />
                  ) : (
                    <QueryRows
                      columns={['Gebäude', 'Typ', 'Status']}
                      onRowClick={(buildingId) => {
                        navigateToTarget(buildBuildingNavigationTarget(buildingId));
                      }}
                      rows={regionalBuildingsQuery.data.map((building) => ({
                        id: building.id,
                        cells: [building.name, building.buildingTypeLabel, building.statusLabel],
                      }))}
                    />
                  )}
                </ScreenQueryFrame>
              </>
            )}
          </ScreenQueryFrame>
        </Card>
      ) : (
        <EmptyState title="Keine Region ausgewählt" hint="Wählen Sie eine Region in der Liste oder auf der Karte." />
      )}
    </div>
  );
}
