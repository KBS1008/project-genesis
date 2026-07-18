import { ManualClock } from '../../common/time/ManualClock.js';
import { createBuildingId } from '../building/Building.js';
import { createCompanyId } from '../company/Company.js';
import { createRecipeId } from './RecipeId.js';
import { ProductionJob, createProductionJobId } from './ProductionJob.js';
import { ProductionJobStatus } from './ProductionJobStatus.js';
import { ProductionCompleted } from './events/ProductionCompleted.js';
import { ProductionStarted } from './events/ProductionStarted.js';

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

describe('ProductionJob', () => {
  it('creates a waiting production job', () => {
    const clock = new ManualClock(100);
    const result = ProductionJob.create({
      id: requireProductionJobId('job_001'),
      buildingId: requireBuildingId('building_001'),
      companyId: requireCompanyId('company_001'),
      recipeId: requireRecipeId('recipe_planks'),
      duration: 10,
      clock,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.getStatus()).toBe(ProductionJobStatus.WAITING);
      expect(result.value.getProgress()).toBe(0);
    }
  });

  it('starts a job and raises ProductionStarted', () => {
    const clock = new ManualClock(100);
    const jobResult = ProductionJob.create({
      id: requireProductionJobId('job_001'),
      buildingId: requireBuildingId('building_001'),
      companyId: requireCompanyId('company_001'),
      recipeId: requireRecipeId('recipe_planks'),
      duration: 10,
      clock,
    });

    expect(jobResult.ok).toBe(true);

    if (!jobResult.ok) {
      return;
    }

    const startResult = jobResult.value.start(clock);

    expect(startResult.ok).toBe(true);
    expect(jobResult.value.getStatus()).toBe(ProductionJobStatus.RUNNING);

    const events = jobResult.value.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect((events[0] as ProductionStarted).recipeId).toBe('recipe_planks');
  });

  it('completes a job when elapsed time reaches duration', () => {
    const clock = new ManualClock(100);
    const jobResult = ProductionJob.create({
      id: requireProductionJobId('job_001'),
      buildingId: requireBuildingId('building_001'),
      companyId: requireCompanyId('company_001'),
      recipeId: requireRecipeId('recipe_planks'),
      duration: 10,
      clock,
    });

    expect(jobResult.ok).toBe(true);

    if (!jobResult.ok) {
      return;
    }

    jobResult.value.start(clock);
    jobResult.value.pullDomainEvents();
    clock.advance(10);

    const tickResult = jobResult.value.tick(clock);

    expect(tickResult.ok).toBe(true);

    if (tickResult.ok) {
      expect(tickResult.value.status).toBe('completed');
      expect(tickResult.value.progress).toBe(100);
    }

    expect(jobResult.value.getStatus()).toBe(ProductionJobStatus.FINISHED);

    const events = jobResult.value.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect((events[0] as ProductionCompleted).jobId).toBe('job_001');
  });

  it('scales progress by worker efficiency', () => {
    const clock = new ManualClock(100);
    const jobResult = ProductionJob.create({
      id: requireProductionJobId('job_001'),
      buildingId: requireBuildingId('building_001'),
      companyId: requireCompanyId('company_001'),
      recipeId: requireRecipeId('recipe_planks'),
      duration: 10,
      clock,
    });

    expect(jobResult.ok).toBe(true);

    if (!jobResult.ok) {
      return;
    }

    jobResult.value.start(clock);
    clock.advance(5);

    const tickResult = jobResult.value.tick(clock, { workerEfficiency: 0.5 });

    expect(tickResult.ok).toBe(true);

    if (tickResult.ok) {
      expect(tickResult.value.status).toBe('running');
      expect(tickResult.value.progress).toBe(25);
    }
  });

  it('does not advance progress when worker efficiency is zero', () => {
    const clock = new ManualClock(100);
    const jobResult = ProductionJob.create({
      id: requireProductionJobId('job_001'),
      buildingId: requireBuildingId('building_001'),
      companyId: requireCompanyId('company_001'),
      recipeId: requireRecipeId('recipe_planks'),
      duration: 10,
      clock,
    });

    expect(jobResult.ok).toBe(true);

    if (!jobResult.ok) {
      return;
    }

    jobResult.value.start(clock);
    clock.advance(10);

    const tickResult = jobResult.value.tick(clock, { workerEfficiency: 0 });

    expect(tickResult.ok).toBe(true);

    if (tickResult.ok) {
      expect(tickResult.value.progress).toBe(0);
    }
  });
});
