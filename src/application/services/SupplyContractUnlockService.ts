/**
 * @module @application/services/SupplyContractUnlockService
 *
 * Grants supply contracts when research and building requirements are satisfied.
 */

import type { SupplyContractTemplateDefinition } from '../../content/economy/SupplyContractTemplateDefinition.js';
import type { GameContentLoadResult } from '../../content/validateGameContent.js';
import type { Clock } from '../../common/time/Clock.js';
import type { Building } from '../../domain/building/Building.js';
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import type { BuildingRepository } from '../../domain/building/BuildingRepository.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import {
  SupplyContract,
  SupplyContractKind,
  createSupplyContractId,
} from '../../domain/contract/SupplyContract.js';
import type { SupplyContractRepository } from '../../domain/contract/SupplyContractRepository.js';
import type { CompanyResearch } from '../../domain/research/CompanyResearch.js';
import type { CompanyResearchRepository } from '../../domain/research/CompanyResearchRepository.js';
import type { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';

/** Dependencies required by {@link SupplyContractUnlockService}. */
export type SupplyContractUnlockServiceDependencies = {
  readonly clock: Clock;
  readonly supplyContractRepository: SupplyContractRepository;
  readonly companyResearchRepository: CompanyResearchRepository;
  readonly buildingRepository: BuildingRepository;
  readonly simulationEngine: SimulationEngine;
  readonly gameContent: GameContentLoadResult;
};

/**
 * Evaluates export contract templates and grants contracts when prerequisites are met.
 */
export class SupplyContractUnlockService {
  readonly #clock: SupplyContractUnlockServiceDependencies['clock'];
  readonly #supplyContractRepository: SupplyContractUnlockServiceDependencies['supplyContractRepository'];
  readonly #companyResearchRepository: SupplyContractUnlockServiceDependencies['companyResearchRepository'];
  readonly #buildingRepository: SupplyContractUnlockServiceDependencies['buildingRepository'];
  readonly #simulationEngine: SupplyContractUnlockServiceDependencies['simulationEngine'];
  readonly #gameContent: SupplyContractUnlockServiceDependencies['gameContent'];

  /**
   * @param dependencies - Repositories, content, and simulation wiring.
   */
  constructor(dependencies: SupplyContractUnlockServiceDependencies) {
    this.#clock = dependencies.clock;
    this.#supplyContractRepository = dependencies.supplyContractRepository;
    this.#companyResearchRepository = dependencies.companyResearchRepository;
    this.#buildingRepository = dependencies.buildingRepository;
    this.#simulationEngine = dependencies.simulationEngine;
    this.#gameContent = dependencies.gameContent;
  }

  /**
   * Grants all newly eligible contracts for the given company.
   */
  evaluateForCompany(companyId: CompanyId): void {
    const companyResearch = this.#companyResearchRepository.findByCompanyId(companyId);

    if (companyResearch === undefined) {
      return;
    }

    const buildings = this.#buildingRepository.findByCompanyId(companyId);
    const existingContractIds = new Set(
      this.#supplyContractRepository
        .findByCompanyId(companyId)
        .map((contract) => contract.getId().value),
    );

    for (const template of this.#gameContent.supplyContractTemplates.getEnabled()) {
      if (template.autoGrantOnNewGame) {
        continue;
      }

      if (existingContractIds.has(template.id)) {
        continue;
      }

      if (!areTemplateRequirementsMet(template, companyResearch, buildings)) {
        continue;
      }

      this.#grantContract(template, companyId);
      existingContractIds.add(template.id);
    }
  }

  #grantContract(template: SupplyContractTemplateDefinition, companyId: CompanyId): void {
    const contractIdResult = createSupplyContractId(template.id);

    if (!contractIdResult.ok) {
      return;
    }

    const contractResult = SupplyContract.createFromTemplate({
      id: contractIdResult.value,
      companyId,
      clock: this.#clock,
      kind: SupplyContractKind.NPC_PURCHASE,
      resourceId: template.resourceId,
      amount: template.amount,
      paymentAmount: template.paymentAmount,
      intervalTicks: template.intervalTicks,
    });

    if (!contractResult.ok) {
      return;
    }

    this.#supplyContractRepository.save(contractResult.value);
    this.#simulationEngine.enqueueEvents(contractResult.value.pullDomainEvents());
  }
}

/**
 * Returns whether a company satisfies the template research and building requirements.
 */
export function areTemplateRequirementsMet(
  template: SupplyContractTemplateDefinition,
  companyResearch: CompanyResearch,
  buildings: readonly Building[],
): boolean {
  const completedResearch = new Set(companyResearch.getCompletedTechnologies());

  for (const technologyId of template.requirements.research) {
    if (!completedResearch.has(technologyId)) {
      return false;
    }
  }

  const activeBuildings = buildings.filter(
    (building) => building.getStatus() === BuildingStatus.ACTIVE,
  );

  for (const buildingTypeId of template.requirements.buildings) {
    const matchingBuildings = activeBuildings.filter(
      (building) => building.getBuildingTypeId().value === buildingTypeId,
    );

    if (matchingBuildings.length === 0) {
      return false;
    }

    if (template.regionId !== null) {
      const hasBuildingInRegion = matchingBuildings.some(
        (building) => building.getRegionId().value === template.regionId,
      );

      if (!hasBuildingInRegion) {
        return false;
      }
    }
  }

  return true;
}
