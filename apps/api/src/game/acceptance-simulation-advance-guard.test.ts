import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ForbiddenException } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveS2DisposableResearchBrowserIsolationSavePath } from '../config/save-path-config.js';
import {
  ACCEPTANCE_S2_SIMULATION_ADVANCE_BUDGET_MAX,
  ACCEPTANCE_S3_CONSTRUCTION_SIMULATION_ADVANCE_BUDGET_MAX,
  ACCEPTANCE_S3_PRODUCTION_SIMULATION_ADVANCE_BUDGET_MAX,
  ACCEPTANCE_SIMULATION_ADVANCE_BUDGET_MAX,
  ACCEPTANCE_SIMULATION_ADVANCE_DENIED_CODE,
  AcceptanceSimulationAdvanceGuard,
  createAcceptanceSimulationAdvanceGuard,
  isAcceptanceS3ConstructionSimulationSessionIdentity,
  parseAcceptanceSimulationAdvanceBudgetEnv,
  parseAcceptanceSimulationAdvanceS2BudgetEnv,
  parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv,
  parseAcceptanceSimulationAdvanceS3ProductionBudgetEnv,
  PROJECT_GENESIS_ACCEPTANCE_S3_PRODUCTION_SIMULATION_ADVANCE_BUDGET_ENV,
  resolveAcceptanceSimulationAdvanceBudget,
  type AcceptanceSimulationAdvanceSessionContext,
} from './acceptance-simulation-advance-guard.js';
import {
  ACCEPTANCE_S3_PRODUCTION_PHASE_RECIPE_ID,
  type AcceptanceS3ProductionPhaseGameplayContext,
} from './acceptance-s3-production-phase-readiness.js';
import { GameController } from './game.controller.js';

const tempRoots: string[] = [];

afterEach(() => {
  for (const directory of tempRoots.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

function createTempProjectRoot(): string {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'pg-s3-guard-'));
  tempRoots.push(directory);
  mkdirSync(path.join(directory, 'saves', 'acceptance', 'disposable-warning-fixtures'), {
    recursive: true,
  });
  return directory;
}

function s3SessionContext(projectRoot: string): AcceptanceSimulationAdvanceSessionContext {
  const savePath = resolveS2DisposableResearchBrowserIsolationSavePath(projectRoot);

  return {
    hasActiveSession: true,
    companyName: 'S3-G-Disposable-RAM-2026-11-15',
    savePath,
  };
}

function validS3ProductionGameplay(): AcceptanceS3ProductionPhaseGameplayContext {
  return {
    buildings: [
      {
        id: 'building_sawmill',
        buildingTypeId: 'sawmill',
        status: 'ACTIVE',
      },
    ],
    productionJobs: [
      {
        id: 'production_001',
        buildingId: 'building_sawmill',
        recipeId: ACCEPTANCE_S3_PRODUCTION_PHASE_RECIPE_ID,
        status: 'RUNNING',
        progress: 0,
      },
    ],
  };
}

function createDualS3Guard(projectRoot: string, construction = '120', production = '10') {
  const savePath = resolveS2DisposableResearchBrowserIsolationSavePath(projectRoot);

  return createAcceptanceSimulationAdvanceGuard({
    acceptanceSaveIsolation: true,
    budgetEnvRaw: undefined,
    s2BudgetEnvRaw: undefined,
    s3ConstructionBudgetEnvRaw: construction,
    s3ProductionBudgetEnvRaw: production,
    projectRoot,
    configuredSavePath: savePath,
  });
}

describe('parseAcceptanceSimulationAdvanceBudgetEnv', () => {
  it('treats missing or blank env as disarmed', () => {
    expect(parseAcceptanceSimulationAdvanceBudgetEnv(undefined)).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceBudgetEnv('')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceBudgetEnv('   ')).toEqual({ kind: 'disarmed' });
  });

  it('accepts integer budgets 0 through max only', () => {
    expect(parseAcceptanceSimulationAdvanceBudgetEnv('0')).toEqual({
      kind: 'armed',
      maxBudget: 0,
    });
    expect(parseAcceptanceSimulationAdvanceBudgetEnv('3')).toEqual({
      kind: 'armed',
      maxBudget: 3,
    });
  });

  it('fails closed on malformed or excessive budgets', () => {
    expect(parseAcceptanceSimulationAdvanceBudgetEnv('3.5')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceBudgetEnv('-1')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceBudgetEnv('4')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceBudgetEnv('NaN')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceBudgetEnv('999')).toEqual({ kind: 'disarmed' });
  });
});

