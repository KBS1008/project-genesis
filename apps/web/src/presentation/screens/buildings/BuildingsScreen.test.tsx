// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BuildingsScreen } from '@/presentation/screens/buildings/BuildingsScreen';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';

const runCommand = vi.fn();
const selectEntity = vi.fn();

const defaultNavigation = { screen: 'buildings' as const, entitySelection: { kind: 'none' as const } };

const defaultWorkspace = {
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
  navigation: defaultNavigation,
  selectEntity,
};

vi.mock('@/presentation/hooks/useScreenQuery', () => ({
  TICK_QUERY_DEBOUNCE_MS: 250,
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
  useGameWorkspace: vi.fn(() => defaultWorkspace),
}));

describe('BuildingsScreen', () => {
  afterEach(() => {
    vi.mocked(useGameWorkspace).mockReturnValue(defaultWorkspace);
  });

  it('renders building list, catalog, and placement controls', () => {
    render(<BuildingsScreen />);

    expect(screen.getByText('Eigene Gebäude')).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Firmenzentrale/ })).toBeInTheDocument();
    expect(screen.getByLabelText('Gebäudetyp für Platzierung')).toHaveValue('sawmill');
    expect(screen.getByRole('button', { name: 'Gebäude platzieren' })).toBeEnabled();
  });

  it('renders a decorative category icon beside Baukatalog category text', () => {
    render(<BuildingsScreen />);

    const baukatalog = screen.getByRole('heading', { name: 'Baukatalog' }).closest('section');
    expect(baukatalog).not.toBeNull();

    const catalog = within(baukatalog as HTMLElement);
    expect(catalog.getByText('Sägewerk')).toBeInTheDocument();
    expect(catalog.getByText('PRODUCTION')).toBeInTheDocument();

    const categoryRow = catalog.getByText('PRODUCTION').closest('.pg-operation-hint-category');
    expect(categoryRow).not.toBeNull();

    const svg = categoryRow?.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('stroke')).toBe('currentColor');
    expect(categoryRow?.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('preserves Baukatalog text when category icon mapping is unknown', () => {
    vi.mocked(useGameWorkspace).mockReturnValue({
      ...defaultWorkspace,
      companyViewData: {
        ...defaultWorkspace.companyViewData,
        buildingCount: 0,
        hints: {
          placeBuilding: [
            {
              buildingTypeId: 'mystery',
              name: 'Unbekanntes Gebäude',
              category: 'UNKNOWN',
              canPlace: false,
              reason: 'Nicht baubar',
            },
          ],
        },
        detail: { buildings: new Map() },
      },
      regions: [],
    });

    render(<BuildingsScreen />);

    const baukatalog = screen.getByRole('heading', { name: 'Baukatalog' }).closest('section');
    expect(baukatalog).not.toBeNull();

    const catalog = within(baukatalog as HTMLElement);
    expect(catalog.getByText('Unbekanntes Gebäude')).toBeInTheDocument();
    expect(catalog.getByText('UNKNOWN')).toBeInTheDocument();
    expect(baukatalog?.querySelector('.pg-operation-hint-category svg')).toBeNull();
  });

  it('submits placement through runCommand', async () => {
    const user = userEvent.setup();
    runCommand.mockClear();

    render(<BuildingsScreen />);

    await user.click(screen.getByRole('button', { name: 'Gebäude platzieren' }));

    expect(runCommand).toHaveBeenCalledTimes(1);
  });
});
