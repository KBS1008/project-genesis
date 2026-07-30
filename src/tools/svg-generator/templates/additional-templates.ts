import { buildAccessibilityNodes, buildAccessibleRootAttributes } from '../accessibility.js';
import { createStableId, sanitizeText } from '../escape.js';
import { DEFAULT_SVG_TOKENS } from '../tokens.js';
import type { SvgContentModel, SvgTemplateRenderer } from '../types.js';
import { group, rect, renderSvgDocument, text, type SvgNode } from '../xml-builder.js';

function renderSimpleSheet(input: {
  readonly title: string;
  readonly subtitle?: string;
  readonly width: number;
  readonly height: number;
  readonly content: SvgContentModel;
  readonly rootSlug: string;
  readonly sections: readonly string[];
}): string {
  const tokens = DEFAULT_SVG_TOKENS;
  const rootId = createStableId(input.rootSlug);
  const title = sanitizeText(input.title);
  const description = sanitizeText(
    input.subtitle ?? `Reference sheet for ${title}`,
  );

  const children: SvgNode[] = [
    ...buildAccessibilityNodes({ rootId, title, description }),
    rect({ x: 0, y: 0, width: input.width, height: input.height, fill: tokens.background }),
    text(title, {
      x: 40,
      y: 60,
      fill: tokens.textPrimary,
      'font-family': tokens.fontFamily,
      'font-size': 36,
      'font-weight': 700,
    }),
    ...input.sections.map((section, index) => {
      const y = 120 + index * 120;
      return group({ id: createStableId(input.rootSlug, `section-${index}`) }, [
        rect({
          x: 40,
          y,
          width: input.width - 80,
          height: 100,
          rx: tokens.borderRadius[2],
          fill: tokens.panelBackground,
          stroke: tokens.panelBorder,
        }),
        text(section, {
          x: 60,
          y: y + 40,
          fill: tokens.textPrimary,
          'font-family': tokens.fontFamily,
          'font-size': 20,
        }),
      ]);
    }),
  ];

  return renderSvgDocument({
    tag: 'svg',
    attributes: buildAccessibleRootAttributes({
      rootId,
      width: input.width,
      height: input.height,
      title,
      description,
    }),
    children,
  });
}

function makeTemplate(config: {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly kind: SvgTemplateRenderer['definition']['kind'];
  readonly rootSlug: string;
  readonly sections: readonly string[];
  readonly defaultWidth?: number;
  readonly defaultHeight?: number;
}): SvgTemplateRenderer {
  return {
    definition: {
      id: config.id,
      name: config.name,
      description: config.description,
      kind: config.kind,
      defaultWidth: config.defaultWidth ?? 1200,
      defaultHeight: config.defaultHeight ?? 800,
      requiredFields: ['sections'],
      optionalFields: ['subtitle'],
      defaultContent: { sections: [...config.sections] },
    },
    render: (input) =>
      renderSimpleSheet({
        ...input,
        rootSlug: config.rootSlug,
        sections: Array.isArray(input.content.sections)
          ? (input.content.sections as string[])
          : [...config.sections],
      }),
  };
}

export const iconSheetTemplate = makeTemplate({
  id: 'icon-sheet',
  name: 'Icon Sheet',
  description: 'Icon grid with labels and size variants.',
  kind: 'icon',
  rootSlug: 'icon-sheet',
  sections: ['16px grid', '24px grid', '32px stroke/fill preview', 'State variants'],
});

export const mapOverlayTemplate = makeTemplate({
  id: 'map-overlay',
  name: 'Map Overlay',
  description: 'Map overlays with legends, routes, and markers.',
  kind: 'map',
  rootSlug: 'map-overlay',
  sections: ['Region outlines', 'Route lines', 'Markers', 'Heatmap legend', 'Inspector callout'],
});

export const kpiCardLibraryTemplate = makeTemplate({
  id: 'kpi-card-library',
  name: 'KPI Card Library',
  description: 'Dashboard KPI card reference sheet.',
  kind: 'component-library',
  rootSlug: 'kpi-card-library',
  sections: ['Primary KPI', 'Delta indicator', 'Sparkline slot', '{{revenue}} placeholder'],
});

export const statusPanelLibraryTemplate = makeTemplate({
  id: 'status-panel-library',
  name: 'Status Panel Library',
  description: 'Status panel states and semantic colors.',
  kind: 'component-library',
  rootSlug: 'status-panel-library',
  sections: ['Info state', 'Success state', 'Warning state', 'Danger state'],
});

export const notificationsLibraryTemplate = makeTemplate({
  id: 'notifications-library',
  name: 'Notifications Library',
  description: 'Notification component reference.',
  kind: 'component-library',
  rootSlug: 'notifications-library',
  sections: ['Info toast', 'Success toast', 'Warning toast', 'Error toast'],
});

export const financeWidgetLibraryTemplate = makeTemplate({
  id: 'finance-widget-library',
  name: 'Finance Widget Library',
  description: 'Finance widget reference with placeholders.',
  kind: 'component-library',
  rootSlug: 'finance-widget-library',
  sections: ['Cash balance {{availableCash}}', 'Profit trend', 'Tax reserve', 'Contract summary'],
});

export const brandLockupTemplate = makeTemplate({
  id: 'brand-lockup',
  name: 'Brand Lockup',
  description: 'Branding lockup reference sheet.',
  kind: 'branding',
  rootSlug: 'brand-lockup',
  sections: ['Primary logo', 'Wordmark', 'Clear space', 'Color variants'],
});

export const technicalDiagramTemplate = makeTemplate({
  id: 'technical-diagram',
  name: 'Technical Diagram',
  description: 'Technical diagram blocks for developer docs.',
  kind: 'diagram',
  rootSlug: 'technical-diagram',
  sections: ['Pipeline stage', 'Service node', 'Data store', 'Integration arrow'],
});

export const componentLibraryTemplate = makeTemplate({
  id: 'component-library',
  name: 'Component Library',
  description: 'General UI component reference sheet.',
  kind: 'component-library',
  rootSlug: 'component-library',
  sections: ['Buttons', 'Inputs', 'Cards', 'Tables', 'Tabs'],
});
