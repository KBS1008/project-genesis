/** Typed client for the developer visual asset manager API. */

export type VisualAssetStatus =
  | 'planned'
  | 'in-production'
  | 'in-review'
  | 'approved'
  | 'integrated';

export type VisualAssetBacklogItem = {
  readonly lineIndex: number;
  readonly status: VisualAssetStatus;
  readonly backlogFilename: string;
  readonly assetId: string;
  readonly sprint: string;
  readonly category: string;
};

export type VisualAssetImportPlan = {
  readonly assetId: string;
  readonly backlogFilename: string;
  readonly canonicalFilename: string;
  readonly revision: number;
  readonly targetDirectory: string;
  readonly targetRelativePath: string;
  readonly status: VisualAssetStatus;
  readonly kind: string;
  readonly sha256: string;
  readonly width: number;
  readonly height: number;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
};

export type VisualAssetActivity = {
  readonly date: string;
  readonly assetId: string;
  readonly operation: string;
  readonly assetFilename: string;
  readonly status: string;
  readonly destination: string;
  readonly revision: number;
  readonly sha256: string;
};

type ApiSuccessResponse<T> = {
  readonly ok: true;
  readonly data: T;
};

type ApiErrorResponse = {
  readonly ok: false;
  readonly error: string;
};

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;
  if (!response.ok || payload.ok === false) {
    throw new Error(payload.ok === false ? payload.error : 'Request failed.');
  }
  return payload.data;
}

/** Loads all backlog assets. */
export async function fetchVisualAssets(): Promise<readonly VisualAssetBacklogItem[]> {
  const response = await fetch('/api/dev/visual-assets');
  return parseApiResponse(response);
}

/** Loads recent import activity. */
export async function fetchVisualAssetActivity(
  limit = 20,
): Promise<readonly VisualAssetActivity[]> {
  const response = await fetch(`/api/dev/visual-assets/activity?limit=${limit}`);
  return parseApiResponse(response);
}

/** Validates an upload without writing files. */
export async function validateVisualAssetUpload(input: {
  readonly file: File;
  readonly backlogFilename: string;
  readonly status: VisualAssetStatus;
  readonly acceptWarnings?: boolean;
}): Promise<VisualAssetImportPlan> {
  const formData = new FormData();
  formData.set('file', input.file);
  formData.set('backlogFilename', input.backlogFilename);
  formData.set('status', input.status);
  if (input.acceptWarnings === true) {
    formData.set('acceptWarnings', 'true');
  }

  const response = await fetch('/api/dev/visual-assets/validate', {
    method: 'POST',
    body: formData,
  });
  return parseApiResponse(response);
}

/** Imports an asset and updates repository documents. */
export async function importVisualAsset(input: {
  readonly file: File;
  readonly backlogFilename: string;
  readonly status: VisualAssetStatus;
  readonly acceptWarnings?: boolean;
}): Promise<{ readonly plan: VisualAssetImportPlan; readonly activity: VisualAssetActivity }> {
  const formData = new FormData();
  formData.set('file', input.file);
  formData.set('backlogFilename', input.backlogFilename);
  formData.set('status', input.status);
  if (input.acceptWarnings === true) {
    formData.set('acceptWarnings', 'true');
  }

  const response = await fetch('/api/dev/visual-assets/import', {
    method: 'POST',
    body: formData,
  });
  return parseApiResponse(response);
}

/** Updates backlog/catalog status without uploading a file. */
export async function updateVisualAssetStatus(
  assetId: string,
  status: VisualAssetStatus,
): Promise<VisualAssetBacklogItem> {
  const response = await fetch(`/api/dev/visual-assets/${assetId}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return parseApiResponse(response);
}

export const STATUS_OPTIONS: readonly { readonly value: VisualAssetStatus; readonly label: string }[] =
  [
    { value: 'planned', label: 'Planned' },
    { value: 'in-production', label: 'In Production' },
    { value: 'in-review', label: 'In Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'integrated', label: 'Integrated' },
  ];

export const STATUS_LABEL: Record<VisualAssetStatus, string> = {
  planned: 'Planned',
  'in-production': 'In Production',
  'in-review': 'In Review',
  approved: 'Approved',
  integrated: 'Integrated',
};
