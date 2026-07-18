/**
 * @module @content/validateTransportRouteReferences
 *
 * Validates transport route references against loaded building types.
 */

import type { BuildingTypeRegistry } from './building/BuildingTypeRegistry.js';
import type { TransportRouteRegistry } from './logistics/TransportRouteRegistry.js';
import { Result } from '../common/result/Result.js';
import { ContentLoadError } from './errors/ContentLoadError.js';

/**
 * Ensures route building type ids exist and category pairs reference known categories.
 */
export function validateTransportRouteReferences(
  transportRoutes: TransportRouteRegistry,
  buildingTypes: BuildingTypeRegistry,
): Result<void, ContentLoadError> {
  for (const route of transportRoutes.getAll()) {
    if (route.sourceBuildingTypeId !== null && !buildingTypes.has(route.sourceBuildingTypeId)) {
      return Result.fail(
        new ContentLoadError(
          `Transport route "${route.id}" references unknown sourceBuildingTypeId "${route.sourceBuildingTypeId}".`,
          { contentId: route.id },
        ),
      );
    }

    if (
      route.destinationBuildingTypeId !== null &&
      !buildingTypes.has(route.destinationBuildingTypeId)
    ) {
      return Result.fail(
        new ContentLoadError(
          `Transport route "${route.id}" references unknown destinationBuildingTypeId "${route.destinationBuildingTypeId}".`,
          { contentId: route.id },
        ),
      );
    }

    if (route.sourceCategory !== null) {
      const hasCategory = buildingTypes
        .getAll()
        .some((buildingType) => buildingType.category === route.sourceCategory);

      if (!hasCategory) {
        return Result.fail(
          new ContentLoadError(
            `Transport route "${route.id}" references sourceCategory "${route.sourceCategory}" with no matching building type.`,
            { contentId: route.id },
          ),
        );
      }
    }

    if (route.destinationCategory !== null) {
      const hasCategory = buildingTypes
        .getAll()
        .some((buildingType) => buildingType.category === route.destinationCategory);

      if (!hasCategory) {
        return Result.fail(
          new ContentLoadError(
            `Transport route "${route.id}" references destinationCategory "${route.destinationCategory}" with no matching building type.`,
            { contentId: route.id },
          ),
        );
      }
    }
  }

  return Result.ok(undefined);
}
