import { describe, expect, it } from 'vitest';
import {
  isWorkforceAssignmentPendingNavigation,
  resolveCompanyOperationsSectionScrollTargetId,
  type CompanyOperationsPendingNavigation,
} from '@/presentation/navigation/company-operations-pending-navigation';

describe('company-operations-pending-navigation', () => {
  it('recognizes workforce assignment pending navigation', () => {
    const pending: CompanyOperationsPendingNavigation = {
      kind: 'workforce_assignment',
      buildingId: 'building_005',
    };

    expect(isWorkforceAssignmentPendingNavigation(pending)).toBe(true);
    expect(isWorkforceAssignmentPendingNavigation({ kind: 'milestone_overview' })).toBe(false);
    expect(isWorkforceAssignmentPendingNavigation(null)).toBe(false);
  });

  it('maps section-scroll pending kinds to stable widget anchors', () => {
    expect(resolveCompanyOperationsSectionScrollTargetId({ kind: 'milestone_overview' })).toBe(
      'pg-milestones-widget-title',
    );
    expect(
      resolveCompanyOperationsSectionScrollTargetId({ kind: 'economy_contracts_section' }),
    ).toBe('pg-economy-widget-title');
    expect(
      resolveCompanyOperationsSectionScrollTargetId({ kind: 'finance_ledger_section' }),
    ).toBe('pg-finance-widget-title');
    expect(
      resolveCompanyOperationsSectionScrollTargetId({
        kind: 'workforce_assignment',
        buildingId: 'building_005',
      }),
    ).toBeNull();
  });
});
