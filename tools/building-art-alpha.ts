import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export type BuildingArtAlphaReport = {
  readonly assetPath: string;
  readonly width: number;
  readonly height: number;
  readonly channels: number;
  readonly transparentPixelCount: number;
  readonly opaquePixelCount: number;
  readonly transparentPercent: number;
  readonly checkerboardSuspect: boolean;
  readonly pass: boolean;
};

function isBackgroundPixel(r: number, g: number, b: number): boolean {
  const luminance = (r + g + b) / 3;
  const isNeutral = Math.abs(r - g) <= 18 && Math.abs(g - b) <= 18;

  // Generated primaries often ship on edge-connected near-black studio backdrops.
  if (isNeutral && luminance <= 22) {
    return true;
  }

  if (luminance >= 235) {
    return true;
  }

  if (isNeutral && luminance >= 175) {
    return true;
  }

  const checkerA = Math.abs(r - 204) <= 22 && Math.abs(g - 204) <= 22 && Math.abs(b - 204) <= 22;
  const checkerB = Math.abs(r - 255) <= 8 && Math.abs(g - 255) <= 8 && Math.abs(b - 255) <= 8;
  return checkerA || checkerB;
}

/** Removes edge-connected light/checkerboard background into real alpha. */
export async function removeBuildingArtBackground(sourcePath: string, targetPath: string): Promise<void> {
  const { data, info } = await sharp(sourcePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);
  const queue: number[] = [];

  const push = (x: number, y: number): void => {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return;
    }

    const index = y * width + x;
    if (visited[index] === 1) {
      return;
    }

    const offset = index * channels;
    const r = data[offset] ?? 0;
    const g = data[offset + 1] ?? 0;
    const b = data[offset + 2] ?? 0;

    if (!isBackgroundPixel(r, g, b)) {
      return;
    }

    visited[index] = 1;
    queue.push(index);
  };

  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    push(x, height - 1);
  }

  for (let y = 0; y < height; y += 1) {
    push(0, y);
    push(width - 1, y);
  }

  while (queue.length > 0) {
    const index = queue.pop();
    if (index === undefined) {
      continue;
    }

    const x = index % width;
    const y = Math.floor(index / width);
    push(x - 1, y);
    push(x + 1, y);
    push(x, y - 1);
    push(x, y + 1);
  }

  for (let index = 0; index < width * height; index += 1) {
    if (visited[index] === 1) {
      data[index * channels + 3] = 0;
    }
  }

  await sharp(data, { raw: { width, height, channels } }).png().toFile(targetPath);
}

export async function validateBuildingArtAlpha(assetPath: string): Promise<BuildingArtAlphaReport> {
  const { data, info } = await sharp(assetPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let transparentPixelCount = 0;
  let opaquePixelCount = 0;
  let opaqueBackgroundLikeCount = 0;

  for (let offset = 0; offset < data.length; offset += info.channels) {
    const alpha = data[offset + 3] ?? 255;
    if (alpha < 250) {
      transparentPixelCount += 1;
    } else {
      opaquePixelCount += 1;
      const r = data[offset] ?? 0;
      const g = data[offset + 1] ?? 0;
      const b = data[offset + 2] ?? 0;
      const luminance = (r + g + b) / 3;
      const isNeutral = Math.abs(r - g) <= 10 && Math.abs(g - b) <= 10;
      const checkerA =
        isNeutral && Math.abs(r - 204) <= 12 && Math.abs(g - 204) <= 12 && Math.abs(b - 204) <= 12;
      const checkerB = isNeutral && luminance >= 248;
      if (checkerA || checkerB) {
        opaqueBackgroundLikeCount += 1;
      }
    }
  }

  const total = transparentPixelCount + opaquePixelCount;
  const transparentPercent = total === 0 ? 0 : (transparentPixelCount / total) * 100;
  const opaqueBackgroundLeakPercent =
    opaquePixelCount === 0 ? 0 : (opaqueBackgroundLikeCount / opaquePixelCount) * 100;
  const checkerboardSuspect = opaqueBackgroundLeakPercent > 5;

  return {
    assetPath,
    width: info.width,
    height: info.height,
    channels: info.channels,
    transparentPixelCount,
    opaquePixelCount,
    transparentPercent,
    checkerboardSuspect,
    pass:
      info.width === 1024 &&
      info.height === 1024 &&
      info.channels === 4 &&
      transparentPercent >= 15 &&
      opaqueBackgroundLeakPercent <= 5,
  };
}

export async function writeAlphaReportJson(
  reports: readonly BuildingArtAlphaReport[],
  targetPath: string,
): Promise<void> {
  await writeFile(targetPath, `${JSON.stringify(reports, null, 2)}\n`, 'utf8');
}

export async function loadAlphaReportsFromManifest(
  primaryPaths: readonly string[],
): Promise<BuildingArtAlphaReport[]> {
  return Promise.all(primaryPaths.map((assetPath) => validateBuildingArtAlpha(assetPath)));
}
