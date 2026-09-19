# Cursor Implementation Prompt
# Project Genesis
# Post-V1 Game Art & Visual Content
# Building / Infrastructure Visual Contract Extension
# LINEAR + TERMINAL/YARD
# Access Road / Port / Rail Terminal

MODE:
BOUNDED VISUAL-CONTRACT EXTENSION
→ INSPECT AUTHORITATIVE INFRASTRUCTURE SEMANTICS
→ PRESERVE SEALED ICON-003 BUILDING FAMILY
→ DEFINE SPECIAL-INFRASTRUCTURE VISUAL GRAMMAR
→ CREATE LIMITED PILOT CONCEPTS
→ VALIDATE FAMILY COMPATIBILITY
→ VALIDATE RUNTIME-ROLE FEASIBILITY
→ PRODUCE CONTRACT + EVIDENCE
→ HUMAN VISUAL GATE
→ STOP

THIS IS NOT PRODUCTION BATCH 4.

DO NOT PRODUCE FINAL PRODUCTION COVERAGE FOR ALL THREE TYPES.
DO NOT REGISTER NEW PILOT ART AS ACTIVE PRODUCTION ART.
DO NOT REPLACE ICON-002 FALLBACK YET.
DO NOT MODIFY BUILDING PLACEMENT.
DO NOT MODIFY WORLD TOPOLOGY.
DO NOT ADD ROAD NETWORK GAMEPLAY.
DO NOT ADD PORT/RAIL GAMEPLAY.
DO NOT CHANGE BUILDING FOOTPRINTS.
DO NOT CHANGE GAME CONTENT.
DO NOT REOPEN BUILDING BATCHES 1–3.
NO COMMIT.
NO PUSH.
NO TAG.

---

# 1. Authority

Read first:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Then read:

docs/design/buildings/
BUILDING_VISUAL_IDENTITY_B2_ART_SPEC.md

docs/design/buildings/
BUILDING_B2_PRODUCTION_PROMPT_TEMPLATE.md

docs/architecture/reviews/
POST_V1_BUILDING_VISUAL_IDENTITY_PRODUCTION_BATCH_1_CLOSE_CANDIDATE.md

docs/architecture/reviews/
POST_V1_BUILDING_VISUAL_IDENTITY_PRODUCTION_BATCH_2_CLOSE_CANDIDATE.md

docs/architecture/reviews/
POST_V1_BUILDING_VISUAL_IDENTITY_PRODUCTION_BATCH_3_CLOSE_CANDIDATE.md

docs/design/
GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md

Inspect the current authoritative content and implementation for:

access_road
port
rail_terminal

Also inspect:

building footprints

building categories

placement semantics

World representation

transport semantics

existing ICON-002 fallback

ICON-003 registry

BuildingTypeIcon

BuildingsScreen

asset-processing pipeline.

Current committed/pushed HEAD after sealed Batch 3 is authority.

---

# 2. Current State

Building Visual Identity B2 is established production authority.

Sealed production batches:

Batch 1:
8 / 8

Batch 2:
8 / 8

Batch 3:
4 / 4

Current individual ICON-003 coverage:

20 / 23.

Normal B2 buildings remaining:

0.

Remaining types:

access_road

port

rail_terminal.

These three were intentionally classified as:

access_road
→ LINEAR

port
→ TERMINAL / YARD

rail_terminal
→ TERMINAL / YARD.

Their existing ICON-002 fallback remains valid until a later production
implementation is approved.

---

# 3. Purpose

Extend the existing Building Visual Identity system so special infrastructure
can receive individual visual identity without pretending that all
infrastructure is a conventional building on a square presentation pad.

The contract must answer:

1. How does LINEAR infrastructure fit the ICON-003 visual family?

2. How does TERMINAL/YARD infrastructure fit the ICON-003 visual family?

3. Which parts of B2 remain invariant?

4. Which parts may vary for infrastructure?

5. How is access_road represented without looking like a building?

6. How are port and rail_terminal represented as facilities with operational
   yards rather than generic halls?

7. Can all three still coexist coherently with the existing 20 ICON-003
   primaries?

8. How should compact glyphs work?

9. How should these assets appear in BuildingsScreen?

10. What may later be reused on the World map?

11. What must NOT imply unsupported gameplay semantics?

12. Is the resulting contract strong enough for a later three-asset
    production slice?

---

# 4. Product Principle

Infrastructure must look like infrastructure.

