/**
 * @module @project-genesis/api/game/acceptance-s3-ram-only-building-placement
 *
 * Opt-in, fail-closed policy to skip persistence after building placement only.
 */

import type { SessionStatusReadModel } from '../../../../src/application/read-models/SessionStatusReadModel.js';
import {
  isS2DisposableResearchBrowserIsolationSavePath,
  pathsReferToSameSaveFile,
  resolveCanonicalAcceptanceSavePath,
  resolveDefaultPersonalSavePath,
} from '../config/save-path-config.js';

/** Process-local opt-in for S3 disposable RAM building placement (acceptance API only). */
export const PROJECT_GENESIS_ACCEPTANCE_S3_RAM_ONLY_BUILDING_PLACEMENT_ENV =
  'PROJECT_GENESIS_ACCEPTANCE_S3_RAM_ONLY_BUILDING_PLACEMENT';

/**
 * Server-validated disposable acceptance session naming (set via `session/new`, not request headers).
 */
export const DISPOSABLE_RAM_ACCEPTANCE_COMPANY_NAME_PATTERN =
  /^[A-Za-z0-9][A-Za-z0-9-]*-Disposable-RAM-\d{4}-\d{2}-\d{2}$/;

export type AcceptanceS3RamOnlyBuildingPlacementContext = {
  readonly ramOnlyBuildingPlacementEnv: string | undefined;
  readonly acceptanceSaveIsolation: boolean;
  readonly projectRoot: string;
  readonly configuredSavePath: string;
  readonly sessionStatus: SessionStatusReadModel;
  /** When true, the configured save file already exists on disk (RAM-only requires false). */
  readonly configuredSaveFileExists: boolean;
};

export function isDisposableRamAcceptanceCompanyName(
  companyName: string | null | undefined,
): boolean {
  if (companyName === null || companyName === undefined) {
    return false;
  }

  const trimmed = companyName.trim();

  if (trimmed.length === 0) {
    return false;
  }

  return DISPOSABLE_RAM_ACCEPTANCE_COMPANY_NAME_PATTERN.test(trimmed);
}

/** Only the literal `1` arms the feature; any other value fails closed. */
export function isAcceptanceS3RamOnlyBuildingPlacementFlagArmed(raw: string | undefined): boolean {
  return raw !== undefined && raw.trim() === '1';
}

/**
 * Returns true only when every isolation/session/path prerequisite is satisfied.
 * Default and ambiguous configurations always return false (persist after placement).
 */
export function shouldSkipPersistenceAfterBuildingPlacement(
  context: AcceptanceS3RamOnlyBuildingPlacementContext,
): boolean {
  if (!isAcceptanceS3RamOnlyBuildingPlacementFlagArmed(context.ramOnlyBuildingPlacementEnv)) {
    return false;
  }

  if (!context.acceptanceSaveIsolation) {
    return false;
  }

  if (context.configuredSaveFileExists) {
    return false;
  }

  if (!isS2DisposableResearchBrowserIsolationSavePath(context.projectRoot, context.configuredSavePath)) {
    return false;
  }

  const personalDefault = resolveDefaultPersonalSavePath(context.projectRoot);
  const canonicalS1 = resolveCanonicalAcceptanceSavePath(context.projectRoot);

  if (
    pathsReferToSameSaveFile(context.configuredSavePath, personalDefault) ||
    pathsReferToSameSaveFile(context.configuredSavePath, canonicalS1)
  ) {
    return false;
  }

  const { sessionStatus } = context;

  if (!sessionStatus.hasActiveSession) {
    return false;
  }

  if (!isDisposableRamAcceptanceCompanyName(sessionStatus.companyName)) {
    return false;
  }

  if (!pathsReferToSameSaveFile(sessionStatus.savePath, context.configuredSavePath)) {
    return false;
  }

  return true;
}