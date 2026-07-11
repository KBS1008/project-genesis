/**
 * @module @content/recipe/RecipeValidator
 *
 * Validates parsed recipe content against schema rules and cross-references.
 *
 * @see docs/decisions/DD-003-global-identifiers.md
 * @see docs/schemas/Recipe.Schema.md
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import {
  RecipeCategory,
  RecipeDefinition,
  type RecipeDefinitionProps,
  type RecipeResourceAmount,
} from './RecipeDefinition.js';
import type { RecipeReferenceContext } from './RecipeReferenceContext.js';

const GLOBAL_ID_PATTERN = /^[a-z0-9_]+$/;

const RECIPE_CATEGORIES = new Set<string>(Object.values(RecipeCategory));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function contentContext(
  record: Record<string, unknown>,
  filePath: string | undefined,
): { filePath: string | undefined; contentId: string | undefined } {
  return {
    filePath,
    contentId: typeof record['id'] === 'string' ? record['id'] : undefined,
  };
}

function readString(
  record: Record<string, unknown>,
  field: string,
  filePath: string | undefined,
): Result<string, ContentLoadError> {
  const value = record[field];

  if (typeof value !== 'string' || value.length === 0) {
    return Result.fail(
      new ContentLoadError(`Recipe field "${field}" must be a non-empty string.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value);
}

function readNumber(
  record: Record<string, unknown>,
  field: string,
  filePath: string | undefined,
  options: { min?: number } = {},
): Result<number, ContentLoadError> {
  const value = record[field];

  if (typeof value !== 'number' || Number.isNaN(value)) {
    return Result.fail(
      new ContentLoadError(`Recipe field "${field}" must be a number.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  if (options.min !== undefined && value < options.min) {
    return Result.fail(
      new ContentLoadError(`Recipe field "${field}" must be at least ${options.min}.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value);
}

function readBoolean(
  record: Record<string, unknown>,
  field: string,
  filePath: string | undefined,
): Result<boolean, ContentLoadError> {
  const value = record[field];

  if (typeof value !== 'boolean') {
    return Result.fail(
      new ContentLoadError(`Recipe field "${field}" must be a boolean.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value);
}

function readStringArray(
  record: Record<string, unknown>,
  field: string,
  filePath: string | undefined,
): Result<readonly string[], ContentLoadError> {
  const value = record[field];

  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    return Result.fail(
      new ContentLoadError(`Recipe field "${field}" must be an array of strings.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value);
}

function readEnumValue<T extends string>(
  record: Record<string, unknown>,
  field: string,
  allowed: Set<string>,
  filePath: string | undefined,
): Result<T, ContentLoadError> {
  const value = record[field];

  if (typeof value !== 'string' || !allowed.has(value)) {
    return Result.fail(
      new ContentLoadError(`Recipe field "${field}" contains an invalid value.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value as T);
}

function readGlobalIdArray(
  record: Record<string, unknown>,
  field: string,
  filePath: string | undefined,
): Result<readonly string[], ContentLoadError> {
  const arrayResult = readStringArray(record, field, filePath);

  if (!arrayResult.ok) {
    return arrayResult;
  }

  for (const entry of arrayResult.value) {
    if (!GLOBAL_ID_PATTERN.test(entry)) {
      return Result.fail(
        new ContentLoadError(`Recipe field "${field}" contains invalid id "${entry}".`, {
          ...contentContext(record, filePath),
        }),
      );
    }
  }

  return arrayResult;
}

function readResourceAmountArray(
  record: Record<string, unknown>,
  field: string,
  filePath: string | undefined,
): Result<readonly RecipeResourceAmount[], ContentLoadError> {
  const value = record[field];

  if (!Array.isArray(value) || value.length === 0) {
    return Result.fail(
      new ContentLoadError(`Recipe field "${field}" must be a non-empty array.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  const entries: RecipeResourceAmount[] = [];

  for (const entry of value) {
    if (!isRecord(entry)) {
      return Result.fail(
        new ContentLoadError(`Recipe field "${field}" must contain objects.`, {
          ...contentContext(record, filePath),
        }),
      );
    }

    const resourceResult = readString(entry, 'resource', filePath);

    if (!resourceResult.ok) {
      return Result.fail(resourceResult.error);
    }

    if (!GLOBAL_ID_PATTERN.test(resourceResult.value)) {
      return Result.fail(
        new ContentLoadError(
          `Recipe field "${field}" contains invalid resource id "${resourceResult.value}".`,
          { ...contentContext(record, filePath) },
        ),
      );
    }

    const amountResult = readNumber(entry, 'amount', filePath, { min: 1 });

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    entries.push({
      resource: resourceResult.value,
      amount: amountResult.value,
    });
  }

  return Result.ok(entries);
}

function validateReferences(
  props: RecipeDefinitionProps,
  filePath: string | undefined,
  references: RecipeReferenceContext,
): Result<void, ContentLoadError> {
  for (const buildingTypeId of props.buildingTypes) {
    if (!references.buildingTypes.has(buildingTypeId)) {
      return Result.fail(
        new ContentLoadError(
          `Recipe "${props.id}" references unknown building type "${buildingTypeId}".`,
          { filePath, contentId: props.id },
        ),
      );
    }
  }

  for (const entry of [...props.inputs, ...props.outputs]) {
    if (!references.resourceTypes.has(entry.resource)) {
      return Result.fail(
        new ContentLoadError(
          `Recipe "${props.id}" references unknown resource "${entry.resource}".`,
          { filePath, contentId: props.id },
        ),
      );
    }
  }

  return Result.ok(undefined);
}

/**
 * Validates raw parsed content and creates a {@link RecipeDefinition}.
 *
 * @param raw - Parsed YAML or JSON object.
 * @param filePath - Optional source file path for error reporting.
 * @param references - Optional registries for cross-reference validation.
 */