Do not force:

road
→ building

port
→ warehouse

rail terminal
→ warehouse.

At the same time, do not create a completely unrelated art family.

The desired relationship is:

ICON-003
├── VOLUMETRIC BUILDING GRAMMAR
│   └── existing sealed B2 family
│
├── LINEAR INFRASTRUCTURE GRAMMAR
│   └── access_road
│
└── TERMINAL/YARD INFRASTRUCTURE GRAMMAR
    ├── port
    └── rail_terminal

This is one visual family with multiple physical grammars.

---

# 5. Scenario Authority

Scenario remains:

SCENARIO B — TARGET PRODUCTION QUALITY

380–520 authored visual deliverables
+
approximately 12 procedural systems.

Do not recompute this target.

This contract should improve scalability rather than create unnecessary
one-off artwork.

---

# 6. Repository Baseline

Before implementation record:

git rev-parse HEAD
git status --short
git diff --name-only
git diff --stat

Separate:

CONTRACT-TASK-OWNED

PRE-EXISTING / UNRELATED.

Do not absorb unrelated working-tree changes.

---

# 7. Authoritative Semantics First

Before creating art, inspect authoritative repository content for all three
types.

For each determine only what repository evidence supports:

ID

player-facing German name

category

description

footprint

placement semantics

unlock semantics if relevant to visual understanding

network/transport relationship

World relationship

whether orientation exists

whether directionality exists

whether adjacency matters

whether connectivity matters

whether water/rail/road attachment is actually modeled.

Do not infer gameplay from the names.

For example:

do NOT draw a functional rail network because the object is named
rail_terminal unless the game actually models that relationship.

Visual cues may communicate identity.

They must not falsely promise unsupported mechanics.

---

# 8. Required Semantics Matrix

Create:

| ID | Player Name | Footprint | Placement Semantics | Network Semantics | Orientation | Visual Truths | Must Not Imply |
|----|-------------|-----------|---------------------|-------------------|-------------|---------------|----------------|

Rows:

access_road

port

rail_terminal.

This matrix is the semantic firewall for the art contract.

---

# 9. Inspect Current Runtime Roles

Determine where these three assets can actually appear today.

At minimum inspect:

BuildingsScreen

BuildingTypeIcon

placement UI

World

transport UI

production UI

tutorial/guidance if references exist.

Classify each role:

CURRENT PRODUCTION ROLE

POTENTIAL FUTURE ROLE

NOT APPROPRIATE.

Do not integrate pilots into these production roles.

---

# 10. Existing B2 Invariants

Determine which B2 characteristics must remain common across all ICON-003
families.

Expected invariants include, subject to repository evidence:

stylized economic-strategy-game rendering;

3/4 isometric-like family perspective;

upper-left lighting family;

controlled industrial palette;

strong silhouette hierarchy;

physical-object identity;

transparent/composition-safe source;

no UI chrome inside artwork;

no text dependency;

no category badge dependency;

clear dark-theme readability;

compact derivative architecture;

semantic naming;

runtime derivative pipeline.

Document exact invariants.

---

# 11. Infrastructure Variables

Explicitly define what infrastructure is allowed to change.

Potential variables:

footprint aspect ratio;

amount of ground plane;

subject-to-canvas occupancy;

horizontal extent;

yard extent;

visible track/road/water interface;

camera framing;

negative space;

compact abstraction.

Do not change:

overall art style

lighting family

material realism band

detail hierarchy

alpha policy

asset naming philosophy

unless evidence requires it.

---

# 12. Grammar A — LINEAR INFRASTRUCTURE

Define a visual grammar for:

access_road.

The primary challenge:

A road is predominantly horizontal/linear infrastructure.

It should NOT be represented as:

a square office;

a warehouse with a road icon;

a generic B2 building with a tiny road;

a floating road sign;

an abstract category symbol.

The visual identity should communicate a physical access connection.

---

# 13. LINEAR Composition Questions

Resolve:

- diagonal vs horizontal presentation;
- visible start/end treatment;
- whether a short representative road segment is sufficient;
- whether curb/shoulder/loading/access cues are appropriate;
- how much surrounding ground is required;
- whether the asset should be elongated within a square source canvas;
- whether the established 3/4 camera remains appropriate;
- how to preserve visual weight beside volumetric buildings;
- how to avoid making the road look tiny at 72px;
- how to derive a recognizable compact glyph.

