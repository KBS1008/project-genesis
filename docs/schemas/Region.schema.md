# Region.schema.md

**Version:** 1.0  
**Status:** Active  
**Asset Type:** Region  
**Schema Version:** 1

---

# Purpose

Defines the static content contract for region assets in Project Genesis.

Regions belong to a world, reference a biome, embed regional resource availability (Option A), and link to cities and neighbors.

---

# Required Fields

| Field               | Type     | Description                                   |
| ------------------- | -------- | --------------------------------------------- |
| `id`                | string   | Global identifier (`^[a-z0-9_]+$`)            |
| `name`              | string   | Display name                                  |
| `description`       | string   | Region description                            |
| `worldId`           | string   | Parent world reference                        |
| `biomeId`           | string   | Biome reference                               |
| `mapPosition`       | object   | `{ x: number, y: number }` layout coordinates |
| `neighborRegionIds` | string[] | Adjacent regions (unique, sorted)             |
| `cityIds`           | string[] | Cities in this region (unique, sorted)        |
| `regionalResources` | array    | Regional resource availability entries        |
| `enabled`           | boolean  | Whether the region is active                  |
| `version`           | number   | Content schema version (minimum 1)            |

---

# Regional Resource Entry

| Field                | Type    | Description                                      |
| -------------------- | ------- | ------------------------------------------------ |
| `resourceTypeId`     | string  | Resource type reference                          |
| `available`          | boolean | Whether the resource is available in this region |
| `extractionModifier` | number  | Multiplier (minimum 0.01)                        |

Option A: availability only — no depletion or regeneration state in v1.

---

# Example

```yaml
id: region_default
name: Central Basin
description: Starter region with balanced resources.
worldId: world_default
biomeId: biome_temperate_forest
mapPosition:
  x: 0
  y: 0
neighborRegionIds:
  - region_east
  - region_north
cityIds:
  - city_port_harbor
regionalResources:
  - resourceTypeId: wood
    available: true
    extractionModifier: 1.0
enabled: true
version: 1
```

---

# Cross-References

- `worldId` → `WorldRegistry`
- `biomeId` → `BiomeRegistry`
- `neighborRegionIds[]`, `cityIds[]` → validated post-load
- `regionalResources[].resourceTypeId` → `ResourceTypeRegistry`

---

# Related Documentation

- `docs/development/M7_WORLD_SIMULATION_GAP_AUDIT.md`
