import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import {
  formatChangelogEntry,
  parseBacklog,
  parseChangelog,
  updateBacklogLineStatus,
  updateCatalogStatus,
} from './backlog-parser.js';
import { MAX_UPLOAD_BYTES, STATUS_LABEL } from './constants.js';
import {
  findDuplicateByHash,
  resolveAssetKind,
  resolveDestinationDirectory,
  resolveNextRevision,
  validateBacklogFilename,
  validateImageBuffer,
} from './filename-resolver.js';
import { canTransitionStatus, validateAssetId } from './status-transitions.js';
import type {
  BacklogEntry,
  ImportPlan,
  VisualAssetActivityEntry,
  VisualAssetManagerPaths,
  VisualAssetStatus,
} from './types.js';

export type ImportAssetInput = {
  readonly buffer: Buffer;
  readonly backlogFilename: string;
  readonly status: VisualAssetStatus;
  readonly acceptWarnings?: boolean;
};

export type ImportAssetResult = {
  readonly plan: ImportPlan;
  readonly activity: VisualAssetActivityEntry;
};

type BackupSet = {
  readonly backlog?: string;
  readonly catalog?: string;
  readonly changelog?: string;
  readonly imagePath?: string;
};

/** Filesystem-backed visual asset import service. */
export class VisualAssetManagerService {
  constructor(private readonly paths: VisualAssetManagerPaths) {}

  listBacklog(): BacklogEntry[] {
    const content = readFileSync(this.paths.backlogPath, 'utf8');
    return parseBacklog(content);
  }

  getActivity(limit = 20): VisualAssetActivityEntry[] {
    if (!existsSync(this.paths.changelogPath)) {
      return [];
    }
    const content = readFileSync(this.paths.changelogPath, 'utf8');
    return parseChangelog(content, limit);
  }

  previewImport(input: ImportAssetInput): ImportPlan {
    return this.buildPlan(input);
  }

  importAsset(input: ImportAssetInput): ImportAssetResult {
    const plan = this.buildPlan(input);
    const targetAbsolute = join(this.paths.projectRoot, plan.targetRelativePath);
    const tempAbsolute = `${targetAbsolute}.tmp`;
    const backups: BackupSet = {};

    try {
      mkdirSync(dirname(targetAbsolute), { recursive: true });

      if (existsSync(this.paths.backlogPath)) {
        backups.backlog = readFileSync(this.paths.backlogPath, 'utf8');
      }
      if (existsSync(this.paths.catalogPath)) {
        backups.catalog = readFileSync(this.paths.catalogPath, 'utf8');
      }
      if (existsSync(this.paths.changelogPath)) {
        backups.changelog = readFileSync(this.paths.changelogPath, 'utf8');
      }
      if (existsSync(targetAbsolute)) {
        backups.imagePath = targetAbsolute;
      }

      writeFileSync(tempAbsolute, input.buffer);
      renameSync(tempAbsolute, targetAbsolute);

      const backlogContent = readFileSync(this.paths.backlogPath, 'utf8');
      const updatedBacklog = updateBacklogLineStatus(
        backlogContent,
        plan.backlogFilename,
        plan.status,
      );
      writeFileSync(this.paths.backlogPath, updatedBacklog, 'utf8');

      const catalogContent = readFileSync(this.paths.catalogPath, 'utf8');
      const updatedCatalog = updateCatalogStatus(catalogContent, plan.assetId, plan.status);
      writeFileSync(this.paths.catalogPath, updatedCatalog, 'utf8');

      const activity: VisualAssetActivityEntry = {
        date: new Date().toISOString(),
        assetId: plan.assetId,
        operation: plan.revision === 0 ? 'Added' : 'Revised',
        assetFilename: plan.canonicalFilename,
        status: STATUS_LABEL[plan.status],
        destination: plan.targetRelativePath,
        revision: plan.revision,
        sha256: plan.sha256,
      };

      this.appendChangelog(activity);

      return { plan, activity };
    } catch (error) {
      if (existsSync(tempAbsolute)) {
        try {
          unlinkSync(tempAbsolute);
        } catch {
          // ignore
        }
      }
      this.restore(backups, targetAbsolute, input.buffer);
      throw error;
    }
  }

  updateStatus(assetId: string, status: VisualAssetStatus): BacklogEntry {
    validateAssetId(assetId);
    const backlog = this.listBacklog();
    const entry = backlog.find((item) => item.assetId === assetId);
    if (entry === undefined) {
      throw new Error(`Backlog entry not found for ${assetId}`);
    }

    if (entry.status === 'integrated') {
      throw new Error('Integrated assets can only be changed by importing a revision.');
    }

    if (!canTransitionStatus(entry.status, status)) {
      throw new Error(`Status transition from ${entry.status} to ${status} is not allowed.`);
    }

    const backups: BackupSet = {};
    try {
      backups.backlog = readFileSync(this.paths.backlogPath, 'utf8');
      backups.catalog = readFileSync(this.paths.catalogPath, 'utf8');

      const updatedBacklog = updateBacklogLineStatus(backups.backlog, entry.backlogFilename, status);
      writeFileSync(this.paths.backlogPath, updatedBacklog, 'utf8');

      const catalogContent = readFileSync(this.paths.catalogPath, 'utf8');
      const updatedCatalog = updateCatalogStatus(catalogContent, assetId, status);
      writeFileSync(this.paths.catalogPath, updatedCatalog, 'utf8');

      this.appendChangelog({
        date: new Date().toISOString(),
        assetId,
        operation: 'Status Updated',
        assetFilename: entry.backlogFilename,
        status: STATUS_LABEL[status],
        destination: resolveDestinationDirectory(assetId),
        revision: 0,
        sha256: '',
      });

      return { ...entry, status };
    } catch (error) {
      this.restore(backups, '', Buffer.alloc(0));
      throw error;
    }
  }

