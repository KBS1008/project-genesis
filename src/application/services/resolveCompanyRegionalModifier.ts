/**
 * @module @application/services/resolveCompanyRegionalModifier
 *
 * Aggregates regional modifier profiles across a company's active buildings.
 */

import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import type { BuildingRepository } from '../../domain/building/BuildingRepository.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import {
  resolveRegionalEnergyAvailabilityMultiplier,
  resolveRegionalResearchMultiplier,
} from '../../domain/region/RegionalModifierResolver.js';
import { DEFAULT_REGION_ID } from '../../domain/world/WorldConstants.js';
import type { RegionalModifierResolver } from './createRegionalModifierResolver.js';

function collectActiveRegionIds(
  companyId: CompanyId,
  buildingRepository: BuildingRepository,
): readonly string[] {
  const regionIds = new Set<string>();

  for (const building of buildingRepository.findByCompanyId(companyId)) {
    if (building.getStatus() !== BuildingStatus.ACTIVE) {
      continue;
    }

    regionIds.add(building.getRegionId().value);
  }

  if (regionIds.size === 0) {
    return Object.freeze([DEFAULT_REGION_ID]);
  }

  return Object.freeze([...regionIds].sort((left, right) => left.localeCompare(right)));
}

function averageRegionalMultiplier(
  regionIds: readonly string[],
  resolveRegionalModifiers: RegionalModifierResolver,
  resolveMultiplier: (modifiers: ReturnType<RegionalModifierResolver>) => number,
): number {
  if (regionIds.length === 0) {
    return resolveMultiplier(resolveRegionalModifiers(DEFAULT_REGION_ID));
  }

  let total = 0;

  for (const regionId of regionIds) {
    total += resolveMultiplier(resolveRegionalModifiers(regionId));
  }

  return Math.round((total / regionIds.length) * 100) / 100;
}

/** Resolves the effective research multiplier for one company. */
export function resolveCompanyRegionalResearchMultiplier(
  companyId: CompanyId,
  buildingRepository: BuildingRepository,
  resolveRegionalModifiers: RegionalModifierResolver,
): number {
  return averageRegionalMultiplier(
    collectActiveRegionIds(companyId, buildingRepository),
    resolveRegionalModifiers,
    resolveRegionalResearchMultiplier,
  );
}

/** Resolves the effective energy availability multiplier for one company. */
export function resolveCompanyRegionalEnergyAvailabilityMultiplier(
  companyId: CompanyId,
  buildingRepository: BuildingRepository,
  resolveRegionalModifiers: RegionalModifierResolver,
): number {
  return averageRegionalMultiplier(
    collectActiveRegionIds(companyId, buildingRepository),
    resolveRegionalModifiers,
    resolveRegionalEnergyAvailabilityMultiplier,
  );
}
