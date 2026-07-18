/**
 * @module @application/facade/GameSessionDashboardBuilder
 *
 * Builds content-driven dashboard hints and energy metrics for the UI shell.
 */

import type { EnergyBalanceService } from '../services/EnergyBalanceService.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { MarketFeePolicy } from '../../domain/policies/market/MarketFeePolicy.js';
import { CORPORATE_TAX_RATE, TAX_INTERVAL_TICKS } from '../../domain/finance/TaxConstants.js';
import { TaxCalculator } from '../../domain/finance/TaxCalculator.js';
import { InflationCalculator } from '../../domain/market/InflationCalculator.js';
import { GLOBAL_MARKET_ID } from '../../domain/market/MarketConstants.js';
import { createMarketId } from '../../domain/market/Market.js';
import type { EconomyReadModel } from '../read-models/EconomyReadModel.js';
import { EmployeePrerequisitesSpecification } from '../../domain/specifications/employee/EmployeePrerequisitesSpecification.js';
import { ProductionJobStatus } from '../../domain/production/ProductionJobStatus.js';
import { ResearchJobStatus } from '../../domain/research/ResearchJobStatus.js';
import { TransportOrderStatus } from '../../domain/transport/TransportOrderStatus.js';
import type { BuildingReadModel } from '../read-models/BuildingReadModel.js';
import type { FinanceReadModel } from '../read-models/FinanceReadModel.js';
import type { FinanceTransactionReadModel } from '../read-models/FinanceTransactionReadModel.js';
import type { InventoryReadModel } from '../read-models/InventoryReadModel.js';
import type { WarehouseStorageReadModel } from '../read-models/WarehouseStorageReadModel.js';
import type {
  ContentNameEntry,
  DashboardKpiReadModel,
  EnergyReadModel,
  GameSessionDashboardHints,
  LogisticsSummaryReadModel,
  MarketTradeHint,
  PlaceBuildingHint,
  ProductionHint,
  ProductionJobSessionReadModel,
  ResearchHint,
  TransportOrderSessionReadModel,
  EmployeeSessionReadModel,
  HireEmployeeHint,
  AssignEmployeeHint,
  TutorialProgressReadModel,
  TutorialStepReadModel,
} from './GameSessionDashboard.js';
import type { MarketPriceReadModel } from '../read-models/MarketPriceReadModel.js';
import type {
  TickMarketPriceSnapshot,
  TickMetricsSnapshot,
} from '../read-models/TickMetricsSnapshot.js';

const DEFAULT_TRADE_AMOUNT = 5;

/** Input for assembling dashboard hints. */
export type DashboardHintInput = {
  readonly companyId: string;
  readonly buildings: readonly BuildingReadModel[];
  readonly inventory: InventoryReadModel;
  readonly warehouseStorage: readonly WarehouseStorageReadModel[];
  readonly finance: FinanceReadModel;
  readonly marketPrices: readonly { readonly resourceId: string; readonly lastPrice: number }[];
  readonly completedMilestones: ReadonlySet<string>;
  readonly completedResearch: ReadonlySet<string>;
  readonly researchJobs: readonly { readonly technologyId: string; readonly status: string }[];
  readonly productionJobs: readonly ProductionJobSessionReadModel[];
  readonly transportOrders: readonly TransportOrderSessionReadModel[];
  readonly employees: readonly EmployeeSessionReadModel[];
};

/**
 * Derives UI hints from game content and current session state.
 */
