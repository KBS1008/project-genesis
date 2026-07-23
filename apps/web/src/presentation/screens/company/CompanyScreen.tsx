'use client';

import { useEffect, useState } from 'react';
import { CompanyDashboardScreen } from '@/presentation/screens/company/CompanyDashboardScreen';
import { CompanyOverviewScreen } from '@/presentation/screens/company/CompanyOverviewScreen';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import '../world/world-company.css';

function isCompanyEntitySelection(kind: string): boolean {
  return (
    kind === 'building' ||
    kind === 'production' ||
    kind === 'transport' ||
    kind === 'research' ||
    kind === 'employee' ||
    kind === 'resource'
  );
}

/** Company route combining Phase 6 overview and the operational dashboard. */
export function CompanyScreen() {
  const { navigation } = useGameWorkspace();
  const [view, setView] = useState<'overview' | 'operations'>('overview');

  useEffect(() => {
    if (isCompanyEntitySelection(navigation.entitySelection.kind)) {
      setView('operations');
    }
  }, [navigation.entitySelection.kind]);

  if (view === 'operations') {
    return (
      <CompanyDashboardScreen
        hideHeader
        onBackToOverview={() => {
          setView('overview');
        }}
      />
    );
  }

  return (
    <CompanyOverviewScreen
      onOpenOperations={() => {
        setView('operations');
      }}
    />
  );
}
