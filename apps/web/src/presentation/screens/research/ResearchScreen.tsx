'use client';

import { useMemo } from 'react';
import { buildNameResolver, mapResearchJobRowsViewData } from '@/presentation/adapters/mappers/workspace-view-mappers';
import { startResearch } from '@/presentation/adapters/api/gameplay-client';
import { fetchResearchJobs } from '@/presentation/adapters/api/query-client';
import type { ResearchHintViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { JobRowViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import { useScreenQuery, TICK_QUERY_DEBOUNCE_MS } from '@/presentation/hooks/useScreenQuery';
import { Button } from '@/presentation/primitives/Button';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';
import { ScreenQueryFrame } from '@/presentation/screens/shared/ScreenQueryFrame';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import '../world/world-company.css';
import '../shared/operation-screen.css';

/** Research screen with catalog, prerequisites, active jobs, and completion display. */
export function ResearchScreen() {
  const { viewData, companyViewData, navigation, isBusy, runCommand, selectEntity } = useGameWorkspace();
  const selectedJobId =
    navigation.entitySelection.kind === 'research' ? navigation.entitySelection.id : null;
  const labels = useMemo(
    () => buildNameResolver(companyViewData.labels),
    [companyViewData.labels],
  );
  const jobsQuery = useScreenQuery(
    'research',
    () => fetchResearchJobs().then((jobs) => mapResearchJobRowsViewData(jobs, labels.technology)),
    viewData.session.hasGame,
    { debounceMs: TICK_QUERY_DEBOUNCE_MS },
  );
  const researchHints = companyViewData.hints.research;
  const selectedJobDetail =
    selectedJobId === null
      ? null
      : (companyViewData.detail.researchJobs.get(selectedJobId) ?? null);

  const startTechnology = (hint: ResearchHintViewData) => {
    if (!hint.canStart || isBusy) {
      return;
    }

    void runCommand(
      () => startResearch({ technologyId: hint.technologyId }),
      `Forschung „${hint.name}“ gestartet.`,
      { commandId: 'research.start' },
    );
  };

  return (
    <ScreenQueryFrame
      hasGame={viewData.session.hasGame}
      isLoading={jobsQuery.isLoading}
      errorMessage={jobsQuery.errorMessage}
      loadingLabel="Forschungsdaten werden geladen…"
    >
      <div className="pg-operation-screen">
        <Card title="Abgeschlossene Forschung">
          {companyViewData.completedResearchLabels.length === 0 ? (
            <EmptyState title="Noch keine Technologien" hint="Starten Sie ein Forschungsprojekt." />
          ) : (
            <ul className="pg-summary-list">
              {companyViewData.completedResearchLabels.map((label) => (
                <li key={label}>
                  <span>{label}</span>
                  <strong>Abgeschlossen</strong>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Aktive Forschungsjobs">
          <QueryRows
            columns={['Technologie', 'Status', 'Fortschritt']}
            rows={(jobsQuery.data ?? []).map((row: JobRowViewData) => ({
              id: row.id,
              cells: [row.title, row.statusLabel, row.progressLabel],
            }))}
            selectedRowId={selectedJobId}
            onRowClick={(jobId) => {
              selectEntity({ kind: 'research', id: jobId });
            }}
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
          </Card>
        ) : null}

        <Card title="Forschungskatalog">
          {researchHints.length === 0 ? (
            <EmptyState title="Keine Technologien" hint="Es sind keine Forschungsprojekte verfügbar." />
          ) : (
            <div className="pg-operation-hint-list">
              {researchHints.map((hint) => (
                <div key={hint.technologyId} className="pg-operation-hint-row">
                  <div className="pg-operation-hint-copy">
                    <strong>{hint.name}</strong>
                    <span>
                      {hint.canStart
                        ? (hint.reason ?? 'Startbereit')
                        : (hint.reason ?? 'Voraussetzungen fehlen')}
                    </span>
                  </div>
                  <Button
                    disabled={isBusy || !hint.canStart}
                    onClick={() => {
                      startTechnology(hint);
                    }}
                  >
                    Forschung starten
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </ScreenQueryFrame>
  );
}
