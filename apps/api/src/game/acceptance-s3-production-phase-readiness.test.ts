import { describe, expect, it } from 'vitest';
import {
  ACCEPTANCE_S3_PRODUCTION_PHASE_RECIPE_ID,
  evaluateAcceptanceS3ProductionPhasePrerequisites,
  type AcceptanceS3ProductionPhaseGameplayContext,
} from './acceptance-s3-production-phase-readiness.js';

function baseGameplay(): AcceptanceS3ProductionPhaseGameplayContext {
  return {
    buildings: [
      {
        id: 'sawmill_1',
        buildingTypeId: 'sawmill',
        status: 'ACTIVE',
      },
    ],
    productionJobs: [
      {
        id: 'job_1',
        buildingId: 'sawmill_1',
        recipeId: ACCEPTANCE_S3_PRODUCTION_PHASE_RECIPE_ID,
        status: 'RUNNING',
        progress: 0,
      },
    ],
  };
}

describe('evaluateAcceptanceS3ProductionPhasePrerequisites', () => {
  it('accepts a single ACTIVE sawmill with a running recipe_planks job', () => {
    const result = evaluateAcceptanceS3ProductionPhasePrerequisites(baseGameplay());

    expect(result).toEqual({
      ok: true,
      sawmillBuildingId: 'sawmill_1',
      productionJobId: 'job_1',
    });
  });

  it('rejects when any building is still under construction', () => {
    const result = evaluateAcceptanceS3ProductionPhasePrerequisites({
      ...baseGameplay(),
      buildings: [
        ...baseGameplay().buildings,
        {
          id: 'hq_1',
          buildingTypeId: 'headquarters',
          status: 'UNDER_CONSTRUCTION',
        },
      ],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('UNDER_CONSTRUCTION_BUILDING_PRESENT');
    }
  });

  it('rejects when sawmill is missing or not ACTIVE', () => {
    const missing = evaluateAcceptanceS3ProductionPhasePrerequisites({
      buildings: [],
      productionJobs: baseGameplay().productionJobs,
    });
    expect(missing.ok).toBe(false);

    const underConstruction = evaluateAcceptanceS3ProductionPhasePrerequisites({
      buildings: [
        {
          id: 'sawmill_1',
          buildingTypeId: 'sawmill',
          status: 'UNDER_CONSTRUCTION',
        },
      ],
      productionJobs: baseGameplay().productionJobs,
    });
    expect(underConstruction.ok).toBe(false);
  });

  it('rejects completed or missing recipe_planks jobs', () => {
    const completed = evaluateAcceptanceS3ProductionPhasePrerequisites({
      ...baseGameplay(),
      productionJobs: [
        {
          ...baseGameplay().productionJobs[0]!,
          status: 'FINISHED',
        },
      ],
    });
    expect(completed.ok).toBe(false);

    const none = evaluateAcceptanceS3ProductionPhasePrerequisites({
      ...baseGameplay(),
      productionJobs: [],
    });
    expect(none.ok).toBe(false);
  });
});