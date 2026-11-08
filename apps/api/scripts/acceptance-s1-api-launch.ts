/**
 * Pure acceptance API launch planning — no spawn on import.
 * Future runtime proof must invoke via local `node` + package-local `tsx` only.
 */

import { existsSync, lstatSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  pathsReferToSameSaveFile,
  resolveConfiguredSavePath,
  SavePathConfigurationError,
} from '../src/config/save-path-config.js';

/** Opt-in disposable S1 warning fixture save (launcher only; unset preserves canonical acceptance save). */
export const PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV =
  'PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH';

const DISPOSABLE_FIXTURE_SEGMENT = path.join(
  'saves',
  'acceptance',
  'disposable-warning-fixtures',
);

export const ACCEPTANCE_API_PORT = 3002;
export const ACCEPTANCE_API_HOST = '127.0.0.1';
export const ACCEPTANCE_WEB_ORIGIN = 'http://127.0.0.1:3003';

export class AcceptanceApiLaunchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AcceptanceApiLaunchError';
  }
}

export type PortInUseChecker = (port: number, host: string) => boolean;

export type AcceptanceApiLaunchPlan = {
  readonly executable: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly env: NodeJS.ProcessEnv;
};

const FORBIDDEN_EXECUTABLE_FRAGMENTS = ['pnpm', 'npx', 'corepack', 'yarn.cmd', 'pnpm.cmd'] as const;

/** Resolves `apps/api` package root from this module location. */
export function resolveApiPackageRoot(moduleUrl: string = import.meta.url): string {
  return path.resolve(path.dirname(fileURLToPath(moduleUrl)), '..');
}

/** Resolves monorepo project root from `apps/api`. */
export function resolveProjectRootFromApi(apiPackageRoot: string): string {
  return path.resolve(apiPackageRoot, '..', '..');
}

/** Canonical acceptance save file for S1 notification relevance isolation proof. */
export function resolveCanonicalAcceptanceSavePath(projectRoot: string): string {
  return path.join(projectRoot, 'saves', 'acceptance', 's1-notification-relevance.json');
}

/** Absolute directory for disposable warning-acceptance save files only. */
export function resolveDisposableFixtureSaveRoot(projectRoot: string): string {
  return path.join(projectRoot, DISPOSABLE_FIXTURE_SEGMENT);
}

function normalizePathForComparison(absolutePath: string): string {
  const resolved = path.normalize(path.resolve(absolutePath));
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

function tryRealPathNative(absolutePath: string): string {
  try {
    return realpathSync.native(absolutePath);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);

    throw new AcceptanceApiLaunchError(
      `Disposable fixture path cannot be resolved safely: ${detail}`,
    );
  }
}

function assertDirectoryNotSymlink(absoluteDirectory: string): void {
  const stats = lstatSync(absoluteDirectory);

  if (stats.isSymbolicLink()) {
    throw new AcceptanceApiLaunchError(
      'Disposable fixture path must not traverse a symlink or junction directory.',
    );
  }
}

/**
 * Canonical filesystem containment for fixture paths (lexical checks alone are insufficient on Windows).
 * Runs at launch-plan time only; TOCTOU after spawn is not prevented here.
 */
function assertDisposableFixtureFilesystemContainment(
  projectRoot: string,
  absoluteSavePath: string,
): void {
  const fixtureRoot = resolveDisposableFixtureSaveRoot(projectRoot);

  if (!existsSync(fixtureRoot)) {
    throw new AcceptanceApiLaunchError(
      'Disposable fixture root directory does not exist (saves/acceptance/disposable-warning-fixtures/).',
    );
  }

  assertDirectoryNotSymlink(fixtureRoot);

  const fixtureRootReal = tryRealPathNative(fixtureRoot);
  const lexicalRootNormalized = normalizePathForComparison(fixtureRoot);
  const fixtureRootRealNormalized = normalizePathForComparison(fixtureRootReal);
  const rootEscapeCheck = path.relative(lexicalRootNormalized, fixtureRootRealNormalized);

  if (rootEscapeCheck.startsWith('..') || path.isAbsolute(rootEscapeCheck)) {
    throw new AcceptanceApiLaunchError(
      'Disposable fixture root resolves outside the allowed disposable-warning-fixtures directory.',
    );
  }

  const parentDirectory = path.dirname(absoluteSavePath);

  if (!existsSync(parentDirectory)) {
    throw new AcceptanceApiLaunchError('Disposable fixture save parent directory does not exist.');
  }

  assertDirectoryNotSymlink(parentDirectory);

  const parentReal = tryRealPathNative(parentDirectory);
  const parentRealNormalized = normalizePathForComparison(parentReal);
  const parentRelative = path.relative(fixtureRootRealNormalized, parentRealNormalized);

  if (parentRelative.startsWith('..') || path.isAbsolute(parentRelative)) {
    throw new AcceptanceApiLaunchError(
      'Disposable fixture save path resolves outside the disposable fixture root.',
    );
  }

  const savePathForContainment = existsSync(absoluteSavePath)
    ? tryRealPathNative(absoluteSavePath)
    : absoluteSavePath;
  const saveNormalized = normalizePathForComparison(savePathForContainment);
  const saveRelative = path.relative(fixtureRootRealNormalized, saveNormalized);

  if (
    saveRelative === '' ||
    saveRelative === '.' ||
    saveRelative.startsWith('..') ||
    path.isAbsolute(saveRelative)
  ) {
    throw new AcceptanceApiLaunchError(
      'Disposable fixture save path resolves outside the disposable fixture root.',
    );
  }
}

