'use client';

import { useMemo, useState } from 'react';
import { buildNameResolver, mapProductionJobRowsViewData } from '@/presentation/adapters/mappers/workspace-view-mappers';
import { startProduction } from '@/presentation/adapters/api/gameplay-client';
import { fetchProductionJobs } from '@/presentation/adapters/api/query-client';
import type { ProductionHintViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { JobRowViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import { useScreenQuery, TICK_QUERY_DEBOUNCE_MS } from '@/presentation/hooks/useScreenQuery';
import { Button } from '@/presentation/primitives/Button';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { StatusBanner } from '@/presentation/primitives/StatusBanner';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';
import { ScreenQueryFrame } from '@/presentation/screens/shared/ScreenQueryFrame';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import '../world/world-company.css';
import '../shared/operation-screen.css';

/** Production screen with facilities, active jobs, and start-production workflow. */
export function ProductionScreen() {
  const { viewData, companyViewData, isBusy, runCommand } = useGameWorkspace();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const labels = useMemo(
    () => buildNameResolver(companyViewData.labels),
    [companyViewData.labels],
  );
  const tickKey = viewData.simulation.tickNumber ?? 0;
  const jobsQuery = useScreenQuery(
    `production:${tickKey}`,
    () => fetchProductionJobs().then((jobs) => mapProductionJobRowsViewData(jobs, labels.recipe)),
    viewData.session.hasGame,
    { debounceMs: TICK_QUERY_DEBOUNCE_MS },
  );
  const productionHints = companyViewData.hints.production;
  const selectedJobDetail =
    selectedJobId === null
      ? null
      : (companyViewData.detail.productionJobs.get(selectedJobId) ?? null);

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
        <Card title="Aktive Produktionsjobs">
          <QueryRows
            columns={['Rezept', 'Status', 'Fortschritt']}
            rows={(jobsQuery.data ?? []).map((row: JobRowViewData) => ({
              id: row.id,
              cells: [row.title, row.statusLabel, row.progressLabel],
            }))}
            selectedRowId={selectedJobId}
            onRowClick={setSelectedJobId}
          />
        </Card>

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
            {selectedJobDetail.relatedItems !== undefined && selectedJobDetail.relatedItems.length > 0 ? (
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
          {productionHints.length === 0 ? (
            <EmptyState
              title="Keine Produktionsoptionen"
              hint="Es sind derzeit keine Rezepte an Gebäuden startbar."
            />
          ) : (
            <div className="pg-operation-hint-list">
              {productionHints.map((hint) => (
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

        {productionHints.some((hint) => !hint.canStart && hint.reason !== null) ? (
          <StatusBanner
            tone="info"
            message="Blockierte Jobs und Materialengpässe werden über die Hinweise der einzelnen Rezepte angezeigt."
          />
        ) : null}
      </div>
    </ScreenQueryFrame>
  );
}
