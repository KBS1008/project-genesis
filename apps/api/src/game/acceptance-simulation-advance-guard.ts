/**
 * @module @project-genesis/api/game/acceptance-simulation-advance-guard
 *
 * Acceptance-isolated API processes only: default-deny simulation advancement budget.
 */

import { existsSync } from 'node:fs';
import { isDisposableRamAcceptanceCompanyName } from './acceptance-s3-ram-only-building-placement.js';
import {
  evaluateAcceptanceS3ProductionPhasePrerequisites,
  type AcceptanceS3ProductionPhaseGameplayContext,
} from './acceptance-s3-production-phase-readiness.js';
import {
  isS2DisposableResearchBrowserIsolationSavePath,
  pathsReferToSameSaveFile,
  resolveS2DisposableResearchBrowserIsolationSavePath,
} from '../config/save-path-config.js';

/** Server-private env key; set only by an explicitly authorized acceptance runtime task. */
export const PROJECT_GENESIS_ACCEPTANCE_S1_SIMULATION_ADVANCE_BUDGET_ENV =
  'PROJECT_GENESIS_ACCEPTANCE_S1_SIMULATION_ADVANCE_BUDGET';

/** Server-private S2 env key; effective only in acceptance save isolation when explicitly armed. */
export const PROJECT_GENESIS_ACCEPTANCE_S2_SIMULATION_ADVANCE_BUDGET_ENV =
  'PROJECT_GENESIS_ACCEPTANCE_S2_SIMULATION_ADVANCE_BUDGET';

/** Server-private S3 construction completion budget (disposable RAM acceptance only). */
export const PROJECT_GENESIS_ACCEPTANCE_S3_CONSTRUCTION_SIMULATION_ADVANCE_BUDGET_ENV =
  'PROJECT_GENESIS_ACCEPTANCE_S3_CONSTRUCTION_SIMULATION_ADVANCE_BUDGET';

/** Server-private S3 production-progress budget (disposable RAM acceptance only, phase-gated). */
export const PROJECT_GENESIS_ACCEPTANCE_S3_PRODUCTION_SIMULATION_ADVANCE_BUDGET_ENV =
  'PROJECT_GENESIS_ACCEPTANCE_S3_PRODUCTION_SIMULATION_ADVANCE_BUDGET';

/** Owner-approved ceiling for a single acceptance runtime session. */
export const ACCEPTANCE_SIMULATION_ADVANCE_BUDGET_MAX = 3;

/** Owner-approved ceiling for S2 isolated research acceptance (engine-advance units). */
export const ACCEPTANCE_S2_SIMULATION_ADVANCE_BUDGET_MAX = 60;

/** Owner-approved ceiling for S3 isolated construction completion (engine-advance units). */
export const ACCEPTANCE_S3_CONSTRUCTION_SIMULATION_ADVANCE_BUDGET_MAX = 540;

/** Owner-approved ceiling for S3 isolated production progress (engine-advance units). */
export const ACCEPTANCE_S3_PRODUCTION_SIMULATION_ADVANCE_BUDGET_MAX = 60;

/** Stable machine-readable rejection code for HTTP clients. */
export const ACCEPTANCE_SIMULATION_ADVANCE_DENIED_CODE = 'ACCEPTANCE_SIMULATION_ADVANCE_DENIED';

export type AcceptanceSimulationAdvanceGuardConfig = {
  readonly acceptanceSaveIsolation: boolean;
  /** S1 budget env raw (`PROJECT_GENESIS_ACCEPTANCE_S1_SIMULATION_ADVANCE_BUDGET`). */
  readonly budgetEnvRaw: string | undefined;
  /** S2 budget env raw (`PROJECT_GENESIS_ACCEPTANCE_S2_SIMULATION_ADVANCE_BUDGET`). */
  readonly s2BudgetEnvRaw?: string | undefined;
  /** S3 construction budget env raw. */
  readonly s3ConstructionBudgetEnvRaw?: string | undefined;
  /** S3 production-progress budget env raw (requires construction env). */
  readonly s3ProductionBudgetEnvRaw?: string | undefined;
  /** Monorepo root for S3 disposable fixture path binding. */
  readonly projectRoot?: string | undefined;
  /** Effective configured save path for S3 disposable fixture binding. */
  readonly configuredSavePath?: string | undefined;
};

