/**
 * @module @domain/building/Position
 *
 * Grid position of a building on company property.
 */

import { ValueObject } from '../../common/core/ValueObject.js';

/**
 * Immutable grid coordinates for a building placement.
 */
export class Position extends ValueObject {
  readonly x: number;
  readonly y: number;

  /**
   * @param x - Horizontal grid coordinate.
   * @param y - Vertical grid coordinate.
   */
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
    Object.freeze(this);
  }

  protected getEqualityComponents(): readonly unknown[] {
    return [this.x, this.y];
  }
}
