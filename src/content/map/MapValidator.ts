/**
 * @module @content/map/MapValidator
 *
 * Validates parsed map content against schema rules.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import {
  MapDefinition,
  type MapDefinitionProps,
  type MapRegionConnection,
  type MapRegionPlacement,
} from './MapDefinition.js';

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
      new ContentLoadError(`Map field "${field}" must be a non-empty string.`, {
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
      new ContentLoadError(`Map field "${field}" must be a number.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  if (options.min !== undefined && value < options.min) {
    return Result.fail(
      new ContentLoadError(`Map field "${field}" must be at least ${options.min}.`, {
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
      new ContentLoadError(`Map field "${field}" must be a boolean.`, {
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
        `Map field "${field}" value "${valueResult.value}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
        { ...contentContext(record, filePath) },
      ),
    );
  }

  return valueResult;
}

function readRegionPlacements(
  record: Record<string, unknown>,
  filePath: string | undefined,
): Result<MapRegionPlacement[], ContentLoadError> {
  const value = record['regions'];

  if (!Array.isArray(value)) {
    return Result.fail(
      new ContentLoadError('Map field "regions" must be an array.', {
        ...contentContext(record, filePath),
      }),
    );
  }

  const placements: MapRegionPlacement[] = [];
  const seen = new Set<string>();

  for (const entry of value) {
    if (!isRecord(entry)) {
      return Result.fail(
        new ContentLoadError('Map field "regions" must contain objects.', {
          ...contentContext(record, filePath),
        }),
      );
    }

    const regionIdResult = readGlobalId(entry, 'regionId', filePath);

    if (!regionIdResult.ok) {
      return Result.fail(regionIdResult.error);
    }

    if (seen.has(regionIdResult.value)) {
      return Result.fail(
        new ContentLoadError(
          `Map field "regions" contains duplicate regionId "${regionIdResult.value}".`,
          { ...contentContext(record, filePath) },
        ),
      );
    }

    seen.add(regionIdResult.value);

    const xResult = readNumber(entry, 'x', filePath);

    if (!xResult.ok) {
      return Result.fail(xResult.error);
    }

    const yResult = readNumber(entry, 'y', filePath);

    if (!yResult.ok) {
      return Result.fail(yResult.error);
    }

    placements.push({
      regionId: regionIdResult.value,
      x: xResult.value,
      y: yResult.value,
    });
  }

  placements.sort((left, right) => left.regionId.localeCompare(right.regionId));
  return Result.ok(placements);
}

function readConnections(
  record: Record<string, unknown>,
  filePath: string | undefined,
): Result<MapRegionConnection[], ContentLoadError> {
  const value = record['connections'];

  if (!Array.isArray(value)) {
    return Result.fail(
      new ContentLoadError('Map field "connections" must be an array.', {
        ...contentContext(record, filePath),
      }),
    );
  }

  const connections: MapRegionConnection[] = [];

  for (const entry of value) {
    if (!isRecord(entry)) {
      return Result.fail(
        new ContentLoadError('Map field "connections" must contain objects.', {
          ...contentContext(record, filePath),
        }),
      );
    }

    const fromRegionIdResult = readGlobalId(entry, 'fromRegionId', filePath);

    if (!fromRegionIdResult.ok) {
      return Result.fail(fromRegionIdResult.error);
    }

    const toRegionIdResult = readGlobalId(entry, 'toRegionId', filePath);

    if (!toRegionIdResult.ok) {
      return Result.fail(toRegionIdResult.error);
    }

    if (fromRegionIdResult.value === toRegionIdResult.value) {
      return Result.fail(
        new ContentLoadError('Map connection fromRegionId and toRegionId must differ.', {
          ...contentContext(record, filePath),
        }),
      );
    }

    const distanceResult = readNumber(entry, 'distance', filePath, { min: 1 });

    if (!distanceResult.ok) {
      return Result.fail(distanceResult.error);
    }

    connections.push({
      fromRegionId: fromRegionIdResult.value,
      toRegionId: toRegionIdResult.value,
      distance: distanceResult.value,
    });
  }

  connections.sort((left, right) => {
    const fromCompare = left.fromRegionId.localeCompare(right.fromRegionId);

    if (fromCompare !== 0) {
      return fromCompare;
    }

    return left.toRegionId.localeCompare(right.toRegionId);
  });

  return Result.ok(connections);
}

/**
 * Validates a parsed map definition object.
 */
export function validateMapDefinition(
  raw: unknown,
  filePath?: string,
): Result<MapDefinition, ContentLoadError> {
  if (!isRecord(raw)) {
    return Result.fail(new ContentLoadError('Map definition must be a YAML object.', { filePath }));
  }

  const idResult = readString(raw, 'id', filePath);

  if (!idResult.ok) {
    return Result.fail(idResult.error);
  }

  if (!GLOBAL_ID_PATTERN.test(idResult.value)) {
    return Result.fail(
      new ContentLoadError(
        `Map id "${idResult.value}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
        { ...contentContext(raw, filePath) },
      ),
    );
  }

  const nameResult = readString(raw, 'name', filePath);

  if (!nameResult.ok) {
    return Result.fail(nameResult.error);
  }

  const regionsResult = readRegionPlacements(raw, filePath);

  if (!regionsResult.ok) {
    return Result.fail(regionsResult.error);
  }

  const connectionsResult = readConnections(raw, filePath);

  if (!connectionsResult.ok) {
    return Result.fail(connectionsResult.error);
  }

  const enabledResult = readBoolean(raw, 'enabled', filePath);

  if (!enabledResult.ok) {
    return Result.fail(enabledResult.error);
  }

  const versionResult = readNumber(raw, 'version', filePath, { min: 1 });

  if (!versionResult.ok) {
    return Result.fail(versionResult.error);
  }

  const props: MapDefinitionProps = {
    id: idResult.value,
    name: nameResult.value,
    regions: regionsResult.value,
    connections: connectionsResult.value,
    enabled: enabledResult.value,
    version: versionResult.value,
  };

  return Result.ok(new MapDefinition(props));
}
