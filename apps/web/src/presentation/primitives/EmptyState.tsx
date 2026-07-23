'use client';

/** Placeholder when a list or panel has no data to show. */
export function EmptyState({
  title,
  hint,
}: {
  readonly title: string;
  readonly hint?: string;
}) {
  return (
    <div className="pg-empty-state" role="status">
      <p className="pg-empty-state-title">{title}</p>
      {hint !== undefined ? <p className="pg-empty-state-hint">{hint}</p> : null}
    </div>
  );
}
