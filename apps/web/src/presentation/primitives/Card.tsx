'use client';

import type { ReactNode } from 'react';
import { useId } from 'react';

/** Elevated surface container for dashboard panels and forms. */
export function Card({
  title,
  children,
  className = '',
}: {
  readonly title?: string;
  readonly children: ReactNode;
  readonly className?: string;
}) {
  const titleId = useId();

  return (
    <section className={`pg-card ${className}`.trim()} aria-labelledby={title !== undefined ? titleId : undefined}>
      {title !== undefined ? (
        <h2 id={titleId} className="pg-card-title">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
