// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EMPTY_WORLD_OVERLAY } from '@/presentation/adapters/view-data/world-view-data';
import { WorldScreen } from '@/presentation/screens/world/WorldScreen';

const navigateToTarget = vi.fn();

vi.mock('@/presentation/hooks/useScreenQuery', () => ({
  TICK_QUERY_DEBOUNCE_MS: 250,
  useScreenQuery: (key: string) => {
    if (key.startsWith('world-map')) {
      return {
        data: {
          mapId: 'map_001',
          regions: [{ id: 'region_001', name: 'Heimatregion', x: 0, y: 0, width: 10, height: 10 }],
        },
        isLoading: false,
        errorMessage: null,
      };
    }

    if (key.startsWith('world-overlay:')) {
      return {
        data: EMPTY_WORLD_OVERLAY,
        isLoading: false,
        errorMessage: null,
      };
    }

    if (key.startsWith('world-inspector:')) {
      return {
        data: null,
        isLoading: false,
        errorMessage: null,
      };
    }

    return {
      data: null,
      isLoading: false,
      errorMessage: null,
    };
  },
}));

vi.mock('@/presentation/components/world', () => ({
  PGWorldWorkspace: ({
    onSelectBuilding,
  }: {
    readonly onSelectBuilding?: (buildingId: string) => void;
  }) => (
    <button
      type="button"
      onClick={() => {
        onSelectBuilding?.('building_005');
      }}
    >
      Select building marker
    </button>
  ),
}));

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    viewData: {
      session: { hasGame: true },
      simulation: { tickNumber: 1 },
      world: { mapId: 'map_001', regionCount: 1 },
    },
    navigation: { screen: 'world', entitySelection: { kind: 'region', id: 'region_001' } },
    selectEntity: vi.fn(),
    clearEntitySelection: vi.fn(),
    navigateToTarget,
    regions: [{ id: 'region_001', name: 'Heimatregion' }],
    companyViewData: {
      labels: {
        building: (id: string) => id,
        recipe: (id: string) => id,
      },
    },
  }),
}));

describe('WorldScreen', () => {
  it('navigates to production with building context when a map marker is selected', async () => {
    const user = userEvent.setup();
    navigateToTarget.mockClear();

    render(<WorldScreen />);

    await user.click(screen.getByRole('button', { name: 'Select building marker' }));

    expect(navigateToTarget).toHaveBeenCalledWith({
      screen: 'production',
      entitySelection: { kind: 'building', id: 'building_005' },
    });
  });
});
