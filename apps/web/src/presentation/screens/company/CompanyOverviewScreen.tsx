'use client';

import { ExecutiveDashboardScreen } from '@/presentation/screens/dashboard/ExecutiveDashboardScreen';

/** Company route combining executive dashboard and operational dashboard. */
export function CompanyOverviewScreen({
  onOpenOperations,
}: {
  readonly onOpenOperations: () => void;
}) {
  return <ExecutiveDashboardScreen onOpenOperations={onOpenOperations} />;
}
