import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContentLoadError } from '../../content/errors/ContentLoadError.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import * as bootstrapModule from '../bootstrap/bootstrapApplication.js';
import { StartNewGameUseCase } from '../use-cases/StartNewGameUseCase.js';
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

    const startResult = await session.startNewGame('Browser Test Corp');

    expect(startResult.ok).toBe(true);

    const dashboardResult = session.getDashboard();

    expect(dashboardResult.ok).toBe(true);

    if (dashboardResult.ok) {
      expect(dashboardResult.value.company?.name).toBe('Browser Test Corp');
      expect(dashboardResult.value.finance?.cashBalance).toBe(STARTING_MONEY);
      expect(dashboardResult.value.buildings).toHaveLength(NEW_GAME_STARTER_BUILDINGS.length);
      expect(
        dashboardResult.value.inventory?.items.some((item) => item.resourceId === 'wood'),
      ).toBe(true);
      expect(
        dashboardResult.value.inventory?.items.some((item) => item.resourceId === 'stone'),
      ).toBe(true);
      expect(
        dashboardResult.value.inventory?.items.some((item) => item.resourceId === 'iron_ore'),
      ).toBe(true);
      expect(dashboardResult.value.marketPrices.length).toBeGreaterThan(0);
      expect(
        dashboardResult.value.hints.production.some((hint) => hint.recipeId === 'recipe_planks'),
      ).toBe(false);
      expect(dashboardResult.value.tutorial?.activeStepId).toBe('build_sawmill');
      expect(dashboardResult.value.tutorial?.steps[0]?.completed).toBe(true);
      expect(dashboardResult.value.energy?.usesBaselineGrid).toBe(false);
      expect(dashboardResult.value.energy?.generation).toBeGreaterThan(0);
    }
  });

  it('places a building and advances simulation ticks', async () => {
    const session = await createSession();

    await session.startNewGame('Construction Test Corp');

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
    await session.startNewGame('Production Test Corp');

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
    await session.startNewGame('Market Buy Corp');

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
    await session.startNewGame('Batch Tick Corp');

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
    await session.startNewGame('History Test Corp');

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

  it('starts a second new game after an active game without company id collision', async () => {
    const session = await createSession();
    const first = await session.startNewGame('First Corp');
    expect(first.ok).toBe(true);

    const second = await session.startNewGame('BVB 09');
    expect(second.ok).toBe(true);

    const company = session.getCompany();
    expect(company.ok).toBe(true);

    if (company.ok && company.value !== null) {
      expect(company.value.name).toBe('BVB 09');
      expect(company.value.id).toBe('company_001');
    }
  });

  it('resets building id sequence after starting a new game on an active session', async () => {
    const session = await createSession();
    await session.startNewGame('First Corp');

    const first = session.placeBuilding({
      buildingTypeId: 'sawmill',
      name: 'First Sawmill',
      x: 0,
      y: 0,
    });

    expect(first.ok).toBe(true);

    if (!first.ok) {
      return;
    }

    expect(first.value).toBe('building_005');

    await session.startNewGame('Second Corp');

    const second = session.placeBuilding({
      buildingTypeId: 'sawmill',
      name: 'Second Sawmill',
      x: 5,
      y: 5,
    });

    expect(second.ok).toBe(true);

    if (second.ok) {
      expect(second.value).toBe('building_005');
    }
  });

  it('does not write to the configured save path when starting a new game', async () => {
    const tempDirectory = await mkdtemp(path.join(tmpdir(), 'genesis-new-game-save-'));
    const savePath = path.join(tempDirectory, 'browser-session.json');
    const marker = '{"marker":"preserve-on-new-game"}';

    try {
      await writeFile(savePath, marker, 'utf8');
      const session = await createSession(savePath);
      await session.startNewGame('First Corp');
      await session.startNewGame('Second Corp');

      const onDisk = await readFile(savePath, 'utf8');
      expect(onDisk).toBe(marker);
    } finally {
      await rm(tempDirectory, { recursive: true, force: true });
    }
  });

  it('preserves the active session when fresh bootstrap fails', async () => {
    const session = await createSession();
    await session.startNewGame('First Corp');

    const bootstrapSpy = vi
      .spyOn(bootstrapModule, 'bootstrapApplication')
      .mockResolvedValueOnce(Result.fail(new ContentLoadError('bootstrap failed for test')));

    const failed = await session.startNewGame('Second Corp');
    expect(failed.ok).toBe(false);

    const company = session.getCompany();
    expect(company.ok).toBe(true);

    if (company.ok && company.value !== null) {
      expect(company.value.name).toBe('First Corp');
    }

    bootstrapSpy.mockRestore();
  });

  it('preserves the active session when candidate new-game initialization fails', async () => {
    const session = await createSession();
    await session.startNewGame('First Corp');

    const executeSpy = vi
      .spyOn(StartNewGameUseCase.prototype, 'execute')
      .mockReturnValueOnce(Result.fail(new ValidationError('init failed for test')));

    const failed = await session.startNewGame('Second Corp');
    expect(failed.ok).toBe(false);

    const company = session.getCompany();
    expect(company.ok).toBe(true);

    if (company.ok && company.value !== null) {
      expect(company.value.name).toBe('First Corp');
    }

    executeSpy.mockRestore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('allocates a new building id after save, reload, and repeat placement', async () => {
    const tempDirectory = await mkdtemp(path.join(tmpdir(), 'genesis-building-id-seq-'));
    const savePath = path.join(tempDirectory, 'repeat-placement.json');

    try {
      const session = await createSession(savePath);
      await session.startNewGame('Repeat Placement Corp');

      const first = session.placeBuilding({
        buildingTypeId: 'sawmill',
        name: 'First Sawmill',
        x: 0,
        y: 0,
      });

      expect(first.ok).toBe(true);

      if (!first.ok) {
        return;
      }

      expect(first.value).toBe('building_005');

      const immediateSecond = session.placeBuilding({
        buildingTypeId: 'sawmill',
        name: 'Immediate Second Sawmill',
        x: 5,
        y: 5,
      });

      if (!immediateSecond.ok) {
        throw new Error(`immediate second: ${immediateSecond.error.message}`);
      }

      expect(immediateSecond.value).toBe('building_006');

      const saveResult = await session.saveGame();
      expect(saveResult.ok).toBe(true);

      const loadResult = await session.loadGame();
      expect(loadResult.ok).toBe(true);

      const secondAfterReload = session.placeBuilding({
        buildingTypeId: 'sawmill',
        name: 'Second Sawmill',
        x: 20,
        y: 20,
      });

      if (!secondAfterReload.ok) {
        throw new Error(secondAfterReload.error.message);
      }

      expect(secondAfterReload.value).toBe('building_007');
    } finally {
      await rm(tempDirectory, { recursive: true, force: true });
    }
  });

  it('persists and restores a browser session snapshot', async () => {
    const tempDirectory = await mkdtemp(path.join(tmpdir(), 'genesis-browser-save-'));
    const savePath = path.join(tempDirectory, 'browser-session.json');

    try {
      const session = await createSession(savePath);
      await session.startNewGame('Save Test Corp');

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

    await session.startNewGame('Employee Dashboard Corp');

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

  it('records production completion in the player event log with entity linkage', async () => {
    const session = await createSession();
    await session.startNewGame('Production Completion Corp');

    const placeResult = session.placeBuilding({
      buildingTypeId: 'sawmill',
      name: 'Completion Sawmill',
      x: 2,
      y: 2,
    });

    expect(placeResult.ok).toBe(true);

    if (!placeResult.ok) {
      return;
    }

    const buildingId = placeResult.value;
    completeConstructionWithTicks(session, 120);

    const hireOne = session.hireEmployee({
      employeeTypeId: 'employee_production_worker',
      displayName: 'Worker A',
    });
    const hireTwo = session.hireEmployee({
      employeeTypeId: 'employee_production_worker',
      displayName: 'Worker B',
    });

    expect(hireOne.ok).toBe(true);
    expect(hireTwo.ok).toBe(true);

    if (!hireOne.ok || !hireTwo.ok) {
      return;
    }

    session.assignEmployee({ employeeId: hireOne.value, buildingId });
    session.assignEmployee({ employeeId: hireTwo.value, buildingId });

    const productionResult = session.startProduction({
      buildingId,
      recipeId: 'recipe_planks',
    });

    expect(productionResult.ok).toBe(true);

    const tickResult = session.tick(70);

    expect(tickResult.ok).toBe(true);

    const jobsResult = session.listProductionJobs();

    expect(jobsResult.ok).toBe(true);

    if (jobsResult.ok) {
      expect(jobsResult.value[0]?.status).toBe('FINISHED');
    }

    const eventLogResult = session.getEventLog(20, 'PRODUCTION');

    expect(eventLogResult.ok).toBe(true);

    if (eventLogResult.ok) {
      const completionEvents = eventLogResult.value.filter((entry) =>
        entry.message.includes('abgeschlossen'),
      );

      expect(completionEvents).toHaveLength(1);
      expect(completionEvents[0]?.entityId).toBe('production_001');
      expect(completionEvents[0]?.entityType).toBe('production');

      const startEvents = eventLogResult.value.filter((entry) =>
        entry.message.includes('gestartet'),
      );

      expect(startEvents[0]?.entityId).toBe('production_001');
    }

    const duplicateTick = session.tick(1);

    expect(duplicateTick.ok).toBe(true);

    const eventLogAfter = session.getEventLog(20, 'PRODUCTION');

    expect(eventLogAfter.ok).toBe(true);

    if (eventLogAfter.ok) {
      expect(
        eventLogAfter.value.filter((entry) => entry.message.includes('abgeschlossen')),
      ).toHaveLength(1);
    }
  });

  it('includes recipe catalog on dashboard for production UI surfaces', async () => {
    const session = await createSession();
    await session.startNewGame('Recipe Catalog Corp');

    const dashboardResult = session.getDashboard();

    expect(dashboardResult.ok).toBe(true);

    if (dashboardResult.ok) {
      expect(dashboardResult.value.recipeCatalog.length).toBeGreaterThan(0);
      expect(
        dashboardResult.value.recipeCatalog.some((entry) => entry.id === 'recipe_planks'),
      ).toBe(true);
      expect(dashboardResult.value.recipeCatalog[0]?.inputs.length).toBeGreaterThan(0);
      expect(dashboardResult.value.recipeCatalog[0]?.outputs.length).toBeGreaterThan(0);
    }
  });

  it('exposes stalled workforce state for running jobs without assigned workers', async () => {
    const session = await createSession();
    await session.startNewGame('Production Stall Corp');

    const placeResult = session.placeBuilding({
      buildingTypeId: 'sawmill',
      name: 'Stall Sawmill',
      x: 3,
      y: 3,
    });

    expect(placeResult.ok).toBe(true);

    if (!placeResult.ok) {
      return;
    }

    completeConstructionWithTicks(session, 120);

    const productionResult = session.startProduction({
      buildingId: placeResult.value,
      recipeId: 'recipe_planks',
    });

    expect(productionResult.ok).toBe(true);

    session.tick(5);

    const jobsResult = session.listProductionJobs();

    expect(jobsResult.ok).toBe(true);

    if (jobsResult.ok) {
      expect(jobsResult.value[0]?.status).toBe('RUNNING');
      expect(jobsResult.value[0]?.operationalState).toBe('STALLED_WORKFORCE');
      expect(jobsResult.value[0]?.progress).toBe(0);
    }
  });

  it('exposes stalled energy state when company energy deficit blocks running jobs', async () => {
    const session = await createSession();
    await session.startNewGame('Production Energy Stall Corp');

    const placeProductionSawmill = session.placeBuilding({
      buildingTypeId: 'sawmill',
      name: 'Energy Stall Sawmill',
      x: 0,
      y: 0,
    });

    expect(placeProductionSawmill.ok).toBe(true);

    if (!placeProductionSawmill.ok) {
      return;
    }

    const productionBuildingId = placeProductionSawmill.value;
    completeConstructionWithTicks(session, 120);

    const hireOne = session.hireEmployee({
      employeeTypeId: 'employee_production_worker',
      displayName: 'Energy Worker A',
    });
    const hireTwo = session.hireEmployee({
      employeeTypeId: 'employee_production_worker',
      displayName: 'Energy Worker B',
    });

    expect(hireOne.ok).toBe(true);
    expect(hireTwo.ok).toBe(true);

    if (!hireOne.ok || !hireTwo.ok) {
      return;
    }

    session.assignEmployee({ employeeId: hireOne.value, buildingId: productionBuildingId });
    session.assignEmployee({ employeeId: hireTwo.value, buildingId: productionBuildingId });

    const productionResult = session.startProduction({
      buildingId: productionBuildingId,
      recipeId: 'recipe_planks',
    });

    expect(productionResult.ok).toBe(true);

    for (let index = 0; index < 6; index += 1) {
      const placeHeadquarters = session.placeBuilding({
        buildingTypeId: 'headquarters',
        name: `Energy Load HQ ${index + 1}`,
        x: 30 + index * 5,
        y: 30,
      });

      expect(placeHeadquarters.ok).toBe(true);
    }

    const jobsResult = session.listProductionJobs();

    expect(jobsResult.ok).toBe(true);

    if (jobsResult.ok) {
      const job = jobsResult.value.find((entry) => entry.buildingId === productionBuildingId);

      expect(job?.status).toBe('RUNNING');
      expect(job?.operationalState).toBe('STALLED_ENERGY');
      expect(job?.progress).toBe(0);
    }
  });
});
