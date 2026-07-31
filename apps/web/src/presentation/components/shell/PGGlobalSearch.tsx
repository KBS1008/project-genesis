'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFocusTrap } from '@/presentation/hooks/useFocusTrap';
import type { GlobalSearchItem } from './global-search-types';

type PGGlobalSearchProps = {
  readonly items: readonly GlobalSearchItem[];
  readonly filterItems: (
    items: readonly GlobalSearchItem[],
    query: string,
  ) => readonly GlobalSearchItem[];
  readonly onClose: () => void;
  readonly onSelect: (item: GlobalSearchItem) => void;
};

/** Command palette for screen navigation and entity lookup. */
export function PGGlobalSearch({ items, filterItems, onClose, onSelect }: PGGlobalSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => filterItems(items, query), [filterItems, items, query]);

  useFocusTrap(panelRef, true);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((current) => Math.min(current + 1, Math.max(results.length - 1, 0)));
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((current) => Math.max(current - 1, 0));
        return;
      }

      if (event.key === 'Enter' && results[activeIndex] !== undefined) {
        event.preventDefault();
        onSelect(results[activeIndex]!);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, onClose, onSelect, results]);

  return (
    <div
      className="pg-global-search-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        className="pg-global-search-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Globale Suche"
      >
        <input
          ref={inputRef}
          className="pg-global-search-input"
          type="search"
          placeholder="Bildschirme und Entitäten suchen…"
          aria-label="Globale Suche"
          aria-controls="pg-global-search-results"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
        <div
          id="pg-global-search-results"
          className="pg-global-search-results"
          role="listbox"
          aria-label="Suchergebnisse"
        >
          {results.length === 0 ? (
            <p className="pg-global-search-empty">Keine Treffer</p>
          ) : (
            results.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={`pg-global-search-result${index === activeIndex ? ' is-active' : ''}`.trim()}
                onMouseEnter={() => {
                  setActiveIndex(index);
                }}
                onClick={() => {
                  onSelect(item);
                }}
              >
                <span>{item.label}</span>
                <small>
                  {item.kind === 'screen' ? 'Bildschirm' : 'Entität'} · {item.description}
                </small>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