export function validateRecipeDefinition(
  raw: unknown,
  filePath?: string,
  references?: RecipeReferenceContext,
): Result<RecipeDefinition, ContentLoadError> {
  if (!isRecord(raw)) {
    return Result.fail(new ContentLoadError('Recipe content must be an object.', { filePath }));
  }

  const idResult = readString(raw, 'id', filePath);

  if (!idResult.ok) {
    return Result.fail(idResult.error);
  }

  if (!GLOBAL_ID_PATTERN.test(idResult.value)) {
    return Result.fail(
      new ContentLoadError(
        `Recipe id "${idResult.value}" must use lowercase letters, numbers and underscores only.`,
        { filePath, contentId: idResult.value },
      ),
    );
  }

  const nameResult = readString(raw, 'name', filePath);

  if (!nameResult.ok) {
    return Result.fail(nameResult.error);
  }

  const descriptionResult = readString(raw, 'description', filePath);

  if (!descriptionResult.ok) {
    return Result.fail(descriptionResult.error);
  }

  const versionResult = readNumber(raw, 'version', filePath, { min: 1 });

  if (!versionResult.ok) {
    return Result.fail(versionResult.error);
  }

  const categoryResult = readEnumValue<RecipeCategory>(
    raw,
    'category',
    RECIPE_CATEGORIES,
    filePath,
  );

  if (!categoryResult.ok) {
    return Result.fail(categoryResult.error);
  }

  const buildingTypesResult = readGlobalIdArray(raw, 'buildingTypes', filePath);

  if (!buildingTypesResult.ok) {
    return Result.fail(buildingTypesResult.error);
  }

  if (buildingTypesResult.value.length === 0) {
    return Result.fail(
      new ContentLoadError('Recipe field "buildingTypes" must contain at least one entry.', {
        ...contentContext(raw, filePath),
      }),
    );
  }

  const inputsResult = readResourceAmountArray(raw, 'inputs', filePath);

  if (!inputsResult.ok) {
    return Result.fail(inputsResult.error);
  }

  const outputsResult = readResourceAmountArray(raw, 'outputs', filePath);

  if (!outputsResult.ok) {
    return Result.fail(outputsResult.error);
  }

  const durationResult = readNumber(raw, 'duration', filePath, { min: 1 });

  if (!durationResult.ok) {
    return Result.fail(durationResult.error);
  }

  const energyResult = readNumber(raw, 'energy', filePath, { min: 0 });

  if (!energyResult.ok) {
    return Result.fail(energyResult.error);
  }

  const workersResult = readNumber(raw, 'workers', filePath, { min: 0 });

  if (!workersResult.ok) {
    return Result.fail(workersResult.error);
  }

  const requiredResearchResult = readGlobalIdArray(raw, 'requiredResearch', filePath);

  if (!requiredResearchResult.ok) {
    return Result.fail(requiredResearchResult.error);
  }

  const requiredBuildingsResult = readGlobalIdArray(raw, 'requiredBuildings', filePath);

  if (!requiredBuildingsResult.ok) {
    return Result.fail(requiredBuildingsResult.error);
  }

  const requiredMilestonesResult = readGlobalIdArray(raw, 'requiredMilestones', filePath);

  if (!requiredMilestonesResult.ok) {
    return Result.fail(requiredMilestonesResult.error);
  }

  const requiredResourcesResult = readGlobalIdArray(raw, 'requiredResources', filePath);

  if (!requiredResourcesResult.ok) {
    return Result.fail(requiredResourcesResult.error);
  }

  const maintenanceCostResult = readNumber(raw, 'maintenanceCost', filePath, { min: 0 });

  if (!maintenanceCostResult.ok) {
    return Result.fail(maintenanceCostResult.error);
  }

  const productionCostResult = readNumber(raw, 'productionCost', filePath, { min: 0 });

  if (!productionCostResult.ok) {
    return Result.fail(productionCostResult.error);
  }

  const experienceResult = readNumber(raw, 'experience', filePath, { min: 0 });

  if (!experienceResult.ok) {
    return Result.fail(experienceResult.error);
  }

  const tagsResult = readStringArray(raw, 'tags', filePath);

  if (!tagsResult.ok) {
    return Result.fail(tagsResult.error);
  }

  const enabledResult = readBoolean(raw, 'enabled', filePath);

  if (!enabledResult.ok) {
    return Result.fail(enabledResult.error);
  }

  const props: RecipeDefinitionProps = {
    id: idResult.value,
    name: nameResult.value,
    description: descriptionResult.value,
    version: versionResult.value,
    category: categoryResult.value,
    buildingTypes: buildingTypesResult.value,
    inputs: inputsResult.value,
    outputs: outputsResult.value,
    duration: durationResult.value,
    energy: energyResult.value,
    workers: workersResult.value,
    requiredResearch: requiredResearchResult.value,
    requiredBuildings: requiredBuildingsResult.value,
    requiredMilestones: requiredMilestonesResult.value,
    requiredResources: requiredResourcesResult.value,
    maintenanceCost: maintenanceCostResult.value,
    productionCost: productionCostResult.value,
    experience: experienceResult.value,
    tags: tagsResult.value,
    enabled: enabledResult.value,
  };

  if (references !== undefined) {
    const referenceResult = validateReferences(props, filePath, references);

    if (!referenceResult.ok) {
      return Result.fail(referenceResult.error);
    }
  }

  return Result.ok(new RecipeDefinition(props));
}