Do not invent lane counts or road capacity.

---

# 14. Access-Road Truthfulness

Inspect actual access_road semantics.

If the game treats it as a placeable building-like entity with a footprint,
the art may depict a representative physical access-road installation.

If it represents connectivity abstractly:

the art must not imply richer road-network simulation than exists.

No:

intersections

traffic simulation

moving vehicles

multi-lane highway

traffic lights

road network topology

unless supported by authoritative mechanics.

---

# 15. Grammar B — TERMINAL / YARD

Define a shared visual grammar for:

port

rail_terminal.

These are facilities, but their identity comes from:

interface

+
yard

+
terminal infrastructure

rather than only a central building mass.

The grammar must support a lower/wider operational composition than normal
volumetric B2 buildings while remaining clearly ICON-003.

---

# 16. TERMINAL/YARD Composition Questions

Resolve:

- ratio of building mass to operational yard;
- required horizontal footprint;
- ground-plane treatment;
- cargo/material-handling cues;
- interface cues;
- whether cranes/loading structures are appropriate;
- whether tracks/water-edge cues may be shown;
- camera consistency with B2;
- visual occupancy;
- compact-glyph simplification;
- differentiation between port and rail terminal.

Do not add unsupported operating mechanics.

---

# 17. Port Identity

Inspect authoritative `port` semantics first.

The concept should read as a port facility without becoming a giant scenic
harbor illustration.

Potential cues, only if semantically safe:

quay edge

cargo handling

terminal shed

crane

container/storage yard

water interface.

Do NOT automatically add:

ships

ocean panorama

multiple berths

animated cranes

container logistics mechanics

deep-water navigation

unless repository semantics justify them.

The asset represents the placeable game object, not an entire harbor city.

---

# 18. Rail-Terminal Identity

Inspect authoritative `rail_terminal` semantics first.

Potential cues, only if semantically safe:

terminal hall

loading platform

short track interface

cargo yard

gantry/loading equipment.

Do NOT automatically imply:

full rail network simulation

switching yards

multiple active trains

signals

complex routing

passenger service

unless repository mechanics support them.

The object must remain visually distinct from:

distribution_center

warehouse

port.

---

# 19. Pilot Scope

Create exactly THREE infrastructure primary pilot concepts:

1 × access_road

1 × port

1 × rail_terminal.

These are CONTRACT PILOTS.

They are not production-active assets.

Do not create multiple A/B/C variants unless a concept fails basic QA.

Use one best-evidence interpretation per type.

Reasonable local retries to reach the requested grammar are allowed.

---

# 20. Pilot Naming

Use clearly non-production pilot paths.

Suggested:

docs/design/buildings/infrastructure-pilot/

Do NOT place pilot masters directly into:

apps/web/public/assets/buildings/

Do NOT add them to active ICON-003 registry entries.

Do NOT replace ICON-002 fallback.

Suggested pilot semantic names:

ICON-003-access_road-infra-pilot

ICON-003-port-infra-pilot

ICON-003-rail_terminal-infra-pilot

Repository conventions may refine exact filenames.

The `-infra-pilot` status must remain obvious.

---

# 21. Primary Pilot Format

Use the established production-quality source expectations where practical:

1024×1024

transparent/composition-safe background

high-quality primary rendering.

For access_road, a square source canvas does NOT require a square physical
object.

The object may use a diagonal elongated composition.

Do not distort the road into a square facility merely to fill the canvas.

---

# 22. Family Compatibility

The pilots must visually coexist with the existing 20 ICON-003 primaries.

Create a comparison board containing:

representative existing volumetric B2 buildings

+
the three infrastructure pilots.

At minimum include relevant comparison anchors such as:

warehouse

distribution_center

logistics_hub

maintenance_facility

one administration/research building

+
access_road

port

rail_terminal.

Do not needlessly reproduce all 20 if a focused comparison board provides
better visual judgment.

---

# 23. Required Primary Comparison Board

Create:

docs/architecture/reviews/evidence/
INFRASTRUCTURE_VISUAL_CONTRACT_PRIMARY_BOARD.png

The board must make it possible to judge:

family relationship;

camera;

lighting;

material band;

visual weight;

horizontal-vs-volumetric grammar;

functional differentiation.

Use external labels only.

---

# 24. Compact Pilot Concepts

Create one compact pilot glyph for each:

access_road

port

rail_terminal.

Purpose:

