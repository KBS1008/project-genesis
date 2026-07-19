/**
 * @module @content/city/CityDefinition
 *
 * Immutable static city definition loaded from game content.
 */

/** Supported city categories for version 1. */
export const CityCategory = {
  MARKET_HUB: 'MARKET_HUB',
  INDUSTRIAL: 'INDUSTRIAL',
} as const;

export type CityCategory = (typeof CityCategory)[keyof typeof CityCategory];

/** Validated properties of a static city definition. */
export type CityDefinitionProps = {
  readonly id: string;
  readonly name: string;
  readonly regionId: string;
  readonly category: CityCategory;
  readonly enabled: boolean;
  readonly version: number;
};

/**
 * Immutable city loaded from content files.
 */
export class CityDefinition {
  readonly id: string;
  readonly name: string;
  readonly regionId: string;
  readonly category: CityCategory;
  readonly enabled: boolean;
  readonly version: number;

  constructor(props: CityDefinitionProps) {
    this.id = props.id;
    this.name = props.name;
    this.regionId = props.regionId;
    this.category = props.category;
    this.enabled = props.enabled;
    this.version = props.version;
    Object.freeze(this);
  }
}
