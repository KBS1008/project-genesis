/**
 * @module @simulation/engine/SimulationEngine
 *
 * Coordinates deterministic simulation ticks.
 */

import type { DomainEvent } from '../../common/events/DomainEvent.js';
import type { IEventBus } from '../../common/events/IEventBus.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { SimulationState } from '../state/SimulationState.js';
import { EventQueue } from '../events/EventQueue.js';
import type { TickClock } from '../time/TickClock.js';
import type { SimulationSystem } from './SimulationSystem.js';
import type { TickContext } from './TickContext.js';

/** Result of one completed simulation tick. */
export type TickResult = {
  readonly tickNumber: number;
  readonly occurredAt: number;
  readonly publishedEventCount: number;
};

/** Configuration for {@link SimulationEngine}. */
export type SimulationEngineOptions = {
  readonly clock: TickClock;
  readonly eventBus: IEventBus;
  readonly tickDuration?: number;
  readonly systems?: readonly SimulationSystem[];
  readonly initialState?: SimulationState;
};

/**
 * Lightweight simulation engine that advances time, runs systems and publishes events.
 */
export class SimulationEngine {
  readonly #clock: TickClock;
  readonly #eventBus: IEventBus;
  readonly #tickDuration: number;
  readonly #systems: readonly SimulationSystem[];
  #state: SimulationState;
  readonly #eventQueue: EventQueue;

  /**
   * @param options - Engine dependencies and initial configuration.
   */
  constructor(options: SimulationEngineOptions) {
    this.#clock = options.clock;
    this.#eventBus = options.eventBus;
    this.#tickDuration = options.tickDuration ?? 1;
    this.#systems = Object.freeze([...(options.systems ?? [])]);
    this.#state = options.initialState ?? new SimulationState();
    this.#eventQueue = new EventQueue();
  }

  /** Returns the current simulation execution state. */
  get state(): SimulationState {
    return this.#state;
  }

  /**
   * Queues domain events for publication at the end of the next tick.
   *
   * @param events - Domain events raised by aggregates during command handling.
   */
  enqueueEvents(events: readonly DomainEvent[]): void {
    this.#eventQueue.enqueue(events);
  }

  /**
   * Executes one simulation tick.
   *
   * Sequence:
   * 1. Advance clock
   * 2. Execute registered systems
   * 3. Publish queued domain events
   * 4. Update simulation state
   */
  tick(): Result<TickResult, ValidationError> {
    if (this.#state.paused) {
      return Result.fail(new ValidationError('Simulation is paused.'));
    }

    const tickNumber = this.#state.tickNumber + 1;
    const advanceResult = this.#clock.advance(this.#tickDuration);

    if (!advanceResult.ok) {
      return Result.fail(advanceResult.error);
    }

    const context: TickContext = {
      tickNumber,
      clock: this.#clock,
    };

    for (const system of this.#systems) {
      system.execute(context);
    }

    const events = this.#eventQueue.drain();
    this.#eventBus.publishAll(events);

    this.#state = this.#state.withTickNumber(tickNumber);

    return Result.ok({
      tickNumber,
      occurredAt: this.#clock.now(),
      publishedEventCount: events.length,
    });
  }
}
