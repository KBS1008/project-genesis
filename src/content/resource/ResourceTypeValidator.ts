/**
 * @module @content/resource/ResourceTypeValidator
 *
 * Validates parsed resource type content against schema rules.
 *
 * @see docs/decisions/DD-003-global-identifiers.md
 * @see docs/schemas/ResourceType.Schema.md
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import {
  ResourceCategory,
  ResourceState,
  ResourceStorageType,
  ResourceTransportType,
  ResourceTypeDefinition,
  type ResourceTypeDefinitionProps,
} from './ResourceTypeDefinition.js';

const GLOBAL_ID_PATTERN = /^[a-z0-9_]+$/;

const RESOURCE_CATEGORIES = new Set<string>(Object.values(ResourceCategory));
const RESOURCE_STATES = new Set<string>(Object.values(ResourceState));
const RESOURCE_STORAGE_TYPES = new Set<string>(Object.values(ResourceStorageType));
const RESOURCE_TRANSPORT_TYPES = new Set<string>(Object.values(ResourceTransportType));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(
  record: Record<string, unknown>,
  field: string,
  filePath: string | undefined,
): Result<string, ContentLoadError> {
  const value = record[field];

  if (typeof value !== 'string' || value.length === 0) {
    return Result.fail(
      new ContentLoadError(`Resource field "${field}" must be a non-empty string.`, {
        filePath,
        contentId: typeof record['id'] === 'string' ? record['id'] : undefined,
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
      new ContentLoadError(`Resource field "${field}" must be a number.`, {
        filePath,
        contentId: typeof record['id'] === 'string' ? record['id'] : undefined,
      }),
    );
  }

  if (options.min !== undefined && value < options.min) {
    return Result.fail(
      new ContentLoadError(`Resource field "${field}" must be at least ${options.min}.`, {
        filePath,
        contentId: typeof record['id'] === 'string' ? record['id'] : undefined,
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
      new ContentLoadError(`Resource field "${field}" must be a boolean.`, {
        filePath,
        contentId: typeof record['id'] === 'string' ? record['id'] : undefined,
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
      new ContentLoadError(`Resource field "${field}" must be an array of strings.`, {
        filePath,
        contentId: typeof record['id'] === 'string' ? record['id'] : undefined,
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
      new ContentLoadError(`Resource field "${field}" contains an invalid value.`, {
        filePath,
        contentId: typeof record['id'] === 'string' ? record['id'] : undefined,
      }),
    );
  }

  return Result.ok(value as T);
}

/**
 * Validates raw parsed content and creates a {@link ResourceTypeDefinition}.
 *
 * @param raw - Parsed YAML or JSON object.
 * @param filePath - Optional source file path for error reporting.
 */
