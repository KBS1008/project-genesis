import { computeSha256 } from '../visual-asset-manager/filename-resolver.js';
import {
  ALLOWED_SVG_ELEMENTS,
  MAX_SVG_BYTES,
  MAX_SVG_ELEMENT_WARNING,
  PROHIBITED_ATTR_PATTERNS,
  PROHIBITED_SVG_ELEMENTS,
  REMOTE_URL_PATTERN,
} from './constants.js';
import type { SvgValidationResult } from './types.js';

const ELEMENT_RE = /<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g;
const ATTR_RE = /([a-zA-Z_:][\w:.-]*)\s*=\s*"([^"]*)"/g;

/** Validate generated or imported SVG content. */
export function validateSvg(
  svg: string,
  options: {
    readonly expectedWidth?: number;
    readonly expectedHeight?: number;
    readonly assetId?: string;
    readonly backlogFilename?: string;
  } = {},
): SvgValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (svg.trim().length === 0) {
    return { ok: false, errors: ['SVG content is empty.'], warnings };
  }

  const bytes = Buffer.byteLength(svg, 'utf8');
  if (bytes > MAX_SVG_BYTES) {
    errors.push(`SVG exceeds maximum size of ${MAX_SVG_BYTES} bytes.`);
  }

  if (!svg.includes('xmlns="http://www.w3.org/2000/svg"')) {
    errors.push('SVG namespace is missing.');
  }

  if (!/<title[\s>]/i.test(svg)) {
    errors.push('SVG must include a <title> element.');
  }

  if (!/<desc[\s>]/i.test(svg)) {
    errors.push('SVG must include a <desc> element.');
  }

  const widthMatch = /\bwidth\s*=\s*"(\d+(?:\.\d+)?)"/i.exec(svg);
  const heightMatch = /\bheight\s*=\s*"(\d+(?:\.\d+)?)"/i.exec(svg);
  const viewBoxMatch = /viewBox\s*=\s*"[\d.\s]+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)"/i.exec(svg);

  const width = widthMatch ? Number(widthMatch[1]) : viewBoxMatch ? Number(viewBoxMatch[1]) : 0;
  const height = heightMatch ? Number(heightMatch[1]) : viewBoxMatch ? Number(viewBoxMatch[2]) : 0;

  if (width <= 0 || height <= 0) {
    errors.push('SVG width and height must be positive.');
  }

  if (options.expectedWidth !== undefined && Math.round(width) !== Math.round(options.expectedWidth)) {
    warnings.push(`SVG width ${width} differs from requested ${options.expectedWidth}.`);
  }

  if (
    options.expectedHeight !== undefined &&
    Math.round(height) !== Math.round(options.expectedHeight)
  ) {
    warnings.push(`SVG height ${height} differs from requested ${options.expectedHeight}.`);
  }

  if (options.backlogFilename !== undefined && options.assetId !== undefined) {
    if (!options.backlogFilename.toUpperCase().startsWith(`${options.assetId}_`)) {
      errors.push('Filename does not match asset ID.');
    }
    if (!options.backlogFilename.toLowerCase().endsWith('.svg')) {
      errors.push('SVG backlog filename must use the .svg extension.');
    }
  }

  const ids = new Set<string>();
  let elementCount = 0;
  let match: RegExpExecArray | null;

  while ((match = ELEMENT_RE.exec(svg)) !== null) {
    const closing = match[1] === '/';
    const tag = (match[2] ?? '').toLowerCase();
    const attrs = match[3] ?? '';

    if (closing) {
      continue;
    }

    elementCount += 1;

    if (PROHIBITED_SVG_ELEMENTS.has(tag)) {
      errors.push(`Prohibited element <${tag}> detected.`);
    } else if (!ALLOWED_SVG_ELEMENTS.has(tag)) {
      errors.push(`Unsupported element <${tag}> detected.`);
    }

    let attrMatch: RegExpExecArray | null;
    const attrRegex = new RegExp(ATTR_RE.source, 'g');
    while ((attrMatch = attrRegex.exec(attrs)) !== null) {
      const attrName = attrMatch[1] ?? '';
      const attrValue = attrMatch[2] ?? '';

      for (const pattern of PROHIBITED_ATTR_PATTERNS) {
        if (pattern.test(attrName)) {
          errors.push(`Prohibited attribute ${attrName} detected.`);
        }
      }

      if (attrName.toLowerCase() === 'xmlns' || attrName.toLowerCase().startsWith('xmlns:')) {
        continue;
      }

      if (REMOTE_URL_PATTERN.test(attrValue)) {
        errors.push(`External reference detected in attribute ${attrName}.`);
      }

      if (attrName.toLowerCase() === 'id') {
        if (ids.has(attrValue)) {
          errors.push(`Duplicate id "${attrValue}" detected.`);
        }
        ids.add(attrValue);
      }
    }
  }

  if (elementCount > MAX_SVG_ELEMENT_WARNING) {
    warnings.push(`SVG contains ${elementCount} elements which may impact performance.`);
  }

  if (/<text[^>]*font-size\s*=\s*"(?:[0-9]|[1-9]\d?)"/i.test(svg)) {
    warnings.push('Very small text detected; verify readability.');
  }

  if (/<script/i.test(svg) || /javascript:/i.test(svg)) {
    errors.push('Script content is not allowed in SVG.');
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}

/** Hash SVG content for duplicate detection. */
export function hashSvg(svg: string): string {
  return computeSha256(Buffer.from(svg, 'utf8'));
}

/** Strip unsafe constructs from SVG string (best-effort). */
export function sanitizeSvg(svg: string): string {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}
