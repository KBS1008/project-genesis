// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReportsScreen } from '@/presentation/screens/reports/ReportsScreen';

const selectEntity = vi.fn();

vi.mock('@/presentation/hooks/useScreenQuery', () => ({
  useScreenQuery: () => ({
    data: [
      {
        id: 'event_0001',
        tickLabel: '5',
        category: 'TRADE',
        categoryLabel: 'Handel',
        message: 'Kauf: 5× wood.',
        severity: 'INFO',
        severityLabel: 'Info',
      },
    ],
    isLoading: false,
    errorMessage: null,
  }),
}));

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    viewData: {
      session: { hasGame: true, companyName: 'Genesis Industries' },
      simulation: { tickNumber: 5, simulationTime: 500, isPaused: false },
      saves: [
        {
          filePath: 'saves/test.json',
          fileName: 'test.json',
          companyName: 'Genesis Industries',
          tickLabel: '5',
          schemaVersionLabel: 'V3',
        },
      ],
    },
    navigation: { entitySelection: { kind: 'none' } },
    selectEntity,
  }),
}));

describe('ReportsScreen', () => {
  it('renders session summary, saves, and event log', () => {
    render(<ReportsScreen />);

    expect(screen.getByRole('heading', { name: 'Session' })).toBeInTheDocument();
    expect(screen.getAllByText('Genesis Industries').length).toBeGreaterThan(0);
    expect(screen.getByText('Ereignisprotokoll')).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Kauf: 5× wood/ })).toBeInTheDocument();
  });

  it('shows event detail when a log entry is selected', async () => {
    const user = userEvent.setup();
    selectEntity.mockClear();

    render(<ReportsScreen />);

    await user.click(screen.getByRole('row', { name: /Kauf: 5× wood/ }));

    expect(selectEntity).toHaveBeenCalledWith({ kind: 'event', id: 'event_0001' });
    expect(screen.getByText('Ereignisdetails')).toBeInTheDocument();
  });
});
