/**
 * @module @content/employee/EmployeeValidator
 *
 * Validates parsed employee content against schema rules.
 *
 * @see docs/schemas/Employee.schema.md
 * @see docs/decisions/DD-003-global-identifiers.md
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import {
  EmployeeCategory,
  EmployeeDefinition,
  type EmployeeDefinitionProps,
  type EmployeeRequirements,
  type EmployeeStatistics,
} from './EmployeeDefinition.js';

const GLOBAL_ID_PATTERN = /^[a-z0-9_]+$/;

const EMPLOYEE_CATEGORIES = new Set<string>(Object.values(EmployeeCategory));

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
      new ContentLoadError(`Employee field "${field}" must be a non-empty string.`, {
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
  options: { min?: number; exclusiveMin?: boolean } = {},
): Result<number, ContentLoadError> {
  const value = record[field];

  if (typeof value !== 'number' || Number.isNaN(value)) {
    return Result.fail(
      new ContentLoadError(`Employee field "${field}" must be a number.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  if (options.min !== undefined) {
    const valid = options.exclusiveMin ? value > options.min : value >= options.min;

    if (!valid) {
      return Result.fail(
        new ContentLoadError(`Employee field "${field}" must be greater than ${options.min}.`, {
          ...contentContext(record, filePath),
        }),
      );
    }
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
      new ContentLoadError(`Employee field "${field}" must be a boolean.`, {
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
      new ContentLoadError(`Employee field "${field}" must be an array of strings.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value);
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
        new ContentLoadError(`Employee field "${field}" contains invalid id "${entry}".`, {
          ...contentContext(record, filePath),
        }),
      );
    }
  }

  return arrayResult;
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
      new ContentLoadError(`Employee field "${field}" contains an invalid value.`, {
        ...contentContext(record, filePath),
      }),
    );
  }

  return Result.ok(value as T);
}

function readStatistics(
  record: Record<string, unknown>,
  filePath: string | undefined,
): Result<EmployeeStatistics | undefined, ContentLoadError> {
  const value = record['statistics'];

  if (value === undefined) {
    return Result.ok(undefined);
  }

  if (!isRecord(value)) {
    return Result.fail(
      new ContentLoadError('Employee field "statistics" must be an object.', {
        ...contentContext(record, filePath),
      }),
    );
  }

  const productivityResult = readNumber(value, 'productivity', filePath, {
    min: 0,
    exclusiveMin: true,
  });

  if (!productivityResult.ok) {
    return Result.fail(productivityResult.error);
  }

  const efficiencyResult = readNumber(value, 'efficiency', filePath, {
    min: 0,
    exclusiveMin: true,
  });

  if (!efficiencyResult.ok) {
    return Result.fail(efficiencyResult.error);
  }

  const staminaResult = readNumber(value, 'stamina', filePath, { min: 0, exclusiveMin: true });

  if (!staminaResult.ok) {
    return Result.fail(staminaResult.error);
  }

  const intelligenceResult = readNumber(value, 'intelligence', filePath, {
    min: 0,
    exclusiveMin: true,
  });

  if (!intelligenceResult.ok) {
    return Result.fail(intelligenceResult.error);
  }

  const reliabilityResult = readNumber(value, 'reliability', filePath, {
    min: 0,
    exclusiveMin: true,
  });

  if (!reliabilityResult.ok) {
    return Result.fail(reliabilityResult.error);
  }

  return Result.ok({
    productivity: productivityResult.value,
    efficiency: efficiencyResult.value,
    stamina: staminaResult.value,
    intelligence: intelligenceResult.value,
    reliability: reliabilityResult.value,
  });
}

function readRequirements(
  record: Record<string, unknown>,
  filePath: string | undefined,
): Result<EmployeeRequirements, ContentLoadError> {
  const value = record['requirements'];

  if (value === undefined) {
    return Result.ok({ research: [], buildings: [] });
  }

  if (!isRecord(value)) {
    return Result.fail(
      new ContentLoadError('Employee field "requirements" must be an object.', {
        ...contentContext(record, filePath),
      }),
    );
  }

  const researchResult =
    value['research'] === undefined
      ? Result.ok(Object.freeze([] as readonly string[]))
      : readGlobalIdArray(value, 'research', filePath);

  if (!researchResult.ok) {
    return Result.fail(researchResult.error);
  }

  const buildingsResult =
    value['buildings'] === undefined
      ? Result.ok(Object.freeze([] as readonly string[]))
      : readGlobalIdArray(value, 'buildings', filePath);

  if (!buildingsResult.ok) {
    return Result.fail(buildingsResult.error);
  }

  return Result.ok({
    research: researchResult.value,
    buildings: buildingsResult.value,
  });
}

/**
 * Validates raw parsed content and creates an {@link EmployeeDefinition}.
 */
