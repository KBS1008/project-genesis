/**
 * @module @simulation/systems/building/BuildingSimulationSystem
 *
 * Processes building-level simulation work each tick.
 */

import type { DomainEvent } from '../../../common/events/DomainEvent.js';
import type { Building } from '../../../domain/building/Building.js';
import type { BuildingRepository } from '../../../domain/building/BuildingRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/** Dependencies for {@link BuildingSimulationSystem}. */
export type BuildingSimulationSystemDependencies = {
  readonly buildingRepository: BuildingRepository;
  readonly enqueueEvents: (events: readonly DomainEvent[]) => void;
  readonly onBuildingActivated?: (building: Building) => void;
};

/**
 * Advances building construction progress each simulation tick.
 */
export class BuildingSimulationSystem implements SimulationSystem {
  readonly name = 'Building';
  readonly #buildingRepository: BuildingRepository;
  readonly #enqueueEvents: (events: readonly DomainEvent[]) => void;
  readonly #onBuildingActivated: BuildingSimulationSystemDependencies['onBuildingActivated'];

  /**
   * @param dependencies - Repository and event enqueue callback.
   */
  constructor(dependencies: BuildingSimulationSystemDependencies) {
    this.#buildingRepository = dependencies.buildingRepository;
    this.#enqueueEvents = dependencies.enqueueEvents;
    this.#onBuildingActivated = dependencies.onBuildingActivated;
  }

  execute(context: TickContext): void {
    for (const building of this.#buildingRepository.findUnderConstruction()) {
      const tickResult = building.tickConstruction(context.clock);

      if (tickResult.ok) {
        if (tickResult.value.status === 'completed') {
          this.#onBuildingActivated?.(building);
        }

        this.#buildingRepository.save(building);
        this.#enqueueEvents(building.pullDomainEvents());
      }
    }
  }
}
