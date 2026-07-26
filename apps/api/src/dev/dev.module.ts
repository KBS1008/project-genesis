/**
 * @module @project-genesis/api/dev/dev.module
 */

import { Module } from '@nestjs/common';
import { DevOnlyGuard } from './dev-only.guard.js';
import { VisualAssetsController } from './visual-assets.controller.js';
import { VisualAssetsApiService } from './visual-assets-api.service.js';

/** Registers developer-only HTTP endpoints. */
@Module({
  controllers: [VisualAssetsController],
  providers: [VisualAssetsApiService, DevOnlyGuard],
})
export class DevModule {}
