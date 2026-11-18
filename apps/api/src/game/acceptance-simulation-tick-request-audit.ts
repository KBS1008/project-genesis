/**
 * @module @project-genesis/api/game/acceptance-simulation-tick-request-audit
 *
 * Acceptance-isolated, privacy-safe in-memory audit for simulation tick/step POST attempts.
 */

import { randomBytes } from 'node:crypto';
import type { AcceptanceSimulationAdvanceReservationResult } from './acceptance-simulation-advance-guard.js';

/** Server-private env; effective only when acceptance save isolation is active. */
export const PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV =
  'PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT';

export const ACCEPTANCE_SIMULATION_TICK_REQUEST_AUDIT_SCHEMA_VERSION = 1;

export const ACCEPTANCE_WEB_LOCAL_ORIGIN = 'http://127.0.0.1:3003';

export const ACCEPTANCE_WEB_LOCAL_ORIGIN_LOCALHOST = 'http://localhost:3003';

export const DEFAULT_TICK_REQUEST_AUDIT_RING_CAPACITY = 256;

export type AcceptanceSimulationTickRequestEndpoint = 'tick' | 'step';

export type AcceptanceSimulationTickRequestAdmissionOutcome =
  | 'ADMITTED'
  | 'DENIED'
  | 'INVALID_REQUEST';

export type AcceptanceSimulationTickRequestSimulationCompletion = 'UNKNOWN' | 'ERROR';

export type AcceptanceSimulationTickRequestOriginCategory =
  | 'ACCEPTANCE_WEB_LOCAL'
  | 'OTHER_PRESENT'
  | 'ABSENT';

export type AcceptanceSimulationTickRequestAuditEvent = {
  readonly auditSchemaVersion: number;
  readonly timestampUtc: string;
  readonly sequence: number;
  readonly correlationId: string;
  readonly endpoint: AcceptanceSimulationTickRequestEndpoint;
  readonly requestedCount: number | 'INVALID_UNPARSEABLE';
  readonly admissionOutcome: AcceptanceSimulationTickRequestAdmissionOutcome;
  readonly denyReason:
    | 'DISARMED'
    | 'BUDGET_EXHAUSTED'
    | 'INVALID_UNITS'
    | 'IDENTITY_DENIED'
    | 'FIXTURE_PRESENT'
    | 'PHASE_DENIED'
    | 'PREREQUISITE_DENIED'
    | null;
  readonly reservedUnits: number | null;
  readonly admittedTotalAfter: number | null;
  readonly remainingBudgetAfter: number | null;
  readonly simulationCompletion: AcceptanceSimulationTickRequestSimulationCompletion;
  readonly originCategory: AcceptanceSimulationTickRequestOriginCategory;
  readonly acceptanceIsolationActive: true;
};

export type RecordTickRequestAuditInput = {
  readonly endpoint: AcceptanceSimulationTickRequestEndpoint;
  readonly requestedCount: number | 'INVALID_UNPARSEABLE';
  readonly admissionOutcome: AcceptanceSimulationTickRequestAdmissionOutcome;
  readonly reservation: AcceptanceSimulationAdvanceReservationResult | null;
  readonly simulationCompletion: AcceptanceSimulationTickRequestSimulationCompletion;
  readonly originCategory: AcceptanceSimulationTickRequestOriginCategory;
  readonly timestampUtc?: string;
  readonly correlationId?: string;
};

/** Parses audit enable env. Malformed values fail closed (disabled). */
export function parseAcceptanceTickRequestAuditEnabledEnv(raw: string | undefined): boolean {
  if (raw === undefined) {
    return false;
  }

  const trimmed = raw.trim().toLowerCase();

  return trimmed === '1' || trimmed === 'true';
}