/** Minimal session facts required for S3 construction budget admission. */
export type AcceptanceSimulationAdvanceSessionContext = {
  readonly hasActiveSession: boolean;
  readonly companyName: string | null;
  readonly savePath: string;
};

export type AcceptanceSimulationAdvanceBudgetTier = 's1' | 's2' | 's3';

export type AcceptanceSimulationAdvanceS3Submode = 'construction_only' | 'dual';

export type ResolvedAcceptanceSimulationAdvanceBudget =
  | { readonly kind: 'disarmed' }
  | {
      readonly kind: 'armed';
      readonly tier: 's1' | 's2';
      readonly maxBudget: number;
    }
  | {
      readonly kind: 'armed';
      readonly tier: 's3';
      readonly submode: 'construction_only';
      readonly maxBudget: number;
    }
  | {
      readonly kind: 'armed';
      readonly tier: 's3';
      readonly submode: 'dual';
      readonly maxConstructionBudget: number;
      readonly maxProductionBudget: number;
    };

export type AcceptanceSimulationAdvanceGuardMode = 'personal_bypass' | 'disarmed' | 'armed';

export type ParsedAcceptanceSimulationAdvanceBudget =
  | { readonly kind: 'disarmed' }
  | { readonly kind: 'armed'; readonly maxBudget: number };

export type AcceptanceSimulationAdvanceReservationResult =
  | {
      readonly ok: true;
      readonly mode: AcceptanceSimulationAdvanceGuardMode;
      readonly units: number;
      readonly admittedTotal: number;
      readonly remaining: number;
    }
  | {
      readonly ok: false;
      readonly mode: AcceptanceSimulationAdvanceGuardMode;
      readonly reason:
        | 'DISARMED'
        | 'BUDGET_EXHAUSTED'
        | 'INVALID_UNITS'
        | 'IDENTITY_DENIED'
        | 'FIXTURE_PRESENT'
        | 'PHASE_DENIED'
        | 'PREREQUISITE_DENIED';
      readonly attemptedUnits: number;
      readonly admittedTotal: number;
      readonly remaining: number;
    };

export type AcceptanceSimulationAdvanceAuditSnapshot = {
  readonly mode: AcceptanceSimulationAdvanceGuardMode;
  readonly maxBudget: number;
  readonly admittedTotal: number;
  readonly rejectedTotal: number;
  readonly remaining: number;
  readonly s3Phase?: 'construction' | 'production';
  readonly s3ConstructionAdmitted?: number;
  readonly s3ConstructionMax?: number;
  readonly s3ProductionAdmitted?: number;
  readonly s3ProductionMax?: number;
};

/**
 * Parses the private budget env. Missing/invalid/excessive values fail closed (disarmed).
 */
export function parseAcceptanceSimulationAdvanceBudgetEnv(
  raw: string | undefined,
): ParsedAcceptanceSimulationAdvanceBudget {
  if (raw === undefined || raw.trim() === '') {
    return { kind: 'disarmed' };
  }

  const trimmed = raw.trim();

  if (!/^-?\d+$/.test(trimmed)) {
    return { kind: 'disarmed' };
  }

  const parsed = Number(trimmed);

  if (
    !Number.isSafeInteger(parsed) ||
    parsed < 0 ||
    parsed > ACCEPTANCE_SIMULATION_ADVANCE_BUDGET_MAX
  ) {
    return { kind: 'disarmed' };
  }

  return { kind: 'armed', maxBudget: parsed };
}

function isBudgetEnvPresent(raw: string | undefined): boolean {
  return raw !== undefined && raw.trim() !== '';
}

/**
 * Parses the S2 private budget env. Missing/invalid/excessive values fail closed (disarmed).
 * Valid range is 1..60 inclusive (no zero budget arm).
 */
