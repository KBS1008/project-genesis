# AI Prompt Library

**Project:** Project Genesis
**Version:** 1.0
**Status:** Active
**Last Updated:** 2026-07-15

---

# Purpose

The AI Prompt Library defines the official prompt framework used for AI-assisted content creation in Project Genesis.

Rather than storing individual prompts, this document establishes reusable templates, conventions and quality standards that ensure consistent output across different AI models and content types.

The Prompt Library supports image generation, text generation, code generation and future AI-assisted workflows.

---

# Objectives

The Prompt Library shall:

- standardize AI prompts
- improve output consistency
- reduce prompt duplication
- support multiple AI providers
- simplify prompt maintenance
- improve reproducibility
- enable future automation

---

# Supported AI Systems

The prompt framework is designed to work with:

- ChatGPT
- Cursor AI
- Claude
- Gemini
- Flux
- Stable Diffusion
- Midjourney
- DALL·E
- future AI systems

The prompts should remain model-agnostic whenever possible.

---

# Prompt Philosophy

Every prompt should be:

- clear
- deterministic
- reusable
- modular
- concise
- complete
- context-aware

Prompts should describe the desired outcome rather than the implementation process.

---

# Prompt Structure

Every prompt follows the same structure.

```text
Role

↓

Task

↓

Context

↓

Constraints

↓

Required Output

↓

Quality Criteria
```

---

# Standard Prompt Template

```text
ROLE

You are...

TASK

Create...

CONTEXT

The asset belongs to...

CONSTRAINTS

Follow:

- Art Direction
- Visual Language
- Color Palette
- Style Guide

OUTPUT

Return...

QUALITY

Ensure...
```

---

# Prompt Categories

The library supports:

- Buildings
- Resources
- Vehicles
- NPCs
- Effects
- Map Objects
- UI
- Icons
- Documentation
- Architecture
- Code
- Tests

Each category may define additional template variables.

---

# Context References

Prompts should reference project documentation instead of repeating requirements.

Example

```
Follow:

ART_DIRECTION.md

BUILDING_STYLE_GUIDE.md

COLOR_PALETTE.md
```

This avoids duplication.

---

# Asset Prompt Template

```text
ROLE

Senior Game Artist

TASK

Create a game-ready asset.

CONTEXT

Asset ID:
Category:
Gameplay Purpose:

STYLE

Use the official Style Guide.

OUTPUT

High-quality concept art suitable for Project Genesis.
```

---

# Documentation Prompt Template

```text
ROLE

Senior Technical Writer

TASK

Create documentation.

CONTEXT

Reference existing project architecture.

OUTPUT

Professional Markdown documentation.

QUALITY

Follow Documentation First.
```

---

# Code Prompt Template

```text
ROLE

Senior Software Engineer

TASK

Implement a production-ready system.

CONTEXT

Use project architecture.

OUTPUT

Clean, documented, testable code.

CONSTRAINTS

Do not violate architecture decisions.
```

---

# Review Prompt Template

```text
ROLE

Technical Reviewer

TASK

Review the asset.

VERIFY

Architecture

Style

Naming

Dependencies

Performance

OUTPUT

Review report.
```

---

# Prompt Variables

Reusable variables include:

| Variable        | Description         |
| --------------- | ------------------- |
| Asset ID        | Registry identifier |
| Category        | Asset type          |
| Style Guide     | Applicable guide    |
| Version         | Asset version       |
| Biome           | Environment         |
| Technology Tier | Unlock level        |
| Gameplay Role   | Purpose             |
| Quality Level   | Target quality      |

Variables should be inserted automatically where possible.

---

# Prompt Chaining

Complex tasks should be split into multiple prompts.

Example

```text
Specification

↓

Concept

↓

Review

↓

Revision

↓

Approval
```

Each prompt has a single responsibility.

---

# AI Safety

Prompts should:

- avoid ambiguity
- avoid conflicting instructions
- avoid undocumented assumptions
- avoid duplicated requirements

Every prompt should produce reproducible results.

---

# Prompt Versioning

Prompt templates follow Semantic Versioning.

Major updates:

- structural changes

Minor updates:

- additional sections

Patch updates:

- wording improvements

---

# Prompt Validation

Every prompt should be checked for:

- completeness
- clarity
- consistency
- missing context
- conflicting instructions

Prompt validation should become automated where possible.

---

# Integration

The Prompt Library integrates with:

- ART_DIRECTION.md
- STYLE_REVIEW_PROCESS.md
- CONTENT_PIPELINE.md
- GLOBAL_ASSET_REGISTRY.md
- REGISTRY_SCHEMA.md

Prompts should reference these documents instead of duplicating them.

---

# Future Automation

Future tooling should support:

- automatic prompt generation
- registry-based prompt filling
- prompt validation
- prompt version tracking
- prompt analytics
- AI provider selection
- batch prompt generation

---

# Related Documents

- AI_WORKFLOW.md
- CONTENT_PIPELINE.md
- STYLE_REVIEW_PROCESS.md
- GLOBAL_ASSET_REGISTRY.md
- REGISTRY_SCHEMA.md

---

# Summary

The AI Prompt Library establishes the official prompt framework for Project Genesis.

By defining reusable templates, standardized structures and consistent quality requirements, it enables reliable AI-assisted creation of assets, documentation and code while remaining independent of specific AI providers.