describe('AcceptanceSimulationAdvanceGuard', () => {
  it('bypasses reservations in personal (non-acceptance) mode', () => {
    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: false,
      budgetEnvRaw: undefined,
    });

    expect(guard.mode).toBe('personal_bypass');
    expect(guard.reserve(100).ok).toBe(true);
    expect(guard.getAuditSnapshot().admittedTotal).toBe(0);
  });

  it('rejects tick and step attempts while disarmed', () => {
    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: undefined,
    });

    const tickAttempt = guard.reserve(1);
    const stepAttempt = guard.reserve(1);

    expect(tickAttempt.ok).toBe(false);
    expect(stepAttempt.ok).toBe(false);

    if (!tickAttempt.ok) {
      expect(tickAttempt.reason).toBe('DISARMED');
    }
  });

  it('rejects armed budget zero', () => {
    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: '0',
    });

    expect(guard.mode).toBe('armed');
    expect(guard.maxBudget).toBe(0);
    expect(guard.reserve(1).ok).toBe(false);
  });

  it('admits up to configured budget and blocks the next attempt', () => {
    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: '3',
    });

    expect(guard.reserve(1).ok).toBe(true);
    expect(guard.reserve(1).ok).toBe(true);
    expect(guard.reserve(1).ok).toBe(true);

    const fourth = guard.reserve(1);
    expect(fourth.ok).toBe(false);
    if (!fourth.ok) {
      expect(fourth.reason).toBe('BUDGET_EXHAUSTED');
    }
  });

  it('shares one counter between tick batches and step reservations', () => {
    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: '2',
    });

    expect(guard.reserve(1).ok).toBe(true);
    expect(guard.reserve(1).ok).toBe(true);
    expect(guard.reserve(1).ok).toBe(false);
  });

  it('reserves multi-tick counts atomically', () => {
    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: '3',
    });

    expect(guard.reserve(2).ok).toBe(true);
    expect(guard.reserve(2).ok).toBe(false);
  });

  it('defaults new guard instances to disarmed acceptance mode', () => {
    const first = new AcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: '3',
    });
    first.reserve(3);

    const restarted = new AcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: '3',
    });

    expect(restarted.mode).toBe('armed');
    expect(restarted.reserve(1).ok).toBe(true);
  });

  it('allows at most one concurrent reservation when one permit remains', async () => {
    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: '1',
    });

    const results = await Promise.all(
      Array.from({ length: 32 }, () =>
        Promise.resolve().then(() => guard.reserve(1)),
      ),
    );

    const admitted = results.filter((result) => result.ok).length;
    expect(admitted).toBe(1);
    expect(guard.getAuditSnapshot().admittedTotal).toBe(1);
  });

  it('does not enlarge budget through repeated parse attempts', () => {
    expect(ACCEPTANCE_SIMULATION_ADVANCE_BUDGET_MAX).toBe(3);
    expect(parseAcceptanceSimulationAdvanceBudgetEnv('3').kind).toBe('armed');
    expect(parseAcceptanceSimulationAdvanceBudgetEnv('3.0').kind).toBe('disarmed');
  });
});

describe('parseAcceptanceSimulationAdvanceS2BudgetEnv', () => {
  it('treats missing or blank S2 env as disarmed', () => {
    expect(parseAcceptanceSimulationAdvanceS2BudgetEnv(undefined)).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceS2BudgetEnv('')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceS2BudgetEnv('   ')).toEqual({ kind: 'disarmed' });
  });

  it('accepts integer budgets 1 through 60 only', () => {
    expect(parseAcceptanceSimulationAdvanceS2BudgetEnv('1')).toEqual({
      kind: 'armed',
      maxBudget: 1,
    });
    expect(parseAcceptanceSimulationAdvanceS2BudgetEnv('60')).toEqual({
      kind: 'armed',
      maxBudget: 60,
    });
    expect(parseAcceptanceSimulationAdvanceS2BudgetEnv(' 50 ')).toEqual({
      kind: 'armed',
      maxBudget: 50,
    });
  });

  it('fails closed on malformed or out-of-range S2 budgets', () => {
    expect(parseAcceptanceSimulationAdvanceS2BudgetEnv('0')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceS2BudgetEnv('-1')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceS2BudgetEnv('61')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceS2BudgetEnv('999')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceS2BudgetEnv('3.5')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceS2BudgetEnv('60garbage')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceS2BudgetEnv('NaN')).toEqual({ kind: 'disarmed' });
  });
});

