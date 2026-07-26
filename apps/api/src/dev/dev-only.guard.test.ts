import { ForbiddenException } from '@nestjs/common';
import { describe, expect, it, afterEach } from 'vitest';
import { DevOnlyGuard } from './dev-only.guard.js';

describe('DevOnlyGuard', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('allows access outside production', () => {
    process.env.NODE_ENV = 'development';
    const guard = new DevOnlyGuard();
    expect(guard.canActivate({} as never)).toBe(true);
  });

  it('rejects access in production', () => {
    process.env.NODE_ENV = 'production';
    const guard = new DevOnlyGuard();
    expect(() => guard.canActivate({} as never)).toThrow(ForbiddenException);
  });
});
