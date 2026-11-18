/**
 * @module @project-genesis/api/game/acceptance-s3-production-phase-readiness
 *
 * Pure predicates for S3 disposable RAM production-phase simulation admission.
 */

/** Building fields required for S3 production-phase gating. */
export type AcceptanceS3ProductionPhaseBuildingSlice = {
  readonly id: string;
  readonly buildingTypeId: string;
  readonly status: string;
};

/** Production job fields required for S3 production-phase gating. */
export type AcceptanceS3ProductionPhaseJobSlice = {
  readonly id: string;
  readonly buildingId: string;
  readonly recipeId: string;
  readonly status: string;
  readonly progress: number;
};

export type AcceptanceS3ProductionPhaseGameplayContext = {
  readonly buildings: readonly AcceptanceS3ProductionPhaseBuildingSlice[];
  readonly productionJobs: readonly AcceptanceS3ProductionPhaseJobSlice[];
};

export const ACCEPTANCE_S3_PRODUCTION_PHASE_SAWMILL_TYPE_ID = 'sawmill';
export const ACCEPTANCE_S3_PRODUCTION_PHASE_RECIPE_ID = 'recipe_planks';

const BUILDING_STATUS_UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION';
const BUILDING_STATUS_ACTIVE = 'ACTIVE';
const PRODUCTION_JOB_FINISHED = 'FINISHED';
const PRODUCTION_JOB_CANCELLED = 'CANCELLED';

export type AcceptanceS3ProductionPhasePrerequisiteFailureReason =
  | 'UNDER_CONSTRUCTION_BUILDING_PRESENT'
  | 'NO_ACTIVE_SAWMILL'
  | 'MULTIPLE_ACTIVE_SAWMILLS'
  | 'NO_RECIPE_PLANKS_JOB'
  | 'RECIPE_PLANKS_JOB_COMPLETED'
  | 'RECIPE_PLANKS_JOB_WRONG_BUILDING';

export type AcceptanceS3ProductionPhasePrerequisiteResult =
  | { readonly ok: true; readonly sawmillBuildingId: string; readonly productionJobId: string }
  | { readonly ok: false; readonly reason: AcceptanceS3ProductionPhasePrerequisiteFailureReason };

/**
 * Validates gameplay prerequisites before S3 production-phase simulation ticks are admitted.
 *
 * Requires a single ACTIVE sawmill and a non-completed `recipe_planks` job on that building.
 */
export function evaluateAcceptanceS3ProductionPhasePrerequisites(
  gameplay: AcceptanceS3ProductionPhaseGameplayContext,
): AcceptanceS3ProductionPhasePrerequisiteResult {
  const hasUnderConstruction = gameplay.buildings.some(
    (building) => building.status === BUILDING_STATUS_UNDER_CONSTRUCTION,
  );

  if (hasUnderConstruction) {
    return { ok: false, reason: 'UNDER_CONSTRUCTION_BUILDING_PRESENT' };
  }

  const activeSawmills = gameplay.buildings.filter(
    (building) =>
      building.buildingTypeId === ACCEPTANCE_S3_PRODUCTION_PHASE_SAWMILL_TYPE_ID &&
      building.status === BUILDING_STATUS_ACTIVE,
  );

  if (activeSawmills.length === 0) {
    return { ok: false, reason: 'NO_ACTIVE_SAWMILL' };
  }

  if (activeSawmills.length > 1) {
    return { ok: false, reason: 'MULTIPLE_ACTIVE_SAWMILLS' };
  }

  const sawmillBuildingId = activeSawmills[0]?.id;

  if (sawmillBuildingId === undefined) {
    return { ok: false, reason: 'NO_ACTIVE_SAWMILL' };
  }

  const matchingJobs = gameplay.productionJobs.filter(
    (job) => job.recipeId === ACCEPTANCE_S3_PRODUCTION_PHASE_RECIPE_ID,
  );

  if (matchingJobs.length === 0) {
    return { ok: false, reason: 'NO_RECIPE_PLANKS_JOB' };
  }

  const jobOnSawmill = matchingJobs.find((job) => job.buildingId === sawmillBuildingId);

  if (jobOnSawmill === undefined) {
    return { ok: false, reason: 'RECIPE_PLANKS_JOB_WRONG_BUILDING' };
  }

  if (
    jobOnSawmill.status === PRODUCTION_JOB_FINISHED ||
    jobOnSawmill.status === PRODUCTION_JOB_CANCELLED
  ) {
    return { ok: false, reason: 'RECIPE_PLANKS_JOB_COMPLETED' };
  }

  return {
    ok: true,
    sawmillBuildingId,
    productionJobId: jobOnSawmill.id,
  };
}