export function parseAcceptanceSimulationAdvanceS2BudgetEnv(
  raw: string | undefined,
): ParsedAcceptanceSimulationAdvanceBudget {
  if (raw === undefined || raw.trim() === '') {
    return { kind: 'disarmed' };
  }

  const trimmed = raw.trim();

  if (!/^-?\d+$/.test(trimmed)) {
    return { kind: 'disarmed' };
  }

  const parsed = Number(trimmed);

  if (
    !Number.isSafeInteger(parsed) ||
    parsed < 1 ||
    parsed > ACCEPTANCE_S2_SIMULATION_ADVANCE_BUDGET_MAX
  ) {
    return { kind: 'disarmed' };
  }

  return { kind: 'armed', maxBudget: parsed };
}

/**
 * Parses the S3 construction budget env. Missing/invalid/out-of-range values fail closed (disarmed).
 * Valid range is 1..540 inclusive.
 */
export function parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv(
  raw: string | undefined,
): ParsedAcceptanceSimulationAdvanceBudget {
  if (raw === undefined || raw.trim() === '') {
    return { kind: 'disarmed' };
  }

  const trimmed = raw.trim();

  if (!/^-?\d+$/.test(trimmed)) {
    return { kind: 'disarmed' };
  }

  const parsed = Number(trimmed);

  if (
    !Number.isSafeInteger(parsed) ||
    parsed < 1 ||
    parsed > ACCEPTANCE_S3_CONSTRUCTION_SIMULATION_ADVANCE_BUDGET_MAX
  ) {
    return { kind: 'disarmed' };
  }

  return { kind: 'armed', maxBudget: parsed };
}

/**
 * Parses the S3 production-progress budget env. Missing/invalid/out-of-range values fail closed.
 * Valid range is 1..60 inclusive.
 */
export function parseAcceptanceSimulationAdvanceS3ProductionBudgetEnv(
  raw: string | undefined,
): ParsedAcceptanceSimulationAdvanceBudget {
  if (raw === undefined || raw.trim() === '') {
    return { kind: 'disarmed' };
  }

  const trimmed = raw.trim();

  if (!/^-?\d+$/.test(trimmed)) {
    return { kind: 'disarmed' };
  }

  const parsed = Number(trimmed);

  if (
    !Number.isSafeInteger(parsed) ||
    parsed < 1 ||
    parsed > ACCEPTANCE_S3_PRODUCTION_SIMULATION_ADVANCE_BUDGET_MAX
  ) {
    return { kind: 'disarmed' };
  }

  return { kind: 'armed', maxBudget: parsed };
}

function countBudgetEnvsPresent(
  s1BudgetEnvRaw: string | undefined,
  s2BudgetEnvRaw: string | undefined,
  s3ConstructionBudgetEnvRaw: string | undefined,
  s3ProductionBudgetEnvRaw: string | undefined,
): number {
  let count = 0;

  if (isBudgetEnvPresent(s1BudgetEnvRaw)) {
    count += 1;
  }

  if (isBudgetEnvPresent(s2BudgetEnvRaw)) {
    count += 1;
  }

  const s3ConstructionPresent = isBudgetEnvPresent(s3ConstructionBudgetEnvRaw);
  const s3ProductionPresent = isBudgetEnvPresent(s3ProductionBudgetEnvRaw);

  if (s3ConstructionPresent && s3ProductionPresent) {
    count += 1;
  } else if (s3ConstructionPresent) {
    count += 1;
  } else if (s3ProductionPresent) {
    count += 1;
  }

  return count;
}

/**
 * Resolves armed/disarmed acceptance mode from S1/S2/S3 env (acceptance isolation only).
 *
 * - More than one budget env present → fail closed (disarmed).
 * - S3 present (even invalid) → parse S3 only; invalid → disarmed (no fallback).
 * - Else S2 present → parse S2 only.
 * - Else legacy S1 parse semantics.
 */
