import { describe, expect, it } from 'vitest';
import {
  deriveWorkspaceRuntimeState,
  formatDashboardConnectionLabel,
  formatWorkspaceDataFreshnessLabel,
} from './workspace-runtime-state';

describe('deriveWorkspaceRuntimeState', () => {
  it('marks ready sessions as command-enabled when connected', () => {
    const state = deriveWorkspaceRuntimeState({
      hasGame: true,
      isLoading: false,
      isBusy: false,
      connectionState: 'connected',
      isDataStale: false,
      recoverableError: null,
      fatalError: null,
    });

    expect(state.phase).toBe('ready');
    expect(state.dataFreshness).toBe('fresh');
    expect(state.canRunCommands).toBe(true);
    expect(state.isAriaBusy).toBe(false);
  });

  it('preserves stale data and disables commands while disconnected', () => {
    const state = deriveWorkspaceRuntimeState({
      hasGame: true,
      isLoading: false,
      isBusy: false,
      connectionState: 'disconnected',
      isDataStale: true,
      recoverableError: null,
      fatalError: null,
    });

    expect(state.phase).toBe('stale');
    expect(state.dataFreshness).toBe('stale');
    expect(state.canRunCommands).toBe(false);
  });

  it('enters reconnecting phase without clearing data freshness', () => {
    const state = deriveWorkspaceRuntimeState({
      hasGame: true,
      isLoading: false,
      isBusy: false,
      connectionState: 'reconnecting',
      isDataStale: false,
      recoverableError: null,
      fatalError: null,
    });

    expect(state.phase).toBe('reconnecting');
    expect(state.isAriaBusy).toBe(true);
    expect(state.canRunCommands).toBe(false);
  });

  it('surfaces recoverable refresh errors without fatal state', () => {
    const state = deriveWorkspaceRuntimeState({
      hasGame: true,
      isLoading: false,
      isBusy: false,
      connectionState: 'connected',
      isDataStale: true,
      recoverableError: 'Netzwerkfehler',
      fatalError: null,
    });

    expect(state.phase).toBe('recoverable-error');
    expect(state.canRunCommands).toBe(false);
  });
});

describe('runtime labels', () => {
  it('formats connection and freshness labels', () => {
    expect(formatDashboardConnectionLabel('reconnecting')).toBe('Verbindung wird wiederhergestellt');
    expect(formatWorkspaceDataFreshnessLabel('stale')).toBe('Daten veraltet');
  });
});
