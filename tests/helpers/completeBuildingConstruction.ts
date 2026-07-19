import { createBuildingId } from '../../src/domain/building/Building.js';
import { BuildingStatus } from '../../src/domain/building/BuildingStatus.js';
import type { BuildingRepository } from '../../src/domain/building/BuildingRepository.js';
import type { ManualClock } from '../../src/common/time/ManualClock.js';
import type { SimulationEngine } from '../../src/simulation/engine/SimulationEngine.js';

/** Advances simulation time until a building finishes construction. */
export function completeBuildingConstruction(options: {
  readonly clock: ManualClock;
  readonly simulationEngine: SimulationEngine;
  readonly buildingRepository: BuildingRepository;
  readonly buildingId: string;
}): void {
  const buildingIdResult = createBuildingId(options.buildingId);

  if (!buildingIdResult.ok) {
    throw new Error(buildingIdResult.error.message);
  }

  const building = options.buildingRepository.findById(buildingIdResult.value);

  if (building === undefined) {
    throw new Error(`Building id "${options.buildingId}" was not found.`);
  }

  if (building.getStatus() === BuildingStatus.ACTIVE) {
    return;
  }

  const duration = building.getConstructionDuration();
  const startTime = building.getConstructionStartTime() ?? options.clock.now();
  const remaining = startTime + duration - options.clock.now();

  if (remaining > 0) {
    options.clock.advance(remaining);
  }

  const tickResult = options.simulationEngine.tick();

  if (!tickResult.ok) {
    throw new Error(tickResult.error.message);
  }

  if (building.getStatus() !== BuildingStatus.ACTIVE) {
    throw new Error(
      `Building id "${options.buildingId}" did not become active after construction.`,
    );
  }
}
