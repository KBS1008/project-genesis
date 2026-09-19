# Cursor Implementation Prompt
# Project Genesis
# Post-V1 Game Art & Visual Content
# Building / Infrastructure Visual Identity
# Infrastructure Production — 23/23 Completion

MODE:
FINAL BOUNDED INFRASTRUCTURE PRODUCTION SLICE
→ RECORD HUMAN CONTRACT APPROVAL
→ FREEZE INFRASTRUCTURE CONTRACT
→ QA / PROMOTE EXACTLY 3 APPROVED PILOTS
→ CREATE PRODUCTION DERIVATIVES
→ ACTIVATE ICON-003 REGISTRY
→ INTEGRATE THROUGH EXISTING BuildingTypeIcon
→ VERIFY REAL BUILDINGSSCREEN
→ VERIFY 23/23 COVERAGE
→ CROSS-FAMILY QA
→ DESKTOP + NARROW RUNTIME VALIDATION
→ ROOT TECHNICAL GATES
→ INVENTORY UPDATE
→ FINAL BUILDING-VISUAL-TRACK CLOSE CANDIDATE
→ STOP

THIS IS NOT A NEW ART-DIRECTION SLICE.
THIS IS NOT A NEW PILOT.
THIS IS NOT PRODUCTION BATCH 4 FOR NORMAL BUILDINGS.

DO NOT GENERATE ADDITIONAL BUILDING TYPES.
DO NOT REDESIGN SEALED BATCHES 1–3.
DO NOT REDESIGN THE APPROVED INFRASTRUCTURE CONTRACT.
DO NOT INVENT ROAD / PORT / RAIL GAMEPLAY.
DO NOT INTEGRATE TRUE ROAD TILES INTO WORLD.
DO NOT CHANGE PLACEMENT SEMANTICS.
DO NOT CHANGE GAME CONTENT.
DO NOT START PLAYER GUIDANCE.
DO NOT START DEPLOYMENT/AUTH/PERSISTENCE.
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

docs/design/buildings/
BUILDING_INFRASTRUCTURE_VISUAL_CONTRACT.md

docs/architecture/reviews/
POST_V1_BUILDING_VISUAL_IDENTITY_PRODUCTION_BATCH_1_CLOSE_CANDIDATE.md

docs/architecture/reviews/
POST_V1_BUILDING_VISUAL_IDENTITY_PRODUCTION_BATCH_2_CLOSE_CANDIDATE.md

docs/architecture/reviews/
POST_V1_BUILDING_VISUAL_IDENTITY_PRODUCTION_BATCH_3_CLOSE_CANDIDATE.md

docs/architecture/reviews/
POST_V1_BUILDING_INFRASTRUCTURE_VISUAL_CONTRACT_REVIEW.md

docs/design/
GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md

Inspect current production implementation:

building-type-visual-asset-ids

visual asset registry

BuildingTypeIcon

BuildingsScreen

ICON-003 production asset directories

production manifest/catalog

alpha tooling

runtime derivative tooling

family-board tooling

runtime evidence tooling.

Current repository HEAD and working tree are authority.

---

# 2. Human Approval Authority

The Infrastructure Visual Contract has received HUMAN VISUAL APPROVAL.

Authoritative decision:

BUILDING INFRASTRUCTURE VISUAL CONTRACT
→ APPROVED / PASS / SEALED.

Human visual findings:

- access_road successfully reads as LINEAR physical infrastructure;
- port successfully reads as TERMINAL/YARD;
- rail_terminal successfully reads as TERMINAL/YARD;
- all three remain visually compatible with the existing ICON-003 family;
- catalog-scale presentation is acceptable;
- compact grammar is acceptable;
- infrastructure remains semantically honest;
- no new asset-family namespace is required.

Therefore:

ICON-003 remains the production family.

Approved sub-grammars:

VOLUMETRIC BUILDING
→ sealed Batches 1–3

LINEAR
→ access_road

TERMINAL/YARD
→ port
→ rail_terminal.

Do not reopen this decision without hard contradictory evidence.

---

# 3. First Documentation Action

Update:

docs/design/buildings/
BUILDING_INFRASTRUCTURE_VISUAL_CONTRACT.md

Change status from:

PILOT / PENDING HUMAN APPROVAL

to:

APPROVED / PRODUCTION AUTHORITY

or the repository's established equivalent wording.

Update the Human Approval section to record:

APPROVED.

Preserve version/history conventions used by Project Genesis.

Do not rewrite the contract.

Do not alter approved grammar merely because production work begins.

---

