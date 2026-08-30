import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('operations dashboard layout contract', () => {
  it('keeps operations layout within available workspace width', () => {
    const cssPath = resolve(
      process.cwd(),
      'apps/web/src/presentation/screens/company/operations-dashboard-layout.css',
    );
    const css = readFileSync(cssPath, 'utf8');

    expect(css).toMatch(/\.pg-operations-layout[\s\S]*width:\s*100%/);
    expect(css).toMatch(/\.pg-operations-layout[\s\S]*max-width:\s*100%/);
    expect(css).toMatch(/\.pg-operations-layout[\s\S]*min-width:\s*0/);
    expect(css).toMatch(/\.pg-operations-layout[\s\S]*position:\s*relative/);
  });

  it('scopes loading overlay to operations layout instead of viewport', () => {
    const cssPath = resolve(
      process.cwd(),
      'apps/web/src/presentation/components/dashboard/dashboard-components.css',
    );
    const css = readFileSync(cssPath, 'utf8');

    expect(css).toMatch(/\.pg-loading-overlay[\s\S]*position:\s*absolute/);
    expect(css).not.toMatch(/\.pg-loading-overlay[\s\S]*position:\s*fixed/);
  });

  it('uses shrink-safe responsive KPI grid columns', () => {
    const cssPath = resolve(
      process.cwd(),
      'apps/web/src/presentation/components/dashboard/dashboard-components.css',
    );
    const css = readFileSync(cssPath, 'utf8');

    expect(css).toContain('repeat(auto-fit, minmax(min(100%, 11rem), 1fr))');
    expect(css).toMatch(/\.pg-kpi-grid > \*[\s\S]*min-width:\s*0/);
  });

  it('keeps executive dashboard within workspace width', () => {
    const cssPath = resolve(
      process.cwd(),
      'apps/web/src/presentation/components/dashboard/dashboard-components.css',
    );
    const css = readFileSync(cssPath, 'utf8');

    expect(css).toMatch(/\.pg-executive-dashboard[\s\S]*width:\s*100%/);
    expect(css).toMatch(/\.pg-executive-dashboard[\s\S]*max-width:\s*100%/);
    expect(css).toMatch(/\.pg-executive-dashboard[\s\S]*min-width:\s*0/);
  });
});