/** Derives a whitelisted origin category without retaining raw header values. */
export function classifyTickRequestOriginCategory(
  originHeader: string | undefined,
  refererHeader: string | undefined,
): AcceptanceSimulationTickRequestOriginCategory {
  const candidates = [originHeader, refererHeader].filter(
    (value): value is string => value !== undefined && value.trim().length > 0,
  );

  if (candidates.length === 0) {
    return 'ABSENT';
  }

  for (const raw of candidates) {
    const normalized = normalizeOriginCandidate(raw);

    if (
      normalized === ACCEPTANCE_WEB_LOCAL_ORIGIN ||
      normalized === ACCEPTANCE_WEB_LOCAL_ORIGIN_LOCALHOST
    ) {
      return 'ACCEPTANCE_WEB_LOCAL';
    }

    if (normalized.startsWith('http://127.0.0.1:3003/')) {
      return 'ACCEPTANCE_WEB_LOCAL';
    }

    if (normalized.startsWith('http://localhost:3003/')) {
      return 'ACCEPTANCE_WEB_LOCAL';
    }
  }

  return 'OTHER_PRESENT';
}

function normalizeOriginCandidate(raw: string): string {
  const trimmed = raw.trim();

  try {
    const url = new URL(trimmed);
    return `${url.protocol}//${url.host}`;
  } catch {
    return trimmed;
  }
}

/** Bounded in-process ring buffer for audit events (acceptance-only consumers). */
export class AcceptanceSimulationTickRequestAuditStore {
  readonly #capacity: number;
  readonly #events: AcceptanceSimulationTickRequestAuditEvent[] = [];
  #sequence = 0;

  constructor(capacity: number = DEFAULT_TICK_REQUEST_AUDIT_RING_CAPACITY) {
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new Error('Tick request audit ring capacity must be a positive integer.');
    }

    this.#capacity = capacity;
  }

  get capacity(): number {
    return this.#capacity;
  }

  get size(): number {
    return this.#events.length;
  }

  /** Creates a short random correlation id (not derived from client identity). */
  createCorrelationId(): string {
    return randomBytes(6).toString('hex');
  }

  /** Appends one audit event and drops the oldest when over capacity. */
  record(input: RecordTickRequestAuditInput): AcceptanceSimulationTickRequestAuditEvent {
    this.#sequence += 1;

    const reservation = input.reservation;
    let reservedUnits: number | null = null;
    let admittedTotalAfter: number | null = null;
    let remainingBudgetAfter: number | null = null;
    let denyReason: AcceptanceSimulationTickRequestAuditEvent['denyReason'] = null;

    if (reservation !== null) {
      admittedTotalAfter = reservation.admittedTotal;
      remainingBudgetAfter = Number.isFinite(reservation.remaining)
        ? reservation.remaining
        : null;

      if (reservation.ok) {
        reservedUnits = reservation.units;
      } else {
        denyReason = reservation.reason;
      }
    }

    const event: AcceptanceSimulationTickRequestAuditEvent = Object.freeze({
      auditSchemaVersion: ACCEPTANCE_SIMULATION_TICK_REQUEST_AUDIT_SCHEMA_VERSION,
      timestampUtc: input.timestampUtc ?? new Date().toISOString(),
      sequence: this.#sequence,
      correlationId: input.correlationId ?? this.createCorrelationId(),
      endpoint: input.endpoint,
      requestedCount: input.requestedCount,
      admissionOutcome: input.admissionOutcome,
      denyReason,
      reservedUnits,
      admittedTotalAfter,
      remainingBudgetAfter,
      simulationCompletion: input.simulationCompletion,
      originCategory: input.originCategory,
      acceptanceIsolationActive: true,
    });

    this.#events.push(event);

    if (this.#events.length > this.#capacity) {
      this.#events.shift();
    }

    return event;
  }

  /** Test/diagnostic read of recorded events (newest last). */
  snapshot(): readonly AcceptanceSimulationTickRequestAuditEvent[] {
    return Object.freeze([...this.#events]);
  }

  clearForTests(): void {
    this.#events.length = 0;
    this.#sequence = 0;
  }
}