prove the infrastructure grammar can collapse into the established
BuildingTypeIcon compact role.

Target:

32px readable.

Test:

24px

32px

48px.

Do not over-detail.

Do not simply reuse ICON-002 category icons.

---

# 25. Compact Semantics

Expected abstraction should come from physical identity.

Examples of possible cue classes:

access road:
road segment / edge / connection geometry

port:
quay + crane/terminal silhouette

rail terminal:
track + terminal/loading silhouette.

These are examples, not mandatory solutions.

Use the actual concept geometry.

No text.

No letters.

No category badge dependency.

---

# 26. Required Compact Board

Create:

docs/architecture/reviews/evidence/
INFRASTRUCTURE_VISUAL_CONTRACT_COMPACT_BOARD.png

Show the three pilot glyphs at:

24px

32px

48px

beside representative existing ICON-003 compact glyphs.

Required outcome:

32px READABLE.

---

# 27. Alpha QA

Run the established alpha tooling against the three pilot primaries.

Even though they are not production-active, the contract must prove
production feasibility.

Required:

3 / 3 PASS.

Check:

real alpha;

transparent pixels;

no baked checkerboard;

no opaque studio background;

no black edge-connected residue;

no white/black halo.

---

# 28. Runtime-Scale Mock

Create a DEV-ONLY comparison context or static evidence mock.

Do not modify production BuildingsScreen.

Show the three pilots at the current real catalog primary-art size.

Also show representative existing B2 primaries.

Purpose:

answer whether the infrastructure compositions survive the existing catalog
slot.

This must specifically test:

access_road readability at approximately current catalog size.

---

# 29. Required Catalog-Scale Evidence

Create:

docs/architecture/reviews/evidence/
INFRASTRUCTURE_VISUAL_CONTRACT_CATALOG_SCALE.png

It must show:

access_road

port

rail_terminal

at the current production BuildingsScreen art size

alongside representative B2 buildings.

No production registry integration required.

---

# 30. World-Scale Feasibility

Do NOT integrate into World.

But inspect whether the proposed primary/compact grammar is potentially usable
for future World markers.

Answer:

PRIMARY SUITABLE

COMPACT SUITABLE

NEEDS FUTURE WORLD-SPECIFIC DERIVATIVE.

This is analysis only.

Do not create World-specific production assets in this slice.

---

# 31. Ground-Plane Contract

This section is mandatory.

Existing volumetric B2 buildings commonly use a bounded foundation/pad.

Infrastructure may require different treatment.

Define separately:

VOLUMETRIC BUILDING:
existing sealed rule

LINEAR:
new rule

TERMINAL/YARD:
new rule.

Avoid visual contradiction such as:

a road floating on a building podium

or:

a port represented on a tiny decorative pedestal.

At the same time, retain enough composition grounding for family coherence.

---

# 32. Perspective Contract

Define:

shared camera family

allowed framing variance

allowed horizontal extension

for:

VOLUMETRIC

LINEAR

TERMINAL/YARD.

Do not create unrelated cameras for each type.

The viewer should believe all objects belong to the same strategy-game
world.

---

# 33. Occupancy Contract

Define an occupancy rule per grammar.

Do not blindly apply the volumetric 58–72% height rule to access_road.

Instead define measurable/practical visual guidance for:

LINEAR

TERMINAL/YARD

while retaining comparable perceived visual weight.

The rule should be usable by later production generation.

---

# 34. Lighting / Material Contract

Infrastructure retains the B2 family lighting/material band.

Define any special material emphasis:

road surface

concrete yard

steel rails

quay edge

industrial equipment

only as visual materials.

Do not encode gameplay state into the base primary.

---

# 35. State Overlay Compatibility

Existing building strategy favors shared overlays for states such as:

construction

paused

blocked

maintenance

where applicable.

Analyze whether the same overlay architecture can work for infrastructure.

Do not implement new state overlays.

Return:

SHARED OVERLAYS SUFFICIENT

or:

INFRASTRUCTURE-SPECIFIC OVERLAY EXTENSION MAY BE NEEDED.

Explain only with concrete visual reason.

---

# 36. Asset Architecture Decision

Determine whether these three should remain semantically:

ICON-003

or require a separate asset-family identifier.

Default preference:

remain ICON-003.

A new identifier is justified only if the existing registry semantics make
ICON-003 materially incorrect.

Do not create a new namespace merely because the geometry differs.