describe('resolveAcceptanceSimulationAdvanceBudget', () => {
  it('keeps legacy S1 semantics when S2 env is absent', () => {
    expect(resolveAcceptanceSimulationAdvanceBudget(undefined, undefined)).toEqual({
      kind: 'disarmed',
    });
    expect(resolveAcceptanceSimulationAdvanceBudget('3', undefined)).toEqual({
      kind: 'armed',
      maxBudget: 3,
      tier: 's1',
    });
    expect(resolveAcceptanceSimulationAdvanceBudget('4', undefined)).toEqual({ kind: 'disarmed' });
  });

  it('arms S2 budget when only S2 env is present and valid', () => {
    expect(resolveAcceptanceSimulationAdvanceBudget(undefined, '60')).toEqual({
      kind: 'armed',
      maxBudget: 60,
      tier: 's2',
    });
  });

  it('fails closed when both S1 and S2 env are present', () => {
    expect(resolveAcceptanceSimulationAdvanceBudget('3', '60')).toEqual({ kind: 'disarmed' });
  });

  it('fails closed on present but invalid S2 without falling back to S1', () => {
    expect(resolveAcceptanceSimulationAdvanceBudget('3', '0')).toEqual({ kind: 'disarmed' });
    expect(resolveAcceptanceSimulationAdvanceBudget(undefined, '0')).toEqual({ kind: 'disarmed' });
    expect(resolveAcceptanceSimulationAdvanceBudget('3', 'junk')).toEqual({ kind: 'disarmed' });
  });

  it('fails closed when S3 env conflicts with S1 or S2', () => {
    expect(resolveAcceptanceSimulationAdvanceBudget('3', undefined, '120')).toEqual({
      kind: 'disarmed',
    });
    expect(resolveAcceptanceSimulationAdvanceBudget(undefined, '60', '120')).toEqual({
      kind: 'disarmed',
    });
    expect(resolveAcceptanceSimulationAdvanceBudget('3', '60', '120')).toEqual({ kind: 'disarmed' });
    expect(resolveAcceptanceSimulationAdvanceBudget('3', undefined, '120', '60')).toEqual({
      kind: 'disarmed',
    });
  });

  it('arms S3 dual mode only when construction and production env are both valid', () => {
    expect(resolveAcceptanceSimulationAdvanceBudget(undefined, undefined, '120', '60')).toEqual({
      kind: 'armed',
      tier: 's3',
      submode: 'dual',
      maxConstructionBudget: 120,
      maxProductionBudget: 60,
    });
    expect(resolveAcceptanceSimulationAdvanceBudget(undefined, undefined, '120', '61')).toEqual({
      kind: 'disarmed',
    });
    expect(resolveAcceptanceSimulationAdvanceBudget(undefined, undefined, undefined, '60')).toEqual({
      kind: 'disarmed',
    });
  });
});

