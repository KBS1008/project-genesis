# Asset Versioning

**Project:** Project Genesis
**Version:** 1.0
**Status:** Active
**Last Updated:** 2026-07-14

---

# Purpose

This document defines the versioning strategy for every asset in Project Genesis.

Asset versioning allows assets to evolve over time while maintaining compatibility with save games, tooling, documentation and AI-assisted workflows.

The Asset ID identifies _which_ asset exists.

The asset version identifies _which revision_ of that asset is currently implemented.

---

# Design Goals

The versioning system must be:

- deterministic
- human-readable
- automation-friendly
- source-control friendly
- compatible with CI/CD
- compatible with save games
- compatible with future modding

---

# General Rules

Every asset has:

- one permanent Asset ID
- one current version
- optional historical versions

The Asset ID never changes.

Only the version changes.

---

# Version Format

Versions follow Semantic Versioning (SemVer).

```
MAJOR.MINOR.PATCH
```

Example

```
1.0.0
1.1.0
1.2.3
2.0.0
```

---

# Version Meaning

## Major

Increase when:

- visual redesign
- gameplay changes
- incompatible implementation
- asset replacement

Example

```
1.0.0

↓

2.0.0
```

---

## Minor

Increase when:

- new LOD
- additional animation
- improved textures
- optimization
- additional metadata

Example

```
1.0.0

↓

1.1.0
```

---

## Patch

Increase when:

- bug fixes
- UV corrections
- collision fixes
- material fixes
- metadata corrections

Example

```
1.1.0

↓

1.1.1
```

---

# Asset Identity

The Asset ID remains independent from its version.

Correct

```
BLD-0015
Version: 1.2.0
```

Incorrect

```
BLD-0015-v3
```

Version numbers never become part of the Asset ID.

---

# File Naming

Version numbers should not appear in production filenames.

Correct

```
BLD-0015-SteelMill.glb
```

Incorrect

```
SteelMill_Final_v7.glb
```

Version history is tracked separately.

---

# Version History

Every asset should maintain a changelog.

Example

| Version | Description            |
| ------- | ---------------------- |
| 1.0.0   | Initial implementation |
| 1.1.0   | Added winter variant   |
| 1.2.0   | Improved LOD models    |
| 1.2.1   | Fixed collision mesh   |

---

# Asset Lifecycle

```text
Concept

↓

Prototype

↓

Approved

↓

Implemented

↓

Improved

↓

Deprecated

↓

Archived
```

Every version belongs to one lifecycle stage.

---

# Save Game Compatibility

Save games reference:

- Asset ID

Never:

- filenames
- temporary names
- version-specific filenames

When loading:

```
Asset ID

↓

Latest Compatible Version
```

Migration rules determine compatibility.

---

# Breaking Changes

Major versions require migration rules.

Example

```
Building Size Changed

↓

Save Game Migration

↓

Validation

↓

Load Complete
```

If migration is impossible, the build must reject incompatible save games.

---

# AI Asset Generation

AI-generated improvements create new versions.

Example

```
Version 1.0.0

↓

AI creates improved textures

↓

Version 1.1.0
```

The Asset ID remains unchanged.

---

# Deprecation

Deprecated assets retain:

- Asset ID
- Version history
- Documentation
- Migration path

Deprecated assets must never disappear from the registry.

---

# Validation Rules

The build pipeline should verify:

- valid version format
- monotonic version progression
- duplicate versions
- missing changelog
- invalid downgrade
- migration availability

---

# Future Automation

The versioning system should support:

- automatic changelog generation
- release notes
- asset migration reports
- compatibility reports
- registry synchronization
- CI validation
- editor integration

---

# Integration with Registry

The Global Asset Registry should store:

| Field           | Example     |
| --------------- | ----------- |
| Asset ID        | BLD-0015    |
| Current Version | 1.2.0       |
| Lifecycle       | Implemented |
| Created         | 2026-05-01  |
| Updated         | 2026-07-14  |
| Deprecated      | false       |

---

# Relationship to Other Documents

- ASSET_ID_SYSTEM.md
- DEPENDENCY_MATRIX.md
- BUILDING_LIBRARY.md
- RESOURCE_LIBRARY.md
- VEHICLE_LIBRARY.md
- NPC_LIBRARY.md
- EFFECT_LIBRARY.md
- MAP_OBJECT_LIBRARY.md

---

# Summary

The Asset Versioning strategy ensures that every asset in Project Genesis can evolve safely without losing its identity.

By separating permanent Asset IDs from semantic versions, the project gains stable references, reliable save-game compatibility, automated tooling support and a scalable foundation for future development, expansions and modding.
