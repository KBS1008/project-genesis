'use client';

import { useMemo, useState } from 'react';
import {
  filterProductionHintsByBuildingId,
  filterProductionJobsByBuildingId,
  isProductionBuildingFilterActive,
  resolveProductionContextBuildingId,
} from '@/presentation/adapters/mappers/production-building-context';
import {
  buildNameResolver,
  mapProductionFactoryGroups,
  mapProductionJobRowsViewData,
  mapProductionOverviewSummary,
} from '@/presentation/adapters/mappers/workspace-view-mappers';
import { startProduction } from '@/presentation/adapters/api/gameplay-client';
import { fetchProductionJobs } from '@/presentation/adapters/api/query-client';
import type { ProductionHintViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { RecipeCatalogEntryViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { useScreenQuery, TICK_QUERY_DEBOUNCE_MS } from '@/presentation/hooks/useScreenQuery';
import { buildWarehouseNavigationTarget } from '@/presentation/navigation/entity-navigation';
import { Button } from '@/presentation/primitives/Button';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { StatusBanner } from '@/presentation/primitives/StatusBanner';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';
import { ScreenQueryFrame } from '@/presentation/screens/shared/ScreenQueryFrame';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import { ProductionProgressCell } from '@/presentation/screens/production/ProductionProgressCell';
import '../world/world-company.css';
import '../shared/operation-screen.css';
import '../../components/dashboard/dashboard-components.css';

/** Production screen with overview, factories, recipe catalog, and start workflow (PR-001–PR-003). */
export function ProductionScreen() {
  const {
    viewData,
    companyViewData,
    navigation,
    isBusy,
    runCommand,
    selectEntity,
    clearEntitySelection,
    navigateToTarget,
  } = useGameWorkspace();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const selectedJobId =
    navigation.entitySelection.kind === 'production' ? navigation.entitySelection.id : null;
  const labels = useMemo(
    () => buildNameResolver(companyViewData.labels),
    [companyViewData.labels],
  );
  const buildingLabelById = useMemo(
    () =>
      new Map(companyViewData.buildings.map((building) => [building.id, building.name] as const)),
    [companyViewData.buildings],
  );
  const tickKey = viewData.simulation.tickNumber ?? 0;
  const jobsQuery = useScreenQuery(
    `production:${tickKey}`,
    () => fetchProductionJobs(),
    viewData.session.hasGame,
    { debounceMs: TICK_QUERY_DEBOUNCE_MS },
  );
  const rawJobs = jobsQuery.data ?? [];
  const isBuildingFilterActive = isProductionBuildingFilterActive(navigation.entitySelection);
  const contextBuildingId = resolveProductionContextBuildingId(
    navigation.entitySelection,
    rawJobs,
  );
  const scopedRawJobs = useMemo(() => {
    if (!isBuildingFilterActive || contextBuildingId === null) {
      return rawJobs;
    }

    return filterProductionJobsByBuildingId(rawJobs, contextBuildingId);
  }, [contextBuildingId, isBuildingFilterActive, rawJobs]);
  const contextBuildingLabel =
    contextBuildingId === null
      ? null
      : (buildingLabelById.get(contextBuildingId) ?? contextBuildingId);
  const contextWarehouse =
    contextBuildingId === null
      ? null
      : companyViewData.warehouseStorage.find((entry) => entry.id === contextBuildingId) ?? null;
  const productionJobs = useMemo(
    () =>
      mapProductionJobRowsViewData(scopedRawJobs, {
        recipe: labels.recipe,
        building: (buildingId) => buildingLabelById.get(buildingId) ?? buildingId,
      }),
    [scopedRawJobs, labels.recipe, buildingLabelById],
  );
  const overviewSummary = useMemo(
    () => mapProductionOverviewSummary(scopedRawJobs),
    [scopedRawJobs],
  );
  const factoryGroups = useMemo(
    () =>
      mapProductionFactoryGroups(
        scopedRawJobs,
        {
          recipe: labels.recipe,
          building: (buildingId) => buildingLabelById.get(buildingId) ?? buildingId,
        },
        companyViewData.buildings,
      ),
    [scopedRawJobs, labels.recipe, buildingLabelById, companyViewData.buildings],
  );
  const productionHints = companyViewData.hints.production;
  const scopedProductionHints = useMemo(() => {
    if (!isBuildingFilterActive || contextBuildingId === null) {
      return productionHints;
    }

    return filterProductionHintsByBuildingId(productionHints, contextBuildingId);
  }, [contextBuildingId, isBuildingFilterActive, productionHints]);
  const selectedJobDetail =
    selectedJobId === null
      ? null
      : (companyViewData.detail.productionJobs.get(selectedJobId) ?? null);
  const selectedRecipeDetail =
    selectedRecipeId === null
      ? null
      : companyViewData.recipeCatalog.find((entry) => entry.id === selectedRecipeId) ?? null;
  const recipeHintsForSelection =
    selectedRecipeId === null
      ? scopedProductionHints
      : scopedProductionHints.filter((hint) => hint.recipeId === selectedRecipeId);

  const startJob = (hint: ProductionHintViewData) => {
    if (!hint.canStart || isBusy) {
      return;
    }

    void runCommand(
      () =>
        startProduction({
          buildingId: hint.buildingId,
          recipeId: hint.recipeId,
        }),
      `${hint.recipeName} gestartet.`,
      { commandId: 'production.start' },
    );
  };

  return (
    <ScreenQueryFrame
      hasGame={viewData.session.hasGame}
      isLoading={jobsQuery.isLoading}
      errorMessage={jobsQuery.errorMessage}
      loadingLabel="Produktionsdaten werden geladen…"
    >
      <div className="pg-operation-screen">
        {isBuildingFilterActive && contextBuildingLabel !== null ? (
          <div
            className="pg-production-building-context"
            role="status"
            aria-label={`Produktionskontext: ${contextBuildingLabel}`}
          >
            <span>Standort: <strong>{contextBuildingLabel}</strong></span>
            <Button
              variant="secondary"
              onClick={() => {
                clearEntitySelection();
              }}
            >
              Alle Standorte
            </Button>
          </div>
        ) : null}

        <div className="pg-operation-summary-grid" aria-label="Produktionsübersicht">
          <Card title="Aktive Jobs">
            <p className="pg-operation-metric">{overviewSummary.activeCount}</p>
            <p className="pg-operation-hint-copy">Laufend oder wartend</p>
          </Card>
          <Card title="Laufend">
            <p className="pg-operation-metric">{overviewSummary.runningCount}</p>
            <p className="pg-operation-hint-copy">Mit Energie und Personal</p>
          </Card>
          <Card title="Energie fehlt">
            <p className="pg-operation-metric">{overviewSummary.stalledEnergyCount}</p>
            <p className="pg-operation-hint-copy">Gestoppt wegen Energie</p>
          </Card>
          <Card title="Keine Mitarbeiter">
            <p className="pg-operation-metric">{overviewSummary.stalledWorkforceCount}</p>
            <p className="pg-operation-hint-copy">Gestoppt wegen Personal</p>
          </Card>
          <Card title="Wartend">
            <p className="pg-operation-metric">{overviewSummary.waitingCount}</p>
            <p className="pg-operation-hint-copy">Material oder Transport</p>
          </Card>
          <Card title="Abgeschlossen">
            <p className="pg-operation-metric">{overviewSummary.finishedCount}</p>
            <p className="pg-operation-hint-copy">In dieser Session sichtbar</p>
          </Card>
        </div>

        <div className="pg-operation-grid">
          <Card title="Aktive Produktionsjobs">
            {productionJobs.length === 0 ? (
              <EmptyState
                title={
                  isBuildingFilterActive
                    ? 'Keine Produktionsjobs an diesem Standort'
                    : 'Keine Produktionsjobs'
                }
                hint={
                  isBuildingFilterActive
                    ? 'Starten Sie ein Rezept an dieser Fabrik oder wählen Sie einen anderen Standort.'
                    : 'Starten Sie ein Rezept an einer Fabrik.'
                }
              />
            ) : (
              <QueryRows
                columns={['Gebäude', 'Rezept', 'Status', 'Fortschritt']}
                columnCount={4}
                rows={productionJobs.map((row) => ({
                  id: row.id,
                  cells: [
                    row.buildingLabel,
                    row.title,
                    row.statusLabel,
                    <ProductionProgressCell
                      key={`${row.id}-progress`}
                      percent={row.progressPercent}
                      label={row.progressLabel}
                    />,
                  ],
                }))}
                selectedRowId={selectedJobId}
                ariaLabel="Aktive Produktionsjobs"
                onRowClick={(jobId) => {
                  selectEntity({ kind: 'production', id: jobId });
                }}
              />
            )}
          </Card>

          <Card title="Fabriken">
            {factoryGroups.length === 0 ? (
              <EmptyState
                title={
                  isBuildingFilterActive
                    ? 'Keine Fabrikaktivität an diesem Standort'
                    : 'Keine Fabrikaktivität'
                }
                hint={
                  isBuildingFilterActive
                    ? 'An diesem Standort sind derzeit keine Produktionsjobs sichtbar.'
                    : 'Produktionsjobs erscheinen hier nach Gebäude gruppiert.'
                }
              />
            ) : (
              <div className="pg-production-factory-list">
                {factoryGroups.map((factory) => (
                  <section
                    key={factory.buildingId}
                    className={`pg-production-factory-card${
                      contextBuildingId === factory.buildingId ? ' is-selected' : ''
                    }`}
                    aria-current={contextBuildingId === factory.buildingId ? 'true' : undefined}
                  >
                    <div className="pg-production-factory-header">
                      <strong>{factory.buildingLabel}</strong>
                      <span>{factory.buildingTypeLabel}</span>
                    </div>
                    <ul className="pg-production-factory-jobs">
                      {factory.jobs.map((job) => (
                        <li key={job.id}>
                          <div className="pg-production-factory-job-row">
                            <span>{job.recipeLabel}</span>
                            <strong>{job.statusLabel}</strong>
                          </div>
                          <ProductionProgressCell
                            percent={job.progressPercent}
                            label={job.progressLabel}
                          />
                          <Button
                            variant="secondary"
                            onClick={() => {
                              selectEntity({ kind: 'production', id: job.id });
                            }}
                          >
                            Job anzeigen
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </Card>
        </div>

        {contextWarehouse !== null ? (
          <Card title="Lager am Standort">
            <p className="pg-operation-hint-copy">
              <strong>{contextWarehouse.buildingLabel}</strong>
              <span>
                {contextWarehouse.capacityLabel !== '—'
                  ? `Kapazität ${contextWarehouse.capacityLabel}`
                  : `${contextWarehouse.usedLabel} Einheiten belegt`}
              </span>
              <span>{contextWarehouse.items.length} Lagerzeilen</span>
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                navigateToTarget(buildWarehouseNavigationTarget(contextWarehouse.id));
              }}
            >
              Lagerdetails öffnen
            </Button>
          </Card>
        ) : null}

        <Card title="Rezeptkatalog">
          {companyViewData.recipeCatalog.length === 0 ? (
            <EmptyState title="Keine Rezepte" hint="Rezepte werden aus dem Spielinhalt geladen." />
          ) : (
            <div className="pg-production-recipe-list">
              {companyViewData.recipeCatalog.map((recipe: RecipeCatalogEntryViewData) => (
                <button
                  key={recipe.id}
                  type="button"
                  className={`pg-production-recipe-button${
                    selectedRecipeId === recipe.id ? ' is-selected' : ''
                  }`}
                  aria-pressed={selectedRecipeId === recipe.id}
                  onClick={() => {
                    setSelectedRecipeId(recipe.id);
                  }}
                >
                  <strong>{recipe.name}</strong>
                  <span>{recipe.durationLabel} · {recipe.energyLabel}</span>
                </button>
              ))}
            </div>
          )}
        </Card>

        {selectedRecipeDetail !== null ? (
          <Card title={selectedRecipeDetail.name}>
            <ul className="pg-operation-detail-list">
              <li>
                <span>Dauer</span>
                <strong>{selectedRecipeDetail.durationLabel}</strong>
              </li>
              <li>
                <span>Energie</span>
                <strong>{selectedRecipeDetail.energyLabel}</strong>
              </li>
              <li>
                <span>Gebäudetypen</span>
                <strong>{selectedRecipeDetail.buildingTypeLabels.join(', ')}</strong>
              </li>
            </ul>
            <p className="pg-operation-hint-copy">
              <strong>Eingaben</strong>
            </p>
            <ul className="pg-summary-list">
              {selectedRecipeDetail.inputLabels.map((label) => (
                <li key={label}>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
            <p className="pg-operation-hint-copy">
              <strong>Ausgaben</strong>
            </p>
            <ul className="pg-summary-list">
              {selectedRecipeDetail.outputLabels.map((label) => (
                <li key={label}>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <EmptyState
            title="Kein Rezept ausgewählt"
            hint="Wählen Sie ein Rezept aus dem Katalog für Details und Startoptionen."
          />
        )}

        {selectedJobDetail !== null ? (
          <Card title={selectedJobDetail.title}>
            <p className="pg-operation-hint-copy">
              <strong>{selectedJobDetail.subtitle}</strong>
            </p>
            <ul className="pg-operation-detail-list">
              {selectedJobDetail.entries.map(([label, value]) => (
                <li key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </li>
              ))}
            </ul>
            {selectedJobDetail.relatedItems !== undefined &&
            selectedJobDetail.relatedItems.length > 0 ? (
              <ul className="pg-summary-list">
                {selectedJobDetail.relatedItems.map((item) => (
                  <li key={`${item.primary}-${item.secondary}`}>
                    <span>{item.primary}</span>
                    <strong>{item.secondary}</strong>
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>
        ) : null}

        <Card title="Produktion starten">
          {recipeHintsForSelection.length === 0 ? (
            <EmptyState
              title="Keine Produktionsoptionen"
              hint={
                selectedRecipeId === null
                  ? isBuildingFilterActive
                    ? 'Für diesen Standort sind derzeit keine Rezepte startbar.'
                    : 'Es sind derzeit keine Rezepte an Gebäuden startbar.'
                  : 'Für dieses Rezept sind keine Gebäude startbereit.'
              }
            />
          ) : (
            <div className="pg-operation-hint-list">
              {recipeHintsForSelection.map((hint) => (
                <div key={`${hint.buildingId}-${hint.recipeId}`} className="pg-operation-hint-row">
                  <div className="pg-operation-hint-copy">
                    <strong>{hint.recipeName}</strong>
                    <span>{hint.buildingName}</span>
                    <span>
                      {hint.canStart
                        ? (hint.reason ?? 'Startbereit')
                        : (hint.reason ?? 'Nicht startbar')}
                    </span>
                  </div>
                  <Button
                    disabled={isBusy || !hint.canStart}
                    onClick={() => {
                      startJob(hint);
                    }}
                  >
                    Starten
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {scopedProductionHints.some((hint) => !hint.canStart && hint.reason !== null) ? (
          <StatusBanner
            tone="info"
            message="Blockierte Jobs und Materialengpässe werden über die Hinweise der einzelnen Rezepte angezeigt."
          />
        ) : null}

        {isBusy ? (
          <StatusBanner tone="info" message="Produktionsdaten werden nach einer Aktion aktualisiert…" />
        ) : null}
      </div>
    </ScreenQueryFrame>
  );
}
