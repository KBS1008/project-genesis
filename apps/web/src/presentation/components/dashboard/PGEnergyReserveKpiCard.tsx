'use client';

import type { EnergyKpiPresentationViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { PGKpiCardVariant } from '@/presentation/components/dashboard/PGKpiCard';

type PGEnergyReserveKpiCardProps = {
  readonly presentation: EnergyKpiPresentationViewData;
  readonly variant?: PGKpiCardVariant;
};

/** Energy reserve KPI with generation, consumption, and reserve breakdown (ENERGY-S1). */
export function PGEnergyReserveKpiCard({
  presentation,
  variant = 'default',
}: PGEnergyReserveKpiCardProps) {
  const resolvedVariant: PGKpiCardVariant = presentation.hasDeficit ? 'danger' : variant;

  return (
    <article
      className={`pg-kpi-card pg-kpi-card-${resolvedVariant} pg-energy-reserve-kpi`}
      aria-label="Energiereserve"
    >
      <span className="pg-kpi-card-label">Energiereserve</span>
      <strong className="pg-kpi-card-value">{presentation.reserveLabel}</strong>
      <span className="pg-kpi-card-trend">{presentation.trend}</span>
      <dl className="pg-energy-kpi-breakdown">
        <div className="pg-energy-kpi-breakdown-row">
          <dt>Erzeugung</dt>
          <dd>{presentation.generationLabel}</dd>
        </div>
        <div className="pg-energy-kpi-breakdown-row">
          <dt>Verbrauch</dt>
          <dd>{presentation.consumptionLabel}</dd>
        </div>
        <div className="pg-energy-kpi-breakdown-row">
          <dt>Reserve</dt>
          <dd
            className={
              presentation.hasDeficit ? 'pg-energy-kpi-breakdown-reserve-deficit' : undefined
            }
          >
            {presentation.reserveLabel}
          </dd>
        </div>
      </dl>
      <p className="pg-energy-kpi-formula">{presentation.formulaExplanation}</p>
      <p className="pg-energy-kpi-consumption-hint">{presentation.consumptionExplanation}</p>
    </article>
  );
}
