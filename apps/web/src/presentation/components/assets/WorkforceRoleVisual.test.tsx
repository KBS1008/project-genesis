import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WorkforceRoleVisual } from '@/presentation/components/assets/WorkforceRoleVisual';

describe('WorkforceRoleVisual', () => {
  it('renders Batch-1 primary img for production worker', () => {
    render(
      <WorkforceRoleVisual employeeTypeId="employee_production_worker" size={72} loading="eager" />,
    );
    const img = screen.getByRole('presentation', { hidden: true });
    expect(img.getAttribute('src')).toContain('WFV-001-employee_production_worker-primary');
  });

  it('renders category fallback for non-Batch-1 role', () => {
    render(<WorkforceRoleVisual employeeTypeId="employee_researcher_basic" size={48} loading="eager" />);
    const img = screen.getByRole('presentation', { hidden: true });
    expect(img.getAttribute('data-workforce-primary')).toBe('false');
    expect(img.getAttribute('src')).toContain('ICON-002-research');
  });
});
