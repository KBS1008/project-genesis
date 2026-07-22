/**
 * @module @domain/brain/ActiveStrategy
 *
 * Runtime reference to the active content strategy for a company brain.
 */

/** Properties of the active strategy assigned to a company brain. */
export type ActiveStrategyProps = {
  readonly strategyDefinitionId: string;
  readonly appliedAtTick: number;
};

/**
 * Immutable runtime strategy state referencing content definitions.
 *
 * Strategies modify planning weights only; they never implement custom algorithms.
 */
export class ActiveStrategy {
  readonly strategyDefinitionId: string;
  readonly appliedAtTick: number;

  constructor(props: ActiveStrategyProps) {
    this.strategyDefinitionId = props.strategyDefinitionId;
    this.appliedAtTick = props.appliedAtTick;
    Object.freeze(this);
  }
}
