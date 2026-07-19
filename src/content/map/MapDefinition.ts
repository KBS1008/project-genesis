/**
 * @module @content/map/MapDefinition
 *
 * Immutable static map layout definition loaded from game content.
 */

/** Region placement on the abstract world map. */
export type MapRegionPlacement = {
  readonly regionId: string;
  readonly x: number;
  readonly y: number;
};

/** Connection between two regions on the abstract map. */
export type MapRegionConnection = {
  readonly fromRegionId: string;
  readonly toRegionId: string;
  readonly distance: number;
};

/** Validated properties of a static map definition. */
export type MapDefinitionProps = {
  readonly id: string;
  readonly name: string;
  readonly regions: readonly MapRegionPlacement[];
  readonly connections: readonly MapRegionConnection[];
  readonly enabled: boolean;
  readonly version: number;
};

/**
 * Immutable map layout loaded from content files.
 */
export class MapDefinition {
  readonly id: string;
  readonly name: string;
  readonly regions: readonly MapRegionPlacement[];
  readonly connections: readonly MapRegionConnection[];
  readonly enabled: boolean;
  readonly version: number;

  constructor(props: MapDefinitionProps) {
    this.id = props.id;
    this.name = props.name;
    this.regions = Object.freeze(
      props.regions.map((placement) => Object.freeze({ ...placement })),
    );
    this.connections = Object.freeze(
      props.connections.map((connection) => Object.freeze({ ...connection })),
    );
    this.enabled = props.enabled;
    this.version = props.version;
    Object.freeze(this);
  }
}
