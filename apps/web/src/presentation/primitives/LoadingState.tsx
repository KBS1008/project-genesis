'use client';

/** Centered loading indicator for async presentation states. */
export function LoadingState({
  label = 'Daten werden geladen…',
}: {
  readonly label?: string;
}) {
  return (
    <div
      className="pg-loading"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <div className="pg-loading-spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
