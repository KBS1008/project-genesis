// @vitest-environment jsdom

import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import {
  PGKpiCard,
  PGNotificationCenter,
  PGReportWidget,
  PGStatusPanel,
} from '@/presentation/components/dashboard';
import { PGInspectorPanel, PGStatusBar } from '@/presentation/components/layout';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

expect.extend(matchers);

describe('dashboard accessibility', () => {
  it('PGKpiCard has no axe violations', async () => {
    const { container } = renderPresentation(
      <PGKpiCard label="Cash" value="1.000 GC" trend="+2 %" placeholder="{{cash}}" />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('PGStatusPanel has no axe violations', async () => {
    const { container } = renderPresentation(
      <PGStatusPanel
        items={[{ id: 'session', label: 'Session', value: 'Aktiv', tone: 'success' }]}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('PGNotificationCenter has no axe violations', async () => {
    const { container } = renderPresentation(
      <PGNotificationCenter
        notifications={[
          {
            id: 'alert-1',
            title: 'Logistik',
            message: 'Transport verzögert',
            tone: 'info',
          },
        ]}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('PGReportWidget has no axe violations', async () => {
    const { container } = renderPresentation(
      <PGReportWidget
        actions={[{ id: 'open-reports', label: 'Berichte' }]}
        onAction={() => {}}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
    expect(screen.getByRole('button', { name: 'Berichte öffnen' })).toBeInTheDocument();
  });

  it('PGInspectorPanel has no axe violations when populated', async () => {
    const { container } = renderPresentation(
      <PGInspectorPanel
        title="Gebäude A"
        subtitle="Produktion"
        entries={[{ label: 'Status', value: 'Aktiv' }]}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('PGStatusBar has no axe violations', async () => {
    const { container } = renderPresentation(<PGStatusBar left="Left" center="Center" right="Right" />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