export function validateEmployeeDefinition(
  raw: unknown,
  filePath?: string,
): Result<EmployeeDefinition, ContentLoadError> {
  if (!isRecord(raw)) {
    return Result.fail(
      new ContentLoadError('Employee content must be an object.', { filePath }),
    );
  }

  const idResult = readString(raw, 'id', filePath);

  if (!idResult.ok) {
    return Result.fail(idResult.error);
  }

  if (!GLOBAL_ID_PATTERN.test(idResult.value)) {
    return Result.fail(
      new ContentLoadError(
        `Employee id "${idResult.value}" must use lowercase letters, numbers and underscores only.`,
        { filePath, contentId: idResult.value },
      ),
    );
  }

  const versionResult = readNumber(raw, 'version', filePath, { min: 1 });

  if (!versionResult.ok) {
    return Result.fail(versionResult.error);
  }

  const displayNameResult = readString(raw, 'displayName', filePath);

  if (!displayNameResult.ok) {
    return Result.fail(displayNameResult.error);
  }

  const categoryResult = readEnumValue<EmployeeCategory>(
    raw,
    'category',
    EMPLOYEE_CATEGORIES,
    filePath,
  );

  if (!categoryResult.ok) {
    return Result.fail(categoryResult.error);
  }

  const professionResult = readString(raw, 'profession', filePath);

  if (!professionResult.ok) {
    return Result.fail(professionResult.error);
  }

  const costResult = readNumber(raw, 'cost', filePath, { min: 0, exclusiveMin: true });

  if (!costResult.ok) {
    return Result.fail(costResult.error);
  }

  const salaryResult = readNumber(raw, 'salary', filePath, { min: 0, exclusiveMin: true });

  if (!salaryResult.ok) {
    return Result.fail(salaryResult.error);
  }

  const productivityResult = readNumber(raw, 'productivity', filePath, {
    min: 0,
    exclusiveMin: true,
  });

  if (!productivityResult.ok) {
    return Result.fail(productivityResult.error);
  }

  const descriptionResult = readString(raw, 'description', filePath);

  if (!descriptionResult.ok) {
    return Result.fail(descriptionResult.error);
  }

  const statisticsResult = readStatistics(raw, filePath);

  if (!statisticsResult.ok) {
    return Result.fail(statisticsResult.error);
  }

  const traitsResult =
    raw['traits'] === undefined
      ? Result.ok(Object.freeze([] as readonly string[]))
      : readGlobalIdArray(raw, 'traits', filePath);

  if (!traitsResult.ok) {
    return Result.fail(traitsResult.error);
  }

  const requirementsResult = readRequirements(raw, filePath);

  if (!requirementsResult.ok) {
    return Result.fail(requirementsResult.error);
  }

  const tagsResult = readStringArray(raw, 'tags', filePath);

  if (!tagsResult.ok) {
    return Result.fail(tagsResult.error);
  }

  let localizationKey: string | undefined;

  if (raw['localizationKey'] !== undefined) {
    const localizationKeyResult = readString(raw, 'localizationKey', filePath);

    if (!localizationKeyResult.ok) {
      return Result.fail(localizationKeyResult.error);
    }

    localizationKey = localizationKeyResult.value;
  }

  const enabledResult = readBoolean(raw, 'enabled', filePath);

  if (!enabledResult.ok) {
    return Result.fail(enabledResult.error);
  }

  const props: EmployeeDefinitionProps = {
    id: idResult.value,
    version: versionResult.value,
    displayName: displayNameResult.value,
    category: categoryResult.value,
    profession: professionResult.value,
    cost: costResult.value,
    salary: salaryResult.value,
    productivity: productivityResult.value,
    description: descriptionResult.value,
    statistics: statisticsResult.value,
    traits: traitsResult.value,
    requirements: requirementsResult.value,
    tags: tagsResult.value,
    localizationKey,
    enabled: enabledResult.value,
  };

  return Result.ok(new EmployeeDefinition(props));
}
