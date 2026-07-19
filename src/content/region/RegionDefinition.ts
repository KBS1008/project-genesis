/**
 * @module @content/region/RegionDefinition
 *
 * Immutable static region definition loaded from game content.
 */

/** Map position of a region within the world layout. */
export type MapPosition = {
  readonly x: number;
  readonly y: number;
};

/** Regional resource availability entry (Option A — no depletion). */
export type RegionalResourceEntry = {
  readonly resourceTypeId: string;
  readonly available: boolean;
  readonly extractionModifier: number;
};

/** Validated properties of a static region definition. */
export type RegionDefinitionProps = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly worldId: string;
  readonly biomeId: string;
  readonly mapPosition: MapPosition;
  readonly neighborRegionIds: readonly string[];
  readonly cityIds: readonly string[];
  readonly regionalResources: readonly RegionalResourceEntry[];
  readonly enabled: boolean;
  readonly version: number;
};

/**
 * Immutable region loaded from content files.
 */
export class RegionDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly worldId: string;
  readonly biomeId: string;
  readonly mapPosition: MapPosition;
  readonly neighborRegionIds: readonly string[];
  readonly cityIds: readonly string[];
  readonly regionalResources: readonly RegionalResourceEntry[];
  readonly enabled: boolean;
  readonly version: number;

  constructor(props: RegionDefinitionProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.worldId = props.worldId;
    this.biomeId = props.biomeId;
    this.mapPosition = Object.freeze({ ...props.mapPosition });
    this.neighborRegionIds = Object.freeze([...props.neighborRegionIds]);
    this.cityIds = Object.freeze([...props.cityIds]);
    this.regionalResources = Object.freeze(
      props.regionalResources.map((entry) => Object.freeze({ ...entry })),
    );
    this.enabled = props.enabled;
    this.version = props.version;
    Object.freeze(this);
  }
}
