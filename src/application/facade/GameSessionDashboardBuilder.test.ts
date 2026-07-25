import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import { EnergyBalanceService } from '../services/EnergyBalanceService.js';
import { GameSessionDashboardBuilder } from './GameSessionDashboardBuilder.js';
import type { DashboardHintInput } from './GameSessionDashboardBuilder.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

function createHintInput(
  overrides: Partial<DashboardHintInput> = {},
): DashboardHintInput {
  return {
    companyId: 'company_001',
    buildings: [],
    inventory: {
      id: 'inventory_001',
      companyId: 'company_001',
      status: 'ACTIVE',
      items: [],
    },
    warehouseStorage: [],
    finance: {
      id: 'finance_001',
      companyId: 'company_001',
      currency: 'GC',
      cashBalance: 100_000,
      reservedCash: 0,
      availableCash: 100_000,
    },
    marketPrices: [],
    completedMilestones: new Set(['first_steel', 'first_machine_parts']),
    completedResearch: new Set(['basic_woodworking', 'advanced_metallurgy']),
    researchJobs: [],
    productionJobs: [],
    transportOrders: [],
    employees: [],
    ...overrides,
  };
}

describe('GameSessionDashboardBuilder research hints', () => {
  it('blocks technologies when prerequisite research is missing', async () => {
    const bootstrapResult = await bootstrapApplication({
      gameContentRoot,
      strictContent: true,
    });

    expect(bootstrapResult.ok).toBe(true);

    if (!bootstrapResult.ok) {
      return;
    }

    const context = bootstrapResult.value;
    const builder = new GameSessionDashboardBuilder(
      context,
      new EnergyBalanceService({
        buildingRepository: context.buildingRepository,
        productionJobRepository: context.productionJobRepository,
        gameContent: context.gameContent,
      }),
    );

    const hints = builder.readHints(
      createHintInput({
        completedResearch: new Set(['basic_woodworking']),
        completedMilestones: new Set(['first_steel', 'first_machine_parts']),
      }),
    );

    const precisionMachining = hints.research.find(
      (hint) => hint.technologyId === 'precision_machining',
    );

    expect(precisionMachining).toBeDefined();
    expect(precisionMachining?.canStart).toBe(false);
    expect(precisionMachining?.reason).toBe('Forschung „advanced_metallurgy“ fehlt.');
  });

  it('allows technologies when prerequisite research and milestones are satisfied', async () => {
    const bootstrapResult = await bootstrapApplication({
      gameContentRoot,
      strictContent: true,
    });

    expect(bootstrapResult.ok).toBe(true);

    if (!bootstrapResult.ok) {
      return;
    }

    const context = bootstrapResult.value;
    const builder = new GameSessionDashboardBuilder(
      context,
      new EnergyBalanceService({
        buildingRepository: context.buildingRepository,
        productionJobRepository: context.productionJobRepository,
        gameContent: context.gameContent,
      }),
    );

    const hints = builder.readHints(createHintInput());

    const precisionMachining = hints.research.find(
      (hint) => hint.technologyId === 'precision_machining',
    );

    expect(precisionMachining).toBeDefined();
    expect(precisionMachining?.canStart).toBe(true);
    expect(precisionMachining?.reason).toBeNull();
  });
});
