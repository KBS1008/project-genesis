// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BuildingsScreen } from '@/presentation/screens/buildings/BuildingsScreen';

const runCommand = vi.fn();

vi.mock('@/presentation/hooks/useScreenQuery', () => ({
  useScreenQuery: () => ({
    data: [
      {
        id: 'building_001',
        name: 'Firmenzentrale',
        buildingTypeLabel: 'Firmenzentrale',
        statusLabel: 'ACTIVE',
        positionLabel: '12, 12',
        regionId: 'region_001',
        regionLabel: 'Heartland',
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
      simulation: { tickNumber: 2 },
    },
    companyViewData: {
      buildingCount: 4,
      labels: {
        building: (id: string) => id,
        resource: (id: string) => id,
        recipe: (id: string) => id,
        technology: (id: string) => id,
        employee: (id: string) => id,
      },
      kpis: { availableCashLabel: '95.000 GC' },
      hints: {
        placeBuilding: [
          {
            buildingTypeId: 'sawmill',
            name: 'Sägewerk',
            category: 'PRODUCTION',
            canPlace: true,
            reason: null,
          },
        ],
      },
      detail: {
        buildings: new Map([
          [
            'building_001',
            {
              title: 'Firmenzentrale',
              subtitle: 'Gebäude · headquarters',
              entries: [['Status', 'ACTIVE']],
            },
          ],
        ]),
      },
    },
    regions: [{ id: 'region_001', name: 'Heartland' }],
    isBusy: false,
    runCommand,
  }),
}));

describe('BuildingsScreen', () => {
  it('renders building list, catalog, and placement controls', () => {
    render(<BuildingsScreen />);

    expect(screen.getByText('Eigene Gebäude')).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Firmenzentrale/ })).toBeInTheDocument();
    expect(screen.getByLabelText('Gebäudetyp für Platzierung')).toHaveValue('sawmill');
    expect(screen.getByRole('button', { name: 'Gebäude platzieren' })).toBeEnabled();
  });

  it('submits placement through runCommand', async () => {
    const user = userEvent.setup();
    runCommand.mockClear();

    render(<BuildingsScreen />);

    await user.click(screen.getByRole('button', { name: 'Gebäude platzieren' }));

    expect(runCommand).toHaveBeenCalledTimes(1);
  });
});
