'use client';

import { useCallback, useState } from 'react';

/** Holds non-authoritative form drafts that must not touch domain state. */
export function useTransientFormState<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  const patch = useCallback((partial: Partial<T>) => {
    setValue((current) => ({ ...current, ...partial }));
  }, []);

  return {
    value,
    setValue,
    patch,
    reset,
  };
}
