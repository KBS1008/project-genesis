# World.schema.md

**Version:** 1.0  
**Status:** Active  
**Asset Type:** World  
**Schema Version:** 1

---

# Purpose

Defines the static content contract for world assets in Project Genesis.

A world groups regions into one playable simulation space. Worlds are loaded via `WorldLoader` and registered in `WorldRegistry`.

---

# Required Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Global identifier (`^[a-z0-9_]+$`) |
| `name` | string | Display name |
| `regionIds` | string[] | Unique, sorted region references (validated post-load) |
| `enabled` | boolean | Whether the world is active |
| `version` | number | Content schema version (minimum 1) |

---

# Example

```yaml
id: world_default
name: Genesis World
regionIds:
  - region_default
  - region_east
  - region_north
enabled: true
version: 1
```

---

# Cross-References

- Each `regionIds` entry must resolve to a `RegionDefinition`.
- Each referenced region must list this world in `worldId` and appear in the world's `regionIds`.

---

# Related Documentation

- `docs/development/M7_WORLD_SIMULATION_GAP_AUDIT.md`
- `docs/project-management/M7_WORLD_SIMULATION_PLAN.md`
