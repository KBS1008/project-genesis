/**
 * @module @content/strategy/StrategyDefinition
 *
 * Immutable static strategy definition loaded from game content.
 *
 * Strategies modify planning weights only; they never implement custom algorithms.
 *
 * @see docs/schemas/Strategy.schema.md
 */

/** Planning weight profile for a company strategy. */
export type StrategyWeights = {
  readonly expansionWeight: number;
  readonly productionWeight: number;
  readonly tradingWeight: number;
  readonly researchWeight: number;
  readonly riskTolerance: number;
  readonly liquidityPreference: number;
};

/** Validated properties of a static strategy definition. */
export type StrategyDefinitionProps = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly profile: string;
  readonly weights: StrategyWeights;
  readonly enabled: boolean;
  readonly version: number;
};

/**
 * Immutable strategy loaded from content files.
 */
export class StrategyDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly profile: string;
  readonly weights: StrategyWeights;
  readonly enabled: boolean;
  readonly version: number;

  constructor(props: StrategyDefinitionProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.profile = props.profile;
    this.weights = Object.freeze({ ...props.weights });
    this.enabled = props.enabled;
    this.version = props.version;
    Object.freeze(this);
  }
}
