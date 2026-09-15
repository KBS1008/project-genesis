import { describe, expect, it } from 'vitest';
import { resolveProductionOperationalStateDashboardIcon } from '@/presentation/screens/production/production-operational-state-dashboard-icon';

describe('resolveProductionOperationalStateDashboardIcon', () => {
  it('maps stalled and finished states to established DashboardIcon names', () => {
    expect(resolveProductionOperationalStateDashboardIcon('STALLED_ENERGY')).toBe('energy');
    expect(resolveProductionOperationalStateDashboardIcon('STALLED_WORKFORCE')).toBe('employees');
    expect(resolveProductionOperationalStateDashboardIcon('FINISHED')).toBe('success');
  });

  it('keeps waiting and running icon-free', () => {
    expect(resolveProductionOperationalStateDashboardIcon('WAITING')).toBeNull();
    expect(resolveProductionOperationalStateDashboardIcon('RUNNING')).toBeNull();
  });

  it('falls back to no icon for unknown states', () => {
    expect(resolveProductionOperationalStateDashboardIcon(undefined)).toBeNull();
    expect(resolveProductionOperationalStateDashboardIcon('UNKNOWN')).toBeNull();
  });
});
