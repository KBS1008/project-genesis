import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GameSession } from './GameSession.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

describe('GameSession', () => {
  it('starts a new game and returns a dashboard snapshot', async () => {
    const sessionResult = await GameSession.create({ gameContentRoot });

    expect(sessionResult.ok).toBe(true);

    if (!sessionResult.ok) {
      return;
    }

    const session = sessionResult.value;
    const emptyDashboard = session.getDashboard();

    expect(emptyDashboard.ok).toBe(true);

    if (emptyDashboard.ok) {
      expect(emptyDashboard.value.company).toBeNull();
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
    }
  });

  it('places a building and advances simulation ticks', async () => {
    const sessionResult = await GameSession.create({ gameContentRoot });

    expect(sessionResult.ok).toBe(true);

    if (!sessionResult.ok) {
      return;
    }

    const session = sessionResult.value;

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
    }
  });
});
