import type { CommandDefinition } from './command-types';
import { SCREEN_QUERY_SCOPES, WORKSPACE_QUERY_SCOPES } from './query-scopes';

const DASHBOARD_AND_BUILDINGS = Object.freeze([
  'workspace.dashboard',
  'screen.buildings',
  'screen.executive-buildings',
] as const);

const DASHBOARD_AND_PRODUCTION = Object.freeze([
  'workspace.dashboard',
  'screen.production',
] as const);

const DASHBOARD_AND_RESEARCH = Object.freeze([
  'workspace.dashboard',
  'screen.research',
] as const);

const DASHBOARD_AND_TRANSPORT = Object.freeze([
  'workspace.dashboard',
  'screen.transport',
] as const);

const DASHBOARD_AND_MARKETS = Object.freeze([
  'workspace.dashboard',
  'screen.markets',
  'screen.finance',
] as const);

const DASHBOARD_ONLY = Object.freeze(['workspace.dashboard'] as const);

const SESSION_AND_DASHBOARD = Object.freeze(['workspace.session', 'workspace.dashboard'] as const);

const FULL_SESSION_REFRESH = Object.freeze([
  'workspace.dashboard',
  'workspace.session',
  'workspace.world',
  'workspace.saves',
  ...SCREEN_QUERY_SCOPES,
] as const);

/** Authoritative invalidation scopes per UI command. */
export const COMMAND_INVALIDATION_SCOPES: Readonly<Record<string, readonly string[]>> = Object.freeze({
  'company.newGame': FULL_SESSION_REFRESH,
  'construction.placeBuilding': DASHBOARD_AND_BUILDINGS,
  'production.start': DASHBOARD_AND_PRODUCTION,
  'research.start': DASHBOARD_AND_RESEARCH,
  'employees.hire': DASHBOARD_ONLY,
  'employees.assign': DASHBOARD_ONLY,
  'market.buy': DASHBOARD_AND_MARKETS,
  'market.sell': DASHBOARD_AND_MARKETS,
  'simulation.pause': SESSION_AND_DASHBOARD,
  'simulation.resume': SESSION_AND_DASHBOARD,
  'simulation.speed': ['workspace.session'],
  'simulation.step': SESSION_AND_DASHBOARD,
  'simulation.tick': SESSION_AND_DASHBOARD,
  'session.save': ['workspace.saves'],
  'session.load': FULL_SESSION_REFRESH,
  'workspace.refresh': FULL_SESSION_REFRESH,
  custom: FULL_SESSION_REFRESH,
});

/** Returns invalidation scopes for a command id, falling back to full refresh. */
export function resolveCommandInvalidationScopes(commandId: string): readonly string[] {
  return COMMAND_INVALIDATION_SCOPES[commandId] ?? COMMAND_INVALIDATION_SCOPES.custom;
}

/** Inventory of all UI commands exposed in Phase 5.4A. */
export const COMMAND_REGISTRY: readonly CommandDefinition[] = Object.freeze([
  {
    id: 'company.newGame',
    group: 'Company',
    label: 'Neues Spiel starten',
    invalidateScopes: FULL_SESSION_REFRESH,
  },
  {
    id: 'construction.placeBuilding',
    group: 'Construction',
    label: 'Gebäude platzieren',
    invalidateScopes: DASHBOARD_AND_BUILDINGS,
  },
  {
    id: 'production.start',
    group: 'Production',
    label: 'Produktion starten',
    invalidateScopes: DASHBOARD_AND_PRODUCTION,
  },
  {
    id: 'research.start',
    group: 'Research',
    label: 'Forschung starten',
    invalidateScopes: DASHBOARD_AND_RESEARCH,
  },
  {
    id: 'employees.hire',
    group: 'Employees',
    label: 'Mitarbeiter einstellen',
    invalidateScopes: DASHBOARD_ONLY,
  },
  {
    id: 'employees.assign',
    group: 'Employees',
    label: 'Mitarbeiter zuweisen',
    invalidateScopes: DASHBOARD_ONLY,
  },
  {
    id: 'market.buy',
    group: 'Market',
    label: 'Ressource kaufen',
    invalidateScopes: DASHBOARD_AND_MARKETS,
  },
  {
    id: 'market.sell',
    group: 'Market',
    label: 'Ressource verkaufen',
    invalidateScopes: DASHBOARD_AND_MARKETS,
  },
  {
    id: 'simulation.pause',
    group: 'Simulation',
    label: 'Simulation pausieren',
    invalidateScopes: SESSION_AND_DASHBOARD,
  },
  {
    id: 'simulation.resume',
    group: 'Simulation',
    label: 'Simulation fortsetzen',
    invalidateScopes: SESSION_AND_DASHBOARD,
  },
  {
    id: 'simulation.speed',
    group: 'Simulation',
    label: 'Simulationsgeschwindigkeit ändern',
    invalidateScopes: ['workspace.session'],
  },
  {
    id: 'simulation.step',
    group: 'Simulation',
    label: 'Simulationsschritt',
    invalidateScopes: SESSION_AND_DASHBOARD,
  },
  {
    id: 'simulation.tick',
    group: 'Simulation',
    label: 'Simulation tick',
    invalidateScopes: SESSION_AND_DASHBOARD,
  },
  {
    id: 'session.save',
    group: 'Save',
    label: 'Spielstand speichern',
    invalidateScopes: ['workspace.saves'],
    clearsDirty: true,
  },
  {
    id: 'session.load',
    group: 'Load',
    label: 'Spielstand laden',
    invalidateScopes: FULL_SESSION_REFRESH,
  },
  {
    id: 'workspace.refresh',
    group: 'Workspace',
    label: 'Workspace manuell aktualisieren',
    invalidateScopes: FULL_SESSION_REFRESH,
  },
]);

export const WORKSPACE_REFRESH_SCOPES = WORKSPACE_QUERY_SCOPES;
