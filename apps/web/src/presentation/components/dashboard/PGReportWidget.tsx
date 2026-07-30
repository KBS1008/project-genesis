'use client';

import { Button } from '@/presentation/primitives/Button';
import { PGWidgetSurface } from '@/presentation/components/foundation/PGWidgetSurface';
import type { PGWidgetSurfaceProps } from '@/presentation/components/foundation/pg-widget-state';

export type PGReportAction = {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
};

/** Reports and quick actions widget (DB-010). */
export function PGReportWidget({
  title = 'Berichte & Aktionen',
  actions,
  reportHints,
  onAction,
  state = 'idle',
  errorMessage,
  emptyTitle = 'Keine Aktionen verfügbar',
}: PGWidgetSurfaceProps & {
  readonly title?: string;
  readonly actions: readonly PGReportAction[];
  readonly reportHints?: readonly string[];
  readonly onAction: (actionId: string) => void;
}) {
  return (
    <section className="pg-widget pg-report-widget" aria-labelledby="pg-report-widget-title">
      <h3 id="pg-report-widget-title" className="pg-widget-title">
        {title}
      </h3>
      <PGWidgetSurface
        state={actions.length === 0 && state === 'idle' ? 'empty' : state}
        errorMessage={errorMessage}
        emptyTitle={emptyTitle}
      >
        <div className="pg-report-actions">
          {actions.map((action) => (
            <div key={action.id} className="pg-report-action">
              <div>
                <strong>{action.label}</strong>
                {action.description !== undefined ? <p>{action.description}</p> : null}
              </div>
              <Button variant="secondary" onClick={() => onAction(action.id)}>
                Öffnen
              </Button>
            </div>
          ))}
        </div>
        {reportHints !== undefined && reportHints.length > 0 ? (
          <ul className="pg-report-hints">
            {reportHints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        ) : null}
      </PGWidgetSurface>
    </section>
  );
}
