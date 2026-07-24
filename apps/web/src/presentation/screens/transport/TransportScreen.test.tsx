// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TransportScreen } from '@/presentation/screens/transport/TransportScreen';

const selectEntity = vi.fn();

vi.mock('@/presentation/hooks/useScreenQuery', () => ({
  useScreenQuery: () => ({
    data: [
      {
        id: 'transport_001',
        title: 'Lager → Werk',
        statusLabel: 'IN_PROGRESS',
        progressLabel: '40%',
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
    },
    companyViewData: {
      kpis: {
        activeTransportCount: 1,
        activeTransportTrend: 'Aktiv unterwegs',
      },
      logisticsStatusMessage: 'Transport läuft planmäßig.',
      detail: {
        transportOrders: new Map([
          [
            'transport_001',
            {
              title: '10× Holz',
              subtitle: 'Transport & Logistik',
              entries: [
                ['Route', 'Lager → Werk'],
                ['Route-ID', 'route_a'],
              ],
            },
          ],
        ]),
      },
    },
    navigation: { entitySelection: { kind: 'none' } },
    isBusy: false,
    selectEntity,
  }),
}));

describe('TransportScreen', () => {
  it('renders logistics summary and transport orders', () => {
    render(<TransportScreen />);

    expect(screen.getByText('Transportaufträge')).toBeInTheDocument();
    expect(screen.getByText('Transport läuft planmäßig.')).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Lager → Werk/ })).toBeInTheDocument();
  });

  it('selects a transport order for route inspection', async () => {
    const user = userEvent.setup();
    selectEntity.mockClear();

    render(<TransportScreen />);

    await user.click(screen.getByRole('row', { name: /Lager → Werk/ }));

    expect(selectEntity).toHaveBeenCalledWith({ kind: 'transport', id: 'transport_001' });
    expect(screen.getByText('Route-ID')).toBeInTheDocument();
  });
});
