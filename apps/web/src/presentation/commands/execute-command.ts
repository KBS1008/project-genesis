import {
  toPresentationCommandError,
  type CommandId,
  type CommandStatus,
  type PresentationCommandError,
} from './command-types';
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
  /** Set when the command action succeeded but workspace refresh failed recoverably. */
  readonly staleRefreshError: PresentationCommandError | null;
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
      return { status: 'cancelled', error: null, staleRefreshError: null };
    }

    let staleRefreshError: PresentationCommandError | null = null;

    if (workspaceScopes.length > 0) {
      try {
        await context.refreshWorkspaceScopes(workspaceScopes);
      } catch (refreshError: unknown) {
        const commandError = toPresentationCommandError(refreshError);

        if (!commandError.recoverable) {
          throw refreshError;
        }

        staleRefreshError = commandError;
      }
    }

    if (!context.isCurrentGeneration()) {
      return { status: 'cancelled', error: null, staleRefreshError: null };
    }

    if (screenScopes.length > 0) {
      context.invalidateScreenScopes(screenScopes);
    }

    return { status: 'success', error: null, staleRefreshError };
  } catch (error: unknown) {
    if (!context.isCurrentGeneration()) {
      return { status: 'cancelled', error: null, staleRefreshError: null };
    }

    const commandError = toPresentationCommandError(error);

    return {
      status: commandError.recoverable ? 'recoverable-error' : 'fatal-error',
      error: commandError,
      staleRefreshError: null,
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
