# City.schema.md

**Version:** 1.0  
**Status:** Active  
**Asset Type:** City  
**Schema Version:** 1

---

# Purpose

Defines the static content contract for city assets in Project Genesis.

Cities are infrastructure nodes bound to a region. They support later read models and map connectivity without implementing NPC economy (M8).

---

# Required Fields

| Field      | Type    | Description                        |
| ---------- | ------- | ---------------------------------- |
| `id`       | string  | Global identifier (`^[a-z0-9_]+$`) |
| `name`     | string  | Display name                       |
| `regionId` | string  | Parent region reference            |
| `category` | string  | One of `MARKET_HUB`, `INDUSTRIAL`  |
| `enabled`  | boolean | Whether the city is active         |
| `version`  | number  | Content schema version (minimum 1) |

---

# Example

```yaml
id: city_port_harbor
name: Port Harbor
regionId: region_default
category: MARKET_HUB
enabled: true
version: 1
```

---

# Cross-References

- `regionId` → `RegionRegistry`
- City must appear in the parent region's `cityIds`

---

# Related Documentation

- `docs/development/M7_WORLD_SIMULATION_GAP_AUDIT.md`
