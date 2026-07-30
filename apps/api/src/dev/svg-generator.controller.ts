/**
 * @module @project-genesis/api/dev/svg-generator.controller
 */

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { SvgGenerationRequest } from '../../../../src/tools/svg-generator/index.js';
import { toApiSuccess } from '../common/api-response.js';
import { DevOnlyGuard } from './dev-only.guard.js';
import { SvgGeneratorApiService } from './svg-generator-api.service.js';

const VALID_STATUSES = new Set<SvgGenerationRequest['status']>([
  'in-production',
  'in-review',
  'approved',
]);

function parseGenerationRequest(body: Partial<SvgGenerationRequest>): SvgGenerationRequest {
  if (body.assetId === undefined || body.backlogFilename === undefined || body.templateId === undefined) {
    throw new BadRequestException('assetId, backlogFilename, and templateId are required.');
  }
  if (body.title === undefined || body.title.trim().length === 0) {
    throw new BadRequestException('title is required.');
  }
  if (!Number.isFinite(body.width) || !Number.isFinite(body.height) || (body.width ?? 0) <= 0 || (body.height ?? 0) <= 0) {
    throw new BadRequestException('width and height must be positive numbers.');
  }
  if (body.status === undefined || !VALID_STATUSES.has(body.status)) {
    throw new BadRequestException('Invalid status value.');
  }

  return {
    assetId: body.assetId,
    backlogFilename: body.backlogFilename,
    templateId: body.templateId,
    title: body.title.trim(),
    subtitle: body.subtitle?.trim(),
    width: Number(body.width),
    height: Number(body.height),
    content: body.content ?? {},
    status: body.status,
    acceptWarnings: body.acceptWarnings === true,
  };
}

/** Developer-only SVG generator endpoints. */
@Controller('api/dev/svg-generator')
@UseGuards(DevOnlyGuard)
export class SvgGeneratorController {
  constructor(
    @Inject(SvgGeneratorApiService)
    private readonly svgGeneratorService: SvgGeneratorApiService,
  ) {}

  @Get('templates')
  listTemplates() {
    return toApiSuccess(this.svgGeneratorService.listTemplates());
  }

  @Get('templates/:templateId')
  getTemplate(@Param('templateId') templateId: string) {
    return toApiSuccess(this.svgGeneratorService.getTemplate(templateId));
  }

  @Get('backlog')
  listBacklog() {
    return toApiSuccess(this.svgGeneratorService.listSvgBacklog());
  }

  @Get('suggest/:assetId')
  suggestTemplate(@Param('assetId') assetId: string) {
    return toApiSuccess({ templateId: this.svgGeneratorService.suggestTemplate(assetId) });
  }

  @Get('activity')
  getActivity(@Query('limit') limit?: string) {
    const parsedLimit = limit === undefined ? 20 : Number.parseInt(limit, 10);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
      throw new BadRequestException('limit must be a positive integer.');
    }
    return toApiSuccess(this.svgGeneratorService.getActivity(parsedLimit));
  }

  @Post('preview')
  @HttpCode(200)
  preview(@Body() body: Partial<SvgGenerationRequest>) {
    try {
      return toApiSuccess(this.svgGeneratorService.preview(parseGenerationRequest(body)));
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Preview failed.');
    }
  }

  @Post('validate')
  @HttpCode(200)
  validate(@Body() body: Partial<SvgGenerationRequest>) {
    try {
      return toApiSuccess(this.svgGeneratorService.validate(parseGenerationRequest(body)));
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Validation failed.');
    }
  }

  @Post('generate')
  @HttpCode(200)
  generate(@Body() body: Partial<SvgGenerationRequest>) {
    try {
      return toApiSuccess(this.svgGeneratorService.generate(parseGenerationRequest(body)));
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Generation failed.');
    }
  }
}
