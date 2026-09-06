/** Technical certification rules for approved ICON-002 building category SVG masters. */

export type Icon002SvgCertificationResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly errors: readonly string[] };

const FIXED_COLOR_PATTERN =
  /(?:fill|stroke)\s*=\s*["'](?!none|currentColor|transparent)[^"']+["']/i;

const HEX_COLOR_PATTERN = /#[0-9a-f]{3,8}\b/i;

const RGB_COLOR_PATTERN = /\b(?:rgb|hsl)a?\(/i;

/** Validates an ICON-002 SVG master against the Phase 1 technical contract. */
export function certifyIcon002Svg(svgContent: string): Icon002SvgCertificationResult {
  const errors: string[] = [];
  const trimmed = svgContent.trim();

  if (trimmed.length === 0) {
    return { ok: false, errors: ['SVG content is empty.'] };
  }

  if (!trimmed.startsWith('<svg')) {
    errors.push('Root element must be <svg>.');
  }

  if (!/<svg[^>]*viewBox=["']0 0 24 24["']/i.test(trimmed)) {
    errors.push('viewBox must be exactly "0 0 24 24".');
  }

  if (!/stroke=["']currentColor["']/i.test(trimmed)) {
    errors.push('Root stroke must be currentColor.');
  }

  if (!/stroke-width=["']1\.75["']/i.test(trimmed)) {
    errors.push('Root stroke-width must be 1.75.');
  }

  if (!/fill=["']none["']/i.test(trimmed)) {
    errors.push('Root fill must be none.');
  }

  if (!/stroke-linecap=["']round["']/i.test(trimmed)) {
    errors.push('Root stroke-linecap must be round.');
  }

  if (!/stroke-linejoin=["']round["']/i.test(trimmed)) {
    errors.push('Root stroke-linejoin must be round.');
  }

  if (/<text[\s>]/i.test(trimmed)) {
    errors.push('SVG must not contain <text> elements.');
  }

  if (/<image[\s>]/i.test(trimmed)) {
    errors.push('SVG must not contain <image> elements.');
  }

  if (/data:image\//i.test(trimmed) || /base64,/i.test(trimmed)) {
    errors.push('SVG must not embed base64 raster content.');
  }

  if (/<(?:script|animate|foreignObject|filter)[\s>]/i.test(trimmed)) {
    errors.push('SVG must not contain script, animation, foreignObject, or filter nodes.');
  }

  if (/\b(?:xlink:href|href)=["']https?:/i.test(trimmed)) {
    errors.push('SVG must not reference external URLs.');
  }

  if (/<font[\s>]/i.test(trimmed)) {
    errors.push('SVG must not embed fonts.');
  }

  if (FIXED_COLOR_PATTERN.test(trimmed)) {
    errors.push('SVG must not use fixed stroke/fill colors other than none/currentColor.');
  }

  if (HEX_COLOR_PATTERN.test(trimmed) || RGB_COLOR_PATTERN.test(trimmed)) {
    errors.push('SVG must not contain fixed palette color literals.');
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true };
}
