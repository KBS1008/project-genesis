'use client';

import { useEffect, useMemo } from 'react';
import { mapBuildingListRow } from '@/presentation/adapters/mappers/company-dashboard-view-mappers';
import { fetchBuildingList } from '@/presentation/adapters/api/query-client';
import type { BuildingListRowViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { BuildingCategoryIcon } from '@/presentation/components/assets/BuildingCategoryIcon';
import { BuildingTypeIcon } from '@/presentation/components/assets/BuildingTypeIcon';
import { useScreenQuery, TICK_QUERY_DEBOUNCE_MS } from '@/presentation/hooks/useScreenQuery';
import { Button } from '@/presentation/primitives/Button';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { StatusBanner } from '@/presentation/primitives/StatusBanner';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';
import { ScreenQueryFrame } from '@/presentation/screens/shared/ScreenQueryFrame';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import { useTransientFormState } from '@/presentation/state/useTransientFormState';
import {
  getPlaceBuildingPrerequisiteNavigationLabel,
} from '@/presentation/navigation/place-building-prerequisite-navigation';
import '../world/world-company.css';
import '../shared/operation-screen.css';

/** Buildings screen with owned list, detail, construction catalog, and placement workflow. */
export function BuildingsScreen() {
  const {
    viewData,
    companyViewData,
    regions,
    navigation,
    isBusy,
    selectEntity,
    navigatePlaceBuildingPrerequisite,
    startBuildingMapPlacement,
  } = useGameWorkspace();
  const selectedBuildingId =
    navigation.entitySelection.kind === 'building' ? navigation.entitySelection.id : null;
  const regionNames = useMemo(
    () => new Map(regions.map((region) => [region.id, region.name])),
    [regions],
  );
  const buildingsQuery = useScreenQuery(
    'buildings',
    () =>
      fetchBuildingList().then((buildings) =>
        buildings.map((building) =>
          mapBuildingListRow(building, companyViewData.labels, regionNames),
        ),
      ),
    viewData.session.hasGame,
    { debounceMs: TICK_QUERY_DEBOUNCE_MS },
  );
  const placementForm = useTransientFormState({
    buildingTypeId: '',
    name: '',
  });
  const catalog = companyViewData.hints.placeBuilding;
  const selectedCatalogEntry = catalog.find(
    (entry) => entry.buildingTypeId === placementForm.value.buildingTypeId,
  );

  useEffect(() => {
    if (catalog.length === 0) {
      return;
    }

    if (
      placementForm.value.buildingTypeId.length === 0 ||
      catalog.some((entry) => entry.buildingTypeId === placementForm.value.buildingTypeId) !== true
    ) {
      const nextEntry = catalog[0];
      placementForm.patch({
        buildingTypeId: nextEntry?.buildingTypeId ?? '',
        name: nextEntry?.name ?? '',
      });
    }
  }, [catalog, placementForm.patch, placementForm.value.buildingTypeId]);

  const selectedDetail =
    selectedBuildingId === null
      ? null
      : (companyViewData.detail.buildings.get(selectedBuildingId) ?? null);

  const beginMapPlacement = () => {
    const { buildingTypeId, name } = placementForm.value;

    if (buildingTypeId.length === 0 || name.trim().length === 0 || isBusy) {
      return;
    }

    if (selectedCatalogEntry !== undefined && !selectedCatalogEntry.canPlace) {
      return;
    }

    startBuildingMapPlacement({
      buildingTypeId,
      name: name.trim(),
      canPlace: selectedCatalogEntry?.canPlace === true,
    });
  };

  return (
    <ScreenQueryFrame
      hasGame={viewData.session.hasGame}
      isLoading={buildingsQuery.isLoading}
      errorMessage={buildingsQuery.errorMessage}
      loadingLabel="Gebäudedaten werden geladen…"
    >
      <div className="pg-operation-screen">
        <Card title="Eigene Gebäude">
          <QueryRows
            columns={['Name', 'Typ', 'Region', 'Status', 'Position']}
            rows={(buildingsQuery.data ?? []).map((building: BuildingListRowViewData) => ({
              id: building.id,
              cells: [
                building.name,
                building.buildingTypeLabel,
                building.regionLabel,
                building.statusLabel,
                building.positionLabel,
              ],
            }))}
            selectedRowId={selectedBuildingId}
            onRowClick={(buildingId) => {
              selectEntity({ kind: 'building', id: buildingId });
            }}
          />
        </Card>

        {selectedDetail !== null ? (
          <Card title={selectedDetail.title}>
            <p className="pg-operation-hint-copy">
              <strong>{selectedDetail.subtitle}</strong>
            </p>
            <ul className="pg-operation-detail-list">
              {selectedDetail.entries.map(([label, value]) => (
                <li key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </li>
              ))}
            </ul>
            {selectedDetail.relatedItems !== undefined && selectedDetail.relatedItems.length > 0 ? (
              <>
                <p className="pg-operation-hint-copy">
                  <strong>{selectedDetail.relatedTitle ?? 'Verwandte Jobs'}</strong>
                </p>
                <ul className="pg-summary-list">
                  {selectedDetail.relatedItems.map((item) => (
                    <li key={`${item.primary}-${item.secondary}`}>
                      <span>{item.primary}</span>
                      <strong>{item.secondary}</strong>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </Card>
        ) : null}

        <div className="pg-operation-grid">
          <Card title="Baukatalog">
            {catalog.length === 0 ? (
              <EmptyState title="Keine Gebäudetypen" hint="Es sind keine Bauoptionen verfügbar." />
            ) : (
              <div className="pg-operation-hint-list">
                {catalog.map((entry) => (
                  <div key={entry.buildingTypeId} className="pg-operation-hint-row">
                    <BuildingTypeIcon
                      buildingTypeId={entry.buildingTypeId}
                      category={entry.category}
                      variant="primary"
                      size={72}
                      loading="eager"
                      className="pg-building-catalog-art"
                    />
                    <div className="pg-operation-hint-copy">
                      <strong>{entry.name}</strong>
                      <div className="pg-operation-hint-category">
                        <BuildingCategoryIcon category={entry.category} />
                        <span>{entry.category}</span>
                      </div>
                      <span>{entry.canPlace ? 'Baubar' : (entry.reason ?? 'Nicht baubar')}</span>
                      {entry.canPlace === false && entry.prerequisiteNavigation !== null ? (
                        <Button
                          variant="secondary"
                          disabled={isBusy}
                          aria-label={getPlaceBuildingPrerequisiteNavigationLabel(
                            entry.prerequisiteNavigation,
                          )}
                          onClick={() => {
                            if (entry.prerequisiteNavigation !== null) {
                              navigatePlaceBuildingPrerequisite(entry.prerequisiteNavigation);
                            }
                          }}
                        >
                          {getPlaceBuildingPrerequisiteNavigationLabel(entry.prerequisiteNavigation)}
                        </Button>
                      ) : null}
                    </div>
                    <Button
                      variant="secondary"
                      disabled={isBusy}
                      onClick={() => {
                        placementForm.patch({
                          buildingTypeId: entry.buildingTypeId,
                          name: entry.name,
                        });
                      }}
                    >
                      Auswählen
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Platzierung">
            <div className="pg-operation-toolbar">
              <div className="pg-operation-field">
                <label htmlFor="building-type-select">Gebäudetyp</label>
                <select
                  id="building-type-select"
                  value={placementForm.value.buildingTypeId}
                  onChange={(event) => {
                    const entry = catalog.find((hint) => hint.buildingTypeId === event.target.value);
                    placementForm.patch({
                      buildingTypeId: event.target.value,
                      name: entry?.name ?? placementForm.value.name,
                    });
                  }}
                  aria-label="Gebäudetyp für Platzierung"
                >
                  {catalog.map((entry) => (
                    <option key={entry.buildingTypeId} value={entry.buildingTypeId}>
                      {entry.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pg-operation-field">
                <label htmlFor="building-name-input">Name</label>
                <input
                  id="building-name-input"
                  value={placementForm.value.name}
                  onChange={(event) => {
                    placementForm.patch({ name: event.target.value });
                  }}
                  aria-label="Gebäudename"
                />
              </div>
            </div>

            {selectedCatalogEntry !== undefined && !selectedCatalogEntry.canPlace && selectedCatalogEntry.reason !== null ? (
              <StatusBanner tone="warning" message={selectedCatalogEntry.reason} />
            ) : null}

            <div className="pg-operation-actions">
              <Button
                disabled={
                  isBusy ||
                  placementForm.value.buildingTypeId.length === 0 ||
                  placementForm.value.name.trim().length === 0 ||
                  selectedCatalogEntry?.canPlace !== true
                }
                onClick={beginMapPlacement}
              >
                Position auf Karte wählen
              </Button>
              <span className="pg-operation-hint-copy">
                <span>
                  Verfügbares Kapital: {companyViewData.kpis?.availableCashLabel ?? '—'}
                </span>
              </span>
            </div>
          </Card>
        </div>
      </div>
    </ScreenQueryFrame>
  );
}
