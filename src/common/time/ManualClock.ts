/**
 * @module @common/time/ManualClock
 *
 * Deterministic {@link Clock} implementation for tests and controlled simulation.
 */

import { Result } from '../result/Result.js';
import { ValidationError } from '../errors/ValidationError.js';
import type { Clock } from './Clock.js';

/**
 * A deterministic clock with manually controlled time.
 *
 * Used in unit tests and deterministic simulation runs.
 */
export class ManualClock implements Clock {
  #currentTime: number;

  /**
   * @param initialTime - Starting simulation time. Defaults to `0`.
   */
  constructor(initialTime = 0) {
    this.#currentTime = initialTime;
  }

  /**
   * Returns the current simulation time.
   */
  now(): number {
    return this.#currentTime;
  }

  /**
   * Sets the simulation time to an explicit value.
   *
   * @param time - The new simulation time.
   * @returns A result indicating success or a validation error for negative values.
   */
  set(time: number): Result<void, ValidationError> {
    if (time < 0) {
      return Result.fail(new ValidationError('Simulation time must not be negative.'));
    }

    this.#currentTime = time;
    return Result.ok(undefined);
  }

  /**
   * Advances the simulation time by a non-negative delta.
   *
   * @param delta - The amount of time to advance.
   * @returns A result indicating success or a validation error for negative deltas.
   */
  advance(delta: number): Result<void, ValidationError> {
    if (delta < 0) {
      return Result.fail(new ValidationError('Time delta must not be negative.'));
    }

    this.#currentTime += delta;
    return Result.ok(undefined);
  }
}
