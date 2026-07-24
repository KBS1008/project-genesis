// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MarketScreen } from '@/presentation/screens/market/MarketScreen';

const runCommand = vi.fn();

vi.mock('@/components/MarketPriceHistoryChart', () => ({
  MarketPriceHistoryChart: () => <div data-testid="market-history-chart" />,
}));

vi.mock('@/components/MarketPricesTable', () => ({
  MarketPricesTable: () => <div data-testid="market-prices-table" />,
}));

vi.mock('@/presentation/hooks/useScreenQuery', () => ({
  TICK_QUERY_DEBOUNCE_MS: 250,
  useScreenQuery: () => ({
    data: [
      {
        resourceId: 'wood',
        basePrice: 10,
        lastPrice: 12,
        tradeVolume: 25,
        updatedAt: 1,
        totalSupply: 100,
        baselineDemand: 80,
        pressureIndex: 1.1,
        changeFromBase: 2,
        changePercent: 20,
        trend: 'UP',
      },
    ],
    isLoading: false,
    errorMessage: null,
  }),
}));

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    viewData: {
      session: { hasGame: true },
      simulation: { tickNumber: 4 },
      world: { regions: [{ id: 'region_001', name: 'Heartland' }] },
    },
    companyViewData: {
      tickLabel: 'Tick 4',
      labels: {
        resource: (id: string) => (id === 'wood' ? 'Holz' : id),
      },
      kpis: {
        availableCashLabel: '100.000 GC',
        priceIndexLabel: '1,02',
      },
      inventoryItems: [
        {
          resourceLabel: 'Holz',
          quantity: 40,
          reserved: 0,
          available: 40,
        },
      ],
      hints: {
        market: [
          {
            resourceId: 'wood',
            name: 'Holz',
            tradeAmount: 5,
            canBuy: true,
            buyReason: 'Landet im Lagerhaus.',
            canSell: true,
            sellReason: null,
          },
        ],
      },
      chartPoints: [],
    },
    regions: [{ id: 'region_001', name: 'Heartland' }],
    isBusy: false,
    runCommand,
  }),
}));

describe('MarketScreen', () => {
  it('renders regional market context, prices, and trade controls', () => {
    render(<MarketScreen />);

    expect(screen.getByText('Regionaler Markt')).toBeInTheDocument();
    expect(screen.getByLabelText('Regionale Marktauswahl')).toHaveValue('region_001');
    expect(screen.getByTestId('market-prices-table')).toBeInTheDocument();
    expect(screen.getByText('100.000 GC')).toBeInTheDocument();
    expect(screen.getByLabelText('Handelsressource auswählen')).toHaveValue('wood');
    expect(screen.getByRole('button', { name: 'Kaufen' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Verkaufen' })).toBeEnabled();
    expect(screen.getByTestId('market-history-chart')).toBeInTheDocument();
  });

  it('submits buy trades through runCommand', async () => {
    const user = userEvent.setup();
    runCommand.mockClear();

    render(<MarketScreen />);

    await user.click(screen.getByRole('button', { name: 'Kaufen' }));

    expect(runCommand).toHaveBeenCalledTimes(1);
  });
});
