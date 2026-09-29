import { describe, expect, it } from 'vitest';
import {
  isWorkforceAssignmentPendingNavigation,
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
});
