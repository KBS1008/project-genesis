/**
 * @module @content/building/BuildingTypeValidator
 *
 * Validates parsed building type content against schema rules.
 *
 * @see docs/decisions/DD-003-global-identifiers.md
 * @see docs/schemas/Building.schema.md
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import {
  BuildingCategory,
  BuildingTypeDefinition,
  type BuildingSize,
  type BuildingTypeDefinitionProps,
} from './BuildingTypeDefinition.js';

const GLOBAL_ID_PATTERN = /^[a-z0-9_]+$/;

const BUILDING_CATEGORIES = new Set<string>(Object.values(BuildingCategory));

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
      new ContentLoadError(`Building type field "${field}" must be a non-empty string.`, {
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
      new ContentLoadError(`Building type field "${field}" must be a number.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  if (options.min !== undefined && value < options.min) {
    return Result.fail(
      new ContentLoadError(`Building type field "${field}" must be at least ${options.min}.`, {
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
      new ContentLoadError(`Building type field "${field}" must be a boolean.`, {
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
      new ContentLoadError(`Building type field "${field}" must be an array of strings.`, {
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
      new ContentLoadError(`Building type field "${field}" contains an invalid value.`, {
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
        new ContentLoadError(
          `Building type field "${field}" contains invalid id "${entry}".`,
          { ...contentContext(record, filePath) },
        ),
      );
    }
  }

  return arrayResult;
}

function readSize(
  record: Record<string, unknown>,
  filePath: string | undefined,
): Result<BuildingSize, ContentLoadError> {
  const value = record['size'];

  if (!isRecord(value)) {
    return Result.fail(
      new ContentLoadError('Building type field "size" must be an object.', {
        ...contentContext(record, filePath),
      }),
    );
  }

  const widthResult = readNumber(value, 'width', filePath, { min: 1 });

  if (!widthResult.ok) {
    return Result.fail(widthResult.error);
  }

  const heightResult = readNumber(value, 'height', filePath, { min: 1 });

  if (!heightResult.ok) {
    return Result.fail(heightResult.error);
  }

  return Result.ok({
    width: widthResult.value,
    height: heightResult.value,
  });
}

/**
 * Validates raw parsed content and creates a {@link BuildingTypeDefinition}.
 *
 * @param raw - Parsed YAML or JSON object.
 * @param filePath - Optional source file path for error reporting.
 */
export function validateBuildingTypeDefinition(
  raw: unknown,
  filePath?: string,
): Result<BuildingTypeDefinition, ContentLoadError> {
  if (!isRecord(raw)) {
    return Result.fail(
      new ContentLoadError('Building type content must be an object.', { filePath }),
    );
  }

  const idResult = readString(raw, 'id', filePath);

  if (!idResult.ok) {
    return Result.fail(idResult.error);
  }

  if (!GLOBAL_ID_PATTERN.test(idResult.value)) {
    return Result.fail(
      new ContentLoadError(
        `Building type id "${idResult.value}" must use lowercase letters, numbers and underscores only.`,
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

  const categoryResult = readEnumValue<BuildingCategory>(
    raw,
    'category',
    BUILDING_CATEGORIES,
    filePath,
  );

  if (!categoryResult.ok) {
    return Result.fail(categoryResult.error);
  }

  const sizeResult = readSize(raw, filePath);

  if (!sizeResult.ok) {
    return Result.fail(sizeResult.error);
  }

  const energyUsageResult = readNumber(raw, 'energyUsage', filePath, { min: 0 });

  if (!energyUsageResult.ok) {
    return Result.fail(energyUsageResult.error);
  }

  let energyGenerationValue = 0;

  if (raw['energyGeneration'] !== undefined) {
    const energyGenerationResult = readNumber(raw, 'energyGeneration', filePath, { min: 0 });

    if (!energyGenerationResult.ok) {
      return Result.fail(energyGenerationResult.error);
    }

    energyGenerationValue = energyGenerationResult.value;
  }

  const maintenanceCostResult = readNumber(raw, 'maintenanceCost', filePath, { min: 0 });

  if (!maintenanceCostResult.ok) {
    return Result.fail(maintenanceCostResult.error);
  }

  const constructionCostResult = readNumber(raw, 'constructionCost', filePath, { min: 0 });

  if (!constructionCostResult.ok) {
    return Result.fail(constructionCostResult.error);
  }

  const constructionTimeResult = readNumber(raw, 'constructionTime', filePath, { min: 0 });

  if (!constructionTimeResult.ok) {
    return Result.fail(constructionTimeResult.error);
  }

  const allowedRecipesResult = readGlobalIdArray(raw, 'allowedRecipes', filePath);

  if (!allowedRecipesResult.ok) {
    return Result.fail(allowedRecipesResult.error);
  }

  const maxProductionLinesResult = readNumber(raw, 'maxProductionLines', filePath, { min: 1 });

  if (!maxProductionLinesResult.ok) {
    return Result.fail(maxProductionLinesResult.error);
  }

  const requiredResearchResult = readGlobalIdArray(raw, 'requiredResearch', filePath);

  if (!requiredResearchResult.ok) {
    return Result.fail(requiredResearchResult.error);
  }

  const requiredMilestonesResult = readGlobalIdArray(raw, 'requiredMilestones', filePath);

  if (!requiredMilestonesResult.ok) {
    return Result.fail(requiredMilestonesResult.error);
  }

  const enabledResult = readBoolean(raw, 'enabled', filePath);

  if (!enabledResult.ok) {
    return Result.fail(enabledResult.error);
  }

  const versionResult = readNumber(raw, 'version', filePath, { min: 1 });

  if (!versionResult.ok) {
    return Result.fail(versionResult.error);
  }

  const props: BuildingTypeDefinitionProps = {
    id: idResult.value,
    name: nameResult.value,
    description: descriptionResult.value,
    category: categoryResult.value,
    size: sizeResult.value,
    energyUsage: energyUsageResult.value,
    energyGeneration: energyGenerationValue,
    maintenanceCost: maintenanceCostResult.value,
    constructionCost: constructionCostResult.value,
    constructionTime: constructionTimeResult.value,
    allowedRecipes: allowedRecipesResult.value,
    maxProductionLines: maxProductionLinesResult.value,
    requiredResearch: requiredResearchResult.value,
    requiredMilestones: requiredMilestonesResult.value,
    enabled: enabledResult.value,
    version: versionResult.value,
  };

  return Result.ok(new BuildingTypeDefinition(props));
}
