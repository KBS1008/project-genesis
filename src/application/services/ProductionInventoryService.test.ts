import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ManualClock } from '../../common/time/ManualClock.js';
import { validateGameContent } from '../../content/validateGameContent.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { createBuildingId } from '../../domain/building/Building.js';
import { Inventory, createInventoryId } from '../../domain/inventory/Inventory.js';
import { ProductionJob, createProductionJobId } from '../../domain/production/ProductionJob.js';
import { createRecipeId } from '../../domain/production/RecipeId.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { ProductionInventoryService } from './ProductionInventoryService.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

function requireInventoryId(value: string) {
  const result = createInventoryId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

async function createService() {
  const contentResult = await validateGameContent(gameContentRoot);

  if (!contentResult.ok) {
    throw new Error(contentResult.error.message);
  }

  const clock = new ManualClock(100);
  const inventoryRepository = new InMemoryInventoryRepository();
  const enqueuedEvents: unknown[] = [];
  const service = new ProductionInventoryService({
    inventoryRepository,
    recipes: contentResult.value.recipes,
    clock,
    enqueueEvents: (events) => {
      enqueuedEvents.push(...events);
    },
  });

  const inventoryResult = Inventory.create({
    id: requireInventoryId('inventory_001'),
    companyId: requireCompanyId('company_001'),
    clock,
  });

  if (!inventoryResult.ok) {
    throw new Error(inventoryResult.error.message);
  }

  const inventory = inventoryResult.value;
  inventory.addQuantity('wood', 10, clock);
  inventory.pullDomainEvents();
  inventoryRepository.save(inventory);

  return {
    service,
    inventoryRepository,
    recipes: contentResult.value.recipes,
    clock,
    enqueuedEvents,
  };
}

describe('ProductionInventoryService', () => {
  it('reserves recipe inputs in company inventory', async () => {
    const { service, inventoryRepository, recipes } = await createService();
    const recipe = recipes.get('recipe_planks');

    if (recipe === undefined) {
      throw new Error('Recipe recipe_planks was not found.');
    }

    const result = service.reserveInputs(requireCompanyId('company_001'), recipe);

    expect(result.ok).toBe(true);

    const inventory = inventoryRepository.findByCompanyId(requireCompanyId('company_001'));
    const wood = inventory?.getItems().find((item) => item.resourceId.value === 'wood');

    expect(wood?.quantity).toBe(10);
    expect(wood?.reserved).toBe(10);
  });

  it('releases previously reserved recipe inputs', async () => {
    const { service, inventoryRepository, recipes } = await createService();
    const recipe = recipes.get('recipe_planks');

    if (recipe === undefined) {
      throw new Error('Recipe recipe_planks was not found.');
    }

    service.reserveInputs(requireCompanyId('company_001'), recipe);
    const result = service.releaseInputs(requireCompanyId('company_001'), recipe);

    expect(result.ok).toBe(true);

    const inventory = inventoryRepository.findByCompanyId(requireCompanyId('company_001'));
    const wood = inventory?.getItems().find((item) => item.resourceId.value === 'wood');

    expect(wood?.quantity).toBe(10);
    expect(wood?.reserved).toBe(0);
  });

  it('consumes reserved inputs and adds outputs when a job completes', async () => {
    const { service, inventoryRepository, recipes, clock } = await createService();
    const recipe = recipes.get('recipe_planks');

    if (recipe === undefined) {
      throw new Error('Recipe recipe_planks was not found.');
    }

    service.reserveInputs(requireCompanyId('company_001'), recipe);

    const jobIdResult = createProductionJobId('job_001');
    const buildingIdResult = createBuildingId('building_001');
    const recipeIdResult = createRecipeId('recipe_planks');

    if (!jobIdResult.ok || !buildingIdResult.ok || !recipeIdResult.ok) {
      throw new Error('Failed to create production identifiers.');
    }

    const jobResult = ProductionJob.create({
      id: jobIdResult.value,
      buildingId: buildingIdResult.value,
      companyId: requireCompanyId('company_001'),
      recipeId: recipeIdResult.value,
      duration: recipe.duration,
      clock,
    });

    if (!jobResult.ok) {
      throw new Error(jobResult.error.message);
    }

    const result = service.completeJob(jobResult.value);

    expect(result.ok).toBe(true);

    const inventory = inventoryRepository.findByCompanyId(requireCompanyId('company_001'));
    const wood = inventory?.getItems().find((item) => item.resourceId.value === 'wood');
    const planks = inventory?.getItems().find((item) => item.resourceId.value === 'planks');

    expect(wood).toBeUndefined();
    expect(planks?.quantity).toBe(20);
  });
});
