/**
 * @module @application/services/MarketTradeService
 *
 * Coordinates instant market trades between inventory, finance and market prices.
 */

import type { DomainEvent } from '../../common/events/DomainEvent.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { Guard } from '../../common/validation/Guard.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { FinanceAccount } from '../../domain/finance/FinanceAccount.js';
import { FinanceTransactionType } from '../../domain/finance/FinanceTransactionType.js';
import type { FinanceRepository } from '../../domain/finance/FinanceRepository.js';
import type { Inventory } from '../../domain/inventory/Inventory.js';
import type { InventoryRepository } from '../../domain/inventory/InventoryRepository.js';
import { createMarketId } from '../../domain/market/Market.js';
import { GLOBAL_MARKET_ID } from '../../domain/market/MarketConstants.js';
import type { Market } from '../../domain/market/Market.js';
import type { MarketRepository } from '../../domain/market/MarketRepository.js';
import { createResourceTypeId } from '../../domain/shared/ResourceTypeId.js';

/** Result of a completed market trade. */
export type MarketTradeResult = {
  readonly totalAmount: number;
  readonly unitPrice: number;
  readonly amount: number;
};

/** Dependencies for {@link MarketTradeService}. */
export type MarketTradeServiceDependencies = {
  readonly inventoryRepository: InventoryRepository;
  readonly financeRepository: FinanceRepository;
  readonly marketRepository: MarketRepository;
  readonly clock: Clock;
  readonly enqueueEvents: (events: readonly DomainEvent[]) => void;
};

/**
 * Executes instant market buy and sell operations.
 */
export class MarketTradeService {
  readonly #inventoryRepository: MarketTradeServiceDependencies['inventoryRepository'];
  readonly #financeRepository: MarketTradeServiceDependencies['financeRepository'];
  readonly #marketRepository: MarketTradeServiceDependencies['marketRepository'];
  readonly #clock: MarketTradeServiceDependencies['clock'];
  readonly #enqueueEvents: MarketTradeServiceDependencies['enqueueEvents'];

  /**
   * @param dependencies - Repositories and callbacks required for market trades.
   */
  constructor(dependencies: MarketTradeServiceDependencies) {
    this.#inventoryRepository = dependencies.inventoryRepository;
    this.#financeRepository = dependencies.financeRepository;
    this.#marketRepository = dependencies.marketRepository;
    this.#clock = dependencies.clock;
    this.#enqueueEvents = dependencies.enqueueEvents;
  }

