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
  readonly routeId: string | null;
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
  readonly #routeId: string | null;
  readonly #productionJobId: string;
  readonly #createdAt: number;
  #status: TransportOrderStatus;
  #startTime: number | undefined;
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
      routeId: string | null;
      productionJobId: string;
      createdAt: number;
      status: TransportOrderStatus;
      startTime: number | undefined;
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
    this.#routeId = params.routeId;
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

    const amountResult = Guard.againstNegative(
      params.amount,
      'Transport amount must not be negative.',
    );

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    if (amountResult.value === 0) {
      return Result.fail(new ValidationError('Transport amount must be greater than zero.'));
    }

    const createdAt = params.clock.now();

    return Result.ok(
      new TransportOrder({
        id: params.id,
        companyId: params.companyId,
        sourceBuildingId: params.sourceBuildingId,
        destinationBuildingId: params.destinationBuildingId,
        resourceId: params.resourceId,
        amount: amountResult.value,
        duration: durationResult.value,
        routeId: params.routeId,
        productionJobId: params.productionJobId,
        createdAt,
        status: TransportOrderStatus.WAITING,
        startTime: undefined,
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
    readonly routeId?: string | null;
    readonly productionJobId: string;
    readonly createdAt: number;
    readonly status: TransportOrderStatus;
    readonly startTime: number | undefined;
    readonly endTime: number | undefined;
    readonly progress: number;
  }): TransportOrder {
    return new TransportOrder(
      {
        ...params,
        routeId: params.routeId ?? null,
      },
      true,
    );
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

  getRouteId(): string | null {
    return this.#routeId;
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

  getStartTime(): number | undefined {
    return this.#startTime;
  }

  getEndTime(): number | undefined {
    return this.#endTime;
  }

  dispatch(clock: Clock): Result<void, ValidationError> {
    if (this.#status !== TransportOrderStatus.WAITING) {
      return Result.fail(new ValidationError('Only waiting transport orders can be dispatched.'));
    }

    this.#status = TransportOrderStatus.IN_PROGRESS;
    this.#startTime = clock.now();
    this.#progress = 0;

    return Result.ok(undefined);
  }

  tick(clock: Clock): Result<TransportOrderTickResult, ValidationError> {
    if (this.#status !== TransportOrderStatus.IN_PROGRESS) {
      return Result.fail(new ValidationError('Only in-progress transport orders can be ticked.'));
    }

    if (this.#startTime === undefined) {
      return Result.fail(
        new ValidationError('In-progress transport orders must have a start time.'),
      );
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
