/**
 * @module @content/research/TechnologyValidator
 *
 * Validates parsed technology content against schema rules.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import {
  TechnologyCategory,
  TechnologyDefinition,
  type TechnologyDefinitionProps,
} from './TechnologyDefinition.js';

const GLOBAL_ID_PATTERN = /^[a-z0-9_]+$/;
const TECHNOLOGY_CATEGORIES = new Set<string>(Object.values(TechnologyCategory));

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
      new ContentLoadError(`Technology field "${field}" must be a non-empty string.`, {
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
      new ContentLoadError(`Technology field "${field}" must be a number.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  if (options.min !== undefined && value < options.min) {
    return Result.fail(
      new ContentLoadError(`Technology field "${field}" must be at least ${options.min}.`, {
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
      new ContentLoadError(`Technology field "${field}" must be a boolean.`, {
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
      new ContentLoadError(`Technology field "${field}" must be an array of strings.`, {
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
      new ContentLoadError(`Technology field "${field}" contains an invalid value.`, {
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
        new ContentLoadError(`Technology field "${field}" contains invalid id "${entry}".`, {
          ...contentContext(record, filePath),
        }),
      );
    }
  }

  return arrayResult;
}

/**
 * Validates raw parsed content and creates a {@link TechnologyDefinition}.
 */
export function validateTechnologyDefinition(
  raw: unknown,
  filePath?: string,
): Result<TechnologyDefinition, ContentLoadError> {
  if (!isRecord(raw)) {
    return Result.fail(new ContentLoadError('Technology content must be an object.', { filePath }));
  }

  const idResult = readString(raw, 'id', filePath);

  if (!idResult.ok) {
    return Result.fail(idResult.error);
  }

  if (!GLOBAL_ID_PATTERN.test(idResult.value)) {
    return Result.fail(
      new ContentLoadError(
        `Technology id "${idResult.value}" must use lowercase letters, numbers and underscores only.`,
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

  const categoryResult = readEnumValue<TechnologyCategory>(
    raw,
    'category',
    TECHNOLOGY_CATEGORIES,
    filePath,
  );

  if (!categoryResult.ok) {
    return Result.fail(categoryResult.error);
  }

  const requiredResearchResult = readGlobalIdArray(raw, 'requiredResearch', filePath);

  if (!requiredResearchResult.ok) {
    return Result.fail(requiredResearchResult.error);
  }

  const requiredMilestonesResult = readGlobalIdArray(raw, 'requiredMilestones', filePath);

  if (!requiredMilestonesResult.ok) {
    return Result.fail(requiredMilestonesResult.error);
  }

  const researchCostResult = readNumber(raw, 'researchCost', filePath, { min: 0 });

  if (!researchCostResult.ok) {
    return Result.fail(researchCostResult.error);
  }

  const researchDurationResult = readNumber(raw, 'researchDuration', filePath, { min: 0 });

  if (!researchDurationResult.ok) {
    return Result.fail(researchDurationResult.error);
  }

  const enabledResult = readBoolean(raw, 'enabled', filePath);

  if (!enabledResult.ok) {
    return Result.fail(enabledResult.error);
  }

  const versionResult = readNumber(raw, 'version', filePath, { min: 1 });

  if (!versionResult.ok) {
    return Result.fail(versionResult.error);
  }

  const props: TechnologyDefinitionProps = {
    id: idResult.value,
    name: nameResult.value,
    description: descriptionResult.value,
    category: categoryResult.value,
    requiredResearch: requiredResearchResult.value,
    requiredMilestones: requiredMilestonesResult.value,
    researchCost: researchCostResult.value,
    researchDuration: researchDurationResult.value,
    enabled: enabledResult.value,
    version: versionResult.value,
  };

  return Result.ok(new TechnologyDefinition(props));
}
