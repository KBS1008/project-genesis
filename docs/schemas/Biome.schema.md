# Biome.schema.md

**Version:** 1.0  
**Status:** Active  
**Asset Type:** Biome  
**Schema Version:** 1

---

# Purpose

Defines the minimal v1 content contract for biome assets in Project Genesis.

Biomes provide construction and transport modifiers consumed by policies in later M7 work packages. Climate, wildlife, hazards and seasons are out of scope for v1.

---

# Required Fields

| Field                       | Type    | Description                                  |
| --------------------------- | ------- | -------------------------------------------- |
| `id`                        | string  | Global identifier (`^[a-z0-9_]+$`)           |
| `name`                      | string  | Display name                                 |
| `description`               | string  | Biome description                            |
| `category`                  | string  | Biome category label                         |
| `constructionCostModifier`  | number  | Construction cost multiplier (minimum 0.01)  |
| `transportDurationModifier` | number  | Transport duration multiplier (minimum 0.01) |
| `enabled`                   | boolean | Whether the biome is active                  |
| `version`                   | number  | Content schema version (minimum 1)           |

---

# Example

```yaml
id: biome_temperate_forest
name: Temperate Forest
description: Mixed woodland with moderate overhead.
category: FOREST
constructionCostModifier: 1.1
transportDurationModifier: 1.05
enabled: true
version: 1
```

---

# Related Documentation

- `docs/project-management/Biome.schema.md` (broader future scope)
- `docs/development/M7_WORLD_SIMULATION_GAP_AUDIT.md`