describe('parseAcceptanceSimulationAdvanceS3ProductionBudgetEnv', () => {
  it('treats missing production env as disarmed', () => {
    expect(parseAcceptanceSimulationAdvanceS3ProductionBudgetEnv(undefined)).toEqual({
      kind: 'disarmed',
    });
  });

  it('accepts 1 and 60 only', () => {
    expect(parseAcceptanceSimulationAdvanceS3ProductionBudgetEnv('1')).toEqual({
      kind: 'armed',
      maxBudget: 1,
    });
    expect(parseAcceptanceSimulationAdvanceS3ProductionBudgetEnv('60')).toEqual({
      kind: 'armed',
      maxBudget: 60,
    });
    expect(parseAcceptanceSimulationAdvanceS3ProductionBudgetEnv(' 45 ')).toEqual({
      kind: 'armed',
      maxBudget: 45,
    });
  });

  it('fails closed on invalid production budgets', () => {
    expect(parseAcceptanceSimulationAdvanceS3ProductionBudgetEnv('0')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceS3ProductionBudgetEnv('61')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceS3ProductionBudgetEnv('-2')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceS3ProductionBudgetEnv('3.0')).toEqual({ kind: 'disarmed' });
  });

  it('documents production env key and ceiling', () => {
    expect(PROJECT_GENESIS_ACCEPTANCE_S3_PRODUCTION_SIMULATION_ADVANCE_BUDGET_ENV).toBe(
      'PROJECT_GENESIS_ACCEPTANCE_S3_PRODUCTION_SIMULATION_ADVANCE_BUDGET',
    );
    expect(ACCEPTANCE_S3_PRODUCTION_SIMULATION_ADVANCE_BUDGET_MAX).toBe(60);
  });
});

describe('parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv', () => {
  it('treats missing or blank S3 env as disarmed', () => {
    expect(parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv(undefined)).toEqual({
      kind: 'disarmed',
    });
    expect(parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv('   ')).toEqual({ kind: 'disarmed' });
  });

  it('accepts integer budgets 1 through the S3 construction ceiling only', () => {
    expect(parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv('1')).toEqual({
      kind: 'armed',
      maxBudget: 1,
    });
    expect(parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv('120')).toEqual({
      kind: 'armed',
      maxBudget: 120,
    });
    expect(parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv(' 119 ')).toEqual({
      kind: 'armed',
      maxBudget: 119,
    });
    expect(parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv('360')).toEqual({
      kind: 'armed',
      maxBudget: 360,
    });
    expect(parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv(' 359 ')).toEqual({
      kind: 'armed',
      maxBudget: 359,
    });
    expect(parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv('539')).toEqual({
      kind: 'armed',
      maxBudget: 539,
    });
    expect(parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv('540')).toEqual({
      kind: 'armed',
      maxBudget: 540,
    });
    expect(parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv(' 539 ')).toEqual({
      kind: 'armed',
      maxBudget: 539,
    });
  });

  it('fails closed on invalid S3 budgets', () => {
    expect(parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv('0')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv('541')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv('-1')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv('3.5')).toEqual({ kind: 'disarmed' });
    expect(parseAcceptanceSimulationAdvanceS3ConstructionBudgetEnv('120garbage')).toEqual({
      kind: 'disarmed',
    });
  });
});

