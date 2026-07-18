/**
 * @module @content/employee/EmployeeDefinition
 *
 * Immutable static definition of an employee type loaded from game content.
 *
 * @see docs/schemas/Employee.schema.md
 * @see docs/decisions/DD-015-static-definitions-vs-dynamic-state.md
 */

/** Employee category values from gameplay and schema documentation. */
export const EmployeeCategory = {
  PRODUCTION: 'production',
  ENGINEERING: 'engineering',
  RESEARCH: 'research',
  ADMINISTRATION: 'administration',
  LOGISTICS: 'logistics',
} as const;

export type EmployeeCategory = (typeof EmployeeCategory)[keyof typeof EmployeeCategory];

/** Optional statistical profile for an employee type. */
export type EmployeeStatistics = {
  readonly productivity: number;
  readonly efficiency: number;
  readonly stamina: number;
  readonly intelligence: number;
  readonly reliability: number;
};

/** Optional hiring prerequisites for an employee type. */
export type EmployeeRequirements = {
  readonly research: readonly string[];
  readonly buildings: readonly string[];
};

/** Validated properties of a static employee type definition. */
export type EmployeeDefinitionProps = {
  readonly id: string;
  readonly version: number;
  readonly displayName: string;
  readonly category: EmployeeCategory;
  readonly profession: string;
  readonly cost: number;
  readonly salary: number;
  readonly productivity: number;
  readonly description: string;
  readonly statistics: EmployeeStatistics | undefined;
  readonly traits: readonly string[];
  readonly requirements: EmployeeRequirements;
  readonly tags: readonly string[];
  readonly localizationKey: string | undefined;
  readonly enabled: boolean;
};

/**
 * Immutable static employee type loaded from content files.
 */
export class EmployeeDefinition {
  readonly id: string;
  readonly version: number;
  readonly displayName: string;
  readonly category: EmployeeCategory;
  readonly profession: string;
  readonly cost: number;
  readonly salary: number;
  readonly productivity: number;
  readonly description: string;
  readonly statistics: EmployeeStatistics | undefined;
  readonly traits: readonly string[];
  readonly requirements: EmployeeRequirements;
  readonly tags: readonly string[];
  readonly localizationKey: string | undefined;
  readonly enabled: boolean;

  constructor(props: EmployeeDefinitionProps) {
    this.id = props.id;
    this.version = props.version;
    this.displayName = props.displayName;
    this.category = props.category;
    this.profession = props.profession;
    this.cost = props.cost;
    this.salary = props.salary;
    this.productivity = props.productivity;
    this.description = props.description;
    this.statistics =
      props.statistics === undefined ? undefined : Object.freeze({ ...props.statistics });
    this.traits = Object.freeze([...props.traits]);
    this.requirements = Object.freeze({
      research: Object.freeze([...props.requirements.research]),
      buildings: Object.freeze([...props.requirements.buildings]),
    });
    this.tags = Object.freeze([...props.tags]);
    this.localizationKey = props.localizationKey;
    this.enabled = props.enabled;
    Object.freeze(this);
  }
}
