import { buildAccessibilityNodes, buildAccessibleRootAttributes, placeholderLabel } from '../accessibility.js';
import { createStableId, sanitizeText } from '../escape.js';
import { buildBars, buildGaugeArc, buildLinePoints, buildPieSlices } from '../geometry.js';
import { DEFAULT_SVG_TOKENS } from '../tokens.js';
import type { SvgContentModel, SvgTemplateRenderer } from '../types.js';
import {
  circle,
  group,
  path,
  polyline,
  rect,
  renderSvgDocument,
  text,
  type SvgNode,
} from '../xml-builder.js';

const COLORS = [
  DEFAULT_SVG_TOKENS.accentPrimary,
  DEFAULT_SVG_TOKENS.success,
  DEFAULT_SVG_TOKENS.warning,
  DEFAULT_SVG_TOKENS.danger,
];

function panel(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  children: readonly SvgNode[],
): SvgNode {
  return group({ id }, [
    rect({
      x,
      y,
      width,
      height,
      rx: DEFAULT_SVG_TOKENS.borderRadius[2],
      fill: DEFAULT_SVG_TOKENS.panelBackground,
      stroke: DEFAULT_SVG_TOKENS.panelBorder,
    }),
    text(label, {
      x: x + 20,
      y: y + 35,
      fill: DEFAULT_SVG_TOKENS.textPrimary,
      'font-family': DEFAULT_SVG_TOKENS.fontFamily,
      'font-size': 20,
      'font-weight': 700,
    }),
    ...children,
  ]);
}

