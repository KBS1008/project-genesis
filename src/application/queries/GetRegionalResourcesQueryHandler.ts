/**
 * @module @application/queries/GetRegionalResourcesQueryHandler
 *
 * Reads regional resource availability without modifying aggregates.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createRegionId } from '../../domain/region/RegionId.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { RegionalResourceReadModel } from '../read-models/RegionalResourceReadModel.js';
import type { GetRegionalResourcesQuery } from './GetRegionalResourcesQuery.js';

/** Dependencies required by {@link GetRegionalResourcesQueryHandler}. */
export type GetRegionalResourcesQueryHandlerDependencies = Pick<
  ApplicationContext,
  'regionRepository'
>;

/**
 * Returns read models for all regional resources in one region.
 */
export class GetRegionalResourcesQueryHandler {
  readonly #regionRepository: GetRegionalResourcesQueryHandlerDependencies['regionRepository'];

  constructor(dependencies: GetRegionalResourcesQueryHandlerDependencies) {
    this.#regionRepository = dependencies.regionRepository;
  }

  execute(
    query: GetRegionalResourcesQuery,
  ): Result<readonly RegionalResourceReadModel[], ValidationError> {
    const regionIdResult = createRegionId(query.regionId);

    if (!regionIdResult.ok) {
      return Result.fail(regionIdResult.error);
    }

    const region = this.#regionRepository.findById(regionIdResult.value);

    if (region === undefined) {
      return Result.fail(
        new ValidationError(`Region id "${regionIdResult.value.value}" was not found.`),
      );
    }

    return Result.ok(
      Object.freeze(
        region.getRegionalResources().map((entry) =>
          Object.freeze({
            resourceTypeId: entry.resourceTypeId,
            available: entry.available,
            extractionModifier: entry.extractionModifier,
          }),
        ),
      ),
    );
  }
}