Required report decision:

ICON-003 EXTENSION APPROVED

or:

NEW FAMILY REQUIRED.

If NEW FAMILY REQUIRED:

do not implement it in this slice.

Explain why.

---

# 37. Production Naming Proposal

If ICON-003 extension remains appropriate, propose final production names:

ICON-003-access_road

ICON-003-port

ICON-003-rail_terminal

and compact equivalents according to existing convention.

Do NOT activate them yet.

---

# 38. No Production Registry Integration

This contract slice must NOT:

add the pilot assets to active production registry;

extend production coverage to 23/23;

modify `ICON_003_PRODUCTION_BUILDING_TYPE_IDS`;

replace ICON-002 fallbacks;

change BuildingsScreen production rendering.

Current production truth remains:

20 / 23 ICON-003

3 / 23 ICON-002 fallback.

---

# 39. No Gameplay Changes

Do not modify:

placement rules

footprints

coordinates

adjacency

network logic

transport

road logic

rail logic

port logic

production

recipes

costs

construction durations

energy

market

research

simulation

save schema.

---

# 40. No Content Changes

Do not alter authoritative YAML to make the art easier.

No changes to:

names

descriptions

categories

unlocks

milestones

footprints

transport semantics.

If content is ambiguous:

report ambiguity.

Do not rewrite product semantics.

---

# 41. No World Changes

Do not modify:

PGWorldCanvas

World markers

routes

minimap

camera

region rendering

placement interaction

World topology.

World visual integration is a separate later decision.

---

# 42. No Player-Guidance Changes

Do not fix:

raw milestone IDs

unlock messaging

tutorial

direct placement

X/Y placement UX

navigation.

Separate workstream.

---

# 43. No Deployment Work

Do not execute:

POST_V1_DEPLOYMENT_AUTHENTICATION_SAVE_PERSISTENCE_REVIEW.

That track remains parked.

---

# 44. Contract Document

Create:

docs/design/buildings/
BUILDING_INFRASTRUCTURE_VISUAL_CONTRACT.md

Status:

PILOT / PENDING HUMAN APPROVAL.

Required sections:

## 1. Purpose

## 2. Authority

## 3. Existing ICON-003 Relationship

## 4. Semantic Firewall

## 5. Shared Family Invariants

## 6. Volumetric Building Grammar Reference

## 7. LINEAR Infrastructure Grammar

## 8. TERMINAL/YARD Infrastructure Grammar

## 9. Perspective

## 10. Ground Plane

## 11. Occupancy

## 12. Lighting

## 13. Materials

## 14. Detail Hierarchy

## 15. Alpha

## 16. Compact Glyph Grammar

## 17. Catalog-Scale Rules

## 18. World-Scale Feasibility

## 19. State Overlay Compatibility

## 20. Naming

## 21. Production Pipeline Compatibility

## 22. Forbidden Patterns

## 23. Pilot Findings

## 24. Production Readiness

## 25. Human Approval Status

---

# 45. Forbidden Patterns

The contract must explicitly forbid at least:

road represented as a normal building;

road icon pasted onto generic building;

port as generic warehouse;

rail terminal as generic warehouse;

unrelated camera angle;

full scenic landscape;

giant harbor panorama;

giant rail network panorama;

UI text inside primary;

category badge dependency;

baked checkerboard;

opaque black background;

photorealistic mismatch;

unsupported vehicles/mechanics dominating identity;

invented transport capacity;

invented network complexity.

---

# 46. Pilot Manifest

Create:

docs/design/buildings/infrastructure-pilot/
INFRASTRUCTURE_VISUAL_CONTRACT_PILOT_MANIFEST.json

Record:

pilot version

asset ID

building type ID

grammar

source path

dimensions

alpha result

compact path

32px result

catalog-scale result

family result

semantic-risk notes

production status.

Production status must remain:

PILOT_NOT_ACTIVE.

---

# 47. Review Report

Create:

docs/architecture/reviews/
POST_V1_BUILDING_INFRASTRUCTURE_VISUAL_CONTRACT_REVIEW.md

Required sections:

## A. Executive Summary

## B. Repository Baseline

## C. Current 20/23 Authority

## D. Authoritative Semantics

## E. Runtime Role Audit

## F. Existing B2 Invariants

## G. Infrastructure Variables

## H. LINEAR Grammar

## I. TERMINAL/YARD Grammar

## J. Access-Road Pilot

