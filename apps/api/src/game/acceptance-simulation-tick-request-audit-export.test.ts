import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAcceptanceSimulationAdvanceGuard } from './acceptance-simulation-advance-guard.js';
import { AcceptanceSimulationAdvanceGuardService } from './acceptance-simulation-advance-guard.service.js';
import { GameController } from './game.controller.js';
import {
  ACCEPTANCE_SIMULATION_TICK_REQUEST_AUDIT_EXPORT_SCHEMA_VERSION,
  formatTickRequestAuditExportLine,
  PG_S1_ACCEPTANCE_TICK_AUDIT_LOG_PREFIX,
  PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_EXPORT_ENV,
  parseAcceptanceTickRequestAuditExportEnabledEnv,
  type AcceptanceSimulationTickRequestAuditExportSink,
} from './acceptance-simulation-tick-request-audit-export.js';
import {
  AcceptanceSimulationTickRequestAuditStore,
  PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV,
} from './acceptance-simulation-tick-request-audit.js';
import { AcceptanceSimulationTickRequestAuditService } from './acceptance-simulation-tick-request-audit.service.js';

const resolveProjectPathsMock = vi.hoisted(() =>
  vi.fn(() => ({
    projectRoot: '/tmp/project',
    gameContentRoot: '/tmp/project/game-content',
    savePath: '/tmp/project/saves/acceptance/s1-notification-relevance.json',
    acceptanceSaveIsolation: true,
  })),
);

vi.mock('../config/project-paths.js', () => ({
  resolveProjectPaths: resolveProjectPathsMock,
}));

function createCaptureSink(): {
  readonly sink: AcceptanceSimulationTickRequestAuditExportSink;
  readonly lines: string[];
} {
  const lines: string[] = [];

  return {
    lines,
    sink: {
      writeLine(line: string) {
        lines.push(line);
      },
    },
  };
}

function createAcceptanceAuditService(options?: {
  readonly exportEnv?: string;
  readonly auditEnv?: string;
  readonly acceptanceSaveIsolation?: boolean;
  readonly sink?: AcceptanceSimulationTickRequestAuditExportSink;
}): { service: AcceptanceSimulationTickRequestAuditService; lines: string[] } {
  const capture = options?.sink ? { lines: [] as string[], sink: options.sink } : createCaptureSink();

  resolveProjectPathsMock.mockReturnValue({
    projectRoot: '/tmp/project',
    gameContentRoot: '/tmp/project/game-content',
    savePath:
      options?.acceptanceSaveIsolation === false
        ? '/tmp/project/saves/browser-session.json'
        : '/tmp/project/saves/acceptance/s1-notification-relevance.json',
    acceptanceSaveIsolation: options?.acceptanceSaveIsolation ?? true,
  });

  const prevAudit = process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV];
  const prevExport = process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_EXPORT_ENV];

  if (options?.auditEnv === undefined) {
    delete process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV];
  } else {
    process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV] = options.auditEnv;
  }

  if (options?.exportEnv === undefined) {
    delete process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_EXPORT_ENV];
  } else {
    process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_EXPORT_ENV] = options.exportEnv;
  }

  const service = new AcceptanceSimulationTickRequestAuditService(
    new AcceptanceSimulationTickRequestAuditStore(8),
    capture.sink,
  );

  if (prevAudit === undefined) {
    delete process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV];
  } else {
    process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV] = prevAudit;
  }

  if (prevExport === undefined) {
    delete process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_EXPORT_ENV];
  } else {
    process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_EXPORT_ENV] = prevExport;
  }

  return { service, lines: capture.lines };
}

describe('parseAcceptanceTickRequestAuditExportEnabledEnv', () => {
  it('fails closed unless explicitly true/1', () => {
    expect(parseAcceptanceTickRequestAuditExportEnabledEnv(undefined)).toBe(false);
    expect(parseAcceptanceTickRequestAuditExportEnabledEnv('yes')).toBe(false);
    expect(parseAcceptanceTickRequestAuditExportEnabledEnv('TRUE')).toBe(true);
  });
});

