import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MilestoneVisual } from '@/presentation/components/assets/MilestoneVisual';

describe('MilestoneVisual', () => {
  it('renders production medallion for a known milestone', () => {
    render(<MilestoneVisual milestoneId="first_production" size={64} loading="eager" />);

    const img = screen.getByRole('presentation', { hidden: true });
    expect(img).toHaveAttribute('data-msv-asset-id', 'MSV-001-first_production-medallion');
    expect(img).toHaveAttribute('data-milestone-primary', 'true');
  });

  it('renders unknown fallback medallion for unmapped milestone IDs', () => {
    render(<MilestoneVisual milestoneId="milestone_unknown" size={48} loading="eager" />);

    const img = screen.getByRole('presentation', { hidden: true });
    expect(img).toHaveAttribute('data-msv-asset-id', 'MSV-001-milestone_unknown-medallion');
    expect(img).toHaveAttribute('data-milestone-primary', 'false');
  });

  it('applies locked styling class when not completed', () => {
    render(
      <MilestoneVisual milestoneId="first_steel" completed={false} size={64} loading="eager" />,
    );

    const img = screen.getByRole('presentation', { hidden: true });
    expect(img.className).toContain('is-locked');
  });
});
