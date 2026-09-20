import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WorkforceRoleVisual } from '@/presentation/components/assets/WorkforceRoleVisual';

describe('WorkforceRoleVisual', () => {
  it('renders Batch-1 primary img for production worker', () => {
    render(
      <WorkforceRoleVisual employeeTypeId="employee_production_worker" size={72} loading="eager" />,
    );
    const img = screen.getByRole('presentation', { hidden: true });
    expect(img.getAttribute('src')).toContain('WFV-001-employee_production_worker-primary');
    expect(img.getAttribute('data-workforce-primary')).toBe('true');
  });

  it('renders category fallback for unknown role', () => {
    render(<WorkforceRoleVisual employeeTypeId="employee_unknown" size={48} loading="eager" />);
    const img = screen.getByRole('presentation', { hidden: true });
    expect(img.getAttribute('data-workforce-primary')).toBe('false');
    expect(img.getAttribute('src')).toContain('ICON-002-administration');
  });

  it('renders production primary for completion role researcher', () => {
    render(<WorkforceRoleVisual employeeTypeId="employee_researcher_basic" size={72} loading="eager" />);
    const img = screen.getByRole('presentation', { hidden: true });
    expect(img.getAttribute('data-workforce-primary')).toBe('true');
    expect(img.getAttribute('src')).toContain('WFV-001-employee_researcher_basic-primary');
  });

  it('does not swap completion primary src to ICON-002 on image error', () => {
    render(<WorkforceRoleVisual employeeTypeId="employee_engineer_basic" size={72} loading="eager" />);
    const img = screen.getByRole('presentation', { hidden: true }) as HTMLImageElement;
    expect(img.getAttribute('src')).toContain('WFV-001-employee_engineer_basic-primary');
    fireEvent.error(img);
    expect(img.getAttribute('src')).toContain('WFV-001-employee_engineer_basic-primary');
    expect(img.getAttribute('data-workforce-primary')).toBe('true');
    expect(img.getAttribute('data-wfv-primary-load-failed')).toBe('true');
  });
});