describe('formatTickRequestAuditExportLine', () => {
  it('uses prefix and allowlisted JSON fields only', () => {
    const store = new AcceptanceSimulationTickRequestAuditStore(4);
    const event = store.record({
      endpoint: 'tick',
      requestedCount: 2,
      admissionOutcome: 'ADMITTED',
      reservation: {
        ok: true,
        mode: 'armed',
        units: 2,
        admittedTotal: 2,
        remaining: 1,
      },
      simulationCompletion: 'UNKNOWN',
      originCategory: 'ABSENT',
    });

    const line = formatTickRequestAuditExportLine(event);
    expect(line.startsWith(PG_S1_ACCEPTANCE_TICK_AUDIT_LOG_PREFIX)).toBe(true);
    const json = line.slice(PG_S1_ACCEPTANCE_TICK_AUDIT_LOG_PREFIX.length);
    const parsed = JSON.parse(json) as Record<string, unknown>;
    expect(Object.keys(parsed).sort()).toEqual(
      [
        'admissionOutcome',
        'admittedTotalAfter',
        'correlationId',
        'denyReason',
        'endpoint',
        'exportSchemaVersion',
        'originCategory',
        'remainingBudgetAfter',
        'requestedCount',
        'reservedUnits',
        'sequence',
        'simulationCompletion',
        'timestampUtc',
      ].sort(),
    );
    expect(parsed.exportSchemaVersion).toBe(
      ACCEPTANCE_SIMULATION_TICK_REQUEST_AUDIT_EXPORT_SCHEMA_VERSION,
    );
  });
});

describe('AcceptanceSimulationTickRequestAuditService export gating', () => {
  afterEach(() => {
    delete process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV];
    delete process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_EXPORT_ENV];
    resolveProjectPathsMock.mockReset();
  });

  it('does not export when collection, export flag, or isolation is missing', () => {
    const cases = [
      { auditEnv: '1', exportEnv: undefined, isolation: true },
      { auditEnv: undefined, exportEnv: '1', isolation: true },
      { auditEnv: '1', exportEnv: '1', isolation: false },
      { auditEnv: '1', exportEnv: 'maybe', isolation: true },
    ] as const;

    for (const testCase of cases) {
      const { service, lines } = createAcceptanceAuditService({
        auditEnv: testCase.auditEnv,
        exportEnv: testCase.exportEnv,
        acceptanceSaveIsolation: testCase.isolation,
      });

      service.observeSimulationAdvanceAttempt({
        endpoint: 'tick',
        requestedCount: 1,
        admissionOutcome: 'ADMITTED',
        reservation: {
          ok: true,
          mode: 'armed',
          units: 1,
          admittedTotal: 1,
          remaining: 2,
        },
      });

      expect(lines).toHaveLength(0);
    }
  });

  it('emits exactly one line per audited request when fully enabled', () => {
    const { service, lines } = createAcceptanceAuditService({
      auditEnv: '1',
      exportEnv: '1',
    });

    service.observeSimulationAdvanceAttempt({
      endpoint: 'tick',
      requestedCount: 1,
      admissionOutcome: 'DENIED',
      reservation: {
        ok: false,
        mode: 'disarmed',
        reason: 'DISARMED',
        attemptedUnits: 1,
        admittedTotal: 0,
        remaining: 0,
      },
    });
    service.observeSimulationAdvanceAttempt({
      endpoint: 'step',
      requestedCount: 1,
      admissionOutcome: 'ADMITTED',
      reservation: {
        ok: true,
        mode: 'armed',
        units: 1,
        admittedTotal: 1,
        remaining: 2,
      },
      originHeader: 'http://127.0.0.1:3003',
    });

    expect(lines).toHaveLength(2);
    expect(lines.every((line) => line.startsWith(PG_S1_ACCEPTANCE_TICK_AUDIT_LOG_PREFIX))).toBe(
      true,
    );
  });

  it('does not leak cookies, user agent, save paths, or company names in export lines', () => {
    const { service, lines } = createAcceptanceAuditService({
      auditEnv: '1',
      exportEnv: '1',
    });

    service.observeSimulationAdvanceAttempt({
      endpoint: 'tick',
      requestedCount: 1,
      admissionOutcome: 'ADMITTED',
      reservation: {
        ok: true,
        mode: 'armed',
        units: 1,
        admittedTotal: 1,
        remaining: 2,
      },
      originHeader: 'http://127.0.0.1:3003',
      refererHeader: 'http://127.0.0.1:3003/game?company=Danny%20AG',
    });

    const serialized = lines.join('\n');
    expect(serialized).not.toMatch(/cookie|authorization|user-agent|browser-session|Danny/i);
    expect(serialized).not.toContain('company=');
  });

  it('swallows sink failures without affecting stored audit events', () => {
    const failingSink: AcceptanceSimulationTickRequestAuditExportSink = {
      writeLine() {
        throw new Error('sink unavailable');
      },
    };

    const { service, lines } = createAcceptanceAuditService({
      auditEnv: '1',
      exportEnv: '1',
      sink: failingSink,
    });

    expect(() =>
      service.observeSimulationAdvanceAttempt({
        endpoint: 'tick',
        requestedCount: 1,
        admissionOutcome: 'ADMITTED',
        reservation: {
          ok: true,
          mode: 'armed',
          units: 1,
          admittedTotal: 1,
          remaining: 2,
        },
      }),
    ).not.toThrow();

    expect(lines).toHaveLength(0);
    expect(service.getRecordedEvents()).toHaveLength(1);
  });

  it('exports at append time even when ring buffer drops oldest records', () => {
    process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV] = '1';
    process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_EXPORT_ENV] = '1';

    const capture = createCaptureSink();
    resolveProjectPathsMock.mockReturnValue({
      projectRoot: '/tmp/project',
      gameContentRoot: '/tmp/project/game-content',
      savePath: '/tmp/project/saves/acceptance/s1.json',
      acceptanceSaveIsolation: true,
    });
    const bounded = new AcceptanceSimulationTickRequestAuditService(
      new AcceptanceSimulationTickRequestAuditStore(2),
      capture.sink,
    );

    for (let index = 0; index < 3; index += 1) {
      bounded.observeSimulationAdvanceAttempt({
        endpoint: 'tick',
        requestedCount: 1,
        admissionOutcome: 'INVALID_REQUEST',
        reservation: null,
      });
    }

    expect(bounded.getRecordedEvents()).toHaveLength(2);
    expect(capture.lines).toHaveLength(3);
  });
});

