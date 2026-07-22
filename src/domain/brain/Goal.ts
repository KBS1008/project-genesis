/**
 * @module @domain/brain/Goal
 *
 * Immutable company goal generated during planning.
 */

import type { GoalId } from './GoalId.js';
import type { GoalKind } from './GoalKind.js';
import type { GoalStatus } from './GoalStatus.js';

/** Properties required to construct a company goal. */
export type GoalProps = {
  readonly id: GoalId;
  readonly kind: GoalKind;
  readonly description: string;
  readonly priority: number;
  readonly status: GoalStatus;
  readonly createdAtTick: number;
  readonly regionId?: string;
  readonly resourceId?: string;
  readonly buildingTypeId?: string;
  readonly technologyId?: string;
};

/**
 * Immutable goal representing a medium or long-term company objective.
 */
export class Goal {
  readonly id: GoalId;
  readonly kind: GoalKind;
  readonly description: string;
  readonly priority: number;
  readonly status: GoalStatus;
  readonly createdAtTick: number;
  readonly regionId?: string;
  readonly resourceId?: string;
  readonly buildingTypeId?: string;
  readonly technologyId?: string;

  constructor(props: GoalProps) {
    this.id = props.id;
    this.kind = props.kind;
    this.description = props.description;
    this.priority = props.priority;
    this.status = props.status;
    this.createdAtTick = props.createdAtTick;

    if (props.regionId !== undefined) {
      this.regionId = props.regionId;
    }

    if (props.resourceId !== undefined) {
      this.resourceId = props.resourceId;
    }

    if (props.buildingTypeId !== undefined) {
      this.buildingTypeId = props.buildingTypeId;
    }

    if (props.technologyId !== undefined) {
      this.technologyId = props.technologyId;
    }

    Object.freeze(this);
  }

  /** Returns a copy with an updated status. */
  withStatus(status: GoalStatus): Goal {
    return new Goal({ ...this, status });
  }
}
