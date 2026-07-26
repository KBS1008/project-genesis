import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  DISALLOWED_BASENAMES,
  DESTINATION_BY_PREFIX,
  MIN_MOCKUP_HEIGHT,
  MIN_MOCKUP_WIDTH,
} from './constants.js';
import type { ImageValidationResult, VisualAssetKind } from './types.js';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Resolve asset kind from ID prefix. */
export function resolveAssetKind(assetId: string): VisualAssetKind {
  const prefix = assetId.split('-')[0] ?? '';
  if (prefix === 'ICON') {
    return 'icon';
  }
  if (prefix === 'CH') {
    return 'chart';
  }
  if (prefix === 'MAP') {
    return 'map';
  }
  if (prefix === 'BR') {
    return 'branding';
  }
  if (prefix === 'MK') {
    return 'marketing';
  }
  return 'mockup';
}

/** Resolve destination directory relative to docs/design/. */
export function resolveDestinationDirectory(assetId: string): string {
  const prefix = assetId.split('-')[0] ?? '';
  const destination = DESTINATION_BY_PREFIX[prefix];
  if (destination === undefined) {
    throw new Error(`Unknown asset prefix for ${assetId}`);
  }
  return destination;
}

/** Build canonical filename with optional revision suffix. */
export function buildCanonicalFilename(baseFilename: string, revision: number): string {
  if (revision <= 0) {
    return baseFilename;
  }

  const dot = baseFilename.lastIndexOf('.');
  if (dot === -1) {
    return `${baseFilename}_Rev${revision}`;
  }

  const stem = baseFilename.slice(0, dot);
  const ext = baseFilename.slice(dot);
  return `${stem}_Rev${revision}${ext}`;
}

/** Determine next revision by scanning an existing target directory. */
export function resolveNextRevision(
  targetDirectory: string,
  baseFilename: string,
): { readonly revision: number; readonly canonicalFilename: string } {
  let files: string[] = [];
  try {
    files = readdirSync(targetDirectory);
  } catch {
    return { revision: 0, canonicalFilename: baseFilename };
  }

  const dot = baseFilename.lastIndexOf('.');
  const stem = dot === -1 ? baseFilename : baseFilename.slice(0, dot);
  const ext = dot === -1 ? '' : baseFilename.slice(dot);
  const basePattern = new RegExp(`^${escapeRegex(stem)}(?:_Rev(\\d+))?${escapeRegex(ext)}$`, 'i');

  let maxRevision = -1;
  for (const file of files) {
    const match = basePattern.exec(file);
    if (match === null) {
      continue;
    }
    const revision = match[1] === undefined ? 0 : Number.parseInt(match[1], 10);
    if (revision > maxRevision) {
      maxRevision = revision;
    }
  }

  const revision = maxRevision + 1;
  return {
    revision,
    canonicalFilename: buildCanonicalFilename(baseFilename, revision),
  };
}

/** Validate backlog filename conventions. */
export function validateBacklogFilename(filename: string): readonly string[] {
  const errors: string[] = [];
  const lower = filename.toLowerCase();

  if (!/^[A-Z]{2,5}-\d{3}_[A-Za-z0-9_]+\.(png|jpe?g|webp|svg)$/i.test(filename)) {
    errors.push('Filename must match PREFIX-NNN_Description.ext (e.g. MM-001_Main_Menu.png).');
  }

  for (const banned of DISALLOWED_BASENAMES) {
    const description = filename
      .replace(/^[A-Z]{2,5}-\d{3}_/i, '')
      .replace(/\.[^.]+$/, '')
      .toLowerCase();
    if (description === banned) {
      errors.push(`Filename must not use "${banned}" as the asset description.`);
    }
  }

  return errors;
}

