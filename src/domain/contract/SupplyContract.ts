/**
 * @module @domain/contract/SupplyContract
 *
 * NPC supply contract aggregate for recurring contract payments.
 *
 * @see docs/gameplay/market.md
 */

import { AggregateRoot } from '../../common/core/AggregateRoot.js';
import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { Guard } from '../../common/validation/Guard.js';
import type { CompanyId } from '../company/CompanyId.js';
import { createResourceTypeId } from '../shared/ResourceTypeId.js';
import {
  NPC_PURCHASE_CONTRACT_INTERVAL_TICKS,
  STARTER_NPC_WOOD_CONTRACT_AMOUNT,
  STARTER_NPC_WOOD_CONTRACT_PAYMENT,
  STARTER_NPC_WOOD_CONTRACT_RESOURCE_ID,
} from './SupplyContractConstants.js';
import type { SupplyContractId } from './SupplyContractId.js';

/** Supported contract fulfillment modes in version 1. */
export const SupplyContractKind = {
  NPC_PURCHASE: 'NPC_PURCHASE',
} as const;

export type SupplyContractKind = (typeof SupplyContractKind)[keyof typeof SupplyContractKind];

/** Parameters for creating the starter NPC wood purchase contract. */
export type CreateStarterNpcWoodContractParams = {
  readonly id: SupplyContractId;
  readonly companyId: CompanyId;
  readonly clock: Clock;
};

/**
 * Aggregate representing one recurring NPC supply contract.
 */
export class SupplyContract extends AggregateRoot<'SupplyContract'> {
  readonly #companyId: CompanyId;
  readonly #kind: SupplyContractKind;
  readonly #resourceId: string;
  readonly #amount: number;
  readonly #paymentAmount: number;
  readonly #intervalTicks: number;
  readonly #createdAt: number;
  #lastFulfilledTick: number;
  #active: boolean;

  private constructor(
    params: {
      id: SupplyContractId;
      companyId: CompanyId;
      kind: SupplyContractKind;
      resourceId: string;
      amount: number;
      paymentAmount: number;
      intervalTicks: number;
      createdAt: number;
      lastFulfilledTick: number;
      active: boolean;
    },
    restoring = false,
  ) {
    super(params.id);
    this.#companyId = params.companyId;
    this.#kind = params.kind;
    this.#resourceId = params.resourceId;
    this.#amount = params.amount;
    this.#paymentAmount = params.paymentAmount;
    this.#intervalTicks = params.intervalTicks;
    this.#createdAt = params.createdAt;
    this.#lastFulfilledTick = params.lastFulfilledTick;
    this.#active = params.active;

    void restoring;
  }

  /** Creates the documented starter NPC wood purchase contract. */
  static createStarterNpcWoodPurchase(
    params: CreateStarterNpcWoodContractParams,
  ): Result<SupplyContract, ValidationError> {
    const resourceIdResult = createResourceTypeId(STARTER_NPC_WOOD_CONTRACT_RESOURCE_ID);

    if (!resourceIdResult.ok) {
      return Result.fail(resourceIdResult.error);
    }

    return Result.ok(
      new SupplyContract({
        id: params.id,
        companyId: params.companyId,
        kind: SupplyContractKind.NPC_PURCHASE,
        resourceId: resourceIdResult.value.value,
        amount: STARTER_NPC_WOOD_CONTRACT_AMOUNT,
        paymentAmount: STARTER_NPC_WOOD_CONTRACT_PAYMENT,
        intervalTicks: NPC_PURCHASE_CONTRACT_INTERVAL_TICKS,
        createdAt: params.clock.now(),
        lastFulfilledTick: 0,
        active: true,
      }),
    );
  }

  /** Rehydrates a contract from a persisted snapshot without raising events. */
  static restore(params: {
    readonly id: SupplyContractId;
    readonly companyId: CompanyId;
    readonly kind: SupplyContractKind;
    readonly resourceId: string;
    readonly amount: number;
    readonly paymentAmount: number;
    readonly intervalTicks: number;
    readonly createdAt: number;
    readonly lastFulfilledTick: number;
    readonly active: boolean;
  }): Result<SupplyContract, ValidationError> {
    const amountResult = Guard.againstNegative(
      params.amount,
      'Contract amount must not be negative.',
    );

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    const paymentResult = Guard.againstNegative(
      params.paymentAmount,
      'Contract payment must not be negative.',
    );

    if (!paymentResult.ok) {
      return Result.fail(paymentResult.error);
    }

    const intervalResult = Guard.againstNegative(
      params.intervalTicks,
      'Contract interval must not be negative.',
    );

    if (!intervalResult.ok) {
      return Result.fail(intervalResult.error);
    }

    if (intervalResult.value === 0) {
      return Result.fail(new ValidationError('Contract interval must be greater than zero.'));
    }

    return Result.ok(
      new SupplyContract(
        {
          id: params.id,
          companyId: params.companyId,
          kind: params.kind,
          resourceId: params.resourceId,
          amount: amountResult.value,
          paymentAmount: paymentResult.value,
          intervalTicks: intervalResult.value,
          createdAt: params.createdAt,
          lastFulfilledTick: params.lastFulfilledTick,
          active: params.active,
        },
        true,
      ),
    );
  }

  getCompanyId(): CompanyId {
    return this.#companyId;
  }

  getKind(): SupplyContractKind {
    return this.#kind;
  }

  getResourceId(): string {
    return this.#resourceId;
  }

  getAmount(): number {
    return this.#amount;
  }

  getPaymentAmount(): number {
    return this.#paymentAmount;
  }

  getIntervalTicks(): number {
    return this.#intervalTicks;
  }

  getCreatedAt(): number {
    return this.#createdAt;
  }

  getLastFulfilledTick(): number {
    return this.#lastFulfilledTick;
  }

  isActive(): boolean {
    return this.#active;
  }

  /** Returns whether the contract should be fulfilled on the given tick. */
  shouldFulfill(tickNumber: number): boolean {
    return (
      this.#active &&
      tickNumber > 0 &&
      tickNumber % this.#intervalTicks === 0 &&
      tickNumber !== this.#lastFulfilledTick
    );
  }

  /** Records a successful fulfillment on the given tick. */
  markFulfilled(tickNumber: number): void {
    this.#lastFulfilledTick = tickNumber;
  }
}

/** Creates a validated supply contract identifier from a raw string. */
export function createSupplyContractId(
  rawValue: string,
): Result<SupplyContractId, ValidationError> {
  const result = Identifier.create<SupplyContractId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
