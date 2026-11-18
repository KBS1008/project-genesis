import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ACCEPTANCE_SIMULATION_ADVANCE_DENIED_CODE,
  createAcceptanceSimulationAdvanceGuard,
} from './acceptance-simulation-advance-guard.js';
import { AcceptanceSimulationAdvanceGuardService } from './acceptance-simulation-advance-guard.service.js';
import { GameController } from './game.controller.js';
import {
  AcceptanceSimulationTickRequestAuditStore,
  classifyTickRequestOriginCategory,
  DEFAULT_TICK_REQUEST_AUDIT_RING_CAPACITY,
  parseAcceptanceTickRequestAuditEnabledEnv,
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

function createArmedGuardService(budget = '3'): AcceptanceSimulationAdvanceGuardService {
  const guard = createAcceptanceSimulationAdvanceGuard({
    acceptanceSaveIsolation: true,
    budgetEnvRaw: budget,
  });

  return {
    tryReserveSimulationAdvances: (units: number, session?, gameplay?) =>
      guard.reserve(units, session, gameplay),
    reserveSimulationAdvances: vi.fn(),
    getAuditSnapshot: () => guard.getAuditSnapshot(),
  } as unknown as AcceptanceSimulationAdvanceGuardService;
}

function createController(
  guard: AcceptanceSimulationAdvanceGuardService,
  audit?: AcceptanceSimulationTickRequestAuditService,
): GameController {
  const tick = vi.fn(() => ({ ok: true, value: undefined }));
  const stepSimulation = vi.fn(() => ({ ok: true, value: undefined }));

  return new GameController(
    {
      getSession: () => ({
        tick,
        stepSimulation,
        getDashboard: () => ({ ok: true, value: { tickNumber: 0 } }),
        getSessionStatus: () => ({
          ok: true,
          value: {
            hasActiveSession: true,
            companyName: 'Audit-Test-Corp',
            savePath: '/tmp/project/saves/acceptance/s1-notification-relevance.json',
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
}

describe('parseAcceptanceTickRequestAuditEnabledEnv', () => {
  it('defaults off and fails closed on malformed values', () => {
    expect(parseAcceptanceTickRequestAuditEnabledEnv(undefined)).toBe(false);
    expect(parseAcceptanceTickRequestAuditEnabledEnv('')).toBe(false);
    expect(parseAcceptanceTickRequestAuditEnabledEnv('2')).toBe(false);
    expect(parseAcceptanceTickRequestAuditEnabledEnv('yes')).toBe(false);
    expect(parseAcceptanceTickRequestAuditEnabledEnv('TRUE')).toBe(true);
    expect(parseAcceptanceTickRequestAuditEnabledEnv('1')).toBe(true);
  });
});

describe('classifyTickRequestOriginCategory', () => {
  it('maps expected local acceptance web origins without retaining raw values in events', () => {
    expect(classifyTickRequestOriginCategory('http://127.0.0.1:3003', undefined)).toBe(
      'ACCEPTANCE_WEB_LOCAL',
    );
    expect(
      classifyTickRequestOriginCategory(undefined, 'http://127.0.0.1:3003/game'),
    ).toBe('ACCEPTANCE_WEB_LOCAL');
    expect(classifyTickRequestOriginCategory('http://127.0.0.1:3000', undefined)).toBe(
      'OTHER_PRESENT',
    );
    expect(classifyTickRequestOriginCategory(undefined, undefined)).toBe('ABSENT');
  });
});

describe('AcceptanceSimulationTickRequestAuditStore', () => {
  it('enforces bounded retention', () => {
    const store = new AcceptanceSimulationTickRequestAuditStore(2);

    store.record({
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
      simulationCompletion: 'UNKNOWN',
      originCategory: 'ABSENT',
    });
    store.record({
      endpoint: 'tick',
      requestedCount: 1,
      admissionOutcome: 'ADMITTED',
      reservation: {
        ok: true,
        mode: 'armed',
        units: 1,
        admittedTotal: 2,
        remaining: 1,
      },
      simulationCompletion: 'UNKNOWN',
      originCategory: 'ABSENT',
    });
    store.record({
      endpoint: 'step',
      requestedCount: 1,
      admissionOutcome: 'DENIED',
      reservation: {
        ok: false,
        mode: 'armed',
        reason: 'BUDGET_EXHAUSTED',
        attemptedUnits: 1,
        admittedTotal: 2,
        remaining: 0,
      },
      simulationCompletion: 'UNKNOWN',
      originCategory: 'ABSENT',
    });

    expect(store.size).toBe(2);
    expect(store.snapshot()[0]?.endpoint).toBe('tick');
    expect(store.snapshot()[1]?.endpoint).toBe('step');
  });

  it('assigns monotonic sequence numbers', () => {
    const store = new AcceptanceSimulationTickRequestAuditStore(
      DEFAULT_TICK_REQUEST_AUDIT_RING_CAPACITY,
    );
    const first = store.record({
      endpoint: 'tick',
      requestedCount: 1,
      admissionOutcome: 'INVALID_REQUEST',
      reservation: null,
      simulationCompletion: 'UNKNOWN',
      originCategory: 'ABSENT',
    });
    const second = store.record({
      endpoint: 'step',
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
      simulationCompletion: 'UNKNOWN',
      originCategory: 'ABSENT',
    });

    expect(second.sequence).toBe(first.sequence + 1);
  });
});

describe('AcceptanceSimulationTickRequestAuditService gating', () => {
  afterEach(() => {
    delete process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV];
    resolveProjectPathsMock.mockReset();
  });

  it('never records in personal mode even when audit env is set', () => {
    resolveProjectPathsMock.mockReturnValue({
      projectRoot: '/tmp/project',
      gameContentRoot: '/tmp/project/game-content',
      savePath: '/tmp/project/saves/browser-session.json',
      acceptanceSaveIsolation: false,
    });
    process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV] = '1';

    const service = new AcceptanceSimulationTickRequestAuditService(
      new AcceptanceSimulationTickRequestAuditStore(),
    );

    service.observeSimulationAdvanceAttempt({
      endpoint: 'tick',
      requestedCount: 1,
      admissionOutcome: 'ADMITTED',
      reservation: null,
    });

    expect(service.getRecordedEvents()).toEqual([]);
    expect(service.isAuditRecordingEnabled).toBe(false);
  });

  it('records only when acceptance isolation and explicit audit env are both active', () => {
    resolveProjectPathsMock.mockReturnValue({
      projectRoot: '/tmp/project',
      gameContentRoot: '/tmp/project/game-content',
      savePath: '/tmp/project/saves/acceptance/s1.json',
      acceptanceSaveIsolation: true,
    });
    process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV] = '1';

    const service = new AcceptanceSimulationTickRequestAuditService(
      new AcceptanceSimulationTickRequestAuditStore(),
    );

    service.observeSimulationAdvanceAttempt({
      endpoint: 'tick',
      requestedCount: 3,
      admissionOutcome: 'ADMITTED',
      reservation: {
        ok: true,
        mode: 'armed',
        units: 3,
        admittedTotal: 3,
        remaining: 0,
      },
      originHeader: 'http://127.0.0.1:3003',
    });

    expect(service.getRecordedEvents()).toHaveLength(1);
    expect(service.getRecordedEvents()[0]?.originCategory).toBe('ACCEPTANCE_WEB_LOCAL');
  });
});

describe('GameController tick/step audit integration (unit, no HTTP)', () => {
  afterEach(() => {
    delete process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV];
    resolveProjectPathsMock.mockReset();
  });

  function enableAcceptanceAudit(): AcceptanceSimulationTickRequestAuditService {
    resolveProjectPathsMock.mockReturnValue({
      projectRoot: '/tmp/project',
      gameContentRoot: '/tmp/project/game-content',
      savePath: '/tmp/project/saves/acceptance/s1.json',
      acceptanceSaveIsolation: true,
    });
    process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV] = '1';
    return new AcceptanceSimulationTickRequestAuditService(
      new AcceptanceSimulationTickRequestAuditStore(32),
    );
  }

  it('records INVALID_REQUEST without consuming guard budget', () => {
    const guard = createArmedGuardService('3');
    const audit = enableAcceptanceAudit();
    const controller = createController(guard, audit);

    expect(() => controller.tick({ count: 1.5 } as never)).toThrow(BadRequestException);

    const events = audit.getRecordedEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.admissionOutcome).toBe('INVALID_REQUEST');
    expect(events[0]?.requestedCount).toBe('INVALID_UNPARSEABLE');
    expect(guard.getAuditSnapshot().admittedTotal).toBe(0);
  });

  it('records admitted tick count 1, admitted tick count 3, and admitted step 1', () => {
    const audit = enableAcceptanceAudit();

    const guardSingle = createArmedGuardService('3');
    createController(guardSingle, audit).tick({ count: 1 });
    expect(audit.getRecordedEvents().at(-1)?.reservedUnits).toBe(1);

    audit._resetForTests();
    const guardTriple = createArmedGuardService('3');
    createController(guardTriple, audit).tick({ count: 3 });
    expect(audit.getRecordedEvents().at(-1)?.reservedUnits).toBe(3);

    audit._resetForTests();
    const guardStep = createArmedGuardService('1');
    createController(guardStep, audit).stepSimulation();

    const events = audit.getRecordedEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.endpoint).toBe('step');
    expect(events[0]?.admissionOutcome).toBe('ADMITTED');
    expect(events.every((event) => event.simulationCompletion === 'UNKNOWN')).toBe(true);
  });

  it('records DENIED for disarmed guard without calling GameSession.tick', () => {
    const inner = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: undefined,
    });
    const guard = {
      tryReserveSimulationAdvances: (units: number) => inner.reserve(units),
      getAuditSnapshot: () => inner.getAuditSnapshot(),
    } as unknown as AcceptanceSimulationAdvanceGuardService;
    const audit = enableAcceptanceAudit();
    const controller = createController(guard, audit);
    const sessionTick = vi.fn();

    const controllerWithSpy = new GameController(
      {
        getSession: () => ({
          tick: sessionTick,
          stepSimulation: vi.fn(),
          getSessionStatus: () => ({
            ok: true,
            value: {
              hasActiveSession: true,
              companyName: 'Audit-Test-Corp',
              savePath: '/tmp/project/saves/acceptance/s1-notification-relevance.json',
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

    expect(() => controllerWithSpy.tick({ count: 1 })).toThrow(ForbiddenException);
    expect(sessionTick).not.toHaveBeenCalled();

    const events = audit.getRecordedEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.admissionOutcome).toBe('DENIED');
    expect(events[0]?.denyReason).toBe('DISARMED');
  });

  it('records BUDGET_EXHAUSTED denial after budget is consumed', () => {
    const guard = createArmedGuardService('1');
    const audit = enableAcceptanceAudit();
    const controller = createController(guard, audit);

    controller.tick({ count: 1 });
    expect(() => controller.tick({ count: 1 })).toThrow(ForbiddenException);

    const events = audit.getRecordedEvents();
    expect(events).toHaveLength(2);
    expect(events[1]?.admissionOutcome).toBe('DENIED');
    expect(events[1]?.denyReason).toBe('BUDGET_EXHAUSTED');
  });

  it('preserves ForbiddenException code compatibility', () => {
    const guard = createArmedGuardService('0');
    const audit = enableAcceptanceAudit();
    const controller = createController(guard, audit);

    try {
      controller.tick({ count: 1 });
      throw new Error('expected throw');
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
      expect((error as ForbiddenException).message).toBe(ACCEPTANCE_SIMULATION_ADVANCE_DENIED_CODE);
    }
  });

  it('does not emit raw headers, cookies, or save paths in recorded events', () => {
    const guard = createArmedGuardService('3');
    const audit = enableAcceptanceAudit();
    const controller = createController(guard, audit);

    controller.tick(
      { count: 1 },
      {
        headers: {
          origin: 'http://127.0.0.1:3003',
          referer: 'http://127.0.0.1:3003/game?secret=1',
          cookie: 'session=abc',
          'user-agent': 'Mozilla/5.0',
        },
      } as never,
    );

    const serialized = JSON.stringify(audit.getRecordedEvents());
    expect(serialized).not.toContain('cookie');
    expect(serialized).not.toContain('Mozilla');
    expect(serialized).not.toContain('secret=1');
    expect(serialized).not.toContain('browser-session');
    expect(audit.getRecordedEvents()[0]?.originCategory).toBe('ACCEPTANCE_WEB_LOCAL');
  });

  it('swallows audit store failures without changing controller outcome', () => {
    const guard = createArmedGuardService('3');
    const audit = enableAcceptanceAudit();
    const store = audit._getStoreForTests();
    vi.spyOn(store, 'record').mockImplementation(() => {
      throw new Error('audit sink failed');
    });

    const controller = createController(guard, audit);
    expect(() => controller.tick({ count: 1 })).not.toThrow();
    expect(guard.getAuditSnapshot().admittedTotal).toBe(1);
  });

  it('handles concurrent reservations with one audit event per attempt', async () => {
    const inner = createAcceptanceSimulationAdvanceGuard({
      acceptanceSaveIsolation: true,
      budgetEnvRaw: '2',
    });
    const guard = {
      tryReserveSimulationAdvances: (units: number) => inner.reserve(units),
      getAuditSnapshot: () => inner.getAuditSnapshot(),
    } as unknown as AcceptanceSimulationAdvanceGuardService;
    const audit = enableAcceptanceAudit();
    const controller = createController(guard, audit);

    await Promise.all(
      Array.from({ length: 8 }, () =>
        Promise.resolve().then(() => {
          try {
            controller.tick({ count: 1 });
          } catch {
            // expected denials
          }
        }),
      ),
    );

    expect(audit.getRecordedEvents().length).toBe(8);
    expect(guard.getAuditSnapshot().admittedTotal).toBe(2);
    const admittedEvents = audit.getRecordedEvents().filter(
      (event) => event.admissionOutcome === 'ADMITTED',
    );
    expect(admittedEvents).toHaveLength(2);
  });
});
