/**
 * @module @content/research/TechnologyDefinition
 *
 * Immutable static definition of a research technology loaded from game content.
 */

/** Research area values from gameplay documentation. */
export const TechnologyCategory = {
  PRODUCTION: 'PRODUCTION',
  BUILDING: 'BUILDING',
  ENERGY: 'ENERGY',
  LOGISTICS: 'LOGISTICS',
  MANAGEMENT: 'MANAGEMENT',
} as const;

export type TechnologyCategory = (typeof TechnologyCategory)[keyof typeof TechnologyCategory];

/** Validated properties of a static technology definition. */
export type TechnologyDefinitionProps = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: TechnologyCategory;
  readonly requiredResearch: readonly string[];
  readonly requiredMilestones: readonly string[];
  readonly researchCost: number;
  readonly researchDuration: number;
  readonly enabled: boolean;
  readonly version: number;
};

/**
 * Immutable static technology loaded from content files.
 */
export class TechnologyDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: TechnologyCategory;
  readonly requiredResearch: readonly string[];
  readonly requiredMilestones: readonly string[];
  readonly researchCost: number;
  readonly researchDuration: number;
  readonly enabled: boolean;
  readonly version: number;

  constructor(props: TechnologyDefinitionProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.category = props.category;
    this.requiredResearch = Object.freeze([...props.requiredResearch]);
    this.requiredMilestones = Object.freeze([...props.requiredMilestones]);
    this.researchCost = props.researchCost;
    this.researchDuration = props.researchDuration;
    this.enabled = props.enabled;
    this.version = props.version;
    Object.freeze(this);
  }
}
