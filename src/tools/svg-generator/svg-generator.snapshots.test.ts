import { describe, expect, it } from 'vitest';
import { listSvgTemplates } from './templates/registry.js';
import { getSvgTemplate } from './templates/registry.js';

describe('svg generator snapshots', () => {
  for (const definition of listSvgTemplates()) {
    it(`renders stable output for ${definition.id}`, () => {
      const template = getSvgTemplate(definition.id);
      const svg = template.render({
        title: `Snapshot ${definition.id}`,
        subtitle: 'Deterministic snapshot test',
        width: definition.defaultWidth,
        height: definition.defaultHeight,
        content: definition.defaultContent,
        version: '1.0.0',
      });

      expect(svg).toMatchSnapshot();
      expect(svg).toMatch(/<title[^>]*>Snapshot /);
      expect(svg).toMatch(/<desc[^>]*>/);
    });
  }
});