describe('export with controller decisions (unit, no HTTP)', () => {
  afterEach(() => {
    delete process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV];
    delete process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_EXPORT_ENV];
    resolveProjectPathsMock.mockReset();
  });

  it('exports invalid and denied controller paths without extra guard reservations', () => {
    const capture = createCaptureSink();
    process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV] = '1';
    process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_EXPORT_ENV] = '1';
    resolveProjectPathsMock.mockReturnValue({
      projectRoot: '/tmp/project',
      gameContentRoot: '/tmp/project/game-content',
      savePath: '/tmp/project/saves/acceptance/s1.json',
      acceptanceSaveIsolation: true,
    });

    const audit = new AcceptanceSimulationTickRequestAuditService(
      new AcceptanceSimulationTickRequestAuditStore(16),
      capture.sink,
    );

    const inner = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: '1',
    });
    const guard = {
      tryReserveSimulationAdvances: (units: number) => inner.reserve(units),
      getAuditSnapshot: () => inner.getAuditSnapshot(),
    } as unknown as AcceptanceSimulationAdvanceGuardService;

    const controller = new GameController(
      {
        getSession: () => ({
          tick: vi.fn(() => ({ ok: true, value: undefined })),
          stepSimulation: vi.fn(),
          getDashboard: () => ({ ok: true, value: { tickNumber: 0 } }),
          getSessionStatus: () => ({
            ok: true,
            value: {
              hasActiveSession: true,
              companyName: 'S3-AK-Audit-Export-Test',
              savePath: '/tmp/project/saves/acceptance/s1.json',
            },
          }),
          listBuildings: () => ({ ok: true, value: [] }),
          listProductionJobs: () => ({ ok: true, value: [] }),
        }),
      } as never,
      { notifyRefresh: vi.fn() } as never,
      guard,
      audit,
    );

    expect(() => controller.tick({ count: Number.NaN } as never)).toThrow(BadRequestException);
    controller.tick({ count: 1 });
    expect(() => controller.tick({ count: 1 })).toThrow(ForbiddenException);

    expect(capture.lines).toHaveLength(3);
    expect(inner.getAuditSnapshot().admittedTotal).toBe(1);
  });
});
