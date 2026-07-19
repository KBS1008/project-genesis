/**
 * @module @domain/world/World
 *
 * Runtime world entity initialized from static content definitions.
 */

import { Entity } from '../../common/core/Entity.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createRegionId, type RegionId } from '../region/RegionId.js';
import { createWorldId, type WorldId } from './WorldId.js';

/** Parameters for constructing a runtime world. */
export type CreateWorldParams = {
  readonly id: WorldId;
  readonly name: string;
  readonly regionIds: readonly RegionId[];
};

/** Static world content used to initialize runtime state. */
export type WorldContentSeed = {
  readonly id: string;
  readonly name: string;
  readonly regionIds: readonly string[];
};

/**
 * Top-level spatial runtime context exposing deterministic region membership.
 */
export class World extends Entity<'World'> {
  readonly #name: string;
  readonly #regionIds: readonly RegionId[];

  private constructor(params: CreateWorldParams) {
    super(params.id);
    this.#name = params.name;
    this.#regionIds = Object.freeze([...params.regionIds]);
    Object.freeze(this);
  }

  /**
   * Creates a runtime world from validated static content.
   */
  static fromContent(seed: WorldContentSeed): Result<World, ValidationError> {
    const worldIdResult = createWorldId(seed.id);

    if (!worldIdResult.ok) {
      return Result.fail(worldIdResult.error);
    }

    const regionIds: RegionId[] = [];

    for (const rawRegionId of [...seed.regionIds].sort((left, right) =>
      left.localeCompare(right),
    )) {
      const regionIdResult = createRegionId(rawRegionId);

      if (!regionIdResult.ok) {
        return Result.fail(regionIdResult.error);
      }

      regionIds.push(regionIdResult.value);
    }

    return Result.ok(
      new World({
        id: worldIdResult.value,
        name: seed.name,
        regionIds,
      }),
    );
  }

  /** Display name from content. */
  getName(): string {
    return this.#name;
  }

  /** Region membership in deterministic id order. */
  getRegionIds(): readonly RegionId[] {
    return this.#regionIds;
  }

  /** Returns whether the world contains a region id. */
  containsRegion(regionId: RegionId): boolean {
    return this.#regionIds.some((candidate) => candidate.equals(regionId));
  }
}
