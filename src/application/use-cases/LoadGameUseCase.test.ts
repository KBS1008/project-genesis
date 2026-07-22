import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { ContentLoadError } from '../../content/errors/ContentLoadError.js';
import { PersistenceErrorCode } from '../../common/errors/PersistenceError.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { createBuildingId } from '../../domain/building/Building.js';
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { STARTING_MONEY } from '../../domain/finance/FinanceConstants.js';
import { GAME_SAVE_SCHEMA_VERSION as GAME_SAVE_SCHEMA_VERSION_V1 } from '../persistence/GameSaveSnapshotV1.js';
import { GAME_SAVE_SCHEMA_VERSION as GAME_SAVE_SCHEMA_VERSION_V2 } from '../persistence/GameSaveSnapshotV2.js';
import { GAME_SAVE_SCHEMA_VERSION } from '../persistence/GameSaveSnapshotV3.js';
import { DEFAULT_REGION_ID, DEFAULT_WORLD_ID } from '../../domain/world/WorldConstants.js';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import { FileSavegameStore } from '../../infrastructure/persistence/savegame/FileSavegameStore.js';
import { CreateCompanyUseCase } from './CreateCompanyUseCase.js';
import { LoadGameUseCase } from './LoadGameUseCase.js';
import { PlaceBuildingUseCase } from './PlaceBuildingUseCase.js';
import { SaveGameUseCase } from './SaveGameUseCase.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('LoadGameUseCase', () => {
  it('loads a valid savegame file and restores application context', async () => {
    const tempDirectory = await mkdtemp(path.join(tmpdir(), 'genesis-load-'));
    const savePath = path.join(tempDirectory, 'session.json');

    try {
      const bootstrapResult = await bootstrapApplication({ gameContentRoot });

      if (!bootstrapResult.ok) {
        throw new Error(bootstrapResult.error.message);
      }

      const context = bootstrapResult.value;
      const createCompany = new CreateCompanyUseCase(context);
      const placeBuilding = new PlaceBuildingUseCase(context);
      const saveGame = new SaveGameUseCase(context);
      const loadGame = new LoadGameUseCase({ savegameStore: context.savegameStore });

      createCompany.execute({
        companyId: 'company_001',
        name: 'Genesis Industries',
        ownerId: 'player_001',
      });

      placeBuilding.execute({
        buildingId: 'building_001',
        buildingTypeId: 'sawmill',
        companyId: 'company_001',
        name: 'Northern Sawmill',
        x: 4,
        y: 5,
      });

      context.simulationEngine.tick();

      const saveResult = await saveGame.execute({ filePath: savePath });

      expect(saveResult.ok).toBe(true);

      const loadResult = await loadGame.execute({
        filePath: savePath,
        gameContentRoot,
      });

      expect(loadResult.ok).toBe(true);

      if (!loadResult.ok) {
        return;
      }

      const restored = loadResult.value;
      const finance = restored.financeRepository.findByCompanyId(requireCompanyId('company_001'));
      const buildingId = createBuildingId('building_001');

      if (!buildingId.ok) {
        throw new Error(buildingId.error.message);
      }

      const building = restored.buildingRepository.findById(buildingId.value);

      expect(restored.clock.now()).toBe(context.clock.now());
      expect(restored.simulationEngine.state.tickNumber).toBe(
        context.simulationEngine.state.tickNumber,
      );
      expect(finance?.getCashBalance()).toBe(STARTING_MONEY - 5000);
      expect(building?.getName()).toBe('Northern Sawmill');
      expect(building?.getPosition().x).toBe(4);
      expect(building?.getPosition().y).toBe(5);
      expect(building?.getStatus()).toBe(BuildingStatus.UNDER_CONSTRUCTION);
    } finally {
      await rm(tempDirectory, { recursive: true, force: true });
    }
  });

  it('returns PersistenceError when the savegame file does not exist', async () => {
    const loadGame = new LoadGameUseCase({ savegameStore: new FileSavegameStore() });
    const missingPath = path.join(tmpdir(), 'genesis-missing-savegame.json');

    const loadResult = await loadGame.execute({
      filePath: missingPath,
      gameContentRoot,
    });

    expect(loadResult.ok).toBe(false);

    if (loadResult.ok) {
      return;
    }

    expect(loadResult.error.errorCode).toBe(PersistenceErrorCode.READ_FAILED);
    expect(loadResult.error.message).toContain('Failed to read savegame file');
  });

  it('returns PersistenceError when the savegame file contains invalid JSON', async () => {
    const tempDirectory = await mkdtemp(path.join(tmpdir(), 'genesis-load-json-'));
    const savePath = path.join(tempDirectory, 'invalid.json');

    try {
      await writeFile(savePath, '{ invalid json', 'utf8');

      const loadGame = new LoadGameUseCase({ savegameStore: new FileSavegameStore() });
      const loadResult = await loadGame.execute({
        filePath: savePath,
        gameContentRoot,
      });

      expect(loadResult.ok).toBe(false);

      if (loadResult.ok) {
        return;
      }

      expect(loadResult.error.errorCode).toBe(PersistenceErrorCode.READ_FAILED);
    } finally {
      await rm(tempDirectory, { recursive: true, force: true });
    }
  });

  it('returns PersistenceError when the snapshot schema is unsupported', async () => {
    const tempDirectory = await mkdtemp(path.join(tmpdir(), 'genesis-load-schema-'));
    const savePath = path.join(tempDirectory, 'unsupported-schema.json');

    try {
      await writeFile(
        savePath,
        JSON.stringify(
          {
            schemaVersion: 99,
            savedAtUtc: '2026-07-18T12:00:00.000Z',
            simulation: {
              clockTime: 0,
              tickNumber: 0,
              paused: false,
              tickDuration: 1,
            },
            companies: [],
            buildings: [],
            inventories: [],
            financeAccounts: [],
            companyBrains: [],
            regionalMarkets: [],
            productionJobs: [],
          },
          null,
          2,
        ),
        'utf8',
      );

      const loadGame = new LoadGameUseCase({ savegameStore: new FileSavegameStore() });
      const loadResult = await loadGame.execute({
        filePath: savePath,
        gameContentRoot,
      });

      expect(loadResult.ok).toBe(false);

      if (loadResult.ok) {
        return;
      }

      expect(loadResult.error.errorCode).toBe(PersistenceErrorCode.INVALID_SNAPSHOT);
      expect(loadResult.error.message).toContain('Unsupported savegame schema version');
    } finally {
      await rm(tempDirectory, { recursive: true, force: true });
    }
  });

  it('loads a legacy v1 savegame and migrates world metadata', async () => {
    const tempDirectory = await mkdtemp(path.join(tmpdir(), 'genesis-load-v1-'));
    const savePath = path.join(tempDirectory, 'legacy-v1.json');

    try {
      await writeFile(
        savePath,
        JSON.stringify(
          {
            schemaVersion: GAME_SAVE_SCHEMA_VERSION_V1,
            savedAtUtc: '2026-07-18T12:00:00.000Z',
            simulation: {
              clockTime: 0,
              tickNumber: 0,
              paused: false,
              tickDuration: 1,
            },
            companies: [
              {
                id: 'company_001',
                name: 'Genesis Industries',
                ownerId: 'player_001',
                foundedAt: 0,
                status: 'active',
              },
            ],
            buildings: [
              {
                id: 'building_001',
                buildingTypeId: 'sawmill',
                companyId: 'company_001',
                name: 'Legacy Sawmill',
                position: { x: 2, y: 3 },
                level: 1,
                createdAt: 0,
                status: BuildingStatus.ACTIVE,
                constructionDuration: 0,
                constructionProgress: 0,
              },
            ],
            inventories: [],
            financeAccounts: [],
            companyBrains: [],
            regionalMarkets: [],
            productionJobs: [],
            researchJobs: [],
            companyResearch: [],
            companyMilestones: [],
            buildingStorages: [],
            transportOrders: [],
            employees: [],
          },
          null,
          2,
        ),
        'utf8',
      );

      const loadGame = new LoadGameUseCase({ savegameStore: new FileSavegameStore() });
      const loadResult = await loadGame.execute({
        filePath: savePath,
        gameContentRoot,
      });

      expect(loadResult.ok).toBe(true);

      if (!loadResult.ok) {
        return;
      }

      const buildingId = createBuildingId('building_001');

      if (!buildingId.ok) {
        throw new Error(buildingId.error.message);
      }

      const building = loadResult.value.buildingRepository.findById(buildingId.value);

      expect(building?.getRegionId().value).toBe(DEFAULT_REGION_ID);
    } finally {
      await rm(tempDirectory, { recursive: true, force: true });
    }
  });

  it('returns ValidationError when snapshot references an unknown region', async () => {
    const tempDirectory = await mkdtemp(path.join(tmpdir(), 'genesis-load-unknown-region-'));
    const savePath = path.join(tempDirectory, 'unknown-region.json');

    try {
      await writeFile(
        savePath,
        JSON.stringify(
          {
            schemaVersion: GAME_SAVE_SCHEMA_VERSION,
            savedAtUtc: '2026-07-18T12:00:00.000Z',
            world: {
              activeWorldId: DEFAULT_WORLD_ID,
            },
            marketRegionMappings: [],
            simulation: {
              clockTime: 0,
              tickNumber: 0,
              paused: false,
              tickDuration: 1,
            },
            companies: [],
            buildings: [
              {
                id: 'building_001',
                buildingTypeId: 'sawmill',
                companyId: 'company_001',
                regionId: 'region_unknown',
                name: 'Orphan Building',
                position: { x: 0, y: 0 },
                level: 1,
                createdAt: 0,
                status: BuildingStatus.ACTIVE,
                constructionDuration: 0,
                constructionProgress: 0,
              },
            ],
            inventories: [],
            financeAccounts: [],
            companyBrains: [],
            regionalMarkets: [],
            productionJobs: [],
            researchJobs: [],
            companyResearch: [],
            companyMilestones: [],
            buildingStorages: [],
            transportOrders: [],
            employees: [],
          },
          null,
          2,
        ),
        'utf8',
      );

      const loadGame = new LoadGameUseCase({ savegameStore: new FileSavegameStore() });
      const loadResult = await loadGame.execute({
        filePath: savePath,
        gameContentRoot,
      });

      expect(loadResult.ok).toBe(false);

      if (loadResult.ok) {
        return;
      }

      expect(loadResult.error).toBeInstanceOf(ValidationError);
      expect(loadResult.error.message).toContain('region_unknown');
    } finally {
      await rm(tempDirectory, { recursive: true, force: true });
    }
  });

  it('returns ValidationError when snapshot hydration fails', async () => {
    const tempDirectory = await mkdtemp(path.join(tmpdir(), 'genesis-load-hydrate-'));
    const savePath = path.join(tempDirectory, 'invalid-building-id.json');

    try {
      await writeFile(
        savePath,
        JSON.stringify(
          {
            schemaVersion: GAME_SAVE_SCHEMA_VERSION,
            savedAtUtc: '2026-07-18T12:00:00.000Z',
            world: {
              activeWorldId: DEFAULT_WORLD_ID,
            },
            marketRegionMappings: [],
            simulation: {
              clockTime: 0,
              tickNumber: 0,
              paused: false,
              tickDuration: 1,
            },
            companies: [],
            buildings: [
              {
                id: '',
                buildingTypeId: 'sawmill',
                companyId: 'company_001',
                regionId: DEFAULT_REGION_ID,
                name: 'Broken Building',
                position: { x: 0, y: 0 },
                level: 1,
                createdAt: 0,
                status: BuildingStatus.ACTIVE,
                constructionDuration: 0,
                constructionProgress: 0,
              },
            ],
            inventories: [],
            financeAccounts: [],
            companyBrains: [],
            regionalMarkets: [],
            productionJobs: [],
            researchJobs: [],
            companyResearch: [],
            companyMilestones: [],
            buildingStorages: [],
            transportOrders: [],
            employees: [],
          },
          null,
          2,
        ),
        'utf8',
      );

      const loadGame = new LoadGameUseCase({ savegameStore: new FileSavegameStore() });
      const loadResult = await loadGame.execute({
        filePath: savePath,
        gameContentRoot,
      });

      expect(loadResult.ok).toBe(false);

      if (loadResult.ok) {
        return;
      }

      expect(loadResult.error).toBeInstanceOf(ValidationError);
    } finally {
      await rm(tempDirectory, { recursive: true, force: true });
    }
  });

  it('returns ContentLoadError when the game content root is invalid', async () => {
    const tempDirectory = await mkdtemp(path.join(tmpdir(), 'genesis-load-content-'));
    const savePath = path.join(tempDirectory, 'session.json');

    try {
      const bootstrapResult = await bootstrapApplication({ gameContentRoot });

      if (!bootstrapResult.ok) {
        throw new Error(bootstrapResult.error.message);
      }

      const context = bootstrapResult.value;
      const createCompany = new CreateCompanyUseCase(context);
      const saveGame = new SaveGameUseCase(context);
      const loadGame = new LoadGameUseCase({ savegameStore: context.savegameStore });

      createCompany.execute({
        companyId: 'company_001',
        name: 'Genesis Industries',
        ownerId: 'player_001',
      });

      context.simulationEngine.tick();

      const saveResult = await saveGame.execute({ filePath: savePath });

      expect(saveResult.ok).toBe(true);

      const loadResult = await loadGame.execute({
        filePath: savePath,
        gameContentRoot: path.join(tempDirectory, 'missing-content-root'),
      });

      expect(loadResult.ok).toBe(false);

      if (loadResult.ok) {
        return;
      }

      expect(loadResult.error).toBeInstanceOf(ContentLoadError);
    } finally {
      await rm(tempDirectory, { recursive: true, force: true });
    }
  });
});
