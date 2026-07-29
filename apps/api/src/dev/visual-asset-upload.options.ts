/**
 * @module @project-genesis/api/dev/visual-asset-upload.options
 */

import { memoryStorage } from 'multer';
import { MAX_UPLOAD_BYTES } from '../../../../src/tools/visual-asset-manager/constants.js';

/** Multer options for in-memory visual asset uploads. */
export const visualAssetUploadOptions = {
  limits: { fileSize: MAX_UPLOAD_BYTES },
  storage: memoryStorage(),
};
