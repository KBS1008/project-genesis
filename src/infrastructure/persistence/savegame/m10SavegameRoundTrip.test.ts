/**
 * @module @infrastructure/persistence/savegame/m10SavegameRoundTrip.test
 *
 * Verifies M10 building, research, and contract state survives V3 save/load.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { bootstrapApplication } from '../../../application/bootstrap/bootstrapApplication.js';
import { restoreApplicationFromSnapshot } from '../../../application/bootstrap/restoreApplicationFromSnapshot.js';
import type { ApplicationContext } from '../../../application/bootstrap/ApplicationContext.js';
import { SupplyContractUnlockService } from '../../../application/services/SupplyContractUnlockService.js';
import { PlaceBuildingUseCase } from '../../../application/use-cases/PlaceBuildingUseCase.js';
import { StartNewGameUseCase } from '../../../application/use-cases/StartNewGameUseCase.js';
import { createCompanyId } from '../../../domain/company/Company.js';
import type { CompanyId } from '../../../domain/company/CompanyId.js';
import { BuildingStatus } from '../../../domain/building/BuildingStatus.js';
import { createMilestoneId } from '../../../domain/milestone/MilestoneId.js';
import { createTechnologyId } from '../../../domain/research/TechnologyId.js';
import { completeBuildingConstruction } from '../../../../tests/helpers/completeBuildingConstruction.js';
import { GameStateSerializer } from './GameStateSerializer.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../../game-content');
const serializer = new GameStateSerializer();

const M10_PLAYER_COMPANY_ID = 'company_m10_save_roundtrip';

function requireCompanyId(value: string): CompanyId {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function serializeContext(context: ApplicationContext) {
  return serializer.serialize({
    clock: context.clock,
    simulationEngine: context.simulationEngine,
    companyRepository: context.companyRepository,
    buildingRepository: context.buildingRepository,
    buildingStorageRepository: context.buildingStorageRepository,
    transportOrderRepository: context.transportOrderRepository,
    inventoryRepository: context.inventoryRepository,
    financeRepository: context.financeRepository,
    marketRepository: context.marketRepository,
    productionJobRepository: context.productionJobRepository,
    researchJobRepository: context.researchJobRepository,
    companyResearchRepository: context.companyResearchRepository,
    companyMilestonesRepository: context.companyMilestonesRepository,
    employeeRepository: context.employeeRepository,
    supplyContractRepository: context.supplyContractRepository,
    tickHistoryService: context.tickHistoryService,
    worldRepository: context.worldRepository,
    companyBrainRepository: context.companyBrainRepository,
  });
}

function completeMilestone(context: ApplicationContext, companyId: CompanyId, milestoneId: string): void {
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

function completeTechnology(
  context: ApplicationContext,
  companyId: CompanyId,
  technologyId: string,
): void {
  const companyResearch = context.companyResearchRepository.findByCompanyId(companyId);

  if (companyResearch === undefined) {
    throw new Error(`Research module for company "${companyId.value}" was not found.`);
  }

  const technologyIdResult = createTechnologyId(technologyId);

  if (!technologyIdResult.ok) {
    throw new Error(technologyIdResult.error.message);
  }

  const completeResult = companyResearch.completeTechnology(technologyIdResult.value, context.clock);

  if (!completeResult.ok) {
    throw new Error(completeResult.error.message);
  }

  context.companyResearchRepository.save(companyResearch);
}

function captureM10Fingerprint(context: ApplicationContext, companyId: CompanyId) {
  const buildings = context.buildingRepository
    .findByCompanyId(companyId)
    .map((building) => ({
      typeId: building.getBuildingTypeId().value,
      regionId: building.getRegionId().value,
      status: building.getStatus(),
    }))
    .sort((left, right) =>
      `${left.typeId}:${left.regionId}:${left.status}`.localeCompare(
        `${right.typeId}:${right.regionId}:${right.status}`,
      ),
    );

  const research =
    context.companyResearchRepository.findByCompanyId(companyId)?.getCompletedTechnologies() ?? [];

  const contracts = context.supplyContractRepository
    .findByCompanyId(companyId)
    .map((contract) => contract.getId().value)
    .sort();

  return {
    tickNumber: context.simulationEngine.state.tickNumber,
    buildings,
    research: [...research].sort(),
    contracts,
  };
}

async function seedM10GameplayState(context: ApplicationContext): Promise<CompanyId> {
  const startNewGame = new StartNewGameUseCase(context);
  const placeBuilding = new PlaceBuildingUseCase(context);
  const supplyContractUnlockService = new SupplyContractUnlockService({
    clock: context.clock,
    supplyContractRepository: context.supplyContractRepository,
    companyResearchRepository: context.companyResearchRepository,
    buildingRepository: context.buildingRepository,
    simulationEngine: context.simulationEngine,
    gameContent: context.gameContent,
  });

  const companyId = requireCompanyId(M10_PLAYER_COMPANY_ID);
  const startResult = startNewGame.execute({
    companyId: companyId.value,
    name: 'M10 Save Roundtrip Corp',
    ownerId: 'player_001',
  });

  if (!startResult.ok) {
    throw new Error(startResult.error.message);
  }

  completeMilestone(context, companyId, 'first_production');
  completeMilestone(context, companyId, 'first_steel');
  completeTechnology(context, companyId, 'advanced_metallurgy');

  const smelterPlacement = placeBuilding.execute({
    companyId: companyId.value,
    buildingId: 'building_m10_smelter',
    buildingTypeId: 'smelter',
    name: 'Eastern Smelter',
    regionId: 'region_east',
    x: 4,
    y: 2,
  });

  if (!smelterPlacement.ok) {
    throw new Error(smelterPlacement.error.message);
  }

  const machineShopPlacement = placeBuilding.execute({
    companyId: companyId.value,
    buildingId: 'building_m10_machine_shop',
    buildingTypeId: 'machine_shop',
    name: 'Eastern Machine Shop',
    regionId: 'region_east',
    x: 8,
    y: 2,
  });

  if (!machineShopPlacement.ok) {
    throw new Error(machineShopPlacement.error.message);
  }

  completeBuildingConstruction({
    buildingRepository: context.buildingRepository,
    simulationEngine: context.simulationEngine,
    buildingId: 'building_m10_smelter',
    clock: context.clock,
  });

  completeBuildingConstruction({
    buildingRepository: context.buildingRepository,
    simulationEngine: context.simulationEngine,
    buildingId: 'building_m10_machine_shop',
    clock: context.clock,
  });

  supplyContractUnlockService.evaluateForCompany(companyId);

  for (let tick = 0; tick < 3; tick += 1) {
    const tickResult = context.simulationEngine.tick();

    if (!tickResult.ok) {
      throw new Error(tickResult.error.message);
    }
  }

  return companyId;
}

describe('M10 savegame round trip', () => {
  it('preserves M10 buildings, research, and export contracts through save/load', async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot });

    if (!bootstrapResult.ok) {
      throw new Error(bootstrapResult.error.message);
    }

    const sourceContext = bootstrapResult.value;
    const companyId = await seedM10GameplayState(sourceContext);
    const sourceFingerprint = captureM10Fingerprint(sourceContext, companyId);

    expect(sourceFingerprint.buildings.some((building) => building.typeId === 'smelter')).toBe(
      true,
    );
    expect(
      sourceFingerprint.buildings.some((building) => building.typeId === 'machine_shop'),
    ).toBe(true);
    expect(sourceFingerprint.research).toContain('advanced_metallurgy');
    expect(sourceFingerprint.contracts).toContain('contract_export_steel');

    const serializeResult = serializeContext(sourceContext);

    expect(serializeResult.ok).toBe(true);

    if (!serializeResult.ok) {
      return;
    }

    const parseResult = serializer.parse(JSON.parse(JSON.stringify(serializeResult.value)));

    expect(parseResult.ok).toBe(true);

    if (!parseResult.ok) {
      return;
    }

    const restoreResult = await restoreApplicationFromSnapshot({
      gameContentRoot,
      snapshot: parseResult.value,
    });

    expect(restoreResult.ok).toBe(true);

    if (!restoreResult.ok) {
      return;
    }

    const restoredContext = restoreResult.value;
    const restoredFingerprint = captureM10Fingerprint(restoredContext, companyId);

    expect(restoredFingerprint).toEqual(sourceFingerprint);

    const restoredMachineShop = restoredContext.buildingRepository
      .findByCompanyId(companyId)
      .find((building) => building.getBuildingTypeId().value === 'machine_shop');

    expect(restoredMachineShop?.getStatus()).toBe(BuildingStatus.ACTIVE);
    expect(restoredMachineShop?.getRegionId().value).toBe('region_east');
  });
});
