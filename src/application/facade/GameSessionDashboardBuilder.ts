/**
 * @module @application/facade/GameSessionDashboardBuilder
 *
 * Builds content-driven dashboard hints and energy metrics for the UI shell.
 */

import type { EnergyBalanceService } from '../services/EnergyBalanceService.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { ResearchJobStatus } from '../../domain/research/ResearchJobStatus.js';
import type { BuildingReadModel } from '../read-models/BuildingReadModel.js';
import type { FinanceReadModel } from '../read-models/FinanceReadModel.js';
import type { InventoryReadModel } from '../read-models/InventoryReadModel.js';
import type {
  ContentNameEntry,
  EnergyReadModel,
  GameSessionDashboardHints,
  MarketTradeHint,
  PlaceBuildingHint,
  ProductionHint,
  ResearchHint,
} from './GameSessionDashboard.js';

const DEFAULT_TRADE_AMOUNT = 5;

/** Input for assembling dashboard hints. */
export type DashboardHintInput = {
  readonly companyId: string;
  readonly buildings: readonly BuildingReadModel[];
  readonly inventory: InventoryReadModel;
  readonly finance: FinanceReadModel;
  readonly marketPrices: readonly { readonly resourceId: string; readonly lastPrice: number }[];
  readonly completedMilestones: ReadonlySet<string>;
  readonly completedResearch: ReadonlySet<string>;
  readonly researchJobs: readonly { readonly technologyId: string; readonly status: string }[];
};

/**
 * Derives UI hints from game content and current session state.
 */
export class GameSessionDashboardBuilder {
  readonly #context: ApplicationContext;
  readonly #energyBalanceService: EnergyBalanceService;

  constructor(context: ApplicationContext, energyBalanceService: EnergyBalanceService) {
    this.#context = context;
    this.#energyBalanceService = energyBalanceService;
  }

  /** Returns localized display names for all enabled content entries. */
  readContentNames(): {
    readonly resources: readonly ContentNameEntry[];
    readonly buildings: readonly ContentNameEntry[];
    readonly recipes: readonly ContentNameEntry[];
    readonly technologies: readonly ContentNameEntry[];
  } {
    return {
      resources: Object.freeze(
        this.#context.gameContent.resourceTypes
          .getAll()
          .filter((resource) => resource.enabled)
          .map((resource) => Object.freeze({ id: resource.id, name: resource.name })),
      ),
      buildings: Object.freeze(
        this.#context.gameContent.buildingTypes
          .getAll()
          .filter((building) => building.enabled)
          .map((building) => Object.freeze({ id: building.id, name: building.name })),
      ),
      recipes: Object.freeze(
        this.#context.gameContent.recipes
          .getAll()
          .filter((recipe) => recipe.enabled)
          .map((recipe) => Object.freeze({ id: recipe.id, name: recipe.name })),
      ),
      technologies: Object.freeze(
        this.#context.gameContent.technologies
          .getAll()
          .filter((technology) => technology.enabled)
          .map((technology) => Object.freeze({ id: technology.id, name: technology.name })),
      ),
    };
  }

  /** Computes energy metrics for the active company. */
  readEnergy(companyId: string): EnergyReadModel | null {
    const companyIdResult = createCompanyId(companyId);

    if (!companyIdResult.ok) {
      return null;
    }

    const balance = this.#energyBalanceService.computeForCompany(companyIdResult.value);

    return Object.freeze({
      generation: balance.generation,
      consumption: balance.consumption,
      reserve: balance.reserve,
      hasDeficit: balance.hasDeficit,
      usesBaselineGrid: balance.usesBaselineGrid,
    });
  }

  /** Builds actionable hints for the browser dashboard. */
  readHints(input: DashboardHintInput): GameSessionDashboardHints {
    const companyIdResult = createCompanyId(input.companyId);

    if (!companyIdResult.ok) {
      return this.#emptyHints();
    }

    return Object.freeze({
      placeBuilding: this.#readPlaceBuildingHints(input),
      production: this.#readProductionHints(input, companyIdResult.value.value),
      research: this.#readResearchHints(input),
      market: this.#readMarketHints(input),
    });
  }

