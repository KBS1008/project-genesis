/**
 * @module @domain/brain/CompanyDecision
 *
 * Immutable validated decision awaiting execution through application use cases.
 */

import type { CompanyDecisionId } from './CompanyDecisionId.js';
import type { CompanyDecisionPayload } from './CompanyDecisionPayload.js';
import type { CompanyDecisionStatus } from './CompanyDecisionStatus.js';
import type { CompanyDecisionType } from './CompanyDecisionType.js';
import type { PlanningLayer } from './PlanningLayer.js';

/** Properties required to construct a company decision. */
export type CompanyDecisionProps = {
  readonly id: CompanyDecisionId;
  readonly type: CompanyDecisionType;
  readonly status: CompanyDecisionStatus;
  readonly layer: PlanningLayer;
  readonly priority: number;
  readonly createdAtTick: number;
  readonly payload: CompanyDecisionPayload;
};

/**
 * Immutable company decision produced by planning and executed later.
 */
export class CompanyDecision {
  readonly id: CompanyDecisionId;
  readonly type: CompanyDecisionType;
  readonly status: CompanyDecisionStatus;
  readonly layer: PlanningLayer;
  readonly priority: number;
  readonly createdAtTick: number;
  readonly payload: CompanyDecisionPayload;

  constructor(props: CompanyDecisionProps) {
    this.id = props.id;
    this.type = props.type;
    this.status = props.status;
    this.layer = props.layer;
    this.priority = props.priority;
    this.createdAtTick = props.createdAtTick;
    this.payload = props.payload;
    Object.freeze(this);
  }

  /** Returns a copy with an updated status. */
  withStatus(status: CompanyDecisionStatus): CompanyDecision {
    return new CompanyDecision({ ...this, status });
  }
}
