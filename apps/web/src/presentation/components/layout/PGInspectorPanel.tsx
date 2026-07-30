'use client';

import type { ReactNode } from 'react';
import { Button } from '@/presentation/primitives/Button';
import { EmptyState } from '@/presentation/primitives/EmptyState';

export type PGInspectorEntry = {
  readonly label: string;
  readonly value: string;
  readonly valueClass?: string;
};

/** Right-side inspector panel for entity details and contextual metadata. */
export function PGInspectorPanel({
  title,
  subtitle,
  entries,
  relatedTitle,
  relatedItems,
  onClose,
  emptyTitle = 'Keine Auswahl',
  emptyHint = 'Wählen Sie ein Element aus, um Details anzuzeigen.',
}: {
  readonly title?: string;
  readonly subtitle?: string;
  readonly entries?: readonly PGInspectorEntry[];
  readonly relatedTitle?: string;
  readonly relatedItems?: readonly { readonly primary: string; readonly secondary: string }[];
  readonly onClose?: () => void;
  readonly emptyTitle?: string;
  readonly emptyHint?: string;
}) {
  const hasContent = title !== undefined && entries !== undefined && entries.length > 0;

  return (
    <aside className="pg-inspector-panel" aria-label="Inspektor">
      <div className="pg-inspector-header">
        <h2 className="pg-inspector-title">Inspektor</h2>
        {onClose !== undefined ? (
          <Button variant="secondary" aria-label="Inspektor schließen" onClick={onClose}>
            Schließen
          </Button>
        ) : null}
      </div>

      {!hasContent ? (
        <EmptyState title={emptyTitle} hint={emptyHint} />
      ) : (
        <div className="pg-inspector-body">
          <div>
            <h3 className="pg-inspector-entity-title">{title}</h3>
            {subtitle !== undefined ? <p className="pg-inspector-subtitle">{subtitle}</p> : null}
          </div>
          <dl className="pg-inspector-list">
            {entries.map((entry) => (
              <div key={entry.label} className="pg-inspector-row">
                <dt>{entry.label}</dt>
                <dd className={entry.valueClass}>{entry.value}</dd>
              </div>
            ))}
          </dl>
          {relatedItems !== undefined && relatedItems.length > 0 ? (
            <div className="pg-inspector-related">
              <h4>{relatedTitle ?? 'Verknüpft'}</h4>
              <ul>
                {relatedItems.map((item) => (
                  <li key={`${item.primary}-${item.secondary}`}>
                    <strong>{item.primary}</strong>
                    <span>{item.secondary}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </aside>
  );
}
