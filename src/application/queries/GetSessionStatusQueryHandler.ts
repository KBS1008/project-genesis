/**
 * @module @application/queries/GetSessionStatusQueryHandler
 */

import { Result } from '../../common/result/Result.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { SessionStatusReadModel } from '../read-models/SessionStatusReadModel.js';
import type { GetSessionStatusQuery } from './GetSessionStatusQuery.js';

const DEFAULT_COMPANY_ID = 'company_001';
const DEFAULT_PLAYER_ID = 'player_001';

/** Dependencies required by {@link GetSessionStatusQueryHandler}. */
export type GetSessionStatusQueryHandlerDependencies = Pick<
  ApplicationContext,
  'companyRepository'
>;

/** Returns the active browser session status. */
export class GetSessionStatusQueryHandler {
  readonly #companyRepository: GetSessionStatusQueryHandlerDependencies['companyRepository'];

  constructor(dependencies: GetSessionStatusQueryHandlerDependencies) {
    this.#companyRepository = dependencies.companyRepository;
  }

  execute(query: GetSessionStatusQuery): Result<SessionStatusReadModel, ValidationError> {
    const companies = this.#companyRepository.findAll();
    const preferredCompany = companies.find(
      (company) => company.getId().value === DEFAULT_COMPANY_ID,
    );
    const activeCompany = preferredCompany ?? companies[0];

    if (activeCompany === undefined) {
      return Result.ok(
        Object.freeze({
          hasActiveSession: false,
          companyId: null,
          companyName: null,
          playerId: null,
          savePath: query.savePath,
        }),
      );
    }

    return Result.ok(
      Object.freeze({
        hasActiveSession: true,
        companyId: activeCompany.getId().value,
        companyName: activeCompany.getName(),
        playerId: DEFAULT_PLAYER_ID,
        savePath: query.savePath,
      }),
    );
  }
}
