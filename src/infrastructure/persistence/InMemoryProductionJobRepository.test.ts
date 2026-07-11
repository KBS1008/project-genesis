import { ManualClock } from '../../common/time/ManualClock.js';
import { createBuildingId } from '../../domain/building/Building.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { ProductionJob, createProductionJobId } from '../../domain/production/ProductionJob.js';
import { createRecipeId } from '../../domain/production/RecipeId.js';
import { InMemoryProductionJobRepository } from './InMemoryProductionJobRepository.js';

function requireProductionJobId(value: string) {
  const result = createProductionJobId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireBuildingId(value: string) {
  const result = createBuildingId(value);

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

function requireRecipeId(value: string) {
  const result = createRecipeId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('InMemoryProductionJobRepository', () => {
  it('returns running jobs in deterministic order', () => {
    const repository = new InMemoryProductionJobRepository();
    const clock = new ManualClock(100);

    const secondJobResult = ProductionJob.create({
      id: requireProductionJobId('job_002'),
      buildingId: requireBuildingId('building_002'),
      companyId: requireCompanyId('company_001'),
      recipeId: requireRecipeId('recipe_planks'),
      duration: 10,
      clock,
    });
    const firstJobResult = ProductionJob.create({
      id: requireProductionJobId('job_001'),
      buildingId: requireBuildingId('building_001'),
      companyId: requireCompanyId('company_001'),
      recipeId: requireRecipeId('recipe_planks'),
      duration: 10,
      clock,
    });

    if (!secondJobResult.ok || !firstJobResult.ok) {
      throw new Error('Expected valid production jobs.');
    }

    secondJobResult.value.start(clock);
    firstJobResult.value.start(clock);
    repository.save(secondJobResult.value);
    repository.save(firstJobResult.value);

    expect(repository.findRunning().map((job) => job.getId().value)).toEqual([
      'job_001',
      'job_002',
    ]);
  });
});
