// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { TickMetricsViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PGChartWidget } from '@/presentation/components/dashboard/charts/PGChartWidget';
import { PGPriceIndexHistoryChart } from '@/presentation/components/dashboard/charts/PGPriceIndexHistoryChart';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

const SAMPLE_POINTS: readonly TickMetricsViewData[] = Object.freeze([
  Object.freeze({
    tickNumber: 1,
    simulationTime: 1,
    availableCash: 1000,
    energyReserve: 10,
    energyGeneration: 5,
    energyConsumption: 4,
    activeTransportCount: 0,
    warehouseTotalUnits: 0,
    onSiteTotalUnits: 0,
    priceIndex: 1,
    marketPrices: Object.freeze([]),
  }),
]);

describe('PG chart components', () => {
  it('PGChartWidget shows empty state when not enough points', () => {
    renderPresentation(
      <PGChartWidget title="Test" ariaLabel="Test" pointCount={1} minPoints={2}>
        <div>Chart</div>
      </PGChartWidget>,
    );

    expect(screen.getByText('Noch zu wenig Verlauf.')).toBeInTheDocument();
    expect(screen.queryByText('Chart')).not.toBeInTheDocument();
  });

  it('PGPriceIndexHistoryChart renders nothing without points', () => {
    const { container } = render(<PGPriceIndexHistoryChart points={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('PGPriceIndexHistoryChart shows empty state with single point', () => {
    renderPresentation(<PGPriceIndexHistoryChart points={SAMPLE_POINTS} />);

    expect(screen.getByText('Preisindex')).toBeInTheDocument();
    expect(screen.getByText('Noch zu wenig Verlauf.')).toBeInTheDocument();
  });
});
