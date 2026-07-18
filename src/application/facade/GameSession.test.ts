import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { GameSession } from './GameSession.js';
import { STARTING_MONEY } from '../../domain/finance/FinanceConstants.js';
import { NEW_GAME_STARTER_BUILDINGS } from '../new-game/NewGameSetupConstants.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

async function createSession(savePath?: string) {
  const sessionResult = await GameSession.create(
    savePath === undefined ? { gameContentRoot } : { gameContentRoot, savePath },
  );

  expect(sessionResult.ok).toBe(true);

  if (!sessionResult.ok) {
    throw new Error(sessionResult.error.message);
  }

  return sessionResult.value;
}

function completeConstructionWithTicks(session: GameSession, tickCount = 120): void {
  const tickResult = session.tick(tickCount);
  expect(tickResult.ok).toBe(true);
}

function readTotalWoodQuantity(dashboard: {
  inventory: { items: readonly { resourceId: string; quantity: number }[] } | null;
  warehouseStorage: readonly { items: readonly { resourceId: string; quantity: number }[] }[];
}) {
  const onSiteWood =
    dashboard.inventory?.items.find((item) => item.resourceId === 'wood')?.quantity ?? 0;
  const warehouseWood = dashboard.warehouseStorage.reduce(
    (total, storage) =>
      total + (storage.items.find((item) => item.resourceId === 'wood')?.quantity ?? 0),
    0,
  );

  return onSiteWood + warehouseWood;
}

