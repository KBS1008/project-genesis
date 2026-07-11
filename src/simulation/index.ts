/**
 * @module @simulation
 *
 * Deterministic simulation engine exports.
 */

export { SimulationEngine } from './engine/SimulationEngine.js';
export type { SimulationEngineOptions, TickResult } from './engine/SimulationEngine.js';
export type { SimulationSystem } from './engine/SimulationSystem.js';
export type { TickContext } from './engine/TickContext.js';
export { SimulationState } from './state/SimulationState.js';
export type { TickClock } from './time/TickClock.js';
