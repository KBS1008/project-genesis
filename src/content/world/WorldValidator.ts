/**
 * @module @content/world/WorldValidator
 *
 * Validates parsed world content against schema rules.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import { WorldDefinition, type WorldDefinitionProps } from './WorldDefinition.js';

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
      new ContentLoadError(`World field "${field}" must be a non-empty string.`, {
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
      new ContentLoadError(`World field "${field}" must be a number.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  if (options.min !== undefined && value < options.min) {
    return Result.fail(
      new ContentLoadError(`World field "${field}" must be at least ${options.min}.`, {
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
      new ContentLoadError(`World field "${field}" must be a boolean.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value);
}

function readIdArray(
  record: Record<string, unknown>,
  field: string,
  filePath: string | undefined,
): Result<string[], ContentLoadError> {
  const value = record[field];

  if (!Array.isArray(value)) {
    return Result.fail(
      new ContentLoadError(`World field "${field}" must be an array.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  const ids: string[] = [];
  const seen = new Set<string>();

  for (const entry of value) {
    if (typeof entry !== 'string' || entry.length === 0) {
      return Result.fail(
        new ContentLoadError(`World field "${field}" must contain non-empty strings.`, {
          ...contentContext(record, filePath),
        }),
      );
    }

    if (!GLOBAL_ID_PATTERN.test(entry)) {
      return Result.fail(
        new ContentLoadError(
          `World field "${field}" entry "${entry}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
          { ...contentContext(record, filePath) },
        ),
      );
    }

    if (seen.has(entry)) {
      return Result.fail(
        new ContentLoadError(`World field "${field}" contains duplicate id "${entry}".`, {
          ...contentContext(record, filePath),
        }),
      );
    }

    seen.add(entry);
    ids.push(entry);
  }

  ids.sort((left, right) => left.localeCompare(right));
  return Result.ok(ids);
}

/**
 * Validates a parsed world definition object.
 */
export function validateWorldDefinition(
  raw: unknown,
  filePath?: string,
): Result<WorldDefinition, ContentLoadError> {
  if (!isRecord(raw)) {
    return Result.fail(
      new ContentLoadError('World definition must be a YAML object.', { filePath }),
    );
  }

  const idResult = readString(raw, 'id', filePath);

  if (!idResult.ok) {
    return Result.fail(idResult.error);
  }

  if (!GLOBAL_ID_PATTERN.test(idResult.value)) {
    return Result.fail(
      new ContentLoadError(
        `World id "${idResult.value}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
        { ...contentContext(raw, filePath) },
      ),
    );
  }

  const nameResult = readString(raw, 'name', filePath);

  if (!nameResult.ok) {
    return Result.fail(nameResult.error);
  }

  const regionIdsResult = readIdArray(raw, 'regionIds', filePath);

  if (!regionIdsResult.ok) {
    return Result.fail(regionIdsResult.error);
  }

  const enabledResult = readBoolean(raw, 'enabled', filePath);

  if (!enabledResult.ok) {
    return Result.fail(enabledResult.error);
  }

  const versionResult = readNumber(raw, 'version', filePath, { min: 1 });

  if (!versionResult.ok) {
    return Result.fail(versionResult.error);
  }

  const props: WorldDefinitionProps = {
    id: idResult.value,
    name: nameResult.value,
    regionIds: regionIdsResult.value,
    enabled: enabledResult.value,
    version: versionResult.value,
  };

  return Result.ok(new WorldDefinition(props));
}
