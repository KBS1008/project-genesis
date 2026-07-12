/**
 * @module @project-genesis/api/game/dto/sell-resource.dto
 */

/** Request body for selling resources on the market. */
export type SellResourceDto = {
  readonly resourceId: string;
  readonly amount: number;
};
