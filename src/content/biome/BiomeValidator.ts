/**
 * @module @content/biome/BiomeValidator
 *
 * Validates parsed biome content against schema rules.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import { BiomeDefinition, type BiomeDefinitionProps } from './BiomeDefinition.js';

const GLOBAL_ID_PATTERN = /^[a-z0-9_]+$/;

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
      new ContentLoadError(`Biome field "${field}" must be a non-empty string.`, {
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
      new ContentLoadError(`Biome field "${field}" must be a number.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  if (options.min !== undefined && value < options.min) {
    return Result.fail(
      new ContentLoadError(`Biome field "${field}" must be at least ${options.min}.`, {
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
      new ContentLoadError(`Biome field "${field}" must be a boolean.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value);
}

/**
 * Validates a parsed biome definition object.
 */
export function validateBiomeDefinition(
  raw: unknown,
  filePath?: string,
): Result<BiomeDefinition, ContentLoadError> {
  if (!isRecord(raw)) {
    return Result.fail(
      new ContentLoadError('Biome definition must be a YAML object.', { filePath }),
    );
  }

  const idResult = readString(raw, 'id', filePath);

  if (!idResult.ok) {
    return Result.fail(idResult.error);
  }

  if (!GLOBAL_ID_PATTERN.test(idResult.value)) {
    return Result.fail(
      new ContentLoadError(
        `Biome id "${idResult.value}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
        { ...contentContext(raw, filePath) },
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

  const categoryResult = readString(raw, 'category', filePath);

  if (!categoryResult.ok) {
    return Result.fail(categoryResult.error);
  }

  const constructionCostModifierResult = readNumber(raw, 'constructionCostModifier', filePath, {
    min: 0.01,
  });

  if (!constructionCostModifierResult.ok) {
    return Result.fail(constructionCostModifierResult.error);
  }

  const transportDurationModifierResult = readNumber(raw, 'transportDurationModifier', filePath, {
    min: 0.01,
  });

  if (!transportDurationModifierResult.ok) {
    return Result.fail(transportDurationModifierResult.error);
  }

  const enabledResult = readBoolean(raw, 'enabled', filePath);

  if (!enabledResult.ok) {
    return Result.fail(enabledResult.error);
  }

  const versionResult = readNumber(raw, 'version', filePath, { min: 1 });

  if (!versionResult.ok) {
    return Result.fail(versionResult.error);
  }

  const props: BiomeDefinitionProps = {
    id: idResult.value,
    name: nameResult.value,
    description: descriptionResult.value,
    category: categoryResult.value,
    constructionCostModifier: constructionCostModifierResult.value,
    transportDurationModifier: transportDurationModifierResult.value,
    enabled: enabledResult.value,
    version: versionResult.value,
  };

  return Result.ok(new BiomeDefinition(props));
}
