// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BuildingTypeIcon } from '@/presentation/components/assets/BuildingTypeIcon';

describe('BuildingTypeIcon', () => {
  it('renders primary ICON-003 art for batch-1 building types', () => {
    render(
      <BuildingTypeIcon buildingTypeId="sawmill" category="PRODUCTION" variant="primary" size={72} />,
    );

    const image = screen.getByRole('presentation', { hidden: true });
    expect(image).toHaveAttribute('src', expect.stringContaining('ICON-003-sawmill'));
  });

  it('falls back to category icon for uncovered building types', () => {
    const { container } = render(
      <BuildingTypeIcon buildingTypeId="port" category="INFRASTRUCTURE" variant="primary" />,
    );

    expect(container.querySelector('svg')).not.toBeNull();
    expect(screen.queryByRole('img', { hidden: true })).toBeNull();
  });
});
