/**
 * @module @domain/contract/SupplyContractConstants
 *
 * Defaults for NPC supply contracts.
 */

/** Number of ticks between automatic NPC purchase contract fulfillments. */
export const NPC_PURCHASE_CONTRACT_INTERVAL_TICKS = 20;

/** Resource amount sold to the NPC each fulfillment. */
export const STARTER_NPC_WOOD_CONTRACT_AMOUNT = 5;

/** Credits paid to the company for each starter wood contract fulfillment. */
export const STARTER_NPC_WOOD_CONTRACT_PAYMENT = 125;

/** Resource sold through the starter NPC wood purchase contract. */
export const STARTER_NPC_WOOD_CONTRACT_RESOURCE_ID = 'wood';

/** Identifier assigned to the starter NPC wood purchase contract. */
export const STARTER_NPC_WOOD_CONTRACT_ID = 'contract_npc_wood_001';
