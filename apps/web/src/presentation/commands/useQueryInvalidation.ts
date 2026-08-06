'use client';

import { useSyncExternalStore } from 'react';
import type { QueryScope } from './query-scopes';
import { queryInvalidationStore } from './query-invalidation';

/** Subscribes to invalidation generations for the provided query scopes. */
export function useQueryInvalidationToken(scopes: readonly QueryScope[]): string {
  return useSyncExternalStore(
    (listener) => queryInvalidationStore.subscribe(listener),
    () => queryInvalidationStore.getToken(scopes),
    () => queryInvalidationStore.getToken(scopes),
  );
}
