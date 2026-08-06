import type { CommandId } from './command-types';
import { resolveCommandInvalidationScopes } from './command-invalidation-map';
import {
  isScreenQueryScope,
  isWorkspaceQueryScope,
  type QueryScope,
  type ScreenQueryScope,
  type WorkspaceQueryScope,
} from './query-scopes';

/** Splits command invalidation scopes into workspace and screen buckets. */
export function partitionInvalidationScopes(scopes: readonly string[]): {
  readonly workspaceScopes: readonly WorkspaceQueryScope[];
  readonly screenScopes: readonly ScreenQueryScope[];
} {
  const workspaceScopes: WorkspaceQueryScope[] = [];
  const screenScopes: ScreenQueryScope[] = [];

  for (const scope of scopes) {
    if (isWorkspaceQueryScope(scope as QueryScope)) {
      workspaceScopes.push(scope as WorkspaceQueryScope);
    } else if (isScreenQueryScope(scope as QueryScope)) {
      screenScopes.push(scope as ScreenQueryScope);
    }
  }

  return Object.freeze({
    workspaceScopes: Object.freeze(workspaceScopes),
    screenScopes: Object.freeze(screenScopes),
  });
}

/** Resolves invalidation scopes for a command id. */
export function resolveCommandScopes(commandId: CommandId): readonly QueryScope[] {
  return resolveCommandInvalidationScopes(commandId) as readonly QueryScope[];
}
