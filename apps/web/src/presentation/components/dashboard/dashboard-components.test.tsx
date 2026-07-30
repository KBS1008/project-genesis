// @vitest-environment jsdom

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  PGKpiCard,
  PGNotificationCenter,
  PGReportWidget,
  PGStatusPanel,
} from '@/presentation/components/dashboard';
import { PGStatusBar } from '@/presentation/components/layout';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

describe('dashboard components', () => {
  it('PGKpiCard renders label and value with accessibility label', () => {
    renderPresentation(<PGKpiCard label="Cash" value="1.000 GC" trend="+2 %" placeholder="{{cash}}" />);

    expect(screen.getByLabelText('Cash')).toBeInTheDocument();
    expect(screen.getByText('1.000 GC')).toBeInTheDocument();
  });

  it('PGStatusPanel renders status rows', () => {
    renderPresentation(
      <PGStatusPanel
        items={[
          { id: 'session', label: 'Session', value: 'Aktiv', tone: 'success' },
        ]}
      />,
    );

    expect(screen.getByText('Session')).toBeInTheDocument();
    expect(screen.getByText('Aktiv')).toBeInTheDocument();
  });

  it('PGNotificationCenter renders empty state', () => {
    renderPresentation(<PGNotificationCenter notifications={[]} />);

    expect(screen.getByText('Keine Benachrichtigungen')).toBeInTheDocument();
  });

  it('PGReportWidget invokes action handler', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderPresentation(
      <PGReportWidget
        actions={[{ id: 'open-reports', label: 'Berichte' }]}
        onAction={onAction}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Öffnen' }));
    expect(onAction).toHaveBeenCalledWith('open-reports');
  });

  it('PGStatusBar renders footer sections', () => {
    renderPresentation(<PGStatusBar left="Left" center="Center" right="Right" />);

    expect(screen.getByRole('contentinfo', { name: 'Statusleiste' })).toBeInTheDocument();
    expect(screen.getByText('Center')).toBeInTheDocument();
  });
});
