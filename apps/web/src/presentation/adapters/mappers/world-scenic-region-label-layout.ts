import type { WorldLogicalPoint } from '@/presentation/adapters/mappers/company-building-placement-coordinates';
import type { ScenicPlateLayoutRect } from '@/presentation/adapters/mappers/world-scenic-calibration';

export type ScenicRegionLabelTextAnchor = 'start' | 'middle' | 'end';

export type ScenicRegionLabelLayout = Readonly<{
  readonly titleX: number;
  readonly titleY: number;
  readonly subtitleX: number;
  readonly subtitleY: number;
  readonly textAnchor: ScenicRegionLabelTextAnchor;
}>;

type LabelOffsetSpec = Readonly<{
  readonly dxFactor: number;
  readonly dyFactor: number;
  readonly textAnchor: ScenicRegionLabelTextAnchor;
  readonly titleDyFactor: number;
  readonly subtitleDyFactor: number;
}>;

/** Presentation-only label offsets (fractions of scenic plate width). */
const LABEL_OFFSET_BY_REGION_ID: Readonly<Record<string, LabelOffsetSpec>> = Object.freeze({
  region_north: Object.freeze({
    dxFactor: 0,
    dyFactor: -0.14,
    textAnchor: 'middle',
    titleDyFactor: -0.032,
    subtitleDyFactor: 0.026,
  }),
  region_default: Object.freeze({
    dxFactor: -0.07,
    dyFactor: -0.04,
    textAnchor: 'middle',
    titleDyFactor: -0.022,
    subtitleDyFactor: 0.026,
  }),
  region_east: Object.freeze({
    dxFactor: 0.07,
    dyFactor: -0.045,
    textAnchor: 'middle',
    titleDyFactor: -0.022,
    subtitleDyFactor: 0.026,
  }),
  region_south: Object.freeze({
    dxFactor: 0,
    dyFactor: -0.065,
    textAnchor: 'middle',
    titleDyFactor: -0.022,
    subtitleDyFactor: 0.026,
  }),
});

const DEFAULT_LABEL_OFFSET: LabelOffsetSpec = Object.freeze({
  dxFactor: 0,
  dyFactor: -0.08,
  textAnchor: 'middle',
  titleDyFactor: -0.02,
  subtitleDyFactor: 0.028,
});

const PLATE_EDGE_MARGIN_FACTOR = 0.065;
const TITLE_CHAR_WIDTH_FACTOR = 0.019;
const SUBTITLE_CHAR_WIDTH_FACTOR = 0.015;

function estimateTextWidth(charCount: number, layout: ScenicPlateLayoutRect, factor: number): number {
  return Math.max(layout.width * 0.12, charCount * layout.width * factor);
}

function clampHorizontal(
  x: number,
  textAnchor: ScenicRegionLabelTextAnchor,
  textWidth: number,
  layout: ScenicPlateLayoutRect,
): number {
  const pad = layout.width * PLATE_EDGE_MARGIN_FACTOR;
  const left = layout.x + pad;
  const right = layout.x + layout.width - pad;

  if (textAnchor === 'start') {
    return Math.min(x, right - textWidth);
  }

  if (textAnchor === 'end') {
    return Math.max(x, left + textWidth);
  }

  const half = textWidth / 2;
  return Math.min(right - half, Math.max(left + half, x));
}

function clampVertical(y: number, layout: ScenicPlateLayoutRect): number {
  const pad = layout.height * PLATE_EDGE_MARGIN_FACTOR;
  const top = layout.y + pad;
  const bottom = layout.y + layout.height - pad;
  return Math.min(bottom, Math.max(top, y));
}

/**
 * Resolves scenic region label positions in world-logical canvas space.
 * Hit areas and selection rings remain at `anchor`.
 */
export function resolveScenicRegionLabelLayout(
  regionId: string,
  anchor: WorldLogicalPoint,
  layout: ScenicPlateLayoutRect,
  labels?: Readonly<{ readonly title: string; readonly subtitle: string }>,
): ScenicRegionLabelLayout {
  const spec = LABEL_OFFSET_BY_REGION_ID[regionId] ?? DEFAULT_LABEL_OFFSET;
  const scale = layout.width;
  const baseX = anchor.x + spec.dxFactor * scale;
  const baseY = anchor.y + spec.dyFactor * scale;

  let titleX = baseX;
  let titleY = baseY + spec.titleDyFactor * scale;
  let subtitleX = baseX;
  let subtitleY = baseY + spec.subtitleDyFactor * scale;
  const textAnchor = spec.textAnchor;

  if (labels !== undefined) {
    const titleWidth = estimateTextWidth(labels.title.length, layout, TITLE_CHAR_WIDTH_FACTOR);
    const subtitleWidth = estimateTextWidth(labels.subtitle.length, layout, SUBTITLE_CHAR_WIDTH_FACTOR);
    const blockWidth = Math.max(titleWidth, subtitleWidth);
    titleX = clampHorizontal(titleX, textAnchor, titleWidth, layout);
    subtitleX = clampHorizontal(subtitleX, textAnchor, subtitleWidth, layout);
    titleY = clampVertical(titleY, layout);
    subtitleY = clampVertical(subtitleY, layout);
    titleX = clampHorizontal(titleX, textAnchor, blockWidth, layout);
    subtitleX = clampHorizontal(subtitleX, textAnchor, blockWidth, layout);
  }

  return Object.freeze({
    titleX,
    titleY,
    subtitleX,
    subtitleY,
    textAnchor,
  });
}

/** Plate-relative bounds check for tests (world-logical units). */
export function scenicLabelPointInsidePlateMargins(
  x: number,
  y: number,
  layout: ScenicPlateLayoutRect,
  halfWidth: number,
): boolean {
  const padX = layout.width * PLATE_EDGE_MARGIN_FACTOR;
  const padY = layout.height * PLATE_EDGE_MARGIN_FACTOR;
  const ascent = layout.height * 0.045;
  const descent = layout.height * 0.015;
  return (
    x - halfWidth >= layout.x + padX &&
    x + halfWidth <= layout.x + layout.width - padX &&
    y - ascent >= layout.y + padY &&
    y + descent <= layout.y + layout.height - padY
  );
}
