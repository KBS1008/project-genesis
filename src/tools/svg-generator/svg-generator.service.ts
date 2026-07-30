import {
  createDefaultPaths,
  VisualAssetManagerService,
  type BacklogEntry,
  type VisualAssetActivityEntry,
} from '../visual-asset-manager/index.js';
import { validateAssetId } from '../visual-asset-manager/status-transitions.js';
import {
  resolveDestinationDirectory,
  resolveNextRevision,
} from '../visual-asset-manager/filename-resolver.js';
import { join } from 'node:path';
import { SVG_GENERATOR_VERSION } from './constants.js';
import { getSvgTemplate, listSvgTemplates, suggestTemplateForAsset } from './templates/registry.js';
import type {
  SvgGenerationRequest,
  SvgGenerationResult,
  SvgTemplateDefinition,
  SvgValidationResult,
} from './types.js';
import { hashSvg, sanitizeSvg, validateSvg } from './validator.js';

/** Orchestrates SVG generation and repository integration via Visual Asset Manager. */
export class SvgGeneratorService {
  private readonly visualAssets: VisualAssetManagerService;
  private readonly paths: ReturnType<typeof createDefaultPaths>;

  constructor(projectRoot: string) {
    this.paths = createDefaultPaths(projectRoot);
    this.visualAssets = new VisualAssetManagerService(this.paths);
  }

  listSvgBacklog(): BacklogEntry[] {
    return this.visualAssets.listBacklog().filter((entry) => entry.backlogFilename.toLowerCase().endsWith('.svg'));
  }

  listTemplates(): readonly SvgTemplateDefinition[] {
    return listSvgTemplates();
  }

  getTemplate(templateId: string): SvgTemplateDefinition {
    return getSvgTemplate(templateId).definition;
  }

  suggestTemplate(assetId: string): string {
    validateAssetId(assetId);
    return suggestTemplateForAsset(assetId);
  }

  preview(request: SvgGenerationRequest): SvgGenerationResult {
    return this.generateInternal(request, true);
  }

  validate(request: SvgGenerationRequest): SvgValidationResult & { readonly svg: string } {
    const result = this.generateInternal(request, true);
    const validation = validateSvg(result.svg, {
      expectedWidth: request.width,
      expectedHeight: request.height,
      assetId: request.assetId,
      backlogFilename: request.backlogFilename,
    });
    return {
      ...validation,
      svg: result.svg,
      warnings: [...validation.warnings, ...result.warnings],
    };
  }

  generateAndSave(request: SvgGenerationRequest): {
    readonly generation: SvgGenerationResult;
    readonly importResult: ReturnType<VisualAssetManagerService['importAsset']>;
  } {
    const generation = this.generateInternal(request, false);
    const validation = validateSvg(generation.svg, {
      expectedWidth: request.width,
      expectedHeight: request.height,
      assetId: request.assetId,
      backlogFilename: request.backlogFilename,
    });

    if (!validation.ok) {
      throw new Error(validation.errors.join(' '));
    }

    if (validation.warnings.length > 0 && request.acceptWarnings !== true) {
      throw new Error(validation.warnings.join(' '));
    }

    const importResult = this.visualAssets.importAsset({
      buffer: Buffer.from(generation.svg, 'utf8'),
      backlogFilename: request.backlogFilename,
      status: request.status,
      acceptWarnings: request.acceptWarnings,
    });

    return { generation, importResult };
  }

  getActivity(limit = 20): VisualAssetActivityEntry[] {
    return this.visualAssets.getActivity(limit);
  }

  private generateInternal(request: SvgGenerationRequest, validationOnly: boolean): SvgGenerationResult {
    validateAssetId(request.assetId);
    const entry = this.visualAssets.getAsset(request.assetId);
    if (entry.backlogFilename !== request.backlogFilename) {
      throw new Error('Backlog filename does not match selected asset.');
    }

    const template = getSvgTemplate(request.templateId);
    const rawSvg = template.render({
      title: request.title,
      subtitle: request.subtitle,
      width: request.width,
      height: request.height,
      content: request.content,
      version: SVG_GENERATOR_VERSION,
    });

    const sanitized = sanitizeSvg(rawSvg);
    const validation = validateSvg(sanitized, {
      expectedWidth: request.width,
      expectedHeight: request.height,
      assetId: request.assetId,
      backlogFilename: request.backlogFilename,
    });

    if (!validation.ok) {
      throw new Error(validation.errors.join(' '));
    }

    if (!validationOnly && validation.warnings.length > 0 && request.acceptWarnings !== true) {
      throw new Error(validation.warnings.join(' '));
    }

    const destinationDir = resolveDestinationDirectory(request.assetId);
    const targetDirectory = join(this.paths.designRoot, destinationDir);
    const { canonicalFilename } = resolveNextRevision(targetDirectory, request.backlogFilename);
    const targetRelativePath = join('docs', 'design', destinationDir, canonicalFilename).replace(
      /\\/g,
      '/',
    );

    return {
      assetId: request.assetId,
      filename: canonicalFilename,
      targetPath: targetRelativePath,
      width: request.width,
      height: request.height,
      sha256: hashSvg(sanitized),
      warnings: validation.warnings,
      svg: sanitized,
    };
  }
}
