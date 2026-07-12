/**
 * @module @simulation/systems/building/BuildingSimulationSystem
 *
 * Processes building-level simulation work each tick.
 */

import type { DomainEvent } from '../../../common/events/DomainEvent.js';
import type { BuildingRepository } from '../../../domain/building/BuildingRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/** Dependencies for {@link BuildingSimulationSystem}. */
export type BuildingSimulationSystemDependencies = {
  readonly buildingRepository: BuildingRepository;
  readonly enqueueEvents: (events: readonly DomainEvent[]) => void;
};

/**
 * Advances building construction progress each simulation tick.
 */
export class BuildingSimulationSystem implements SimulationSystem {
  readonly name = 'Building';
  readonly #buildingRepository: BuildingRepository;
  readonly #enqueueEvents: (events: readonly DomainEvent[]) => void;

  /**
   * @param dependencies - Repository and event enqueue callback.
   */
  constructor(dependencies: BuildingSimulationSystemDependencies) {
    this.#buildingRepository = dependencies.buildingRepository;
    this.#enqueueEvents = dependencies.enqueueEvents;
  }

  execute(context: TickContext): void {
    for (const building of this.#buildingRepository.findUnderConstruction()) {
      const tickResult = building.tickConstruction(context.clock);

      if (tickResult.ok) {
        this.#buildingRepository.save(building);
        this.#enqueueEvents(building.pullDomainEvents());
      }
    }
  }
}
