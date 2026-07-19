# Map.schema.md

**Version:** 1.0  
**Status:** Active  
**Asset Type:** Map  
**Schema Version:** 1

---

# Purpose

Defines the static content contract for abstract world map layouts in Project Genesis.

Maps describe region positions and inter-region connections. There is no tile grid, pathfinding or physical vehicle simulation in v1.

---

# Required Fields

| Field         | Type    | Description                           |
| ------------- | ------- | ------------------------------------- |
| `id`          | string  | Global identifier (`^[a-z0-9_]+$`)    |
| `name`        | string  | Display name                          |
| `regions`     | array   | Region placements on the abstract map |
| `connections` | array   | Inter-region connections              |
| `enabled`     | boolean | Whether the map is active             |
| `version`     | number  | Content schema version (minimum 1)    |

---

# Region Placement

| Field      | Type   | Description      |
| ---------- | ------ | ---------------- |
| `regionId` | string | Region reference |
| `x`        | number | Map x coordinate |
| `y`        | number | Map y coordinate |

---

# Connection

| Field          | Type   | Description                                  |
| -------------- | ------ | -------------------------------------------- |
| `fromRegionId` | string | Source region                                |
| `toRegionId`   | string | Destination region (must differ from source) |
| `distance`     | number | Abstract distance (minimum 1)                |

---

# Example

```yaml
id: map_world_default
name: Genesis World Map
regions:
  - regionId: region_default
    x: 0
    y: 0
connections:
  - fromRegionId: region_default
    toRegionId: region_east
    distance: 2
enabled: true
version: 1
```

---

# Cross-References

- `regions[].regionId` and connection endpoints → `RegionRegistry`

---

# Related Documentation

- `docs/development/M7_WORLD_SIMULATION_GAP_AUDIT.md`