  getAsset(assetId: string): BacklogEntry {
    validateAssetId(assetId);
    const entry = this.listBacklog().find((item) => item.assetId === assetId);
    if (entry === undefined) {
      throw new Error(`Asset not found: ${assetId}`);
    }
    return entry;
  }

  private appendChangelog(activity: VisualAssetActivityEntry): void {
    const changelogBlock = formatChangelogEntry(activity);
    const existingChangelog = existsSync(this.paths.changelogPath)
      ? readFileSync(this.paths.changelogPath, 'utf8').trimEnd()
      : '# Visual Asset Changelog\n';
    const separator = existingChangelog.endsWith('\n') ? '\n\n' : '\n\n';
    writeFileSync(
      this.paths.changelogPath,
      `${existingChangelog}${separator}${changelogBlock}\n`,
      'utf8',
    );
  }

  private buildPlan(input: ImportAssetInput): ImportPlan {
    const filenameErrors = validateBacklogFilename(input.backlogFilename);
    if (filenameErrors.length > 0) {
      throw new Error(filenameErrors.join(' '));
    }

    const backlog = this.listBacklog();
    const entry = backlog.find((item) => item.backlogFilename === input.backlogFilename);
    if (entry === undefined) {
      throw new Error(`Backlog entry not found for ${input.backlogFilename}`);
    }

    const kind = resolveAssetKind(entry.assetId);
    const validation = validateImageBuffer(input.buffer, {
      maxBytes: MAX_UPLOAD_BYTES,
      kind,
      acceptWarnings: input.acceptWarnings,
      expectedExtension: extname(input.backlogFilename),
    });

    if (!validation.ok) {
      throw new Error(validation.errors.join(' '));
    }

    const destinationDir = resolveDestinationDirectory(entry.assetId);
    const targetDirectory = join(this.paths.designRoot, destinationDir);
    const { revision, canonicalFilename } = resolveNextRevision(
      targetDirectory,
      input.backlogFilename,
    );
    const targetRelativePath = join('docs', 'design', destinationDir, canonicalFilename).replace(
      /\\/g,
      '/',
    );

    const duplicatePath = findDuplicateByHash(
      this.paths.designRoot,
      validation.sha256,
      this.paths.projectRoot,
    );
    if (
      duplicatePath !== null &&
      duplicatePath !== targetRelativePath &&
      !isSameAssetDuplicate(entry.assetId, input.backlogFilename, duplicatePath)
    ) {
      throw new Error(`Duplicate file detected at ${duplicatePath}.`);
    }

    return {
      assetId: entry.assetId,
      backlogFilename: input.backlogFilename,
      canonicalFilename,
      revision,
      targetDirectory,
      targetRelativePath,
      status: input.status,
      kind,
      sha256: validation.sha256,
      width: validation.width,
      height: validation.height,
      warnings: validation.warnings,
    };
  }

  private restore(backups: BackupSet, targetAbsolute: string, buffer: Buffer): void {
    try {
      if (backups.backlog !== undefined) {
        writeFileSync(this.paths.backlogPath, backups.backlog, 'utf8');
      }
      if (backups.catalog !== undefined) {
        writeFileSync(this.paths.catalogPath, backups.catalog, 'utf8');
      }
      if (backups.changelog !== undefined) {
        writeFileSync(this.paths.changelogPath, backups.changelog, 'utf8');
      }
      if (targetAbsolute.length > 0 && backups.imagePath !== undefined) {
        writeFileSync(targetAbsolute, readFileSync(backups.imagePath));
      } else if (targetAbsolute.length > 0 && existsSync(targetAbsolute)) {
        const written = readFileSync(targetAbsolute);
        if (written.equals(buffer)) {
          unlinkSync(targetAbsolute);
        }
      }
    } catch {
      // Best-effort rollback; original error is more important.
    }
  }
}

function isSameAssetDuplicate(
  assetId: string,
  backlogFilename: string,
  duplicatePath: string,
): boolean {
  const normalized = duplicatePath.replace(/\\/g, '/').toLowerCase();
  return (
    normalized.includes(assetId.toLowerCase()) ||
    normalized.includes(backlogFilename.toLowerCase())
  );
}

/** Build default paths from repository root. */
export function createDefaultPaths(projectRoot: string): VisualAssetManagerPaths {
  return {
    projectRoot,
    backlogPath: join(projectRoot, 'docs', 'design', 'VISUAL_PRODUCTION_BACKLOG.md'),
    catalogPath: join(projectRoot, 'docs', 'design', 'VISUAL_ASSET_CATALOG.md'),
    changelogPath: join(projectRoot, 'docs', 'design', 'VISUAL_ASSET_CHANGELOG.md'),
    designRoot: join(projectRoot, 'docs', 'design'),
  };
}
