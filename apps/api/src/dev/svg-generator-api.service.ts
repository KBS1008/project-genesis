/**
 * @module @project-genesis/api/dev/svg-generator-api.service
 */

import { Injectable } from '@nestjs/common';
import {
  SvgGeneratorService,
  type SvgGenerationRequest,
  type SvgTemplateDefinition,
} from '../../../../src/tools/svg-generator/index.js';
import type { BacklogEntry, VisualAssetActivityEntry } from '../../../../src/tools/visual-asset-manager/index.js';
import { resolveProjectPaths } from '../config/project-paths.js';

/** NestJS adapter for the SVG generator tool. */
@Injectable()
export class SvgGeneratorApiService {
  private readonly generator: SvgGeneratorService;

  constructor() {
    const { projectRoot } = resolveProjectPaths(import.meta.url);
    this.generator = new SvgGeneratorService(projectRoot);
  }

  listTemplates(): readonly SvgTemplateDefinition[] {
    return this.generator.listTemplates();
  }

  getTemplate(templateId: string): SvgTemplateDefinition {
    return this.generator.getTemplate(templateId);
  }

  listSvgBacklog(): BacklogEntry[] {
    return this.generator.listSvgBacklog();
  }

  suggestTemplate(assetId: string): string {
    return this.generator.suggestTemplate(assetId);
  }

  preview(request: SvgGenerationRequest) {
    return this.generator.preview(request);
  }

  validate(request: SvgGenerationRequest) {
    return this.generator.validate(request);
  }

  generate(request: SvgGenerationRequest) {
    return this.generator.generateAndSave(request);
  }

  getActivity(limit = 20): VisualAssetActivityEntry[] {
    return this.generator.getActivity(limit);
  }
}