export function resolveAcceptanceSimulationAdvanceBudget(
  s1BudgetEnvRaw: string | undefined,
  s2BudgetEnvRaw: string | undefined,
  s3ConstructionBudgetEnvRaw: string | undefined = undefined,
  s3ProductionBudgetEnvRaw: string | undefined = undefined,
): ResolvedAcceptanceSimulationAdvanceBudget {
  if (
    countBudgetEnvsPresent(
      s1BudgetEnvRaw,
      s2BudgetEnvRaw,
      s3ConstructionBudgetEnvRaw,
      s3ProductionBudgetEnvRaw,
    ) > 1
  ) {
    return { kind: 'disarmed' };
  }

  if (isBudgetEnvPresent(s3ConstructionBudgetEnvRaw)) {
    const parsedConstruction = parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv(
      s3ConstructionBudgetEnvRaw,
    );

    if (parsedConstruction.kind === 'disarmed') {
      return { kind: 'disarmed' };
    }

    if (isBudgetEnvPresent(s3ProductionBudgetEnvRaw)) {
      const parsedProduction = parseAcceptanceSimulationAdvanceS3ProductionBudgetEnv(
        s3ProductionBudgetEnvRaw,
      );

      if (parsedProduction.kind === 'disarmed') {
        return { kind: 'disarmed' };
      }

      return {
        kind: 'armed',
        tier: 's3',
        submode: 'dual',
        maxConstructionBudget: parsedConstruction.maxBudget,
        maxProductionBudget: parsedProduction.maxBudget,
      };
    }

    return {
      kind: 'armed',
      tier: 's3',
      submode: 'construction_only',
      maxBudget: parsedConstruction.maxBudget,
    };
  }

  if (isBudgetEnvPresent(s3ProductionBudgetEnvRaw)) {
    return { kind: 'disarmed' };
  }

  if (isBudgetEnvPresent(s2BudgetEnvRaw)) {
    const parsed = parseAcceptanceSimulationAdvanceS2BudgetEnv(s2BudgetEnvRaw);

    if (parsed.kind === 'disarmed') {
      return { kind: 'disarmed' };
    }

    return { kind: 'armed', tier: 's2', maxBudget: parsed.maxBudget };
  }

  const parsed = parseAcceptanceSimulationAdvanceBudgetEnv(s1BudgetEnvRaw);

  if (parsed.kind === 'disarmed') {
    return { kind: 'disarmed' };
  }

  return { kind: 'armed', tier: 's1', maxBudget: parsed.maxBudget };
}

/** In-process, synchronous admission counter for tick/step advancement attempts. */
export class AcceptanceSimulationAdvanceGuard {
  readonly #mode: AcceptanceSimulationAdvanceGuardMode;
  readonly #maxBudget: number;
  readonly #budgetTier: AcceptanceSimulationAdvanceBudgetTier | 'none';
  readonly #s3Submode: AcceptanceSimulationAdvanceS3Submode | 'none';
  readonly #s3ConstructionMax: number;
  readonly #s3ProductionMax: number;
  readonly #projectRoot: string | undefined;
  readonly #configuredSavePath: string | undefined;
  #admittedTotal = 0;
  #s3ConstructionAdmitted = 0;
  #s3ProductionAdmitted = 0;
  #rejectedTotal = 0;

