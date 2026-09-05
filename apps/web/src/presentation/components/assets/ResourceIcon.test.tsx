// @vitest-environment jsdom

import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResourceIcon } from '@/presentation/components/assets/ResourceIcon';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

describe('ResourceIcon', () => {
  it('renders registered artwork for a known resource', () => {
    renderPresentation(
      <div>
        <ResourceIcon resourceId="wood" />
        <span>Holz</span>
      </div>,
    );

    const image = screen.getByRole('presentation', { hidden: true });
    expect(image).toHaveAttribute('src', '/assets/icons/ICON-001-wood.png');
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Holz')).toBeInTheDocument();
  });

  it('renders nothing for unknown resources', () => {
    renderPresentation(
      <div>
        <ResourceIcon resourceId="unknown_resource" />
        <span>Unbekannt</span>
      </div>,
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Unbekannt')).toBeInTheDocument();
  });

  it('hides artwork when image loading fails', () => {
    renderPresentation(
      <div>
        <ResourceIcon resourceId="wood" />
        <span>Holz</span>
      </div>,
    );

    const image = screen.getByRole('presentation', { hidden: true });
    fireEvent.error(image);

    expect(screen.queryByRole('presentation', { hidden: true })).not.toBeInTheDocument();
    expect(screen.getByText('Holz')).toBeInTheDocument();
  });
});