## K. Port Pilot

## L. Rail-Terminal Pilot

## M. Alpha QA

## N. Compact QA

## O. Catalog-Scale QA

## P. Cross-Family QA

## Q. World-Scale Feasibility

## R. State Overlay Compatibility

## S. Asset-Family Decision

## T. Production Naming Proposal

## U. Gameplay / Content / World Firewalls

## V. Repository Integrity

## W. Production Readiness

## X. Human Visual Decision Required

---

# 48. Required Semantic Matrix

Include:

| ID | Name | Grammar | Footprint | Actual Semantics | Safe Visual Cues | Unsupported Implications |
|----|------|---------|-----------|------------------|------------------|--------------------------|

All three required.

---

# 49. Required Pilot QA Matrix

Include:

| ID | Grammar | Primary | Alpha | Family | Catalog Scale | Compact @32 | Semantic Truth | Result |
|----|---------|---------|-------|--------|---------------|-------------|----------------|--------|

Rows:

access_road

port

rail_terminal.

---

# 50. Required Grammar Matrix

Include:

| Property | Volumetric B2 | LINEAR | TERMINAL/YARD |
|----------|---------------|--------|---------------|
| Camera | | | |
| Ground plane | | | |
| Occupancy | | | |
| Horizontal extent | | | |
| Functional cue | | | |
| Detail hierarchy | | | |
| Compact strategy | | | |
| Catalog role | | | |
| World potential | | | |

This matrix should be concrete enough to drive the later production slice.

---

# 51. Required Evidence

Create durable evidence:

docs/architecture/reviews/evidence/
INFRASTRUCTURE_VISUAL_CONTRACT_PRIMARY_BOARD.png

docs/architecture/reviews/evidence/
INFRASTRUCTURE_VISUAL_CONTRACT_COMPACT_BOARD.png

docs/architecture/reviews/evidence/
INFRASTRUCTURE_VISUAL_CONTRACT_CATALOG_SCALE.png

Optional additional detail crops are allowed only if useful.

Do not flood the repository with redundant evidence.

---

# 52. Technical Gates

This slice should not materially affect production runtime.

Run at minimum:

pnpm typecheck
pnpm lint

If dev-only code/tooling is added:

run its focused tests/checks.

If any production code is touched unexpectedly:

run:

pnpm test
pnpm build:web

and explain why production code was necessary.

Preferred result:

no production runtime changes.

---

# 53. Visual Acceptance Questions

Answer explicitly:

1. Does access_road read as physical linear infrastructure?

2. Does access_road still belong to the ICON-003 family?

3. Is access_road useful at catalog scale?

4. Does port read as a terminal/yard rather than generic warehouse?

5. Does rail_terminal read as rail infrastructure rather than generic
   warehouse?

6. Are port and rail_terminal clearly different from each other?

7. Do both terminal assets coexist with existing logistics/storage buildings?

8. Does the family remain coherent despite different footprint grammars?

9. Are all three compact glyphs readable at 32px?

10. Are the concepts semantically honest about actual game mechanics?

11. Can the existing runtime derivative pipeline support them?

12. Can they remain ICON-003?

13. Is the contract strong enough for one later production slice containing
    exactly these three types?

---

# 54. Human Decision

Do not automatically promote pilots to production.

Return one human-facing recommendation:

APPROVE INFRASTRUCTURE CONTRACT

REVISE INFRASTRUCTURE CONTRACT

REJECT INFRASTRUCTURE CONTRACT.

This is not the final production decision.

Human visual approval is required before production activation.

---

# 55. Stop Conditions

STOP for:

authoritative semantics too ambiguous to create honest visual identity;

LINEAR grammar cannot fit existing catalog role without product decision;

TERMINAL/YARD grammar would imply unsupported mechanics;

ICON-003 registry semantics materially reject infrastructure;

pilot generation cannot reach family compatibility after reasonable retries;

production code would require material architecture change;

unexpected gameplay/content dependency;

cross-scope regression.

Do NOT stop for:

one weak generation;

minor camera drift;

alpha cleanup;

compact simplification;

evidence-board tooling;

ordinary dev-only presentation work.

Fix those locally.

---

# 56. Final Decision

Return exactly ONE:

## OPTION A —
INFRASTRUCTURE VISUAL CONTRACT
READY FOR HUMAN VISUAL APPROVAL

Use when:

semantic matrix complete;

LINEAR grammar defined;

