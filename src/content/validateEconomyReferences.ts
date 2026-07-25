/**
 * @module @content/validateEconomyReferences
 *
 * Validates cross-registry references for economy content.
 */

import { Result } from '../common/result/Result.js';
import type { BuildingTypeRegistry } from './building/BuildingTypeRegistry.js';
import type { SupplyContractTemplateRegistry } from './economy/SupplyContractTemplateRegistry.js';
import { ContentLoadError } from './errors/ContentLoadError.js';
import type { RegionRegistry } from './region/RegionRegistry.js';
import type { ResourceTypeRegistry } from './resource/ResourceTypeRegistry.js';
import type { TechnologyRegistry } from './research/TechnologyRegistry.js';

function validateReference(
  ownerId: string,
  field: string,
  reference: string,
  has: (id: string) => boolean,
  registryName: string,
): Result<void, ContentLoadError> {
  if (!has(reference)) {
    return Result.fail(
      new ContentLoadError(
        `${ownerId} references unknown ${registryName} "${reference}" in "${field}".`,
        { contentId: ownerId },
      ),
    );
  }

  return Result.ok(undefined);
}

function validateReferenceList(
  ownerId: string,
  field: string,
  references: readonly string[],
  has: (id: string) => boolean,
  registryName: string,
): Result<void, ContentLoadError> {
  for (const reference of references) {
    const result = validateReference(ownerId, field, reference, has, registryName);

    if (!result.ok) {
      return result;
    }
  }

  return Result.ok(undefined);
}

/**
 * Ensures economy content references resolve across registries.
 */
export function validateEconomyReferences(
  supplyContractTemplates: SupplyContractTemplateRegistry,
  regions: RegionRegistry,
  resourceTypes: ResourceTypeRegistry,
  buildingTypes: BuildingTypeRegistry,
  technologies: TechnologyRegistry,
): Result<void, ContentLoadError> {
  for (const template of supplyContractTemplates.getAll()) {
    const resourceResult = validateReference(
      template.id,
      'resourceId',
      template.resourceId,
      resourceTypes.has.bind(resourceTypes),
      'resource type',
    );

    if (!resourceResult.ok) {
      return resourceResult;
    }

    if (template.regionId !== null) {
      const regionResult = validateReference(
        template.id,
        'regionId',
        template.regionId,
        regions.has.bind(regions),
        'region',
      );

      if (!regionResult.ok) {
        return regionResult;
      }
    }

    const researchResult = validateReferenceList(
      template.id,
      'requirements.research',
      template.requirements.research,
      technologies.has.bind(technologies),
      'technology',
    );

    if (!researchResult.ok) {
      return researchResult;
    }

    const buildingResult = validateReferenceList(
      template.id,
      'requirements.buildings',
      template.requirements.buildings,
      buildingTypes.has.bind(buildingTypes),
      'building type',
    );

    if (!buildingResult.ok) {
      return buildingResult;
    }
  }

  return Result.ok(undefined);
}
