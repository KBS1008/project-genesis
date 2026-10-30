import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { EnergyBalanceService } from '../services/EnergyBalanceService.js';
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
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

describe('GameSessionDashboardBuilder production hints', () => {
  it('uses authoritative resource names in missing-input blocker copy', async () => {
    const bootstrapResult = await bootstrapApplication({
      gameContentRoot,
      strictContent: true,
    });

    expect(bootstrapResult.ok).toBe(true);

    if (!bootstrapResult.ok) {
      return;
    }

    const context = bootstrapResult.value;
    new CreateCompanyUseCase(context).execute({
      companyId: 'company_001',
      name: 'Resource Label Test Corp',
      ownerId: 'player_001',
    });

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
        buildings: [
          {
            id: 'building_machine_shop_001',
            buildingTypeId: 'machine_shop',
            companyId: 'company_001',
            regionId: 'region_default',
            name: 'Maschinenwerk',
            x: 0,
            y: 0,
            level: 1,
            createdAt: 0,
            status: BuildingStatus.ACTIVE,
            constructionProgress: 100,
            constructionDuration: 100,
          },
        ],
        inventory: {
          id: 'inventory_001',
          companyId: 'company_001',
          status: 'ACTIVE',
          items: [
            {
              resourceId: 'wood',
              quantity: 40,
              reserved: 0,
              available: 40,
            },
          ],
        },
        warehouseStorage: [],
      }),
    );

    const machinePartsHint = hints.production.find(
      (hint) => hint.recipeId === 'recipe_machine_parts',
    );
    expect(machinePartsHint).toBeDefined();
    expect(machinePartsHint?.canStart).toBe(false);
    expect(machinePartsHint?.reason).toBe('Benötigt 3× Stahl.');
    expect(machinePartsHint?.reason).not.toContain('steel');
  });
});

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

describe('GameSessionDashboardBuilder player-facing cycle hint copy', () => {
  it('uses Zyklus terminology in tutorial economy step descriptions', async () => {
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

    const tutorial = builder.readTutorialProgress({
      hasCompany: true,
      buildings: [],
      inventory: {
        id: 'inventory_001',
        companyId: 'company_001',
        status: 'ACTIVE',
        items: [],
      },
      financeTransactions: [],
      productionJobs: [],
      completedMilestones: new Set(),
    });

    const contractStep = tutorial?.steps.find((step) => step.id === 'npc_supply_contract');
    const taxStep = tutorial?.steps.find((step) => step.id === 'corporate_tax');

    expect(contractStep?.description).toContain('alle 20 Zyklen');
    expect(taxStep?.description).toContain('Alle 30 Zyklen');
    expect(JSON.stringify(tutorial?.steps)).not.toMatch(/\bTicks?\b/);
  });
});