/** Compute SHA-256 hash for deduplication. */
export function computeSha256(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

type DimensionResult = {
  readonly width: number;
  readonly height: number;
  readonly format: string;
};

/** Read image dimensions from common formats without external dependencies. */
export function readImageDimensions(buffer: Buffer): DimensionResult | null {
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
      format: 'png',
    };
  }

  if (
    buffer.length >= 30 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    const chunk = buffer.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') {
      return {
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff,
        format: 'webp',
      };
    }
    if (chunk === 'VP8L' && buffer.length >= 25) {
      const bits = buffer.readUInt32LE(21);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
        format: 'webp',
      };
    }
    if (chunk === 'VP8X' && buffer.length >= 30) {
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
        format: 'webp',
      };
    }
  }

  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        break;
      }
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if (marker === 0xc0 || marker === 0xc2) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
          format: 'jpeg',
        };
      }
      offset += 2 + length;
    }
  }

  const text = buffer.toString('utf8', 0, Math.min(buffer.length, 4096));
  if (text.includes('<svg')) {
    const widthMatch = /\bwidth=["'](\d+(?:\.\d+)?)/i.exec(text);
    const heightMatch = /\bheight=["'](\d+(?:\.\d+)?)/i.exec(text);
    const viewBoxMatch = /viewBox=["'][\d.\s]+[\s,](\d+(?:\.\d+)?)[\s,](\d+(?:\.\d+)?)/i.exec(
      text,
    );
    const width = widthMatch
      ? Math.round(Number(widthMatch[1]))
      : viewBoxMatch
        ? Math.round(Number(viewBoxMatch[1]))
        : 0;
    const height = heightMatch
      ? Math.round(Number(heightMatch[1]))
      : viewBoxMatch
        ? Math.round(Number(viewBoxMatch[2]))
        : 0;
    if (width > 0 && height > 0) {
      return { width, height, format: 'svg' };
    }
  }

  return null;
}

/** Validate upload buffer and collect errors/warnings. */
export function validateImageBuffer(
  buffer: Buffer,
  options: {
    readonly maxBytes: number;
    readonly kind: VisualAssetKind;
    readonly acceptWarnings?: boolean;
    readonly expectedExtension?: string;
  },
): ImageValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const sha256 = computeSha256(buffer);

  if (buffer.length === 0) {
    return {
      ok: false,
      errors: ['Uploaded file is empty.'],
      warnings,
      width: 0,
      height: 0,
      format: 'unknown',
      sha256,
    };
  }

  if (buffer.length > options.maxBytes) {
    errors.push(`File exceeds maximum size of ${options.maxBytes} bytes.`);
  }

  const dimensions = readImageDimensions(buffer);
  if (dimensions === null) {
    errors.push('Unsupported or corrupt image format. Allowed: PNG, JPEG, WebP, SVG.');
    return {
      ok: false,
      errors,
      warnings,
      width: 0,
      height: 0,
      format: 'unknown',
      sha256,
    };
  }

  if (dimensions.format === 'svg') {
    const svgText = buffer.toString('utf8', 0, Math.min(buffer.length, 65536)).toLowerCase();
    if (svgText.includes('<script') || svgText.includes('javascript:')) {
      errors.push('SVG uploads with scripts are not allowed.');
    }
  }

  const extension = options.expectedExtension?.toLowerCase().replace(/^\./, '');
  if (extension !== undefined && extension.length > 0) {
    const formatToExtension: Record<string, string[]> = {
      png: ['png'],
      jpeg: ['jpg', 'jpeg'],
      webp: ['webp'],
      svg: ['svg'],
    };
    const allowed = formatToExtension[dimensions.format] ?? [];
    if (!allowed.includes(extension)) {
      errors.push(`File extension .${extension} does not match detected format ${dimensions.format}.`);
    }
  }

  if (options.kind === 'mockup') {
    if (dimensions.width < MIN_MOCKUP_WIDTH || dimensions.height < MIN_MOCKUP_HEIGHT) {
      const message = `Mockup dimensions ${dimensions.width}x${dimensions.height} are below recommended minimum ${MIN_MOCKUP_WIDTH}x${MIN_MOCKUP_HEIGHT}.`;
      if (options.acceptWarnings === true) {
        warnings.push(message);
      } else {
        errors.push(message);
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    width: dimensions.width,
    height: dimensions.height,
    format: dimensions.format,
    sha256,
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg']);

/** Find an existing file with the same SHA-256 under docs/design. */
export function findDuplicateByHash(
  designRoot: string,
  sha256: string,
  projectRoot: string,
): string | null {
  return walkForHash(designRoot, sha256, projectRoot);
}

function walkForHash(directory: string, sha256: string, projectRoot: string): string | null {
  let entries: string[] = [];
  try {
    entries = readdirSync(directory);
  } catch {
    return null;
  }

  for (const entry of entries) {
    const absolute = join(directory, entry);
    let stats;
    try {
      stats = statSync(absolute);
    } catch {
      continue;
    }

    if (stats.isDirectory()) {
      const nested = walkForHash(absolute, sha256, projectRoot);
      if (nested !== null) {
        return nested;
      }
      continue;
    }

    const lower = entry.toLowerCase();
    const hasImageExtension = [...IMAGE_EXTENSIONS].some((ext) => lower.endsWith(ext));
    if (!hasImageExtension) {
      continue;
    }

    try {
      const buffer = readFileSync(absolute);
      if (computeSha256(buffer) === sha256) {
        return absolute.slice(projectRoot.length + 1).replace(/\\/g, '/');
      }
    } catch {
      continue;
    }
  }

  return null;
}
