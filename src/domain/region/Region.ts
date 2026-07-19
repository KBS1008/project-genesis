/**
 * @module @domain/region/Region
 *
 * Runtime region entity initialized from static content definitions.
 */

import { Entity } from '../../common/core/Entity.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createWorldId, type WorldId } from '../world/WorldId.js';
import { createCityId, type CityId } from './CityId.js';
import { createRegionId, type RegionId } from './RegionId.js';
import type { RegionalResourceAvailability } from './RegionalResourceAvailability.js';

/** Map position of a region within the abstract world layout. */
export type MapPosition = {
  readonly x: number;
  readonly y: number;
};

/** Parameters for constructing a runtime region. */
export type CreateRegionParams = {
  readonly id: RegionId;
  readonly name: string;
  readonly description: string;
  readonly worldId: WorldId;
  readonly biomeId: string;
  readonly mapPosition: MapPosition;
  readonly neighborRegionIds: readonly RegionId[];
  readonly cityIds: readonly CityId[];
  readonly regionalResources: readonly RegionalResourceAvailability[];
};

/** Static region content used to initialize runtime state. */
export type RegionContentSeed = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly worldId: string;
  readonly biomeId: string;
  readonly mapPosition: MapPosition;
  readonly neighborRegionIds: readonly string[];
  readonly cityIds: readonly string[];
  readonly regionalResources: readonly RegionalResourceAvailability[];
};

/**
 * Spatial region runtime entity bound to one world.
 */
export class Region extends Entity<'Region'> {
  readonly #name: string;
  readonly #description: string;
  readonly #worldId: WorldId;
  readonly #biomeId: string;
  readonly #mapPosition: MapPosition;
  readonly #neighborRegionIds: readonly RegionId[];
  readonly #cityIds: readonly CityId[];
  readonly #regionalResources: readonly RegionalResourceAvailability[];

  private constructor(params: CreateRegionParams) {
    super(params.id);
    this.#name = params.name;
    this.#description = params.description;
    this.#worldId = params.worldId;
    this.#biomeId = params.biomeId;
    this.#mapPosition = Object.freeze({ ...params.mapPosition });
    this.#neighborRegionIds = Object.freeze([...params.neighborRegionIds]);
    this.#cityIds = Object.freeze([...params.cityIds]);
    this.#regionalResources = Object.freeze(
      params.regionalResources.map((entry) => Object.freeze({ ...entry })),
    );
    Object.freeze(this);
  }

  /**
   * Creates a runtime region from validated static content.
   */
  static fromContent(seed: RegionContentSeed): Result<Region, ValidationError> {
    const regionIdResult = createRegionId(seed.id);

    if (!regionIdResult.ok) {
      return Result.fail(regionIdResult.error);
    }

    const worldIdResult = createWorldId(seed.worldId);

    if (!worldIdResult.ok) {
      return Result.fail(worldIdResult.error);
    }

    const neighborRegionIds: RegionId[] = [];

    for (const rawNeighborId of [...seed.neighborRegionIds].sort((left, right) =>
      left.localeCompare(right),
    )) {
      const neighborIdResult = createRegionId(rawNeighborId);

      if (!neighborIdResult.ok) {
        return Result.fail(neighborIdResult.error);
      }

      neighborRegionIds.push(neighborIdResult.value);
    }

    const cityIds: CityId[] = [];

    for (const rawCityId of [...seed.cityIds].sort((left, right) => left.localeCompare(right))) {
      const cityIdResult = createCityId(rawCityId);

      if (!cityIdResult.ok) {
        return Result.fail(cityIdResult.error);
      }

      cityIds.push(cityIdResult.value);
    }

    const regionalResources = [...seed.regionalResources]
      .sort((left, right) => left.resourceTypeId.localeCompare(right.resourceTypeId))
      .map((entry) => Object.freeze({ ...entry }));

    return Result.ok(
      new Region({
        id: regionIdResult.value,
        name: seed.name,
        description: seed.description,
        worldId: worldIdResult.value,
        biomeId: seed.biomeId,
        mapPosition: seed.mapPosition,
        neighborRegionIds,
        cityIds,
        regionalResources,
      }),
    );
  }

  getName(): string {
    return this.#name;
  }

  getDescription(): string {
    return this.#description;
  }

  getWorldId(): WorldId {
    return this.#worldId;
  }

  getBiomeId(): string {
    return this.#biomeId;
  }

  getMapPosition(): MapPosition {
    return this.#mapPosition;
  }

  getNeighborRegionIds(): readonly RegionId[] {
    return this.#neighborRegionIds;
  }

  getCityIds(): readonly CityId[] {
    return this.#cityIds;
  }

  getRegionalResources(): readonly RegionalResourceAvailability[] {
    return this.#regionalResources;
  }

  /** Returns regional resource availability for one resource type id. */
  getRegionalResource(resourceTypeId: string): RegionalResourceAvailability | undefined {
    return this.#regionalResources.find((entry) => entry.resourceTypeId === resourceTypeId);
  }
}