describe('GameSession', () => {
  it('starts a new game and returns a dashboard snapshot', async () => {
    const session = await createSession();
    const emptyDashboard = session.getDashboard();

    expect(emptyDashboard.ok).toBe(true);

    if (emptyDashboard.ok) {
      expect(emptyDashboard.value.company).toBeNull();
      expect(emptyDashboard.value.milestones.length).toBeGreaterThan(0);
    }

    const startResult = session.startNewGame('Browser Test Corp');

    expect(startResult.ok).toBe(true);

    const dashboardResult = session.getDashboard();

    expect(dashboardResult.ok).toBe(true);

    if (dashboardResult.ok) {
      expect(dashboardResult.value.company?.name).toBe('Browser Test Corp');
      expect(dashboardResult.value.finance?.cashBalance).toBe(STARTING_MONEY);
      expect(dashboardResult.value.buildings).toHaveLength(NEW_GAME_STARTER_BUILDINGS.length);
      expect(dashboardResult.value.inventory?.items.some((item) => item.resourceId === 'wood')).toBe(
        true,
      );
      expect(dashboardResult.value.inventory?.items.some((item) => item.resourceId === 'stone')).toBe(
        true,
      );
      expect(dashboardResult.value.inventory?.items.some((item) => item.resourceId === 'iron_ore')).toBe(
        true,
      );
      expect(dashboardResult.value.marketPrices.length).toBeGreaterThan(0);
      expect(dashboardResult.value.hints.production.some((hint) => hint.recipeId === 'recipe_planks')).toBe(
        false,
      );
      expect(dashboardResult.value.tutorial?.activeStepId).toBe('build_sawmill');
      expect(dashboardResult.value.tutorial?.steps[0]?.completed).toBe(true);
      expect(dashboardResult.value.energy?.usesBaselineGrid).toBe(false);
      expect(dashboardResult.value.energy?.generation).toBeGreaterThan(0);
    }
  });

  it('places a building and advances simulation ticks', async () => {
    const session = await createSession();

    session.startNewGame('Construction Test Corp');

    const placeResult = session.placeBuilding({
      buildingTypeId: 'sawmill',
      name: 'Test Sawmill',
      x: 1,
      y: 2,
    });

    expect(placeResult.ok).toBe(true);

    const tickResult = session.tick();

    expect(tickResult.ok).toBe(true);

    const dashboardResult = session.getDashboard();

    expect(dashboardResult.ok).toBe(true);

    if (dashboardResult.ok) {
      expect(dashboardResult.value.buildings).toHaveLength(NEW_GAME_STARTER_BUILDINGS.length + 1);
      const sawmill = dashboardResult.value.buildings.find(
        (building) => building.buildingTypeId === 'sawmill',
      );
      expect(sawmill?.constructionProgress).toBeGreaterThan(0);
    }
  });

  it('starts production after construction completes', async () => {
    const session = await createSession();
    session.startNewGame('Production Test Corp');

    const placeResult = session.placeBuilding({
      buildingTypeId: 'sawmill',
      name: 'Production Sawmill',
      x: 0,
      y: 0,
    });

    expect(placeResult.ok).toBe(true);

    if (!placeResult.ok) {
      return;
    }

    completeConstructionWithTicks(session);

    const productionResult = session.startProduction({
      buildingId: placeResult.value,
      recipeId: 'recipe_planks',
    });

    expect(productionResult.ok).toBe(true);

    const dashboardResult = session.getDashboard();

    expect(dashboardResult.ok).toBe(true);

    if (dashboardResult.ok) {
      expect(dashboardResult.value.buildings[0]?.status).toBe('ACTIVE');
      expect(dashboardResult.value.productionJobs).toHaveLength(1);
      expect(dashboardResult.value.productionJobs[0]?.recipeId).toBe('recipe_planks');
    }
  });

  it('buys wood on the market and advances the simulation', async () => {
    const session = await createSession();
    session.startNewGame('Market Buy Corp');

    const sellResult = session.sellResource({ resourceId: 'wood', amount: 5 });

    expect(sellResult.ok).toBe(true);

    const dashboardBeforeBuy = session.getDashboard();

    expect(dashboardBeforeBuy.ok).toBe(true);

    if (!dashboardBeforeBuy.ok) {
      return;
    }

    const woodBeforeBuy = readTotalWoodQuantity(dashboardBeforeBuy.value);

    const buyResult = session.buyResource({ resourceId: 'wood', amount: 5 });

    expect(buyResult.ok).toBe(true);

    const dashboardAfterBuy = session.getDashboard();

    expect(dashboardAfterBuy.ok).toBe(true);

    if (dashboardAfterBuy.ok) {
      const woodAfterBuy = readTotalWoodQuantity(dashboardAfterBuy.value);

      expect(woodAfterBuy).toBe(woodBeforeBuy + 5);
      expect(
        dashboardAfterBuy.value.hints.market.some(
          (hint) => hint.resourceId === 'wood' && hint.canBuy,
        ),
      ).toBe(true);
    }
  });

  it('advances multiple simulation ticks in one request', async () => {
    const session = await createSession();
    session.startNewGame('Batch Tick Corp');

    const tickResult = session.tick(10);

    expect(tickResult.ok).toBe(true);

    const dashboardResult = session.getDashboard();

    expect(dashboardResult.ok).toBe(true);

    if (dashboardResult.ok) {
      expect(dashboardResult.value.tickNumber).toBe(11);
    }
  });

  it('records tick history for dashboard charts', async () => {
    const session = await createSession();
    session.startNewGame('History Test Corp');

    const initialHistory = session.getTickHistory();

    expect(initialHistory.ok).toBe(true);

    if (initialHistory.ok) {
      expect(initialHistory.value.points).toHaveLength(1);
      expect(initialHistory.value.points[0]?.availableCash).toBe(STARTING_MONEY);
    }

    session.tick(3);

    const historyAfterTicks = session.getTickHistory();

    expect(historyAfterTicks.ok).toBe(true);

    if (historyAfterTicks.ok) {
      expect(historyAfterTicks.value.points.length).toBe(4);
      expect(historyAfterTicks.value.points.at(-1)?.tickNumber).toBe(4);
    }
  });

  it('persists and restores a browser session snapshot', async () => {
    const tempDirectory = await mkdtemp(path.join(tmpdir(), 'genesis-browser-save-'));
    const savePath = path.join(tempDirectory, 'browser-session.json');

    try {
      const session = await createSession(savePath);
      session.startNewGame('Save Test Corp');

      const placeResult = session.placeBuilding({
        buildingTypeId: 'sawmill',
        name: 'Saved Sawmill',
        x: 4,
        y: 1,
      });

      expect(placeResult.ok).toBe(true);

      session.tick();

      const historyBeforeSave = session.getTickHistory();

      expect(historyBeforeSave.ok).toBe(true);

      if (historyBeforeSave.ok) {
        expect(historyBeforeSave.value.points.length).toBeGreaterThanOrEqual(2);
      }

      const saveResult = await session.saveGame();

      expect(saveResult.ok).toBe(true);

      const freshSession = await createSession(savePath);
      const loadResult = await freshSession.loadGame();

      expect(loadResult.ok).toBe(true);

      const historyAfterLoad = freshSession.getTickHistory();

      expect(historyAfterLoad.ok).toBe(true);

      if (historyBeforeSave.ok && historyAfterLoad.ok) {
        expect(historyAfterLoad.value.points).toEqual(historyBeforeSave.value.points);
      }

      const dashboardResult = freshSession.getDashboard();

      expect(dashboardResult.ok).toBe(true);

      if (dashboardResult.ok) {
        expect(dashboardResult.value.company?.name).toBe('Save Test Corp');
        expect(dashboardResult.value.buildings).toHaveLength(NEW_GAME_STARTER_BUILDINGS.length + 1);
        expect(
          dashboardResult.value.buildings.some((building) => building.name === 'Saved Sawmill'),
        ).toBe(true);
      }
    } finally {
      await rm(tempDirectory, { recursive: true, force: true });
    }
  });

  it('exposes hired and assigned employees on the dashboard', async () => {
    const session = await createSession();

    session.startNewGame('Employee Dashboard Corp');

    const placeResult = session.placeBuilding({
      buildingTypeId: 'sawmill',
      name: 'Worker Sawmill',
      x: 4,
      y: 4,
    });

    expect(placeResult.ok).toBe(true);

    if (!placeResult.ok) {
      return;
    }

    const buildingId = placeResult.value;

    completeConstructionWithTicks(session, 120);

    const hireResult = session.hireEmployee({
      employeeTypeId: 'employee_production_worker',
      displayName: 'Production Worker',
    });

    expect(hireResult.ok).toBe(true);

    const dashboardAfterHire = session.getDashboard();

    expect(dashboardAfterHire.ok).toBe(true);

    if (!dashboardAfterHire.ok || !hireResult.ok) {
      return;
    }

    expect(dashboardAfterHire.value.employees).toHaveLength(1);
    expect(dashboardAfterHire.value.employees[0]?.displayName).toBe('Production Worker');
    expect(dashboardAfterHire.value.kpis?.employeeCount).toBe(1);
    expect(dashboardAfterHire.value.kpis?.assignedEmployeeCount).toBe(0);
    expect(dashboardAfterHire.value.kpis?.payrollPerInterval).toBe(120);
    expect(
      dashboardAfterHire.value.hints.hireEmployee.some(
        (hint) => hint.employeeTypeId === 'employee_production_worker',
      ),
    ).toBe(true);
    expect(dashboardAfterHire.value.contentNames.employees.length).toBeGreaterThan(0);

    const assignResult = session.assignEmployee({
      employeeId: hireResult.value,
      buildingId,
    });

    expect(assignResult.ok).toBe(true);

    const dashboardAfterAssign = session.getDashboard();

    expect(dashboardAfterAssign.ok).toBe(true);

    if (dashboardAfterAssign.ok) {
      expect(dashboardAfterAssign.value.employees[0]?.assignedBuildingId).toBe(buildingId);
      expect(dashboardAfterAssign.value.kpis?.assignedEmployeeCount).toBe(1);
      expect(
        dashboardAfterAssign.value.hints.assignEmployee.some(
          (hint) => hint.employeeId === hireResult.value && hint.canAssign,
        ),
      ).toBe(false);
    }
  });
});