export class GameSessionDashboardBuilder {
  readonly #context: ApplicationContext;
  readonly #energyBalanceService: EnergyBalanceService;
  readonly #employeePrerequisitesSpecification = new EmployeePrerequisitesSpecification();

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
    readonly employees: readonly ContentNameEntry[];
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
      employees: Object.freeze(
        this.#context.gameContent.employees
          .getAll()
          .filter((employeeType) => employeeType.enabled)
          .map((employeeType) =>
            Object.freeze({ id: employeeType.id, name: employeeType.displayName }),
          ),
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

  /** Reads warehouse stock grouped by active storage buildings. */
  readWarehouseStorage(
    companyId: string,
    buildings: readonly BuildingReadModel[],
  ): readonly WarehouseStorageReadModel[] {
    const companyIdResult = createCompanyId(companyId);

    if (!companyIdResult.ok) {
      return Object.freeze([]);
    }

    const buildingNameById = new Map(buildings.map((building) => [building.id, building.name]));

    return Object.freeze(
      this.#context.buildingStorageRepository
        .findByCompanyId(companyIdResult.value)
        .map((storage) =>
          Object.freeze({
            buildingId: storage.getBuildingId().value,
            buildingName:
              buildingNameById.get(storage.getBuildingId().value) ?? storage.getBuildingId().value,
            items: Object.freeze(
              storage.getLines().map((line) =>
                Object.freeze({
                  resourceId: line.resourceId,
                  quantity: line.quantity,
                  reserved: line.reserved,
                  available: Math.max(0, line.quantity - line.reserved),
                }),
              ),
            ),
          }),
        ),
    );
  }

  /** Builds logistics KPIs and a short player-facing status line. */
  readLogisticsSummary(input: {
    readonly warehouseStorage: readonly WarehouseStorageReadModel[];
    readonly productionJobs: readonly ProductionJobSessionReadModel[];
    readonly transportOrders: readonly TransportOrderSessionReadModel[];
  }): LogisticsSummaryReadModel {
    const warehouseResourceLines = input.warehouseStorage.reduce(
      (count, storage) => count + storage.items.length,
      0,
    );
    const warehouseTotalUnits = input.warehouseStorage.reduce(
      (total, storage) =>
        total + storage.items.reduce((lineTotal, item) => lineTotal + item.quantity, 0),
      0,
    );
    const activeTransportCount = input.transportOrders.filter(
      (order) => order.status === TransportOrderStatus.IN_PROGRESS,
    ).length;
    const waitingProductionCount = input.productionJobs.filter(
      (job) => job.status === ProductionJobStatus.WAITING && job.awaitingTransport,
    ).length;
    const hasActiveWarehouse = input.warehouseStorage.length > 0;

    let statusMessage: string | null = null;

    if (activeTransportCount > 0) {
      statusMessage = `${activeTransportCount} Transport(e) unterwegs — Produktion startet nach Ankunft.`;
    } else if (waitingProductionCount > 0) {
      statusMessage = `${waitingProductionCount} Produktion(en) warten auf Material.`;
    } else if (hasActiveWarehouse && warehouseTotalUnits > 0) {
      statusMessage = 'Lagerhaus enthält Material — Marktkäufe landen dort.';
    } else if (hasActiveWarehouse) {
      statusMessage = 'Lagerhaus bereit — Marktkäufe werden dort eingelagert.';
    }

    return Object.freeze({
      hasActiveWarehouse,
      activeTransportCount,
      waitingProductionCount,
      warehouseResourceLines,
      warehouseTotalUnits,
      statusMessage,
    });
  }

  /** Builds economy KPIs and active supply contracts for the dashboard. */
  readEconomy(companyId: string): EconomyReadModel | null {
    const companyIdResult = createCompanyId(companyId);

    if (!companyIdResult.ok) {
      return null;
    }

    const marketIdResult = createMarketId(GLOBAL_MARKET_ID);

    if (!marketIdResult.ok) {
      return null;
    }

    const market = this.#context.marketRepository.findById(marketIdResult.value);
    const priceIndex =
      market === undefined
        ? 1
        : InflationCalculator.computePriceIndexFromMarketPrices(market.getPrices());
    const contracts = Object.freeze(
      this.#context.supplyContractRepository
        .findByCompanyId(companyIdResult.value)
        .map((contract) =>
          Object.freeze({
            id: contract.getId().value,
            kind: contract.getKind(),
            resourceId: contract.getResourceId(),
            amount: contract.getAmount(),
            paymentAmount: contract.getPaymentAmount(),
            intervalTicks: contract.getIntervalTicks(),
            active: contract.isActive(),
            lastFulfilledTick: contract.getLastFulfilledTick(),
          }),
        ),
    );
    const finance = this.#context.financeRepository.findByCompanyId(companyIdResult.value);
    const taxAssessment =
      finance === undefined
        ? Object.freeze({
            pendingTaxAmount: 0,
            taxPaymentBlocked: false,
          })
        : TaxCalculator.assessPendingTaxCollection({
            transactions: finance.getTransactions(),
            lastTaxCollectedAt: finance.getLastTaxCollectedAt(),
            availableCash: finance.getAvailableCash(),
            currentSimulationTime: this.#context.clock.now(),
          });

    return Object.freeze({
      corporateTaxRate: CORPORATE_TAX_RATE,
      taxIntervalTicks: TAX_INTERVAL_TICKS,
      priceIndex,
      pendingTaxAmount: taxAssessment.pendingTaxAmount,
      taxPaymentBlocked: taxAssessment.taxPaymentBlocked,
      activeContractCount: contracts.filter((contract) => contract.active).length,
      contracts,
    });
  }

  /** Builds compact KPI values for the dashboard header strip. */
  readKpis(input: {
    readonly finance: FinanceReadModel;
    readonly energy: EnergyReadModel | null;
    readonly inventory: InventoryReadModel;
    readonly logistics: LogisticsSummaryReadModel;
    readonly employees: readonly EmployeeSessionReadModel[];
    readonly economy: EconomyReadModel | null;
  }): DashboardKpiReadModel {
    const assignedEmployeeCount = input.employees.filter(
      (employee) => employee.assignedBuildingId !== null,
    ).length;
    const payrollPerInterval = input.employees.reduce(
      (total, employee) => total + employee.salary,
      0,
    );

    return Object.freeze({
      availableCash: input.finance.availableCash,
      energyReserve: input.energy?.reserve ?? 0,
      energyHasDeficit: input.energy?.hasDeficit ?? false,
      activeTransportCount: input.logistics.activeTransportCount,
      warehouseTotalUnits: input.logistics.warehouseTotalUnits,
      onSiteResourceLines: input.inventory.items.length,
      employeeCount: input.employees.length,
      assignedEmployeeCount,
      payrollPerInterval,
      corporateTaxRate: input.economy?.corporateTaxRate ?? CORPORATE_TAX_RATE,
      taxIntervalTicks: input.economy?.taxIntervalTicks ?? TAX_INTERVAL_TICKS,
      priceIndex: input.economy?.priceIndex ?? 1,
      pendingTaxAmount: input.economy?.pendingTaxAmount ?? 0,
      taxPaymentBlocked: input.economy?.taxPaymentBlocked ?? false,
      activeContractCount: input.economy?.activeContractCount ?? 0,
    });
  }

  /** Captures slim tick metrics for dashboard chart history. */
  captureTickMetrics(input: {
    readonly tickNumber: number;
    readonly simulationTime: number;
    readonly finance: FinanceReadModel;
    readonly energy: EnergyReadModel | null;
    readonly logistics: LogisticsSummaryReadModel;
    readonly inventory: InventoryReadModel;
    readonly marketPrices: readonly MarketPriceReadModel[];
    readonly priceIndex?: number;
  }): TickMetricsSnapshot {
    const onSiteTotalUnits = input.inventory.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    const marketPrices: readonly TickMarketPriceSnapshot[] = Object.freeze(
      input.marketPrices.map((price) =>
        Object.freeze({
          resourceId: price.resourceId,
          lastPrice: price.lastPrice,
          totalSupply: price.totalSupply,
          baselineDemand: price.baselineDemand,
          pressureIndex: price.pressureIndex,
        }),
      ),
    );

    return Object.freeze({
      tickNumber: input.tickNumber,
      simulationTime: input.simulationTime,
      availableCash: input.finance.availableCash,
      energyReserve: input.energy?.reserve ?? 0,
      energyGeneration: input.energy?.generation ?? 0,
      energyConsumption: input.energy?.consumption ?? 0,
      activeTransportCount: input.logistics.activeTransportCount,
      warehouseTotalUnits: input.logistics.warehouseTotalUnits,
      onSiteTotalUnits,
      priceIndex: input.priceIndex ?? 1,
      marketPrices,
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
      hireEmployee: this.#readHireEmployeeHints(input, companyIdResult.value.value),
      assignEmployee: this.#readAssignEmployeeHints(input),
    });
  }

  #emptyHints(): GameSessionDashboardHints {
    return Object.freeze({
      placeBuilding: Object.freeze([]),
      production: Object.freeze([]),
      research: Object.freeze([]),
      market: Object.freeze([]),
      hireEmployee: Object.freeze([]),
      assignEmployee: Object.freeze([]),
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

    const inventory = this.#context.inventoryRepository.findByCompanyId(companyIdResult.value);
    const hasWarehouse = input.warehouseStorage.length > 0;

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
        } else if (inventory !== undefined) {
          const globalSufficient = recipe.inputs.every((recipeInput) => {
            const available =
              input.inventory.items.find((item) => item.resourceId === recipeInput.resource)
                ?.available ?? 0;
            return available >= recipeInput.amount;
          });

          if (globalSufficient) {
            canStart = true;
            reason = null;
          } else if (
            this.#context.transportLogisticsService.needsInboundTransport(
              companyIdResult.value,
              inventory,
              recipe,
            )
          ) {
            canStart = true;
            reason = 'Material im Lagerhaus — Transport startet automatisch (~5 Ticks).';
          } else if (
            this.#context.transportLogisticsService.canFulfillFromWarehouse(
              companyIdResult.value,
              recipe,
            )
          ) {
            canStart = true;
            reason = 'Teilweise am Standort — Rest kommt aus dem Lagerhaus per Transport.';
          } else {
            canStart = false;
            const missingInput = recipe.inputs.find((recipeInput) => {
              const onSite =
                input.inventory.items.find((item) => item.resourceId === recipeInput.resource)
                  ?.available ?? 0;
              const inWarehouse = input.warehouseStorage.reduce(
                (total, storage) =>
                  total +
                  (storage.items.find((item) => item.resourceId === recipeInput.resource)
                    ?.available ?? 0),
                0,
              );
              return onSite + inWarehouse < recipeInput.amount;
            });

            if (missingInput !== undefined) {
              reason = hasWarehouse
                ? `Benötigt ${missingInput.amount}× ${missingInput.resource} — am Markt kaufen (landet im Lager).`
                : `Benötigt ${missingInput.amount}× ${missingInput.resource}.`;
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
    const hasWarehouse = input.warehouseStorage.length > 0;
    const marketFeePolicy = new MarketFeePolicy();

    return Object.freeze(
      this.#context.gameContent.resourceTypes
        .getAll()
        .filter((resource) => resource.enabled && resource.marketEnabled && resource.tradable)
        .map((resource) => {
          const price =
            input.marketPrices.find((entry) => entry.resourceId === resource.id)?.lastPrice ?? 0;
          const onSiteAvailable =
            input.inventory.items.find((item) => item.resourceId === resource.id)?.available ?? 0;
          const tradeValue = price * DEFAULT_TRADE_AMOUNT;
          const feeResult = marketFeePolicy.evaluate({ tradeValue });
          const feeAmount = feeResult.ok ? feeResult.value.feeAmount : 0;
          const buyCost = tradeValue + feeAmount;

          const canBuy = price > 0 && input.finance.availableCash >= buyCost;
          const canSell = onSiteAvailable >= DEFAULT_TRADE_AMOUNT;

          return Object.freeze({
            resourceId: resource.id,
            name: resource.name,
            tradeAmount: DEFAULT_TRADE_AMOUNT,
            canBuy,
            canSell,
            buyReason: canBuy
              ? hasWarehouse
                ? 'Landet im Lagerhaus.'
                : null
              : `Benötigt ${buyCost.toLocaleString('de-DE')} GC inkl. Marktgebühr.`,
            sellReason: canSell
              ? null
              : `Benötigt ${DEFAULT_TRADE_AMOUNT}× ${resource.name} am Standort (nicht im Lager).`,
          });
        }),
    );
  }

  #readHireEmployeeHints(
    input: DashboardHintInput,
    companyId: string,
  ): readonly HireEmployeeHint[] {
    const companyIdResult = createCompanyId(companyId);

    if (!companyIdResult.ok) {
      return Object.freeze([]);
    }

    const companyResearch = this.#context.companyResearchRepository.findByCompanyId(
      companyIdResult.value,
    );

    if (companyResearch === undefined) {
      return Object.freeze([]);
    }

    const ownedActiveBuildingTypes = new Set(
      input.buildings
        .filter((building) => building.status === BuildingStatus.ACTIVE)
        .map((building) => building.buildingTypeId),
    );

    return Object.freeze(
      this.#context.gameContent.employees
        .getAll()
        .filter((employeeType) => employeeType.enabled)
        .map((employeeType) => {
          const prerequisitesResult = this.#employeePrerequisitesSpecification.isSatisfiedBy(
            {
              employeeTypeId: employeeType.id,
              requiredResearch: employeeType.requirements.research,
              requiredBuildingTypes: employeeType.requirements.buildings,
            },
            {
              completedResearch: input.completedResearch,
              ownedActiveBuildingTypes,
            },
          );

          let canHire = true;
          let reason: string | null = null;

          if (!prerequisitesResult.ok) {
            canHire = false;
            reason = prerequisitesResult.error.message;
          } else if (input.finance.availableCash < employeeType.cost) {
            canHire = false;
            reason = `Benötigt ${employeeType.cost.toLocaleString('de-DE')} GC.`;
          }

          return Object.freeze({
            employeeTypeId: employeeType.id,
            name: employeeType.displayName,
            category: employeeType.category,
            cost: employeeType.cost,
            defaultDisplayName: employeeType.displayName,
            canHire,
            reason,
          });
        }),
    );
  }

  #readAssignEmployeeHints(input: DashboardHintInput): readonly AssignEmployeeHint[] {
    const hints: AssignEmployeeHint[] = [];
    const activeBuildings = input.buildings.filter(
      (building) => building.status === BuildingStatus.ACTIVE,
    );

    for (const employee of input.employees) {
      if (employee.assignedBuildingId !== null) {
        continue;
      }

      for (const building of activeBuildings) {
        hints.push(
          Object.freeze({
            employeeId: employee.id,
            employeeName: employee.displayName,
            buildingId: building.id,
            buildingName: building.name,
            canAssign: true,
            reason: null,
          }),
        );
      }

      if (activeBuildings.length === 0) {
        hints.push(
          Object.freeze({
            employeeId: employee.id,
            employeeName: employee.displayName,
            buildingId: '',
            buildingName: '',
            canAssign: false,
            reason: 'Kein aktives Gebäude für die Zuweisung verfügbar.',
          }),
        );
      }
    }

    return Object.freeze(hints);
  }

  /** Derives first-play tutorial progress from core gameplay steps. */
  readTutorialProgress(input: {
    readonly hasCompany: boolean;
    readonly buildings: readonly BuildingReadModel[];
    readonly inventory: InventoryReadModel;
    readonly financeTransactions: readonly FinanceTransactionReadModel[];
    readonly productionJobs: readonly ProductionJobSessionReadModel[];
    readonly completedMilestones: ReadonlySet<string>;
  }): TutorialProgressReadModel | null {
    if (!input.hasCompany) {
      return null;
    }

    const hasSawmill = input.buildings.some((building) => building.buildingTypeId === 'sawmill');
    const woodAvailable =
      input.inventory.items.find((item) => item.resourceId === 'wood')?.available ?? 0;
    const planksAvailable =
      input.inventory.items.find((item) => item.resourceId === 'planks')?.available ?? 0;
    const hasWoodPurchase = input.financeTransactions.some(
      (transaction) => transaction.transactionType === 'PURCHASE',
    );
    const hasPlankProduction = input.productionJobs.some(
      (job) => job.recipeId === 'recipe_planks',
    );
    const hasPlankSale = input.financeTransactions.some(
      (transaction) => transaction.transactionType === 'SALE',
    );
    const hasFirstProfit = input.completedMilestones.has('first_profit');
    const hasContractPayment = input.financeTransactions.some(
      (transaction) => transaction.transactionType === 'CONTRACT_PAYMENT',
    );
    const hasTaxPayment = input.financeTransactions.some(
      (transaction) => transaction.transactionType === 'TAX',
    );

    const steps: TutorialStepReadModel[] = [
      Object.freeze({
        id: 'open_plot',
        title: 'Grundstück öffnen',
        description: 'Starten Sie eine neue Session und sehen Sie sich das Dashboard an.',
        completed: true,
      }),
      Object.freeze({
        id: 'build_sawmill',
        title: 'Sägewerk bauen',
        description: 'Platzieren Sie ein Sägewerk über die Aktionen in der Seitenleiste.',
        completed: hasSawmill,
      }),
      Object.freeze({
        id: 'buy_wood',
        title: 'Holz beschaffen',
        description:
          'Kaufen Sie Holz am Markt oder nutzen Sie Ihre Startressourcen (mindestens 10 Holz).',
        completed: hasSawmill && (woodAvailable >= 10 || hasWoodPurchase),
      }),
      Object.freeze({
        id: 'produce_planks',
        title: 'Bretter produzieren',
        description:
          'Warten Sie auf die Fertigstellung des Sägewerks, stellen Sie Worker ein und starten Sie „Bretter herstellen“.',
        completed: planksAvailable > 0 || hasPlankProduction,
      }),
      Object.freeze({
        id: 'sell_planks',
        title: 'Bretter verkaufen',
        description: 'Verkaufen Sie Bretter am Markt über die Seitenleiste.',
        completed: hasPlankSale,
      }),
      Object.freeze({
        id: 'earn_profit',
        title: 'Ersten Gewinn erzielen',
        description: 'Schließen Sie den ersten Verkauf ab und erreichen Sie den Meilenstein „First Profit“.',
        completed: hasFirstProfit,
      }),
      Object.freeze({
        id: 'npc_supply_contract',
        title: 'NPC-Liefervertrag nutzen',
        description:
          'Ein Abnehmer kauft alle 20 Ticks 5 Holz vom Standort-Inventar für 125 GC — halten Sie genug Holz bereit.',
        completed: hasContractPayment,
      }),
      Object.freeze({
        id: 'corporate_tax',
        title: 'Unternehmenssteuer verstehen',
        description:
          'Alle 30 Ticks fällt 5 % Steuer auf den Gewinn seit der letzten Abrechnung an — prüfen Sie das Finanz-Ledger.',
        completed: hasTaxPayment,
      }),
    ];

    const activeStep = steps.find((step) => !step.completed);

    return Object.freeze({
      steps: Object.freeze(steps),
      activeStepId: activeStep?.id ?? null,
      completed: activeStep === undefined,
    });
  }
}
