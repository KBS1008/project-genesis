/**
 * @module @application/use-cases/BuyResourceUseCase
 *
 * Coordinates instant market buy operations.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { DEFAULT_REGION_ID } from '../../domain/world/WorldConstants.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { BuyResourceCommand } from '../commands/BuyResourceCommand.js';
import type { MarketTradeResult } from '../services/MarketTradeService.js';

/** Dependencies required by {@link BuyResourceUseCase}. */
export type BuyResourceUseCaseDependencies = Pick<
  ApplicationContext,
  'companyRepository' | 'marketTradeService'
>;

/**
 * Buys resources at the current market price into company inventory.
 */
export class BuyResourceUseCase {
  readonly #companyRepository: BuyResourceUseCaseDependencies['companyRepository'];
  readonly #marketTradeService: BuyResourceUseCaseDependencies['marketTradeService'];

  /**
   * @param dependencies - Application services required to buy resources.
   */
  constructor(dependencies: BuyResourceUseCaseDependencies) {
    this.#companyRepository = dependencies.companyRepository;
    this.#marketTradeService = dependencies.marketTradeService;
  }

  /**
   * Executes the buy-resource workflow.
   */
  execute(command: BuyResourceCommand): Result<MarketTradeResult, ValidationError> {
    const companyIdResult = createCompanyId(command.companyId);

    if (!companyIdResult.ok) {
      return Result.fail(companyIdResult.error);
    }

    const companyId = companyIdResult.value;

    if (this.#companyRepository.findById(companyId) === undefined) {
      return Result.fail(new ValidationError(`Company id "${companyId.value}" was not found.`));
    }

    return this.#marketTradeService.buy(
      companyId,
      command.resourceId,
      command.amount,
      command.regionId ?? DEFAULT_REGION_ID,
    );
  }
}
