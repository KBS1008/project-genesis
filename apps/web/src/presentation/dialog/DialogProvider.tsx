'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { ConfirmDialogRequest, DialogContextValue, DialogRequest } from './types';

const DialogContext = createContext<DialogContextValue | null>(null);

/** Manages modal dialogs for the presentation workspace. */
export function DialogProvider({ children }: { readonly children: ReactNode }) {
  const [activeDialog, setActiveDialog] = useState<DialogRequest | null>(null);
  const confirmHandlerRef = useRef<(() => void) | null>(null);

  const closeDialog = useCallback(() => {
    confirmHandlerRef.current = null;
    setActiveDialog(null);
  }, []);

  const openConfirmDialog = useCallback(
    (request: Omit<ConfirmDialogRequest, 'type'>, onConfirm: () => void) => {
      confirmHandlerRef.current = onConfirm;
      setActiveDialog({ type: 'confirm', ...request });
    },
    [],
  );

  const confirmDialog = useCallback(() => {
    confirmHandlerRef.current?.();
    closeDialog();
  }, [closeDialog]);

  const value = useMemo<DialogContextValue>(
    () => ({
      activeDialog,
      openConfirmDialog,
      closeDialog,
      confirmDialog,
    }),
    [activeDialog, openConfirmDialog, closeDialog, confirmDialog],
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

/** Accesses the shared dialog context. */
export function useDialog(): DialogContextValue {
  const context = useContext(DialogContext);

  if (context === null) {
    throw new Error('useDialog must be used within DialogProvider.');
  }

  return context;
}
