/**
 * @module @content/company/NpcCompanyDefinition
 *
 * Immutable static autonomous NPC company definition loaded from game content.
 */

/** Validated properties of a static NPC company definition. */
export type NpcCompanyDefinitionProps = {
  readonly id: string;
  readonly companyId: string;
  readonly name: string;
  readonly ownerId: string;
  readonly strategyDefinitionId: string;
  readonly tags: readonly string[];
  readonly enabled: boolean;
  readonly version: number;
};

/**
 * Immutable NPC company loaded from content files.
 */
export class NpcCompanyDefinition {
  readonly id: string;
  readonly companyId: string;
  readonly name: string;
  readonly ownerId: string;
  readonly strategyDefinitionId: string;
  readonly tags: readonly string[];
  readonly enabled: boolean;
  readonly version: number;

  constructor(props: NpcCompanyDefinitionProps) {
    this.id = props.id;
    this.companyId = props.companyId;
    this.name = props.name;
    this.ownerId = props.ownerId;
    this.strategyDefinitionId = props.strategyDefinitionId;
    this.tags = Object.freeze([...props.tags]);
    this.enabled = props.enabled;
    this.version = props.version;
    Object.freeze(this);
  }
}
