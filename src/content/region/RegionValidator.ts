/**
 * @module @content/region/RegionValidator
 *
 * Validates parsed region content against schema rules.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import {
  RegionDefinition,
  type MapPosition,
  type RegionDefinitionProps,
  type RegionalResourceEntry,
} from './RegionDefinition.js';

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
      new ContentLoadError(`Region field "${field}" must be a non-empty string.`, {
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
        `Region field "${field}" value "${valueResult.value}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
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
      new ContentLoadError(`Region field "${field}" must be a number.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  if (options.min !== undefined && value < options.min) {
    return Result.fail(
      new ContentLoadError(`Region field "${field}" must be at least ${options.min}.`, {
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
      new ContentLoadError(`Region field "${field}" must be a boolean.`, {
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
      new ContentLoadError(`Region field "${field}" must be an array.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  const ids: string[] = [];
  const seen = new Set<string>();

  for (const entry of value) {
    if (typeof entry !== 'string' || entry.length === 0) {
      return Result.fail(
        new ContentLoadError(`Region field "${field}" must contain non-empty strings.`, {
          ...contentContext(record, filePath),
        }),
      );
    }

    if (!GLOBAL_ID_PATTERN.test(entry)) {
      return Result.fail(
        new ContentLoadError(
          `Region field "${field}" entry "${entry}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
          { ...contentContext(record, filePath) },
        ),
      );
    }

    if (seen.has(entry)) {
      return Result.fail(
        new ContentLoadError(`Region field "${field}" contains duplicate id "${entry}".`, {
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

function readMapPosition(
  record: Record<string, unknown>,
  filePath: string | undefined,
): Result<MapPosition, ContentLoadError> {
  const value = record['mapPosition'];

  if (!isRecord(value)) {
    return Result.fail(
      new ContentLoadError('Region field "mapPosition" must be an object.', {
        ...contentContext(record, filePath),
      }),
    );
  }

  const xResult = readNumber(value, 'x', filePath);

  if (!xResult.ok) {
    return Result.fail(
      new ContentLoadError('Region field "mapPosition.x" must be a number.', {
        ...contentContext(record, filePath),
      }),
    );
  }

  const yResult = readNumber(value, 'y', filePath);

  if (!yResult.ok) {
    return Result.fail(
      new ContentLoadError('Region field "mapPosition.y" must be a number.', {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok({ x: xResult.value, y: yResult.value });
}

function readRegionalResources(
  record: Record<string, unknown>,
  filePath: string | undefined,
): Result<RegionalResourceEntry[], ContentLoadError> {
  const value = record['regionalResources'];

  if (!Array.isArray(value)) {
    return Result.fail(
      new ContentLoadError('Region field "regionalResources" must be an array.', {
        ...contentContext(record, filePath),
      }),
    );
  }

  const entries: RegionalResourceEntry[] = [];
  const seen = new Set<string>();

  for (const entry of value) {
    if (!isRecord(entry)) {
      return Result.fail(
        new ContentLoadError('Region field "regionalResources" must contain objects.', {
          ...contentContext(record, filePath),
        }),
      );
    }

    const resourceTypeIdResult = readGlobalId(entry, 'resourceTypeId', filePath);

    if (!resourceTypeIdResult.ok) {
      return Result.fail(resourceTypeIdResult.error);
    }

    if (seen.has(resourceTypeIdResult.value)) {
      return Result.fail(
        new ContentLoadError(
          `Region field "regionalResources" contains duplicate resourceTypeId "${resourceTypeIdResult.value}".`,
          { ...contentContext(record, filePath) },
        ),
      );
    }

    seen.add(resourceTypeIdResult.value);

    const availableResult = readBoolean(entry, 'available', filePath);

    if (!availableResult.ok) {
      return Result.fail(availableResult.error);
    }

    const extractionModifierResult = readNumber(entry, 'extractionModifier', filePath, {
      min: 0.01,
    });

    if (!extractionModifierResult.ok) {
      return Result.fail(extractionModifierResult.error);
    }

    entries.push({
      resourceTypeId: resourceTypeIdResult.value,
      available: availableResult.value,
      extractionModifier: extractionModifierResult.value,
    });
  }

  entries.sort((left, right) => left.resourceTypeId.localeCompare(right.resourceTypeId));
  return Result.ok(entries);
}

/**
 * Validates a parsed region definition object.
 */
export function validateRegionDefinition(
  raw: unknown,
  filePath?: string,
): Result<RegionDefinition, ContentLoadError> {
  if (!isRecord(raw)) {
    return Result.fail(
      new ContentLoadError('Region definition must be a YAML object.', { filePath }),
    );
  }

  const idResult = readGlobalId(raw, 'id', filePath);

  if (!idResult.ok) {
    return Result.fail(idResult.error);
  }

  const nameResult = readString(raw, 'name', filePath);

  if (!nameResult.ok) {
    return Result.fail(nameResult.error);
  }

  const descriptionResult = readString(raw, 'description', filePath);

  if (!descriptionResult.ok) {
    return Result.fail(descriptionResult.error);
  }

  const worldIdResult = readGlobalId(raw, 'worldId', filePath);

  if (!worldIdResult.ok) {
    return Result.fail(worldIdResult.error);
  }

  const biomeIdResult = readGlobalId(raw, 'biomeId', filePath);

  if (!biomeIdResult.ok) {
    return Result.fail(biomeIdResult.error);
  }

  const mapPositionResult = readMapPosition(raw, filePath);

  if (!mapPositionResult.ok) {
    return Result.fail(mapPositionResult.error);
  }

  const neighborRegionIdsResult = readIdArray(raw, 'neighborRegionIds', filePath);

  if (!neighborRegionIdsResult.ok) {
    return Result.fail(neighborRegionIdsResult.error);
  }

  const cityIdsResult = readIdArray(raw, 'cityIds', filePath);

  if (!cityIdsResult.ok) {
    return Result.fail(cityIdsResult.error);
  }

  const regionalResourcesResult = readRegionalResources(raw, filePath);

  if (!regionalResourcesResult.ok) {
    return Result.fail(regionalResourcesResult.error);
  }

  const enabledResult = readBoolean(raw, 'enabled', filePath);

  if (!enabledResult.ok) {
    return Result.fail(enabledResult.error);
  }

  const versionResult = readNumber(raw, 'version', filePath, { min: 1 });

  if (!versionResult.ok) {
    return Result.fail(versionResult.error);
  }

  const props: RegionDefinitionProps = {
    id: idResult.value,
    name: nameResult.value,
    description: descriptionResult.value,
    worldId: worldIdResult.value,
    biomeId: biomeIdResult.value,
    mapPosition: mapPositionResult.value,
    neighborRegionIds: neighborRegionIdsResult.value,
    cityIds: cityIdsResult.value,
    regionalResources: regionalResourcesResult.value,
    enabled: enabledResult.value,
    version: versionResult.value,
  };

  return Result.ok(new RegionDefinition(props));
}