# 4. Current Production State

Current active individual visual coverage:

20 / 23 building types use ICON-003.

Remaining category fallback:

3 / 23.

Those three are exactly:

access_road

port

rail_terminal.

Current fallback is intentional and safe.

This slice may replace those fallbacks only after each asset passes production
QA.

Expected successful final state:

23 / 23 ICON-003.

ICON-002 remains available as generic fallback architecture.

Do NOT remove ICON-002 fallback capability from BuildingTypeIcon.

100% current content coverage is not a reason to delete safe fallback behavior.

---

# 5. Exact Scope

Produce/activate exactly these three production assets:

access_road

port

rail_terminal.

Approved grammars:

access_road
→ LINEAR

port
→ TERMINAL/YARD

rail_terminal
→ TERMINAL/YARD.

No fourth asset.

No normal building art.

No unrelated infrastructure.

---

# 6. Repository Baseline

Before modifications record:

git rev-parse HEAD
git status --short
git diff --name-only
git diff --stat

Classify:

TASK-OWNED

PRE-EXISTING / UNRELATED.

The Infrastructure Contract/Pilot work may still be uncommitted.

If so:

treat those contract/pilot files as task-owned predecessor work for this final
track close, but clearly distinguish:

CONTRACT/PILOT

from:

PRODUCTION ACTIVATION.

Do not absorb unrelated working-tree churn.

---

# 7. Approved Pilot Sources

Inspect the approved pilots under the infrastructure pilot design tree.

Expected approved concepts:

access_road pilot

port pilot

rail_terminal pilot.

Do NOT blindly copy them.

First verify that the exact source files correspond to the human-approved
evidence boards:

INFRASTRUCTURE_VISUAL_CONTRACT_PRIMARY_BOARD.png

INFRASTRUCTURE_VISUAL_CONTRACT_COMPACT_BOARD.png

INFRASTRUCTURE_VISUAL_CONTRACT_CATALOG_SCALE.png

If manifest/source/evidence identity is ambiguous:

resolve it before production promotion.

Do not accidentally promote an earlier rejected generation.

---

# 8. Promotion Rule

Default:

PROMOTE THE HUMAN-APPROVED PILOT.

Do not regenerate merely because this is now production.

Regeneration is allowed only if technical inspection finds a concrete
production defect such as:

bad alpha source;

insufficient resolution;

corrupted source;

material family mismatch hidden by evidence scaling;

wrong approved source file;

unrepairable edge contamination.

Minor processing defects should be repaired through the established pipeline,
not by replacing the approved art direction.

If regeneration is unavoidable:

preserve the approved composition and grammar.

Do not reinterpret the asset.

---

# 9. access_road Production Contract

ID:

access_road

Player-facing identity:

Zufahrtsstrasse
according to current authoritative content.

Grammar:

LINEAR.

Production asset must remain:

a representative physical access-road segment.

It must NOT become:

a normal building;

a building with road symbol;

a highway scene;

an intersection;

a traffic simulation;

a road-network tile set.

Preserve the approved width-forward composition.

---

# 10. access_road World Boundary

IMPORTANT:

The production ICON-003 access_road primary is a representative catalog /
building-type visual.

It is NOT authoritative oriented World tile art.

Do not interpret it as:

5×2 World tile renderer;

directional road sprite;

road connection system;

network topology asset.

The approved contract already identifies possible future need for a
World-specific oriented derivative.

Do NOT create that derivative here.

---

# 11. port Production Contract

ID:

port

Grammar:

TERMINAL/YARD.

Preserve approved visual identity:

quay/interface

+
cargo/operational yard

+
terminal infrastructure.

Do not expand into:

harbor panorama;

ship fleet;

multiple active berths;

ocean scene;

animated logistics;

invented container mechanics.

The player should recognize:

port facility.

Not:

complete maritime simulation.

---

# 12. rail_terminal Production Contract

ID:

rail_terminal

Grammar:

TERMINAL/YARD.

Preserve approved identity:

terminal/loading structure

+
short rail interface

+
operational yard.

Do not add:

train network;

switching yard simulation;

moving trains;

signals;

passenger station;

routing mechanics.

The player should recognize:

rail freight terminal.

Not:

complete rail simulation.

---

# 13. Shared ICON-003 Family Contract

All three production assets must retain the approved shared family:

stylized economic-strategy rendering;

3/4 isometric-like southeast family;

upper-left key light;

controlled industrial palette;

physical-object identity;

strong L1 silhouette;

transparent/composition-safe alpha;

no UI chrome;

no text dependency;

