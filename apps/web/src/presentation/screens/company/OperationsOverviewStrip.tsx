'use client';

import { PGKpiCard } from '@/presentation/components/dashboard/PGKpiCard';
import type { OperationsOverviewCardViewData } from '@/presentation/adapters/mappers/company-operations-view-mappers';

/** PG-based overview strip for the company operations dashboard. */
export function OperationsOverviewStrip({
  cards,
  onSelectLogistics,
}: {
  readonly cards: readonly OperationsOverviewCardViewData[];
  readonly onSelectLogistics: () => void;
}) {
  return (
    <section className="pg-operations-overview-strip" aria-label="Überblick">
      <div className="pg-kpi-grid">
        {cards.map((card) => {
          const kpiCard = (
            <PGKpiCard label={card.label} value={card.value} hint={card.hint} variant="default" />
          );

          if (card.action === 'logistics') {
            return (
              <button
                key={card.id}
                type="button"
                className="pg-operations-kpi-button"
                onClick={onSelectLogistics}
              >
                {kpiCard}
              </button>
            );
          }

          return (
            <div key={card.id}>
              {kpiCard}
            </div>
          );
        })}
      </div>
    </section>
  );
}
