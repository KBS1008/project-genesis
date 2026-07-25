/**
 * @module @simulation/engine/m10SimulationPerformance.test
 *
 * Smoke test ensuring M10-expanded simulation ticks remain within budget.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { bootstrapApplication } from '../../application/bootstrap/bootstrapApplication.js';
import { StartNewGameUseCase } from '../../application/use-cases/StartNewGameUseCase.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

/** Generous CI budget for 100 ticks with NPC companies and regional markets. */
const TICK_BUDGET_MS = 8_000;
const TICK_COUNT = 100;

describe('M10 simulation performance', () => {
  it(`runs ${TICK_COUNT} ticks with full M10 content within ${TICK_BUDGET_MS}ms`, async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot });

    if (!bootstrapResult.ok) {
      throw new Error(bootstrapResult.error.message);
    }

    const context = bootstrapResult.value;
    const startNewGame = new StartNewGameUseCase(context);
    const startResult = startNewGame.execute({
      companyId: 'company_m10_perf',
      name: 'M10 Performance Corp',
      ownerId: 'player_001',
    });

    expect(startResult.ok).toBe(true);

    const startedAt = performance.now();

    for (let tick = 0; tick < TICK_COUNT; tick += 1) {
      const tickResult = context.simulationEngine.tick();

      if (!tickResult.ok) {
        throw new Error(tickResult.error.message);
      }
    }

    const elapsedMs = performance.now() - startedAt;

    expect(elapsedMs).toBeLessThan(TICK_BUDGET_MS);
    expect(context.simulationEngine.state.tickNumber).toBeGreaterThanOrEqual(TICK_COUNT);
  });
});
