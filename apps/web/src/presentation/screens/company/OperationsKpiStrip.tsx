'use client';

import { PGKpiCard } from '@/presentation/components/dashboard/PGKpiCard';
import { PGEnergyReserveKpiCard } from '@/presentation/components/dashboard/PGEnergyReserveKpiCard';
import type {
  OperationsKpiAction,
  OperationsKpiCardViewData,
} from '@/presentation/adapters/mappers/company-operations-view-mappers';
import type { EnergyKpiPresentationViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';

type OperationsKpiStripProps = {
  readonly cards: readonly OperationsKpiCardViewData[];
  readonly energyPresentation: EnergyKpiPresentationViewData | null;
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
  energyPresentation,
  onSelectFinance,
  onSelectLogistics,
}: OperationsKpiStripProps) {
  return (
    <section className="pg-operations-kpi-strip" aria-label="Kernkennzahlen">
      <div className="pg-kpi-grid">
        {cards.map((card) => {
          const onClick = resolveAction(card.action, onSelectFinance, onSelectLogistics);

          if (card.id === 'energy' && energyPresentation !== null) {
            const energyCard = (
              <PGEnergyReserveKpiCard
                presentation={energyPresentation}
                variant={card.variant}
              />
            );

            if (onClick === undefined) {
              return <div key={card.id}>{energyCard}</div>;
            }

            return (
              <button
                key={card.id}
                type="button"
                className={`pg-operations-kpi-button${card.isActive ? ' is-active' : ''}`.trim()}
                onClick={onClick}
              >
                {energyCard}
              </button>
            );
          }

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
