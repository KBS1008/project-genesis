import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createBuildingId } from '../../domain/building/Building.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { STARTING_MONEY } from '../../domain/finance/FinanceConstants.js';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
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

describe('SaveGameUseCase', () => {
  it('persists and restores a game session snapshot', async () => {
    const tempDirectory = await mkdtemp(path.join(tmpdir(), 'genesis-save-'));
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
      const loadGame = new LoadGameUseCase();

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
        x: 2,
        y: 3,
      });

      const tickResult = context.simulationEngine.tick();

      expect(tickResult.ok).toBe(true);

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
      expect(restored.simulationEngine.state.tickNumber).toBe(context.simulationEngine.state.tickNumber);
      expect(finance?.getCashBalance()).toBe(STARTING_MONEY - 5000);
      expect(building?.getName()).toBe('Northern Sawmill');
      expect(building?.getPosition().x).toBe(2);
      expect(restored.marketRepository.findAll()).toHaveLength(1);
    } finally {
      await rm(tempDirectory, { recursive: true, force: true });
    }
  });

  it('rejects saving while domain events are still queued', async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot });

    if (!bootstrapResult.ok) {
      throw new Error(bootstrapResult.error.message);
    }

    const context = bootstrapResult.value;
    const createCompany = new CreateCompanyUseCase(context);
    const saveGame = new SaveGameUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const saveResult = await saveGame.execute({
      filePath: path.join(tmpdir(), 'should-not-be-written.json'),
    });

    expect(saveResult.ok).toBe(false);
  });
});
