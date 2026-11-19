/**
 * Terrain-aware regional building placement validation (full footprint).
 */

import { ValidationError } from '../../../common/errors/ValidationError.js';
import { Result } from '../../../common/result/Result.js';
export type BuildingFootprintSize = {
  readonly width: number;
  readonly height: number;
};
import {
  isRegionGridCellBuildable,
  REGION_BUILDABILITY_GEOMETRY_VERSION,
} from '../../world/region-buildability-geometry.js';
import { REGION_LOCAL_PLACEMENT_GRID_EXTENT } from '../../world/RegionLocalPlacementGrid.js';

export type ExistingRegionalBuildingFootprint = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export type RegionalBuildingPlacementInput = {
  readonly regionId: string;
  readonly anchorX: number;
  readonly anchorY: number;
  readonly footprint: BuildingFootprintSize;
  readonly existingBuildings: readonly ExistingRegionalBuildingFootprint[];
};

export type RegionalBuildingPlacementEvaluation = {
  readonly valid: boolean;
  readonly reason: string | null;
  readonly geometryVersion: number;
};

function rectanglesOverlap(
  left: ExistingRegionalBuildingFootprint,
  right: ExistingRegionalBuildingFootprint,
): boolean {
  return (
    left.x < right.x + right.width &&
    left.x + left.width > right.x &&
    left.y < right.y + right.height &&
    left.y + left.height > right.y
  );
}

/**
 * Evaluates whether a building footprint may be placed on the regional grid.
 */
export class RegionalBuildingPlacementPolicy {
  evaluate(input: RegionalBuildingPlacementInput): RegionalBuildingPlacementEvaluation {
    const extent = REGION_LOCAL_PLACEMENT_GRID_EXTENT;
    const { footprint, anchorX, anchorY, regionId, existingBuildings } = input;

    if (footprint.width <= 0 || footprint.height <= 0) {
      return Object.freeze({
        valid: false,
        reason: 'Ungültige Gebäudefläche.',
        geometryVersion: REGION_BUILDABILITY_GEOMETRY_VERSION,
      });
    }

    if (
      anchorX < 0 ||
      anchorY < 0 ||
      anchorX + footprint.width > extent ||
      anchorY + footprint.height > extent
    ) {
      return Object.freeze({
        valid: false,
        reason: 'Außerhalb der Region.',
        geometryVersion: REGION_BUILDABILITY_GEOMETRY_VERSION,
      });
    }

    for (let dy = 0; dy < footprint.height; dy++) {
      for (let dx = 0; dx < footprint.width; dx++) {
        const cellX = anchorX + dx;
        const cellY = anchorY + dy;

        if (!isRegionGridCellBuildable(regionId, cellX, cellY)) {
          return Object.freeze({
            valid: false,
            reason: 'Gelände nicht bebaubar.',
            geometryVersion: REGION_BUILDABILITY_GEOMETRY_VERSION,
          });
        }
      }
    }

    const candidateFootprint = Object.freeze({
      x: anchorX,
      y: anchorY,
      width: footprint.width,
      height: footprint.height,
    });

    for (const existing of existingBuildings) {
      if (rectanglesOverlap(candidateFootprint, existing)) {
        return Object.freeze({
          valid: false,
          reason: 'Gebäude überschneidet sich.',
          geometryVersion: REGION_BUILDABILITY_GEOMETRY_VERSION,
        });
      }
    }

    return Object.freeze({
      valid: true,
      reason: null,
      geometryVersion: REGION_BUILDABILITY_GEOMETRY_VERSION,
    });
  }

  evaluateAsResult(input: RegionalBuildingPlacementInput): Result<true, ValidationError> {
    const evaluation = this.evaluate(input);

    if (!evaluation.valid) {
      return Result.fail(new ValidationError(evaluation.reason ?? 'Platzierung ungültig.'));
    }

    return Result.ok(true);
  }
}
