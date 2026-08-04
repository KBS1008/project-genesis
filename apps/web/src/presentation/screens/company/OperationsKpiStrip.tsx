'use client';

import { PGKpiCard } from '@/presentation/components/dashboard/PGKpiCard';
import { PGDashboardGrid, PGDashboardGridItem } from '@/presentation/components/layout';
import type {
  OperationsKpiAction,
  OperationsKpiCardViewData,
} from '@/presentation/adapters/mappers/company-operations-view-mappers';

type OperationsKpiStripProps = {
  readonly cards: readonly OperationsKpiCardViewData[];
  readonly onSelectFinance: () => void;
  readonly onSelectLogistics: () => void;
};

function resolveAction(
  action: OperationsKpiAction | undefined,
  onSelectFinance: () => void,
  onSelectLogistics: () => void,
): (() => void) | undefined {
  if (action === 'finance') {
    return onSelectFinance;
  }

  if (action === 'logistics') {
    return onSelectLogistics;
  }

  return undefined;
}

/** PG-based KPI strip for the company operations dashboard. */
export function OperationsKpiStrip({
  cards,
  onSelectFinance,
  onSelectLogistics,
}: OperationsKpiStripProps) {
  return (
    <section className="pg-operations-kpi-strip" aria-label="Kennzahlen">
      <PGDashboardGrid>
        {cards.map((card) => {
          const onClick = resolveAction(card.action, onSelectFinance, onSelectLogistics);
          const kpiCard = (
            <PGKpiCard
              label={card.label}
              value={card.value}
              hint={card.hint}
              trend={card.trend}
              variant={card.variant}
            />
          );

          if (onClick === undefined) {
            return (
              <PGDashboardGridItem key={card.id} span={3}>
                {kpiCard}
              </PGDashboardGridItem>
            );
          }

          return (
            <PGDashboardGridItem key={card.id} span={3}>
              <button
                type="button"
                className={`pg-operations-kpi-button${card.isActive ? ' is-active' : ''}`.trim()}
                onClick={onClick}
              >
                {kpiCard}
              </button>
            </PGDashboardGridItem>
          );
        })}
      </PGDashboardGrid>
    </section>
  );
}
