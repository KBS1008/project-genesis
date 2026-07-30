/** SVG asset category supported by the generator. */
export type SvgAssetKind =
  | 'chart'
  | 'icon'
  | 'map'
  | 'component-library'
  | 'branding'
  | 'diagram';

/** Structured content passed to a template renderer. */
export type SvgContentModel = Record<string, unknown>;

/** Generation request contract. */
export type SvgGenerationRequest = {
  readonly assetId: string;
  readonly backlogFilename: string;
  readonly templateId: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly width: number;
  readonly height: number;
  readonly content: SvgContentModel;
  readonly status: 'in-production' | 'in-review' | 'approved';
  readonly acceptWarnings?: boolean;
};

/** Generation preview/result contract. */
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

/** Template metadata exposed to the UI. */
export type SvgTemplateDefinition = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly kind: SvgAssetKind;
  readonly defaultWidth: number;
  readonly defaultHeight: number;
  readonly requiredFields: readonly string[];
  readonly optionalFields: readonly string[];
  readonly defaultContent: SvgContentModel;
};

/** Template renderer contract. */
export type SvgTemplateRenderer = {
  readonly definition: SvgTemplateDefinition;
  render(input: {
    readonly title: string;
    readonly subtitle?: string;
    readonly width: number;
    readonly height: number;
    readonly content: SvgContentModel;
    readonly version: string;
  }): string;
};

/** Validation outcome for generated SVG. */
export type SvgValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
};