  constructor(config: AcceptanceSimulationAdvanceGuardConfig) {
    if (!config.acceptanceSaveIsolation) {
      this.#mode = 'personal_bypass';
      this.#maxBudget = Number.POSITIVE_INFINITY;
      this.#budgetTier = 'none';
      this.#s3Submode = 'none';
      this.#s3ConstructionMax = 0;
      this.#s3ProductionMax = 0;
      this.#projectRoot = undefined;
      this.#configuredSavePath = undefined;
      return;
    }

    const parsed = resolveAcceptanceSimulationAdvanceBudget(
      config.budgetEnvRaw,
      config.s2BudgetEnvRaw,
      config.s3ConstructionBudgetEnvRaw,
      config.s3ProductionBudgetEnvRaw,
    );

    this.#projectRoot = config.projectRoot;
    this.#configuredSavePath = config.configuredSavePath;
    this.#s3Submode = 'none';
    this.#s3ConstructionMax = 0;
    this.#s3ProductionMax = 0;

    if (parsed.kind === 'disarmed') {
      this.#mode = 'disarmed';
      this.#maxBudget = 0;
      this.#budgetTier = 'none';
      return;
    }

    if (parsed.tier === 's3') {
      const projectRoot = config.projectRoot;
      const configuredSavePath = config.configuredSavePath;

      if (
        projectRoot === undefined ||
        configuredSavePath === undefined ||
        !isS3ConstructionSavePathBinding(projectRoot, configuredSavePath)
      ) {
        this.#mode = 'disarmed';
        this.#maxBudget = 0;
        this.#budgetTier = 'none';
        return;
      }

      this.#mode = 'armed';
      this.#budgetTier = 's3';
      this.#s3Submode = parsed.submode;

      if (parsed.submode === 'construction_only') {
        this.#maxBudget = parsed.maxBudget;
        this.#s3ConstructionMax = parsed.maxBudget;
      } else {
        this.#s3ConstructionMax = parsed.maxConstructionBudget;
        this.#s3ProductionMax = parsed.maxProductionBudget;
        this.#maxBudget = parsed.maxConstructionBudget;
      }

      return;
    }

    this.#mode = 'armed';
    this.#maxBudget = parsed.maxBudget;
    this.#budgetTier = parsed.tier;
    this.#s3Submode = 'none';
  }

  get mode(): AcceptanceSimulationAdvanceGuardMode {
    return this.#mode;
  }

  get maxBudget(): number {
    return this.#maxBudget;
  }

  get budgetTier(): AcceptanceSimulationAdvanceBudgetTier | 'none' {
    return this.#budgetTier;
  }

  get s3Submode(): AcceptanceSimulationAdvanceS3Submode | 'none' {
    return this.#s3Submode;
  }

  #currentS3Phase(): 'construction' | 'production' | null {
    if (this.#budgetTier !== 's3') {
      return null;
    }

    if (this.#s3Submode === 'construction_only') {
      return 'construction';
    }

    if (this.#s3Submode === 'dual') {
      return this.#s3ConstructionAdmitted >= this.#s3ConstructionMax ? 'production' : 'construction';
    }