no category badge dependency;

compact derivative architecture;

existing production processing pipeline.

Do not create an infrastructure-specific rendering style.

---

# 14. Grammar-Specific Ground Plane

Preserve the approved contract.

VOLUMETRIC:
existing sealed pad + shadow.

LINEAR:
continuous ground plane under pavement;
no building podium.

TERMINAL/YARD:
integrated yard-grade ground plane;
no decorative pedestal.

Do not normalize these back into the volumetric B2 pad merely for production
consistency.

Their physical difference is intentional.

---

# 15. Grammar-Specific Occupancy

Preserve the approved guidance.

LINEAR:

approximately 35–55% subject height

approximately 55–75% width-forward band.

TERMINAL/YARD:

approximately 40–58% height

approximately 65–85% width.

These are QA guardrails, not distortion targets.

Perceived visual weight at catalog scale is more important than mechanically
hitting a percentage.

---

# 16. Production Naming

Promote to established semantic IDs:

ICON-003-access_road

ICON-003-port

ICON-003-rail_terminal

and compact equivalents according to current repository convention:

ICON-003-access_road-compact

ICON-003-port-compact

ICON-003-rail_terminal-compact.

Follow exact current naming/casing rules in code/files.

Remove `-infra-pilot` only for the production copies/entries.

Do not destroy useful pilot provenance.

---

# 17. Source Masters

Promote approved source masters into the established production design source
structure.

Do not load design masters directly at runtime.

Expected source quality:

1024×1024

real alpha after production processing

composition-safe transparent background.

Record provenance:

approved pilot
→ production source.

Do not count this promotion as a second independent authored concept.

---

# 18. Production Alpha

Run the established production alpha pipeline.

Do not rely solely on pilot alpha PASS.

Re-run alpha QA on the production source/ID.

Required:

3 / 3 PASS.

Check:

dimensions;

alpha channel;

meaningful transparent pixels;

no baked checkerboard;

no opaque studio background;

no edge-connected black residue;

no white/black halo.

---

# 19. Runtime Derivatives

Use the same production pipeline as the existing 20 ICON-003 types.

Generate the established runtime formats.

Expected architecture may include:

optimized WebP

PNG fallback if current production contract requires it

compact SVG.

Do not invent an infrastructure-only runtime format.

Record:

source master

runtime path

dimensions

file size.

---

# 20. Compact Promotion

Promote the three approved compact pilot concepts into production compact
assets.

Required target:

32px READABLE.

Also inspect:

24px

48px.

Do not add more detail because production begins.

Do not replace physical identity with generic category icons.

---

# 21. Compact Semantics

Production compact identity must remain:

access_road
→ linear road segment / connection geometry

port
→ quay / crane / terminal cue

rail_terminal
→ track / terminal-loading cue.

Port and rail terminal must remain distinguishable at 32px.

Do not add letters or text.

---

# 22. Registry Activation

Extend the existing production ICON-003 mapping.

Expected final mapping:

access_road
→ ICON-003-access_road

port
→ ICON-003-port

rail_terminal
→ ICON-003-rail_terminal.

Also register compact equivalents through the existing architecture.

Do not create:

InfrastructureTypeIcon

InfrastructureVisualRegistry

ICON004 registry

or another parallel resolver.

Use the existing generic production system.

---

# 23. Production Coverage Constant / Manifest

If current architecture contains an authoritative set such as:

ICON_003_PRODUCTION_BUILDING_TYPE_IDS

extend it with exactly these three IDs.

Expected successful count:

23.

Do not hardcode count 23 in multiple places.

Prefer existing source-of-truth patterns.

Update production manifest/catalog accordingly.

---

# 24. BuildingTypeIcon

Reuse the existing production component.

After activation:

all 23 current authoritative building types should resolve through ICON-003.

But retain safe ICON-002 fallback for:

unknown future building IDs

missing asset conditions

error behavior

where existing architecture supports it.

Do not remove defensive fallback just because current coverage becomes 100%.

---

# 25. BuildingsScreen Integration

No catalog redesign.

Integration must happen automatically through:

building type ID
→ registry
→ BuildingTypeIcon.

Do not hardcode the three infrastructure assets directly in BuildingsScreen.

The real Baukatalog must show:

access_road individual art

port individual art

rail_terminal individual art.

---

# 26. 23/23 Does Not Mean UI Redesign

Runtime screenshots may still expose:

raw milestone IDs

large placement panel

X/Y inputs

long catalog

responsive density

unused space

tutorial/guidance issues.

These are separate workstreams.

Do not fix them in this slice.

