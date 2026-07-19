# Content Module

The `content` module is responsible for loading, validating and registering all game content used by Project Genesis.

It provides the bridge between static content files and the executable simulation.

The Content Module contains **no business logic**.

---

# Purpose

Project Genesis follows a **Data-Driven Design**.

Gameplay data is defined outside the source code and loaded during application startup.

The Content Module transforms external data into validated domain-ready objects.

---

# Responsibilities

The Content Module is responsible for:

- Content discovery
- File loading
- Parsing
- Schema validation
- Content registration
- Localization loading
- Version compatibility checks

---

# Guiding Principles

The Content Module should always be:

- deterministic
- data-driven
- extensible
- independent of gameplay rules
- easy to validate
- modding-friendly

---

# Relationship to game-content/

The actual gameplay data is stored outside `src/`.

Example:

```text
game-content/

buildings/
recipes/
resources/
technologies/
regions/
companies/
world/
```

The Content Module loads and validates these files.

---

# Planned Structure

```text
content/

loader/
parser/
registry/
validation/
localization/
schema/
cache/
```

The structure may evolve during implementation.

---

# Content Loading Pipeline

Typical loading sequence:

```text
Discover Files

↓

Load Files

↓

Parse Data

↓

Validate Schema

↓

Resolve References

↓

Register Content

↓

Expose Read-Only Registry
```

Every step should be deterministic.

---

# Parsing

The parser converts external files into strongly typed objects.

Supported formats may include:

- YAML
- JSON

Additional formats may be added in the future if required.

---

# Validation

Every content file must be validated before becoming available to the game.

Validation includes:

- schema validation
- required fields
- identifier uniqueness
- reference resolution
- semantic validation

Invalid content must prevent startup.

---

# Registry

After validation, content is stored inside registries.

Examples:

```text
BuildingTypeRegistry

RecipeRegistry

ResourceTypeRegistry

TechnologyRegistry
```

Registries provide read-only access.

## Implemented registries

| Registry               | Loader               | Content path              |
| ---------------------- | -------------------- | ------------------------- |
| `ResourceTypeRegistry` | `ResourceTypeLoader` | `game-content/resources/` |
| `BuildingTypeRegistry` | `BuildingTypeLoader` | `game-content/buildings/` |
| `RecipeRegistry`       | `RecipeLoader`       | `game-content/recipes/`   |

See `docs/development/IMPLEMENTATION_PROGRESS.md` for full implementation status.

---

# Localization

Localized text should be loaded separately from gameplay data.

Examples:

- building names
- descriptions
- technology names
- UI text

Localization should never affect simulation logic.

---

# References

Content objects frequently reference one another.

Examples:

Recipe

↓

Resource

↓

Building

↓

Technology

The Content Module resolves these references before the simulation begins.

---

# Versioning

Content versions should be explicitly supported.

Possible future capabilities:

- migration
- compatibility checks
- deprecated fields
- schema evolution

---

# Modding Support

The architecture should allow additional content packs.

Possible sources:

```text
game-content/

mods/
```

Mods should pass the same validation pipeline as official content.

---

# Dependency Rules

The Content Module may depend on:

- Common

It may expose validated objects to:

- Application
- Domain
- Simulation

The Content Module must not implement business rules.

---

# Error Handling

Content validation should report:

- file name
- line (when available)
- validation rule
- offending identifier
- suggested correction (where possible)

Error messages should be understandable by content creators.

---

# Testing

Recommended tests:

- parser tests
- schema validation
- registry tests
- reference resolution
- duplicate detection
- localization loading

Sample content should be included in test fixtures.

---

# Future Extensions

Potential future features:

- hot reload during development
- incremental loading
- editor integration
- asset dependency graph
- automatic documentation generation

These features should not compromise deterministic loading.

---

# Related Documentation

- docs/gameplay/
- docs/schemas/
- docs/architecture/domain-model.md
- docs/architecture/component-diagram.md
- docs/decisions/DD-001-resource-graph.md
- docs/decisions/DD-004-common-schema.md
- docs/decisions/DD-011-recipe-based-production.md
- docs/decisions/DD-031-game-content-organization.md

---

# Summary

The Content Module transforms external game data into validated, strongly typed objects that can safely be consumed by the application and simulation.

It is the foundation of the project's data-driven architecture and plays a key role in supporting deterministic execution, maintainability and future modding capabilities.
