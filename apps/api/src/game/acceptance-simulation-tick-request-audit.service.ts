/**
 * @module @project-genesis/api/game/acceptance-simulation-tick-request-audit.service
 */

import { Injectable } from '@nestjs/common';
import { resolveProjectPaths } from '../config/project-paths.js';
import {
  createStderrTickRequestAuditExportSink,
  emitTickRequestAuditExportLine,
  parseAcceptanceTickRequestAuditExportEnabledEnv,
  PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_EXPORT_ENV,
  type AcceptanceSimulationTickRequestAuditExportSink,
} from './acceptance-simulation-tick-request-audit-export.js';
import {
  AcceptanceSimulationTickRequestAuditStore,
  classifyTickRequestOriginCategory,
  parseAcceptanceTickRequestAuditEnabledEnv,
  PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV,
  type AcceptanceSimulationTickRequestAuditEvent,
  type AcceptanceSimulationTickRequestEndpoint,
  type AcceptanceSimulationTickRequestOriginCategory,
  type RecordTickRequestAuditInput,
} from './acceptance-simulation-tick-request-audit.js';

export type ObserveSimulationAdvanceAttemptInput = {
  readonly endpoint: AcceptanceSimulationTickRequestEndpoint;
  readonly requestedCount: number | 'INVALID_UNPARSEABLE';
  readonly admissionOutcome: RecordTickRequestAuditInput['admissionOutcome'];
  readonly reservation: RecordTickRequestAuditInput['reservation'];
  readonly simulationCompletion?: RecordTickRequestAuditInput['simulationCompletion'];
  readonly originHeader?: string | undefined;
  readonly refererHeader?: string | undefined;
};

/** Acceptance-only tick/step request audit (in-memory, default off). */
@Injectable()
export class AcceptanceSimulationTickRequestAuditService {
  readonly #store: AcceptanceSimulationTickRequestAuditStore;
  readonly #exportSink: AcceptanceSimulationTickRequestAuditExportSink;
  readonly #acceptanceSaveIsolation: boolean;
  readonly #auditEnabled: boolean;
  readonly #exportEnabled: boolean;

  constructor(
    store?: AcceptanceSimulationTickRequestAuditStore,
    exportSink?: AcceptanceSimulationTickRequestAuditExportSink,
  ) {
    const paths = resolveProjectPaths(import.meta.url);

    this.#acceptanceSaveIsolation = paths.acceptanceSaveIsolation;
    this.#auditEnabled =
      this.#acceptanceSaveIsolation &&
      parseAcceptanceTickRequestAuditEnabledEnv(
        process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_ENV],
      );
    this.#exportEnabled =
      this.#auditEnabled &&
      parseAcceptanceTickRequestAuditExportEnabledEnv(
        process.env[PROJECT_GENESIS_ACCEPTANCE_S1_TICK_REQUEST_AUDIT_EXPORT_ENV],
      );
    this.#store = store ?? new AcceptanceSimulationTickRequestAuditStore();
    this.#exportSink = exportSink ?? createStderrTickRequestAuditExportSink();
  }

  get isAcceptanceIsolationActive(): boolean {
    return this.#acceptanceSaveIsolation;
  }

  get isAuditRecordingEnabled(): boolean {
    return this.#auditEnabled;
  }

  get isAuditExportEnabled(): boolean {
    return this.#exportEnabled;
  }

  createCorrelationId(): string {
    return this.#store.createCorrelationId();
  }

  classifyOrigin(
    originHeader: string | undefined,
    refererHeader: string | undefined,
  ): AcceptanceSimulationTickRequestOriginCategory {
    return classifyTickRequestOriginCategory(originHeader, refererHeader);
  }

  /**
   * Records one attempt when acceptance isolation and audit env are both active.
   * Never throws; audit failures must not affect request handling.
   */
  observeSimulationAdvanceAttempt(input: ObserveSimulationAdvanceAttemptInput): void {
    if (!this.#auditEnabled) {
      return;
    }

    try {
      const originCategory = classifyTickRequestOriginCategory(
        input.originHeader,
        input.refererHeader,
      );

      const event = this.#store.record({
        endpoint: input.endpoint,
        requestedCount: input.requestedCount,
        admissionOutcome: input.admissionOutcome,
        reservation: input.reservation,
        simulationCompletion: input.simulationCompletion ?? 'UNKNOWN',
        originCategory,
      });

      if (this.#exportEnabled) {
        emitTickRequestAuditExportLine(event, this.#exportSink);
      }
    } catch {
      // Fail closed for observability only; never propagate.
    }
  }

  /** Test/diagnostic snapshot; empty when audit is disabled. */
  getRecordedEvents(): readonly AcceptanceSimulationTickRequestAuditEvent[] {
    if (!this.#auditEnabled) {
      return Object.freeze([]);
    }

    return this.#store.snapshot();
  }

  /** @internal Vitest-only hook */
  _resetForTests(): void {
    this.#store.clearForTests();
  }

  /** @internal Vitest-only hook to inject an isolated store */
  _getStoreForTests(): AcceptanceSimulationTickRequestAuditStore {
    return this.#store;
  }
}