Record only as:

PRE-EXISTING / OUT OF SCOPE.

---

# 27. Full 23-Primary Family Board

Create final durable evidence:

docs/architecture/reviews/evidence/
BUILDING_ICON_003_23_OF_23_PRIMARY_FAMILY_BOARD.png

Include all current authoritative building types:

23 / 23.

Use:

same dark comparison background;

consistent visual display scale;

external labels;

no decorative presentation that hides differences.

Purpose:

final Building Visual Identity family QA.

---

# 28. Final Family QA

Inspect all 23 primaries together.

Check:

camera family;

lighting family;

material band;

visual weight;

detail hierarchy;

alpha edges;

cross-batch coherence;

infrastructure grammar compatibility.

Infrastructure is NOT required to have the same physical mass as volumetric
buildings.

The question is:

DO ALL 23 LOOK LIKE OBJECTS FROM THE SAME GAME?

Required outcome for close:

PASS

or:

PASS WITH MINOR NON-BLOCKING VARIANCE.

Material family fracture:

FAIL.

---

# 29. Full Compact Family Board

Create:

docs/architecture/reviews/evidence/
BUILDING_ICON_003_23_OF_23_COMPACT_FAMILY_BOARD.png

Include all 23 production compact glyphs.

Show at minimum:

32px.

Optional:

48px secondary comparison.

Do not use oversized display as sole proof.

---

# 30. Final Compact QA

Verify:

23 / 23 production compact mappings exist;

all target 32px readable;

no accidental ICON-002 substitution;

no duplicate/missing IDs;

port and rail terminal distinguishable;

access road remains readable as LINEAR.

Do not redesign the existing 20 unless a hard regression exists.

---

# 31. Runtime Asset Resolution Audit

For each of the three new production types trace:

buildingTypeId
→ production mapping
→ primary asset ID
→ runtime path
→ file exists
→ browser load
→ BuildingTypeIcon
→ real BuildingsScreen.

Required matrix:

| Building | Asset ID | Runtime Path | File Exists | Browser Load | Component | Rendered | Result |
|----------|----------|--------------|-------------|--------------|-----------|----------|--------|

All three must PASS.

---

# 32. Full Coverage Audit

Programmatically or table-driven verify every current authoritative building
type.

Required question:

Does every one of the 23 authoritative building IDs resolve to a production
ICON-003 primary?

Expected:

23 / 23 YES.

Also verify:

23 / 23 compact mapping

if current architecture defines compact per type.

Do not infer from registry length alone.

Cross-check against authoritative content.

---

# 33. No Gray Slots

The Batch-2 rule remains authoritative.

A covered ICON-003 type rendered as a plain gray image area is:

FAIL

until explained.

For the three infrastructure assets distinguish:

loaded image

safe fallback

failed image

loading state

bad registry path

bad processing.

At final successful state:

no current authoritative building should require category fallback during
normal successful loading.

---

# 34. Real Runtime Desktop Validation

Start the supported API/web runtime.

Use a representative valid session.

Open the REAL:

BuildingsScreen / Baukatalog.

Capture:

docs/architecture/reviews/evidence/
BUILDING_INFRASTRUCTURE_23_OF_23_CATALOG_DESKTOP.png

Evidence must visibly include:

access_road

port

rail_terminal

with production ICON-003 art.

Wait until image load/error state is terminal before capture.

---

# 35. Infrastructure Runtime Acceptance

At real catalog scale verify:

access_road:

- reads as road infrastructure;
- not visually lost because of low height;
- no excessive empty slot;
- no building-like distortion.

port:

- reads as port;
- crane/quay/yard cues survive;
- does not collapse into warehouse.

rail_terminal:

- reads as rail terminal;
- rail/loading cues survive;
- remains distinct from port and logistics buildings.

All:

- clean alpha;
- no halo;
- no crop;
- no stretch;
- no gray loading residue.

---

# 36. 23/23 Runtime Evidence

Create a durable evidence view that proves complete current-content coverage.

Preferred:

docs/architecture/reviews/evidence/
BUILDING_ICON_003_23_OF_23_RUNTIME_COVERAGE.png

This may be:

a real BuildingsScreen capture sequence/stitched evidence

or:

a task-owned runtime evidence board derived from real rendered catalog cards.

It must prove:

all 23 current authoritative building types resolve to ICON-003.

Do not fake runtime proof using source masters alone.

---

# 37. Narrow Runtime Validation

Validate approximately:

480×900

or the established narrow viewport.

Capture:

