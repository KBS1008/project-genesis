/**
 * @module @project-genesis/api/common/api-response
 *
 * JSON envelope shared with the browser dev shell.
 */

/** Successful API payload envelope. */
export type ApiSuccessResponse<T> = {
  readonly ok: true;
  readonly data: T;
};

/** Failed API payload envelope. */
export type ApiErrorResponse = {
  readonly ok: false;
  readonly error: string;
};

/** Wraps a successful value in the shell response envelope. */
export function toApiSuccess<T>(data: T): ApiSuccessResponse<T> {
  return { ok: true, data };
}