  #emptyHints(): GameSessionDashboardHints {
    return Object.freeze({
      placeBuilding: Object.freeze([]),
      production: Object.freeze([]),
      research: Object.freeze([]),
      market: Object.freeze([]),
    });
  }

  #readPlaceBuildingHints(input: DashboardHintInput): readonly PlaceBuildingHint[] {
    return Object.freeze(
      this.#context.gameContent.buildingTypes
        .getAll()
        .filter((buildingType) => buildingType.enabled)
        .map((buildingType) => {
          const missingMilestone = buildingType.requiredMilestones.find(
            (milestoneId) => !input.completedMilestones.has(milestoneId),
          );
          const missingResearch = buildingType.requiredResearch.find(
            (technologyId) => !input.completedResearch.has(technologyId),
          );

          let canPlace = true;
          let reason: string | null = null;

          if (missingMilestone !== undefined) {
            canPlace = false;
            reason = `Meilenstein „${missingMilestone}“ fehlt.`;
          } else if (missingResearch !== undefined) {
            canPlace = false;
            reason = `Forschung „${missingResearch}“ fehlt.`;
          } else if (input.finance.availableCash < buildingType.constructionCost) {
            canPlace = false;
            reason = `Benötigt ${buildingType.constructionCost.toLocaleString('de-DE')} GC.`;
          }

          return Object.freeze({
            buildingTypeId: buildingType.id,
            name: buildingType.name,
            category: buildingType.category,
            canPlace,
            reason,
          });
        }),
    );
  }

  #readProductionHints(
    input: DashboardHintInput,
    companyId: string,
  ): readonly ProductionHint[] {
    const hints: ProductionHint[] = [];
    const companyIdResult = createCompanyId(companyId);

    if (!companyIdResult.ok) {
      return Object.freeze([]);
    }

    for (const recipe of this.#context.gameContent.recipes.getAll()) {
      if (!recipe.enabled) {
        continue;
      }

      const missingMilestone = recipe.requiredMilestones.find(
        (milestoneId) => !input.completedMilestones.has(milestoneId),
      );
      const missingResearch = recipe.requiredResearch.find(
        (technologyId) => !input.completedResearch.has(technologyId),
      );

      for (const building of input.buildings) {
        if (building.status !== BuildingStatus.ACTIVE) {
          continue;
        }

        const buildingType = this.#context.gameContent.buildingTypes.get(building.buildingTypeId);

        if (buildingType === undefined || !buildingType.allowedRecipes.includes(recipe.id)) {
          continue;
        }

        let canStart = true;
        let reason: string | null = null;

        if (missingMilestone !== undefined) {
          canStart = false;
          reason = `Meilenstein „${missingMilestone}“ fehlt.`;
        } else if (missingResearch !== undefined) {
          canStart = false;
          reason = `Forschung „${missingResearch}“ fehlt.`;
        } else {
          for (const recipeInput of recipe.inputs) {
            const available =
              input.inventory.items.find((item) => item.resourceId === recipeInput.resource)
                ?.available ?? 0;

            if (available < recipeInput.amount) {
              canStart = false;
              reason = `Benötigt ${recipeInput.amount}× ${recipeInput.resource}.`;
              break;
            }
          }
        }

        if (
          canStart &&
          !this.#energyBalanceService.canAffordRecipeEnergy(companyIdResult.value, recipe.id, {
            includeRecipeLoad: true,
          })
        ) {
          canStart = false;
          reason = 'Nicht genug Energie — Kohlekraftwerk bauen.';
        }

        hints.push(
          Object.freeze({
            recipeId: recipe.id,
            recipeName: recipe.name,
            buildingId: building.id,
            buildingName: building.name,
            canStart,
            reason,
          }),
        );
      }
    }

    return Object.freeze(hints);
  }

  #readResearchHints(input: DashboardHintInput): readonly ResearchHint[] {
    return Object.freeze(
      this.#context.gameContent.technologies
        .getAll()
        .filter((technology) => technology.enabled)
        .map((technology) => {
          const missingMilestone = technology.requiredMilestones.find(
            (milestoneId) => !input.completedMilestones.has(milestoneId),
          );
          const inProgress = input.researchJobs.some(
            (job) =>
              job.technologyId === technology.id &&
              (job.status === ResearchJobStatus.WAITING ||
                job.status === ResearchJobStatus.RUNNING),
          );

          let canStart = true;
          let reason: string | null = null;

          if (input.completedResearch.has(technology.id)) {
            canStart = false;
            reason = 'Bereits erforscht.';
          } else if (inProgress) {
            canStart = false;
            reason = 'Forschung läuft bereits.';
          } else if (missingMilestone !== undefined) {
            canStart = false;
            reason = `Meilenstein „${missingMilestone}“ fehlt.`;
          } else if (input.finance.availableCash < technology.researchCost) {
            canStart = false;
            reason = `Benötigt ${technology.researchCost.toLocaleString('de-DE')} GC.`;
          }

          return Object.freeze({
            technologyId: technology.id,
            name: technology.name,
            canStart,
            reason,
          });
        }),
    );
  }

  #readMarketHints(input: DashboardHintInput): readonly MarketTradeHint[] {
    return Object.freeze(
      this.#context.gameContent.resourceTypes
        .getAll()
        .filter((resource) => resource.enabled && resource.marketEnabled && resource.tradable)
        .map((resource) => {
          const price =
            input.marketPrices.find((entry) => entry.resourceId === resource.id)?.lastPrice ?? 0;
          const available =
            input.inventory.items.find((item) => item.resourceId === resource.id)?.available ?? 0;
          const buyCost = price * DEFAULT_TRADE_AMOUNT;

          const canBuy = price > 0 && input.finance.availableCash >= buyCost;
          const canSell = available >= DEFAULT_TRADE_AMOUNT;

          return Object.freeze({
            resourceId: resource.id,
            name: resource.name,
            tradeAmount: DEFAULT_TRADE_AMOUNT,
            canBuy,
            canSell,
            buyReason: canBuy ? null : `Benötigt ${buyCost.toLocaleString('de-DE')} GC.`,
            sellReason: canSell
              ? null
              : `Benötigt ${DEFAULT_TRADE_AMOUNT}× ${resource.name}.`,
          });
        }),
    );
  }
}
