import { describe, expect, it } from 'vitest';
import { partitionInvalidationScopes, resolveCommandScopes } from '@/presentation/commands/command-scopes';
import { COMMAND_REGISTRY } from '@/presentation/commands/command-invalidation-map';
import { deriveScreenScopeFromQueryKey } from '@/presentation/commands/query-scopes';

describe('command scopes', () => {
  it('maps production commands to dashboard and production screen scopes', () => {
    const scopes = resolveCommandScopes('production.start');

    expect(scopes).toContain('workspace.dashboard');
    expect(scopes).toContain('screen.production');
  });

  it('partitions workspace and screen scopes', () => {
    const partitioned = partitionInvalidationScopes(resolveCommandScopes('market.buy'));

    expect(partitioned.workspaceScopes).toEqual(['workspace.dashboard']);
    expect(partitioned.screenScopes).toEqual(['screen.markets', 'screen.finance']);
  });

  it('derives screen scopes from query keys', () => {
    expect(deriveScreenScopeFromQueryKey('finance:12')).toBe('screen.finance');
    expect(deriveScreenScopeFromQueryKey('executive-dashboard-buildings:3')).toBe(
      'screen.executive-buildings',
    );
  });

  it('registers all required command groups', () => {
    const groups = new Set(COMMAND_REGISTRY.map((entry) => entry.group));

    expect(groups.has('Company')).toBe(true);
    expect(groups.has('Construction')).toBe(true);
    expect(groups.has('Production')).toBe(true);
    expect(groups.has('Research')).toBe(true);
    expect(groups.has('Employees')).toBe(true);
    expect(groups.has('Market')).toBe(true);
    expect(groups.has('Simulation')).toBe(true);
    expect(groups.has('Save')).toBe(true);
    expect(groups.has('Load')).toBe(true);
  });
});
