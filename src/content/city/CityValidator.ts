/**
 * @module @content/city/CityValidator
 *
 * Validates parsed city content against schema rules.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import { CityCategory, CityDefinition, type CityDefinitionProps } from './CityDefinition.js';

const GLOBAL_ID_PATTERN = /^[a-z0-9_]+$/;
const CITY_CATEGORIES = new Set<string>(Object.values(CityCategory));

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
      new ContentLoadError(`City field "${field}" must be a non-empty string.`, {
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
      new ContentLoadError(`City field "${field}" must be a number.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  if (options.min !== undefined && value < options.min) {
    return Result.fail(
      new ContentLoadError(`City field "${field}" must be at least ${options.min}.`, {
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
      new ContentLoadError(`City field "${field}" must be a boolean.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value);
}

/**
 * Validates a parsed city definition object.
 */
export function validateCityDefinition(
  raw: unknown,
  filePath?: string,
): Result<CityDefinition, ContentLoadError> {
  if (!isRecord(raw)) {
    return Result.fail(
      new ContentLoadError('City definition must be a YAML object.', { filePath }),
    );
  }

  const idResult = readString(raw, 'id', filePath);

  if (!idResult.ok) {
    return Result.fail(idResult.error);
  }

  if (!GLOBAL_ID_PATTERN.test(idResult.value)) {
    return Result.fail(
      new ContentLoadError(
        `City id "${idResult.value}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
        { ...contentContext(raw, filePath) },
      ),
    );
  }

  const nameResult = readString(raw, 'name', filePath);

  if (!nameResult.ok) {
    return Result.fail(nameResult.error);
  }

  const regionId = raw['regionId'];

  if (typeof regionId !== 'string' || regionId.length === 0) {
    return Result.fail(
      new ContentLoadError('City field "regionId" must be a non-empty string.', {
        ...contentContext(raw, filePath),
      }),
    );
  }

  if (!GLOBAL_ID_PATTERN.test(regionId)) {
    return Result.fail(
      new ContentLoadError(
        `City field "regionId" value "${regionId}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
        { ...contentContext(raw, filePath) },
      ),
    );
  }

  const category = raw['category'];

  if (typeof category !== 'string' || !CITY_CATEGORIES.has(category)) {
    return Result.fail(
      new ContentLoadError(
        `City field "category" must be one of: ${[...CITY_CATEGORIES].join(', ')}.`,
        { ...contentContext(raw, filePath) },
      ),
    );
  }

  const enabledResult = readBoolean(raw, 'enabled', filePath);

  if (!enabledResult.ok) {
    return Result.fail(enabledResult.error);
  }

  const versionResult = readNumber(raw, 'version', filePath, { min: 1 });

  if (!versionResult.ok) {
    return Result.fail(versionResult.error);
  }

  const props: CityDefinitionProps = {
    id: idResult.value,
    name: nameResult.value,
    regionId,
    category: category as CityDefinitionProps['category'],
    enabled: enabledResult.value,
    version: versionResult.value,
  };

  return Result.ok(new CityDefinition(props));
}
