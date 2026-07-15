# Style Review Process

**Project:** Project Genesis
**Version:** 1.0
**Status:** Active
**Last Updated:** 2026-07-15

---

# Purpose

This document defines the official review and approval process for every visual asset, document and content element created for Project Genesis.

The review process ensures consistency, quality and maintainability across the entire project while supporting AI-assisted content generation and automated validation.

No asset enters the game without successfully completing this review process.

---

# Goals

The review process guarantees:

- visual consistency
- gameplay consistency
- architectural compliance
- documentation completeness
- technical correctness
- performance requirements
- accessibility compliance
- AI reproducibility

---

# Scope

The process applies to:

- Buildings
- Resources
- Vehicles
- NPCs
- Effects
- Map Objects
- UI Assets
- Icons
- Animations
- Audio Assets
- Scenarios
- Documentation
- AI Prompt Templates

---

# Review Philosophy

Reviews are intended to improve quality rather than assign blame.

Every review should be:

- objective
- repeatable
- transparent
- documented
- constructive

Every decision must be traceable.

---

# Review Workflow

```text
Idea

↓

Specification

↓

Concept

↓

AI Generation

↓

Self Review

↓

Technical Validation

↓

Style Review

↓

Architecture Review

↓

Approval

↓

Registry Update

↓

Implementation
```

Every stage must be completed before the next begins.

---

# Review Stages

## Stage 1 — Specification

Verify:

- requirements complete
- Asset ID assigned
- documentation available
- dependencies defined

---

## Stage 2 — AI Generation

Verify:

- prompt follows Prompt Library
- generated asset matches specification
- output is reproducible

---

## Stage 3 — Self Review

Creator verifies:

- naming
- proportions
- readability
- consistency
- completeness

Self review is mandatory.

---

## Stage 4 — Technical Validation

Automatic validation checks:

- file naming
- Asset ID
- version
- metadata
- dependencies
- registry entry
- LOD availability
- naming conventions

No manual approval is required if all checks pass.

---

## Stage 5 — Style Review

Compare against:

- ART_DIRECTION.md
- VISUAL_LANGUAGE.md
- COLOR_PALETTE.md
- Typography
- Style Guides
- Asset Libraries

Review questions:

- Does it match the visual language?
- Is it recognizable?
- Is it readable?
- Is the scale correct?
- Is it consistent with similar assets?

---

## Stage 6 — Architecture Review

Verify:

- registry integration
- dependency correctness
- documentation
- implementation readiness
- automation compatibility

---

## Stage 7 — Approval

An approved asset:

- receives Approved status
- is entered into the registry
- becomes available for implementation

---

# Review Roles

| Role | Responsibility |
|------|----------------|
| Designer | Visual quality |
| Technical Artist | Technical correctness |
| Gameplay Designer | Gameplay consistency |
| Architect | Architecture compliance |
| QA | Validation |
| AI Reviewer | Prompt reproducibility |

One person may fulfill multiple roles in small teams.

---

# Automated Checks

The review pipeline should automatically verify:

- duplicate IDs
- duplicate names
- invalid version
- missing metadata
- invalid dependencies
- missing localization
- missing documentation
- inconsistent categories
- naming violations

Automation should reject invalid assets before manual review.

---

# Review Checklist

Every asset should answer "Yes" to the following questions:

## Identity

- Has a valid Asset ID?
- Registered?
- Correct version?

## Documentation

- Style Guide referenced?
- Library entry exists?
- Metadata complete?

## Visual Quality

- Matches art direction?
- Correct proportions?
- Consistent colors?
- Readable at all zoom levels?

## Technical Quality

- Correct naming?
- LODs available?
- Performance acceptable?
- Dependencies valid?

## Gameplay

- Supports intended mechanics?
- Correct category?
- Correct interactions?

---

# Approval Status

| Status | Meaning |
|---------|----------|
| Draft | Work in progress |
| Review | Awaiting review |
| Approved | Ready for implementation |
| Implemented | In the game |
| Deprecated | No longer maintained |
| Archived | Historical only |

---

# Rejection Process

Assets may be rejected for:

- inconsistent style
- incorrect metadata
- missing documentation
- technical defects
- gameplay conflicts
- performance issues

Rejected assets return to the creator for revision.

---

# Registry Integration

Every approval updates:

- Global Asset Registry
- Version information
- Dependency data
- Documentation references

The registry remains the authoritative source.

---

# CI/CD Integration

Continuous Integration should automatically execute:

```text
Validate

↓

Style Check

↓

Dependency Check

↓

Registry Check

↓

Documentation Check

↓

Approve Build
```

Any failed validation blocks the build.

---

# Metrics

The review system should track:

- review duration
- approval rate
- rejection rate
- recurring issues
- asset quality trends
- automation coverage

These metrics help improve the production pipeline.

---

# Continuous Improvement

The review process itself should be reviewed regularly.

Possible improvements:

- additional automation
- updated quality criteria
- improved AI prompts
- faster validation
- new checklists

---

# Related Documents

- ART_DIRECTION.md
- VISUAL_LANGUAGE.md
- ASSET_ID_SYSTEM.md
- ASSET_VERSIONING.md
- GLOBAL_ASSET_REGISTRY.md
- DEPENDENCY_MATRIX.md
- AI_PROMPT_LIBRARY.md
- CONTENT_PIPELINE.md
- QUALITY_CHECKLIST.md

---

# Summary

The Style Review Process defines the mandatory quality assurance workflow for every asset in Project Genesis.

By combining automated validation, structured reviews and centralized registry updates, the project ensures consistent visual quality, technical reliability and architectural integrity while providing a scalable workflow for both human contributors and AI-assisted development.