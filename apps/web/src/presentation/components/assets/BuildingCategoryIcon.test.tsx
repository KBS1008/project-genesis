// @vitest-environment jsdom

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BuildingCategoryIcon } from '@/presentation/components/assets/BuildingCategoryIcon';

describe('BuildingCategoryIcon', () => {
  it('renders inline SVG with currentColor stroke for known categories', () => {
    const { container } = render(
      <div style={{ color: 'rgb(255, 0, 0)' }}>
        <BuildingCategoryIcon category="PRODUCTION" />
      </div>,
    );

    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('stroke')).toBe('currentColor');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('inherits theme color through currentColor stroke semantics', () => {
    const { container } = render(
      <div style={{ color: 'rgb(255, 0, 0)' }}>
        <BuildingCategoryIcon category="STORAGE" />
      </div>,
    );

    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(window.getComputedStyle(svg as Element).color).toBe('rgb(255, 0, 0)');
  });

  it('does not render an img tag or substitute icon for unknown categories', () => {
    const { container } = render(<BuildingCategoryIcon category="UNKNOWN" />);

    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toBe('');
  });
});
