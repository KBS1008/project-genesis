/** Escape text for safe SVG/XML text nodes and attributes. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isAllowedSanitizedTextChar(code: number): boolean {
  if (code === 0x0009 || code === 0x000a) {
    return true;
  }
  if (code >= 0x0020 && code !== 0x007f) {
    return true;
  }
  return code > 0x007f;
}

/** Sanitize user-facing text while preserving explicit line breaks. */
export function sanitizeText(value: string): string {
  const normalized = value.replace(/\r\n/g, '\n');
  let sanitized = '';
  for (const char of normalized) {
    if (isAllowedSanitizedTextChar(char.charCodeAt(0))) {
      sanitized += char;
    }
  }
  return sanitized.trim();
}

/** Format numbers deterministically for SVG attributes. */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return '0';
  }
  const rounded = Math.round(value * 1000) / 1000;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(3).replace(/\.?0+$/, '');
}

/** Create a stable element ID from parts. */
export function createStableId(...parts: readonly string[]): string {
  return parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
