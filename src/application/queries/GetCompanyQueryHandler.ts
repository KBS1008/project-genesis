/**
 * @module @application/queries/GetCompanyQueryHandler
 *
 * Reads company state without modifying aggregates.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createCompanyId } from '../../domain/company/Company.js';
import type { Company } from '../../domain/company/Company.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { CompanyReadModel } from '../read-models/CompanyReadModel.js';
import type { GetCompanyQuery } from './GetCompanyQuery.js';

/** Dependencies required by {@link GetCompanyQueryHandler}. */
export type GetCompanyQueryHandlerDependencies = Pick<
  ApplicationContext,
  'companyRepository'
>;

/**
 * Returns a read model for one company.
 */
export class GetCompanyQueryHandler {
  readonly #companyRepository: GetCompanyQueryHandlerDependencies['companyRepository'];

  /**
   * @param dependencies - Repository access for company lookup.
   */
  constructor(dependencies: GetCompanyQueryHandlerDependencies) {
    this.#companyRepository = dependencies.companyRepository;
  }

  /**
   * Executes the get-company query.
   *
   * @param query - Company lookup input.
   */
  execute(query: GetCompanyQuery): Result<CompanyReadModel, ValidationError> {
    const companyIdResult = createCompanyId(query.companyId);

    if (!companyIdResult.ok) {
      return Result.fail(companyIdResult.error);
    }

    const company = this.#companyRepository.findById(companyIdResult.value);

    if (company === undefined) {
      return Result.fail(
        new ValidationError(`Company id "${companyIdResult.value.value}" was not found.`),
      );
    }

    return Result.ok(mapCompany(company));
  }
}

function mapCompany(company: Company): CompanyReadModel {
  return Object.freeze({
    id: company.getId().value,
    name: company.getName(),
    ownerId: company.getOwnerId().value,
    foundedAt: company.getFoundedAt(),
    status: company.getStatus(),
  });
}
