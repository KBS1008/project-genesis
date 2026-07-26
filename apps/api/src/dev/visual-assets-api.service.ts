/**
 * @module @project-genesis/api/dev/visual-assets-api.service
 */

import { Injectable } from '@nestjs/common';
import {
  createDefaultPaths,
  VisualAssetManagerService,
  type BacklogEntry,
  type ImportPlan,
  type VisualAssetActivityEntry,
  type VisualAssetStatus,
} from '../../../../src/tools/visual-asset-manager/index.js';
import { resolveProjectPaths } from '../config/project-paths.js';

export type VisualAssetListItem = BacklogEntry;

export type ValidateImportResult = ImportPlan & {
  readonly errors: readonly string[];
};

/** NestJS adapter around the filesystem visual asset manager. */
@Injectable()
export class VisualAssetsApiService {
  private readonly manager: VisualAssetManagerService;

  constructor() {
    const { projectRoot } = resolveProjectPaths(import.meta.url);
    this.manager = new VisualAssetManagerService(createDefaultPaths(projectRoot));
  }

  listAssets(): VisualAssetListItem[] {
    return this.manager.listBacklog();
  }

  getAsset(assetId: string): VisualAssetListItem {
    return this.manager.getAsset(assetId);
  }

  getActivity(limit = 20): VisualAssetActivityEntry[] {
    return this.manager.getActivity(limit);
  }

  validateImport(input: {
    readonly buffer: Buffer;
    readonly backlogFilename: string;
    readonly status: VisualAssetStatus;
    readonly acceptWarnings?: boolean;
  }): ValidateImportResult {
    const plan = this.manager.previewImport(input);
    return { ...plan, errors: [] };
  }

  importAsset(input: {
    readonly buffer: Buffer;
    readonly backlogFilename: string;
    readonly status: VisualAssetStatus;
    readonly acceptWarnings?: boolean;
  }): { readonly plan: ImportPlan; readonly activity: VisualAssetActivityEntry } {
    return this.manager.importAsset(input);
  }

  updateStatus(assetId: string, status: VisualAssetStatus): VisualAssetListItem {
    return this.manager.updateStatus(assetId, status);
  }
}
