/**
 * @module @content/economy/SupplyContractTemplateValidator
 *
 * Validates parsed supply contract template content against schema rules.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import {
  SupplyContractTemplateDefinition,
  SupplyContractTemplateKind,
  type SupplyContractTemplateDefinitionProps,
  type SupplyContractTemplateRequirements,
} from './SupplyContractTemplateDefinition.js';

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
      new ContentLoadError(
        `Supply contract template field "${field}" must be a non-empty string.`,
        { ...contentContext(record, filePath) },
      ),
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
        `Supply contract template field "${field}" value "${valueResult.value}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
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
      new ContentLoadError(`Supply contract template field "${field}" must be a number.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  if (options.min !== undefined && value < options.min) {
    return Result.fail(
      new ContentLoadError(
        `Supply contract template field "${field}" must be at least ${options.min}.`,
        { ...contentContext(record, filePath) },
      ),
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
      new ContentLoadError(`Supply contract template field "${field}" must be a boolean.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value);
}

function readOptionalGlobalId(
  record: Record<string, unknown>,
  field: string,
  filePath: string | undefined,
): Result<string | null, ContentLoadError> {
  const value = record[field];

  if (value === undefined || value === null) {
    return Result.ok(null);
  }

  if (typeof value !== 'string' || value.length === 0) {
    return Result.fail(
      new ContentLoadError(
        `Supply contract template field "${field}" must be a non-empty string when provided.`,
        { ...contentContext(record, filePath) },
      ),
    );
  }

  if (!GLOBAL_ID_PATTERN.test(value)) {
    return Result.fail(
      new ContentLoadError(
        `Supply contract template field "${field}" value "${value}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
        { ...contentContext(record, filePath) },
      ),
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
      new ContentLoadError(`Supply contract template field "${field}" must be an array.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  const ids: string[] = [];
  const seen = new Set<string>();

  for (const entry of value) {
    if (typeof entry !== 'string' || entry.length === 0) {
      return Result.fail(
        new ContentLoadError(
          `Supply contract template field "${field}" must contain non-empty strings.`,
          { ...contentContext(record, filePath) },
        ),
      );
    }

    if (!GLOBAL_ID_PATTERN.test(entry)) {
      return Result.fail(
        new ContentLoadError(
          `Supply contract template field "${field}" entry "${entry}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
          { ...contentContext(record, filePath) },
        ),
      );
    }

    if (seen.has(entry)) {
      return Result.fail(
        new ContentLoadError(
          `Supply contract template field "${field}" contains duplicate id "${entry}".`,
          { ...contentContext(record, filePath) },
        ),
      );
    }

    seen.add(entry);
    ids.push(entry);
  }

  ids.sort((left, right) => left.localeCompare(right));
  return Result.ok(ids);
}

function readRequirements(
  record: Record<string, unknown>,
  filePath: string | undefined,
): Result<SupplyContractTemplateRequirements, ContentLoadError> {
  const value = record['requirements'];

  if (value === undefined) {
    return Result.ok({ research: [], buildings: [] });
  }

  if (!isRecord(value)) {
    return Result.fail(
      new ContentLoadError('Supply contract template field "requirements" must be an object.', {
        ...contentContext(record, filePath),
      }),
    );
  }

  const researchResult = readIdArray(value, 'research', filePath);

  if (!researchResult.ok) {
    return Result.fail(researchResult.error);
  }

  const buildingsResult = readIdArray(value, 'buildings', filePath);

  if (!buildingsResult.ok) {
    return Result.fail(buildingsResult.error);
  }

  return Result.ok({
    research: researchResult.value,
    buildings: buildingsResult.value,
  });
}

function readKind(
  record: Record<string, unknown>,
  filePath: string | undefined,
): Result<SupplyContractTemplateKind, ContentLoadError> {
  const valueResult = readString(record, 'kind', filePath);

  if (!valueResult.ok) {
    return Result.fail(valueResult.error);
  }

  if (valueResult.value !== SupplyContractTemplateKind.NPC_PURCHASE) {
    return Result.fail(
      new ContentLoadError(
        `Supply contract template field "kind" value "${valueResult.value}" is not supported.`,
        { ...contentContext(record, filePath) },
      ),
    );
  }

  return Result.ok(SupplyContractTemplateKind.NPC_PURCHASE);
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
      new ContentLoadError('Supply contract template field "tags" must be an array.', {
        ...contentContext(record, filePath),
      }),
    );
  }

  const tags: string[] = [];
  const seen = new Set<string>();

  for (const entry of value) {
    if (typeof entry !== 'string' || entry.length === 0) {
      return Result.fail(
        new ContentLoadError('Supply contract template field "tags" must contain non-empty strings.', {
          ...contentContext(record, filePath),
        }),
      );
    }

    if (!GLOBAL_ID_PATTERN.test(entry)) {
      return Result.fail(
        new ContentLoadError(
          `Supply contract template field "tags" entry "${entry}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
          { ...contentContext(record, filePath) },
        ),
      );
    }

    if (seen.has(entry)) {
      return Result.fail(
        new ContentLoadError(
          `Supply contract template field "tags" contains duplicate id "${entry}".`,
          { ...contentContext(record, filePath) },
        ),
      );
    }

    seen.add(entry);
    tags.push(entry);
  }

  tags.sort((left, right) => left.localeCompare(right));
  return Result.ok(tags);
}

/**
 * Validates a parsed supply contract template definition object.
 */
