import { describe, expect, it, vi } from 'vitest';
import { executePresentationCommand } from '@/presentation/commands/execute-command';
import { PresentationCommandError } from '@/presentation/commands/command-types';

describe('executePresentationCommand', () => {
  it('refreshes workspace scopes and invalidates screen scopes on success', async () => {
    const refreshWorkspaceScopes = vi.fn(async () => undefined);
    const invalidateScreenScopes = vi.fn();

    const result = await executePresentationCommand(
      async () => undefined,
      {
        commandId: 'production.start',
        generation: 1,
        isCurrentGeneration: () => true,
        refreshWorkspaceScopes,
        invalidateScreenScopes,
      },
    );

    expect(result.status).toBe('success');
    expect(refreshWorkspaceScopes).toHaveBeenCalledWith(['workspace.dashboard']);
    expect(invalidateScreenScopes).toHaveBeenCalledWith(['screen.production']);
  });

  it('returns cancelled when a newer command supersedes the execution', async () => {
    let currentGeneration = 1;
    const refreshWorkspaceScopes = vi.fn();

    const result = await executePresentationCommand(
      async () => {
        currentGeneration = 2;
      },
      {
        commandId: 'production.start',
        generation: 1,
        isCurrentGeneration: () => currentGeneration === 1,
        refreshWorkspaceScopes,
        invalidateScreenScopes: vi.fn(),
      },
    );

    expect(result.status).toBe('cancelled');
    expect(refreshWorkspaceScopes).not.toHaveBeenCalled();
  });

  it('maps recoverable failures to typed command errors', async () => {
    const result = await executePresentationCommand(
      async () => {
        throw new Error('network timeout');
      },
      {
        commandId: 'market.buy',
        generation: 1,
        isCurrentGeneration: () => true,
        refreshWorkspaceScopes: vi.fn(),
        invalidateScreenScopes: vi.fn(),
      },
    );

    expect(result.status).toBe('recoverable-error');
    expect(result.error).toBeInstanceOf(PresentationCommandError);
    expect(result.error?.recoverable).toBe(true);
  });
});
