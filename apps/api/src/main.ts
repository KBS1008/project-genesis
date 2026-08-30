/**
 * @module @project-genesis/api/main
 *
 * Production NestJS entry point — gameplay and dashboard only.
 */

import { AppModule } from './app.module.js';
import { startApi } from './api-bootstrap.js';

void startApi(AppModule);
