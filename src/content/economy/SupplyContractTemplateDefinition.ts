/**
 * @module @content/economy/SupplyContractTemplateDefinition
 *
 * Immutable static supply contract template loaded from game content.
 */

/** Supported contract template kinds in version 1. */
export const SupplyContractTemplateKind = {
  NPC_PURCHASE: 'NPC_PURCHASE',
} as const;

export type SupplyContractTemplateKind =
  (typeof SupplyContractTemplateKind)[keyof typeof SupplyContractTemplateKind];

/** Optional prerequisites for offering a contract template. */
export type SupplyContractTemplateRequirements = {
  readonly research: readonly string[];
  readonly buildings: readonly string[];
};

/** Validated properties of a static supply contract template. */
export type SupplyContractTemplateDefinitionProps = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly kind: SupplyContractTemplateKind;
  readonly resourceId: string;
  readonly amount: number;
  readonly paymentAmount: number;
  readonly intervalTicks: number;
  readonly regionId: string | null;
  readonly requirements: SupplyContractTemplateRequirements;
  readonly autoGrantOnNewGame: boolean;
  readonly tags: readonly string[];
  readonly enabled: boolean;
  readonly version: number;
};

/**
 * Immutable supply contract template loaded from content files.
 */
export class SupplyContractTemplateDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly kind: SupplyContractTemplateKind;
  readonly resourceId: string;
  readonly amount: number;
  readonly paymentAmount: number;
  readonly intervalTicks: number;
  readonly regionId: string | null;
  readonly requirements: SupplyContractTemplateRequirements;
  readonly autoGrantOnNewGame: boolean;
  readonly tags: readonly string[];
  readonly enabled: boolean;
  readonly version: number;

  constructor(props: SupplyContractTemplateDefinitionProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.kind = props.kind;
    this.resourceId = props.resourceId;
    this.amount = props.amount;
    this.paymentAmount = props.paymentAmount;
    this.intervalTicks = props.intervalTicks;
    this.regionId = props.regionId;
    this.requirements = Object.freeze({
      research: Object.freeze([...props.requirements.research]),
      buildings: Object.freeze([...props.requirements.buildings]),
    });
    this.autoGrantOnNewGame = props.autoGrantOnNewGame;
    this.tags = Object.freeze([...props.tags]);
    this.enabled = props.enabled;
    this.version = props.version;
    Object.freeze(this);
  }
}
