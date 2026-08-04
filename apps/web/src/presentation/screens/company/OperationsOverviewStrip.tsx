'use client';

import { PGKpiCard } from '@/presentation/components/dashboard/PGKpiCard';
import { PGDashboardGrid, PGDashboardGridItem } from '@/presentation/components/layout';
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
      <PGDashboardGrid>
        {cards.map((card) => {
          const kpiCard = (
            <PGKpiCard label={card.label} value={card.value} hint={card.hint} variant="default" />
          );

          if (card.action === 'logistics') {
            return (
              <PGDashboardGridItem key={card.id} span={4}>
                <button type="button" className="pg-operations-kpi-button" onClick={onSelectLogistics}>
                  {kpiCard}
                </button>
              </PGDashboardGridItem>
            );
          }

          return (
            <PGDashboardGridItem key={card.id} span={4}>
              {kpiCard}
            </PGDashboardGridItem>
          );
        })}
      </PGDashboardGrid>
    </section>
  );
}
