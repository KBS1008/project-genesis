import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { VisualAssetsScreen } from '@/presentation/screens/dev/VisualAssetsScreen';
import * as client from '@/presentation/adapters/api/visual-assets-client';

vi.mock('@/presentation/adapters/api/visual-assets-client');

describe('VisualAssetsScreen', () => {
  beforeEach(() => {
    vi.mocked(client.fetchVisualAssets).mockResolvedValue([
      {
        lineIndex: 10,
        status: 'planned',
        backlogFilename: 'MM-001_Main_Menu.png',
        assetId: 'MM-001',
        sprint: 'Sprint 1 — Main Menu',
        category: 'Main Menu',
      },
    ]);
    vi.mocked(client.fetchVisualAssetActivity).mockResolvedValue([]);
  });

  it('renders backlog items and filters', async () => {
    render(<VisualAssetsScreen />);

    expect(await screen.findByText('MM-001')).toBeInTheDocument();
    expect(screen.getByText('MM-001_Main_Menu.png')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  it('selects an asset from the backlog table', async () => {
    const user = userEvent.setup();
    render(<VisualAssetsScreen />);

    await screen.findByText('MM-001_Main_Menu.png');
    await user.click(screen.getByText('MM-001_Main_Menu.png'));

    expect(await screen.findByText('Backlog filename')).toBeInTheDocument();
  });
});
