# POST-V1 — WBM-001 World Map Building Marker Integration

## Mode

BOUNDED RUNTIME VISUAL INTEGRATION.

Implement one complete close candidate.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

No commit.
No push.
No tag.

---

# 1. Authority

The following tracks are SEALED:

- ICON-001 Resources
- ICON-002 Building Categories
- ICON-003 Building Visual Identity — 23/23
- ICON-004 Technology Visual Identity — 22/22
- ICON-005 Production Process Visual Identity — 7/7
- World Visual Presentation Slice 1

Do not reopen or regenerate them.

Scenario-B Visual Coverage Progress Review 02 selected:

> WBM-001 — World Map Building Marker Integration

as the next material visual workstream.

This is an integration/reuse task.

ZERO new authored art is expected.

---

# 2. Problem

The World map already has a mature procedural visual language:

- biome presentation
- region presentation
- route curves
- minimap
- overlays

But building instances are still represented primarily as anonymous circle markers.

Meanwhile ICON-003 already provides production-approved compact visual identities for all 23 enabled building types.

The missing connection is:

Building instance
→ buildingTypeId
→ ICON-003 compact identity
→ World marker

The objective is:

> Make the player's industrial footprint visually recognizable on the World map without changing World semantics or creating new building art.

---

# 3. Important Adjustment to Review Proposal

The review proposed five representative building types for Phase 1.

Interpret those five as the mandatory HUMAN VISUAL VALIDATION SET.

Do NOT hard-code WBM-001 to five building IDs.

The implementation architecture must be generic:

> any production-approved ICON-003 building type should resolve automatically to its compact World marker.

Therefore:

- implementation target = generic 23/23 capability
- visual evidence target = minimum 5 representative types
- no per-ID World map switch statement
- no duplicated building-type map
- no later Phase 2 merely to add the remaining IDs

If the existing production registry can already provide all 23 mappings, use it.

---

# 4. Baseline

Before editing record:

- HEAD
- branch
- git status
- relevant World files
- relevant ICON-003 registry/resolver files

The previous review recorded unrelated working-tree churn.

Do not absorb unrelated modifications into this task.

Clearly separate:

- task-owned changes
- predecessor changes
- unrelated churn

---

# 5. Inspect Before Editing

Verify the actual current implementation of:

- `PGWorldCanvas.tsx`
- `world-overlay-mappers.ts`
- World marker view-data types
- building read-model DTO/view model
- `BuildingTypeIcon`
- ICON-003 registry/resolver
- compact asset loading
- marker selection/hit testing
- World layer toggles
- minimap behavior

Do not rely only on the review report if HEAD has changed.

---

# 6. Data Contract

Ensure World building marker view-data contains enough information to resolve the correct visual identity.

At minimum this likely requires:

- building instance ID
- buildingTypeId
- position
- selection/state information already required by World
- category only if genuinely useful

Do not add fields merely because the review suggested them.

Prefer the smallest authoritative contract.

The source of truth for visual identity remains the existing ICON-003 production registry/resolver.

Do NOT create a second World-specific building-ID → asset mapping.

---

# 7. Marker Visual

Replace or augment the anonymous building circle with the appropriate ICON-003 compact identity.

Default visual:

> ICON-003 compact building glyph

NOT:

- full 1024px primary art
- category-only ICON-002 icon when a valid compact exists
- newly generated marker art

The compact should remain recognizable without dominating the region.

---

# 8. All 23 Types

The resolver/integration must be capable of displaying all current production-approved ICON-003 building types.

Programmatically verify:

- enabled building types = expected authoritative set
- production ICON-003 compact mappings = complete
- World marker resolver can consume every mapped type

Expected current coverage if content is unchanged:

23 / 23

Do not hard-code the number if authoritative content changed.

Report actual current count.

---

# 9. Representative Human-Gate Set

Runtime evidence MUST contain at least five semantically diverse building types.

Prefer, if current content still supports them:

- `sawmill`
- `coal_power_plant`
- `warehouse`
- `research_campus`
- `port`

This intentionally exercises:

- ordinary volumetric building identities
- industrial silhouettes
- storage identity
- research identity
- TERMINAL/YARD infrastructure grammar

If one cannot be instantiated in the runtime evidence save without gameplay manipulation outside scope, substitute another type and document why.

Do not alter gameplay/content merely to force the exact examples.

---

# 10. Infrastructure Grammar

Pay special attention to:

