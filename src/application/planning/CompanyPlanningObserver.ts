/**
 * @module @application/planning/CompanyPlanningObserver
 *
 * Builds read-only planning observations from repository state.
 */

import type { StrategyRegistry } from '../../content/strategy/StrategyRegistry.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { BuildingRepository } from '../../domain/building/BuildingRepository.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { CompanyMilestonesRepository } from '../../domain/milestone/CompanyMilestonesRepository.js';
import type { FinanceRepository } from '../../domain/finance/FinanceRepository.js';
import type { InventoryRepository } from '../../domain/inventory/InventoryRepository.js';
import type { MarketRepository } from '../../domain/market/MarketRepository.js';
import type { ProductionJobRepository } from '../../domain/production/ProductionJobRepository.js';
import { ProductionJobStatus } from '../../domain/production/ProductionJobStatus.js';
import type { CompanyResearchRepository } from '../../domain/research/CompanyResearchRepository.js';
import type { ResearchJobRepository } from '../../domain/research/ResearchJobRepository.js';
import { ResearchJobStatus } from '../../domain/research/ResearchJobStatus.js';
import { DEFAULT_REGION_ID } from '../../domain/world/WorldConstants.js';
import {
  createPlanningObservation,
  type ObservedBuilding,
  type ObservedInventoryLine,
  type ObservedMarketPrice,
  type PlanningObservation,
} from './PlanningObservation.js';

/** Dependencies for {@link CompanyPlanningObserver}. */
export type CompanyPlanningObserverDependencies = {
  readonly inventoryRepository: InventoryRepository;
  readonly financeRepository: FinanceRepository;
  readonly buildingRepository: BuildingRepository;
  readonly marketRepository: MarketRepository;
  readonly productionJobRepository: ProductionJobRepository;
  readonly companyResearchRepository: CompanyResearchRepository;
  readonly companyMilestonesRepository: CompanyMilestonesRepository;
  readonly researchJobRepository: ResearchJobRepository;
};

/**
 * Observes simulation state without mutating repositories.
 */
export class CompanyPlanningObserver {
  readonly #inventoryRepository: CompanyPlanningObserverDependencies['inventoryRepository'];
  readonly #financeRepository: CompanyPlanningObserverDependencies['financeRepository'];
  readonly #buildingRepository: CompanyPlanningObserverDependencies['buildingRepository'];
  readonly #marketRepository: CompanyPlanningObserverDependencies['marketRepository'];
  readonly #productionJobRepository: CompanyPlanningObserverDependencies['productionJobRepository'];
  readonly #companyResearchRepository: CompanyPlanningObserverDependencies['companyResearchRepository'];
  readonly #companyMilestonesRepository: CompanyPlanningObserverDependencies['companyMilestonesRepository'];
  readonly #researchJobRepository: CompanyPlanningObserverDependencies['researchJobRepository'];

  constructor(dependencies: CompanyPlanningObserverDependencies) {
    this.#inventoryRepository = dependencies.inventoryRepository;
    this.#financeRepository = dependencies.financeRepository;
    this.#buildingRepository = dependencies.buildingRepository;
    this.#marketRepository = dependencies.marketRepository;
    this.#productionJobRepository = dependencies.productionJobRepository;
    this.#companyResearchRepository = dependencies.companyResearchRepository;
    this.#companyMilestonesRepository = dependencies.companyMilestonesRepository;
    this.#researchJobRepository = dependencies.researchJobRepository;
  }

