/**
 * @module @content/building/BuildingTypeDefinition
 *
 * Immutable static definition of a building type loaded from game content.
 *
 * @see docs/schemas/Building.schema.md
 * @see docs/decisions/DD-014-template-vs-instance_architecture.md
 * @see docs/decisions/DD-015-static-definitions-vs-dynamic-state.md
 */

/** Building category values from gameplay and schema documentation. */
export const BuildingCategory = {
  PRODUCTION: 'PRODUCTION',
  ENERGY: 'ENERGY',
  STORAGE: 'STORAGE',
  INFRASTRUCTURE: 'INFRASTRUCTURE',
  ADMINISTRATION: 'ADMINISTRATION',
  RESEARCH: 'RESEARCH',
} as const;

export type BuildingCategory = (typeof BuildingCategory)[keyof typeof BuildingCategory];

/** Footprint size of a building type on the company grid. */
export type BuildingSize = {
  readonly width: number;
  readonly height: number;
};

/** Validated properties of a static building type definition. */
export type BuildingTypeDefinitionProps = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: BuildingCategory;
  readonly size: BuildingSize;
  readonly energyUsage: number;
  readonly energyGeneration: number;
  readonly maintenanceCost: number;
  readonly constructionCost: number;
  readonly constructionTime: number;
  readonly allowedRecipes: readonly string[];
  readonly maxProductionLines: number;
  readonly requiredResearch: readonly string[];
  readonly requiredMilestones: readonly string[];
  readonly enabled: boolean;
  readonly version: number;
};

/**
 * Immutable static building type loaded from content files.
 */
export class BuildingTypeDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: BuildingCategory;
  readonly size: BuildingSize;
  readonly energyUsage: number;
  readonly energyGeneration: number;
  readonly maintenanceCost: number;
  readonly constructionCost: number;
  readonly constructionTime: number;
  readonly allowedRecipes: readonly string[];
  readonly maxProductionLines: number;
  readonly requiredResearch: readonly string[];
  readonly requiredMilestones: readonly string[];
  readonly enabled: boolean;
  readonly version: number;

  constructor(props: BuildingTypeDefinitionProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.category = props.category;
    this.size = Object.freeze({ ...props.size });
    this.energyUsage = props.energyUsage;
    this.energyGeneration = props.energyGeneration;
    this.maintenanceCost = props.maintenanceCost;
    this.constructionCost = props.constructionCost;
    this.constructionTime = props.constructionTime;
    this.allowedRecipes = Object.freeze([...props.allowedRecipes]);
    this.maxProductionLines = props.maxProductionLines;
    this.requiredResearch = Object.freeze([...props.requiredResearch]);
    this.requiredMilestones = Object.freeze([...props.requiredMilestones]);
    this.enabled = props.enabled;
    this.version = props.version;
    Object.freeze(this);
  }
}