TERMINAL/YARD grammar defined;

3 pilots exist;

3/3 alpha feasible;

3/3 compacts viable @32px;

catalog-scale evidence passes;

cross-family evidence passes;

ICON-003 extension is technically credible;

no production integration occurred;

firewalls hold.

---

## OPTION B —
INFRASTRUCTURE VISUAL CONTRACT
REQUIRES VISUAL REVISION

State exact grammar/type requiring revision.

---

## OPTION C —
INFRASTRUCTURE VISUAL CONTRACT
REQUIRES PRODUCT SEMANTICS DECISION

Use only for genuine gameplay/product ambiguity.

---

## OPTION D —
INFRASTRUCTURE REQUIRES SEPARATE ASSET ARCHITECTURE

Use only if concrete repository architecture makes ICON-003 extension
materially incorrect.

Do not implement the new architecture here.

---

# 57. Repository Integrity

Before finalizing:

git status --short
git diff --name-only
git diff --stat

Separate:

CONTRACT-TASK-OWNED

PRE-EXISTING / UNRELATED.

No staging.
No commit.
No push.
No tag.

---

# 58. Execution Summary

Return:

# Project Genesis
# Building / Infrastructure Visual Contract Extension
## Execution Summary

### Baseline

- HEAD:
- branch:
- working tree:

### Existing Authority

- Batch 1:
SEALED

- Batch 2:
SEALED

- Batch 3:
SEALED

- current ICON-003 coverage:
20 / 23

### Infrastructure Scope

- access_road:
LINEAR

- port:
TERMINAL / YARD

- rail_terminal:
TERMINAL / YARD

### Semantics

- access_road:
- port:
- rail_terminal:
- unresolved product ambiguity:
YES / NO

### Contract

- shared B2 invariants:
- LINEAR grammar:
- TERMINAL/YARD grammar:
- ground-plane contract:
- perspective contract:
- occupancy contract:

### Pilots

- access_road primary:
- port primary:
- rail_terminal primary:
- alpha:
X / 3

### Compacts

- access_road @32:
- port @32:
- rail_terminal @32:

### Visual QA

- primary comparison board:
- compact board:
- catalog-scale board:
- family compatibility:
- semantic truthfulness:

### Asset Architecture

- remain ICON-003:
YES / NO

- production naming:
- runtime pipeline compatible:
YES / NO

### Production State

- active registry changes:
NONE

- production coverage:
UNCHANGED — 20 / 23

- ICON-002 fallback:
UNCHANGED — 3 / 23

### World

- production integration:
NONE

- future feasibility:
- World-specific derivative needed:
YES / NO / PER TYPE

### Gates

- typecheck:
- lint:
- focused checks:
- test/build:web if applicable:

### Firewalls

- gameplay:
NONE

- content:
NONE

- World:
NONE

- placement:
NONE

- Player Guidance:
NONE

- deployment:
NONE

### Repository Integrity

- task-owned:
- unrelated:

- commit:
NONE

- push:
NONE

- tag:
NONE

### Human Decision Required

APPROVE / REVISE / REJECT

### Final Decision

OPTION A / OPTION B / OPTION C / OPTION D

STOP.

---

# CORE RULE

THE LAST THREE TYPES ARE NOT FAILED NORMAL BUILDINGS.

THEY ARE SPECIAL INFRASTRUCTURE.

DO NOT FORCE THEM INTO THE VOLUMETRIC BUILDING TEMPLATE.

DO NOT CREATE A NEW ART UNIVERSE EITHER.

EXTEND THE EXISTING ICON-003 FAMILY WITH TWO PHYSICAL GRAMMARS:

LINEAR
FOR:
access_road

TERMINAL/YARD
FOR:
port
rail_terminal.

READ THE ACTUAL GAME SEMANTICS FIRST.

DO NOT PROMISE MECHANICS THROUGH ART THAT THE GAME DOES NOT HAVE.

CREATE EXACTLY THREE CONTRACT PILOTS.

KEEP THEM OUT OF THE ACTIVE PRODUCTION REGISTRY.

PROVE:

FAMILY COMPATIBILITY
SEMANTIC TRUTH
ALPHA FEASIBILITY
32PX COMPACT READABILITY
CATALOG-SCALE READABILITY.

THEN RETURN FOR HUMAN VISUAL APPROVAL.

DO NOT ACTIVATE 23/23 COVERAGE YET.

STOP.