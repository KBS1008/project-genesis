// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TechnologyVisual } from '@/presentation/components/assets/TechnologyVisual';

describe('TechnologyVisual', () => {
  it('renders detailed primary for batch-1 technology', () => {
    render(<TechnologyVisual technologyId="precision_machining" size={80} loading="eager" />);

    const image = screen.getByRole('presentation', { hidden: true });
    expect(image).toHaveAttribute('src', expect.stringContaining('ICON-004-precision_machining-primary'));
  });

  it('renders detailed primary for batch-2 technology', () => {
    render(<TechnologyVisual technologyId="basic_woodworking" size={80} loading="eager" />);

    const image = screen.getByRole('presentation', { hidden: true });
    expect(image).toHaveAttribute('src', expect.stringContaining('ICON-004-basic_woodworking-primary'));
  });

  it('renders category compact for category-only technology', () => {
    render(<TechnologyVisual technologyId="corporate_management" size={48} loading="eager" />);

    const image = screen.getByRole('presentation', { hidden: true });
    expect(image).toHaveAttribute('src', expect.stringContaining('ICON-004-category-MANAGEMENT'));
  });
});
