/**
 * @module @content/biome/BiomeDefinition
 *
 * Immutable static biome definition loaded from game content.
 */

/** Validated properties of a static biome definition. */
export type BiomeDefinitionProps = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly constructionCostModifier: number;
  readonly transportDurationModifier: number;
  readonly enabled: boolean;
  readonly version: number;
};

/**
 * Immutable biome loaded from content files.
 */
export class BiomeDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly constructionCostModifier: number;
  readonly transportDurationModifier: number;
  readonly enabled: boolean;
  readonly version: number;

  constructor(props: BiomeDefinitionProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.category = props.category;
    this.constructionCostModifier = props.constructionCostModifier;
    this.transportDurationModifier = props.transportDurationModifier;
    this.enabled = props.enabled;
    this.version = props.version;
    Object.freeze(this);
  }
}
