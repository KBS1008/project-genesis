/**
 * @module @application/queries/ListBuildingsQueryHandler
 *
 * Reads building state for a company without modifying aggregates.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createCompanyId } from '../../domain/company/Company.js';
import type { Building } from '../../domain/building/Building.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { BuildingReadModel } from '../read-models/BuildingReadModel.js';
import type { ListBuildingsQuery } from './ListBuildingsQuery.js';

/** Dependencies required by {@link ListBuildingsQueryHandler}. */
export type ListBuildingsQueryHandlerDependencies = Pick<
  ApplicationContext,
  'companyRepository' | 'buildingRepository'
>;

/**
 * Returns read models for all buildings owned by a company.
 */
export class ListBuildingsQueryHandler {
  readonly #companyRepository: ListBuildingsQueryHandlerDependencies['companyRepository'];
  readonly #buildingRepository: ListBuildingsQueryHandlerDependencies['buildingRepository'];

  /**
   * @param dependencies - Repository access for company and building lookup.
   */
  constructor(dependencies: ListBuildingsQueryHandlerDependencies) {
    this.#companyRepository = dependencies.companyRepository;
    this.#buildingRepository = dependencies.buildingRepository;
  }

  /**
   * Executes the list-buildings query.
   *
   * @param query - Company lookup input.
   */
  execute(query: ListBuildingsQuery): Result<readonly BuildingReadModel[], ValidationError> {
    const companyIdResult = createCompanyId(query.companyId);

    if (!companyIdResult.ok) {
      return Result.fail(companyIdResult.error);
    }

    const companyId = companyIdResult.value;

    if (this.#companyRepository.findById(companyId) === undefined) {
      return Result.fail(new ValidationError(`Company id "${companyId.value}" was not found.`));
    }

    const buildings = this.#buildingRepository.findByCompanyId(companyId);

    return Result.ok(Object.freeze(buildings.map(mapBuilding)));
  }
}

function mapBuilding(building: Building): BuildingReadModel {
  const position = building.getPosition();

  return Object.freeze({
    id: building.getId().value,
    buildingTypeId: building.getBuildingTypeId().value,
    companyId: building.getCompanyId().value,
    name: building.getName(),
    x: position.x,
    y: position.y,
    level: building.getLevel(),
    createdAt: building.getCreatedAt(),
    status: building.getStatus(),
    constructionProgress: building.getConstructionProgress(),
    constructionDuration: building.getConstructionDuration(),
  });
}
