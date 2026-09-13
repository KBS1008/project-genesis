// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import * as visualAssetRegistry from '@/presentation/assets/visual-asset-registry';
import { getVisualAssetEntry } from '@/presentation/assets';
import { MainMenuHome } from '@/presentation/screens/menu/MainMenuHome';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

describe('MainMenuHome BR-001 integration', () => {
  const defaultProps = {
    sessionStatus: null,
    errorMessage: null,
    onNavigate: vi.fn(),
    onContinue: vi.fn(),
    onExit: vi.fn(),
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps Project Genesis heading text present', () => {
    renderPresentation(<MainMenuHome {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Project Genesis' })).toBeTruthy();
  });

  it('renders BR-001 through PGVisualAssetImage with decorative alt', () => {
    renderPresentation(<MainMenuHome {...defaultProps} />);
    const brandMark = document.querySelector('img.pg-main-menu-brand-mark');
    expect(brandMark).not.toBeNull();
    expect(brandMark).toHaveAttribute('alt', '');
    expect(brandMark).toHaveAttribute('src', '/assets/branding/BR-001.svg');
  });

  it('does not reference MM-006 for brand artwork', () => {
    renderPresentation(<MainMenuHome {...defaultProps} />);
    const brandMark = document.querySelector('.pg-main-menu-brand-mark');
    expect(brandMark?.getAttribute('src')).not.toContain('MM-006');
    expect(getVisualAssetEntry('BR-001')?.path).not.toContain('MM-006');
  });

  it('keeps main menu actions when BR-001 resolves', () => {
    renderPresentation(<MainMenuHome {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Neues Spiel' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Beenden' })).toBeTruthy();
  });

  it('keeps heading when BR-001 registry entry is unavailable', () => {
    const originalGet = visualAssetRegistry.getVisualAssetEntry.bind(visualAssetRegistry);
    vi.spyOn(visualAssetRegistry, 'getVisualAssetEntry').mockImplementation((assetId) => {
      if (assetId === 'BR-001') {
        return null;
      }

      return originalGet(assetId);
    });

    renderPresentation(<MainMenuHome {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Project Genesis' })).toBeTruthy();
    expect(document.querySelector('.pg-main-menu-brand-mark')).toBeNull();
  });
});