describe('GameSessionDashboardBuilder recipe catalog progression', () => {
  async function createBuilder() {
    const bootstrapResult = await bootstrapApplication({
      gameContentRoot,
      strictContent: true,
    });

    expect(bootstrapResult.ok).toBe(true);

    if (!bootstrapResult.ok) {
      throw new Error(bootstrapResult.error.message);
    }

    const context = bootstrapResult.value;
    return new GameSessionDashboardBuilder(
      context,
      new EnergyBalanceService({
        buildingRepository: context.buildingRepository,
        productionJobRepository: context.productionJobRepository,
        gameContent: context.gameContent,
      }),
    );
  }

  function findCatalogEntry(
    catalog: ReturnType<GameSessionDashboardBuilder['readRecipeCatalog']>,
    recipeId: string,
  ) {
    const entry = catalog.find((item) => item.id === recipeId);
    expect(entry).toBeDefined();
    return entry!;
  }

  it('marks recipe_planks progression-eligible at new-game progression state', async () => {
    const builder = await createBuilder();
    const catalog = builder.readRecipeCatalog(null, Object.freeze([]), {
      completedMilestones: new Set(),
      completedResearch: new Set(),
    });
    const planks = findCatalogEntry(catalog, 'recipe_planks');

    expect(planks.progressionEligible).toBe(true);
    expect(planks.progressionBlockerReason).toBeNull();
  });

  it('blocks recipe_advanced_planks until first_production with German milestone copy', async () => {
    const builder = await createBuilder();
    const emptyProgression = {
      completedMilestones: new Set<string>(),
      completedResearch: new Set<string>(),
    };
    const locked = findCatalogEntry(
      builder.readRecipeCatalog(null, Object.freeze([]), emptyProgression),
      'recipe_advanced_planks',
    );

    expect(locked.progressionEligible).toBe(false);
    expect(locked.progressionBlockerReason).toBe('Meilenstein „First Production“ fehlt.');

    const milestoneComplete = findCatalogEntry(
      builder.readRecipeCatalog(null, Object.freeze([]), {
        completedMilestones: new Set(['first_production']),
        completedResearch: new Set(),
      }),
      'recipe_advanced_planks',
    );

    expect(milestoneComplete.progressionEligible).toBe(false);
    expect(milestoneComplete.progressionBlockerReason).toMatch(/^Forschung „/);
  });

  it('treats recipe_steel as progression-eligible at new game (building gate is separate)', async () => {
    const builder = await createBuilder();
    const steel = findCatalogEntry(
      builder.readRecipeCatalog(null, Object.freeze([]), {
        completedMilestones: new Set(),
        completedResearch: new Set(),
      }),
      'recipe_steel',
    );

    expect(steel.progressionEligible).toBe(true);
    expect(steel.progressionBlockerReason).toBeNull();
  });

  it('requires both milestone and research for recipe_advanced_planks', async () => {
    const builder = await createBuilder();
    const milestoneOnly = {
      completedMilestones: new Set(['first_production']),
      completedResearch: new Set<string>(),
    };
    const researchMissing = findCatalogEntry(
      builder.readRecipeCatalog(null, Object.freeze([]), milestoneOnly),
      'recipe_advanced_planks',
    );

    expect(researchMissing.progressionEligible).toBe(false);
    expect(researchMissing.progressionBlockerReason).toMatch(/^Forschung „/);

    const bothComplete = findCatalogEntry(
      builder.readRecipeCatalog(null, Object.freeze([]), {
        completedMilestones: new Set(['first_production']),
        completedResearch: new Set(['basic_woodworking']),
      }),
      'recipe_advanced_planks',
    );

    expect(bothComplete.progressionEligible).toBe(true);
    expect(bothComplete.progressionBlockerReason).toBeNull();
  });

  it('blocks recipe_machine_parts for missing milestone and research independently', async () => {
    const builder = await createBuilder();
    const newGame = {
      completedMilestones: new Set<string>(),
      completedResearch: new Set<string>(),
    };

    expect(
      findCatalogEntry(builder.readRecipeCatalog(null, Object.freeze([]), newGame), 'recipe_machine_parts')
        .progressionBlockerReason,
    ).toBe('Meilenstein „Erster Stahl“ fehlt.');

    const milestoneOnly = {
      completedMilestones: new Set(['first_steel']),
      completedResearch: new Set<string>(),
    };
    const researchBlocked = findCatalogEntry(
      builder.readRecipeCatalog(null, Object.freeze([]), milestoneOnly),
      'recipe_machine_parts',
    );

    expect(researchBlocked.progressionEligible).toBe(false);
    expect(researchBlocked.progressionBlockerReason).toBe(
      'Forschung „Fortgeschrittene Metallurgie“ fehlt.',
    );
  });

  it('exposes progression blockers without any production buildings', async () => {
    const builder = await createBuilder();
    const catalog = builder.readRecipeCatalog(null, Object.freeze([]), {
      completedMilestones: new Set(),
      completedResearch: new Set(),
    });

    expect(findCatalogEntry(catalog, 'recipe_advanced_planks').progressionEligible).toBe(false);
    expect(findCatalogEntry(catalog, 'recipe_planks').progressionEligible).toBe(true);
    expect(findCatalogEntry(catalog, 'recipe_steel').progressionEligible).toBe(true);
  });
});
