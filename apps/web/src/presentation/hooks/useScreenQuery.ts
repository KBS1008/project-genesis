'use client';

import { useEffect, useState } from 'react';
import { translatePresentationError } from '@/presentation/notifications/translatePresentationError';

export type ScreenQueryState<T> = {
  readonly data: T | null;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
};

/** Loads screen-scoped query data with loading and error presentation state. */
export function useScreenQuery<T>(
  queryKey: string,
  loader: () => Promise<T>,
  enabled: boolean,
): ScreenQueryState<T> {
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

    void loader()
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
  }, [queryKey, enabled]);

  return { data, isLoading, errorMessage };
}