function assertDisposableFixtureSavePathAllowed(
  projectRoot: string,
  absoluteSavePath: string,
): void {
  const canonical = resolveCanonicalAcceptanceSavePath(projectRoot);

  if (pathsReferToSameSaveFile(absoluteSavePath, canonical)) {
    throw new AcceptanceApiLaunchError(
      'Disposable fixture save path must not target the canonical S1 acceptance save.',
    );
  }

  const fixtureRoot = resolveDisposableFixtureSaveRoot(projectRoot);
  const normalizedRoot = normalizePathForComparison(fixtureRoot);
  const normalizedSave = normalizePathForComparison(absoluteSavePath);
  const relative = path.relative(normalizedRoot, normalizedSave);

  if (relative === '' || relative === '.' || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new AcceptanceApiLaunchError(
      'Disposable fixture save path must resolve to a .json file inside saves/acceptance/disposable-warning-fixtures/.',
    );
  }
}

/**
 * Resolves the acceptance API save path from optional fixture env; default is canonical acceptance.
 */
export function resolveAcceptanceSavePathForLaunch(
  projectRoot: string,
  baseEnv: NodeJS.ProcessEnv,
): string {
  if (!Object.prototype.hasOwnProperty.call(baseEnv, PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV)) {
    return resolveCanonicalAcceptanceSavePath(projectRoot);
  }

  const raw = baseEnv[PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV];

  if (raw === undefined) {
    return resolveCanonicalAcceptanceSavePath(projectRoot);
  }

  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    throw new AcceptanceApiLaunchError(
      `${PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV} must not be empty when set.`,
    );
  }

  const absolutePath = path.resolve(trimmed);

  if (!path.isAbsolute(absolutePath)) {
    throw new AcceptanceApiLaunchError('Disposable fixture save path must be absolute.');
  }

  assertDisposableFixtureSavePathAllowed(projectRoot, absolutePath);
  assertDisposableFixtureFilesystemContainment(projectRoot, absolutePath);
  assertSaveTargetNotSymlinkOrJunction(absolutePath);

  try {
    resolveConfiguredSavePath(projectRoot, absolutePath);
  } catch (error) {
    if (error instanceof SavePathConfigurationError) {
      throw new AcceptanceApiLaunchError(error.message);
    }

    throw error;
  }

  return absolutePath;
}

