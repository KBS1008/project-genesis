// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { EMPTY_WORLD_OVERLAY } from '@/presentation/adapters/view-data/world-view-data';
import { WorldScreen } from '@/presentation/screens/world/WorldScreen';

vi.mock('@/presentation/hooks/useScreenQuery', () => ({
  TICK_QUERY_DEBOUNCE_MS: 250,
  useScreenQuery: (key: string) => {
    if (key.startsWith('world-map')) {
      return {
        data: {
          mapId: 'map_001',
          regions: [{ id: 'region_default', name: 'Central Basin', x: 0, y: 0, width: 10, height: 10 }],
        },
        isLoading: false,
        errorMessage: null,
      };
    }

    if (key.startsWith('world-overlay:')) {
      return {
        data: {
          ...EMPTY_WORLD_OVERLAY,
          buildingMarkers: [
            Object.freeze({
              id: 'building_001',
              buildingTypeId: 'headquarters',
              regionId: 'region_default',
              label: 'Firmenzentrale',
              statusLabel: 'ACTIVE',
              clusterSize: 1,
              domainX: 12,
              domainY: 12,
              x: 0,
              y: 0,
            }),
          ],
        },
        isLoading: false,
        errorMessage: null,
      };
    }

    return { data: null, isLoading: false, errorMessage: null };
  },
}));

vi.mock('@/presentation/components/world', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/presentation/components/world')>();
  return {
    ...actual,
    PGWorldWorkspace: ({
      onSelectBuilding,
      inspectorPanel,
    }: {
      readonly onSelectBuilding?: (buildingId: string) => void;
      readonly inspectorPanel?: ReactNode;
    }) => (
      <div>
        {inspectorPanel}
        <button
          type="button"
          onClick={() => {
            onSelectBuilding?.('building_001');
          }}
        >
          Select building marker
        </button>
      </div>
    ),
  };
});

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    viewData: {
      session: { hasGame: true },
      simulation: { tickNumber: 1 },
      world: { mapId: 'map_001', regionCount: 1 },
    },
    navigation: { screen: 'world', entitySelection: { kind: 'region', id: 'region_default' } },
    selectEntity: vi.fn(),
    clearEntitySelection: vi.fn(),
    navigateToTarget: vi.fn(),
    buildingMapPlacementSession: Object.freeze({
      buildingTypeId: 'warehouse',
      name: 'Lager',
      canPlace: true,
      candidate: null,
      validation: null,
      regionId: 'region_default',
    }),
    setBuildingMapPlacementCandidate: vi.fn(),
    setBuildingMapPlacementRegion: vi.fn(),
    confirmBuildingMapPlacement: vi.fn(),
    cancelBuildingMapPlacement: vi.fn(),
    regions: [{ id: 'region_default', name: 'Central Basin' }],
    companyViewData: {
      labels: {
        building: (id: string) => id,
        recipe: (id: string) => id,
      },
      detail: {
        buildings: new Map([
          [
            'building_001',
            Object.freeze({
              title: 'Firmenzentrale',
              subtitle: 'ACTIVE',
              entries: [['Typ', 'headquarters']] as const,
            }),
          ],
        ]),
      },
    },
    isBusy: false,
  }),
}));

describe('WorldScreen Escape', () => {
  it('clears map building selection during active placement (Slice 2F-B)', async () => {
    const user = userEvent.setup();
    render(<WorldScreen />);

    await user.click(screen.getByRole('button', { name: 'Select building marker' }));
    expect(screen.getByRole('button', { name: 'Inspektor schließen' })).toBeTruthy();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('button', { name: 'Inspektor schließen' })).toBeNull();
  });
});
