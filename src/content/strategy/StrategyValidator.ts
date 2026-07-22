/**
 * @module @content/strategy/StrategyValidator
 *
 * Validates parsed strategy content against schema rules.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import {
  StrategyDefinition,
  type StrategyDefinitionProps,
  type StrategyWeights,
} from './StrategyDefinition.js';

const GLOBAL_ID_PATTERN = /^[a-z0-9_]+$/;
const WEIGHT_FIELDS = [
  'expansionWeight',
  'productionWeight',
  'tradingWeight',
  'researchWeight',
  'riskTolerance',
  'liquidityPreference',
] as const;

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
      new ContentLoadError(`Strategy field "${field}" must be a non-empty string.`, {
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
  options: { min?: number; max?: number } = {},
): Result<number, ContentLoadError> {
  const value = record[field];

  if (typeof value !== 'number' || Number.isNaN(value)) {
    return Result.fail(
      new ContentLoadError(`Strategy field "${field}" must be a number.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  if (options.min !== undefined && value < options.min) {
    return Result.fail(
      new ContentLoadError(`Strategy field "${field}" must be at least ${options.min}.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  if (options.max !== undefined && value > options.max) {
    return Result.fail(
      new ContentLoadError(`Strategy field "${field}" must be at most ${options.max}.`, {
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
      new ContentLoadError(`Strategy field "${field}" must be a boolean.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value);
}

function readWeights(
  record: Record<string, unknown>,
  filePath: string | undefined,
): Result<StrategyWeights, ContentLoadError> {
  const weightsRaw = record['weights'];

  if (!isRecord(weightsRaw)) {
    return Result.fail(
      new ContentLoadError('Strategy field "weights" must be an object.', {
        ...contentContext(record, filePath),
      }),
    );
  }

  const weights: Record<(typeof WEIGHT_FIELDS)[number], number> = {} as Record<
    (typeof WEIGHT_FIELDS)[number],
    number
  >;

  for (const field of WEIGHT_FIELDS) {
    const weightResult = readNumber(weightsRaw, field, filePath, { min: 0, max: 100 });

    if (!weightResult.ok) {
      return Result.fail(weightResult.error);
    }

    weights[field] = weightResult.value;
  }

  return Result.ok(weights as StrategyWeights);
}

/**
 * Validates a parsed strategy definition object.
 */
export function validateStrategyDefinition(
  raw: unknown,
  filePath?: string,
): Result<StrategyDefinition, ContentLoadError> {
  if (!isRecord(raw)) {
    return Result.fail(
      new ContentLoadError('Strategy definition must be a YAML object.', { filePath }),
    );
  }

  const idResult = readString(raw, 'id', filePath);

  if (!idResult.ok) {
    return Result.fail(idResult.error);
  }

  if (!GLOBAL_ID_PATTERN.test(idResult.value)) {
    return Result.fail(
      new ContentLoadError(
        `Strategy id "${idResult.value}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
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

  const profileResult = readString(raw, 'profile', filePath);

  if (!profileResult.ok) {
    return Result.fail(profileResult.error);
  }

  const weightsResult = readWeights(raw, filePath);

  if (!weightsResult.ok) {
    return Result.fail(weightsResult.error);
  }

  const enabledResult = readBoolean(raw, 'enabled', filePath);

  if (!enabledResult.ok) {
    return Result.fail(enabledResult.error);
  }

  const versionResult = readNumber(raw, 'version', filePath, { min: 1 });

  if (!versionResult.ok) {
    return Result.fail(versionResult.error);
  }

  const props: StrategyDefinitionProps = {
    id: idResult.value,
    name: nameResult.value,
    description: descriptionResult.value,
    profile: profileResult.value,
    weights: weightsResult.value,
    enabled: enabledResult.value,
    version: versionResult.value,
  };

  return Result.ok(new StrategyDefinition(props));
}
