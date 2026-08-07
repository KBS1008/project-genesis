/** Live connection state for the dashboard WebSocket channel. */
export type DashboardConnectionState = 'connected' | 'disconnected' | 'reconnecting';

/** Freshness of workspace ViewData relative to the runtime backend. */
export type WorkspaceDataFreshness = 'fresh' | 'stale' | 'unavailable';

/** Unified runtime presentation state for workspace-backed views. */
export type WorkspaceRuntimePhase =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'empty'
  | 'stale'
  | 'reconnecting'
  | 'recoverable-error'
  | 'fatal-error';

export type WorkspaceRuntimeState = {
  readonly phase: WorkspaceRuntimePhase;
  readonly dataFreshness: WorkspaceDataFreshness;
  readonly connectionState: DashboardConnectionState;
  readonly canRunCommands: boolean;
  readonly isAriaBusy: boolean;
};

export type DeriveWorkspaceRuntimeStateInput = {
  readonly hasGame: boolean;
  readonly isLoading: boolean;
  readonly isBusy: boolean;
  readonly connectionState: DashboardConnectionState;
  readonly isDataStale: boolean;
  readonly recoverableError: string | null;
  readonly fatalError: string | null;
};

/** Derives the current workspace runtime phase from provider flags. */
export function deriveWorkspaceRuntimeState(
  input: DeriveWorkspaceRuntimeStateInput,
): WorkspaceRuntimeState {
  const dataFreshness: WorkspaceDataFreshness = !input.hasGame
    ? 'unavailable'
    : input.isDataStale
      ? 'stale'
      : 'fresh';

  let phase: WorkspaceRuntimePhase = 'idle';

  if (input.fatalError !== null) {
    phase = 'fatal-error';
  } else if (input.isLoading) {
    phase = 'loading';
  } else if (input.connectionState === 'reconnecting') {
    phase = 'reconnecting';
  } else if (input.recoverableError !== null) {
    phase = 'recoverable-error';
  } else if (!input.hasGame) {
    phase = 'empty';
  } else if (input.isDataStale) {
    phase = 'stale';
  } else {
    phase = 'ready';
  }

  const canRunCommands =
    input.hasGame &&
    !input.isLoading &&
    !input.isBusy &&
    input.connectionState === 'connected' &&
    input.fatalError === null &&
    !input.isDataStale;

  const isAriaBusy = input.isLoading || input.isBusy || input.connectionState === 'reconnecting';

  return Object.freeze({
    phase,
    dataFreshness,
    connectionState: input.connectionState,
    canRunCommands,
    isAriaBusy,
  });
}

/** Returns a human-readable stale-data label for the status bar. */
export function formatWorkspaceDataFreshnessLabel(freshness: WorkspaceDataFreshness): string {
  switch (freshness) {
    case 'stale':
      return 'Daten veraltet';
    case 'unavailable':
      return 'Keine Daten';
    default:
      return 'Daten aktuell';
  }
}

/** Returns a human-readable connection label for the status bar. */
export function formatDashboardConnectionLabel(state: DashboardConnectionState): string {
  switch (state) {
    case 'connected':
      return 'Live verbunden';
    case 'reconnecting':
      return 'Verbindung wird wiederhergestellt';
    default:
      return 'Nicht live';
  }
}
