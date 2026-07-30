/**
 * @module @project-genesis/api/dev/dev.module
 */

import { Module } from '@nestjs/common';
import { DevOnlyGuard } from './dev-only.guard.js';
import { SvgGeneratorApiService } from './svg-generator-api.service.js';
import { SvgGeneratorController } from './svg-generator.controller.js';
import { VisualAssetsController } from './visual-assets.controller.js';
import { VisualAssetsApiService } from './visual-assets-api.service.js';

/** Registers developer-only HTTP endpoints. */
@Module({
  controllers: [VisualAssetsController, SvgGeneratorController],
  providers: [VisualAssetsApiService, SvgGeneratorApiService, DevOnlyGuard],
})
export class DevModule {}
