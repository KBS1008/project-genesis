/** Workspace scopes refreshed through GameWorkspaceProvider state. */
export type WorkspaceQueryScope =
  | 'workspace.dashboard'
  | 'workspace.session'
  | 'workspace.world'
  | 'workspace.saves';

/** Screen scopes invalidated through useScreenQuery subscriptions. */
export type ScreenQueryScope =
  | 'screen.buildings'
  | 'screen.production'
  | 'screen.research'
  | 'screen.transport'
  | 'screen.markets'
  | 'screen.finance'
  | 'screen.events'
  | 'screen.world-map'
  | 'screen.world-overlay'
  | 'screen.world-inspector'
  | 'screen.executive-buildings';

export type QueryScope = WorkspaceQueryScope | ScreenQueryScope;

export const WORKSPACE_QUERY_SCOPES: readonly WorkspaceQueryScope[] = Object.freeze([
  'workspace.dashboard',
  'workspace.session',
  'workspace.world',
  'workspace.saves',
]);

export const SCREEN_QUERY_SCOPES: readonly ScreenQueryScope[] = Object.freeze([
  'screen.buildings',
  'screen.production',
  'screen.research',
  'screen.transport',
  'screen.markets',
  'screen.finance',
  'screen.events',
  'screen.world-map',
  'screen.world-overlay',
  'screen.world-inspector',
  'screen.executive-buildings',
]);

const SCREEN_SCOPE_BY_QUERY_PREFIX: Readonly<Record<string, ScreenQueryScope>> = Object.freeze({
  buildings: 'screen.buildings',
  production: 'screen.production',
  research: 'screen.research',
  transport: 'screen.transport',
  markets: 'screen.markets',
  finance: 'screen.finance',
  events: 'screen.events',
  'world-map': 'screen.world-map',
  'world-overlay': 'screen.world-overlay',
  'world-inspector': 'screen.world-inspector',
  'executive-dashboard-buildings': 'screen.executive-buildings',
});

/** Returns whether a scope targets provider workspace state. */
export function isWorkspaceQueryScope(scope: QueryScope): scope is WorkspaceQueryScope {
  return scope.startsWith('workspace.');
}

/** Returns whether a scope targets a mounted screen query. */
export function isScreenQueryScope(scope: QueryScope): scope is ScreenQueryScope {
  return scope.startsWith('screen.');
}

/** Maps a screen query key prefix to its invalidation scope. */
export function deriveScreenScopeFromQueryKey(queryKey: string): ScreenQueryScope | null {
  const prefix = queryKey.split(':')[0]?.trim();

  if (prefix === undefined || prefix.length === 0) {
    return null;
  }

  return SCREEN_SCOPE_BY_QUERY_PREFIX[prefix] ?? null;
}
