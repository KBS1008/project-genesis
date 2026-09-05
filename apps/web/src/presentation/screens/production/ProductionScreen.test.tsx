// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ProductionJobSessionReadModel } from '@/presentation/adapters/api/client';
import type { NavigationState } from '@/presentation/state/navigation-state';
import { ProductionScreen } from '@/presentation/screens/production/ProductionScreen';

const workspaceState = vi.hoisted(() => {
  const runCommand = vi.fn();
  const selectEntity = vi.fn();
  const clearEntitySelection = vi.fn();
  const navigateToTarget = vi.fn();
  let navigation: NavigationState = {
    screen: 'production',
    entitySelection: { kind: 'none' },
  };

  return {
    runCommand,
    selectEntity,
    clearEntitySelection,
    navigateToTarget,
    getNavigation: () => navigation,
    setNavigation: (value: NavigationState) => {
      navigation = value;
    },
  };
});

const productionJobsFixture: readonly ProductionJobSessionReadModel[] = Object.freeze([
  Object.freeze({
    id: 'production_001',
    buildingId: 'building_005',
    recipeId: 'recipe_planks',
    status: 'RUNNING',
    operationalState: 'STALLED_ENERGY',
    progress: 42,
    awaitingTransport: false,
    activeTransportCount: 0,
  }),
  Object.freeze({
    id: 'production_002',
    buildingId: 'building_005',
    recipeId: 'recipe_planks',
    status: 'WAITING',
    operationalState: 'WAITING',
    progress: 0,
    awaitingTransport: true,
    activeTransportCount: 1,
  }),
  Object.freeze({
    id: 'production_003',
    buildingId: 'building_006',
    recipeId: 'recipe_planks',
    status: 'FINISHED',
    operationalState: 'FINISHED',
    progress: 100,
    awaitingTransport: false,
    activeTransportCount: 0,
  }),
]);

vi.mock('@/presentation/hooks/useScreenQuery', () => ({
  TICK_QUERY_DEBOUNCE_MS: 250,
  useScreenQuery: () => ({
    data: productionJobsFixture,
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
        recipe: (id: string) => (id === 'recipe_planks' ? 'Bretter herstellen' : id),
        technology: (id: string) => id,
        employee: (id: string) => id,
      },
      buildings: [
        {
          id: 'building_005',
          name: 'Sägewerk Nord',
          buildingTypeLabel: 'Sägewerk',
          statusLabel: 'ACTIVE',
          positionLabel: '2, 2',
          regionId: 'region_001',
          regionLabel: 'Heimatregion',
          isUnderConstruction: false,
          constructionProgressPercent: 100,
        },
        {
          id: 'building_006',
          name: 'Sägewerk Süd',
          buildingTypeLabel: 'Sägewerk',
          statusLabel: 'ACTIVE',
          positionLabel: '4, 4',
          regionId: 'region_001',
          regionLabel: 'Heimatregion',
          isUnderConstruction: false,
          constructionProgressPercent: 100,
        },
      ],
      hints: {
        production: [
          {
            buildingId: 'building_005',
            recipeId: 'recipe_planks',
            buildingName: 'Sägewerk Nord',
            recipeName: 'Bretter herstellen',
            canStart: true,
            reason: null,
          },
          {
            buildingId: 'building_006',
            recipeId: 'recipe_planks',
            buildingName: 'Sägewerk Süd',
            recipeName: 'Bretter herstellen',
            canStart: false,
            reason: 'Material fehlt',
          },
        ],
      },
      warehouseStorage: [
        {
          id: 'building_005',
          buildingLabel: 'Sägewerk Nord',
          capacityLabel: '10/100',
          usedLabel: '10',
          items: [{ resourceId: 'wood', resourceLabel: 'wood', quantity: 10, reserved: 0, available: 10 }],
        },
      ],
      recipeCatalog: [
        {
          id: 'recipe_planks',
          name: 'Bretter herstellen',
          durationLabel: '60 Ticks',
          energyLabel: '0,20 / Tick',
          inputLabels: ['wood × 10'],
          outputLabels: ['planks × 20'],
          buildingTypeLabels: ['Sägewerk'],
        },
      ],
      detail: {
        productionJobs: new Map([
          [
            'production_001',
            {
              title: 'Bretter herstellen',
              subtitle: 'Produktion · Sägewerk Nord',
              entries: [
                ['Status', 'Energie fehlt'],
                ['Fortschritt', '42 %'],
              ],
            },
          ],
        ]),
      },
    },
    isBusy: false,
    runCommand: workspaceState.runCommand,
    navigation: workspaceState.getNavigation(),
    selectEntity: workspaceState.selectEntity,
    clearEntitySelection: workspaceState.clearEntitySelection,
    navigateToTarget: workspaceState.navigateToTarget,
  }),
}));

