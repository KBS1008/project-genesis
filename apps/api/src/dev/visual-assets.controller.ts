/**
 * @module @project-genesis/api/dev/visual-assets.controller
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { readFileSync } from 'node:fs';
import type { VisualAssetStatus } from '../../../../src/tools/visual-asset-manager/index.js';
import { toApiSuccess } from '../common/api-response.js';
import { DevOnlyGuard } from './dev-only.guard.js';
import { visualAssetUploadOptions } from './visual-asset-upload.options.js';
import { VisualAssetsApiService } from './visual-assets-api.service.js';

const VALID_STATUSES = new Set<VisualAssetStatus>([
  'planned',
  'in-production',
  'in-review',
  'approved',
  'integrated',
]);

function parseStatus(value: string | undefined): VisualAssetStatus {
  if (value === undefined || !VALID_STATUSES.has(value as VisualAssetStatus)) {
    throw new BadRequestException('Invalid status value.');
  }
  return value as VisualAssetStatus;
}

function parseUploadedFile(file: Express.Multer.File | undefined): Buffer {
  if (file === undefined) {
    throw new BadRequestException('Image file is required.');
  }

  if (file.buffer !== undefined && file.buffer.length > 0) {
    return file.buffer;
  }

  if (typeof file.path === 'string' && file.path.length > 0) {
    try {
      const buffer = readFileSync(file.path);
      if (buffer.length > 0) {
        return buffer;
      }
    } catch {
      // Fall through to shared error below.
    }
  }

  throw new BadRequestException('Image file is required.');
}

/** Developer-only visual asset management endpoints. */
@Controller('api/dev/visual-assets')
@UseGuards(DevOnlyGuard)
export class VisualAssetsController {
  constructor(
    @Inject(VisualAssetsApiService)
    private readonly visualAssetsService: VisualAssetsApiService,
  ) {}

  @Get()
  listAssets() {
    return toApiSuccess(this.visualAssetsService.listAssets());
  }

  @Get('activity')
  getActivity(@Query('limit') limit?: string) {
    const parsedLimit = limit === undefined ? 20 : Number.parseInt(limit, 10);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
      throw new BadRequestException('limit must be a positive integer.');
    }
    return toApiSuccess(this.visualAssetsService.getActivity(parsedLimit));
  }

  @Get(':assetId')
  getAsset(@Param('assetId') assetId: string) {
    return toApiSuccess(this.visualAssetsService.getAsset(assetId));
  }

  @Post('validate')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', visualAssetUploadOptions))
  validateImport(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('backlogFilename') backlogFilename?: string,
    @Body('status') status?: string,
    @Body('acceptWarnings') acceptWarnings?: string,
  ) {
    if (backlogFilename === undefined || backlogFilename.trim().length === 0) {
      throw new BadRequestException('backlogFilename is required.');
    }

    try {
      const plan = this.visualAssetsService.validateImport({
        buffer: parseUploadedFile(file),
        backlogFilename: backlogFilename.trim(),
        status: parseStatus(status),
        acceptWarnings: acceptWarnings === 'true',
      });
      return toApiSuccess(plan);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Validation failed.';
      throw new BadRequestException(message);
    }
  }

  @Post('import')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', visualAssetUploadOptions))
  importAsset(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('backlogFilename') backlogFilename?: string,
    @Body('status') status?: string,
    @Body('acceptWarnings') acceptWarnings?: string,
  ) {
    if (backlogFilename === undefined || backlogFilename.trim().length === 0) {
      throw new BadRequestException('backlogFilename is required.');
    }

    try {
      const result = this.visualAssetsService.importAsset({
        buffer: parseUploadedFile(file),
        backlogFilename: backlogFilename.trim(),
        status: parseStatus(status),
        acceptWarnings: acceptWarnings === 'true',
      });
      return toApiSuccess(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Import failed.';
      throw new BadRequestException(message);
    }
  }

  @Post(':assetId/status')
  updateStatus(@Param('assetId') assetId: string, @Body('status') status?: string) {
    try {
      return toApiSuccess(this.visualAssetsService.updateStatus(assetId, parseStatus(status)));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Status update failed.';
      throw new BadRequestException(message);
    }
  }
}
