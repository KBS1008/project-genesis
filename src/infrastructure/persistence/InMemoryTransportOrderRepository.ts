/**
 * @module @infrastructure/persistence/InMemoryTransportOrderRepository
 */

import { TransportOrderStatus } from '../../domain/transport/TransportOrderStatus.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { TransportOrder } from '../../domain/transport/TransportOrder.js';
import type { TransportOrderId } from '../../domain/transport/TransportOrderId.js';
import type { TransportOrderRepository } from '../../domain/transport/TransportOrderRepository.js';

export class InMemoryTransportOrderRepository implements TransportOrderRepository {
  readonly #orders = new Map<string, TransportOrder>();

  save(order: TransportOrder): void {
    this.#orders.set(order.getId().value, order);
  }

  findById(id: TransportOrderId): TransportOrder | undefined {
    return this.#orders.get(id.value);
  }

  findInProgress(): readonly TransportOrder[] {
    return Object.freeze(
      [...this.#orders.values()]
        .filter((order) => order.getStatus() === TransportOrderStatus.IN_PROGRESS)
        .sort((left, right) => left.getId().value.localeCompare(right.getId().value)),
    );
  }

  findWaiting(): readonly TransportOrder[] {
    return Object.freeze(
      [...this.#orders.values()]
        .filter((order) => order.getStatus() === TransportOrderStatus.WAITING)
        .sort((left, right) => left.getCreatedAt() - right.getCreatedAt()),
    );
  }

  findByCompanyId(companyId: CompanyId): readonly TransportOrder[] {
    return Object.freeze(
      [...this.#orders.values()]
        .filter((order) => order.getCompanyId().value === companyId.value)
        .sort((left, right) => left.getId().value.localeCompare(right.getId().value)),
    );
  }

  findByProductionJobId(productionJobId: string): readonly TransportOrder[] {
    return Object.freeze(
      [...this.#orders.values()]
        .filter((order) => order.getProductionJobId() === productionJobId)
        .sort((left, right) => left.getId().value.localeCompare(right.getId().value)),
    );
  }
}
