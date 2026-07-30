import type { SvgTemplateRenderer } from '../types.js';
import {
  brandLockupTemplate,
  componentLibraryTemplate,
  financeWidgetLibraryTemplate,
  iconSheetTemplate,
  kpiCardLibraryTemplate,
  mapOverlayTemplate,
  notificationsLibraryTemplate,
  statusPanelLibraryTemplate,
  technicalDiagramTemplate,
} from './additional-templates.js';
import { chartLibraryTemplate } from './chart-library.js';

const TEMPLATES: readonly SvgTemplateRenderer[] = [
  chartLibraryTemplate,
  iconSheetTemplate,
  mapOverlayTemplate,
  kpiCardLibraryTemplate,
  statusPanelLibraryTemplate,
  notificationsLibraryTemplate,
  financeWidgetLibraryTemplate,
  brandLockupTemplate,
  technicalDiagramTemplate,
  componentLibraryTemplate,
];

/** Lookup all registered SVG templates. */
export function listSvgTemplates(): readonly SvgTemplateRenderer['definition'][] {
  return TEMPLATES.map((template) => template.definition);
}

/** Resolve a template renderer by ID. */
export function getSvgTemplate(templateId: string): SvgTemplateRenderer {
  const template = TEMPLATES.find((entry) => entry.definition.id === templateId);
  if (template === undefined) {
    throw new Error(`Unknown template: ${templateId}`);
  }
  return template;
}

/** Suggest a template for a backlog asset ID prefix. */
export function suggestTemplateForAsset(assetId: string): string {
  const prefix = assetId.split('-')[0] ?? '';
  if (prefix === 'CH') {
    return 'chart-library';
  }
  if (prefix === 'ICON') {
    return 'icon-sheet';
  }
  if (prefix === 'MAP') {
    return 'map-overlay';
  }
  if (prefix === 'BR') {
    return 'brand-lockup';
  }
  if (prefix === 'DB') {
    return 'kpi-card-library';
  }
  return 'component-library';
}
