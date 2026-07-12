import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { GameSession } from './GameSession.js';

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
  for (let index = 0; index < tickCount; index += 1) {
    const tickResult = session.tick();
    expect(tickResult.ok).toBe(true);
  }
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
      expect(dashboardResult.value.finance?.cashBalance).toBe(250_000);
      expect(dashboardResult.value.inventory?.items.some((item) => item.resourceId === 'wood')).toBe(
        true,
      );
      expect(dashboardResult.value.marketPrices.length).toBeGreaterThan(0);
      expect(dashboardResult.value.availableActions.canStartPlanksProduction).toBe(false);
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
      expect(dashboardResult.value.buildings).toHaveLength(1);
      expect(dashboardResult.value.buildings[0]?.buildingTypeId).toBe('sawmill');
      expect(dashboardResult.value.buildings[0]?.constructionProgress).toBeGreaterThan(0);
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

      const saveResult = await session.saveGame();

      expect(saveResult.ok).toBe(true);

      const freshSession = await createSession(savePath);
      const loadResult = await freshSession.loadGame();

      expect(loadResult.ok).toBe(true);

      const dashboardResult = freshSession.getDashboard();

      expect(dashboardResult.ok).toBe(true);

      if (dashboardResult.ok) {
        expect(dashboardResult.value.company?.name).toBe('Save Test Corp');
        expect(dashboardResult.value.buildings).toHaveLength(1);
        expect(dashboardResult.value.buildings[0]?.name).toBe('Saved Sawmill');
      }
    } finally {
      await rm(tempDirectory, { recursive: true, force: true });
    }
  });
});
