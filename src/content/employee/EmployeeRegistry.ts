/**
 * @module @content/employee/EmployeeRegistry
 *
 * Read-only registry of validated employee type definitions.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../errors/ContentLoadError.js';
import type { EmployeeDefinition } from './EmployeeDefinition.js';

/**
 * Stores and provides access to loaded employee type definitions.
 */
export class EmployeeRegistry {
  readonly #employees = new Map<string, EmployeeDefinition>();

  /**
   * Registers an employee type definition.
   */
  register(definition: EmployeeDefinition): Result<void, ContentLoadError> {
    if (this.#employees.has(definition.id)) {
      return Result.fail(
        new ContentLoadError(`Duplicate employee id "${definition.id}".`, {
          contentId: definition.id,
        }),
      );
    }

    this.#employees.set(definition.id, definition);
    return Result.ok(undefined);
  }

  /** Returns an employee type definition by id. */
  get(id: string): EmployeeDefinition | undefined {
    return this.#employees.get(id);
  }

  /** Returns an employee type definition or a structured not-found error. */
  getRequired(id: string): Result<EmployeeDefinition, ContentLoadError> {
    const definition = this.#employees.get(id);

    if (definition === undefined) {
      return Result.fail(
        new ContentLoadError(`Employee id "${id}" was not found in the registry.`, {
          contentId: id,
        }),
      );
    }

    return Result.ok(definition);
  }

  /** Returns all registered employee type definitions in deterministic id order. */
  getAll(): readonly EmployeeDefinition[] {
    return Object.freeze(
      [...this.#employees.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  /** Returns whether an employee type is registered. */
  has(id: string): boolean {
    return this.#employees.has(id);
  }

  /** Returns the number of registered employee type definitions. */
  get size(): number {
    return this.#employees.size;
  }
}
