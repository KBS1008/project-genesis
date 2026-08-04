// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { PGChartWidget } from '@/presentation/components/dashboard/charts/PGChartWidget';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

expect.extend(matchers);

describe('PG chart accessibility', () => {
  it('PGChartWidget has no axe violations when populated', async () => {
    const { container } = renderPresentation(
      <PGChartWidget title="Kapital" ariaLabel="Kapitalverlauf" pointCount={3} minPoints={2}>
        <div role="img" aria-label="Chart placeholder" />
      </PGChartWidget>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('PGChartWidget has no axe violations in empty state', async () => {
    const { container } = renderPresentation(
      <PGChartWidget title="Kapital" ariaLabel="Kapitalverlauf" pointCount={1} minPoints={2}>
        <div>Chart</div>
      </PGChartWidget>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
