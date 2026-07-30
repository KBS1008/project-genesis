'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { PGContextMenu, type PGContextMenuItem } from './PGContextMenu';

type ContextMenuState = {
  readonly x: number;
  readonly y: number;
  readonly items: readonly PGContextMenuItem[];
};

type ContextMenuContextValue = {
  readonly openContextMenu: (
    event: React.MouseEvent,
    items: readonly PGContextMenuItem[],
  ) => void;
  readonly closeContextMenu: () => void;
};

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

/** Provides workspace context menu state and dismissal handling. */
export function ContextMenuProvider({ children }: { readonly children: ReactNode }) {
  const [menu, setMenu] = useState<ContextMenuState | null>(null);

  const closeContextMenu = useCallback(() => {
    setMenu(null);
  }, []);

  const openContextMenu = useCallback(
    (event: React.MouseEvent, items: readonly PGContextMenuItem[]) => {
      if (items.length === 0) {
        return;
      }

      event.preventDefault();
      setMenu({
        x: event.clientX,
        y: event.clientY,
        items,
      });
    },
    [],
  );

  useEffect(() => {
    if (menu === null) {
      return;
    }

    const handleDismiss = () => {
      closeContextMenu();
    };

    window.addEventListener('click', handleDismiss);
    window.addEventListener('scroll', handleDismiss, true);
    window.addEventListener('resize', handleDismiss);
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeContextMenu();
      }
    });

    return () => {
      window.removeEventListener('click', handleDismiss);
      window.removeEventListener('scroll', handleDismiss, true);
      window.removeEventListener('resize', handleDismiss);
    };
  }, [closeContextMenu, menu]);

  const value = useMemo<ContextMenuContextValue>(
    () => ({
      openContextMenu,
      closeContextMenu,
    }),
    [closeContextMenu, openContextMenu],
  );

  return (
    <ContextMenuContext.Provider value={value}>
      {children}
      {menu !== null ? (
        <PGContextMenu
          x={menu.x}
          y={menu.y}
          items={menu.items}
          onClose={closeContextMenu}
        />
      ) : null}
    </ContextMenuContext.Provider>
  );
}

/** Accesses workspace context menu controls. */
export function useContextMenu(): ContextMenuContextValue {
  const context = useContext(ContextMenuContext);

  if (context === null) {
    throw new Error('useContextMenu must be used within ContextMenuProvider.');
  }

  return context;
}
