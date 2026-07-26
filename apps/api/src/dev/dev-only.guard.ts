/**
 * @module @project-genesis/api/dev/dev-only.guard
 */

import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

/** Blocks developer tooling when NODE_ENV is production. */
@Injectable()
export class DevOnlyGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Developer tools are disabled in production.');
    }
    return true;
  }
}
