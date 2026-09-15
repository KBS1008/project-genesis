import type { ReactNode } from 'react';
import { DashboardIcon } from '@/presentation/icons/DashboardIcon';
import type { DashboardIconName } from '@/presentation/icons/DashboardIcon';

/** Decorative icon + visible authoritative label (icon never replaces text). */
export function ProductionOperationalStateIconLabel({
  icon,
  children,
}: {
  readonly icon: DashboardIconName | null;
  readonly children: ReactNode;
}) {
  if (icon === null) {
    return <>{children}</>;
  }

  return (
    <span className="pg-production-state-icon-label">
      <DashboardIcon name={icon} className="pg-production-state-icon" />
      <span>{children}</span>
    </span>
  );
}
