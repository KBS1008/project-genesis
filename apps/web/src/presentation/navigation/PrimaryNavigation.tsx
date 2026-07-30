'use client';

import { PGSidebar } from '@/presentation/components/shell/PGSidebar';

/** @deprecated Use PGSidebar directly. Kept for backward-compatible imports and tests. */
export function PrimaryNavigation() {
  return <PGSidebar />;
}

export { labelPrimaryScreen } from '@/presentation/navigation/label-primary-screen';