docs/architecture/reviews/evidence/
BUILDING_INFRASTRUCTURE_23_OF_23_CATALOG_NARROW.png

Ensure at least one or more infrastructure entries are actually visible in
the evidence, through scrolling/capture if necessary.

Verify:

art loads;

no new horizontal overflow;

cards remain usable;

text remains readable;

buttons remain reachable;

no new nested-scroll regression;

linear road composition remains legible.

---

# 38. Catalog-Scale Comparison

Compare production rendering against the approved contract evidence:

INFRASTRUCTURE_VISUAL_CONTRACT_CATALOG_SCALE.png.

The production result should preserve the approved visual reading.

If runtime derivative processing materially changes:

contrast

alpha

scale

crop

or identity:

fix the production processing/integration.

Do not silently accept degradation between pilot and production.

---

# 39. World Firewall

NO World production integration.

Do not modify:

PGWorldCanvas

map building markers

minimap

routes

camera

region rendering

World placement.

Especially:

do NOT turn access_road into oriented road-map graphics here.

Future World-specific derivative remains separate if needed.

---

# 40. Placement Firewall

Do not change:

X/Y placement

footprint rules

orientation

drag/drop

map-click placement

adjacency

connectivity

road snapping

rail snapping

port water attachment.

Art production does not authorize interaction/gameplay changes.

---

# 41. Transport Firewall

Do not add:

road simulation

traffic

rail routing

train movement

ship movement

cargo routing

terminal throughput

network connectivity.

Infrastructure artwork communicates identity only.

---

# 42. Gameplay Firewall

NO changes to:

costs

construction durations

production

recipes

energy

market

research

workforce

economy

simulation

save schema.

---

# 43. Content Firewall

NO authoritative content changes.

Do not modify YAML:

names

descriptions

categories

footprints

unlocks

milestones

research requirements.

Art must follow content.

Content must not be changed to fit art.

---

# 44. Player Guidance Firewall

Do not fix:

raw milestone IDs

unlock guidance

tutorial actions

direct placement

navigation.

The Player Guidance & Direct Manipulation workstream remains separate.

---

# 45. Deployment Firewall

Do not execute:

POST_V1_DEPLOYMENT_AUTHENTICATION_SAVE_PERSISTENCE_REVIEW.

That workstream remains parked.

---

# 46. Production Alpha Matrix

Required in report:

| Building | Master | Dimensions | Alpha | Transparent Pixels | Background | Halo | Result |
|----------|--------|------------|-------|--------------------|------------|------|--------|

Rows:

access_road

port

rail_terminal.

Required:

3 / 3 PASS.

---

# 47. Production Asset Matrix

Required:

| Building | Grammar | Primary ID | Master | Runtime | Compact | 32px | Registry | Runtime |
|----------|---------|------------|--------|---------|---------|------|----------|---------|

Rows:

access_road

port

rail_terminal.

All must PASS for OPTION A.

---

# 48. Full Coverage Matrix

Generate or report:

| Building ID | Player Name | Grammar | Primary ICON-003 | Compact | Real Runtime | Result |
|-------------|-------------|---------|------------------|---------|--------------|--------|

All 23 current authoritative building types.

Grammar values:

VOLUMETRIC

LINEAR

TERMINAL/YARD.

Expected:

23 PASS.

This is the final proof that the Building Visual Identity production family
covers current content completely.

---

# 49. Infrastructure Differentiation Matrix

Required:

| Infrastructure | Must Read As | Closest Confusion Risk | Primary Distinct | Compact Distinct | Runtime Distinct | Result |
|----------------|--------------|------------------------|------------------|------------------|------------------|--------|

Rows:

access_road
→ risk: generic infrastructure/category symbol

port
→ risk: warehouse/distribution center

rail_terminal
→ risk: warehouse/distribution center/port.

---

# 50. Final Runtime Visual Honesty

Answer explicitly:

1. Does access_road still read as LINEAR infrastructure in the real catalog?

2. Does port still read as port at real runtime size?

3. Does rail_terminal still read as rail terminal at real runtime size?

4. Are port and rail terminal clearly distinct?

5. Do all three belong to the same game as the existing 20?

6. Are all three alpha-clean?

7. Are all three production assets actually loading?

8. Are there any gray covered slots?

9. Do all 23 authoritative building types resolve to ICON-003?

10. Do all 23 compact mappings resolve?

11. Is ICON-002 now only defensive fallback rather than expected current
    content presentation?

12. Is narrow runtime still usable?

13. Has the approved infrastructure grammar survived production processing?

14. Is the Building Visual Identity track ready to close?