function renderChartLibrary(input: {
  readonly title: string;
  readonly subtitle?: string;
  readonly width: number;
  readonly height: number;
  readonly content: SvgContentModel;
}): string {
  const tokens = DEFAULT_SVG_TOKENS;
  const rootId = createStableId('ch-010-charts');
  const title = sanitizeText(input.title);
  const subtitle = sanitizeText(input.subtitle ?? 'Project Genesis chart reference library');
  const placeholders = Array.isArray(input.content.placeholders)
    ? (input.content.placeholders as string[])
    : ['revenueHistory', 'productionHistory', 'marketShare', 'playerName', 'companyName'];

  const lineSeries = [42, 55, 48, 72, 64, 88, 76];
  const barSeries = [30, 55, 25, 70];
  const stackedA = [20, 30, 15, 25];
  const stackedB = [15, 10, 20, 18];
  const pieValues = [35, 25, 20, 20];
  const scatter = [
    [0, 20],
    [1, 35],
    [2, 28],
    [3, 50],
    [4, 42],
    [5, 65],
  ];

  const children: SvgNode[] = [
    ...buildAccessibilityNodes({
      rootId,
      title,
      description: 'Reference sheet for Project Genesis chart components, states, and data-binding placeholders.',
    }),
    rect({ x: 0, y: 0, width: input.width, height: input.height, fill: tokens.background }),
    text(title, {
      x: 40,
      y: 60,
      fill: tokens.textPrimary,
      'font-family': tokens.fontFamily,
      'font-size': 42,
      'font-weight': 700,
    }),
    text(subtitle, {
      x: 40,
      y: 90,
      fill: tokens.textSecondary,
      'font-family': tokens.fontFamily,
      'font-size': 18,
    }),
    panel('line-chart', 40, 110, 480, 250, 'Line Chart', [
      polyline({
        points: buildLinePoints(lineSeries, 80, 460, 320, 170),
        fill: 'none',
        stroke: tokens.accentPrimary,
        'stroke-width': 3,
      }),
    ]),
    panel('area-chart', 560, 110, 480, 250, 'Area Chart', [
      path({
        d: `M80 320 L80 280 L140 250 L200 260 L260 210 L320 230 L380 190 L440 210 L440 320 Z`,
        fill: tokens.accentPrimary,
        opacity: 0.35,
      }),
      polyline({
        points: buildLinePoints(lineSeries, 80, 440, 320, 190),
        fill: 'none',
        stroke: tokens.accentPrimary,
        'stroke-width': 3,
      }),
    ]),
    panel('bar-chart', 1080, 110, 480, 250, 'Bar Chart', [
      ...buildBars(barSeries, 120, 320, 40, 40, 120).map((bar, index) =>
        rect({
          x: 1120 + bar.x - 40,
          y: bar.y,
          width: bar.width,
          height: bar.height,
          fill: COLORS[index % COLORS.length],
        }),
      ),
    ]),
    panel('stacked-bar', 40, 390, 480, 250, 'Stacked Bar Chart', [
      ...stackedA.map((value, index) =>
        rect({
          x: 120 + index * 80,
          y: 560 - value * 4,
          width: 40,
          height: value * 4,
          fill: tokens.accentPrimary,
        }),
      ),
      ...stackedB.map((value, index) =>
        rect({
          x: 120 + index * 80,
          y: 560 - (stackedA[index] ?? 0) * 4 - value * 4,
          width: 40,
          height: value * 4,
          fill: tokens.success,
        }),
      ),
    ]),
    panel('pie-chart', 560, 390, 480, 250, 'Pie Chart', [
      circle({ cx: 800, cy: 520, r: 90, fill: tokens.grid }),
      ...buildPieSlices(pieValues, 800, 520, 90).map((d, index) =>
        path({ d, fill: COLORS[index % COLORS.length] }),
      ),
    ]),
    panel('donut-chart', 1080, 390, 480, 250, 'Donut Chart', [
      ...buildPieSlices(pieValues, 1320, 520, 90, 45).map((d, index) =>
        path({ d, fill: COLORS[index % COLORS.length] }),
      ),
    ]),
    panel('scatter-plot', 40, 670, 480, 180, 'Scatter Plot', [
      ...scatter.map(([x, y], index) =>
        circle({
          cx: 100 + x * 60,
          cy: 780 - y * 6,
          r: 6,
          fill: COLORS[index % COLORS.length],
        }),
      ),
    ]),
    panel('gauge', 560, 670, 480, 180, 'Gauge', [
      path({
        d: buildGaugeArc(68, 800, 760, 80),
        fill: 'none',
        stroke: tokens.accentPrimary,
        'stroke-width': 16,
        'stroke-linecap': 'round',
      }),
      text('68%', {
        x: 770,
        y: 770,
        fill: tokens.textPrimary,
        'font-family': tokens.fontFamily,
        'font-size': 28,
        'font-weight': 700,
      }),
    ]),
    panel('sparkline', 1080, 670, 480, 180, 'Sparkline / Progress', [
      polyline({
        points: buildLinePoints([12, 18, 15, 24, 22, 30, 28], 1120, 1500, 820, 720),
        fill: 'none',
        stroke: tokens.success,
        'stroke-width': 2,
      }),
      rect({ x: 1120, y: 790, width: 360, height: 12, rx: 6, fill: tokens.grid }),
      rect({ x: 1120, y: 790, width: 250, height: 12, rx: 6, fill: tokens.success }),
    ]),
    text('Chart anatomy: axes, legend, labels, semantic colors, responsive viewBox', {
      x: 40,
      y: 870,
      fill: tokens.textSecondary,
      'font-family': tokens.fontFamily,
      'font-size': 16,
    }),
    text(`DD-042 placeholders: ${placeholders.map((item) => placeholderLabel(item)).join(' ')}`, {
      x: 40,
      y: 895,
      fill: tokens.textSecondary,
      'font-family': tokens.fontFamily,
      'font-size': 16,
    }),
    text('Accessibility: every chart includes title/desc metadata and non-color semantic labels.', {
      x: 40,
      y: 920,
      fill: tokens.textSecondary,
      'font-family': tokens.fontFamily,
      'font-size': 14,
    }),
  ];

  return renderSvgDocument({
    tag: 'svg',
    attributes: buildAccessibleRootAttributes({
      rootId,
      width: input.width,
      height: input.height,
      title,
      description: 'Chart library reference for Project Genesis.',
    }),
    children,
  });
}

export const chartLibraryTemplate: SvgTemplateRenderer = {
  definition: {
    id: 'chart-library',
    name: 'Chart Library',
    description: 'Comprehensive chart reference sheet (CH-010).',
    kind: 'chart',
    defaultWidth: 1600,
    defaultHeight: 900,
    requiredFields: ['placeholders'],
    optionalFields: ['subtitle'],
    defaultContent: {
      placeholders: ['revenueHistory', 'productionHistory', 'marketShare', 'playerName', 'companyName'],
    },
  },
  render: renderChartLibrary,
};
