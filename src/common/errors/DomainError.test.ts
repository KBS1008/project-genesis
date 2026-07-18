import { DomainError } from './DomainError.js';
import { ErrorCategory } from './ErrorCategory.js';
import { ErrorSeverity } from './ErrorSeverity.js';
import { ProjectGenesisError } from './ProjectGenesisError.js';
import {
  ValidationError,
  ValidationErrors,
  ValidationErrorCode,
} from './ValidationError.js';
import { ApplicationError } from './ApplicationError.js';
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from './InfrastructureError.js';
import {
  PersistenceError,
  PersistenceErrorCode,
} from './PersistenceError.js';

describe('ProjectGenesisError', () => {
  it('stores structured error metadata', () => {
    const error = new ProjectGenesisError({
      errorCode: 'APP-0001',
      category: ErrorCategory.Application,
      message: 'Workflow failed.',
      severity: ErrorSeverity.Error,
      context: { command: 'SaveGame' },
    });

    expect(error.errorCode).toBe('APP-0001');
    expect(error.code).toBe('APP-0001');
    expect(error.category).toBe(ErrorCategory.Application);
    expect(error.message).toBe('Workflow failed.');
    expect(error.severity).toBe(ErrorSeverity.Error);
    expect(error.context).toEqual({ command: 'SaveGame' });
  });
});

describe('DomainError', () => {
  it('stores code and message', () => {
    const error = new DomainError('DOM-0001', 'Resource was not found.');

    expect(error.errorCode).toBe('DOM-0001');
    expect(error.code).toBe('DOM-0001');
    expect(error.category).toBe(ErrorCategory.Domain);
    expect(error.message).toBe('Resource was not found.');
  });

  it('freezes the error instance', () => {
    const error = new DomainError('DOM-0001', 'Resource was not found.');

    expect(Object.isFrozen(error)).toBe(true);
  });
});

describe('ValidationError', () => {
  it('uses the validation error code', () => {
    const error = new ValidationError('Value is invalid.');

    expect(error.errorCode).toBe(ValidationErrorCode.VALIDATION);
    expect(error.code).toBe(ValidationErrorCode.VALIDATION);
    expect(error.category).toBe(ErrorCategory.Validation);
    expect(error.message).toBe('Value is invalid.');
  });

  it('stores field, constraint and value metadata', () => {
    const error = new ValidationError('Value is invalid.', {
      field: 'amount',
      constraint: 'amount > 0',
      value: -1,
    });

    expect(error.field).toBe('amount');
    expect(error.constraint).toBe('amount > 0');
    expect(error.value).toBe(-1);
  });

  it('freezes the error instance', () => {
    const error = new ValidationError('Value is invalid.');

    expect(Object.isFrozen(error)).toBe(true);
  });
});

describe('ValidationErrors', () => {
  it('aggregates multiple validation failures', () => {
    const errors = Object.freeze([
      new ValidationError('Missing factory.', { field: 'factoryId' }),
      new ValidationError('Invalid quantity.', { field: 'quantity' }),
    ]);
    const aggregate = new ValidationErrors(errors);

    expect(aggregate.errors).toHaveLength(2);
    expect(aggregate.errorCode).toBe(ValidationErrorCode.CONSTRAINT_VIOLATION);
  });
});

describe('ApplicationError', () => {
  it('uses the application category', () => {
    const error = new ApplicationError({
      errorCode: 'APP-0002',
      message: 'Use case failed.',
    });

    expect(error.category).toBe(ErrorCategory.Application);
    expect(error.errorCode).toBe('APP-0002');
  });
});

describe('InfrastructureError', () => {
  it('uses the infrastructure category', () => {
    const error = new InfrastructureError({
      errorCode: InfrastructureErrorCode.FILESYSTEM,
      message: 'Filesystem unavailable.',
    });

    expect(error.category).toBe(ErrorCategory.Infrastructure);
  });
});

describe('PersistenceError', () => {
  it('uses the persistence category', () => {
    const error = new PersistenceError({
      errorCode: PersistenceErrorCode.SAVE_FAILED,
      message: 'Save failed.',
    });

    expect(error.category).toBe(ErrorCategory.Persistence);
  });
});