Do not answer YES merely because tests pass.

Inspect real evidence.

---

# 51. Loading / Performance Observation

The catalog now potentially contains 23 individual primary images.

Observe:

image readiness;

layout shift;

visible loading gaps;

failed requests;

obvious material delay.

Do not start speculative performance optimization.

If no measured/material issue exists:

leave current loading architecture unchanged.

If a concrete task-local asset issue exists:

fix it.

---

# 52. Production Manifest

Update the authoritative production manifest/catalog to include:

access_road

port

rail_terminal.

Record:

building ID

grammar

primary ID

compact ID

source path

runtime path

production contract version

alpha result

runtime result.

Preserve provenance back to:

approved infrastructure pilot.

---

# 53. Master Inventory

Update:

docs/design/
GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md

Record:

Building Type Visual Identity:
23 / 23 current authoritative types production-covered.

Break down:

20 VOLUMETRIC

1 LINEAR

2 TERMINAL/YARD.

Do not claim:

all future building content permanently covered.

Phrase coverage relative to:

current authoritative 23 building types.

---

# 54. Scenario B Accounting

Record:

new independent authored infrastructure primaries:

3 approved pilot concepts promoted to production.

Do not double-count pilot + production copy as six concepts.

Derived compact glyphs:

3.

Runtime WebPs/PNGs:

derivatives, not independent authored concepts.

Final building/infrastructure primary coverage:

23 current authoritative types.

Scenario B global target remains:

380–520 authored visual deliverables
+
approximately 12 procedural systems.

Do not recompute the target.

Building completion does NOT mean Scenario B overall art completion.

---

# 55. Tests

Extend existing table-driven tests.

Required focused coverage:

access_road primary mapping

port primary mapping

rail_terminal primary mapping

three compact mappings

23 authoritative IDs resolve to production ICON-003

BuildingTypeIcon primary resolution

BuildingTypeIcon compact resolution

safe fallback for unknown/missing ID where architecture supports it

BuildingsScreen integration if existing tests cover it.

Do not create duplicate test architecture.

---

# 56. Production Alpha Validation

Run production alpha validation:

3 / 3 new infrastructure assets.

Also verify no sealed Batch-1/2/3 production asset was accidentally modified
by processing.

If shared tooling rewrites existing files unexpectedly:

investigate before close.

---

# 57. Root Technical Gates

Run:

pnpm typecheck

pnpm lint

pnpm test

pnpm build:web.

Also run:

production alpha validation

focused registry/asset tests

coverage audit.

Required:

PASS.

Repository policy remains:

0 lint errors.

Existing allowed warnings may remain if unchanged.

Do not introduce new avoidable warnings.

---

# 58. Consolidated Definition of Done

Do not stop after registry activation.

Complete:

HUMAN APPROVAL RECORDED
→ CONTRACT FROZEN
→ APPROVED PILOT IDENTITY VERIFIED
→ 3 PRODUCTION SOURCES
→ 3 ALPHA PASS
→ 3 RUNTIME DERIVATIVES
→ 3 PRODUCTION COMPACTS
→ REGISTRY ACTIVATION
→ BuildingTypeIcon
→ BUILDINGSSCREEN
→ 23-PRIMARY FAMILY BOARD
→ 23-COMPACT FAMILY BOARD
→ 23/23 COVERAGE AUDIT
→ REAL DESKTOP
→ REAL 23/23 RUNTIME EVIDENCE
→ REAL NARROW
→ ROOT GATES
→ INVENTORY
→ FINAL REPORT.

Fix ordinary task-local defects before returning.

---

# 59. Final Close-Candidate Report

Create:

docs/architecture/reviews/
POST_V1_BUILDING_INFRASTRUCTURE_PRODUCTION_23_OF_23_CLOSE_CANDIDATE.md

Required sections:

## A. Executive Summary

## B. Repository Baseline

## C. Human Contract Approval

## D. Sealed Batch 1–3 Authority

## E. Approved Infrastructure Contract

## F. Exact Production Scope

## G. Approved Pilot Provenance

## H. Production Promotion

## I. access_road — LINEAR

## J. port — TERMINAL/YARD

## K. rail_terminal — TERMINAL/YARD

## L. Production Alpha QA

## M. Runtime Derivatives

## N. Compact Promotion

## O. Registry Activation

## P. BuildingTypeIcon Integration

## Q. BuildingsScreen Integration

## R. 23-Primary Family QA

## S. 23-Compact Family QA

## T. Full 23/23 Coverage Audit

## U. Infrastructure Differentiation

