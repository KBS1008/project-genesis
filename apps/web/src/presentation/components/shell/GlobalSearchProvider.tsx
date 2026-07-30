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
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import { buildGlobalSearchIndex, filterGlobalSearchItems } from './build-global-search-index';
import { PGGlobalSearch } from './PGGlobalSearch';
import type { GlobalSearchItem } from './global-search-types';

type GlobalSearchContextValue = {
  readonly isOpen: boolean;
  readonly openSearch: () => void;
  readonly closeSearch: () => void;
  readonly toggleSearch: () => void;
};

const GlobalSearchContext = createContext<GlobalSearchContextValue | null>(null);

/** Provides global command palette state and keyboard shortcut handling. */
export function GlobalSearchProvider({ children }: { readonly children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { companyViewData, regions, navigateToScreen, navigateToTarget } = useGameWorkspace();

  const items = useMemo(
    () => buildGlobalSearchIndex(companyViewData, regions),
    [companyViewData, regions],
  );

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toggleSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleSearch]);

  const handleSelect = useCallback(
    (item: GlobalSearchItem) => {
      if (item.kind === 'screen' || item.entityKind === undefined || item.entityId === undefined) {
        navigateToScreen(item.screen);
      } else {
        navigateToTarget({
          screen: item.screen,
          entitySelection: { kind: item.entityKind, id: item.entityId },
        });
      }

      closeSearch();
    },
    [closeSearch, navigateToScreen, navigateToTarget],
  );

  const value = useMemo<GlobalSearchContextValue>(
    () => ({
      isOpen,
      openSearch,
      closeSearch,
      toggleSearch,
    }),
    [closeSearch, isOpen, openSearch, toggleSearch],
  );

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
      {isOpen ? (
        <PGGlobalSearch
          items={items}
          filterItems={filterGlobalSearchItems}
          onClose={closeSearch}
          onSelect={handleSelect}
        />
      ) : null}
    </GlobalSearchContext.Provider>
  );
}

/** Accesses global search open/close controls. */
export function useGlobalSearch(): GlobalSearchContextValue {
  const context = useContext(GlobalSearchContext);

  if (context === null) {
    throw new Error('useGlobalSearch must be used within GlobalSearchProvider.');
  }

  return context;
}
