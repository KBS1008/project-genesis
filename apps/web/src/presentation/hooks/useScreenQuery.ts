'use client';

import { useEffect, useRef, useState } from 'react';
import { useDebouncedValue } from '@/presentation/hooks/useDebouncedValue';
import { translatePresentationError } from '@/presentation/notifications/translatePresentationError';

export type ScreenQueryState<T> = {
  readonly data: T | null;
  readonly isLoading: boolean;
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
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setIsLoading(false);
      setErrorMessage(null);
      return;
    }

    let active = true;
    setIsLoading(true);
    setErrorMessage(null);

    void loaderRef
      .current()
      .then((result) => {
        if (active) {
          setData(result);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setData(null);
          setErrorMessage(translatePresentationError(error));
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [debouncedKey, enabled]);

  return { data, isLoading, errorMessage };
}
