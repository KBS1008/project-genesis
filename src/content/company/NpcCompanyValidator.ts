/**
 * @module @content/company/NpcCompanyValidator
 *
 * Validates parsed NPC company content against schema rules.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import { NpcCompanyDefinition, type NpcCompanyDefinitionProps } from './NpcCompanyDefinition.js';

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
      new ContentLoadError(`NPC company field "${field}" must be a non-empty string.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value);
}

function readGlobalId(
  record: Record<string, unknown>,
  field: string,
  filePath: string | undefined,
): Result<string, ContentLoadError> {
  const valueResult = readString(record, field, filePath);

  if (!valueResult.ok) {
    return valueResult;
  }

  if (!GLOBAL_ID_PATTERN.test(valueResult.value)) {
    return Result.fail(
      new ContentLoadError(
        `NPC company field "${field}" value "${valueResult.value}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
        { ...contentContext(record, filePath) },
      ),
    );
  }

  return valueResult;
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
      new ContentLoadError(`NPC company field "${field}" must be a number.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  if (options.min !== undefined && value < options.min) {
    return Result.fail(
      new ContentLoadError(`NPC company field "${field}" must be at least ${options.min}.`, {
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
      new ContentLoadError(`NPC company field "${field}" must be a boolean.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value);
}

function readTags(
  record: Record<string, unknown>,
  filePath: string | undefined,
): Result<string[], ContentLoadError> {
  const value = record['tags'];

  if (value === undefined) {
    return Result.ok([]);
  }

  if (!Array.isArray(value)) {
    return Result.fail(
      new ContentLoadError('NPC company field "tags" must be an array.', {
        ...contentContext(record, filePath),
      }),
    );
  }

  const tags: string[] = [];
  const seen = new Set<string>();

  for (const entry of value) {
    if (typeof entry !== 'string' || entry.length === 0) {
      return Result.fail(
        new ContentLoadError('NPC company field "tags" must contain non-empty strings.', {
          ...contentContext(record, filePath),
        }),
      );
    }

    if (!GLOBAL_ID_PATTERN.test(entry)) {
      return Result.fail(
        new ContentLoadError(
          `NPC company field "tags" entry "${entry}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
          { ...contentContext(record, filePath) },
        ),
      );
    }

    if (seen.has(entry)) {
      return Result.fail(
        new ContentLoadError(`NPC company field "tags" contains duplicate id "${entry}".`, {
          ...contentContext(record, filePath),
        }),
      );
    }

    seen.add(entry);
    tags.push(entry);
  }

  tags.sort((left, right) => left.localeCompare(right));
  return Result.ok(tags);
}

/**
 * Validates a parsed NPC company definition object.
 */
export function validateNpcCompanyDefinition(
  raw: unknown,
  filePath?: string,
): Result<NpcCompanyDefinition, ContentLoadError> {
  if (!isRecord(raw)) {
    return Result.fail(
      new ContentLoadError('NPC company definition must be a YAML object.', { filePath }),
    );
  }

  const idResult = readGlobalId(raw, 'id', filePath);

  if (!idResult.ok) {
    return Result.fail(idResult.error);
  }

  const companyIdResult = readGlobalId(raw, 'companyId', filePath);

  if (!companyIdResult.ok) {
    return Result.fail(companyIdResult.error);
  }

  const nameResult = readString(raw, 'name', filePath);

  if (!nameResult.ok) {
    return Result.fail(nameResult.error);
  }

  const ownerIdResult = readGlobalId(raw, 'ownerId', filePath);

  if (!ownerIdResult.ok) {
    return Result.fail(ownerIdResult.error);
  }

  const strategyDefinitionIdResult = readGlobalId(raw, 'strategyDefinitionId', filePath);

  if (!strategyDefinitionIdResult.ok) {
    return Result.fail(strategyDefinitionIdResult.error);
  }

  const tagsResult = readTags(raw, filePath);

  if (!tagsResult.ok) {
    return Result.fail(tagsResult.error);
  }

  const enabledResult = readBoolean(raw, 'enabled', filePath);

  if (!enabledResult.ok) {
    return Result.fail(enabledResult.error);
  }

  const versionResult = readNumber(raw, 'version', filePath, { min: 1 });

  if (!versionResult.ok) {
    return Result.fail(versionResult.error);
  }

  const props: NpcCompanyDefinitionProps = {
    id: idResult.value,
    companyId: companyIdResult.value,
    name: nameResult.value,
    ownerId: ownerIdResult.value,
    strategyDefinitionId: strategyDefinitionIdResult.value,
    tags: tagsResult.value,
    enabled: enabledResult.value,
    version: versionResult.value,
  };

  return Result.ok(new NpcCompanyDefinition(props));
}
