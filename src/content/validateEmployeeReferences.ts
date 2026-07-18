/**
 * @module @content/validateEmployeeReferences
 *
 * Validates employee requirement references against loaded content registries.
 */

import { Result } from '../common/result/Result.js';
import type { BuildingTypeRegistry } from './building/BuildingTypeRegistry.js';
import type { EmployeeRegistry } from './employee/EmployeeRegistry.js';
import { ContentLoadError } from './errors/ContentLoadError.js';
import type { TechnologyRegistry } from './research/TechnologyRegistry.js';

/**
 * Ensures employee requirement references point to known technologies and buildings.
 */
export function validateEmployeeReferences(
  employees: EmployeeRegistry,
  technologies: TechnologyRegistry,
  buildingTypes: BuildingTypeRegistry,
): Result<void, ContentLoadError> {
  for (const employee of employees.getAll()) {
    for (const researchId of employee.requirements.research) {
      if (!technologies.has(researchId)) {
        return Result.fail(
          new ContentLoadError(
            `Employee "${employee.id}" references unknown technology "${researchId}" in "requirements.research".`,
            { contentId: employee.id },
          ),
        );
      }
    }

    for (const buildingId of employee.requirements.buildings) {
      if (!buildingTypes.has(buildingId)) {
        return Result.fail(
          new ContentLoadError(
            `Employee "${employee.id}" references unknown building type "${buildingId}" in "requirements.buildings".`,
            { contentId: employee.id },
          ),
        );
      }
    }
  }

  return Result.ok(undefined);
}
