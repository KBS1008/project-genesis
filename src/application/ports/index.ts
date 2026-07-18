/**
 * @module @application/ports
 */

export type {
  GameStateSerializerPort,
  GameStateSource,
  GameStateTarget,
  RestoredSimulationMetadata,
} from './GameStateSerializerPort.js';
export type { SavegameStore } from './SavegameStore.js';
export type { TickHistorySnapshotProvider } from './TickHistorySnapshotProvider.js';