describe('ProductionScreen', () => {
  it('renders PR-001 overview metrics from authoritative job state', () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    render(<ProductionScreen />);

    expect(screen.getByLabelText('Produktionsübersicht')).toBeInTheDocument();
    expect(screen.getByText('Aktive Jobs')).toBeInTheDocument();
    expect(screen.getByText('Laufend')).toBeInTheDocument();
  });

  it('renders PR-002 factory groups and PR-003 recipe catalog', () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    render(<ProductionScreen />);

    expect(screen.getByText('Fabriken')).toBeInTheDocument();
    expect(screen.getAllByText('Sägewerk Nord').length).toBeGreaterThan(0);
    expect(screen.getByText('Rezeptkatalog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bretter herstellen/ })).toBeInTheDocument();
  });

  it('shows stalled energy status and progress for active jobs', () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    render(<ProductionScreen />);

    expect(screen.getAllByText('Energie fehlt').length).toBeGreaterThan(0);
    expect(screen.getAllByText('42%').length).toBeGreaterThan(0);
  });

  it('selects a production job for entity navigation', async () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    const user = userEvent.setup();
    workspaceState.selectEntity.mockClear();

    render(<ProductionScreen />);

    await user.click(screen.getByRole('row', { name: /Energie fehlt/ }));

    expect(workspaceState.selectEntity).toHaveBeenCalledWith({
      kind: 'production',
      id: 'production_001',
    });
  });

  it('starts production from recipe-scoped hints', async () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    const user = userEvent.setup();
    workspaceState.runCommand.mockClear();

    render(<ProductionScreen />);

    await user.click(screen.getByRole('button', { name: /Bretter herstellen/ }));
    await user.click(screen.getAllByRole('button', { name: 'Starten' })[0]!);

    expect(workspaceState.runCommand).toHaveBeenCalledTimes(1);
  });

  it('scopes jobs, hints, and overview to selected building context', () => {
    workspaceState.setNavigation({
      screen: 'production',
      entitySelection: { kind: 'building', id: 'building_005' },
    });
    render(<ProductionScreen />);

    expect(screen.getByLabelText('Produktionskontext: Sägewerk Nord')).toBeInTheDocument();
    const jobsTable = screen.getByRole('table', { name: 'Aktive Produktionsjobs' });
    expect(within(jobsTable).getAllByRole('row')).toHaveLength(3);
    expect(screen.queryByText('Sägewerk Süd')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Starten' })).toHaveLength(1);
    expect(screen.queryByText('Material fehlt')).not.toBeInTheDocument();
  });

  it('clears building filter via shared selection', async () => {
    workspaceState.setNavigation({
      screen: 'production',
      entitySelection: { kind: 'building', id: 'building_005' },
    });
    const user = userEvent.setup();
    workspaceState.clearEntitySelection.mockClear();

    render(<ProductionScreen />);

    await user.click(screen.getByRole('button', { name: 'Alle Standorte' }));

    expect(workspaceState.clearEntitySelection).toHaveBeenCalledTimes(1);
  });

  it('links warehouse detail when authoritative storage exists for building', async () => {
    workspaceState.setNavigation({
      screen: 'production',
      entitySelection: { kind: 'building', id: 'building_005' },
    });
    const user = userEvent.setup();
    workspaceState.navigateToTarget.mockClear();

    render(<ProductionScreen />);

    await user.click(screen.getByRole('button', { name: 'Lagerdetails öffnen' }));

    expect(workspaceState.navigateToTarget).toHaveBeenCalledWith({
      screen: 'company',
      entitySelection: { kind: 'warehouse', id: 'building_005' },
    });
  });
});
