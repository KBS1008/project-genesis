/**
 * @module @common/core/Entity
 *
 * Base class for domain objects with stable identity in Project Genesis.
 *
 * Entity identity is represented by a strongly typed {@link Identifier}.
 *
 * @see docs/decisions/DD-003-global-identifiers.md
 */

import type { Identifier } from './Identifier.js';

/**
 * Base class for objects identified by a stable, strongly typed identifier.
 *
 * Subclasses inherit identity semantics and value-based equality through
 * their wrapped {@link Identifier}.
 *
 * @typeParam TBrand - Phantom brand type shared with {@link Identifier}
 * (e.g. `'Company'`, `'Building'`).
 *
 * @example
 * ```typescript
 * type CompanyId = Identifier<'Company'>;
 *
 * class Company extends Entity<'Company'> {
 *   constructor(id: CompanyId) {
 *     super(id);
 *   }
 * }
 * ```
 */
export abstract class Entity<TBrand> {
  /** The entity's stable identifier. */
  protected readonly id: Identifier<TBrand>;

  /**
   * @param id - A validated identifier for the entity.
   */
  constructor(id: Identifier<TBrand>) {
    this.id = id;
  }

  /**
   * Returns the entity identifier.
   */
  getId(): Identifier<TBrand> {
    return this.id;
  }

  /**
   * Compares this entity with another by identifier value.
   *
   * Returns `false` for `null`, `undefined`, or non-entity values.
   * Entities of different brands are compared by identifier value only
   * when both sides are {@link Entity} instances.
   *
   * @param other - The value to compare against.
   * @returns `true` when both entities share the same identifier value.
   */
  equals(other: unknown): boolean {
    if (!(other instanceof Entity)) {
      return false;
    }

    return this.id.equals(other.id);
  }
}