export function validateResourceTypeDefinition(
  raw: unknown,
  filePath?: string,
): Result<ResourceTypeDefinition, ContentLoadError> {
  if (!isRecord(raw)) {
    return Result.fail(new ContentLoadError('Resource content must be an object.', { filePath }));
  }

  const idResult = readString(raw, 'id', filePath);

  if (!idResult.ok) {
    return Result.fail(idResult.error);
  }

  if (!GLOBAL_ID_PATTERN.test(idResult.value)) {
    return Result.fail(
      new ContentLoadError(
        `Resource id "${idResult.value}" must use lowercase letters, numbers and underscores only.`,
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

  const categoryResult = readEnumValue<ResourceCategory>(
    raw,
    'category',
    RESOURCE_CATEGORIES,
    filePath,
  );

  if (!categoryResult.ok) {
    return Result.fail(categoryResult.error);
  }

  const tierResult = readNumber(raw, 'tier', filePath, { min: 1 });

  if (!tierResult.ok) {
    return Result.fail(tierResult.error);
  }

  const stateResult = readEnumValue<ResourceState>(raw, 'state', RESOURCE_STATES, filePath);

  if (!stateResult.ok) {
    return Result.fail(stateResult.error);
  }

  const weightResult = readNumber(raw, 'weight', filePath, { min: 0 });

  if (!weightResult.ok) {
    return Result.fail(weightResult.error);
  }

  const volumeResult = readNumber(raw, 'volume', filePath, { min: 0 });

  if (!volumeResult.ok) {
    return Result.fail(volumeResult.error);
  }

  const basePriceResult = readNumber(raw, 'basePrice', filePath, { min: 0 });

  if (!basePriceResult.ok) {
    return Result.fail(basePriceResult.error);
  }

  const marketEnabledResult = readBoolean(raw, 'marketEnabled', filePath);

  if (!marketEnabledResult.ok) {
    return Result.fail(marketEnabledResult.error);
  }

  const tradableResult = readBoolean(raw, 'tradable', filePath);

  if (!tradableResult.ok) {
    return Result.fail(tradableResult.error);
  }

  const stackSizeResult = readNumber(raw, 'stackSize', filePath, { min: 1 });

  if (!stackSizeResult.ok) {
    return Result.fail(stackSizeResult.error);
  }

  const storageTypeResult = readEnumValue<ResourceStorageType>(
    raw,
    'storageType',
    RESOURCE_STORAGE_TYPES,
    filePath,
  );

  if (!storageTypeResult.ok) {
    return Result.fail(storageTypeResult.error);
  }

  const transportTypeResult = readEnumValue<ResourceTransportType>(
    raw,
    'transportType',
    RESOURCE_TRANSPORT_TYPES,
    filePath,
  );

  if (!transportTypeResult.ok) {
    return Result.fail(transportTypeResult.error);
  }

  const qualityEnabledResult = readBoolean(raw, 'qualityEnabled', filePath);

  if (!qualityEnabledResult.ok) {
    return Result.fail(qualityEnabledResult.error);
  }

  const decayEnabledResult = readBoolean(raw, 'decayEnabled', filePath);

  if (!decayEnabledResult.ok) {
    return Result.fail(decayEnabledResult.error);
  }

  const hazardousResult = readBoolean(raw, 'hazardous', filePath);

  if (!hazardousResult.ok) {
    return Result.fail(hazardousResult.error);
  }

  const flammableResult = readBoolean(raw, 'flammable', filePath);

  if (!flammableResult.ok) {
    return Result.fail(flammableResult.error);
  }

  const recyclableResult = readBoolean(raw, 'recyclable', filePath);

  if (!recyclableResult.ok) {
    return Result.fail(recyclableResult.error);
  }

  const energyValueResult = readNumber(raw, 'energyValue', filePath, { min: 0 });

  if (!energyValueResult.ok) {
    return Result.fail(energyValueResult.error);
  }

  const requiredResearchResult = readStringArray(raw, 'requiredResearch', filePath);

  if (!requiredResearchResult.ok) {
    return Result.fail(requiredResearchResult.error);
  }

  const tagsResult = readStringArray(raw, 'tags', filePath);

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

  const props: ResourceTypeDefinitionProps = {
    id: idResult.value,
    name: nameResult.value,
    description: descriptionResult.value,
    category: categoryResult.value,
    tier: tierResult.value,
    state: stateResult.value,
    weight: weightResult.value,
    volume: volumeResult.value,
    basePrice: basePriceResult.value,
    marketEnabled: marketEnabledResult.value,
    tradable: tradableResult.value,
    stackSize: stackSizeResult.value,
    storageType: storageTypeResult.value,
    transportType: transportTypeResult.value,
    qualityEnabled: qualityEnabledResult.value,
    decayEnabled: decayEnabledResult.value,
    hazardous: hazardousResult.value,
    flammable: flammableResult.value,
    recyclable: recyclableResult.value,
    energyValue: energyValueResult.value,
    requiredResearch: requiredResearchResult.value,
    tags: tagsResult.value,
    enabled: enabledResult.value,
    version: versionResult.value,
  };

  return Result.ok(new ResourceTypeDefinition(props));
}
