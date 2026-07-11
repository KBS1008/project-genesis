/**
 * @module @simulation/time/TickClock
 *
 * Clock abstraction that supports deterministic tick advancement.
 */

import type { Clock } from '../../common/time/Clock.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import type { Result } from '../../common/result/Result.js';

/**
 * Clock that can advance simulation time by a tick delta.
 */
export interface TickClock extends Clock {
  /**
   * Advances simulation time by a non-negative delta.
   *
   * @param delta - Amount of simulation time to add.
   */
  advance(delta: number): Result<void, ValidationError>;
}
