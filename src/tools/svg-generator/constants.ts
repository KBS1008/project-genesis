/** Generator version embedded in deterministic metadata comments only. */
export const SVG_GENERATOR_VERSION = '1.0.0';

/** Maximum generated SVG payload size (2 MiB). */
export const MAX_SVG_BYTES = 2 * 1024 * 1024;

/** Maximum element count before warning. */
export const MAX_SVG_ELEMENT_WARNING = 5000;

/** Allowed SVG element names. */
export const ALLOWED_SVG_ELEMENTS = Object.freeze(
  new Set([
    'svg',
    'g',
    'defs',
    'style',
    'lineargradient',
    'radialgradient',
    'stop',
    'clippath',
    'mask',
    'rect',
    'circle',
    'ellipse',
    'line',
    'polyline',
    'polygon',
    'path',
    'text',
    'tspan',
    'title',
    'desc',
  ]),
);

/** Prohibited SVG element names. */
export const PROHIBITED_SVG_ELEMENTS = Object.freeze(
  new Set(['script', 'foreignobject', 'iframe', 'image', 'animate', 'set', 'use']),
);

/** Prohibited attribute name patterns. */
export const PROHIBITED_ATTR_PATTERNS = Object.freeze([/^on/i, /^xmlns:xlink/i]);

/** Remote URL patterns rejected in attributes. */
export const REMOTE_URL_PATTERN = /\b(?:https?|ftp):\/\//i;
