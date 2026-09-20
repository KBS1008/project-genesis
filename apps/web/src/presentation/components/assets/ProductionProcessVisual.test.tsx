// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProductionProcessVisual } from '@/presentation/components/assets/ProductionProcessVisual';

describe('ProductionProcessVisual', () => {
  it('renders process primary for production recipe', () => {
    render(<ProductionProcessVisual recipeId="recipe_planks" size={72} loading="eager" />);

    const image = screen.getByRole('presentation', { hidden: true });
    expect(image).toHaveAttribute('src', expect.stringContaining('ICON-005-recipe_planks-primary'));
  });

  it('falls back for unknown recipe', () => {
    render(<ProductionProcessVisual recipeId="recipe_missing" size={48} loading="eager" />);

    const image = screen.getByRole('presentation', { hidden: true });
    expect(image).toHaveAttribute('src', expect.stringContaining('ICON-002-production'));
  });
});
