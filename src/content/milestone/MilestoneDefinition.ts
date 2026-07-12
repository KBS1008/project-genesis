/**
 * @module @content/milestone/MilestoneDefinition
 *
 * Immutable static definition of a milestone loaded from game content.
 */

/** Supported milestone trigger types for version 1. */
export const MilestoneTriggerType = {
  FIRST_SALE: 'FIRST_SALE',
} as const;

export type MilestoneTriggerType =
  (typeof MilestoneTriggerType)[keyof typeof MilestoneTriggerType];

/** Trigger configuration for automatic milestone detection. */
export type MilestoneTriggerDefinition = {
  readonly type: MilestoneTriggerType;
};

/** Validated properties of a static milestone definition. */
export type MilestoneDefinitionProps = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly trigger: MilestoneTriggerDefinition;
  readonly enabled: boolean;
  readonly version: number;
};

/**
 * Immutable static milestone loaded from content files.
 */
export class MilestoneDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly trigger: MilestoneTriggerDefinition;
  readonly enabled: boolean;
  readonly version: number;

  constructor(props: MilestoneDefinitionProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.trigger = Object.freeze({ ...props.trigger });
    this.enabled = props.enabled;
    this.version = props.version;
    Object.freeze(this);
  }
}
