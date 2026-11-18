/**
 * @module @project-genesis/api/game/acceptance-simulation-tick-request-audit-export
 *
 * Opt-in, acceptance-only JSONL export of sanitized tick-request audit events.
 */

import type { AcceptanceSimulationTickRequestAuditEvent } from './acceptance-simulation-tick-request-audit.js';

/** Second server-private switch; effective only with collection + acceptance isolation. */
export const PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_EXPORT_ENV =
  'PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_EXPORT';

/** Stable single-line log prefix (owner-capture friendly). */
export const PG_S1_ACCEPTANCE_TICK_AUDIT_LOG_PREFIX = 'PG_S1_ACCEPTANCE_TICK_AUDIT ';

export const ACCEPTANCE_SIMULATION_TICK_REQUEST_AUDIT_EXPORT_SCHEMA_VERSION = 1;

/** Maximum serialized export line length (prefix + JSON). */
export const MAX_TICK_REQUEST_AUDIT_EXPORT_LINE_BYTES = 2048;

export type AcceptanceSimulationTickRequestAuditExportRecord = {
  readonly exportSchemaVersion: typeof ACCEPTANCE_SIMULATION_TICK_REQUEST_AUDIT_EXPORT_SCHEMA_VERSION;
  readonly timestampUtc: string;
  readonly sequence: number;
  readonly correlationId: string;
  readonly endpoint: AcceptanceSimulationTickRequestAuditEvent['endpoint'];
  readonly requestedCount: AcceptanceSimulationTickRequestAuditEvent['requestedCount'];
  readonly admissionOutcome: AcceptanceSimulationTickRequestAuditEvent['admissionOutcome'];
  readonly denyReason: AcceptanceSimulationTickRequestAuditEvent['denyReason'];
  readonly reservedUnits: number | null;
  readonly admittedTotalAfter: number | null;
  readonly remainingBudgetAfter: number | null;
  readonly simulationCompletion: AcceptanceSimulationTickRequestAuditEvent['simulationCompletion'];
  readonly originCategory: AcceptanceSimulationTickRequestAuditEvent['originCategory'];
};

export type AcceptanceSimulationTickRequestAuditExportSink = {
  writeLine(line: string): void;
};

/** Parses export enable env. Malformed values fail closed (disabled). */
export function parseAcceptanceTickRequestAuditExportEnabledEnv(raw: string | undefined): boolean {
  if (raw === undefined) {
    return false;
  }

  const trimmed = raw.trim().toLowerCase();

  return trimmed === '1' || trimmed === 'true';
}

/** Maps an in-memory audit event to the export allowlist (no extra fields). */
export function toTickRequestAuditExportRecord(
  event: AcceptanceSimulationTickRequestAuditEvent,
): AcceptanceSimulationTickRequestAuditExportRecord {
  return Object.freeze({
    exportSchemaVersion: ACCEPTANCE_SIMULATION_TICK_REQUEST_AUDIT_EXPORT_SCHEMA_VERSION,
    timestampUtc: event.timestampUtc,
    sequence: event.sequence,
    correlationId: event.correlationId,
    endpoint: event.endpoint,
    requestedCount: event.requestedCount,
    admissionOutcome: event.admissionOutcome,
    denyReason: event.denyReason,
    reservedUnits: event.reservedUnits,
    admittedTotalAfter: event.admittedTotalAfter,
    remainingBudgetAfter: event.remainingBudgetAfter,
    simulationCompletion: event.simulationCompletion,
    originCategory: event.originCategory,
  });
}

function assertSafeExportString(value: string, label: string): string {
  if (value.includes('\n') || value.includes('\r') || value.includes(PG_S1_ACCEPTANCE_TICK_AUDIT_LOG_PREFIX)) {
    throw new Error(`Unsafe export string for ${label}.`);
  }

  return value;
}

/** Serializes one export line; throws on unsafe content (caller should swallow). */
export function formatTickRequestAuditExportLine(
  event: AcceptanceSimulationTickRequestAuditEvent,
): string {
  const record = toTickRequestAuditExportRecord(event);
  const payload = JSON.stringify({
    exportSchemaVersion: record.exportSchemaVersion,
    timestampUtc: assertSafeExportString(record.timestampUtc, 'timestampUtc'),
    sequence: record.sequence,
    correlationId: assertSafeExportString(record.correlationId, 'correlationId'),
    endpoint: record.endpoint,
    requestedCount: record.requestedCount,
    admissionOutcome: record.admissionOutcome,
    denyReason: record.denyReason,
    reservedUnits: record.reservedUnits,
    admittedTotalAfter: record.admittedTotalAfter,
    remainingBudgetAfter: record.remainingBudgetAfter,
    simulationCompletion: record.simulationCompletion,
    originCategory: record.originCategory,
  });

  const line = `${PG_S1_ACCEPTANCE_TICK_AUDIT_LOG_PREFIX}${payload}`;

  if (Buffer.byteLength(line, 'utf8') > MAX_TICK_REQUEST_AUDIT_EXPORT_LINE_BYTES) {
    throw new Error('Tick request audit export line exceeds bounded length.');
  }

  return line;
}

/** Default stderr sink for supervised acceptance API processes. */
export function createStderrTickRequestAuditExportSink(): AcceptanceSimulationTickRequestAuditExportSink {
  return {
    writeLine(line: string): void {
      process.stderr.write(`${line}\n`);
    },
  };
}

/**
 * Emits one export line for an event. Failures are swallowed (no request impact).
 * Emits at append time — one line per stored audit event, no drain timer.
 */
export function emitTickRequestAuditExportLine(
  event: AcceptanceSimulationTickRequestAuditEvent,
  sink: AcceptanceSimulationTickRequestAuditExportSink,
): void {
  try {
    const line = formatTickRequestAuditExportLine(event);
    sink.writeLine(line);
  } catch {
    // Export must never affect simulation or guard behavior.
  }
}