  /**
   * Sells available inventory at the current market price.
   */
  sell(
    companyId: CompanyId,
    resourceId: string,
    amount: number,
  ): Result<MarketTradeResult, ValidationError> {
    const amountResult = this.#validateTradeAmount(amount);

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    const resourceIdResult = createResourceTypeId(resourceId);

    if (!resourceIdResult.ok) {
      return Result.fail(resourceIdResult.error);
    }

    const marketResult = this.#findMarket();

    if (!marketResult.ok) {
      return Result.fail(marketResult.error);
    }

    const market = marketResult.value;
    const price = market.getPrice(resourceId);

    if (price === undefined) {
      return Result.fail(
        new ValidationError(`Resource "${resourceId}" is not listed on the market.`),
      );
    }

    const inventoryResult = this.#findInventory(companyId);

    if (!inventoryResult.ok) {
      return Result.fail(inventoryResult.error);
    }

    const financeResult = this.#findFinance(companyId);

    if (!financeResult.ok) {
      return Result.fail(financeResult.error);
    }

    const inventory = inventoryResult.value;
    const finance = financeResult.value;
    const tradeAmount = amountResult.value;
    const totalAmount = price.lastPrice * tradeAmount;

    const removeResult = inventory.removeQuantity(resourceId, tradeAmount, this.#clock);

    if (!removeResult.ok) {
      return Result.fail(removeResult.error);
    }

    const creditResult = finance.credit(totalAmount, FinanceTransactionType.SALE, this.#clock);

    if (!creditResult.ok) {
      inventory.addQuantity(resourceId, tradeAmount, this.#clock);
      return Result.fail(creditResult.error);
    }

    const volumeResult = market.updateLastPrice(
      resourceId,
      price.lastPrice,
      tradeAmount,
      this.#clock,
    );

    if (!volumeResult.ok) {
      finance.debit(totalAmount, FinanceTransactionType.ADMIN, this.#clock);
      inventory.addQuantity(resourceId, tradeAmount, this.#clock);
      return Result.fail(volumeResult.error);
    }

    this.#persistTrade(inventory, finance, market);

    return Result.ok({
      totalAmount,
      unitPrice: price.lastPrice,
      amount: tradeAmount,
    });
  }

  /**
   * Buys resources at the current market price into company inventory.
   */
  buy(
    companyId: CompanyId,
    resourceId: string,
    amount: number,
  ): Result<MarketTradeResult, ValidationError> {
    const amountResult = this.#validateTradeAmount(amount);

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    const resourceIdResult = createResourceTypeId(resourceId);

    if (!resourceIdResult.ok) {
      return Result.fail(resourceIdResult.error);
    }

    const marketResult = this.#findMarket();

    if (!marketResult.ok) {
      return Result.fail(marketResult.error);
    }

    const market = marketResult.value;
    const price = market.getPrice(resourceId);

    if (price === undefined) {
      return Result.fail(
        new ValidationError(`Resource "${resourceId}" is not listed on the market.`),
      );
    }

    const inventoryResult = this.#findInventory(companyId);

    if (!inventoryResult.ok) {
      return Result.fail(inventoryResult.error);
    }

    const financeResult = this.#findFinance(companyId);

    if (!financeResult.ok) {
      return Result.fail(financeResult.error);
    }

    const inventory = inventoryResult.value;
    const finance = financeResult.value;
    const tradeAmount = amountResult.value;
    const totalAmount = price.lastPrice * tradeAmount;

    const debitResult = finance.debit(totalAmount, FinanceTransactionType.PURCHASE, this.#clock);

    if (!debitResult.ok) {
      return Result.fail(debitResult.error);
    }

    const addResult = inventory.addQuantity(resourceId, tradeAmount, this.#clock);

    if (!addResult.ok) {
      finance.credit(totalAmount, FinanceTransactionType.SYSTEM, this.#clock);
      return Result.fail(addResult.error);
    }

    const volumeResult = market.updateLastPrice(
      resourceId,
      price.lastPrice,
      tradeAmount,
      this.#clock,
    );

    if (!volumeResult.ok) {
      inventory.removeQuantity(resourceId, tradeAmount, this.#clock);
      finance.credit(totalAmount, FinanceTransactionType.SYSTEM, this.#clock);
      return Result.fail(volumeResult.error);
    }

    this.#persistTrade(inventory, finance, market);

    return Result.ok({
      totalAmount,
      unitPrice: price.lastPrice,
      amount: tradeAmount,
    });
  }

  #validateTradeAmount(amount: number): Result<number, ValidationError> {
    const amountResult = Guard.againstNegative(amount, 'Trade amount must not be negative.');

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    if (amountResult.value === 0) {
      return Result.fail(new ValidationError('Trade amount must be greater than zero.'));
    }

    return Result.ok(amountResult.value);
  }

  #findMarket(): Result<Market, ValidationError> {
    const marketIdResult = createMarketId(GLOBAL_MARKET_ID);

    if (!marketIdResult.ok) {
      return Result.fail(marketIdResult.error);
    }

    const market = this.#marketRepository.findById(marketIdResult.value);

    if (market === undefined) {
      return Result.fail(new ValidationError('Global market prices were not initialized.'));
    }

    return Result.ok(market);
  }

  #findInventory(companyId: CompanyId): Result<Inventory, ValidationError> {
    const inventory = this.#inventoryRepository.findByCompanyId(companyId);

    if (inventory === undefined) {
      return Result.fail(
        new ValidationError(`Inventory for company "${companyId.value}" was not found.`),
      );
    }

    return Result.ok(inventory);
  }

  #findFinance(companyId: CompanyId): Result<FinanceAccount, ValidationError> {
    const finance = this.#financeRepository.findByCompanyId(companyId);

    if (finance === undefined) {
      return Result.fail(
        new ValidationError(`Finance account for company "${companyId.value}" was not found.`),
      );
    }

    return Result.ok(finance);
  }

  #persistTrade(inventory: Inventory, finance: FinanceAccount, market: Market): void {
    this.#inventoryRepository.save(inventory);
    this.#financeRepository.save(finance);
    this.#marketRepository.save(market);
    this.#enqueueEvents([
      ...inventory.pullDomainEvents(),
      ...finance.pullDomainEvents(),
      ...market.pullDomainEvents(),
    ]);
  }
}
