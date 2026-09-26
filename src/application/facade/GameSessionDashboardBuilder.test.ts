import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import { EnergyBalanceService } from '../services/EnergyBalanceService.js';
import { GameSessionDashboardBuilder, type DashboardHintInput } from './GameSessionDashboardBuilder.js';

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
    expect(precisionMachining?.reason).toBe('Forschung „Fortgeschrittene Metallurgie“ fehlt.');
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

describe('GameSessionDashboardBuilder milestone requirement labels', () => {
  it('uses authoritative milestone names in building placement blockers', async () => {
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
        completedMilestones: new Set(),
      }),
    );

    const railTerminal = hints.placeBuilding.find((entry) => entry.buildingTypeId === 'rail_terminal');
    expect(railTerminal?.canPlace).toBe(false);
    expect(railTerminal?.reason).toBe('Meilenstein „Erste Industriemaschine“ fehlt.');
    expect(railTerminal?.reason).not.toContain('first_industrial_machinery');
  });

  it('uses authoritative milestone names in research blockers', async () => {
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
        completedMilestones: new Set(['first_steel', 'first_machine_parts']),
        completedResearch: new Set(['circuit_design']),
      }),
    );

    const semiconductor = hints.research.find(
      (entry) => entry.technologyId === 'semiconductor_process',
    );
    expect(semiconductor?.canStart).toBe(false);
    expect(semiconductor?.reason).toBe('Meilenstein „Erste Advanced Elektronik“ fehlt.');
    expect(semiconductor?.reason).not.toContain('first_advanced_electronics');
  });
});

describe('GameSessionDashboardBuilder technology requirement labels', () => {
  it('uses authoritative technology names in building placement blockers', async () => {
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
        completedMilestones: new Set([
          'first_profit',
          'first_production',
          'first_steel',
          'first_machine_parts',
          'first_industrial_machinery',
          'first_advanced_electronics',
          'first_consumer_goods',
          'profit_100',
        ]),
        completedResearch: new Set(['basic_woodworking']),
      }),
    );

    const railTerminal = hints.placeBuilding.find((entry) => entry.buildingTypeId === 'rail_terminal');
    expect(railTerminal?.canPlace).toBe(false);
    expect(railTerminal?.reason).toBe('Forschung „Intermodale Logistik“ fehlt.');
    expect(railTerminal?.reason).not.toContain('intermodal_logistics');
  });
});

describe('GameSessionDashboardBuilder place-building prerequisite navigation', () => {
  it('emits research navigation intent matching the active research blocker', async () => {
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
        completedMilestones: new Set([
          'first_profit',
          'first_production',
          'first_steel',
          'first_machine_parts',
          'first_industrial_machinery',
          'first_advanced_electronics',
          'first_consumer_goods',
          'profit_100',
        ]),
        completedResearch: new Set(['basic_woodworking']),
      }),
    );

    const railTerminal = hints.placeBuilding.find((entry) => entry.buildingTypeId === 'rail_terminal');
    expect(railTerminal?.reason).toBe('Forschung „Intermodale Logistik“ fehlt.');
    expect(railTerminal?.prerequisiteNavigation).toEqual({
      kind: 'missing_research',
      technologyId: 'intermodal_logistics',
    });
  });

  it('emits milestone navigation intent matching the active milestone blocker', async () => {
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
        completedMilestones: new Set(),
      }),
    );

    const railTerminal = hints.placeBuilding.find((entry) => entry.buildingTypeId === 'rail_terminal');
    expect(railTerminal?.reason).toBe('Meilenstein „Erste Industriemaschine“ fehlt.');
    expect(railTerminal?.prerequisiteNavigation).toEqual({ kind: 'missing_milestone' });
  });

  it('does not emit navigation for money-only blockers', async () => {
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
        completedMilestones: new Set([
          'first_profit',
          'first_production',
          'first_steel',
          'first_machine_parts',
          'first_industrial_machinery',
          'first_advanced_electronics',
          'first_consumer_goods',
          'profit_100',
        ]),
        completedResearch: new Set(
          context.gameContent.technologies
            .getAll()
            .filter((technology) => technology.enabled)
            .map((technology) => technology.id),
        ),
        finance: {
          id: 'finance_001',
          companyId: 'company_001',
          currency: 'GC',
          cashBalance: 0,
          reservedCash: 0,
          availableCash: 0,
        },
      }),
    );

    const blockedByCost = hints.placeBuilding.find(
      (entry) => entry.canPlace === false && entry.reason?.startsWith('Benötigt'),
    );
    expect(blockedByCost).toBeDefined();
    expect(blockedByCost?.prerequisiteNavigation).toBeNull();
  });
});
