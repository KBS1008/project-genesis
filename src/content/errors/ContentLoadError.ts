/**
 * @module @content/errors/ContentLoadError
 *
 * Errors raised during content loading and validation.
 */

import { DomainError } from '../../common/errors/DomainError.js';

/** Machine-readable code for content load failures. */
export const ContentLoadErrorCode = {
  CONTENT_LOAD: 'CONTENT_LOAD',
} as const;

/**
 * Describes a failure while loading or validating game content.
 */
export class ContentLoadError extends DomainError {
  readonly filePath: string | undefined;
  readonly contentId: string | undefined;

  /**
   * @param message - Human-readable error description.
   * @param options - Optional file path and content identifier context.
   */
  constructor(
    message: string,
    options: { filePath?: string | undefined; contentId?: string | undefined } = {},
  ) {
    super(ContentLoadErrorCode.CONTENT_LOAD, message);
    this.filePath = options.filePath;
    this.contentId = options.contentId;
    Object.freeze(this);
  }
}
