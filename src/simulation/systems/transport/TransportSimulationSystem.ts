/**
 * @module @simulation/systems/transport/TransportSimulationSystem
 */

import type { DomainEvent } from '../../../common/events/DomainEvent.js';
import type { TransportOrderRepository } from '../../../domain/transport/TransportOrderRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';
import type { TransportLogisticsService } from '../../../application/services/TransportLogisticsService.js';

export type TransportSimulationSystemDependencies = {
  readonly transportOrderRepository: TransportOrderRepository;
  readonly transportLogisticsService: TransportLogisticsService;
  readonly enqueueEvents: (events: readonly DomainEvent[]) => void;
};

export class TransportSimulationSystem implements SimulationSystem {
  readonly name = 'Transport';
  readonly #transportOrderRepository: TransportOrderRepository;
  readonly #transportLogisticsService: TransportLogisticsService;
  readonly #enqueueEvents: (events: readonly DomainEvent[]) => void;

  constructor(dependencies: TransportSimulationSystemDependencies) {
    this.#transportOrderRepository = dependencies.transportOrderRepository;
    this.#transportLogisticsService = dependencies.transportLogisticsService;
    this.#enqueueEvents = dependencies.enqueueEvents;
  }

  execute(context: TickContext): void {
    for (const order of this.#transportOrderRepository.findInProgress()) {
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
}