  /** Builds a planning observation for one company at the given tick. */
  observe(companyId: CompanyId, tickNumber: number): Result<PlanningObservation, ValidationError> {
    const inventory = this.#inventoryRepository.findByCompanyId(companyId);

    if (inventory === undefined) {
      return Result.fail(
        new ValidationError(`Inventory for company "${companyId.value}" was not found.`),
      );
    }

    const finance = this.#financeRepository.findByCompanyId(companyId);

    if (finance === undefined) {
      return Result.fail(
        new ValidationError(`Finance account for company "${companyId.value}" was not found.`),
      );
    }

    const inventoryLines: ObservedInventoryLine[] = inventory
      .getItems()
      .map((item) => ({
        resourceId: item.resourceId.value,
        available: item.quantity - item.reserved,
      }))
      .filter((line) => line.available > 0)
      .sort((left, right) => left.resourceId.localeCompare(right.resourceId));

    const companyBuildings = [...this.#buildingRepository.findByCompanyId(companyId)].sort(
      (left, right) => left.getId().value.localeCompare(right.getId().value),
    );

    const buildings: ObservedBuilding[] = companyBuildings.map((building) => ({
      buildingId: building.getId().value,
      buildingTypeId: building.getBuildingTypeId().value,
      regionId: building.getRegionId().value,
      status: building.getStatus(),
      x: building.getPosition().x,
      y: building.getPosition().y,
    }));

    const regionIds = Object.freeze(
      [...new Set(buildings.map((building) => building.regionId))].sort((left, right) =>
        left.localeCompare(right),
      ),
    );

    const primaryRegionId =
      regionIds.includes(DEFAULT_REGION_ID) ? DEFAULT_REGION_ID : (regionIds[0] ?? DEFAULT_REGION_ID);

    const marketPrices: ObservedMarketPrice[] = [];

    for (const market of this.#marketRepository.findAll()) {
      const regionId = market.getRegionId();

      if (!regionIds.includes(regionId) && regionId !== primaryRegionId) {
        continue;
      }

      for (const price of market.getPrices()) {
        marketPrices.push({
          regionId,
          resourceId: price.resourceId.value,
          lastPrice: price.lastPrice,
          basePrice: price.basePrice,
        });
      }
    }

    marketPrices.sort((left, right) => {
      if (left.regionId !== right.regionId) {
        return left.regionId.localeCompare(right.regionId);
      }

      return left.resourceId.localeCompare(right.resourceId);
    });

    const companyResearch = this.#companyResearchRepository.findByCompanyId(companyId);
    const completedTechnologyIds = Object.freeze(
      [...(companyResearch?.getCompletedTechnologies() ?? [])].sort((left, right) =>
        left.localeCompare(right),
      ),
    );

    const activeResearchTechnologyIds = Object.freeze(
      this.#researchJobRepository
        .findByCompanyId(companyId)
        .filter(
          (job) =>
            job.getStatus() === ResearchJobStatus.WAITING ||
            job.getStatus() === ResearchJobStatus.RUNNING,
        )
        .map((job) => job.getTechnologyId().value)
        .sort((left, right) => left.localeCompare(right)),
    );

    const companyMilestones = this.#companyMilestonesRepository.findByCompanyId(companyId);
    const completedMilestoneIds = Object.freeze(
      [...(companyMilestones?.getCompletedMilestones() ?? [])].sort((left, right) =>
        left.localeCompare(right),
      ),
    );

    const runningProductionJobBuildingIds = Object.freeze(
      this.#productionJobRepository
        .findAll()
        .filter(
          (job) =>
            job.getCompanyId().value === companyId.value &&
            (job.getStatus() === ProductionJobStatus.WAITING ||
              job.getStatus() === ProductionJobStatus.RUNNING),
        )
        .map((job) => job.getBuildingId().value)
        .sort((left, right) => left.localeCompare(right)),
    );

    return Result.ok(
      createPlanningObservation({
        companyId: companyId.value,
        tickNumber,
        cashBalance: finance.getCashBalance(),
        availableCash: finance.getAvailableCash(),
        inventory: inventoryLines,
        regionIds,
        primaryRegionId,
        marketPrices,
        buildings,
        completedTechnologyIds,
        activeResearchTechnologyIds,
        completedMilestoneIds,
        runningProductionJobBuildingIds,
      }),
    );
  }
}

/** Resolves the active strategy definition for planning. */
export function resolveStrategyDefinition(
  strategies: StrategyRegistry,
  strategyDefinitionId: string | undefined,
) {
  const resolvedId = strategyDefinitionId ?? 'strategy_balanced';
  const strategy = strategies.get(resolvedId);

  if (strategy !== undefined && strategy.enabled) {
    return strategy;
  }

  return strategies.get('strategy_balanced');
}
