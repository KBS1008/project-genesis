import type { VisualAssetStatus } from './types.js';

/** Maximum upload size (25 MiB). */
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

/** Minimum mockup dimensions per IMAGE_MOCKUP_EXTRACTION_WORKFLOW.md. */
export const MIN_MOCKUP_WIDTH = 450;
export const MIN_MOCKUP_HEIGHT = 350;

export const ALLOWED_EXTENSIONS = Object.freeze(['png', 'jpg', 'jpeg', 'webp', 'svg']);

export const DISALLOWED_BASENAMES = Object.freeze([
  'final-final',
  'latest',
  'copy',
  'new',
]);

export const STATUS_ICON: Readonly<Record<VisualAssetStatus, string>> = Object.freeze({
  planned: '☐',
  'in-production': '◐',
  'in-review': '👀',
  approved: '☑',
  integrated: '🚀',
});

export const STATUS_LABEL: Readonly<Record<VisualAssetStatus, string>> = Object.freeze({
  planned: 'Planned',
  'in-production': 'In Production',
  'in-review': 'In Review',
  approved: 'Approved',
  integrated: 'Integrated',
});

export const ICON_TO_STATUS: Readonly<Record<string, VisualAssetStatus>> = Object.freeze({
  '☐': 'planned',
  '◐': 'in-production',
  '👀': 'in-review',
  '☑': 'approved',
  '🚀': 'integrated',
});

/** Prefix → relative directory under docs/design/. */
export const DESTINATION_BY_PREFIX: Readonly<Record<string, string>> = Object.freeze({
  MM: 'mockups/main-menu',
  DB: 'mockups/dashboard',
  WM: 'mockups/world',
  PR: 'mockups/production',
  RS: 'mockups/research',
  EC: 'mockups/economy',
  TR: 'mockups/logistics',
  CP: 'mockups/company',
  RP: 'mockups/reports',
  CH: 'charts',
  MAP: 'maps',
  ICON: 'icons',
  BR: 'branding',
  MK: 'marketing',
});
