/**
 * @module @simulation/systems/production/ProductionSimulationSystem
 *
 * Recipe-based production tick processing.
 *
 * @see docs/decisions/DD-011-recipe-based-production.md
 */

import type { DomainEvent } from '../../../common/events/DomainEvent.js';
import type { ProductionJobRepository } from '../../../domain/production/ProductionJobRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/** Dependencies for {@link ProductionSimulationSystem}. */
export type ProductionSimulationSystemDependencies = {
  readonly productionJobRepository: ProductionJobRepository;
  readonly enqueueEvents: (events: readonly DomainEvent[]) => void;
};

/**
 * Advances running production jobs each simulation tick.
 */
export class ProductionSimulationSystem implements SimulationSystem {
  readonly name = 'Production';
  readonly #productionJobRepository: ProductionJobRepository;
  readonly #enqueueEvents: (events: readonly DomainEvent[]) => void;

  /**
   * @param dependencies - Repository and event enqueue callback.
   */
  constructor(dependencies: ProductionSimulationSystemDependencies) {
    this.#productionJobRepository = dependencies.productionJobRepository;
    this.#enqueueEvents = dependencies.enqueueEvents;
  }

  execute(context: TickContext): void {
    for (const job of this.#productionJobRepository.findRunning()) {
      const tickResult = job.tick(context.clock);

      if (tickResult.ok) {
        this.#productionJobRepository.save(job);
        this.#enqueueEvents(job.pullDomainEvents());
      }
    }
  }
}
