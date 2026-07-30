import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SvgGeneratorService } from './svg-generator.service.js';
import { validateSvg } from './validator.js';

function createSvgGeneratorFixture(): { readonly root: string; readonly generator: SvgGeneratorService } {
  const root = mkdtempSync(join(tmpdir(), 'pg-svg-gen-'));
  const designRoot = join(root, 'docs', 'design');
  mkdirSync(join(designRoot, 'charts'), { recursive: true });

  const backlog = `# Sprint 10 — Charts\n\n◐ CH-010_Charts.svg\n`;
  const catalog = 'ID\n\nUI-CH-010\n\nStatus\n\nIn Production\n';
  writeFileSync(join(designRoot, 'VISUAL_PRODUCTION_BACKLOG.md'), backlog, 'utf8');
  writeFileSync(join(designRoot, 'VISUAL_ASSET_CATALOG.md'), catalog, 'utf8');

  return { root, generator: new SvgGeneratorService(root) };
}

describe('svg generator integration', () => {
  it('generates CH-010_Charts.svg and updates repository documents', () => {
    const { root, generator } = createSvgGeneratorFixture();

    const result = generator.generateAndSave({
      assetId: 'CH-010',
      backlogFilename: 'CH-010_Charts.svg',
      templateId: 'chart-library',
      title: 'CH-010 Charts Library',
      width: 1600,
      height: 900,
      content: { placeholders: ['revenueHistory', 'productionHistory'] },
      status: 'approved',
      acceptWarnings: true,
    });

    expect(result.generation.filename).toBe('CH-010_Charts.svg');
    expect(readFileSync(join(root, result.generation.targetPath), 'utf8')).toMatch(/<title[^>]*>/);

    const backlog = readFileSync(join(root, 'docs/design/VISUAL_PRODUCTION_BACKLOG.md'), 'utf8');
    expect(backlog).toContain('☑ CH-010_Charts.svg');

    const catalog = readFileSync(join(root, 'docs/design/VISUAL_ASSET_CATALOG.md'), 'utf8');
    expect(catalog).toContain('Approved');

    const changelog = readFileSync(join(root, 'docs/design/VISUAL_ASSET_CHANGELOG.md'), 'utf8');
    expect(changelog).toContain('CH-010');
  });

  it('creates revisions through Visual Asset Manager reuse', () => {
    const { root, generator } = createSvgGeneratorFixture();
    const request = {
      assetId: 'CH-010',
      backlogFilename: 'CH-010_Charts.svg',
      templateId: 'chart-library',
      title: 'CH-010 Charts Library',
      width: 1600,
      height: 900,
      content: {},
      status: 'approved' as const,
      acceptWarnings: true,
    };

    generator.generateAndSave(request);
    const revised = generator.generateAndSave({
      ...request,
      title: 'CH-010 Charts Library Revised',
      content: { placeholders: ['revenueHistory'] },
    });

    expect(revised.generation.filename).toBe('CH-010_Charts_Rev1.svg');
    expect(readFileSync(join(root, revised.generation.targetPath), 'utf8')).toContain('Revised');
  });
});

describe('svg generator security', () => {
  it('rejects foreignObject via validator', () => {
    const svg = `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><title>t</title><desc>d</desc><foreignObject></foreignObject></svg>`;
    expect(validateSvg(svg).ok).toBe(false);
  });

  it('rejects event handler attributes after sanitization validation', () => {
    const svg = `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><title>t</title><desc>d</desc><rect onload="alert(1)" width="10" height="10"/></svg>`;
    expect(validateSvg(svg).ok).toBe(false);
  });
});
