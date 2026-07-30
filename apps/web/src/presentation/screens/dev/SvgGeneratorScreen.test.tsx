import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SvgGeneratorScreen } from '@/presentation/screens/dev/SvgGeneratorScreen';
import * as client from '@/presentation/adapters/api/svg-generator-client';

vi.mock('@/presentation/adapters/api/svg-generator-client');

describe('SvgGeneratorScreen', () => {
  beforeEach(() => {
    vi.mocked(client.fetchSvgTemplates).mockResolvedValue([
      {
        id: 'chart-library',
        name: 'Chart Library',
        description: 'Charts',
        kind: 'chart',
        defaultWidth: 1600,
        defaultHeight: 900,
        requiredFields: [],
        optionalFields: [],
        defaultContent: {},
      },
    ]);
    vi.mocked(client.fetchSvgBacklog).mockResolvedValue([
      {
        assetId: 'CH-010',
        backlogFilename: 'CH-010_Charts.svg',
        status: 'in-production',
        sprint: 'Sprint 10 — Charts',
        category: 'Charts',
      },
    ]);
    vi.mocked(client.fetchSvgGeneratorActivity).mockResolvedValue([]);
    vi.mocked(client.suggestSvgTemplate).mockResolvedValue('chart-library');
    vi.mocked(client.previewSvg).mockResolvedValue({
      assetId: 'CH-010',
      filename: 'CH-010_Charts.svg',
      targetPath: 'docs/design/charts/CH-010_Charts.svg',
      width: 1600,
      height: 900,
      sha256: 'abc',
      warnings: [],
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><title>t</title><desc>d</desc></svg>',
    });
  });

  it('renders backlog and template selector', async () => {
    render(<SvgGeneratorScreen />);
    expect(await screen.findByText(/CH-010_Charts.svg/)).toBeInTheDocument();
  });

  it('selects an asset and shows preview actions', async () => {
    const user = userEvent.setup();
    render(<SvgGeneratorScreen />);
    await screen.findByText(/CH-010_Charts.svg/);
    await user.click(screen.getByText(/CH-010_Charts.svg/));
    expect(await screen.findByText('Save asset')).toBeInTheDocument();
  });
});
