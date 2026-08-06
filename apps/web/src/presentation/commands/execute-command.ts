import type { CommandId, CommandStatus } from './command-types';
import { PresentationCommandError, toPresentationCommandError } from './command-types';
import { partitionInvalidationScopes, resolveCommandScopes } from './command-scopes';
import { queryInvalidationStore } from './query-invalidation';
import {
  isScreenQueryScope,
  isWorkspaceQueryScope,
  type QueryScope,
} from './query-scopes';

export type CommandExecutionContext = {
  readonly commandId: CommandId;
  readonly generation: number;
  readonly isCurrentGeneration: () => boolean;
  readonly refreshWorkspaceScopes: (scopes: readonly QueryScope[]) => Promise<void>;
  readonly invalidateScreenScopes: (scopes: readonly QueryScope[]) => void;
};

export type CommandExecutionResult = {
  readonly status: CommandStatus;
  readonly error: PresentationCommandError | null;
};

/** Executes a typed command with centralized invalidation and stale-response guards. */
export async function executePresentationCommand(
  action: () => Promise<void>,
  context: CommandExecutionContext,
  scopes?: readonly QueryScope[],
): Promise<CommandExecutionResult> {
  const resolvedScopes = scopes ?? resolveCommandScopes(context.commandId);
  const { workspaceScopes, screenScopes } = partitionInvalidationScopes(resolvedScopes);

  try {
    await action();

    if (!context.isCurrentGeneration()) {
      return { status: 'cancelled', error: null };
    }

    if (workspaceScopes.length > 0) {
      await context.refreshWorkspaceScopes(workspaceScopes);
    }

    if (!context.isCurrentGeneration()) {
      return { status: 'cancelled', error: null };
    }

    if (screenScopes.length > 0) {
      context.invalidateScreenScopes(screenScopes);
    }

    return { status: 'success', error: null };
  } catch (error: unknown) {
    if (!context.isCurrentGeneration()) {
      return { status: 'cancelled', error: null };
    }

    const commandError = toPresentationCommandError(error);

    return {
      status: commandError.recoverable ? 'recoverable-error' : 'fatal-error',
      error: commandError,
    };
  }
}

/** Invalidates screen scopes through the shared query invalidation store. */
export function invalidateScreenQueryScopes(scopes: readonly QueryScope[]): void {
  const screenScopes = scopes.filter(isScreenQueryScope);

  if (screenScopes.length > 0) {
    queryInvalidationStore.invalidate(screenScopes);
  }
}

/** Returns workspace scopes from a mixed scope list. */
export function filterWorkspaceScopes(scopes: readonly QueryScope[]): readonly QueryScope[] {
  return scopes.filter(isWorkspaceQueryScope);
}
