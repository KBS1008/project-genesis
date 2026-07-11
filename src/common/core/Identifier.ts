/**
 * @module @common/core/Identifier
 *
 * Generic, immutable identifier value object for Project Genesis.
 *
 * Wraps a primitive string identifier with compile-time type branding
 * via the phantom type parameter {@link T}.
 *
 * @see docs/decisions/DD-003-global-identifiers.md
 */

import { Result } from '../result/Result.js';

/**
 * Supported primitive identifier values.
 *
 * String identifiers are supported initially. Additional primitive
 * types may be added in future iterations when justified by usage.
 */
export type IdentifierPrimitive = string;

/**
 * Discriminated reasons for identifier validation failure.
 *
 * Uses string literal constants instead of magic strings at call sites.
 */
export const IdentifierValidationFailureReason = {
  EMPTY: 'EMPTY',
  WHITESPACE_ONLY: 'WHITESPACE_ONLY',
  NULL: 'NULL',
  UNDEFINED: 'UNDEFINED',
} as const;

/**
 * Union of all identifier validation failure reasons.
 */
export type IdentifierValidationFailureReason =
  (typeof IdentifierValidationFailureReason)[keyof typeof IdentifierValidationFailureReason];

/**
 * Describes a validation failure when creating an {@link Identifier}.
 *
 * Structured error object aligned with the project's explicit error-handling
 * direction via {@link Result} and future {@link DomainError} integration.
 */
export class IdentifierValidationError {
  /** Machine-readable failure reason. */
  readonly reason: IdentifierValidationFailureReason;

  /** Human-readable description of the failure. */
  readonly message: string;

  /**
   * @param reason - The validation failure reason.
   * @param message - A descriptive error message.
   */
  constructor(reason: IdentifierValidationFailureReason, message: string) {
    this.reason = reason;
    this.message = message;
  }
}

/**
 * An immutable, strongly typed identifier value object.
 *
 * Identifiers wrap a primitive value and provide value-based equality.
 * The generic type parameter {@link T} is a phantom brand that prevents
 * accidental mixing of different identifier types at compile time.
 *
 * @typeParam T - Phantom brand type (e.g. `'Company'`, `'Building'`).
 *
 * @example
 * ```typescript
 * type CompanyId = Identifier<'Company'>;
 *
 * const result = Identifier.create<CompanyId>('company_001');
 * if (result.ok) {
 *   const id: CompanyId = result.value;
 *   console.log(id.value); // 'company_001'
 * }
 * ```
 */
export class Identifier<T> {
  /** The wrapped primitive identifier value. */
  readonly #value: IdentifierPrimitive;

  /**
   * Private constructor enforces creation through {@link Identifier.create}.
   *
   * @param value - A pre-validated identifier value.
   */
  private constructor(value: IdentifierPrimitive) {
    this.#value = value;
    Object.freeze(this);
  }

  /**
   * The identifier's primitive value.
   */
  get value(): IdentifierPrimitive {
    return this.#value;
  }

  /**
   * Creates a new {@link Identifier} from a primitive value.
   *
   * Validates the input and returns an explicit result instead of throwing.
   * This follows the project's Result/Error strategy for expected failures.
   *
   * @typeParam T - Phantom brand type for the identifier.
   * @param rawValue - The raw primitive value to wrap.
   * @returns A discriminated result containing either the identifier or a validation error.
   */
  static create<T>(
    rawValue: string | null | undefined,
  ): Result<Identifier<T>, IdentifierValidationError> {
    const validationError = Identifier.validateRawValue(rawValue);

    if (validationError !== null) {
      return Result.fail(validationError);
    }

    // validateRawValue guarantees a non-empty string at this point
    return Result.ok(new Identifier<T>(rawValue as string));
  }

  /**
   * Compares this identifier with another by value.
   *
   * Returns `false` for `null`, `undefined`, or non-identifier values.
   *
   * @param other - The value to compare against.
   * @returns `true` if both identifiers wrap the same primitive value.
   */
  equals(other: unknown): boolean {
    if (!(other instanceof Identifier)) {
      return false;
    }

    return this.#value === other.#value;
  }

  /**
   * Returns the string representation of the identifier value.
   *
   * @returns The wrapped primitive value as a string.
   */
  toString(): string {
    return this.#value;
  }

  /**
   * Returns the primitive value for type coercion.
   *
   * @returns The wrapped primitive value.
   */
  valueOf(): IdentifierPrimitive {
    return this.#value;
  }

  /**
   * Validates a raw primitive value for identifier creation.
   *
   * @param rawValue - The value to validate.
   * @returns An {@link IdentifierValidationError} if invalid, otherwise `null`.
   */
  private static validateRawValue(
    rawValue: string | null | undefined,
  ): IdentifierValidationError | null {
    if (rawValue === null) {
      return new IdentifierValidationError(
        IdentifierValidationFailureReason.NULL,
        'Identifier value must not be null.',
      );
    }

    if (rawValue === undefined) {
      return new IdentifierValidationError(
        IdentifierValidationFailureReason.UNDEFINED,
        'Identifier value must not be undefined.',
      );
    }

    if (rawValue.length === 0) {
      return new IdentifierValidationError(
        IdentifierValidationFailureReason.EMPTY,
        'Identifier value must not be an empty string.',
      );
    }

    if (rawValue.trim().length === 0) {
      return new IdentifierValidationError(
        IdentifierValidationFailureReason.WHITESPACE_ONLY,
        'Identifier value must not be a whitespace-only string.',
      );
    }

    return null;
  }
}