describe('AcceptanceSimulationAdvanceGuard S3 construction mode', () => {
  it('arms only with S2 save-path binding and valid S3 env', () => {
    const root = createTempProjectRoot();
    const savePath = resolveS2DisposableResearchBrowserIsolationSavePath(root);
    const session = s3SessionContext(root);

    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: undefined,
      s2BudgetEnvRaw: undefined,
      s3ConstructionBudgetEnvRaw: '120',
      projectRoot: root,
      configuredSavePath: savePath,
    });

    expect(guard.mode).toBe('armed');
    expect(guard.maxBudget).toBe(120);
    expect(guard.budgetTier).toBe('s3');
    expect(guard.reserve(119, session).ok).toBe(true);
    expect(guard.reserve(1, session).ok).toBe(true);
    const overrun = guard.reserve(1, session);
    expect(overrun.ok).toBe(false);
    if (!overrun.ok) {
      expect(overrun.reason).toBe('BUDGET_EXHAUSTED');
    }
  });

  it('admits a single count:120 reservation as 120 engine units', () => {
    const root = createTempProjectRoot();
    const savePath = resolveS2DisposableResearchBrowserIsolationSavePath(root);
    const session = s3SessionContext(root);

    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      s3ConstructionBudgetEnvRaw: '120',
      budgetEnvRaw: undefined,
      projectRoot: root,
      configuredSavePath: savePath,
    });

    const batch = guard.reserve(120, session);
    expect(batch.ok).toBe(true);
    if (batch.ok) {
      expect(batch.admittedTotal).toBe(120);
      expect(batch.remaining).toBe(0);
    }

    expect(guard.reserve(1, session).ok).toBe(false);
  });

  it('disarms S3 when save path is not the approved S2 fixture', () => {
    const root = createTempProjectRoot();
    const wrongSave = path.join(root, 'saves', 'acceptance', 's1-notification-relevance.json');

    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      s3ConstructionBudgetEnvRaw: '120',
      budgetEnvRaw: undefined,
      projectRoot: root,
      configuredSavePath: wrongSave,
    });

    expect(guard.mode).toBe('disarmed');
    expect(guard.reserve(1, s3SessionContext(root)).ok).toBe(false);
  });

  it('denies S3 reservations without matching session identity', () => {
    const root = createTempProjectRoot();
    const savePath = resolveS2DisposableResearchBrowserIsolationSavePath(root);

    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      s3ConstructionBudgetEnvRaw: '120',
      budgetEnvRaw: undefined,
      projectRoot: root,
      configuredSavePath: savePath,
    });

    const denied = guard.reserve(1);
    expect(denied.ok).toBe(false);
    if (!denied.ok) {
      expect(denied.reason).toBe('IDENTITY_DENIED');
      expect(denied.admittedTotal).toBe(0);
    }

    const spoofed = guard.reserve(1, {
      hasActiveSession: true,
      companyName: 'Not-Disposable-RAM',
      savePath,
    });
    expect(spoofed.ok).toBe(false);
    if (!spoofed.ok) {
      expect(spoofed.reason).toBe('IDENTITY_DENIED');
    }
  });

  it('ignores S3 env in personal bypass mode', () => {
    const root = createTempProjectRoot();
    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: false,
      s3ConstructionBudgetEnvRaw: '120',
      budgetEnvRaw: undefined,
      projectRoot: root,
      configuredSavePath: resolveS2DisposableResearchBrowserIsolationSavePath(root),
    });

    expect(guard.mode).toBe('personal_bypass');
    expect(guard.reserve(120).ok).toBe(true);
    expect(guard.getAuditSnapshot().admittedTotal).toBe(0);
  });

  it('preserves S1 and S2 behavior when S3 env is absent', () => {
    const s1 = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: '3',
    });
    expect(s1.reserve(1).ok).toBe(true);

    const s2 = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      s2BudgetEnvRaw: '60',
    });
    expect(s2.reserve(1).ok).toBe(true);
  });

  it('documents S3 max ceiling constant', () => {
    expect(ACCEPTANCE_S3_CONSTRUCTION_SIMULATION_ADVANCE_BUDGET_MAX).toBe(540);
  });

  it('admits cumulative construction_only reservations up to a configured 360 budget', () => {
    const root = createTempProjectRoot();
    const savePath = resolveS2DisposableResearchBrowserIsolationSavePath(root);
    const session = s3SessionContext(root);

    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      s3ConstructionBudgetEnvRaw: '360',
      budgetEnvRaw: undefined,
      projectRoot: root,
      configuredSavePath: savePath,
    });

    expect(guard.maxBudget).toBe(360);
    expect(guard.s3Submode).toBe('construction_only');

    expect(guard.reserve(120, session).ok).toBe(true);
    expect(guard.reserve(60, session).ok).toBe(true);
    expect(guard.reserve(150, session).ok).toBe(true);
    expect(guard.reserve(29, session).ok).toBe(true);

    const atCeiling = guard.reserve(1, session);
    expect(atCeiling.ok).toBe(true);
    if (atCeiling.ok) {
      expect(atCeiling.admittedTotal).toBe(360);
      expect(atCeiling.remaining).toBe(0);
    }

    const overrun = guard.reserve(1, session);
    expect(overrun.ok).toBe(false);
    if (!overrun.ok) {
      expect(overrun.reason).toBe('BUDGET_EXHAUSTED');
    }
  });

  it('admits cumulative construction_only reservations up to the 540 owner ceiling', () => {
    const root = createTempProjectRoot();
    const savePath = resolveS2DisposableResearchBrowserIsolationSavePath(root);
    const session = s3SessionContext(root);

    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      s3ConstructionBudgetEnvRaw: '540',
      budgetEnvRaw: undefined,
      projectRoot: root,
      configuredSavePath: savePath,
    });

    expect(guard.maxBudget).toBe(540);
    expect(guard.s3Submode).toBe('construction_only');

    expect(guard.reserve(120, session).ok).toBe(true);
    expect(guard.reserve(60, session).ok).toBe(true);
    expect(guard.reserve(150, session).ok).toBe(true);
    expect(guard.reserve(180, session).ok).toBe(true);
    expect(guard.reserve(29, session).ok).toBe(true);

    const atCeiling = guard.reserve(1, session);
    expect(atCeiling.ok).toBe(true);
    if (atCeiling.ok) {
      expect(atCeiling.admittedTotal).toBe(540);
      expect(atCeiling.remaining).toBe(0);
    }

    const overrun = guard.reserve(1, session);
    expect(overrun.ok).toBe(false);
    if (!overrun.ok) {
      expect(overrun.reason).toBe('BUDGET_EXHAUSTED');
    }
  });
});