    return null;
  }

  #currentAdmittedTotalForAudit(): number {
    if (this.#budgetTier === 's3' && this.#s3Submode === 'dual') {
      return this.#currentS3Phase() === 'production'
        ? this.#s3ProductionAdmitted
        : this.#s3ConstructionAdmitted;
    }

    return this.#admittedTotal;
  }

  #currentMaxBudgetForAudit(): number {
    if (this.#budgetTier === 's3' && this.#s3Submode === 'dual') {
      return this.#currentS3Phase() === 'production'
        ? this.#s3ProductionMax
        : this.#s3ConstructionMax;
    }

    return this.#maxBudget;
  }

  #currentRemainingForAudit(): number {
    if (this.#mode === 'personal_bypass') {
      return Number.POSITIVE_INFINITY;
    }

    const max = this.#currentMaxBudgetForAudit();
    const admitted = this.#currentAdmittedTotalForAudit();

    return Math.max(0, max - admitted);
  }

  /**
   * Reserves {@link units} advancement permits synchronously (counts admitted attempts).
   * S3 budgets require {@link sessionContext} at admission time.
   */
  reserve(
    units: number,
    sessionContext?: AcceptanceSimulationAdvanceSessionContext,
    gameplayContext?: AcceptanceS3ProductionPhaseGameplayContext,
  ): AcceptanceSimulationAdvanceReservationResult {

    if (this.#mode === 'personal_bypass') {
      return {
        ok: true,
        mode: this.#mode,
        units,
        admittedTotal: this.#admittedTotal,
        remaining: Number.POSITIVE_INFINITY,
      };
    }

    if (!Number.isInteger(units) || units < 1) {
      this.#rejectedTotal += 1;
      return {
        ok: false,
        mode: this.#mode,
        reason: 'INVALID_UNITS',
        attemptedUnits: units,
        admittedTotal: this.#currentAdmittedTotalForAudit(),
        remaining: this.#currentRemainingForAudit(),
      };
    }

    if (this.#budgetTier === 's3') {
      if (
        sessionContext === undefined ||
        this.#projectRoot === undefined ||
        this.#configuredSavePath === undefined ||
        !isAcceptanceS3ConstructionSimulationSessionIdentity(
          sessionContext,
          this.#projectRoot,
          this.#configuredSavePath,
        )
      ) {
        this.#rejectedTotal += 1;
        return {
          ok: false,
          mode: this.#mode,
          reason: 'IDENTITY_DENIED',
          attemptedUnits: units,
          admittedTotal: this.#currentAdmittedTotalForAudit(),
          remaining: this.#currentRemainingForAudit(),
        };
      }

      const fixturePath = resolveS2DisposableResearchBrowserIsolationSavePath(this.#projectRoot);

      if (existsSync(fixturePath)) {
        this.#rejectedTotal += 1;
        return {
          ok: false,
          mode: this.#mode,
          reason: 'FIXTURE_PRESENT',
          attemptedUnits: units,
          admittedTotal: this.#currentAdmittedTotalForAudit(),
          remaining: this.#currentRemainingForAudit(),
        };
      }
    }

    if (this.#budgetTier === 's3' && this.#s3Submode === 'dual') {
      return this.#reserveS3DualPhase(units, gameplayContext);
    }

  const remainingBefore = Math.max(0, this.#maxBudget - this.#admittedTotal);

    if (this.#mode === 'disarmed' || this.#admittedTotal + units > this.#maxBudget) {
      this.#rejectedTotal += 1;
      return {
        ok: false,
        mode: this.#mode,
        reason: this.#mode === 'disarmed' ? 'DISARMED' : 'BUDGET_EXHAUSTED',
        attemptedUnits: units,
        admittedTotal: this.#admittedTotal,
        remaining: remainingBefore,
      };
    }

    this.#admittedTotal += units;

    if (this.#budgetTier === 's3') {
      this.#s3ConstructionAdmitted = this.#admittedTotal;
    }

    return {
      ok: true,
      mode: this.#mode,
      units,
      admittedTotal: this.#admittedTotal,
      remaining: Math.max(0, this.#maxBudget - this.#admittedTotal),
    };
  }

  #reserveS3DualPhase(
    units: number,
    gameplayContext: AcceptanceS3ProductionPhaseGameplayContext | undefined,
  ): AcceptanceSimulationAdvanceReservationResult {
    const phase = this.#currentS3Phase();

    if (phase === 'construction') {
      const remainingBefore = Math.max(0, this.#s3ConstructionMax - this.#s3ConstructionAdmitted);

      if (this.#s3ConstructionAdmitted + units > this.#s3ConstructionMax) {
        this.#rejectedTotal += 1;
        return {
          ok: false,
          mode: this.#mode,
          reason: 'BUDGET_EXHAUSTED',
          attemptedUnits: units,
          admittedTotal: this.#s3ConstructionAdmitted,
          remaining: remainingBefore,
        };
      }

      this.#s3ConstructionAdmitted += units;
      this.#admittedTotal = this.#s3ConstructionAdmitted;

      return {
        ok: true,
        mode: this.#mode,
        units,
        admittedTotal: this.#s3ConstructionAdmitted,
        remaining: Math.max(0, this.#s3ConstructionMax - this.#s3ConstructionAdmitted),
      };
    }

    if (gameplayContext === undefined) {
      this.#rejectedTotal += 1;
      return {
        ok: false,
        mode: this.#mode,
        reason: 'PREREQUISITE_DENIED',
        attemptedUnits: units,
        admittedTotal: this.#s3ProductionAdmitted,
        remaining: Math.max(0, this.#s3ProductionMax - this.#s3ProductionAdmitted),
      };
    }

    const prerequisites = evaluateAcceptanceS3ProductionPhasePrerequisites(gameplayContext);

    if (!prerequisites.ok) {
      this.#rejectedTotal += 1;
      return {
        ok: false,
        mode: this.#mode,
        reason: 'PREREQUISITE_DENIED',
        attemptedUnits: units,
        admittedTotal: this.#s3ProductionAdmitted,
        remaining: Math.max(0, this.#s3ProductionMax - this.#s3ProductionAdmitted),
      };
    }

    const remainingBefore = Math.max(0, this.#s3ProductionMax - this.#s3ProductionAdmitted);

    if (this.#s3ProductionAdmitted + units > this.#s3ProductionMax) {
      this.#rejectedTotal += 1;
      return {
        ok: false,
        mode: this.#mode,
        reason: 'BUDGET_EXHAUSTED',
        attemptedUnits: units,
        admittedTotal: this.#s3ProductionAdmitted,
        remaining: remainingBefore,
      };
    }

    this.#s3ProductionAdmitted += units;

    return {
      ok: true,
      mode: this.#mode,
      units,
      admittedTotal: this.#s3ProductionAdmitted,
      remaining: Math.max(0, this.#s3ProductionMax - this.#s3ProductionAdmitted),
    };
  }

  getAuditSnapshot(): AcceptanceSimulationAdvanceAuditSnapshot {
    const remaining = this.#currentRemainingForAudit();

    const base: AcceptanceSimulationAdvanceAuditSnapshot = {
      mode: this.#mode,
      maxBudget:
        this.#mode === 'personal_bypass' ? Number.POSITIVE_INFINITY : this.#currentMaxBudgetForAudit(),
      admittedTotal: this.#currentAdmittedTotalForAudit(),
      rejectedTotal: this.#rejectedTotal,
      remaining,
    };

    if (this.#budgetTier === 's3') {
      const phase = this.#currentS3Phase();

      return {
        ...base,
        ...(phase === null ? {} : { s3Phase: phase }),
        s3ConstructionAdmitted: this.#s3ConstructionAdmitted,
        s3ConstructionMax: this.#s3ConstructionMax,
        ...(this.#s3Submode === 'dual'
          ? {
              s3ProductionAdmitted: this.#s3ProductionAdmitted,
              s3ProductionMax: this.#s3ProductionMax,
            }
          : {}),
      };
    }

    return base;
  }
}

export function createAcceptanceSimulationAdvanceGuard(
  config: AcceptanceSimulationAdvanceGuardConfig,
): AcceptanceSimulationAdvanceGuard {
  return new AcceptanceSimulationAdvanceGuard(config);
}

/** True when the API save path is bound to the approved absent S2 disposable fixture. */
export function isS3ConstructionSavePathBinding(
  projectRoot: string,
  configuredSavePath: string,
): boolean {
  return isS2DisposableResearchBrowserIsolationSavePath(projectRoot, configuredSavePath);
}

/**
 * Server-side S3 disposable RAM session identity (company name + savePath binding).
 * Does not trust client headers or request fields beyond the active session read model.
 */
export function isAcceptanceS3ConstructionSimulationSessionIdentity(
  session: AcceptanceSimulationAdvanceSessionContext,
  projectRoot: string,
  configuredSavePath: string,
): boolean {
  if (!session.hasActiveSession) {
    return false;
  }

  if (!isDisposableRamAcceptanceCompanyName(session.companyName)) {
    return false;
  }

  if (!pathsReferToSameSaveFile(session.savePath, configuredSavePath)) {
    return false;
  }

  return isS3ConstructionSavePathBinding(projectRoot, configuredSavePath);
}

/**
 * LIMITATION: This guard counts engine-advance units only. It cannot prove ticks
 * were consumed exclusively for building construction or sawmill production rather than
 * other simulation systems. Future execution gates must verify building/job state and stop
 * when positive production progress is observed.
 */
