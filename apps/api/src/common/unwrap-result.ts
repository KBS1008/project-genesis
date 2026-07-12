/**
 * @module @project-genesis/api/common/unwrap-result
 *
 * Maps application-layer Result values to HTTP exceptions.
 */

import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from '../../../../src/common/errors/ValidationError.js';
import type { Result } from '../../../../src/common/result/Result.js';

/** Throws {@link BadRequestException} when a Result failed. */
export function unwrapResult<T>(result: Result<T, ValidationError>): T {
  if (!result.ok) {
    throw new BadRequestException(result.error.message);
  }

  return result.value;
}
