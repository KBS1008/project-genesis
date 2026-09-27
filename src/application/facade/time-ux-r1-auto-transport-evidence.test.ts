import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import { LoadGameUseCase } from '../use-cases/LoadGameUseCase.js';
import { GameSession } from './GameSession.js';
import { createBuildingId } from '../../domain/building/Building.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { formatApproximatePlayerFacingCycleDuration } from './player-facing-cycle-label.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');
const fixtureSavePath = path.resolve(
  testDirectory,
  '../../../tools/evidence-fixtures/time-ux-r1-production-auto-transport-hint.json',
);

const AUTO_TRANSPORT_HINT_PREFIX = 'Material im Lagerhaus — Transport startet automatisch';

describe('TIME-UX-R1 auto-transport evidence fixture', () => {
  it('exposes inbound transport hint with unchanged duration and Zyklus presentation', async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot, strictContent: true });

    expect(bootstrapResult.ok).toBe(true);

    if (!bootstrapResult.ok) {
      return;
    }

    const loadResult = await new LoadGameUseCase({
      savegameStore: bootstrapResult.value.savegameStore,
    }).execute({
      filePath: fixtureSavePath,
      gameContentRoot,
    });

    expect(loadResult.ok).toBe(true);

    if (!loadResult.ok) {
      return;
    }

    const context = loadResult.value;
    const companyIdResult = createCompanyId('company_001');
    const destinationResult = createBuildingId('building_005');

    expect(companyIdResult.ok).toBe(true);
    expect(destinationResult.ok).toBe(true);

    if (!companyIdResult.ok || !destinationResult.ok) {
      return;
    }

    const internalDurationTicks = context.transportLogisticsService.resolveInboundTransportDurationTicks(
      companyIdResult.value,
      destinationResult.value,
    );

    const sessionResult = await GameSession.create({ gameContentRoot });

    expect(sessionResult.ok).toBe(true);

    if (!sessionResult.ok) {
      return;
    }

    const loadSessionResult = await sessionResult.value.loadGame(fixtureSavePath);

    expect(loadSessionResult.ok).toBe(true);

    const dashboardResult = sessionResult.value.getDashboard();

    expect(dashboardResult.ok).toBe(true);

    if (!dashboardResult.ok) {
      return;
    }

    const hint = dashboardResult.value.hints.production.find(
      (entry) => entry.recipeId === 'recipe_planks' && entry.buildingId === 'building_005',
    );

    expect(hint).toBeDefined();
    expect(hint?.canStart).toBe(true);
    expect(hint?.reason).toContain(AUTO_TRANSPORT_HINT_PREFIX);

    const expectedSuffix = formatApproximatePlayerFacingCycleDuration(internalDurationTicks);
    expect(hint?.reason).toBe(`${AUTO_TRANSPORT_HINT_PREFIX} (${expectedSuffix}).`);
    expect(hint?.reason).not.toMatch(/\bTicks?\b/i);

    const visibleMatch = hint?.reason?.match(/~\s*(\d+)\s+(Zyklus|Zyklen)/);
    expect(visibleMatch).not.toBeNull();
    expect(Number(visibleMatch?.[1])).toBe(internalDurationTicks);
  });
});
