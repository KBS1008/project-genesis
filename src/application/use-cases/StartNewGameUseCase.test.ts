import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { STARTING_MONEY } from '../../domain/finance/FinanceConstants.js';
import { STARTER_NPC_WOOD_CONTRACT_ID } from '../../domain/contract/SupplyContractConstants.js';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import { BuildingTypeRegistry } from '../../content/building/BuildingTypeRegistry.js';
import {
  NEW_GAME_STARTER_BUILDINGS,
  NEW_GAME_STARTER_RESOURCES,
} from '../new-game/NewGameSetupConstants.js';
import { StartNewGameUseCase } from './StartNewGameUseCase.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

describe('StartNewGameUseCase', () => {
  it('creates a playable company with starter buildings, resources and starting capital', async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot });

    if (!bootstrapResult.ok) {
      throw new Error(bootstrapResult.error.message);
    }

    const context = bootstrapResult.value;
    const useCase = new StartNewGameUseCase(context);
    const result = useCase.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const companyId = createCompanyId('company_001');

    if (!companyId.ok) {
      throw new Error(companyId.error.message);
    }

    const finance = context.financeRepository.findByCompanyId(companyId.value);
    const inventory = context.inventoryRepository.findByCompanyId(companyId.value);
    const buildings = context.buildingRepository.findByCompanyId(companyId.value);

    expect(finance?.getCashBalance()).toBe(STARTING_MONEY);
    expect(buildings).toHaveLength(NEW_GAME_STARTER_BUILDINGS.length);
    expect(buildings.every((building) => building.getStatus() === BuildingStatus.ACTIVE)).toBe(
      true,
    );
    expect(buildings.map((building) => building.getBuildingTypeId().value).sort()).toEqual(
      NEW_GAME_STARTER_BUILDINGS.map((entry) => entry.buildingTypeId).sort(),
    );

    for (const starterResource of NEW_GAME_STARTER_RESOURCES) {
      expect(
        inventory
          ?.getItems()
          .some(
            (item) =>
              item.resourceId.value === starterResource.resourceId &&
              item.quantity === starterResource.quantity,
          ),
      ).toBe(true);
    }

    const warehouse = buildings.find(
      (building) => building.getBuildingTypeId().value === 'warehouse',
    );

    expect(warehouse).toBeDefined();
    expect(context.buildingStorageRepository.findByBuildingId(warehouse!.getId())).toBeDefined();
    expect(context.supplyContractRepository.findByCompanyId(companyId.value)).toHaveLength(1);
    expect(
      context.supplyContractRepository.findByCompanyId(companyId.value)[0]?.getId().value,
    ).toBe(STARTER_NPC_WOOD_CONTRACT_ID);
    expect(context.simulationEngine.hasPendingEvents()).toBe(false);
  });

  it('rejects starting a game when the company id already exists', async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot });

    if (!bootstrapResult.ok) {
      throw new Error(bootstrapResult.error.message);
    }

    const context = bootstrapResult.value;
    const useCase = new StartNewGameUseCase(context);

    const firstResult = useCase.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    expect(firstResult.ok).toBe(true);

    const secondResult = useCase.execute({
      companyId: 'company_001',
      name: 'Duplicate Corp',
      ownerId: 'player_001',
    });

    expect(secondResult.ok).toBe(false);
  });

  it('rejects starter setup when a starter building type is missing from content', async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot });

    if (!bootstrapResult.ok) {
      throw new Error(bootstrapResult.error.message);
    }

    const context = bootstrapResult.value;
    const filteredBuildingTypes = new BuildingTypeRegistry();

    for (const buildingType of context.gameContent.buildingTypes.getAll()) {
      if (buildingType.id === 'headquarters') {
        continue;
      }

      const registerResult = filteredBuildingTypes.register(buildingType);

      if (!registerResult.ok) {
        throw new Error(registerResult.error.message);
      }
    }

    const useCase = new StartNewGameUseCase({
      ...context,
      gameContent: Object.freeze({
        ...context.gameContent,
        buildingTypes: filteredBuildingTypes,
      }),
    });

    const result = useCase.execute({
      companyId: 'company_002',
      name: 'Broken Setup Corp',
      ownerId: 'player_001',
    });

    expect(result.ok).toBe(false);

    if (result.ok) {
      return;
    }

    expect(result.error.message).toContain('headquarters');
  });
});
