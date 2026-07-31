// @vitest-environment jsdom

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('design tokens layout', () => {
  it('defines sidebar width within DD-044 range (260–300px)', () => {
    const tokensPath = resolve(
      process.cwd(),
      'apps/web/src/presentation/tokens/design-tokens.css',
    );
    const tokens = readFileSync(tokensPath, 'utf8');
    const match = /--sidebar-width:\s*([^;]+);/.exec(tokens);

    expect(match).not.toBeNull();

    const value = match![1]!.trim();
    expect(value).toBe('16.25rem');

    const root = document.documentElement;
    root.style.setProperty('--sidebar-width', value);
    const computed = getComputedStyle(root).getPropertyValue('--sidebar-width').trim();

    expect(computed).toBe('16.25rem');
  });

  it('uses the large breakpoint for shell responsive layout', () => {
    const shellCssPath = resolve(
      process.cwd(),
      'apps/web/src/presentation/components/shell/shell-components.css',
    );
    const shellCss = readFileSync(shellCssPath, 'utf8');

    expect(shellCss).toContain('@media (max-width: 64rem)');
  });
});