## V. Runtime Asset Resolution

## W. Desktop Runtime Validation

## X. 23/23 Runtime Evidence

## Y. Narrow Runtime Validation

## Z. Runtime Visual Honesty

## AA. Loading / Performance Observation

## AB. Tests / Technical Gates

## AC. Production Manifest

## AD. Master Inventory

## AE. Scenario B Accounting

## AF. World / Placement / Transport / Gameplay / Content Firewalls

## AG. Pre-Existing UX Findings

## AH. Repository Integrity

## AI. Definition of Done

## AJ. Building Visual Identity Track Closure

## AK. Final Decision

---

# 60. Required Durable Evidence

Create/update:

docs/architecture/reviews/evidence/
BUILDING_ICON_003_23_OF_23_PRIMARY_FAMILY_BOARD.png

docs/architecture/reviews/evidence/
BUILDING_ICON_003_23_OF_23_COMPACT_FAMILY_BOARD.png

docs/architecture/reviews/evidence/
BUILDING_INFRASTRUCTURE_23_OF_23_CATALOG_DESKTOP.png

docs/architecture/reviews/evidence/
BUILDING_ICON_003_23_OF_23_RUNTIME_COVERAGE.png

docs/architecture/reviews/evidence/
BUILDING_INFRASTRUCTURE_23_OF_23_CATALOG_NARROW.png

Existing approved contract evidence remains historical evidence:

INFRASTRUCTURE_VISUAL_CONTRACT_PRIMARY_BOARD.png

INFRASTRUCTURE_VISUAL_CONTRACT_COMPACT_BOARD.png

INFRASTRUCTURE_VISUAL_CONTRACT_CATALOG_SCALE.png.

Do not overwrite the contract evidence with production captures.

---

# 61. Building Visual Identity Track Closure Criteria

The entire Building Visual Identity production track is close-ready only if:

- B2 volumetric contract remains sealed;
- Infrastructure contract is APPROVED / PRODUCTION AUTHORITY;
- Batch 1 remains sealed;
- Batch 2 remains sealed;
- Batch 3 remains sealed;
- access_road production PASS;
- port production PASS;
- rail_terminal production PASS;
- alpha 3/3 PASS;
- compact 3/3 PASS @32px;
- registry activation PASS;
- BuildingTypeIcon PASS;
- BuildingsScreen PASS;
- all 23 authoritative building types resolve to ICON-003;
- all 23 primary runtime assets load;
- all expected compact mappings resolve;
- 23-primary family QA PASS;
- compact family QA PASS;
- desktop runtime PASS;
- narrow runtime PASS;
- no unexplained gray slots;
- root typecheck PASS;
- root lint PASS;
- root tests PASS;
- root build:web PASS;
- master inventory updated;
- gameplay unchanged;
- content unchanged;
- World unchanged;
- placement unchanged;
- transport mechanics unchanged;
- safe fallback architecture preserved.

---

# 62. Stop Conditions

STOP only for a real blocker:

- approved pilot source cannot be reliably identified;
- approved infrastructure art cannot survive production processing;
- real runtime asset loading requires material architecture change;
- registry architecture materially rejects infrastructure IDs;
- one asset materially violates the approved human visual contract;
- full coverage audit reveals authoritative building inventory mismatch;
- gameplay/content changes would be required;
- unexpected cross-scope regression;
- repository ownership cannot be safely separated.

Ordinary problems are NOT stop conditions:

bad runtime path

missing WebP

registry typo

alpha processing issue

capture timing

loading-state issue

compact file path

local CSS sizing

manifest omission

evidence tooling defect.

Fix those locally.

---

# 63. Final Decision

Return exactly ONE:

## OPTION A —
BUILDING / INFRASTRUCTURE VISUAL IDENTITY
23/23 PRODUCTION COMPLETION
FINAL CLOSE CANDIDATE READY

Use only if the complete Definition of Done passes.

This means the entire Building Visual Identity production track is ready for
human/independent final closure.

---

## OPTION B —
INFRASTRUCTURE PRODUCTION INTEGRATION BLOCKED

Use when approved art exists but runtime production integration cannot be
completed within bounded scope.

State exact type and cause.

---

## OPTION C —
23/23 COVERAGE AUDIT BLOCKED

Use when authoritative inventory or registry reality prevents a trustworthy
23/23 claim.

---

## OPTION D —
APPROVED INFRASTRUCTURE CONTRACT CANNOT BE PRESERVED IN PRODUCTION

Use only if production processing materially breaks the human-approved
visual result and bounded repair cannot restore it.

