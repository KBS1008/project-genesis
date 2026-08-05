// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProductionScreen } from '@/presentation/screens/production/ProductionScreen';

const runCommand = vi.fn();
const selectEntity = vi.fn();

const defaultNavigation = { screen: 'production' as const, entitySelection: { kind: 'none' as const } };

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
      simulation: { tickNumber: 2 },
    },
    companyViewData: {
      labels: {
        resource: (id: string) => id,
        building: (id: string) => id,
        recipe: (id: string) => id,
        technology: (id: string) => id,
        employee: (id: string) => id,
      },
      hints: {
        production: [
          {
            buildingId: 'building_002',
            recipeId: 'recipe_planks',
            buildingName: 'Sägewerk',
            recipeName: 'Bretter herstellen',
            canStart: true,
            reason: null,
          },
        ],
      },
      detail: {
        productionJobs: new Map(),
      },
    },
    isBusy: false,
    runCommand,
    navigation: defaultNavigation,
    selectEntity,
  }),
}));

describe('ProductionScreen', () => {
  it('renders production start actions from dashboard hints', async () => {
    const user = userEvent.setup();
    runCommand.mockClear();

    render(<ProductionScreen />);

    expect(screen.getByText('Produktion starten')).toBeInTheDocument();
    expect(screen.getByText('Bretter herstellen')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Starten' }));

    expect(runCommand).toHaveBeenCalledTimes(1);
  });
});