export function validateSupplyContractTemplateDefinition(
  raw: unknown,
  filePath?: string,
): Result<SupplyContractTemplateDefinition, ContentLoadError> {
  if (!isRecord(raw)) {
    return Result.fail(
      new ContentLoadError('Supply contract template definition must be a YAML object.', {
        filePath,
      }),
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

  const kindResult = readKind(raw, filePath);

  if (!kindResult.ok) {
    return Result.fail(kindResult.error);
  }

  const resourceIdResult = readGlobalId(raw, 'resourceId', filePath);

  if (!resourceIdResult.ok) {
    return Result.fail(resourceIdResult.error);
  }

  const amountResult = readNumber(raw, 'amount', filePath, { min: 1 });

  if (!amountResult.ok) {
    return Result.fail(amountResult.error);
  }

  const paymentAmountResult = readNumber(raw, 'paymentAmount', filePath, { min: 0 });

  if (!paymentAmountResult.ok) {
    return Result.fail(paymentAmountResult.error);
  }

  const intervalTicksResult = readNumber(raw, 'intervalTicks', filePath, { min: 1 });

  if (!intervalTicksResult.ok) {
    return Result.fail(intervalTicksResult.error);
  }

  const regionIdResult = readOptionalGlobalId(raw, 'regionId', filePath);

  if (!regionIdResult.ok) {
    return Result.fail(regionIdResult.error);
  }

  const requirementsResult = readRequirements(raw, filePath);

  if (!requirementsResult.ok) {
    return Result.fail(requirementsResult.error);
  }

  const autoGrantOnNewGameResult = readBoolean(raw, 'autoGrantOnNewGame', filePath);

  if (!autoGrantOnNewGameResult.ok) {
    return Result.fail(autoGrantOnNewGameResult.error);
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

  const props: SupplyContractTemplateDefinitionProps = {
    id: idResult.value,
    name: nameResult.value,
    description: descriptionResult.value,
    kind: kindResult.value,
    resourceId: resourceIdResult.value,
    amount: amountResult.value,
    paymentAmount: paymentAmountResult.value,
    intervalTicks: intervalTicksResult.value,
    regionId: regionIdResult.value,
    requirements: requirementsResult.value,
    autoGrantOnNewGame: autoGrantOnNewGameResult.value,
    tags: tagsResult.value,
    enabled: enabledResult.value,
    version: versionResult.value,
  };

  return Result.ok(new SupplyContractTemplateDefinition(props));
}
