/**
 * @module @domain/brain/CompanyDecisionPayload
 *
 * Typed payloads for executable company decisions.
 */

/** Payload for purchasing resources from a regional market. */
export type PurchaseResourceDecisionPayload = {
  readonly resourceId: string;
  readonly quantity: number;
  readonly regionId: string;
};

/** Payload for selling resources into a regional market. */
export type SellResourceDecisionPayload = {
  readonly resourceId: string;
  readonly quantity: number;
  readonly regionId: string;
};

/** Payload for starting a production job. */
export type StartProductionDecisionPayload = {
  readonly jobId: string;
  readonly buildingId: string;
  readonly recipeId: string;
  readonly batches: number;
};

/** Payload for placing a new building. */
export type PlaceBuildingDecisionPayload = {
  readonly buildingId: string;
  readonly buildingTypeId: string;
  readonly name: string;
  readonly regionId: string;
  readonly mapX: number;
  readonly mapY: number;
};

/** Payload for starting research on a technology. */
export type StartResearchDecisionPayload = {
  readonly jobId: string;
  readonly technologyId: string;
};

/** Payload for regional expansion planning. */
export type ExpandRegionDecisionPayload = {
  readonly targetRegionId: string;
};

/** Discriminated union of all company decision payloads. */
export type CompanyDecisionPayload =
  | {
      readonly type: 'PURCHASE_RESOURCE';
      readonly data: PurchaseResourceDecisionPayload;
    }
  | {
      readonly type: 'SELL_RESOURCE';
      readonly data: SellResourceDecisionPayload;
    }
  | {
      readonly type: 'START_PRODUCTION';
      readonly data: StartProductionDecisionPayload;
    }
  | {
      readonly type: 'PLACE_BUILDING';
      readonly data: PlaceBuildingDecisionPayload;
    }
  | {
      readonly type: 'START_RESEARCH';
      readonly data: StartResearchDecisionPayload;
    }
  | {
      readonly type: 'EXPAND_REGION';
      readonly data: ExpandRegionDecisionPayload;
    };
