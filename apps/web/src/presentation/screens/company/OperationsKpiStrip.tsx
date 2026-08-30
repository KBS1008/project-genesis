'use client';

import { PGKpiCard } from '@/presentation/components/dashboard/PGKpiCard';
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
      <div className="pg-kpi-grid">
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
              <div key={card.id}>
                {kpiCard}
              </div>
            );
          }

          return (
            <button
              key={card.id}
              type="button"
              className={`pg-operations-kpi-button${card.isActive ? ' is-active' : ''}`.trim()}
              onClick={onClick}
            >
              {kpiCard}
            </button>
          );
        })}
      </div>
    </section>
  );
}
