/**
 * @module @domain/transport/TransportOrder
 *
 * Aggregate representing an automated internal transport between buildings.
 */

import { AggregateRoot } from '../../common/core/AggregateRoot.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { Guard } from '../../common/validation/Guard.js';
import type { BuildingId } from '../building/BuildingId.js';
import type { CompanyId } from '../company/CompanyId.js';
import type { TransportOrderId } from './TransportOrderId.js';
import { TransportOrderStatus } from './TransportOrderStatus.js';
import { TransportCompleted } from './events/TransportCompleted.js';

export type TransportOrderTickResult = {
  readonly status: 'running' | 'completed';
  readonly progress: number;
};

export type CreateTransportOrderParams = {
  readonly id: TransportOrderId;
  readonly companyId: CompanyId;
  readonly sourceBuildingId: BuildingId;
  readonly destinationBuildingId: BuildingId;
  readonly resourceId: string;
  readonly amount: number;
  readonly duration: number;
  readonly productionJobId: string;
  readonly clock: Clock;
};

export class TransportOrder extends AggregateRoot<'TransportOrder'> {
  readonly #companyId: CompanyId;
  readonly #sourceBuildingId: BuildingId;
  readonly #destinationBuildingId: BuildingId;
  readonly #resourceId: string;
  readonly #amount: number;
  readonly #duration: number;
  readonly #productionJobId: string;
  readonly #createdAt: number;
  #status: TransportOrderStatus;
  #startTime: number;
  #endTime: number | undefined;
  #progress: number;

  private constructor(
    params: {
      id: TransportOrderId;
      companyId: CompanyId;
      sourceBuildingId: BuildingId;
      destinationBuildingId: BuildingId;
      resourceId: string;
      amount: number;
      duration: number;
      productionJobId: string;
      createdAt: number;
      status: TransportOrderStatus;
      startTime: number;
      endTime: number | undefined;
      progress: number;
    },
    restoring = false,
  ) {
    super(params.id);
    this.#companyId = params.companyId;
    this.#sourceBuildingId = params.sourceBuildingId;
    this.#destinationBuildingId = params.destinationBuildingId;
    this.#resourceId = params.resourceId;
    this.#amount = params.amount;
    this.#duration = params.duration;
    this.#productionJobId = params.productionJobId;
    this.#createdAt = params.createdAt;
    this.#status = params.status;
    this.#startTime = params.startTime;
    this.#endTime = params.endTime;
    this.#progress = params.progress;
    void restoring;
  }

  static create(params: CreateTransportOrderParams): Result<TransportOrder, ValidationError> {
    const durationResult = Guard.againstNegative(
      params.duration,
      'Transport duration must not be negative.',
    );

    if (!durationResult.ok) {
      return Result.fail(durationResult.error);
    }

    if (durationResult.value === 0) {
      return Result.fail(new ValidationError('Transport duration must be greater than zero.'));
    }

    const amountResult = Guard.againstNegative(params.amount, 'Transport amount must not be negative.');

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    if (amountResult.value === 0) {
      return Result.fail(new ValidationError('Transport amount must be greater than zero.'));
    }

    const startTime = params.clock.now();

    return Result.ok(
      new TransportOrder({
        id: params.id,
        companyId: params.companyId,
        sourceBuildingId: params.sourceBuildingId,
        destinationBuildingId: params.destinationBuildingId,
        resourceId: params.resourceId,
        amount: amountResult.value,
        duration: durationResult.value,
        productionJobId: params.productionJobId,
        createdAt: startTime,
        status: TransportOrderStatus.IN_PROGRESS,
        startTime,
        endTime: undefined,
        progress: 0,
      }),
    );
  }

  static restore(params: {
    readonly id: TransportOrderId;
    readonly companyId: CompanyId;
    readonly sourceBuildingId: BuildingId;
    readonly destinationBuildingId: BuildingId;
    readonly resourceId: string;
    readonly amount: number;
    readonly duration: number;
    readonly productionJobId: string;
    readonly createdAt: number;
    readonly status: TransportOrderStatus;
    readonly startTime: number;
    readonly endTime: number | undefined;
    readonly progress: number;
  }): TransportOrder {
    return new TransportOrder(params, true);
  }

  getCompanyId(): CompanyId {
    return this.#companyId;
  }

  getSourceBuildingId(): BuildingId {
    return this.#sourceBuildingId;
  }

  getDestinationBuildingId(): BuildingId {
    return this.#destinationBuildingId;
  }

  getResourceId(): string {
    return this.#resourceId;
  }

  getAmount(): number {
    return this.#amount;
  }

  getDuration(): number {
    return this.#duration;
  }

  getProductionJobId(): string {
    return this.#productionJobId;
  }

  getStatus(): TransportOrderStatus {
    return this.#status;
  }

  getProgress(): number {
    return this.#progress;
  }

  getCreatedAt(): number {
    return this.#createdAt;
  }

  getStartTime(): number {
    return this.#startTime;
  }

  getEndTime(): number | undefined {
    return this.#endTime;
  }

  tick(clock: Clock): Result<TransportOrderTickResult, ValidationError> {
    if (this.#status !== TransportOrderStatus.IN_PROGRESS) {
      return Result.fail(new ValidationError('Only in-progress transport orders can be ticked.'));
    }

    const elapsed = clock.now() - this.#startTime;
    this.#progress = Math.min(100, (elapsed / this.#duration) * 100);

    if (this.#progress >= 100) {
      this.#status = TransportOrderStatus.COMPLETED;
      this.#endTime = clock.now();
      this.#progress = 100;

      this.addDomainEvent(
        new TransportCompleted(
          clock.now(),
          this.getId().value,
          this.#companyId.value,
          this.#sourceBuildingId.value,
          this.#destinationBuildingId.value,
          this.#resourceId,
          this.#amount,
          this.#productionJobId,
        ),
      );

      return Result.ok({ status: 'completed', progress: 100 });
    }

    return Result.ok({ status: 'running', progress: this.#progress });
  }
}
