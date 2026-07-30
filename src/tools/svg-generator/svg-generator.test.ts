import { describe, expect, it } from 'vitest';
import { escapeXml, formatNumber, sanitizeText, createStableId } from './escape.js';
import { DEFAULT_SVG_TOKENS } from './tokens.js';
import { validateSvg, sanitizeSvg } from './validator.js';
import { getSvgTemplate, listSvgTemplates, suggestTemplateForAsset } from './templates/registry.js';
import { chartLibraryTemplate } from './templates/chart-library.js';
import { buildLinePoints } from './geometry.js';

describe('svg generator escape utilities', () => {
  it('escapes XML entities', () => {
    expect(escapeXml('<script>&"\'</script>')).toBe(
      '&lt;script&gt;&amp;&quot;&apos;&lt;/script&gt;',
    );
  });

  it('sanitizes control characters from text', () => {
    expect(sanitizeText(' hello\nworld \u0007')).toBe('hello\nworld');
  });

  it('formats numbers deterministically', () => {
    expect(formatNumber(10)).toBe('10');
    expect(formatNumber(10.5)).toBe('10.5');
  });

  it('creates stable IDs', () => {
    expect(createStableId('CH', '010', 'Charts')).toBe('ch-010-charts');
  });
});

describe('svg generator tokens', () => {
  it('exposes canonical design tokens', () => {
    expect(DEFAULT_SVG_TOKENS.accentPrimary).toBe('#38a3ff');
    expect(DEFAULT_SVG_TOKENS.spacing.length).toBeGreaterThan(0);
  });
});

describe('svg generator template registry', () => {
  it('lists required templates', () => {
    const ids = listSvgTemplates().map((template) => template.id);
    expect(ids).toContain('chart-library');
    expect(ids).toContain('icon-sheet');
    expect(ids).toContain('map-overlay');
    expect(ids).toContain('kpi-card-library');
  });

  it('suggests chart template for CH assets', () => {
    expect(suggestTemplateForAsset('CH-010')).toBe('chart-library');
  });
});

describe('svg generator chart geometry', () => {
  it('builds stable line chart points', () => {
    expect(buildLinePoints([1, 2, 3], 0, 100, 100, 0)).toBe('0,66.667 50,33.333 100,0');
  });
});

describe('svg generator validation', () => {
  it('rejects script injection', () => {
    const svg = `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><title>t</title><desc>d</desc><script>alert(1)</script></svg>`;
    const result = validateSvg(svg);
    expect(result.ok).toBe(false);
  });

  it('sanitizes unsafe constructs', () => {
    const cleaned = sanitizeSvg('<svg><script>x</script><rect onclick="x"/></svg>');
    expect(cleaned).not.toContain('<script');
    expect(cleaned).not.toContain('onclick');
  });
});

describe('svg generator chart-library template', () => {
  it('renders deterministic accessible SVG', () => {
    const first = chartLibraryTemplate.render({
      title: 'CH-010 Charts',
      width: 1600,
      height: 900,
      content: chartLibraryTemplate.definition.defaultContent,
      version: '1.0.0',
    });
    const second = chartLibraryTemplate.render({
      title: 'CH-010 Charts',
      width: 1600,
      height: 900,
      content: chartLibraryTemplate.definition.defaultContent,
      version: '1.0.0',
    });

    expect(first).toBe(second);
    expect(first).toMatch(/<title[^>]*>CH-010 Charts<\/title>/);
    expect(first).toContain('role="img"');
    expect(first).toContain('{{revenueHistory}}');
    const validation = validateSvg(first, {
      expectedWidth: 1600,
      expectedHeight: 900,
      assetId: 'CH-010',
      backlogFilename: 'CH-010_Charts.svg',
    });
    expect(validation.ok).toBe(true);
  });

  it('resolves chart-library template by id', () => {
    expect(getSvgTemplate('chart-library').definition.kind).toBe('chart');
  });
});
