// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { EnergyKpiPresentationViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PGEnergyReserveKpiCard } from '@/presentation/components/dashboard/PGEnergyReserveKpiCard';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

function createPresentation(
  overrides: Partial<EnergyKpiPresentationViewData> = {},
): EnergyKpiPresentationViewData {
  return Object.freeze({
    reserveLabel: '45.6 MW',
    generationLabel: '80.0 MW',
    consumptionLabel: '34.4 MW',
    trend: 'Stabil',
    hasDeficit: false,
    formulaExplanation: 'Reserve = Erzeugung − Verbrauch',
    consumptionExplanation:
      'Der Verbrauch umfasst aktive Gebäude und laufende Produktionsaufträge.',
    ...overrides,
  });
}

describe('PGEnergyReserveKpiCard', () => {
  it('labels the KPI as Energiereserve and shows reserve as headline value', () => {
    renderPresentation(<PGEnergyReserveKpiCard presentation={createPresentation()} />);

    expect(screen.getByLabelText('Energiereserve')).toBeInTheDocument();
    expect(screen.getByText('Energiereserve', { selector: '.pg-kpi-card-label' })).toBeInTheDocument();
    expect(screen.getByText('45.6 MW', { selector: '.pg-kpi-card-value' })).toBeInTheDocument();
    expect(screen.getByText('Stabil')).toBeInTheDocument();
  });

  it('shows generation, consumption, and reserve breakdown', () => {
    renderPresentation(<PGEnergyReserveKpiCard presentation={createPresentation()} />);

    expect(screen.getByText('Erzeugung')).toBeInTheDocument();
    expect(screen.getByText('Verbrauch')).toBeInTheDocument();
    expect(screen.getAllByText('Reserve').length).toBeGreaterThan(0);
    expect(screen.getAllByText('80.0 MW').length).toBeGreaterThan(0);
    expect(screen.getByText('34.4 MW')).toBeInTheDocument();
  });

  it('explains the reserve formula and consumption scope', () => {
    renderPresentation(<PGEnergyReserveKpiCard presentation={createPresentation()} />);

    expect(screen.getByText('Reserve = Erzeugung − Verbrauch')).toBeInTheDocument();
    expect(
      screen.getByText('Der Verbrauch umfasst aktive Gebäude und laufende Produktionsaufträge.'),
    ).toBeInTheDocument();
  });

  it('shows negative reserve without masking deficit', () => {
    renderPresentation(
      <PGEnergyReserveKpiCard
        presentation={createPresentation({
          reserveLabel: '-2.0 MW',
          hasDeficit: true,
          trend: 'Defizit',
        })}
      />,
    );

    expect(screen.getByText('-2.0 MW', { selector: '.pg-kpi-card-value' })).toBeInTheDocument();
    expect(document.querySelector('.pg-energy-kpi-breakdown-reserve-deficit')).not.toBeNull();
  });

  it('renders zero reserve correctly', () => {
    renderPresentation(
      <PGEnergyReserveKpiCard
        presentation={createPresentation({
          reserveLabel: '0.0 MW',
          generationLabel: '30.0 MW',
          consumptionLabel: '30.0 MW',
        })}
      />,
    );

    expect(screen.getByText('0.0 MW', { selector: '.pg-kpi-card-value' })).toBeInTheDocument();
  });
});
