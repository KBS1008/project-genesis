'use client';

import { useMemo, useState } from 'react';
import type { MilestoneRowViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { MilestoneVisual } from '@/presentation/components/assets/MilestoneVisual';
import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';
import { EmptyState } from '@/presentation/primitives/EmptyState';

/** Milestone progression list for the operations dashboard (responsive stacked layout). */
export function PGMilestonesWidget({
  title = 'Meilensteine',
  subtitle = 'Erreichbare Ziele und abgeschlossene Erfolge. Freigeschaltete Inhalte können weitere Voraussetzungen haben.',
  milestones,
  state = 'idle',
  errorMessage,
  emptyTitle = 'Keine Meilensteine geladen.',
  emptyHint = 'Meilensteine erscheinen nach Spielstart.',
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly subtitle?: string;
  readonly milestones: readonly MilestoneRowViewData[];
}) {
  const [query, setQuery] = useState('');

  const filteredMilestones = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
      return milestones;
    }

    return milestones.filter((milestone) => {
      const statusLabel = milestone.completed ? 'Erreicht' : 'Ausstehend';
      const haystack = [
        milestone.displayName,
        statusLabel,
        milestone.criteriaSummary,
        milestone.requiredByDisplayLabel,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [milestones, query]);

  return (
    <section className="pg-widget pg-milestones-widget" aria-labelledby="pg-milestones-widget-title">
      <div className="pg-widget-header">
        <h3 id="pg-milestones-widget-title" className="pg-widget-title">
          {title}
        </h3>
      </div>
      <p className="pg-widget-subtitle">{subtitle}</p>
      <PGWidgetSurface
        state={milestones.length === 0 && state === 'idle' ? 'empty' : state}
        errorMessage={errorMessage}
        emptyTitle={emptyTitle}
        emptyHint={emptyHint}
      >
        {milestones.length === 0 ? (
          <EmptyState title={emptyTitle} hint={emptyHint} />
        ) : (
          <div className="pg-milestone-progress-panel">
            <label className="pg-operations-table-search">
              <span className="pg-operations-table-search-label">Suche</span>
              <input
                type="search"
                className="pg-operations-table-search-input"
                placeholder="Meilensteine suchen…"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
              />
            </label>
            {filteredMilestones.length === 0 ? (
              <EmptyState title="Keine Treffer für die Suche." />
            ) : (
              <ul className="pg-milestone-progress-list" aria-label="Meilensteine">
                {filteredMilestones.map((milestone) => {
                  const statusLabel = milestone.completed ? 'Erreicht' : 'Ausstehend';

                  return (
                    <li key={milestone.id} className="pg-milestone-progress-item">
                      <div className="pg-milestone-progress-header">
                        <MilestoneVisual
                          milestoneId={milestone.id}
                          variant="medallion"
                          completed={milestone.completed}
                          size={64}
                          loading="eager"
                          className="pg-milestone-progress-medallion"
                        />
                        <div className="pg-milestone-progress-heading">
                          <span className="pg-milestone-progress-name">{milestone.displayName}</span>
                          <span
                            className={`pg-milestone-progress-status${
                              milestone.completed ? ' is-completed' : ''
                            }`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                      </div>
                      <dl className="pg-milestone-progress-details">
                        <div className="pg-milestone-progress-detail">
                          <dt>Voraussetzung</dt>
                          <dd>{milestone.criteriaSummary}</dd>
                        </div>
                        <div className="pg-milestone-progress-detail">
                          <dt>Benötigt für</dt>
                          <dd>{milestone.requiredByDisplayLabel}</dd>
                        </div>
                      </dl>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </PGWidgetSurface>
    </section>
  );
}
