/**
 * @module @project-genesis/api/config/save-path-config
 *
 * Optional acceptance-only default save path via PROJECT_GENESIS_SAVE_PATH.
 */

import { existsSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';

/** Environment variable for an explicit absolute acceptance save file. */
export const PROJECT_GENESIS_SAVE_PATH_ENV = 'PROJECT_GENESIS_SAVE_PATH';

/** Thrown when a configured or requested save path is not allowed. */
export class SavePathRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SavePathRejectedError';
  }
}

/** Thrown when PROJECT_GENESIS_SAVE_PATH is invalid (fail closed at bootstrap). */
export class SavePathConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SavePathConfigurationError';
  }
}

export type SavePathResolution =
  | { readonly mode: 'default'; readonly savePath: string }
  | { readonly mode: 'acceptance'; readonly savePath: string };

/**
 * Known personal save files that must not be used as acceptance overrides or
 * explicit save/load targets while acceptance isolation is active.
 */
export function listProtectedPersonalSavePaths(projectRoot: string): readonly string[] {
  return [
    path.join(projectRoot, 'saves', 'browser-session.json'),
    path.join(projectRoot, 'Saves', 'browser-session.json'),
    path.join(projectRoot, 'apps', 'api', 'saves', 'browser-session.json'),
  ];
}

/** Default personal browser save (unchanged when env is unset). */
export function resolveDefaultPersonalSavePath(projectRoot: string): string {
  return path.join(projectRoot, 'saves', 'browser-session.json');
}

/** Canonical S1 acceptance save file (not the S2 disposable RAM fixture). */
export function resolveCanonicalAcceptanceSavePath(projectRoot: string): string {
  return path.join(projectRoot, 'saves', 'acceptance', 's1-notification-relevance.json');
}

function normalizePathForComparison(absolutePath: string): string {
  const resolved = path.normalize(path.resolve(absolutePath));
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

function tryRealPath(absolutePath: string): string | undefined {
  try {
    return realpathSync.native(absolutePath);
  } catch {
    return undefined;
  }
}

/** True when two paths refer to the same file (case, separators, symlinks/junctions). */
export function pathsReferToSameSaveFile(firstPath: string, secondPath: string): boolean {
  const normalizedFirst = normalizePathForComparison(firstPath);
  const normalizedSecond = normalizePathForComparison(secondPath);

  if (normalizedFirst === normalizedSecond) {
    return true;
  }

  const realFirst = tryRealPath(firstPath);
  const realSecond = tryRealPath(secondPath);

  if (realFirst !== undefined && realSecond !== undefined) {
    return normalizePathForComparison(realFirst) === normalizePathForComparison(realSecond);
  }

  if (realFirst !== undefined) {
    return normalizePathForComparison(realFirst) === normalizedSecond;
  }

  if (realSecond !== undefined) {
    return normalizePathForComparison(realSecond) === normalizedFirst;
  }

  return false;
}

function matchesProtectedPersonalSave(projectRoot: string, candidateAbsolutePath: string): boolean {
  return listProtectedPersonalSavePaths(projectRoot).some((protectedPath) =>
    pathsReferToSameSaveFile(candidateAbsolutePath, protectedPath),
  );
}

function assertAbsoluteJsonSaveFile(candidateAbsolutePath: string): void {
  if (!path.isAbsolute(candidateAbsolutePath)) {
    throw new SavePathConfigurationError('Configured save path must be an absolute path.');
  }

  const extension = path.extname(candidateAbsolutePath);

  if (extension.toLowerCase() !== '.json') {
    throw new SavePathConfigurationError('Configured save path must use a .json file extension.');
  }

  if (existsSync(candidateAbsolutePath)) {
    const stats = statSync(candidateAbsolutePath);

    if (stats.isDirectory()) {
      throw new SavePathConfigurationError('Configured save path must not be a directory.');
    }
  }

  const parentDirectory = path.dirname(candidateAbsolutePath);

  if (!existsSync(parentDirectory)) {
    throw new SavePathConfigurationError('Configured save path parent directory does not exist.');
  }

  const parentStats = statSync(parentDirectory);

  if (!parentStats.isDirectory()) {
    throw new SavePathConfigurationError('Configured save path parent is not a directory.');
  }
}

/**
 * Resolves the API default save file from an optional env value.
 * Invalid overrides throw; they never fall back to the personal default.
 */
export function resolveConfiguredSavePath(
  projectRoot: string,
  configuredValue: string | undefined,
): SavePathResolution {
  const defaultSavePath = resolveDefaultPersonalSavePath(projectRoot);

  if (configuredValue === undefined) {
    return { mode: 'default', savePath: defaultSavePath };
  }

  const trimmed = configuredValue.trim();

  if (trimmed.length === 0) {
    throw new SavePathConfigurationError('Configured save path must not be empty.');
  }

  if (!path.isAbsolute(trimmed)) {
    throw new SavePathConfigurationError('Configured save path must be an absolute path.');
  }

  const absolutePath = path.resolve(trimmed);
  assertAbsoluteJsonSaveFile(absolutePath);

  if (matchesProtectedPersonalSave(projectRoot, absolutePath)) {
    throw new SavePathConfigurationError('Configured save path must not target a protected personal save file.');
  }

  return { mode: 'acceptance', savePath: absolutePath };
}

/**
 * When acceptance isolation is active, rejects explicit save/load targets that
 * point at protected personal saves (before any filesystem read/write).
 */
export function assertAcceptancePersistenceTargetAllowed(
  projectRoot: string,
  targetAbsolutePath: string,
): void {
  if (!path.isAbsolute(targetAbsolutePath)) {
    throw new SavePathRejectedError('Save path must resolve to an absolute path.');
  }

  if (matchesProtectedPersonalSave(projectRoot, targetAbsolutePath)) {
    throw new SavePathRejectedError('Save path targets a protected personal save file.');
  }
}

/** Basename of the owner-approved S2 disposable RAM acceptance fixture (file may remain absent). */
export const S2_DISPOSABLE_RESEARCH_BROWSER_ISOLATION_FIXTURE_FILE =
  'S2-B1-research-browser-isolation-2026-11-11-d1a162600.json';

/** Absolute path for the S2 disposable research-browser isolation fixture binding. */
export function resolveS2DisposableResearchBrowserIsolationSavePath(projectRoot: string): string {
  return path.join(
    projectRoot,
    'saves',
    'acceptance',
    'disposable-warning-fixtures',
    S2_DISPOSABLE_RESEARCH_BROWSER_ISOLATION_FIXTURE_FILE,
  );
}

/** True when the path is exactly the approved S2 disposable fixture save destination. */
export function isS2DisposableResearchBrowserIsolationSavePath(
  projectRoot: string,
  candidateAbsolutePath: string,
): boolean {
  return pathsReferToSameSaveFile(
    candidateAbsolutePath,
    resolveS2DisposableResearchBrowserIsolationSavePath(projectRoot),
  );
}
