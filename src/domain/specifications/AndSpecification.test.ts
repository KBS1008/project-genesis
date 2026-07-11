import { ValidationError } from '../../common/errors/ValidationError.js';
import { AndSpecification } from './AndSpecification.js';
import type { Specification } from './Specification.js';

class AlwaysPassSpecification implements Specification<string, void> {
  isSatisfiedBy(_candidate: string, _context: void) {
    return { ok: true as const, value: undefined };
  }
}

class AlwaysFailSpecification implements Specification<string, void> {
  isSatisfiedBy(_candidate: string, _context: void) {
    return { ok: false as const, error: new ValidationError('Rule failed.') };
  }
}

describe('AndSpecification', () => {
  it('passes when all wrapped specifications pass', () => {
    const specification = new AndSpecification([
      new AlwaysPassSpecification(),
      new AlwaysPassSpecification(),
    ]);

    const result = specification.isSatisfiedBy('candidate', undefined);

    expect(result.ok).toBe(true);
  });

  it('fails when any wrapped specification fails', () => {
    const specification = new AndSpecification([
      new AlwaysPassSpecification(),
      new AlwaysFailSpecification(),
    ]);

    const result = specification.isSatisfiedBy('candidate', undefined);

    expect(result.ok).toBe(false);
  });
});
