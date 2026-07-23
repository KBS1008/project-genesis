'use client';

import type { ReactNode } from 'react';

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
  return (
    <section className={`pg-card ${className}`.trim()} aria-labelledby={title ? 'pg-card-title' : undefined}>
      {title !== undefined ? (
        <h2 id="pg-card-title" className="pg-card-title">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
