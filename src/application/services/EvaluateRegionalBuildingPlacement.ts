/**
 * Loads building footprints and regional occupancy for placement evaluation.
 */

import type { BuildingRepository } from '../../domain/building/BuildingRepository.js';
import { createBuildingTypeId } from '../../domain/building/Building.js';
import type { RegionId } from '../../domain/region/RegionId.js';
import {
  RegionalBuildingPlacementPolicy,
  type RegionalBuildingPlacementEvaluation,
} from '../../domain/policies/building/RegionalBuildingPlacementPolicy.js';
import type { GameContentLoadResult } from '../../content/validateGameContent.js';

export type EvaluateRegionalBuildingPlacementInput = {
  readonly regionId: RegionId;
  readonly buildingTypeId: string;
  readonly anchorX: number;
  readonly anchorY: number;
  readonly companyId: string;
};

export class EvaluateRegionalBuildingPlacement {
  readonly #buildingRepository: BuildingRepository;
  readonly #gameContent: GameContentLoadResult;
  readonly #policy = new RegionalBuildingPlacementPolicy();

  constructor(dependencies: {
    readonly buildingRepository: BuildingRepository;
    readonly gameContent: GameContentLoadResult;
  }) {
    this.#buildingRepository = dependencies.buildingRepository;
    this.#gameContent = dependencies.gameContent;
  }

  evaluate(input: EvaluateRegionalBuildingPlacementInput): RegionalBuildingPlacementEvaluation {
    const buildingTypeIdResult = createBuildingTypeId(input.buildingTypeId);

    if (!buildingTypeIdResult.ok) {
      return Object.freeze({
        valid: false,
        reason: buildingTypeIdResult.error.message,
        geometryVersion: 1,
      });
    }

    const buildingType = this.#gameContent.buildingTypes.get(buildingTypeIdResult.value.value);

    if (buildingType === undefined) {
      return Object.freeze({
        valid: false,
        reason: `Building type "${input.buildingTypeId}" was not found.`,
        geometryVersion: 1,
      });
    }

    const existingBuildings = this.#buildingRepository
      .findAll()
      .filter((building) => building.getRegionId().value === input.regionId.value)
      .map((building) => {
        const type = this.#gameContent.buildingTypes.get(building.getBuildingTypeId().value);
        const size = type?.size ?? { width: 1, height: 1 };

        return Object.freeze({
          x: building.getPosition().x,
          y: building.getPosition().y,
          width: size.width,
          height: size.height,
        });
      });

    return this.#policy.evaluate({
      regionId: input.regionId.value,
      anchorX: input.anchorX,
      anchorY: input.anchorY,
      footprint: buildingType.size,
      existingBuildings,
    });
  }
}
