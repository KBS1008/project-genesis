/**
 * @module @project-genesis/api/game/acceptance-simulation-advance-guard.service
 */

import { ForbiddenException, Injectable } from '@nestjs/common';
import { resolveProjectPaths } from '../config/project-paths.js';
import {
  ACCEPTANCE_SIMULATION_ADVANCE_DENIED_CODE,
  AcceptanceSimulationAdvanceGuard,
  type AcceptanceSimulationAdvanceAuditSnapshot,
  type AcceptanceSimulationAdvanceReservationResult,
  createAcceptanceSimulationAdvanceGuard,
  PROJECT_GENESIS_ACCEPTANCE_S1_SIMULATION_ADVANCE_BUDGET_ENV,
  PROJECT_GENESIS_ACCEPTANCE_S2_SIMULATION_ADVANCE_BUDGET_ENV,
  PROJECT_GENESIS_ACCEPTANCE_S3_CONSTRUCTION_SIMULATION_ADVANCE_BUDGET_ENV,
  PROJECT_GENESIS_ACCEPTANCE_S3_PRODUCTION_SIMULATION_ADVANCE_BUDGET_ENV,
  type AcceptanceSimulationAdvanceSessionContext,
} from './acceptance-simulation-advance-guard.js';
import type { AcceptanceS3ProductionPhaseGameplayContext } from './acceptance-s3-production-phase-readiness.js';

/** Nest wrapper around {@link AcceptanceSimulationAdvanceGuard} for HTTP controllers. */
@Injectable()
export class AcceptanceSimulationAdvanceGuardService {
  readonly #guard: AcceptanceSimulationAdvanceGuard;

  constructor() {
    const paths = resolveProjectPaths(import.meta.url);

    this.#guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: paths.acceptanceSaveIsolation,
      budgetEnvRaw: process.env[PROJECT_GENESIS_ACCEPTANCE_S1_SIMULATION_ADVANCE_BUDGET_ENV],
      s2BudgetEnvRaw: process.env[PROJECT_GENESIS_ACCEPTANCE_S2_SIMULATION_ADVANCE_BUDGET_ENV],
      s3ConstructionBudgetEnvRaw:
        process.env[PROJECT_GENESIS_ACCEPTANCE_S3_CONSTRUCTION_SIMULATION_ADVANCE_BUDGET_ENV],
      s3ProductionBudgetEnvRaw:
        process.env[PROJECT_GENESIS_ACCEPTANCE_S3_PRODUCTION_SIMULATION_ADVANCE_BUDGET_ENV],
      projectRoot: paths.projectRoot,
      configuredSavePath: paths.savePath,
    });
  }

  /** Returns the synchronous reservation outcome (single admission attempt). */
  tryReserveSimulationAdvances(
    units: number,
    sessionContext?: AcceptanceSimulationAdvanceSessionContext,
    gameplayContext?: AcceptanceS3ProductionPhaseGameplayContext,
  ): AcceptanceSimulationAdvanceReservationResult {
    return this.#guard.reserve(units, sessionContext, gameplayContext);
  }

  /** Throws before simulation mutation when acceptance mode denies the reservation. */
  reserveSimulationAdvances(
    units: number,
    sessionContext?: AcceptanceSimulationAdvanceSessionContext,
    gameplayContext?: AcceptanceS3ProductionPhaseGameplayContext,
  ): void {
    const result = this.tryReserveSimulationAdvances(units, sessionContext, gameplayContext);

    if (!result.ok) {
      throw new ForbiddenException(ACCEPTANCE_SIMULATION_ADVANCE_DENIED_CODE);
    }
  }

  getAuditSnapshot(): AcceptanceSimulationAdvanceAuditSnapshot {
    return this.#guard.getAuditSnapshot();
  }
}
