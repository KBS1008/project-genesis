// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProductionScreen } from '@/presentation/screens/production/ProductionScreen';

const navigateBuildingCatalogFocus = vi.fn();

vi.mock('@/presentation/hooks/useScreenQuery', () => ({
  TICK_QUERY_DEBOUNCE_MS: 250,
  useScreenQuery: () => ({
    data: [],
    isLoading: false,
    errorMessage: null,
  }),
}));

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    viewData: {
      session: { hasGame: true },
      simulation: { tickNumber: 1 },
    },
    companyViewData: {
      labels: {
        resource: (id: string) => id,
        building: (id: string) => id,
        recipe: (id: string) => id,
        technology: (id: string) => id,
        employee: (id: string) => id,
      },
      buildings: [],
      hints: { production: [] },
      warehouseStorage: [],
      recipeCatalog: [
        {
          id: 'recipe_planks',
          name: 'Bretter herstellen',
          durationLabel: '60 Zyklen',
          energyLabel: '0,20 / Zyklus',
          inputLabels: ['wood × 10'],
          outputLabels: ['planks × 20'],
          buildingTypeIds: ['sawmill'],
          buildingTypeLabels: ['Sägewerk'],
          inputAvailability: [],
          inputOrigin: [],
          outputUsage: [],
          progressionEligible: true,
          progressionBlockerReason: null,
        },
      ],
      detail: { productionJobs: new Map() },
    },
    isBusy: false,
    runCommand: vi.fn(),
    navigation: { screen: 'production', entitySelection: { kind: 'none' } },
    selectEntity: vi.fn(),
    clearEntitySelection: vi.fn(),
    navigateToTarget: vi.fn(),
    navigateProductionWorkforcePersonnel: vi.fn(),
    navigateBuildingCatalogFocus,
  }),
}));

describe('ProductionScreen recipe building gap', () => {
  it('guides to the building catalog when no sawmill is placed for recipe_planks', async () => {
    navigateBuildingCatalogFocus.mockClear();
    const user = userEvent.setup();
    render(<ProductionScreen />);

    await user.click(screen.getByRole('button', { name: /Bretter herstellen/ }));

    expect(screen.getByText(/passendes Gebäude benötigt/)).toHaveTextContent('Sägewerk');
    await user.click(screen.getByRole('button', { name: 'Gebäudekatalog öffnen' }));

    expect(navigateBuildingCatalogFocus).toHaveBeenCalledWith('sawmill');
  });
});