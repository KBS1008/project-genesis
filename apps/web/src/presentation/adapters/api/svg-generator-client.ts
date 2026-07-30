/** Typed client for the developer SVG generator API. */

export type SvgTemplateDefinition = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly kind: string;
  readonly defaultWidth: number;
  readonly defaultHeight: number;
  readonly requiredFields: readonly string[];
  readonly optionalFields: readonly string[];
  readonly defaultContent: Record<string, unknown>;
};

export type SvgBacklogItem = {
  readonly assetId: string;
  readonly backlogFilename: string;
  readonly status: string;
  readonly sprint: string;
  readonly category: string;
};

export type SvgGenerationRequest = {
  readonly assetId: string;
  readonly backlogFilename: string;
  readonly templateId: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly width: number;
  readonly height: number;
  readonly content: Record<string, unknown>;
  readonly status: 'in-production' | 'in-review' | 'approved';
  readonly acceptWarnings?: boolean;
};

export type SvgGenerationResult = {
  readonly assetId: string;
  readonly filename: string;
  readonly targetPath: string;
  readonly width: number;
  readonly height: number;
  readonly sha256: string;
  readonly warnings: readonly string[];
  readonly svg: string;
};

export type SvgValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly svg: string;
};

type ApiSuccessResponse<T> = { readonly ok: true; readonly data: T };
type ApiErrorResponse = { readonly ok: false; readonly error: string };

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;
  if (!response.ok || payload.ok === false) {
    throw new Error(payload.ok === false ? payload.error : 'Request failed.');
  }
  return payload.data;
}

export async function fetchSvgTemplates(): Promise<readonly SvgTemplateDefinition[]> {
  const response = await fetch('/api/dev/svg-generator/templates');
  return parseApiResponse(response);
}

export async function fetchSvgBacklog(): Promise<readonly SvgBacklogItem[]> {
  const response = await fetch('/api/dev/svg-generator/backlog');
  return parseApiResponse(response);
}

export async function suggestSvgTemplate(assetId: string): Promise<string> {
  const response = await fetch(`/api/dev/svg-generator/suggest/${assetId}`);
  const data = await parseApiResponse<{ readonly templateId: string }>(response);
  return data.templateId;
}

export async function previewSvg(
  request: SvgGenerationRequest,
): Promise<SvgGenerationResult> {
  const response = await fetch('/api/dev/svg-generator/preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return parseApiResponse(response);
}

export async function validateSvgRequest(
  request: SvgGenerationRequest,
): Promise<SvgValidationResult> {
  const response = await fetch('/api/dev/svg-generator/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return parseApiResponse(response);
}

export async function generateSvg(request: SvgGenerationRequest): Promise<{
  readonly generation: SvgGenerationResult;
  readonly importResult: unknown;
}> {
  const response = await fetch('/api/dev/svg-generator/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return parseApiResponse(response);
}

export async function fetchSvgGeneratorActivity(): Promise<readonly unknown[]> {
  const response = await fetch('/api/dev/svg-generator/activity');
  return parseApiResponse(response);
}
