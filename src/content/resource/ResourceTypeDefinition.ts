/**
 * @module @content/resource/ResourceTypeDefinition
 *
 * Immutable static definition of a resource type loaded from game content.
 *
 * @see docs/schemas/ResourceType.Schema.md
 * @see docs/decisions/DD-015-static-definitions-vs-dynamic-state.md
 */

/** Resource category values from the content schema. */
export const ResourceCategory = {
  PRIMARY_RESOURCE: 'PRIMARY_RESOURCE',
  PROCESSED_RESOURCE: 'PROCESSED_RESOURCE',
  INDUSTRIAL_MATERIAL: 'INDUSTRIAL_MATERIAL',
  COMPONENT: 'COMPONENT',
  PRODUCT: 'PRODUCT',
  SPECIAL: 'SPECIAL',
} as const;

export type ResourceCategory = (typeof ResourceCategory)[keyof typeof ResourceCategory];

/** Physical state of a resource. */
export const ResourceState = {
  SOLID: 'SOLID',
  LIQUID: 'LIQUID',
  GAS: 'GAS',
  ENERGY: 'ENERGY',
} as const;

export type ResourceState = (typeof ResourceState)[keyof typeof ResourceState];

/** Required storage type for a resource. */
export const ResourceStorageType = {
  WAREHOUSE: 'WAREHOUSE',
  SILO: 'SILO',
  TANK: 'TANK',
  REFRIGERATED: 'REFRIGERATED',
  HAZARDOUS: 'HAZARDOUS',
} as const;

export type ResourceStorageType = (typeof ResourceStorageType)[keyof typeof ResourceStorageType];

/** Preferred transport type for a resource. */
export const ResourceTransportType = {
  TRUCK: 'TRUCK',
  TRAIN: 'TRAIN',
  SHIP: 'SHIP',
  PIPELINE: 'PIPELINE',
  POWER_GRID: 'POWER_GRID',
} as const;

export type ResourceTransportType =
  (typeof ResourceTransportType)[keyof typeof ResourceTransportType];

/** Validated properties of a static resource type definition. */
export type ResourceTypeDefinitionProps = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ResourceCategory;
  readonly tier: number;
  readonly state: ResourceState;
  readonly weight: number;
  readonly volume: number;
  readonly basePrice: number;
  readonly marketEnabled: boolean;
  readonly tradable: boolean;
  readonly stackSize: number;
  readonly storageType: ResourceStorageType;
  readonly transportType: ResourceTransportType;
  readonly qualityEnabled: boolean;
  readonly decayEnabled: boolean;
  readonly hazardous: boolean;
  readonly flammable: boolean;
  readonly recyclable: boolean;
  readonly energyValue: number;
  readonly requiredResearch: readonly string[];
  readonly tags: readonly string[];
  readonly enabled: boolean;
  readonly version: number;
};

/**
 * Immutable static resource type loaded from content files.
 */
export class ResourceTypeDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ResourceCategory;
  readonly tier: number;
  readonly state: ResourceState;
  readonly weight: number;
  readonly volume: number;
  readonly basePrice: number;
  readonly marketEnabled: boolean;
  readonly tradable: boolean;
  readonly stackSize: number;
  readonly storageType: ResourceStorageType;
  readonly transportType: ResourceTransportType;
  readonly qualityEnabled: boolean;
  readonly decayEnabled: boolean;
  readonly hazardous: boolean;
  readonly flammable: boolean;
  readonly recyclable: boolean;
  readonly energyValue: number;
  readonly requiredResearch: readonly string[];
  readonly tags: readonly string[];
  readonly enabled: boolean;
  readonly version: number;

  constructor(props: ResourceTypeDefinitionProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.category = props.category;
    this.tier = props.tier;
    this.state = props.state;
    this.weight = props.weight;
    this.volume = props.volume;
    this.basePrice = props.basePrice;
    this.marketEnabled = props.marketEnabled;
    this.tradable = props.tradable;
    this.stackSize = props.stackSize;
    this.storageType = props.storageType;
    this.transportType = props.transportType;
    this.qualityEnabled = props.qualityEnabled;
    this.decayEnabled = props.decayEnabled;
    this.hazardous = props.hazardous;
    this.flammable = props.flammable;
    this.recyclable = props.recyclable;
    this.energyValue = props.energyValue;
    this.requiredResearch = Object.freeze([...props.requiredResearch]);
    this.tags = Object.freeze([...props.tags]);
    this.enabled = props.enabled;
    this.version = props.version;
    Object.freeze(this);
  }
}
