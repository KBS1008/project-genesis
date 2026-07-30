import { escapeXml, formatNumber } from './escape.js';

export type SvgNode = {
  readonly tag: string;
  readonly attributes?: Readonly<Record<string, string | number>>;
  readonly children?: readonly SvgNode[];
  readonly text?: string;
};

/** Render SVG nodes with stable attribute ordering and formatting. */
export function renderSvgDocument(root: SvgNode): string {
  const body = renderNode(root, 0);
  return `<?xml version="1.0" encoding="UTF-8"?>\n${body}`;
}

function renderNode(node: SvgNode, depth: number): string {
  const indent = '  '.repeat(depth);
  const attributes = node.attributes ?? {};
  const attrKeys = Object.keys(attributes).sort();
  const attrString = attrKeys
    .map((key) => `${key}="${escapeXml(String(attributes[key]))}"`)
    .join(' ');

  const open = attrString.length > 0 ? `<${node.tag} ${attrString}>` : `<${node.tag}>`;

  if (node.text !== undefined) {
    return `${indent}${open}${escapeXml(node.text)}</${node.tag}>`;
  }

  if (node.children === undefined || node.children.length === 0) {
    return `${indent}${open}</${node.tag}>`;
  }

  const childLines = node.children.map((child) => renderNode(child, depth + 1));
  return `${indent}${open}\n${childLines.join('\n')}\n${indent}</${node.tag}>`;
}

/** Convenience helpers for common primitives. */
export function rect(
  attributes: Record<string, string | number>,
  children?: readonly SvgNode[],
): SvgNode {
  return { tag: 'rect', attributes: normalizeAttrs(attributes), children };
}

export function text(
  value: string,
  attributes: Record<string, string | number>,
  children?: readonly SvgNode[],
): SvgNode {
  if (children !== undefined && children.length > 0) {
    return { tag: 'text', attributes: normalizeAttrs(attributes), children };
  }
  return { tag: 'text', attributes: normalizeAttrs(attributes), text: value };
}

export function group(
  attributes: Record<string, string | number>,
  children: readonly SvgNode[],
): SvgNode {
  return { tag: 'g', attributes: normalizeAttrs(attributes), children };
}

export function path(attributes: Record<string, string | number>): SvgNode {
  return { tag: 'path', attributes: normalizeAttrs(attributes) };
}

export function circle(attributes: Record<string, string | number>): SvgNode {
  return { tag: 'circle', attributes: normalizeAttrs(attributes) };
}

export function line(attributes: Record<string, string | number>): SvgNode {
  return { tag: 'line', attributes: normalizeAttrs(attributes) };
}

export function polyline(attributes: Record<string, string | number>): SvgNode {
  return { tag: 'polyline', attributes: normalizeAttrs(attributes) };
}

export function polygon(attributes: Record<string, string | number>): SvgNode {
  return { tag: 'polygon', attributes: normalizeAttrs(attributes) };
}

function normalizeAttrs(attributes: Record<string, string | number>): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(attributes)) {
    normalized[key] = typeof value === 'number' ? formatNumber(value) : value;
  }
  return normalized;
}
