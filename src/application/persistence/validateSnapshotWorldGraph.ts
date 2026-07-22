/**
 * @module @application/persistence/validateSnapshotWorldGraph
 *
 * Validates persisted world and region references against bootstrapped content.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createRegionId } from '../../domain/region/RegionId.js';
import type { RegionRepository } from '../../domain/region/RegionRepository.js';
import { createWorldId, type WorldId } from '../../domain/world/WorldId.js';
import type { World } from '../../domain/world/World.js';
import type { WorldRepository } from '../../domain/world/WorldRepository.js';
import type { GameSaveSnapshotV3 } from './GameSaveSnapshotV3.js';

/**
 * Ensures snapshot world metadata and region references match loaded content.
 */
export function validateSnapshotWorldGraph(
  snapshot: GameSaveSnapshotV3,
  worldRepository: WorldRepository,
  regionRepository: RegionRepository,
): Result<void, ValidationError> {
  const worldIdResult = createWorldId(snapshot.world.activeWorldId);

  if (!worldIdResult.ok) {
    return Result.fail(worldIdResult.error);
  }

  const world = worldRepository.findById(worldIdResult.value);

  if (world === undefined) {
    return Result.fail(
      new ValidationError(`World id "${snapshot.world.activeWorldId}" was not found.`),
    );
  }

  for (const building of snapshot.buildings) {
    const regionValidation = validateRegionInWorld(
      building.regionId,
      worldIdResult.value,
      world,
      regionRepository,
      `Building "${building.id}"`,
    );

    if (!regionValidation.ok) {
      return regionValidation;
    }
  }

  for (const order of snapshot.transportOrders) {
    for (const regionId of [order.sourceRegionId, order.destinationRegionId]) {
      const regionValidation = validateRegionInWorld(
        regionId,
        worldIdResult.value,
        world,
        regionRepository,
        `Transport order "${order.id}"`,
      );

      if (!regionValidation.ok) {
        return regionValidation;
      }
    }
  }

  for (const mapping of snapshot.marketRegionMappings) {
    const regionIdResult = createRegionId(mapping.regionId);

    if (!regionIdResult.ok) {
      return Result.fail(regionIdResult.error);
    }

    const region = regionRepository.findById(regionIdResult.value);

    if (region === undefined) {
      return Result.fail(new ValidationError(`Region id "${mapping.regionId}" was not found.`));
    }

    if (!region.getWorldId().equals(worldIdResult.value)) {
      return Result.fail(
        new ValidationError(
          `Market "${mapping.marketId}" references region "${mapping.regionId}" outside active world "${snapshot.world.activeWorldId}".`,
        ),
      );
    }
  }

  return Result.ok(undefined);
}

function validateRegionInWorld(
  rawRegionId: string,
  worldId: WorldId,
  world: World,
  regionRepository: RegionRepository,
  subjectLabel: string,
): Result<void, ValidationError> {
  const regionIdResult = createRegionId(rawRegionId);

  if (!regionIdResult.ok) {
    return Result.fail(regionIdResult.error);
  }

  const region = regionRepository.findById(regionIdResult.value);

  if (region === undefined) {
    return Result.fail(new ValidationError(`Region id "${rawRegionId}" was not found.`));
  }

  if (!region.getWorldId().equals(worldId)) {
    return Result.fail(
      new ValidationError(
        `${subjectLabel} references region "${rawRegionId}" outside active world "${worldId.value}".`,
      ),
    );
  }

  if (!world.containsRegion(regionIdResult.value)) {
    return Result.fail(
      new ValidationError(
        `${subjectLabel} references region "${rawRegionId}" not listed in world "${worldId.value}".`,
      ),
    );
  }

  return Result.ok(undefined);
}
