/**
 * @module @application/queries/GetSimulationStatusQueryHandler
 */

import { Result } from '../../common/result/Result.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { SimulationStatusReadModel } from '../read-models/SimulationStatusReadModel.js';
import type { GetSimulationStatusQuery } from './GetSimulationStatusQuery.js';

/** Dependencies required by {@link GetSimulationStatusQueryHandler}. */
export type GetSimulationStatusQueryHandlerDependencies = Pick<
  ApplicationContext,
  'simulationEngine' | 'clock'
>;

/** Returns current simulation execution status. */
export class GetSimulationStatusQueryHandler {
  readonly #simulationEngine: GetSimulationStatusQueryHandlerDependencies['simulationEngine'];
  readonly #clock: GetSimulationStatusQueryHandlerDependencies['clock'];

  constructor(dependencies: GetSimulationStatusQueryHandlerDependencies) {
    this.#simulationEngine = dependencies.simulationEngine;
    this.#clock = dependencies.clock;
  }

  execute(query: GetSimulationStatusQuery): Result<SimulationStatusReadModel, ValidationError> {
    const state = this.#simulationEngine.state;

    return Result.ok(
      Object.freeze({
        tickNumber: state.tickNumber,
        simulationTime: this.#clock.now(),
        isPaused: state.paused,
        tickDuration: this.#simulationEngine.tickDuration,
        hasActiveSession: query.hasActiveSession,
      }),
    );
  }
}
