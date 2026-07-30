import { createStableId, escapeXml } from './escape.js';
import type { SvgNode } from './xml-builder.js';
import { text as textNode } from './xml-builder.js';

/** Build accessibility metadata nodes for generated SVG. */
export function buildAccessibilityNodes(input: {
  readonly title: string;
  readonly description: string;
  readonly rootId: string;
}): readonly SvgNode[] {
  const titleId = createStableId(input.rootId, 'title');
  const descId = createStableId(input.rootId, 'desc');
  return [
    { tag: 'title', attributes: { id: titleId }, text: input.title },
    { tag: 'desc', attributes: { id: descId }, text: input.description },
  ];
}

/** Root SVG wrapper with role and aria-labelledby attributes. */
export function buildAccessibleRootAttributes(input: {
  readonly width: number;
  readonly height: number;
  readonly rootId: string;
  readonly title: string;
  readonly description: string;
}): Record<string, string> {
  const titleId = createStableId(input.rootId, 'title');
  const descId = createStableId(input.rootId, 'desc');
  return {
    xmlns: 'http://www.w3.org/2000/svg',
    width: String(input.width),
    height: String(input.height),
    viewBox: `0 0 ${input.width} ${input.height}`,
    role: 'img',
    'aria-labelledby': `${titleId} ${descId}`,
    id: input.rootId,
  };
}

/** Render placeholder syntax visibly for reference assets. */
export function placeholderLabel(name: string): string {
  return `{{${escapeXml(name)}}}`;
}

/** Multi-line text with tspans. */
export function multilineText(
  lines: readonly string[],
  attributes: Record<string, string | number>,
  startY: number,
  lineHeight: number,
): SvgNode {
  const [first, ...rest] = lines;
  const children: SvgNode[] = [];
  if (first !== undefined) {
    children.push(textNode(first, { x: attributes.x ?? 0, y: startY }));
  }
  for (let index = 0; index < rest.length; index += 1) {
    const line = rest[index] ?? '';
    children.push(textNode(line, { x: attributes.x ?? 0, y: startY + (index + 1) * lineHeight }));
  }
  return textNode('', attributes, children);
}
