'use client';

import { Fragment, type ReactNode } from 'react';
import { Button } from '@/presentation/primitives/Button';
import { EmptyState } from '@/presentation/primitives/EmptyState';

export type PGInspectorEntry = {
  readonly label: string;
  readonly value: string;
  readonly valueClass?: string;
};

export type PGInspectorSection = {
  readonly id: string;
  readonly title: string;
  readonly entries: readonly PGInspectorEntry[];
  readonly actionLabel?: string;
  readonly onAction?: () => void;
};

export type PGInspectorRelatedItem = {
  readonly primary: string;
  readonly secondary: string;
  readonly secondaryClass?: string;
};

/** Right-side inspector panel for entity details and contextual metadata. */
export function PGInspectorPanel({
  title,
  subtitle,
  entries,
  sections,
  footer,
  relatedTitle,
  relatedItems,
  onClose,
  emptyTitle = 'Keine Auswahl',
  emptyHint = 'Wählen Sie ein Element aus, um Details anzuzeigen.',
}: {
  readonly title?: string;
  readonly subtitle?: string;
  readonly entries?: readonly PGInspectorEntry[];
  readonly sections?: readonly PGInspectorSection[];
  readonly footer?: ReactNode;
  readonly relatedTitle?: string;
  readonly relatedItems?: readonly PGInspectorRelatedItem[];
  readonly onClose?: () => void;
  readonly emptyTitle?: string;
  readonly emptyHint?: string;
}) {
  const hasFocusContent = title !== undefined && entries !== undefined && entries.length > 0;
  const hasSections = sections !== undefined && sections.length > 0;
  const hasContent = hasFocusContent || hasSections || footer !== undefined;

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
          {hasFocusContent ? (
            <>
              <div>
                <h3 className="pg-inspector-entity-title">{title}</h3>
                {subtitle !== undefined ? <p className="pg-inspector-subtitle">{subtitle}</p> : null}
              </div>
              <dl className="pg-inspector-list">
                {entries.map((entry) => (
                  <Fragment key={entry.label}>
                    <dt>{entry.label}</dt>
                    <dd className={entry.valueClass}>{entry.value}</dd>
                  </Fragment>
                ))}
              </dl>
            </>
          ) : null}

          {hasSections
            ? sections.map((section) => (
                <section key={section.id} className="pg-inspector-section">
                  <div className="pg-inspector-section-header">
                    <h4 className="pg-inspector-section-title">{section.title}</h4>
                    {section.onAction !== undefined && section.actionLabel !== undefined ? (
                      <Button variant="secondary" onClick={section.onAction}>
                        {section.actionLabel}
                      </Button>
                    ) : null}
                  </div>
                  {section.entries.length > 0 ? (
                    <dl className="pg-inspector-list">
                      {section.entries.map((entry) => (
                        <Fragment key={`${section.id}-${entry.label}`}>
                          <dt>{entry.label}</dt>
                          <dd className={entry.valueClass}>{entry.value}</dd>
                        </Fragment>
                      ))}
                    </dl>
                  ) : null}
                </section>
              ))
            : null}

          {relatedItems !== undefined && relatedItems.length > 0 ? (
            <div className="pg-inspector-related">
              <h4>{relatedTitle ?? 'Verknüpft'}</h4>
              <ul>
                {relatedItems.map((item) => (
                  <li key={`${item.primary}-${item.secondary}`}>
                    <strong>{item.primary}</strong>
                    <span className={item.secondaryClass}>{item.secondary}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {footer !== undefined ? <div className="pg-inspector-footer">{footer}</div> : null}
        </div>
      )}
    </aside>
  );
}
