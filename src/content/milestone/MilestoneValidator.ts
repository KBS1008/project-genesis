/**
 * @module @content/milestone/MilestoneValidator
 *
 * Validates parsed milestone content against schema rules.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import {
  MilestoneDefinition,
  MilestoneTriggerType,
  type MilestoneDefinitionProps,
} from './MilestoneDefinition.js';

const GLOBAL_ID_PATTERN = /^[a-z0-9_]+$/;
const TRIGGER_TYPES = new Set<string>(Object.values(MilestoneTriggerType));

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
      new ContentLoadError(`Milestone field "${field}" must be a non-empty string.`, {
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
      new ContentLoadError(`Milestone field "${field}" must be a number.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  if (options.min !== undefined && value < options.min) {
    return Result.fail(
      new ContentLoadError(`Milestone field "${field}" must be at least ${options.min}.`, {
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
      new ContentLoadError(`Milestone field "${field}" must be a boolean.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value);
}

function readTriggerFieldNumber(
  trigger: Record<string, unknown>,
  field: string,
  filePath: string | undefined,
  parentRecord: Record<string, unknown>,
  options: { min?: number } = {},
): Result<number, ContentLoadError> {
  const value = trigger[field];

  if (typeof value !== 'number' || Number.isNaN(value)) {
    return Result.fail(
      new ContentLoadError(`Milestone trigger field "${field}" must be a number.`, {
        ...contentContext(parentRecord, filePath),
      }),
    );
  }

  if (options.min !== undefined && value < options.min) {
    return Result.fail(
      new ContentLoadError(`Milestone trigger field "${field}" must be at least ${options.min}.`, {
        ...contentContext(parentRecord, filePath),
      }),
    );
  }

  return Result.ok(value);
}

function readTriggerFieldId(
  trigger: Record<string, unknown>,
  field: string,
  filePath: string | undefined,
  parentRecord: Record<string, unknown>,
): Result<string, ContentLoadError> {
  const value = trigger[field];

  if (typeof value !== 'string' || value.length === 0) {
    return Result.fail(
      new ContentLoadError(`Milestone trigger field "${field}" must be a non-empty string.`, {
        ...contentContext(parentRecord, filePath),
      }),
    );
  }

  if (!GLOBAL_ID_PATTERN.test(value)) {
    return Result.fail(
      new ContentLoadError(
        `Milestone trigger field "${field}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
        {
          ...contentContext(parentRecord, filePath),
        },
      ),
    );
  }

  return Result.ok(value);
}

function readTrigger(
  record: Record<string, unknown>,
  filePath: string | undefined,
): Result<MilestoneDefinitionProps['trigger'], ContentLoadError> {
  const trigger = record['trigger'];

  if (!isRecord(trigger)) {
    return Result.fail(
      new ContentLoadError('Milestone field "trigger" must be an object.', {
        ...contentContext(record, filePath),
      }),
    );
  }

  const type = trigger['type'];

  if (typeof type !== 'string' || !TRIGGER_TYPES.has(type)) {
    return Result.fail(
      new ContentLoadError(
        `Milestone trigger type must be one of: ${[...TRIGGER_TYPES].join(', ')}.`,
        {
          ...contentContext(record, filePath),
        },
      ),
    );
  }

  switch (type) {
    case MilestoneTriggerType.FIRST_SALE:
      return Result.ok({ type: MilestoneTriggerType.FIRST_SALE });
    case MilestoneTriggerType.PRODUCTION_VOLUME: {
      const countResult = readTriggerFieldNumber(trigger, 'count', filePath, record, { min: 1 });

      if (!countResult.ok) {
        return Result.fail(countResult.error);
      }

      if (trigger['recipeId'] === undefined) {
        return Result.ok({
          type: MilestoneTriggerType.PRODUCTION_VOLUME,
          count: countResult.value,
        });
      }

      const recipeIdResult = readTriggerFieldId(trigger, 'recipeId', filePath, record);

      if (!recipeIdResult.ok) {
        return Result.fail(recipeIdResult.error);
      }

      return Result.ok({
        type: MilestoneTriggerType.PRODUCTION_VOLUME,
        count: countResult.value,
        recipeId: recipeIdResult.value,
      });
    }
    case MilestoneTriggerType.PROFIT_THRESHOLD: {
      const amountResult = readTriggerFieldNumber(trigger, 'amount', filePath, record, { min: 1 });

      if (!amountResult.ok) {
        return Result.fail(amountResult.error);
      }

      return Result.ok({
        type: MilestoneTriggerType.PROFIT_THRESHOLD,
        amount: amountResult.value,
      });
    }
    default:
      return Result.fail(
        new ContentLoadError(
          `Milestone trigger type must be one of: ${[...TRIGGER_TYPES].join(', ')}.`,
          {
            ...contentContext(record, filePath),
          },
        ),
      );
  }
}

/**
 * Validates a parsed milestone definition object.
 */
export function validateMilestoneDefinition(
  raw: unknown,
  filePath?: string,
): Result<MilestoneDefinition, ContentLoadError> {
  if (!isRecord(raw)) {
    return Result.fail(
      new ContentLoadError('Milestone definition must be a YAML object.', { filePath }),
    );
  }

  const idResult = readString(raw, 'id', filePath);

  if (!idResult.ok) {
    return Result.fail(idResult.error);
  }

  if (!GLOBAL_ID_PATTERN.test(idResult.value)) {
    return Result.fail(
      new ContentLoadError(
        `Milestone id "${idResult.value}" must match ${GLOBAL_ID_PATTERN.toString()}.`,
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

  const triggerResult = readTrigger(raw, filePath);

  if (!triggerResult.ok) {
    return Result.fail(triggerResult.error);
  }

  const enabledResult = readBoolean(raw, 'enabled', filePath);

  if (!enabledResult.ok) {
    return Result.fail(enabledResult.error);
  }

  const versionResult = readNumber(raw, 'version', filePath, { min: 1 });

  if (!versionResult.ok) {
    return Result.fail(versionResult.error);
  }

  return Result.ok(
    new MilestoneDefinition({
      id: idResult.value,
      name: nameResult.value,
      description: descriptionResult.value,
      trigger: triggerResult.value,
      enabled: enabledResult.value,
      version: versionResult.value,
    }),
  );
}