describe('AcceptanceSimulationAdvanceGuard S3 dual construction + production mode', () => {
  it('exhausts construction budget before production counters are used', () => {
    const root = createTempProjectRoot();
    const session = s3SessionContext(root);
    const gameplay = validS3ProductionGameplay();
    const guard = createDualS3Guard(root, '120', '5');

    expect(guard.s3Submode).toBe('dual');
    expect(guard.reserve(120, session).ok).toBe(true);
    expect(guard.getAuditSnapshot().s3Phase).toBe('production');
    expect(guard.getAuditSnapshot().s3ProductionAdmitted).toBe(0);

    const firstProduction = guard.reserve(1, session, gameplay);
    expect(firstProduction.ok).toBe(true);
    expect(guard.getAuditSnapshot().s3ProductionAdmitted).toBe(1);
  });

  it('rejects production phase ticks before construction budget is exhausted', () => {
    const root = createTempProjectRoot();
    const session = s3SessionContext(root);
    const gameplay = validS3ProductionGameplay();
    const guard = createDualS3Guard(root, '3', '5');

    expect(guard.reserve(1, session, gameplay).ok).toBe(true);
    expect(guard.getAuditSnapshot().s3Phase).toBe('construction');

    const productionEarly = guard.reserve(1, session, gameplay);
    expect(productionEarly.ok).toBe(true);
    expect(guard.getAuditSnapshot().s3Phase).toBe('construction');
  });

  it('denies production ticks without prerequisites after construction is exhausted', () => {
    const root = createTempProjectRoot();
    const session = s3SessionContext(root);
    const guard = createDualS3Guard(root, '1', '5');

    expect(guard.reserve(1, session).ok).toBe(true);

    const denied = guard.reserve(1, session);
    expect(denied.ok).toBe(false);
    if (!denied.ok) {
      expect(denied.reason).toBe('PREREQUISITE_DENIED');
    }
  });

  it('admits production ticks only after construction exhaustion and valid prerequisites', () => {
    const root = createTempProjectRoot();
    const session = s3SessionContext(root);
    const gameplay = validS3ProductionGameplay();
    const guard = createDualS3Guard(root, '2', '4');

    expect(guard.reserve(2, session).ok).toBe(true);

    expect(guard.reserve(2, session, gameplay).ok).toBe(true);
    expect(guard.reserve(2, session, gameplay).ok).toBe(true);
    const overrun = guard.reserve(1, session, gameplay);
    expect(overrun.ok).toBe(false);
    if (!overrun.ok) {
      expect(overrun.reason).toBe('BUDGET_EXHAUSTED');
    }
    expect(guard.getAuditSnapshot().s3ProductionAdmitted).toBe(4);
  });

  it('rejects production phase when sawmill is missing or under construction', () => {
    const root = createTempProjectRoot();
    const session = s3SessionContext(root);
    const guard = createDualS3Guard(root, '1', '3');

    expect(guard.reserve(1, session).ok).toBe(true);

    const underConstructionGameplay: AcceptanceS3ProductionPhaseGameplayContext = {
      buildings: [
        {
          id: 'building_sawmill',
          buildingTypeId: 'sawmill',
          status: 'UNDER_CONSTRUCTION',
        },
      ],
      productionJobs: [],
    };

    const denied = guard.reserve(1, session, underConstructionGameplay);
    expect(denied.ok).toBe(false);
    if (!denied.ok) {
      expect(denied.reason).toBe('PREREQUISITE_DENIED');
    }
  });

  it('denies when forbidden S2 fixture file exists on disk', () => {
    const root = createTempProjectRoot();
    const fixturePath = resolveS2DisposableResearchBrowserIsolationSavePath(root);
    writeFileSync(fixturePath, '{}', 'utf8');
    const session = s3SessionContext(root);
    const guard = createDualS3Guard(root, '1', '2');

    const denied = guard.reserve(1, session);
    expect(denied.ok).toBe(false);
    if (!denied.ok) {
      expect(denied.reason).toBe('FIXTURE_PRESENT');
    }
  });

  it('shares counters across tick batches and step-sized reservations', () => {
    const root = createTempProjectRoot();
    const session = s3SessionContext(root);
    const gameplay = validS3ProductionGameplay();
    const guard = createDualS3Guard(root, '2', '2');

    expect(guard.reserve(1, session).ok).toBe(true);
    expect(guard.reserve(1, session).ok).toBe(true);
    expect(guard.reserve(1, session, gameplay).ok).toBe(true);
    expect(guard.reserve(1, session, gameplay).ok).toBe(true);
    expect(guard.reserve(1, session, gameplay).ok).toBe(false);
  });

  it('allows at most one concurrent production reservation when one permit remains', async () => {
    const root = createTempProjectRoot();
    const session = s3SessionContext(root);
    const gameplay = validS3ProductionGameplay();
    const guard = createDualS3Guard(root, '1', '1');

    expect(guard.reserve(1, session).ok).toBe(true);

    const results = await Promise.all(
      Array.from({ length: 32 }, () =>
        Promise.resolve().then(() =>
          guard.reserve(1, session, gameplay),
        ),
      ),
    );

    const admitted = results.filter((result) => result.ok).length;
    expect(admitted).toBe(1);
    expect(guard.getAuditSnapshot().s3ProductionAdmitted).toBe(1);
  });
});

