/**
 * @module @content/world/WorldDefinition
 *
 * Immutable static world definition loaded from game content.
 */

/** Validated properties of a static world definition. */
export type WorldDefinitionProps = {
  readonly id: string;
  readonly name: string;
  readonly regionIds: readonly string[];
  readonly enabled: boolean;
  readonly version: number;
};

/**
 * Immutable world loaded from content files.
 */
export class WorldDefinition {
  readonly id: string;
  readonly name: string;
  readonly regionIds: readonly string[];
  readonly enabled: boolean;
  readonly version: number;

  constructor(props: WorldDefinitionProps) {
    this.id = props.id;
    this.name = props.name;
    this.regionIds = Object.freeze([...props.regionIds]);
    this.enabled = props.enabled;
    this.version = props.version;
    Object.freeze(this);
  }
}
