/**
 * @module @project-genesis/api/dev/visual-assets.controller
 */

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { VisualAssetStatus } from '../../../../src/tools/visual-asset-manager/index.js';
import { MAX_UPLOAD_BYTES } from '../../../../src/tools/visual-asset-manager/constants.js';
import { toApiSuccess } from '../common/api-response.js';
import { DevOnlyGuard } from './dev-only.guard.js';
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
  if (file === undefined || file.buffer.length === 0) {
    throw new BadRequestException('Image file is required.');
  }
  return file.buffer;
}

/** Developer-only visual asset management endpoints. */
@Controller('api/dev/visual-assets')
@UseGuards(DevOnlyGuard)
export class VisualAssetsController {
  constructor(private readonly visualAssetsService: VisualAssetsApiService) {}

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
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_UPLOAD_BYTES } }))
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
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_UPLOAD_BYTES } }))
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
