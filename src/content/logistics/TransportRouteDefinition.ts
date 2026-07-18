/**
 * @module @content/logistics/TransportRouteDefinition
 *
 * Static transport route definition loaded from game content.
 *
 * @see docs/gameplay/transport.md
 * @see docs/decisions/DD-022–abstract-logistics-network.md
 */

import type { BuildingCategory } from '../building/BuildingTypeDefinition.js';

/** Validated properties of one abstract logistics route. */
export type TransportRouteDefinitionProps = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly sourceCategory: BuildingCategory | null;
  readonly destinationCategory: BuildingCategory | null;
  readonly sourceBuildingTypeId: string | null;
  readonly destinationBuildingTypeId: string | null;
  readonly durationTicks: number;
  readonly throughputCapacity: number;
  readonly enabled: boolean;
  readonly version: number;
};

/**
 * Immutable route rule mapping building pairs to transport duration.
 */
export class TransportRouteDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly sourceCategory: BuildingCategory | null;
  readonly destinationCategory: BuildingCategory | null;
  readonly sourceBuildingTypeId: string | null;
  readonly destinationBuildingTypeId: string | null;
  readonly durationTicks: number;
  readonly throughputCapacity: number;
  readonly enabled: boolean;
  readonly version: number;

  constructor(props: TransportRouteDefinitionProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.sourceCategory = props.sourceCategory;
    this.destinationCategory = props.destinationCategory;
    this.sourceBuildingTypeId = props.sourceBuildingTypeId;
    this.destinationBuildingTypeId = props.destinationBuildingTypeId;
    this.durationTicks = props.durationTicks;
    this.throughputCapacity = props.throughputCapacity;
    this.enabled = props.enabled;
    this.version = props.version;
    Object.freeze(this);
  }
}
