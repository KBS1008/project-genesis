/**
 * @module @content/recipe/RecipeDefinition
 *
 * Immutable static definition of a production recipe loaded from game content.
 *
 * @see docs/schemas/Recipe.Schema.md
 * @see docs/decisions/DD-011-recipe-based-production.md
 */

/** Resource input or output entry for a recipe. */
export type RecipeResourceAmount = {
  readonly resource: string;
  readonly amount: number;
};

/** Recipe category values from the content schema. */
export const RecipeCategory = {
  WOOD: 'WOOD',
  METAL: 'METAL',
  CHEMICAL: 'CHEMICAL',
  FOOD: 'FOOD',
  ENERGY: 'ENERGY',
  ELECTRONICS: 'ELECTRONICS',
  TEXTILE: 'TEXTILE',
  LOGISTICS: 'LOGISTICS',
} as const;

export type RecipeCategory = (typeof RecipeCategory)[keyof typeof RecipeCategory];

/** Validated properties of a static recipe definition. */
export type RecipeDefinitionProps = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly version: number;
  readonly category: RecipeCategory;
  readonly buildingTypes: readonly string[];
  readonly inputs: readonly RecipeResourceAmount[];
  readonly outputs: readonly RecipeResourceAmount[];
  readonly duration: number;
  readonly energy: number;
  readonly workers: number;
  readonly requiredResearch: readonly string[];
  readonly requiredBuildings: readonly string[];
  readonly requiredMilestones: readonly string[];
  readonly requiredResources: readonly string[];
  readonly maintenanceCost: number;
  readonly productionCost: number;
  readonly experience: number;
  readonly tags: readonly string[];
  readonly enabled: boolean;
};

/**
 * Immutable static recipe loaded from content files.
 */
export class RecipeDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly version: number;
  readonly category: RecipeCategory;
  readonly buildingTypes: readonly string[];
  readonly inputs: readonly RecipeResourceAmount[];
  readonly outputs: readonly RecipeResourceAmount[];
  readonly duration: number;
  readonly energy: number;
  readonly workers: number;
  readonly requiredResearch: readonly string[];
  readonly requiredBuildings: readonly string[];
  readonly requiredMilestones: readonly string[];
  readonly requiredResources: readonly string[];
  readonly maintenanceCost: number;
  readonly productionCost: number;
  readonly experience: number;
  readonly tags: readonly string[];
  readonly enabled: boolean;

  constructor(props: RecipeDefinitionProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.version = props.version;
    this.category = props.category;
    this.buildingTypes = Object.freeze([...props.buildingTypes]);
    this.inputs = Object.freeze(props.inputs.map((entry) => Object.freeze({ ...entry })));
    this.outputs = Object.freeze(props.outputs.map((entry) => Object.freeze({ ...entry })));
    this.duration = props.duration;
    this.energy = props.energy;
    this.workers = props.workers;
    this.requiredResearch = Object.freeze([...props.requiredResearch]);
    this.requiredBuildings = Object.freeze([...props.requiredBuildings]);
    this.requiredMilestones = Object.freeze([...props.requiredMilestones]);
    this.requiredResources = Object.freeze([...props.requiredResources]);
    this.maintenanceCost = props.maintenanceCost;
    this.productionCost = props.productionCost;
    this.experience = props.experience;
    this.tags = Object.freeze([...props.tags]);
    this.enabled = props.enabled;
    Object.freeze(this);
  }
}
