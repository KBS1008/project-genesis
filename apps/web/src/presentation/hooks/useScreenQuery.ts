'use client';

import { useEffect, useRef, useState } from 'react';
import { deriveScreenScopeFromQueryKey } from '@/presentation/commands/query-scopes';
import { useQueryInvalidationToken } from '@/presentation/commands/useQueryInvalidation';
import { useDebouncedValue } from '@/presentation/hooks/useDebouncedValue';
import { translatePresentationError } from '@/presentation/notifications/translatePresentationError';

export type ScreenQueryState<T> = {
  readonly data: T | null;
  /** True only while waiting for the first successful result (no stale data to show). */
  readonly isLoading: boolean;
  /** True while refetching after invalidation or key change when prior data is retained. */
  readonly isRefreshing: boolean;
  readonly errorMessage: string | null;
};

export type ScreenQueryOptions = {
  readonly debounceMs?: number;
};

/** Debounce interval for tick-driven screen queries during active simulation. */
export const TICK_QUERY_DEBOUNCE_MS = 250;

/** Loads screen-scoped query data with loading and error presentation state. */
export function useScreenQuery<T>(
  queryKey: string,
  loader: () => Promise<T>,
  enabled: boolean,
  options?: ScreenQueryOptions,
): ScreenQueryState<T> {
  const debouncedKey = useDebouncedValue(queryKey, options?.debounceMs ?? 0);
  const screenScope = deriveScreenScopeFromQueryKey(queryKey);
  const invalidationToken = useQueryInvalidationToken(screenScope === null ? [] : [screenScope]);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const dataRef = useRef<T | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      dataRef.current = null;
      setIsLoading(false);
      setIsRefreshing(false);
      setErrorMessage(null);
      return;
    }

    let active = true;
    const hasExistingData = dataRef.current !== null;

    if (hasExistingData) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    void loaderRef
      .current()
      .then((result) => {
        if (active) {
          setData(result);
          dataRef.current = result;
        }
      })
      .catch((error: unknown) => {
        if (active) {
          if (!hasExistingData) {
            setData(null);
            dataRef.current = null;
          }
          setErrorMessage(translatePresentationError(error));
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      });

    return () => {
      active = false;
    };
  }, [debouncedKey, enabled, invalidationToken]);

  return { data, isLoading, isRefreshing, errorMessage };
}