- access_road — LINEAR
- port — TERMINAL/YARD
- rail_terminal — TERMINAL/YARD

Their compact assets are valid ICON-003 identities.

Do not redesign them.

If minor marker sizing differences are required for readability, implement them through a small reusable presentation rule rather than asset-specific hacks.

Do not invent orientation semantics for `access_road`.

---

# 11. Marker Size

The marker must balance:

- recognition
- map readability
- density
- click/tap usability
- region visibility

Test realistic marker sizes.

Do not simply render the compact at its original design size.

The World map may need a bounded visual wrapper around the compact.

Allowed:

- subtle marker plate
- restrained outline
- selection ring
- hover/focus treatment

only if consistent with existing World visual language.

Do NOT create a new broad marker art direction.

---

# 12. Selection and Interaction

Existing behavior must remain functional.

Preserve:

- marker click/select
- selected building state
- region interaction
- layer visibility toggles
- camera interaction
- pan/zoom
- keyboard behavior where currently supported

Do not make the visible image smaller than the practical interaction target.

A transparent or surrounding hit target may remain larger than the visual glyph.

---

# 13. Density / Overlap

Buildings may share a region/cell.

Use the existing deterministic marker distribution unless a tiny task-local adjustment is required.

Do not redesign World geography.

Validate representative density including multiple buildings in one region.

The result must not become:

- a pile of overlapping icons
- an unreadable icon cloud
- giant building artwork covering biome information

If the existing distribution supports the compact glyphs cleanly, leave it unchanged.

---

# 14. Fallback

Retain a defensive fallback for:

- unknown buildingTypeId
- missing asset
- unsupported future type

Fallback must:

- preserve World rendering
- remain clickable
- not produce a broken image
- not create an empty marker

Prefer the existing generic/category fallback architecture where suitable.

Do not silently crash.

---

# 15. Performance

Do not introduce 1024px primary images onto the map.

Use compact production assets.

Avoid unnecessary repeated resolution/work during render if the current architecture provides memoized/static registry lookup.

Do not introduce a new asset-loading framework.

---

# 16. Minimap

Do NOT automatically place building compact icons in the minimap.

The minimap currently has its own sealed visual language.

Only modify it if the current World architecture already mirrors building markers there and the change is unavoidable.

Otherwise leave minimap behavior unchanged.

Document the decision.

---

# 17. World Slice 1 Firewall

Do NOT change:

- biome palette
- biome patterns
- map plate
- route art direction
- region geometry
- region topology
- camera semantics
- grid defaults
- minimap visual language
- legend
- geography model

This task only addresses building-marker identity.

---

# 18. ICON-003 Firewall

Do NOT:

- regenerate building primaries
- regenerate compacts
- edit approved building art
- create new building art
- change ICON-003 art direction
- reclassify infrastructure
- change the 23/23 production contract

Consume the sealed assets.

---

# 19. Gameplay / Content Firewall

Do NOT modify:

- building YAML
- region YAML
- city YAML
- biome YAML
- save semantics
- placement rules
- building coordinates
- building ownership rules
- production
- research
- economy
- transport simulation
- balance

This is presentation integration only.

---

# 20. Focused Tests

Add/update focused tests for the actual architecture.

At minimum verify:

1. marker view-data preserves `buildingTypeId`
2. known building type resolves to correct compact identity
3. multiple different types remain distinguishable in mapped data
4. unknown type gets safe fallback
5. selection identity remains stable
6. existing marker position/distribution semantics remain unchanged
7. all production-approved current building types are resolvable

Avoid brittle snapshot tests of huge SVG trees.

---

# 21. Programmatic Coverage Gate

Create or reuse a bounded validation that checks:

authoritative enabled building types
→ production ICON-003 compact registry
→ World marker visual resolver

Expected outcome if repository state is unchanged:

23/23 PASS

No broken paths.

No duplicate IDs.

No missing production compacts.

No World-only manual mapping.

---

# 22. Runtime Validation

Run the real application.

Validate the actual WorldScreen.

Desktop target:

approximately 1440×900

Narrow target:

approximately 480×900

Runtime evidence must show the buildings layer enabled and actual compact markers rendered.

Do not substitute a static mock board for runtime evidence.

---

# 23. Mandatory Runtime Scenarios

Validate at least:

## A. Default World

Several buildings visible.

## B. Mixed five-type evidence

At least five semantically different building types.

## C. Selected building

One marker selected/active so selection treatment is visible.

## D. Dense region

