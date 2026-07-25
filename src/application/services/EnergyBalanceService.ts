/**
 * @module @application/services/EnergyBalanceService
 *
 * Computes company energy supply, demand and reserve from active buildings and jobs.
 */

import type { EnergyBalancePort } from '../../domain/energy/EnergyBalancePort.js';
import { BuildingCategory } from '../../content/building/BuildingTypeDefinition.js';
import type { GameContentLoadResult } from '../../content/validateGameContent.js';
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import type { BuildingRepository } from '../../domain/building/BuildingRepository.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { ProductionJobRepository } from '../../domain/production/ProductionJobRepository.js';
import { ProductionJobStatus } from '../../domain/production/ProductionJobStatus.js';
import { DEFAULT_REGIONAL_MODIFIER_LOOKUP } from '../../domain/region/RegionalModifierResolver.js';
import {
  createRegionalModifierResolver,
  type RegionalModifierResolver,
} from './createRegionalModifierResolver.js';
import { resolveCompanyRegionalEnergyAvailabilityMultiplier } from './resolveCompanyRegionalModifier.js';

/** Free grid connection used until the company operates its own energy buildings. */
export const BASELINE_GRID_ENERGY = 30;

/** Energy balance snapshot for a company. */
export type EnergyBalance = {
  readonly generation: number;
  readonly consumption: number;
  readonly reserve: number;
  readonly hasDeficit: boolean;
  readonly usesBaselineGrid: boolean;
};

/** Dependencies for {@link EnergyBalanceService}. */
export type EnergyBalanceServiceDependencies = {
  readonly buildingRepository: BuildingRepository;
  readonly productionJobRepository: ProductionJobRepository;
  readonly gameContent: GameContentLoadResult;
};

/**
 * Derives deterministic energy metrics from building content and runtime state.
 */
export class EnergyBalanceService implements EnergyBalancePort {
  readonly #buildingRepository: BuildingRepository;
  readonly #productionJobRepository: ProductionJobRepository;
  readonly #gameContent: GameContentLoadResult;
  readonly #resolveRegionalModifiers: RegionalModifierResolver;

  constructor(dependencies: EnergyBalanceServiceDependencies) {
    this.#buildingRepository = dependencies.buildingRepository;
    this.#productionJobRepository = dependencies.productionJobRepository;
    this.#gameContent = dependencies.gameContent;
    this.#resolveRegionalModifiers =
      dependencies.gameContent?.regions === undefined
        ? () => DEFAULT_REGIONAL_MODIFIER_LOOKUP
        : createRegionalModifierResolver(dependencies.gameContent.regions);
  }

  /** Computes the current energy balance for a company. */
  computeForCompany(companyId: CompanyId): EnergyBalance {
    const buildings = this.#buildingRepository.findByCompanyId(companyId);
    const buildingById = new Map(buildings.map((building) => [building.getId().value, building]));
    const companyEnergyMultiplier = resolveCompanyRegionalEnergyAvailabilityMultiplier(
      companyId,
      this.#buildingRepository,
      this.#resolveRegionalModifiers,
    );
    let plantGeneration = 0;
    let buildingConsumption = 0;
    let hasActiveEnergyBuilding = false;

    for (const building of buildings) {
      if (building.getStatus() !== BuildingStatus.ACTIVE) {
        continue;
      }

      const buildingType = this.#gameContent.buildingTypes.get(building.getBuildingTypeId().value);

      if (buildingType === undefined) {
        continue;
      }

      const energyMultiplier = this.#resolveRegionalModifiers(
        building.getRegionId().value,
      ).energyAvailabilityModifier;

      if (buildingType.category === BuildingCategory.ENERGY) {
        hasActiveEnergyBuilding = true;
      }

      plantGeneration += buildingType.energyGeneration * energyMultiplier;
      buildingConsumption += buildingType.energyUsage / energyMultiplier;
    }

    let productionConsumption = 0;

    for (const job of this.#productionJobRepository.findAll()) {
      if (job.getCompanyId().value !== companyId.value) {
        continue;
      }

      if (
        job.getStatus() !== ProductionJobStatus.RUNNING &&
        job.getStatus() !== ProductionJobStatus.WAITING
      ) {
        continue;
      }

      const recipe = this.#gameContent.recipes.get(job.getRecipeId().value);

      if (recipe === undefined || recipe.duration <= 0) {
        continue;
      }

      const building = buildingById.get(job.getBuildingId().value);
      const energyMultiplier =
        building === undefined
          ? companyEnergyMultiplier
          : this.#resolveRegionalModifiers(building.getRegionId().value).energyAvailabilityModifier;
      const recipeEnergyPerTick = recipe.energy / recipe.duration;

      productionConsumption += recipeEnergyPerTick / energyMultiplier;
    }

    const usesBaselineGrid = !hasActiveEnergyBuilding;
    const generation = usesBaselineGrid
      ? Math.max(BASELINE_GRID_ENERGY * companyEnergyMultiplier, plantGeneration)
      : plantGeneration;
    const consumption = buildingConsumption + productionConsumption;
    const reserve = generation - consumption;

    return {
      generation,
      consumption,
      reserve,
      hasDeficit: reserve < 0,
      usesBaselineGrid,
    };
  }

  /** Returns whether a company can afford the additional per-tick energy of a recipe. */
  canAffordRecipeEnergy(
    companyId: CompanyId,
    recipeId: string,
    options: { readonly includeRecipeLoad?: boolean } = {},
  ): boolean {
    const balance = this.computeForCompany(companyId);

    if (!options.includeRecipeLoad) {
      return !balance.hasDeficit;
    }

    const recipe = this.#gameContent.recipes.get(recipeId);

    if (recipe === undefined || recipe.duration <= 0) {
      return !balance.hasDeficit;
    }

    const projectedReserve = balance.reserve - recipe.energy / recipe.duration;
    return projectedReserve >= 0;
  }
}
