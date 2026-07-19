/**
 * @module @simulation/systems/transport/TransportSimulationSystem
 */

import type { DomainEvent } from '../../../common/events/DomainEvent.js';
import type { TransportOrder } from '../../../domain/transport/TransportOrder.js';
import type { TransportOrderRepository } from '../../../domain/transport/TransportOrderRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';
import type { TransportLogisticsPort } from '../../../domain/transport/TransportLogisticsPort.js';

export type TransportSimulationSystemDependencies = {
  readonly transportOrderRepository: TransportOrderRepository;
  readonly transportLogisticsService: TransportLogisticsPort;
  readonly enqueueEvents: (events: readonly DomainEvent[]) => void;
};

export class TransportSimulationSystem implements SimulationSystem {
  readonly name = 'Transport';
  readonly #transportOrderRepository: TransportOrderRepository;
  readonly #transportLogisticsService: TransportLogisticsPort;
  readonly #enqueueEvents: (events: readonly DomainEvent[]) => void;

  constructor(dependencies: TransportSimulationSystemDependencies) {
    this.#transportOrderRepository = dependencies.transportOrderRepository;
    this.#transportLogisticsService = dependencies.transportLogisticsService;
    this.#enqueueEvents = dependencies.enqueueEvents;
  }

  execute(context: TickContext): void {
    this.#transportLogisticsService.dispatchPendingTransports();

    for (const order of this.#sortInProgressOrders(this.#transportOrderRepository.findInProgress())) {
      const tickResult = order.tick(context.clock);

      if (!tickResult.ok) {
        continue;
      }

      if (tickResult.value.status === 'completed') {
        const completeResult = this.#transportLogisticsService.completeTransportOrder(order);

        if (!completeResult.ok) {
          continue;
        }
      }

      this.#transportOrderRepository.save(order);
      this.#enqueueEvents(order.pullDomainEvents());
    }
  }

  #sortInProgressOrders(orders: readonly TransportOrder[]): readonly TransportOrder[] {
    return Object.freeze(
      [...orders].sort((left, right) => {
        const sourceRegionCompare = left
          .getSourceRegionId()
          .localeCompare(right.getSourceRegionId());

        if (sourceRegionCompare !== 0) {
          return sourceRegionCompare;
        }

        const destinationRegionCompare = left
          .getDestinationRegionId()
          .localeCompare(right.getDestinationRegionId());

        if (destinationRegionCompare !== 0) {
          return destinationRegionCompare;
        }

        return left.getId().value.localeCompare(right.getId().value);
      }),
    );
  }
}
