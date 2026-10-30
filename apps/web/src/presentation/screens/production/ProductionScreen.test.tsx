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
  const navigateProductionWorkforcePersonnel = vi.fn();
  let navigation: NavigationState = {
    screen: 'production',
    entitySelection: { kind: 'none' },
  };

  return {
    runCommand,
    selectEntity,
    clearEntitySelection,
    navigateToTarget,
    navigateProductionWorkforcePersonnel,
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
  Object.freeze({
    id: 'production_004',
    buildingId: 'building_005',
    recipeId: 'recipe_planks',
    status: 'RUNNING',
    operationalState: 'STALLED_WORKFORCE',
    progress: 0,
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
          durationLabel: '60 Zyklen',
          energyLabel: '0,20 / Zyklus',
          inputLabels: ['wood × 10'],
          outputLabels: ['planks × 20'],
          buildingTypeLabels: ['Sägewerk'],
          inputAvailability: [
            {
              resourceId: 'wood',
              resourceLabel: 'wood',
              requiredQuantity: 10,
              onSiteAvailable: 3,
              warehouseAvailable: 12,
              availableQuantity: 15,
              requiredLabel: '10',
              onSiteLabel: '3',
              warehouseLabel: '12',
              availableLabel: '15',
              statusLabel: 'Ausreichend',
              isSufficient: true,
            },
          ],
          inputOrigin: [
            {
              resourceId: 'wood',
              resourceLabel: 'Holz',
              producers: [],
            },
          ],
          outputUsage: [
            {
              resourceId: 'planks',
              resourceLabel: 'Bretter',
              consumers: [
                {
                  recipeId: 'recipe_consumer_goods',
                  recipeLabel: 'Konsumgüter herstellen',
                  buildingTypeLabels: ['Konsumgüterwerk'],
                  lineLabel: 'Konsumgüter herstellen — Konsumgüterwerk',
                },
              ],
            },
          ],
        },
        {
          id: 'recipe_machine_parts',
          name: 'Maschinenteile fertigen',
          durationLabel: '75 Zyklen',
          energyLabel: '0,24 / Zyklus',
          inputLabels: ['Stahl × 3'],
          outputLabels: ['Maschinenteile × 2'],
          buildingTypeLabels: ['Maschinenwerkstatt'],
          inputAvailability: [
            {
              resourceId: 'steel',
              resourceLabel: 'Stahl',
              requiredQuantity: 3,
              onSiteAvailable: 0,
              warehouseAvailable: 1,
              availableQuantity: 1,
              requiredLabel: '3',
              onSiteLabel: '0',
              warehouseLabel: '1',
              availableLabel: '1',
              statusLabel: 'Nicht ausreichend',
              isSufficient: false,
            },
          ],
          inputOrigin: [
            {
              resourceId: 'steel',
              resourceLabel: 'Stahl',
              producers: [
                {
                  recipeId: 'recipe_steel',
                  recipeLabel: 'Stahl schmelzen',
                  buildingTypeLabels: ['Hochofen'],
                  lineLabel: 'Stahl schmelzen — Hochofen',
                },
              ],
            },
          ],
          outputUsage: [
            {
              resourceId: 'machine_parts',
              resourceLabel: 'Maschinenteile',
              consumers: [],
            },
          ],
        },
        {
          id: 'recipe_steel',
          name: 'Stahl schmelzen',
          durationLabel: '120 Zyklen',
          energyLabel: '0,50 / Zyklus',
          inputLabels: ['Eisenerz × 5'],
          outputLabels: ['Stahl × 3'],
          buildingTypeLabels: ['Hochofen'],
          inputAvailability: [],
          inputOrigin: [
            {
              resourceId: 'iron_ore',
              resourceLabel: 'Eisenerz',
              producers: [],
            },
          ],
          outputUsage: [
            {
              resourceId: 'steel',
              resourceLabel: 'Stahl',
              consumers: [],
            },
          ],
        },
        {
          id: 'recipe_consumer_goods',
          name: 'Konsumgüter herstellen',
          durationLabel: '90 Zyklen',
          energyLabel: '0,22 / Zyklus',
          inputLabels: ['advanced_electronics × 2', 'planks × 5'],
          outputLabels: ['consumer_goods × 3'],
          buildingTypeLabels: ['Konsumgüterwerk'],
          inputAvailability: [],
          inputOrigin: [
            {
              resourceId: 'advanced_electronics',
              resourceLabel: 'Elektronik',
              producers: [
                {
                  recipeId: 'recipe_advanced_electronics',
                  recipeLabel: 'Advanced Elektronik produzieren',
                  buildingTypeLabels: ['Elektronikfabrik'],
                  lineLabel: 'Advanced Elektronik produzieren — Elektronikfabrik',
                },
              ],
            },
            {
              resourceId: 'planks',
              resourceLabel: 'Bretter',
              producers: [
                {
                  recipeId: 'recipe_planks',
                  recipeLabel: 'Bretter herstellen',
                  buildingTypeLabels: ['Sägewerk'],
                  lineLabel: 'Bretter herstellen — Sägewerk',
                },
                {
                  recipeId: 'recipe_advanced_planks',
                  recipeLabel: 'Advanced Plank Production',
                  buildingTypeLabels: ['Sägewerk'],
                  lineLabel: 'Advanced Plank Production — Sägewerk',
                },
              ],
            },
          ],
          outputUsage: [{ resourceId: 'consumer_goods', resourceLabel: 'Konsumgüter', consumers: [] }],
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
    navigateProductionWorkforcePersonnel: workspaceState.navigateProductionWorkforcePersonnel,
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

  it('adds decorative DashboardIcon cues on stalled and finished summary cards only', () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    render(<ProductionScreen />);

    const overview = screen.getByLabelText('Produktionsübersicht');
    const summaryIcons = overview.querySelectorAll('.pg-production-state-icon[aria-hidden="true"]');
    expect(summaryIcons).toHaveLength(3);

    const laufendHeading = screen.getByRole('heading', { name: 'Laufend' });
    expect(laufendHeading.querySelector('.pg-production-state-icon')).toBeNull();

    const wartendHeading = screen.getByRole('heading', { name: 'Wartend' });
    expect(wartendHeading.querySelector('.pg-production-state-icon')).toBeNull();

    const jobsTable = screen.getByRole('table', { name: 'Aktive Produktionsjobs' });
    expect(jobsTable.querySelector('.pg-production-state-icon')).toBeNull();
  });

  it('renders PR-002 factory groups and PR-003 recipe catalog', () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    render(<ProductionScreen />);

    expect(screen.getByText('Fabriken')).toBeInTheDocument();
    expect(screen.getAllByText('Sägewerk Nord').length).toBeGreaterThan(0);
    expect(screen.getByText('Rezeptkatalog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bretter herstellen/ })).toBeInTheDocument();
    expect(screen.getByText(/60 Zyklen · 0,20 \/ Zyklus/)).toBeInTheDocument();
    expect(screen.queryByText(/Tick/i)).toBeNull();
  });

  it('shows stalled energy status and progress for active jobs', () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    render(<ProductionScreen />);

    expect(screen.getAllByText('Energie fehlt').length).toBeGreaterThan(0);
    expect(screen.getAllByText('42%').length).toBeGreaterThan(0);
  });

  it('shows workforce guidance and Personal verwalten only for STALLED_WORKFORCE rows', async () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    workspaceState.navigateProductionWorkforcePersonnel.mockClear();
    workspaceState.runCommand.mockClear();
    const user = userEvent.setup();
    render(<ProductionScreen />);

    expect(screen.getByText(/Unternehmen → Operatives Dashboard → Personal/)).toBeInTheDocument();
    expect(screen.getByText(/dem betroffenen Gebäude zuweisen/)).toBeInTheDocument();
    expect(screen.queryByText(/Produktionsmitarbeiter/i)).toBeNull();
    expect(screen.queryByText(/\b2 Mitarbeiter\b/i)).toBeNull();

    const workforceButtons = screen.getAllByRole('button', { name: /Personal verwalten/ });
    expect(workforceButtons).toHaveLength(1);

    await user.click(workforceButtons[0]!);

    expect(workspaceState.navigateProductionWorkforcePersonnel).toHaveBeenCalledWith('building_005');
    expect(workspaceState.runCommand).not.toHaveBeenCalled();
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
    expect(within(jobsTable).getAllByRole('row')).toHaveLength(4);
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

  it('shows recipe input availability table when a catalog recipe is selected', async () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    const user = userEvent.setup();
    render(<ProductionScreen />);

    await user.click(screen.getByRole('button', { name: /Bretter herstellen/ }));

    const inputTable = document.querySelector('.pg-recipe-input-availability-table');
    expect(inputTable).not.toBeNull();
    const table = within(inputTable as HTMLElement);
    const headers = Array.from(table.getAllByRole('columnheader')).map((cell) => cell.textContent);
    expect(headers).toEqual([
      'Rohstoff',
      'Benötigt',
      'Standort',
      'Lager',
      'Verfügbar',
      'Status',
    ]);
    expect(table.getByRole('columnheader', { name: 'Standort' })).toBeInTheDocument();
    expect(table.getByRole('columnheader', { name: 'Lager' })).toBeInTheDocument();
    expect(table.getByRole('row', { name: /wood 10 3 12 15 Ausreichend/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Lagerbestände müssen gegebenenfalls automatisch zum Produktionsstandort transportiert werden.',
      ),
    ).toBeInTheDocument();
  });

  it('shows split and warehouse-only supply columns for selected recipes', async () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    const user = userEvent.setup();
    render(<ProductionScreen />);

    await user.click(screen.getByRole('button', { name: /Maschinenteile fertigen/ }));

    const inputTable = document.querySelector('.pg-recipe-input-availability-table');
    expect(inputTable).not.toBeNull();
    const table = within(inputTable as HTMLElement);
    expect(table.getByRole('row', { name: /Stahl 3 0 1 1 Nicht ausreichend/i })).toBeInTheDocument();
  });

  it('shows Weiterverwendung consumers beneath Ausgaben for the selected recipe', async () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    const user = userEvent.setup();
    render(<ProductionScreen />);

    await user.click(screen.getByRole('button', { name: /Bretter herstellen/ }));

    expect(screen.getByText('Weiterverwendung')).toBeInTheDocument();
    expect(screen.getByText(/Bretter wird benötigt für:/)).toBeInTheDocument();
    expect(
      screen.getByText('Konsumgüter herstellen — Konsumgüterwerk'),
    ).toBeInTheDocument();
  });

  it('shows empty Weiterverwendung copy when no downstream recipes consume outputs', async () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    const user = userEvent.setup();
    render(<ProductionScreen />);

    await user.click(screen.getByRole('button', { name: /Stahl schmelzen/ }));

    expect(
      screen.getByText(
        'Keine weitere Verwendung in den derzeit bekannten Produktionsrezepten.',
      ),
    ).toBeInTheDocument();
  });

  it('updates Weiterverwendung when switching catalog recipes', async () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    const user = userEvent.setup();
    render(<ProductionScreen />);

    await user.click(screen.getByRole('button', { name: /Stahl schmelzen/ }));
    expect(
      screen.getByText(
        'Keine weitere Verwendung in den derzeit bekannten Produktionsrezepten.',
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Bretter herstellen/ }));
    expect(screen.getByText(/Bretter wird benötigt für:/)).toBeInTheDocument();
    expect(
      screen.queryByText(
        'Keine weitere Verwendung in den derzeit bekannten Produktionsrezepten.',
      ),
    ).toBeNull();
  });

  it('shows Herstellbar durch between Eingaben and Ausgaben with disclaimer', async () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    const user = userEvent.setup();
    render(<ProductionScreen />);

    await user.click(screen.getByRole('button', { name: /Bretter herstellen/ }));

    expect(screen.getByText('Herstellbar durch')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Die Anzeige zeigt bekannte Herstellungsrezepte, unabhängig von Freischaltung oder Verfügbarkeit.',
      ),
    ).toBeInTheDocument();

    const eingaben = screen.getByText('Eingaben');
    const herstellbar = screen.getByText('Herstellbar durch');
    const ausgaben = screen.getByText('Ausgaben');

    expect(
      eingaben.compareDocumentPosition(herstellbar) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      herstellbar.compareDocumentPosition(ausgaben) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('shows upstream steel producer for machine parts recipe', async () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    const user = userEvent.setup();
    render(<ProductionScreen />);

    await user.click(screen.getByRole('button', { name: /Maschinenteile fertigen/ }));

    expect(screen.getByText('Stahl schmelzen — Hochofen')).toBeInTheDocument();
  });

  it('shows multiple upstream producers for planks input', async () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    const user = userEvent.setup();
    render(<ProductionScreen />);

    await user.click(screen.getByRole('button', { name: /Konsumgüter herstellen/ }));

    expect(screen.getByText('Bretter herstellen — Sägewerk')).toBeInTheDocument();
    expect(screen.getByText('Advanced Plank Production — Sägewerk')).toBeInTheDocument();
  });

  it('shows empty origin copy for inputs without catalog producers', async () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    const user = userEvent.setup();
    render(<ProductionScreen />);

    await user.click(screen.getByRole('button', { name: /Bretter herstellen/ }));

    expect(
      screen.getByText('Kein Herstellungsrezept im bekannten Rezeptkatalog.'),
    ).toBeInTheDocument();
  });

  it('preserves Eingaben availability and Weiterverwendung when Herstellbar durch is shown', async () => {
    workspaceState.setNavigation({ screen: 'production', entitySelection: { kind: 'none' } });
    const user = userEvent.setup();
    render(<ProductionScreen />);

    await user.click(screen.getByRole('button', { name: /Bretter herstellen/ }));

    expect(document.querySelector('.pg-recipe-input-availability-table')).not.toBeNull();
    expect(screen.getByText('Ausgaben')).toBeInTheDocument();
    expect(screen.getByText('Weiterverwendung')).toBeInTheDocument();
  });
});