describe('isAcceptanceS3ConstructionSimulationSessionIdentity', () => {
  it('requires disposable RAM company name and save path binding', () => {
    const root = createTempProjectRoot();
    const savePath = resolveS2DisposableResearchBrowserIsolationSavePath(root);

    expect(
      isAcceptanceS3ConstructionSimulationSessionIdentity(
        {
          hasActiveSession: true,
          companyName: 'S3-G-Disposable-RAM-2026-11-15',
          savePath,
        },
        root,
        savePath,
      ),
    ).toBe(true);

    expect(
      isAcceptanceS3ConstructionSimulationSessionIdentity(
        {
          hasActiveSession: true,
          companyName: 'S3-G-Disposable-RAM-2026-11-15',
          savePath: path.join(root, 'saves', 'browser-session.json'),
        },
        root,
        savePath,
      ),
    ).toBe(false);
  });
});

describe('AcceptanceSimulationAdvanceGuard S2 acceptance mode', () => {
  it('admits 50 units then only remaining budget and denies overrun', () => {
    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: undefined,
      s2BudgetEnvRaw: '60',
    });

    expect(guard.mode).toBe('armed');
    expect(guard.maxBudget).toBe(60);

    const firstBatch = guard.reserve(50);
    expect(firstBatch.ok).toBe(true);
    if (firstBatch.ok) {
      expect(firstBatch.admittedTotal).toBe(50);
      expect(firstBatch.remaining).toBe(10);
    }

    expect(guard.reserve(10).ok).toBe(true);
    const eleventh = guard.reserve(1);
    expect(eleventh.ok).toBe(false);
    if (!eleventh.ok) {
      expect(eleventh.reason).toBe('BUDGET_EXHAUSTED');
      expect(eleventh.admittedTotal).toBe(60);
    }
  });

  it('denies a single 61-unit reservation without admitting', () => {
    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      s2BudgetEnvRaw: '60',
    });

    const attempt = guard.reserve(61);
    expect(attempt.ok).toBe(false);
    if (!attempt.ok) {
      expect(attempt.reason).toBe('BUDGET_EXHAUSTED');
    }
    expect(guard.getAuditSnapshot().admittedTotal).toBe(0);
  });

  it('does not reset counter after denial', () => {
    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      s2BudgetEnvRaw: '2',
    });

    expect(guard.reserve(2).ok).toBe(true);
    expect(guard.reserve(1).ok).toBe(false);
    expect(guard.getAuditSnapshot().admittedTotal).toBe(2);
    expect(guard.reserve(1).ok).toBe(false);
  });

  it('disarms when S1 and S2 env are both present', () => {
    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: '3',
      s2BudgetEnvRaw: '60',
    });

    expect(guard.mode).toBe('disarmed');
    expect(guard.reserve(1).ok).toBe(false);
  });

  it('ignores S2 env outside acceptance isolation (personal bypass)', () => {
    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: false,
      budgetEnvRaw: undefined,
      s2BudgetEnvRaw: '60',
    });

    expect(guard.mode).toBe('personal_bypass');
    expect(guard.reserve(100).ok).toBe(true);
    expect(guard.getAuditSnapshot().admittedTotal).toBe(0);
  });

  it('preserves S1-only armed behavior when S2 env is absent', () => {
    const guard = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: '3',
    });

    expect(guard.reserve(1).ok).toBe(true);
    expect(guard.reserve(1).ok).toBe(true);
    expect(guard.reserve(1).ok).toBe(true);
    expect(guard.reserve(1).ok).toBe(false);
  });

  it('documents S2 max ceiling constant', () => {
    expect(ACCEPTANCE_S2_SIMULATION_ADVANCE_BUDGET_MAX).toBe(60);
  });
});

