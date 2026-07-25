/**
 * @module @application/services/SupplyContractUnlockService.test
 *
 * Unit tests for {@link SupplyContractUnlockService}.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { createMilestoneId } from '../../domain/milestone/MilestoneId.js';
import { createTechnologyId } from '../../domain/research/TechnologyId.js';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { PlaceBuildingUseCase } from '../use-cases/PlaceBuildingUseCase.js';
import { completeBuildingConstruction } from '../../../tests/helpers/completeBuildingConstruction.js';
import {
  areTemplateRequirementsMet,
  SupplyContractUnlockService,
} from './SupplyContractUnlockService.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireTechnologyId(value: string) {
  const result = createTechnologyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

async function createBootstrapContext() {
  const bootstrapResult = await bootstrapApplication({ gameContentRoot });

  if (!bootstrapResult.ok) {
    throw new Error(bootstrapResult.error.message);
  }

  const context = bootstrapResult.value;
  const supplyContractUnlockService = new SupplyContractUnlockService({
    clock: context.clock,
    supplyContractRepository: context.supplyContractRepository,
    companyResearchRepository: context.companyResearchRepository,
    buildingRepository: context.buildingRepository,
    simulationEngine: context.simulationEngine,
    gameContent: context.gameContent,
  });

  return {
    context,
    supplyContractUnlockService,
    createCompany: new CreateCompanyUseCase(context),
    placeBuilding: new PlaceBuildingUseCase(context),
  };
}

function completeMilestoneForCompany(
  context: Awaited<ReturnType<typeof createBootstrapContext>>['context'],
  companyId: ReturnType<typeof requireCompanyId>,
  milestoneId: string,
): void {
  const milestones = context.companyMilestonesRepository.findByCompanyId(companyId);

  if (milestones === undefined) {
    throw new Error(`Milestones for company "${companyId.value}" were not found.`);
  }

  const milestoneIdResult = createMilestoneId(milestoneId);

  if (!milestoneIdResult.ok) {
    throw new Error(milestoneIdResult.error.message);
  }

  const completeResult = milestones.completeMilestone(milestoneIdResult.value, context.clock);

  if (!completeResult.ok) {
    throw new Error(completeResult.error.message);
  }

  context.companyMilestonesRepository.save(milestones);
}

function completeTechnologyForCompany(
  context: Awaited<ReturnType<typeof createBootstrapContext>>['context'],
  companyId: ReturnType<typeof requireCompanyId>,
  technologyId: string,
): void {
  const companyResearch = context.companyResearchRepository.findByCompanyId(companyId);

  if (companyResearch === undefined) {
    throw new Error(`Research module for company "${companyId.value}" was not found.`);
  }

  const completeResult = companyResearch.completeTechnology(
    requireTechnologyId(technologyId),
    context.clock,
  );

  if (!completeResult.ok) {
    throw new Error(completeResult.error.message);
  }

  context.companyResearchRepository.save(companyResearch);
}

describe('SupplyContractUnlockService', () => {
  it('grants export contracts when research and active building requirements are met', async () => {
    const { context, supplyContractUnlockService, createCompany, placeBuilding } =
      await createBootstrapContext();
    const companyId = requireCompanyId('company_export_unlock');

    createCompany.execute({
      companyId: companyId.value,
      name: 'Export Unlock Co',
      ownerId: 'player_001',
    });

    completeMilestoneForCompany(context, companyId, 'first_steel');
    completeTechnologyForCompany(context, companyId, 'advanced_metallurgy');

    const placeResult = placeBuilding.execute({
      companyId: companyId.value,
      buildingId: 'building_machine_shop_001',
      buildingTypeId: 'machine_shop',
      name: 'Eastern Machine Shop',
      regionId: 'region_east',
      x: 0,
      y: 0,
    });

    expect(placeResult.ok).toBe(true);

    completeBuildingConstruction({
      buildingRepository: context.buildingRepository,
      simulationEngine: context.simulationEngine,
      buildingId: 'building_machine_shop_001',
      clock: context.clock,
    });

    supplyContractUnlockService.evaluateForCompany(companyId);

    const contracts = context.supplyContractRepository.findByCompanyId(companyId);
    expect(contracts.some((contract) => contract.getId().value === 'contract_export_steel')).toBe(
      true,
    );
  });

  it('does not grant the same contract twice', async () => {
    const { context, supplyContractUnlockService, createCompany, placeBuilding } =
      await createBootstrapContext();
    const companyId = requireCompanyId('company_export_once');

    createCompany.execute({
      companyId: companyId.value,
      name: 'Export Once Co',
      ownerId: 'player_001',
    });

    completeMilestoneForCompany(context, companyId, 'first_steel');
    completeTechnologyForCompany(context, companyId, 'advanced_metallurgy');

    placeBuilding.execute({
      companyId: companyId.value,
      buildingId: 'building_machine_shop_002',
      buildingTypeId: 'machine_shop',
      name: 'Eastern Machine Shop Two',
      regionId: 'region_east',
      x: 1,
      y: 0,
    });

    completeBuildingConstruction({
      buildingRepository: context.buildingRepository,
      simulationEngine: context.simulationEngine,
      buildingId: 'building_machine_shop_002',
      clock: context.clock,
    });

    supplyContractUnlockService.evaluateForCompany(companyId);
    supplyContractUnlockService.evaluateForCompany(companyId);

    const steelContracts = context.supplyContractRepository
      .findByCompanyId(companyId)
      .filter((contract) => contract.getId().value === 'contract_export_steel');

    expect(steelContracts).toHaveLength(1);
  });

  it('requires the required building in the template region when regionId is set', async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot });

    if (!bootstrapResult.ok) {
      throw new Error(bootstrapResult.error.message);
    }

    const template = bootstrapResult.value.gameContent.supplyContractTemplates.get(
      'contract_export_steel',
    );

    if (template === undefined) {
      throw new Error('contract_export_steel template missing.');
    }

    expect(
      areTemplateRequirementsMet(template, {
        getCompletedTechnologies: () => ['advanced_metallurgy'],
      } as never, [
        {
          getStatus: () => BuildingStatus.ACTIVE,
          getBuildingTypeId: () => ({ value: 'machine_shop' }),
          getRegionId: () => ({ value: 'region_default' }),
        } as never,
      ]),
    ).toBe(false);
  });
});
