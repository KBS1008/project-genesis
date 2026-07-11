/**
 * @module @application/use-cases/SellResourceUseCase
 *
 * Coordinates instant market sell operations.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createCompanyId } from '../../domain/company/Company.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { SellResourceCommand } from '../commands/SellResourceCommand.js';
import type { MarketTradeResult } from '../services/MarketTradeService.js';

/** Dependencies required by {@link SellResourceUseCase}. */
export type SellResourceUseCaseDependencies = Pick<
  ApplicationContext,
  'companyRepository' | 'marketTradeService'
>;

/**
 * Sells company inventory at the current market price.
 */
export class SellResourceUseCase {
  readonly #companyRepository: SellResourceUseCaseDependencies['companyRepository'];
  readonly #marketTradeService: SellResourceUseCaseDependencies['marketTradeService'];

  /**
   * @param dependencies - Application services required to sell resources.
   */
  constructor(dependencies: SellResourceUseCaseDependencies) {
    this.#companyRepository = dependencies.companyRepository;
    this.#marketTradeService = dependencies.marketTradeService;
  }

  /**
   * Executes the sell-resource workflow.
   */
  execute(command: SellResourceCommand): Result<MarketTradeResult, ValidationError> {
    const companyIdResult = createCompanyId(command.companyId);

    if (!companyIdResult.ok) {
      return Result.fail(companyIdResult.error);
    }

    const companyId = companyIdResult.value;

    if (this.#companyRepository.findById(companyId) === undefined) {
      return Result.fail(new ValidationError(`Company id "${companyId.value}" was not found.`));
    }

    return this.#marketTradeService.sell(companyId, command.resourceId, command.amount);
  }
}