describe('GameController advance guard wiring', () => {
  it('does not call GameSession.tick when the guard rejects', () => {
    const tick = vi.fn();
    const stepSimulation = vi.fn();
    const tryReserveSimulationAdvances = vi.fn(() => ({
      ok: false as const,
      mode: 'disarmed' as const,
      reason: 'DISARMED' as const,
      attemptedUnits: 1,
      admittedTotal: 0,
      remaining: 0,
    }));

    const controller = new GameController(
      {
        getSession: () => ({
          tick,
          stepSimulation,
          getSessionStatus: () => ({
            ok: true,
            value: {
              hasActiveSession: true,
              companyName: 'S3-G-Disposable-RAM-2026-11-15',
              savePath: '/tmp/save.json',
            },
          }),
          listBuildings: () => ({ ok: true, value: [] }),
          listProductionJobs: () => ({ ok: true, value: [] }),
        }),
      } as never,
      { notifyRefresh: vi.fn() } as never,
      { tryReserveSimulationAdvances, getAuditSnapshot: vi.fn() } as never,
    );

    expect(() => controller.tick({ count: 1 })).toThrow(ForbiddenException);
    expect(tick).not.toHaveBeenCalled();

    expect(() => controller.stepSimulation()).toThrow(ForbiddenException);
    expect(stepSimulation).not.toHaveBeenCalled();
  });

  it('calls GameSession.tick only after a successful reservation', () => {
    const tick = vi.fn(() => ({ ok: true, value: undefined }));
    const tryReserveSimulationAdvances = vi.fn(() => ({
      ok: true as const,
      mode: 'armed' as const,
      units: 2,
      admittedTotal: 2,
      remaining: 1,
    }));

    const controller = new GameController(
      {
        getSession: () => ({
          tick,
          stepSimulation: vi.fn(),
          getSessionStatus: () => ({
            ok: true,
            value: {
              hasActiveSession: true,
              companyName: 'Test',
              savePath: '/tmp/save.json',
            },
          }),
          getDashboard: () => ({ ok: true, value: { tickNumber: 0 } }),
          listBuildings: () => ({ ok: true, value: [] }),
          listProductionJobs: () => ({ ok: true, value: [] }),
        }),
      } as never,
      { notifyRefresh: vi.fn() } as never,
      { tryReserveSimulationAdvances, getAuditSnapshot: vi.fn() } as never,
    );

    controller.tick({ count: 2 });

    expect(tryReserveSimulationAdvances).toHaveBeenCalled();
    expect(tick).toHaveBeenCalledWith(2);
  });
});