Multiple markers in the same region/cell if current save/data permits.

## E. Narrow viewport

World remains usable and markers remain legible.

---

# 24. Human Visual Gate

This slice is NOT automatically sealed by tests.

Human review must be able to judge:

- Can I recognize that these are different building types?
- Do they look integrated into the map rather than pasted on?
- Are they large enough to read?
- Are they small enough not to dominate the geography?
- Does the industrial footprint now feel materially more like a game world?
- Does selection remain clear?
- Are port / other special infrastructure silhouettes acceptable?
- Is dense placement still readable?

Human approval is required before WBM-001 is sealed.

---

# 25. Required Evidence

Create:

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_DESKTOP.png`

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_DESKTOP_SELECTED.png`

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_DENSE.png`

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_NARROW.png`

If one screenshot can honestly satisfy multiple conditions, that is fine, but keep the required named evidence unless technically impossible.

Do not manufacture evidence from static design boards.

Use real runtime.

---

# 26. Root Gates

Run:

`pnpm typecheck`

`pnpm lint`

`pnpm test`

`pnpm build:web`

Required:

- typecheck PASS
- lint 0 errors
- tests PASS
- build:web PASS

If a gate fails because of a task-local defect:

fix it.

If it fails because of unrelated pre-existing working-tree churn:

prove that clearly and stop only if necessary.

Do not casually absorb unrelated fixes.

---

# 27. Scenario-B Accounting

WBM-001 creates:

- 0 new authored building concepts
- 0 new ICON-003 compact concepts

Do NOT increase authored-art counts merely because existing art gains another runtime consumer.

The integration may count as a procedural/integration visual-system improvement only if consistent with the master inventory's accounting convention.

Be explicit.

---

# 28. Inventory Update

Update:

`docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`

only as needed to record:

- WBM-001 integration state
- World Building Marker coverage
- 0 new authored art
- runtime consumer added for ICON-003 compacts

Do not alter Scenario-B historical accounting incorrectly.

---

# 29. Close-Candidate Report

Create:

`docs/architecture/reviews/POST_V1_WBM_001_WORLD_BUILDING_MARKER_INTEGRATION_CLOSE_CANDIDATE.md`

Required sections:

## A. Executive Summary
## B. Baseline / HEAD / Working Tree
## C. Task-Owned Files
## D. Existing World Architecture Verified
## E. ICON-003 Authority Verified
## F. Marker Data Contract
## G. Generic Resolver Integration
## H. Current Building Coverage
## I. Representative Five-Type Validation
## J. Infrastructure Grammar Validation
## K. Marker Size / Density
## L. Selection / Interaction
## M. Fallback Behavior
## N. Minimap Decision
## O. Focused Tests
## P. Programmatic 23/23 Resolution Gate
## Q. Desktop Runtime Evidence
## R. Selected Runtime Evidence
## S. Dense Runtime Evidence
## T. Narrow Runtime Evidence
## U. Root Gates
## V. Scenario-B Accounting
## W. Firewalls
## X. Residual Risks
## Y. Final Decision

---

# 30. Final Decision

Return exactly one:

### OPTION A — WBM-001 FINAL CLOSE CANDIDATE READY

Use only when:

- generic building-type marker integration works
- current production building types resolve successfully
- representative five-type runtime evidence exists
- selection works
- density is acceptable
- fallback works
- desktop PASS
- narrow PASS
- root gates PASS
- no sealed art was changed

### OPTION B — ONE BOUNDED REPAIR REQUIRED

Use when one task-local defect remains.

State exactly one repair scope.

### OPTION C — WORLD ARCHITECTURE BLOCKER

Use only for a genuine architectural incompatibility that cannot be solved inside this bounded integration.

### OPTION D — PRODUCT / UX DECISION REQUIRED

Use only if marker behavior requires a genuine unresolved product decision.

Do not invent additional options.

---

# 31. Git Rule

Do not stage.

Do not commit.

Do not push.

Do not tag.

Return one close candidate for independent review.

---

# 32. Core Rule

The art already exists.

Do not make more building art.

Make the World finally use it.

ICON-003 remains sealed.

The World remains structurally sealed.

Connect:

building instance
→ buildingTypeId
→ existing compact identity
→ readable World marker.

Implementation must be generic for the current production building family.

The five representative types are the HUMAN VISUAL GATE,
not an artificial implementation limit.

Zero new authored art.

Real runtime evidence.

One close candidate.

STOP.