# Strategy.schema.md

**Version:** 1.0  
**Status:** Active  
**Asset Type:** Strategy  
**Schema Version:** 1

---

# Purpose

Defines the content contract for company strategy profiles used by the Company Brain during M8 planning.

Strategies modify planning weights only. They never implement custom algorithms or bypass application use cases.

---

# Required Fields

| Field         | Type    | Description                                |
| ------------- | ------- | ------------------------------------------ |
| `id`          | string  | Global identifier (`^[a-z0-9_]+$`)         |
| `name`        | string  | Display name                               |
| `description` | string  | Strategy description                       |
| `profile`     | string  | Strategy profile label                     |
| `weights`     | object  | Planning weight profile (see below)        |
| `enabled`     | boolean | Whether the strategy is active in content  |
| `version`     | number  | Content schema version (minimum 1)         |

---

# Weights Object

All weight fields are numbers from 0 to 100 inclusive.

| Field                 | Description                                      |
| --------------------- | ------------------------------------------------ |
| `expansionWeight`     | Preference for regional expansion                |
| `productionWeight`    | Preference for production investment             |
| `tradingWeight`       | Preference for market trading                    |
| `researchWeight`      | Preference for technology research               |
| `riskTolerance`       | Willingness to accept risky investments          |
| `liquidityPreference` | Preference for maintaining cash reserves         |

---

# Example

```yaml
id: strategy_balanced
name: Balanced
description: Evenly weights production, trading, research, and expansion.
profile: BALANCED
weights:
  expansionWeight: 50
  productionWeight: 50
  tradingWeight: 50
  researchWeight: 50
  riskTolerance: 50
  liquidityPreference: 50
enabled: true
version: 1
```

---

# Related Documentation

- `docs/architecture/decisions/DD-0XX_COMPANY_BRAIN_AND_DECISION_QUEUE.md`
- `docs/project-management/M8_ECONOMY_SIMULATION_PLAN.md`