---

# 64. Repository Integrity

Before finalizing:

git status --short
git diff --name-only
git diff --stat

Separate:

TASK-OWNED CONTRACT/PILOT

TASK-OWNED PRODUCTION

PRE-EXISTING / UNRELATED.

Do not stage.
Do not commit.
Do not push.
Do not tag.

---

# 65. Execution Summary

Return:

# Project Genesis
# Building / Infrastructure Visual Identity
## 23/23 Production Completion — Execution Summary

### Baseline

- HEAD:
- branch:
- working tree:

### Human Authority

- Infrastructure Visual Contract:
APPROVED / PASS / SEALED

- production authority recorded:
YES / NO

### Existing Sealed Coverage

- Batch 1:
8

- Batch 2:
8

- Batch 3:
4

- existing total:
20 / 23

### Infrastructure Production

- access_road:
PASS / FAIL

- grammar:
LINEAR

- port:
PASS / FAIL

- grammar:
TERMINAL/YARD

- rail_terminal:
PASS / FAIL

- grammar:
TERMINAL/YARD

### Production Assets

- primary masters:
X / 3

- runtime derivatives:
X / 3

- compact glyphs:
X / 3

- alpha:
X / 3

- compact @32:
X / 3

### Registry

- primary mapping:
X / 3

- compact mapping:
X / 3

- production coverage set:
23 / 23 or actual

- safe fallback preserved:
YES / NO

### Family QA

- 23-primary board:
PASS / FAIL

- 23-compact board:
PASS / FAIL

- infrastructure compatibility:
PASS / FAIL

- material family fracture:
YES / NO

### Runtime

- desktop:
PASS / FAIL

- access_road visible:
YES / NO

- port visible:
YES / NO

- rail_terminal visible:
YES / NO

- 23/23 runtime coverage:
PASS / FAIL

- narrow:
PASS / FAIL

- unexplained gray slots:
0 / actual

### Coverage

- authoritative building types:
23

- ICON-003 primary:
X / 23

- ICON-003 compact:
X / 23

- expected current-content ICON-002 fallback:
0 / actual

- defensive fallback architecture preserved:
YES / NO

### Gates

- typecheck:
- lint:
- tests:
- build:web:
- alpha:
- focused registry tests:
- coverage audit:

### Scenario B

- new independent infrastructure primary concepts:
3

- production promotions:
3

- derived compacts:
3

- building/infrastructure primary coverage:
23 / 23

- overall Scenario B:
IN PROGRESS

- global target:
UNCHANGED — 380–520 authored + ~12 procedural

### Firewalls

- World:
NONE

- placement:
NONE

- transport mechanics:
NONE

- gameplay:
NONE

- content:
NONE

- Player Guidance:
NONE

- Deployment/Auth/Persistence:
NOT EXECUTED

### Repository Integrity

- task-owned contract/pilot:
- task-owned production:
- unrelated:

- commit:
NONE

- push:
NONE

- tag:
NONE

### Building Visual Identity Track

READY TO CLOSE:
YES / NO

### Final Decision

OPTION A / OPTION B / OPTION C / OPTION D

STOP.

---

# CORE RULE

THE ART DIRECTION IS ALREADY APPROVED.

DO NOT DESIGN IT AGAIN.

PROMOTE EXACTLY:

access_road
port
rail_terminal.

KEEP THEM IN ICON-003.

PRESERVE THEIR APPROVED PHYSICAL GRAMMARS:

access_road
→ LINEAR

port
→ TERMINAL/YARD

rail_terminal
→ TERMINAL/YARD.

DO NOT TURN ACCESS ROAD INTO A BUILDING.

DO NOT TURN PORT OR RAIL TERMINAL INTO GENERIC WAREHOUSES.

DO NOT INVENT TRANSPORT GAMEPLAY.

DO NOT INTEGRATE ROAD TILES INTO WORLD.

PROMOTE THE APPROVED PILOTS THROUGH THE EXISTING PRODUCTION PIPELINE.

PROVE THE PLAYER CAN SEE THEM IN THE REAL BUILDINGSSCREEN.

VERIFY EVERY CURRENT AUTHORITATIVE BUILDING TYPE.

TARGET:

23 / 23 ICON-003 PRIMARY COVERAGE.

PRESERVE ICON-002 AS DEFENSIVE FALLBACK ARCHITECTURE.

IF ALL GATES PASS:

RETURN ONE FINAL CLOSE CANDIDATE
FOR THE ENTIRE BUILDING VISUAL IDENTITY TRACK.

THEN STOP.