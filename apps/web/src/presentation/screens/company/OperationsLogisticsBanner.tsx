'use client';

/** Logistics status call-to-action for the operations dashboard. */
export function OperationsLogisticsBanner({
  message,
  onSelectLogistics,
}: {
  readonly message: string | null;
  readonly onSelectLogistics: () => void;
}) {
  if (message === null || message.length === 0) {
    return null;
  }

  return (
    <button type="button" className="pg-operations-logistics-banner" onClick={onSelectLogistics}>
      {message}
    </button>
  );
}
