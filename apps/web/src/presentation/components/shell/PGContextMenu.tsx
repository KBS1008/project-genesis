'use client';

import { useEffect, useRef } from 'react';

export type PGContextMenuItem = {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly onSelect: () => void;
};

type PGContextMenuProps = {
  readonly x: number;
  readonly y: number;
  readonly items: readonly PGContextMenuItem[];
  readonly onClose: () => void;
};

/** Accessible context menu primitive for workspace interactions. */
export function PGContextMenu({ x, y, items, onClose }: PGContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    menuRef.current?.focus();
  }, []);

  return (
    <div
      ref={menuRef}
      className="pg-context-menu"
      role="menu"
      tabIndex={-1}
      style={{ top: y, left: x }}
      onClick={(event) => {
        event.stopPropagation();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
        }
      }}
    >
      <div className="pg-context-menu-list">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            className="pg-context-menu-item"
            disabled={item.disabled === true}
            onClick={() => {
              if (item.disabled === true) {
                return;
              }

              item.onSelect();
              onClose();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
