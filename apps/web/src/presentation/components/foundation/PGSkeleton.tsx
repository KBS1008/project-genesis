'use client';

/** Skeleton placeholder for loading widget surfaces. */
export function PGSkeleton({
  lines = 3,
  className = '',
}: {
  readonly lines?: number;
  readonly className?: string;
}) {
  return (
    <div className={`pg-skeleton ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <span key={index} className="pg-skeleton-line" />
      ))}
    </div>
  );
}
