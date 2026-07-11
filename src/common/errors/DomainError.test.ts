import { DomainError } from './DomainError.js';
import { ValidationError, ValidationErrorCode } from './ValidationError.js';

describe('DomainError', () => {
  it('stores code and message', () => {
    const error = new DomainError('NOT_FOUND', 'Resource was not found.');

    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('Resource was not found.');
  });

  it('freezes the error instance', () => {
    const error = new DomainError('NOT_FOUND', 'Resource was not found.');

    expect(Object.isFrozen(error)).toBe(true);
  });
});

describe('ValidationError', () => {
  it('uses the validation error code', () => {
    const error = new ValidationError('Value is invalid.');

    expect(error.code).toBe(ValidationErrorCode.VALIDATION);
    expect(error.message).toBe('Value is invalid.');
  });

  it('stores an optional field name', () => {
    const error = new ValidationError('Value is invalid.', 'amount');

    expect(error.field).toBe('amount');
  });

  it('freezes the error instance', () => {
    const error = new ValidationError('Value is invalid.');

    expect(Object.isFrozen(error)).toBe(true);
  });
});