/** Local TSX CLI beside the API package (no pnpm shim). */
export function resolveLocalTsxCliPath(apiPackageRoot: string): string {
  const candidate = path.join(apiPackageRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');

  if (!existsSync(candidate)) {
    throw new AcceptanceApiLaunchError(
      `Local TSX CLI not found at ${candidate}. Install dependencies without invoking pnpm from acceptance launchers.`,
    );
  }

  return candidate;
}

function assertSaveTargetNotSymlinkOrJunction(absoluteSavePath: string): void {
  if (!existsSync(absoluteSavePath)) {
    return;
  }

  const stats = lstatSync(absoluteSavePath);

  if (stats.isSymbolicLink()) {
    throw new AcceptanceApiLaunchError('Acceptance save path must not be a symlink or junction.');
  }
}

function stripInheritedSavePathOverride(baseEnv: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const {
    PROJECT_GENESIS_SAVE_PATH: _removedSave,
    [PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV]: _removedFixture,
    ...rest
  } = baseEnv;
  return rest;
}

/** Validates acceptance API launch inputs and returns process-local env (fail closed). */
export function buildAcceptanceApiLaunchEnvironment(
  projectRoot: string,
  baseEnv: NodeJS.ProcessEnv,
  options?: {
    readonly acceptanceSavePath?: string;
    readonly portInUse?: PortInUseChecker;
  },
): NodeJS.ProcessEnv {
  const acceptanceSavePath =
    options?.acceptanceSavePath ?? resolveAcceptanceSavePathForLaunch(projectRoot, baseEnv);

  if (!path.isAbsolute(acceptanceSavePath)) {
    throw new AcceptanceApiLaunchError('Acceptance save path must be absolute.');
  }

  assertSaveTargetNotSymlinkOrJunction(acceptanceSavePath);

  try {
    resolveConfiguredSavePath(projectRoot, acceptanceSavePath);
  } catch (error) {
    if (error instanceof SavePathConfigurationError) {
      throw new AcceptanceApiLaunchError(error.message);
    }

    throw error;
  }

  const inheritedPort = baseEnv.PORT?.trim();

  if (inheritedPort === '3001') {
    throw new AcceptanceApiLaunchError('Acceptance API launch must not inherit personal API port 3001.');
  }

  const inheritedHost = baseEnv.HOST?.trim()?.toLowerCase();

  if (inheritedHost !== undefined && inheritedHost.length > 0 && inheritedHost !== ACCEPTANCE_API_HOST) {
    throw new AcceptanceApiLaunchError(`Acceptance API HOST must be ${ACCEPTANCE_API_HOST}.`);
  }

  if (options?.portInUse?.(ACCEPTANCE_API_PORT, ACCEPTANCE_API_HOST)) {
    throw new AcceptanceApiLaunchError(`Port ${ACCEPTANCE_API_PORT} is already in use.`);
  }

  const cleaned = stripInheritedSavePathOverride(baseEnv);

  return {
    ...cleaned,
    PORT: String(ACCEPTANCE_API_PORT),
    HOST: ACCEPTANCE_API_HOST,
    WEB_ORIGIN: ACCEPTANCE_WEB_ORIGIN,
    PROJECT_GENESIS_SAVE_PATH: acceptanceSavePath,
  };
}

/** Ensures spawn configuration never routes through a package-manager executable. */
export function assertNoPackageManagerInSpawn(plan: Pick<AcceptanceApiLaunchPlan, 'executable' | 'args'>): void {
  const executableLower = plan.executable.toLowerCase();

  for (const fragment of FORBIDDEN_EXECUTABLE_FRAGMENTS) {
    if (executableLower.includes(fragment)) {
      throw new AcceptanceApiLaunchError(`Forbidden package-manager executable fragment: ${fragment}`);
    }
  }

  for (const arg of plan.args) {
    const argLower = arg.toLowerCase();

    for (const fragment of FORBIDDEN_EXECUTABLE_FRAGMENTS) {
      if (argLower.includes(fragment)) {
        throw new AcceptanceApiLaunchError(`Forbidden package-manager argument fragment: ${fragment}`);
      }
    }
  }
}

/** Builds a spawn plan using local Node + TSX only. */
export function buildAcceptanceApiLaunchPlan(
  apiPackageRoot: string,
  nodeExecutable: string,
  baseEnv: NodeJS.ProcessEnv,
  options?: {
    readonly acceptanceSavePath?: string;
    readonly portInUse?: PortInUseChecker;
  },
): AcceptanceApiLaunchPlan {
  const projectRoot = resolveProjectRootFromApi(apiPackageRoot);
  const tsxCli = resolveLocalTsxCliPath(apiPackageRoot);
  const env = buildAcceptanceApiLaunchEnvironment(projectRoot, baseEnv, options);

  const plan: AcceptanceApiLaunchPlan = {
    executable: nodeExecutable,
    args: [tsxCli, 'watch', path.join('src', 'main.dev.ts')],
    cwd: apiPackageRoot,
    env,
  };

  assertNoPackageManagerInSpawn(plan);

  const executableLower = nodeExecutable.toLowerCase();

  if (!executableLower.endsWith('node') && !executableLower.endsWith('node.exe')) {
    throw new AcceptanceApiLaunchError('Acceptance API launcher must spawn the Node executable.');
  }

  return plan;
}
