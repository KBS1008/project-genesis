/**
 * @module @project-genesis/api/main.dev
 *
 * Development NestJS entry point — includes developer-only HTTP endpoints.
 */

import { AppDevModule } from './app.dev.module.js';
import { startApi } from './api-bootstrap.js';

void startApi(AppDevModule);
