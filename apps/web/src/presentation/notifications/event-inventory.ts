import type { SimulationNotificationActionKind } from './simulation-notification-types';

export type EventInventoryEntry = {
  readonly category: string;
  readonly group: string;
  readonly defaultSeverity: 'information' | 'success' | 'warning' | 'critical' | 'system';
  readonly defaultAction: SimulationNotificationActionKind | null;
  readonly refreshStrategy: string;
};

/** Read-only inventory of player-visible application events (Phase 5.4B). */
export const APPLICATION_EVENT_INVENTORY: readonly EventInventoryEntry[] = Object.freeze([
  { category: 'SESSION', group: 'Save/Load', defaultSeverity: 'system', defaultAction: 'open-event-log', refreshStrategy: 'workspace.session' },
  { category: 'SIMULATION', group: 'Simulation', defaultSeverity: 'system', defaultAction: 'dismiss', refreshStrategy: 'workspace.session' },
  { category: 'BUILDING', group: 'Construction', defaultSeverity: 'success', defaultAction: 'open-building', refreshStrategy: 'workspace.dashboard + screen.buildings' },
  { category: 'PRODUCTION', group: 'Production', defaultSeverity: 'information', defaultAction: 'open-production', refreshStrategy: 'workspace.dashboard + screen.production' },
  { category: 'RESEARCH', group: 'Research', defaultSeverity: 'success', defaultAction: 'open-research', refreshStrategy: 'workspace.dashboard + screen.research' },
  { category: 'TRANSPORT', group: 'Logistics', defaultSeverity: 'information', defaultAction: 'open-transport', refreshStrategy: 'workspace.dashboard + screen.transport' },
  { category: 'TRADE', group: 'Market', defaultSeverity: 'information', defaultAction: 'open-market', refreshStrategy: 'workspace.dashboard + screen.markets' },
  { category: 'EMPLOYEE', group: 'Employees', defaultSeverity: 'information', defaultAction: 'open-inspector', refreshStrategy: 'workspace.dashboard' },
  { category: 'RUNTIME_ENERGY', group: 'System', defaultSeverity: 'warning', defaultAction: 'open-inspector', refreshStrategy: 'workspace.dashboard' },
  { category: 'RUNTIME_TAX', group: 'Economy', defaultSeverity: 'critical', defaultAction: 'open-inspector', refreshStrategy: 'workspace.dashboard' },
  { category: 'RUNTIME_LOGISTICS', group: 'Logistics', defaultSeverity: 'information', defaultAction: 'open-transport', refreshStrategy: 'workspace.dashboard + screen.transport' },
]);
