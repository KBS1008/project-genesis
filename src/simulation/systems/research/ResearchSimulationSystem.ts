/**
 * @module @simulation/systems/research/ResearchSimulationSystem
 *
 * Timed research tick processing.
 *
 * @see docs/gameplay/research.md
 */

import type { DomainEvent } from '../../../common/events/DomainEvent.js';
import type { ResearchJobRepository } from '../../../domain/research/ResearchJobRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';
import type { ResearchJobCompletedHandler } from './ResearchJobCompletedHandler.js';

/** Dependencies for {@link ResearchSimulationSystem}. */
export type ResearchSimulationSystemDependencies = {
  readonly researchJobRepository: ResearchJobRepository;
  readonly enqueueEvents: (events: readonly DomainEvent[]) => void;
  readonly onJobCompleted?: ResearchJobCompletedHandler;
};

/**
 * Advances running research jobs each simulation tick.
 */
export class ResearchSimulationSystem implements SimulationSystem {
  readonly name = 'Research';
  readonly #researchJobRepository: ResearchJobRepository;
  readonly #enqueueEvents: (events: readonly DomainEvent[]) => void;
  readonly #onJobCompleted: ResearchJobCompletedHandler | undefined;

  /**
   * @param dependencies - Repository and event enqueue callback.
   */
  constructor(dependencies: ResearchSimulationSystemDependencies) {
    this.#researchJobRepository = dependencies.researchJobRepository;
    this.#enqueueEvents = dependencies.enqueueEvents;
    this.#onJobCompleted = dependencies.onJobCompleted;
  }

  execute(context: TickContext): void {
    for (const job of this.#researchJobRepository.findRunning()) {
      const tickResult = job.tick(context.clock);

      if (tickResult.ok) {
        if (tickResult.value.status === 'completed') {
          this.#onJobCompleted?.(job);
        }

        this.#researchJobRepository.save(job);
        this.#enqueueEvents(job.pullDomainEvents());
      }
    }
  }
}
