/**
 * @module @content/logistics/TransportRouteValidator
 *
 * Validates parsed transport route content against schema rules.
 */

import { Result } from '../../common/result/Result.js';
import { BuildingCategory } from '../building/BuildingTypeDefinition.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import {
  TransportRouteDefinition,
  type TransportRouteDefinitionProps,
} from './TransportRouteDefinition.js';

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
      new ContentLoadError(`Transport route field "${field}" must be a non-empty string.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value);
}

function readOptionalString(
  record: Record<string, unknown>,
  field: string,
  filePath: string | undefined,
): Result<string | null, ContentLoadError> {
  if (record[field] === undefined) {
    return Result.ok(null);
  }

  const valueResult = readString(record, field, filePath);

  if (!valueResult.ok) {
    return valueResult;
  }

  return Result.ok(valueResult.value);
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
      new ContentLoadError(`Transport route field "${field}" must be a number.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  if (options.min !== undefined && value < options.min) {
    return Result.fail(
      new ContentLoadError(`Transport route field "${field}" must be at least ${options.min}.`, {
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
      new ContentLoadError(`Transport route field "${field}" must be a boolean.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value);
}

function readOptionalCategory(
  record: Record<string, unknown>,
  field: string,
  filePath: string | undefined,
): Result<BuildingCategory | null, ContentLoadError> {
  if (record[field] === undefined) {
    return Result.ok(null);
  }

  const value = record[field];

  if (typeof value !== 'string' || !BUILDING_CATEGORIES.has(value)) {
    return Result.fail(
      new ContentLoadError(`Transport route field "${field}" contains an invalid value.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value as BuildingCategory);
}

function readOptionalGlobalId(
  record: Record<string, unknown>,
  field: string,
  filePath: string | undefined,
): Result<string | null, ContentLoadError> {
  const valueResult = readOptionalString(record, field, filePath);

  if (!valueResult.ok) {
    return valueResult;
  }

  if (valueResult.value !== null && !GLOBAL_ID_PATTERN.test(valueResult.value)) {
    return Result.fail(
      new ContentLoadError(
        `Transport route field "${field}" contains invalid id "${valueResult.value}".`,
        { ...contentContext(record, filePath) },
      ),
    );
  }

  return valueResult;
}

/**
 * Validates raw parsed content and creates a {@link TransportRouteDefinition}.
 */
export function validateTransportRouteDefinition(
  raw: unknown,
  filePath?: string,
): Result<TransportRouteDefinition, ContentLoadError> {
  if (!isRecord(raw)) {
    return Result.fail(
      new ContentLoadError('Transport route content must be an object.', { filePath }),
    );
  }

  const idResult = readString(raw, 'id', filePath);

  if (!idResult.ok) {
    return Result.fail(idResult.error);
  }

  if (!GLOBAL_ID_PATTERN.test(idResult.value)) {
    return Result.fail(
      new ContentLoadError(
        `Transport route id "${idResult.value}" must use lowercase letters, numbers and underscores only.`,
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

  const sourceCategoryResult = readOptionalCategory(raw, 'sourceCategory', filePath);

  if (!sourceCategoryResult.ok) {
    return Result.fail(sourceCategoryResult.error);
  }

  const destinationCategoryResult = readOptionalCategory(raw, 'destinationCategory', filePath);

  if (!destinationCategoryResult.ok) {
    return Result.fail(destinationCategoryResult.error);
  }

  const sourceBuildingTypeIdResult = readOptionalGlobalId(raw, 'sourceBuildingTypeId', filePath);

  if (!sourceBuildingTypeIdResult.ok) {
    return Result.fail(sourceBuildingTypeIdResult.error);
  }

  const destinationBuildingTypeIdResult = readOptionalGlobalId(
    raw,
    'destinationBuildingTypeId',
    filePath,
  );

  if (!destinationBuildingTypeIdResult.ok) {
    return Result.fail(destinationBuildingTypeIdResult.error);
  }

  const hasCategoryPair =
    sourceCategoryResult.value !== null && destinationCategoryResult.value !== null;
  const hasBuildingTypePair =
    sourceBuildingTypeIdResult.value !== null && destinationBuildingTypeIdResult.value !== null;

  if (!hasCategoryPair && !hasBuildingTypePair) {
    return Result.fail(
      new ContentLoadError(
        'Transport route must define sourceCategory/destinationCategory or sourceBuildingTypeId/destinationBuildingTypeId.',
        { filePath, contentId: idResult.value },
      ),
    );
  }

  const durationTicksResult = readNumber(raw, 'durationTicks', filePath, { min: 1 });

  if (!durationTicksResult.ok) {
    return Result.fail(durationTicksResult.error);
  }

  const throughputCapacityResult = readNumber(raw, 'throughputCapacity', filePath, { min: 1 });

  if (!throughputCapacityResult.ok) {
    return Result.fail(throughputCapacityResult.error);
  }

  const enabledResult = readBoolean(raw, 'enabled', filePath);

  if (!enabledResult.ok) {
    return Result.fail(enabledResult.error);
  }

  const versionResult = readNumber(raw, 'version', filePath, { min: 1 });

  if (!versionResult.ok) {
    return Result.fail(versionResult.error);
  }

  const props: TransportRouteDefinitionProps = {
    id: idResult.value,
    name: nameResult.value,
    description: descriptionResult.value,
    sourceCategory: sourceCategoryResult.value,
    destinationCategory: destinationCategoryResult.value,
    sourceBuildingTypeId: sourceBuildingTypeIdResult.value,
    destinationBuildingTypeId: destinationBuildingTypeIdResult.value,
    durationTicks: durationTicksResult.value,
    throughputCapacity: throughputCapacityResult.value,
    enabled: enabledResult.value,
    version: versionResult.value,
  };

  return Result.ok(new TransportRouteDefinition(props));
}
