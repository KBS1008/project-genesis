/**
 * @module @project-genesis/api/app.controller
 *
 * Root routes for API discovery and browser redirects.
 */

import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

/** Handles non-API root requests such as browser redirects. */
@Controller()
export class AppController {
  /** Redirects browsers to the Next.js frontend. */
  @Get()
  redirectToWebApp(@Res() response: Response): void {
    const webOrigin = process.env['WEB_ORIGIN'] ?? 'http://127.0.0.1:3000';
    response.redirect(302, webOrigin);
  }

  /** Lightweight health probe for the API process. */
  @Get('health')
  health() {
    return {
      ok: true,
      service: 'project-genesis-api',
      webOrigin: process.env['WEB_ORIGIN'] ?? 'http://127.0.0.1:3000',
    };
  }
}
