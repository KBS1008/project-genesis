# Cursor Implementation Prompt
# Project Genesis
# Post-V1 Game Art & Visual Content
# ICON-004 — Technology / Research Visual Identity
# Detailed Production Batch 2

MODE:
BOUNDED PRODUCTION ART BATCH
→ PRESERVE SEALED BATCH 1
→ FREEZE APPROVED ICON-004 CONTRACT
→ PRODUCE EXACTLY 6 NEW DETAILED TECHNOLOGY PRIMARIES
→ REUSE EXISTING PRODUCTION PIPELINE
→ EXTEND MANIFEST / REGISTRY / RESOLVER DATA
→ NO RESEARCHSCREEN REDESIGN
→ TECHNICAL + VISUAL QA
→ REAL RUNTIME VALIDATION
→ UPDATE SCENARIO-B ACCOUNTING
→ ONE FINAL CLOSE CANDIDATE
→ STOP

THIS IS PRODUCTION.

THIS IS NOT AN ART-DIRECTION PILOT.
THIS IS NOT A SELECTION REVIEW.
THE EXACT BATCH-2 TECHNOLOGIES ARE ALREADY APPROVED FOR IMPLEMENTATION.

DO NOT REOPEN BATCH 1.
DO NOT REGENERATE BATCH-1 ART.
DO NOT CHANGE THE ICON-004 ART DIRECTION.
DO NOT CREATE ABSTRACT MANAGEMENT / FINANCE / AI ART.
DO NOT CREATE CATEGORY GLYPHS.
DO NOT REDESIGN RESEARCHSCREEN.
DO NOT MODIFY RESEARCH CONTENT.
DO NOT MODIFY GAMEPLAY.
DO NOT MODIFY TECHNOLOGY COSTS / DEPENDENCIES / UNLOCKS.
DO NOT MODIFY ICON-001 / ICON-002 / ICON-003.
DO NOT MODIFY BUILDING ART.
DO NOT MODIFY WORLD.
DO NOT START BATCH 3.
DO NOT START ABSTRACT ART-DIRECTION WORK.
NO COMMIT.
NO PUSH.
NO TAG.

---

# 1. Purpose

ICON-004 Production Batch 1 is:

CLOSED / PASS / SEALED.

Current sealed production coverage:

8 / 22 technologies with detailed Tier-1 primary art

10 / 10 used TechnologyCategory values with Tier-2 compact identity.

The subsequent Batch-2 Selection Review returned:

OPTION A —
ICON-004 DETAILED PRODUCTION BATCH 2
CLEARLY DEFINED AND READY FOR IMPLEMENTATION.

Exactly six technologies were selected.

This slice shall produce those six and no others.

After successful completion expected detailed coverage is:

14 / 22.

The remaining eight technologies stay deferred.

---

# 2. Authority

Read first:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Then read:

docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md

docs/design/research/
TECHNOLOGY_RESEARCH_ICON_004_VISUAL_CONTRACT.md

Batch-1 production manifest

Batch-1 close-candidate report

Batch-2 Selection Review:

docs/architecture/reviews/
POST_V1_ICON_004_TECHNOLOGY_DETAILED_PRODUCTION_BATCH_2_SELECTION_REVIEW.md

Inspect current production ICON-004 assets and evidence.

Inspect:

visual-asset-registry.ts

visual-asset-loader.ts

technology visual resolver

TechnologyVisual

ResearchScreen

Batch-1 asset-generation / alpha / derivative / evidence tooling.

CURRENT REPOSITORY STATE IS AUTHORITY.

---

# 3. Baseline

Record before changes:

git rev-parse HEAD
git status --short
git log -1 --oneline
git diff --name-only
git diff --stat

Expected committed Batch-1 authority:

HEAD includes commit:

116b084
Deliver ICON-004 research visual identity production Batch 1

Do not require that exact HEAD if later legitimate commits exist.

Verify instead that Batch 1 remains present and sealed.

Separate:

TASK-OWNED BATCH-2 WORK

PRE-EXISTING / UNRELATED CHURN.

Do not absorb unrelated changes.

---

# 4. Frozen Production Authority

Preserve:

Tier 1:
DETAILED TECHNOLOGY PRIMARY ART

Tier 2:
TECHNOLOGYCATEGORY COMPACT GLYPH

Fallback:
GENERIC RESEARCH IDENTITY.

Preserve:

transparent technology vignette

high-quality stylized industrial rendering

technology/capability/process focus

96–128px production readability

128–256px reward value

no text in art

no baked UI

no category badge

no building-exterior composition.

Do not reopen these decisions.

---

# 5. Exact Batch-2 Set

Create exactly SIX new detailed production primaries:

1. basic_woodworking
2. industrial_assembly
3. smart_grid
4. warehouse_systems
5. process_automation
6. organic_chemistry

No substitutions.

No seventh technology.

No partial Batch-3 production.

If one of these six proves genuinely semantically impossible:

STOP only after bounded task-local repair attempts and return the exact blocker.

Do not silently replace it with another technology.

---

# 6. Authoritative Semantics

Before generating each image, inspect its current YAML/content.

Use actual:

player-facing name

category

description

dependencies

deterministic unlock/effect information.

The Selection Review provides the approved visual subject boundary, but current
content remains semantic authority.

Do not modify content.

---

# 7. basic_woodworking

Classification:

A — DIRECT_DETAILED.

Approved subject:

woodworking workstation vignette centered on:

workbench

table saw / cutting apparatus

planer or equivalent supported wood-processing equipment.

Purpose:

represent early wood-processing capability.

Must NOT become:

ICON-003 sawmill building

full woodworking factory

CNC precision-machining repeat

generic lumber pile.

Differentiate from `precision_machining` through:

wood material

simpler early-industrial tooling

manual/mechanical workstation character

different machine silhouette.

Do not add people by default.

---

# 8. industrial_assembly

Classification:

A — DIRECT_DETAILED.

Approved subject:

modular industrial assembly fixture

+
power/torque tooling

+
bounded line-module context.

Purpose:

represent assembly and quality-oriented machinery production capability.

Must NOT become:

complete assembly-plant building

factory hall exterior

duplicate robot-arm hero from `factory_automation`

generic conveyor scene.

Focus on:

fixture

tooling

workpiece

assembly station.

Building-confusion risk:

MEDIUM.

Mitigate through close apparatus composition.

---

# 9. smart_grid

Classification:

C — SYSTEM_VIGNETTE.

Approved subject:

electrical switchgear

+
SCADA/control cabinet

+
bus bars / distribution-control hardware.

Purpose:

represent intelligent grid control and load-balancing capability.

Must NOT imply:

new power-generation technology

smart-city mechanics

city-wide network simulation

new renewable-generation mechanics.

Must NOT repeat:

renewable-energy solar-panel hero

coal-efficiency boiler/furnace language.

The image should read:

GRID CONTROL TECHNOLOGY

not:

POWER PLANT.

---

# 10. warehouse_systems

Classification:

C — SYSTEM_VIGNETTE.

Approved subject:

storage rack segment

+
shuttle/conveyor mechanism

+
inventory/control terminal hardware.

Purpose:

represent storage/inventory-system technology.

Must NOT become:

ICON-003 warehouse building

warehouse exterior

generic logistics-hub building

port/intermodal crane scene.

Focus inside the system:

rack mechanics

movement/storage hardware

control equipment.

Building-confusion risk:

MEDIUM.

Use close system composition with no roofline/building envelope.

---

# 11. process_automation

Classification:

C — SYSTEM_VIGNETTE.

Approved subject:

PLC/control rack

+
sensor junctions

+
control panel

+
small bounded production-line segment.

Purpose:

represent process sensing/control automation.

Must NOT become:

factory_automation duplicate

robot-arm hero

autonomous workforce

humanoid robotics

AI system.

Critical differentiation:

`factory_automation`
= motion / robot-cell automation

`process_automation`
= sensing / PLC / control-loop hardware.

The difference must be visually obvious on the 14-family board.

---

# 12. organic_chemistry

Classification:

B — PROCESS_VIGNETTE.

Approved subject:

industrial chemical process cluster:

glass-lined or industrial reactor

+
distillation column / separation apparatus

+
bounded piping/process hardware.

Purpose:

represent industrial organic chemistry/process capability.

Must NOT become:

consumer laboratory glassware

pharmaceutical branding

fantasy alchemy

generic scientist lab

full chemical factory building

polymer extrusion.

This image establishes the first detailed chemistry-family visual anchor.

`polymer_science` remains deferred.

---

# 13. Production Art Quality

All six must meet the existing approved ICON-004 quality band.

Default master:

1024×1024 RGBA.

Target:

beautiful

detailed

stylized

industrial

game-ready

clear dominant subject

controlled supporting detail

strong material rendering

clean silhouette

transparent background.

These are production assets, not placeholders.

---

# 14. Family Coherence

The six new images must feel coherent with the existing eight.

Shared family properties:

quality level

lighting discipline

perspective family

detail density

ground/shadow treatment

industrial material language

transparent vignette model.

Do not make the six visually identical.

Target:

14 DISTINCT TECHNOLOGIES
IN ONE GAME.

---

# 15. Do Not Reproduce Batch-1 Subjects

Explicitly inspect against:

precision_machining

renewable_energy

semiconductor_process

advanced_metallurgy

coal_efficiency

intermodal_logistics

circuit_design

factory_automation.

Avoid visual duplication.

Required differentiation examples:

basic_woodworking ≠ precision_machining

smart_grid ≠ renewable_energy / coal_efficiency

warehouse_systems ≠ intermodal_logistics

process_automation ≠ factory_automation

organic_chemistry ≠ advanced_metallurgy.

---

# 16. Technology-vs-Building Rule

No new primary may read primarily as:

a placeable building.

Avoid:

roofline

complete exterior envelope

architectural hero composition

campus composition

factory facade.

Prefer:

apparatus

machine

skid

cabinet

process cluster

line subsystem.

At 128px the subject should answer:

WHAT TECHNOLOGICAL CAPABILITY IS THIS?

not:

WHAT BUILDING IS THIS?

---

# 17. No Text Inside Artwork

No:

technology names

fake labels

company names

signs

numbers

watermarks

pseudo-writing

logos.

Generated pseudo-text is a defect.

Repair/regenerate.

---

# 18. People

Default:

NO PEOPLE.

Do not use workers/scientists as the main identity.

The technology is the subject.

---

# 19. Generated-Art QA

Inspect every new master manually.

Check:

impossible machinery

melted geometry

floating parts

duplicated equipment

broken perspective

bad cables/pipes

nonsense controls

pseudo-text

logos

background contamination

fake transparency

alpha halo

unintended complete building.

Repair/regenerate bounded defects.

Do not accept first-generation output solely because it looks attractive.

---

# 20. Alpha QA

All six new production masters require:

real alpha channel

transparent background

clean edges

no white rectangle

no black rectangle

no baked checkerboard

no material halo.

Record:

dimensions

format

transparent percentage

edge assessment.

Required:

6 / 6 PASS.

Existing Batch-1 assets are sealed.

Do not alter them merely to rerun QA.

---

# 21. Runtime Derivatives

Reuse the Batch-1 production pipeline.

Create the same required production derivatives.

Do not introduce a new asset-format architecture in this batch.

The Selection Review noted that catalog presentation may still use large PNG
assets.

Do NOT start a performance optimization workstream here.

If the existing pipeline already produces WebP:

continue doing so consistently.

If ResearchScreen intentionally prefers PNG:

preserve current behavior unless a task-local correctness issue requires a
change.

Document runtime file sizes.

Do not treat file size alone as a Batch-2 blocker.

---

# 22. Asset Counting

Each unique new technology primary counts:

ONCE.

Batch 2 adds:

6 unique authored Tier-1 concepts.

Do NOT count separately:

1024 PNG

WebP derivative

resized copies

registry entries

screenshots

family boards

manifest rows.

Projected detailed production coverage:

14 / 22.

---

# 23. Production Paths

Follow the established Batch-1 production naming/path convention.

Use technology IDs.

No `pilot` suffix.

No ambiguous filenames.

Do not relocate Batch-1 assets.

---

# 24. Production Manifest

Create a Batch-2 manifest or extend the production manifest according to the
existing architecture.

Record for each new technology:

ID

player-facing name

category

classification

primary subject

master path

runtime derivative paths

source dimensions

alpha QA

production batch

production status

category compact relationship.

Do not rewrite Batch-1 historical records.

---

# 25. Registry

Extend the existing ICON-004 production registry for exactly these six IDs.

No duplicate local mappings.

No ResearchScreen switch statement.

Use the existing single-source architecture.

Verify all six paths resolve.

---

# 26. Resolver

Extend the existing detailed technology ID coverage from:

8

to:

14.

Preserve resolver hierarchy:

technology-specific detailed primary
→ category compact
→ generic research fallback.

Do not change behavior for the eight remaining technologies.

They must remain category-only.

Unknown IDs must continue to resolve safely.

---

# 27. Category Compacts

Current used-category coverage:

10 / 10.

Do not create new category glyphs.

All six Batch-2 technologies must use the existing compact layer.

Verify mappings.

Do not redesign category art.

---

# 28. ResearchScreen

No material ResearchScreen redesign is expected.

The Selection Review concluded the existing:

TechnologyVisual

+
80px presentation

+
dark art pad

can consume new registry mappings automatically.

Preferred production change:

NONE in ResearchScreen itself.

If no code change is necessary:

do not touch it.

If a small task-local correctness change is genuinely required:

document why.

---

# 29. Mixed Coverage After Batch 2

Expected state:

14 technologies:
DETAILED PRIMARY

8 technologies:
CATEGORY COMPACT ONLY.

This mixed state must remain intentional.

Do not reserve fake detailed-art boxes for the remaining eight.

Do not show another technology's art.

Do not generate placeholders.

---

# 30. Explicit Deferred Set

After Batch 2 these eight remain deferred:

distribution_networks

polymer_science

sustainable_agriculture

crop_optimization

corporate_management

executive_leadership

financial_planning

predictive_analytics.

Verify against current content.

Do not produce them.

Classification authority from the Selection Review:

later detailed batch:
distribution_networks
polymer_science
sustainable_agriculture
crop_optimization

abstract art-direction pilot:
corporate_management
executive_leadership
financial_planning
predictive_analytics.

Mark:

DEFERRED — NOT REJECTED.

---

# 31. No Abstract Art

Especially do not generate:

boardroom scenes

executive portraits

money charts

stock charts

glowing AI brains

robot heads

holographic AI faces

generic dashboard screens

for the four abstract technologies.

Their visual grammar remains unresolved.

---

# 32. 14-Primary Family Board

Create:

docs/architecture/reviews/evidence/
ICON_004_PRODUCTION_BATCH_2_DETAILED_FAMILY_BOARD_14.png

Show:

all 8 sealed Batch-1 primaries

+
all 6 new Batch-2 primaries.

Same display size.

Neutral/dark Project Genesis background.

Labels outside artwork.

The board must expose:

quality drift

subject repetition

building confusion

camera inconsistency

detail-density mismatch.

Batch-1 art must remain unchanged.

---

# 33. New-Six Family Board

Also create:

docs/architecture/reviews/evidence/
ICON_004_PRODUCTION_BATCH_2_NEW_SIX_FAMILY_BOARD.png

Show only the six new primaries at a larger inspection size.

Purpose:

human visual QA.

Labels outside artwork.

---

# 34. Scale Board

Create:

docs/architecture/reviews/evidence/
ICON_004_PRODUCTION_BATCH_2_SCALE_BOARD.png

For each of the six new primaries show:

64px

96px

128px

256px.

Acceptance focus:

96px

128px.

Required:

6 / 6 readable at 96px

6 / 6 PASS at 128px.

64px is lower-bound inspection.

256px is detailed-art defect inspection.

---

# 35. Technology-vs-Building Board

Create:

docs/architecture/reviews/evidence/
ICON_004_PRODUCTION_BATCH_2_TECH_VS_BUILDING_BOARD.png

Show representative new technology primaries next to relevant ICON-003 building
art where confusion risk exists.

At minimum inspect:

basic_woodworking vs sawmill

industrial_assembly vs assembly_plant

warehouse_systems vs warehouse

smart_grid vs relevant power building

organic_chemistry against industrial building language where useful.

Purpose:

prove:

SAME GAME

DIFFERENT SEMANTIC ROLE.

Do not modify ICON-003.

---

# 36. Differentiation Evidence

The report must explicitly compare:

basic_woodworking
vs precision_machining

industrial_assembly
vs factory_automation

smart_grid
vs renewable_energy / coal_efficiency

warehouse_systems
vs intermodal_logistics

process_automation
vs factory_automation

organic_chemistry
vs advanced_metallurgy.

For each:

state the dominant visual distinction.

No numeric scoring.

---

# 37. Runtime Desktop Evidence

Capture real runtime:

docs/architecture/reviews/evidence/
ICON_004_PRODUCTION_BATCH_2_RESEARCH_DESKTOP.png

Preferred viewport:

1440×900.

Ensure runtime evidence includes several new Batch-2 primaries.

Scroll/capture appropriately if necessary.

Do not use static mock instead.

---

# 38. Runtime Narrow Evidence

Capture real runtime:

docs/architecture/reviews/evidence/
ICON_004_PRODUCTION_BATCH_2_RESEARCH_NARROW.png

Preferred viewport:

480×900.

Verify:

new art resolves

no broken images

no severe clipping introduced

no ICON-004-induced horizontal overflow

existing controls remain usable.

This is validation, not responsive redesign.

---

# 39. Runtime Mixed-Coverage Evidence

Create/capture:

docs/architecture/reviews/evidence/
ICON_004_PRODUCTION_BATCH_2_MIXED_COVERAGE.png

Show in real runtime where practical:

new detailed technology

sealed Batch-1 detailed technology

remaining category-only technology.

Purpose:

prove resolver behavior after 14/22 coverage.

---

# 40. Runtime Loading

Reuse the Batch-1 runtime capture lessons.

The capture must wait for actual image loading.

Do not accept:

gray slots

blank lazy placeholders

capture-before-decode.

If evidence tooling needs a small task-local update to recognize 14 detailed
IDs:

update it.

Do not redesign tooling broadly.

---

# 41. Asset Resolution Verification

Programmatically verify:

14 / 14 production detailed IDs resolve to valid detailed assets

10 / 10 used categories resolve to compact assets

8 remaining technologies resolve to category compact

unknown technology resolves to generic fallback

0 broken asset paths

0 duplicate wrong mappings.

---

# 42. Full Coverage Matrix

Required:

| Technology | Player Name | Category | Detailed Primary | Batch | Compact | Runtime Result |
|------------|-------------|----------|------------------|-------|---------|----------------|

All 22 enabled technologies.

Expected:

8 Batch-1 detailed

6 Batch-2 detailed

8 category-only.

Do not mark planned future art as active.

---

# 43. Batch-2 QA Matrix

Required:

| Technology | Subject | 1024 Master | Alpha | 96px | 128px | Semantic Honesty | Building Confusion | Result |
|------------|---------|-------------|-------|------|-------|------------------|--------------------|--------|

Exactly six rows.

All must PASS for OPTION A.

---

# 44. Differentiation Matrix

Required:

| New Technology | Compared Against | Key Visual Difference | Repetition Risk | Result |
|----------------|------------------|-----------------------|-----------------|--------|

Cover all six.

Use LOW / MEDIUM / HIGH for repetition risk.

No numeric scores.

---

# 45. Human-Quality Standard

Cursor must perform bounded visual QA before returning.

For each new image ask:

Is it genuinely beautiful?

Is it detailed enough for the approved Tier-1 family?

Does it look production-quality?

Does it represent this technology rather than merely its category?

Does it remain distinct at 96–128px?

Does it reward inspection at 256px?

Does it avoid building-art confusion?

Does it avoid unsupported gameplay implications?

If an obvious defect exists:

repair it within the batch.

Do not knowingly return a weak close candidate simply to reach 6/6.

---

# 46. Human Visual Review Boundary

Cursor does NOT provide final human aesthetic approval.

Cursor may return OPTION A when implementation/QA is complete.

Independent human/ChatGPT visual review may still request one bounded art
repair based on the evidence boards.

Do not commit before that independent gate.

---

# 47. Master Inventory

Update:

docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md

only after production assets are actually present and verified.

Research row should become an honest state such as:

PARTIAL — ICON-004 PRODUCTION BATCH 2
14/22 detailed
10/10 category compact.

Do not mark Research COMPLETE.

Update Scenario-B authored accounting:

+6 unique authored Tier-1 concepts.

No derivative inflation.

---

# 48. Scenario-B Target

Do not change:

~380–520 authored deliverables

+
~12 procedural systems.

The target remains a planning envelope.

Do not claim Batch 2 completes Scenario B.

---

# 49. Contract

Do not reopen the ICON-004 production contract.

Update version/history only if the repository convention requires recording
Batch-2 production activation.

No new art-direction rules should be needed.

If a selected technology genuinely exposes a missing contract rule:

make the smallest compatible clarification.

Do not redesign the family.

---

# 50. Tests

Extend focused tests for:

all six new detailed IDs

14-total detailed ID coverage

registry integrity

resolver behavior

remaining category fallback

unknown fallback

manifest/path integrity

where existing architecture supports them.

Preserve existing Batch-1 tests.

---

# 51. Root Gates

Run:

pnpm typecheck

pnpm lint

pnpm test

pnpm build:web

Required:

TYPECHECK PASS

LINT PASS — 0 errors

TEST PASS

BUILD:WEB PASS.

If task-owned changes introduce a failure:

repair it.

Do not absorb unrelated debt.

---

# 52. Asset Gates

Required:

new master dimensions:
6 / 6 PASS

new alpha:
6 / 6 PASS

96px:
6 / 6 READABLE

128px:
6 / 6 PASS

manifest:
PASS

registry:
PASS

resolver:
PASS

runtime paths:
PASS.

---

# 53. Runtime Gates

Required:

desktop:
PASS

narrow:
PASS

mixed coverage:
PASS

new detailed images visible:
6 / 6 where runtime navigation/capture can exercise them

broken images:
0

gray/blank unresolved slots:
0

raw technology IDs newly introduced:
0

Research gameplay regression:
0.

---

# 54. Performance Boundary

Record runtime asset sizes for the six new assets.

Do not start optimization solely because the masters are large.

Do not create a 256px runtime ladder unless:

existing pipeline already requires it

or:

a concrete Batch-2 correctness/runtime problem makes it necessary.

If load performance is visibly/materially broken:

report evidence.

Otherwise:

DEFER performance optimization.

---

# 55. Content Firewall

No modifications to:

game-content/research/*.yaml

technology IDs

technology names

descriptions

categories

dependencies

costs

durations

unlock effects.

---

# 56. Gameplay Firewall

No modifications to:

research progression

unlock logic

simulation

economy

save schema

milestones

production logic.

---

# 57. UI Firewall

No material redesign of:

ResearchScreen

research cards

navigation

sorting/filtering

actions

research-state semantics.

The existing visual integration is sealed.

Only task-local evidence/correctness fixes are allowed.

---

# 58. Visual-Family Firewall

No modifications to:

ICON-001

ICON-002

ICON-003

Building B2 art

Building infrastructure art

World art

menu scenics

brand.

Use only for comparison.

---

# 59. Repository Integrity

Before finalizing:

git status --short
git diff --name-only
git diff --stat

Separate:

BATCH-2 MASTER ART

BATCH-2 RUNTIME ASSETS

MANIFEST

REGISTRY / RESOLVER

TESTS

EVIDENCE

INVENTORY / CONTRACT DOCS

CAPTURE TOOLING IF CHANGED

UNRELATED.

No staging.
No commit.
No push.
No tag.

---

# 60. Required Close-Candidate Report

Create:

docs/architecture/reviews/
POST_V1_ICON_004_TECHNOLOGY_DETAILED_PRODUCTION_BATCH_2_CLOSE_CANDIDATE.md

Required sections:

## A. Executive Summary

## B. Repository Baseline

## C. Sealed Authority

## D. Exact Batch-2 Scope

## E. Authoritative Semantic Verification

## F. New Primary Art

## G. Per-Technology Subject Boundaries

## H. Generated-Art QA

## I. Alpha / Technical QA

## J. Scale QA

## K. 14-Primary Family Coherence

## L. Technology-vs-Building Gate

## M. Batch-1 / Batch-2 Differentiation

## N. Production Assets / Derivatives

## O. Production Manifest

## P. Registry Extension

## Q. Resolver Coverage

## R. Category Compact Compatibility

## S. ResearchScreen Integration

## T. Mixed-Coverage Behavior

## U. Desktop Runtime Validation

## V. Narrow Runtime Validation

## W. Full 22-Technology Coverage Matrix

## X. Deferred Eight Technologies

## Y. Scenario-B Accounting

## Z. Master Inventory Update

## AA. Performance Boundary

## AB. Tests

## AC. Root Gates

## AD. Firewalls

## AE. Repository Integrity

## AF. Remaining Risks

## AG. Human Visual Review Evidence

## AH. Final Decision

---

# 61. Required Evidence Index

Report exact paths for:

ICON_004_PRODUCTION_BATCH_2_DETAILED_FAMILY_BOARD_14.png

ICON_004_PRODUCTION_BATCH_2_NEW_SIX_FAMILY_BOARD.png

ICON_004_PRODUCTION_BATCH_2_SCALE_BOARD.png

ICON_004_PRODUCTION_BATCH_2_TECH_VS_BUILDING_BOARD.png

ICON_004_PRODUCTION_BATCH_2_RESEARCH_DESKTOP.png

ICON_004_PRODUCTION_BATCH_2_RESEARCH_NARROW.png

ICON_004_PRODUCTION_BATCH_2_MIXED_COVERAGE.png

plus any additional useful QA evidence.

---

# 62. Stop Conditions

STOP only for genuine blockers:

one selected technology cannot be represented honestly after semantic
verification;

approved art contract fundamentally cannot handle one selected subject;

production asset integrity cannot be repaired;

registry/resolver extension requires material architecture change;

ResearchScreen requires material redesign;

unexpected cross-scope regression;

task ownership cannot be separated.

Do NOT stop for:

one poor generation

alpha cleanup

cropping

minor perspective mismatch

asset naming

manifest typo

test fixture

capture timing

evidence-board layout.

Repair those within the slice.

---

# 63. Definition of Done

Complete:

BASELINE
→ VERIFY SEALED BATCH 1
→ VERIFY SIX TECHNOLOGY SEMANTICS
→ CREATE EXACTLY SIX NEW PRIMARIES
→ GENERATED-ART QA
→ ALPHA QA
→ SCALE QA
→ PRODUCTION DERIVATIVES
→ MANIFEST
→ REGISTRY
→ RESOLVER 14/22
→ CATEGORY FALLBACK 8/22
→ FAMILY BOARD
→ NEW-SIX BOARD
→ SCALE BOARD
→ TECH-VS-BUILDING BOARD
→ REAL DESKTOP RUNTIME
→ REAL NARROW RUNTIME
→ MIXED-COVERAGE RUNTIME
→ FULL COVERAGE MATRIX
→ TESTS
→ ROOT GATES
→ INVENTORY
→ SCENARIO-B ACCOUNTING
→ CLOSE CANDIDATE
→ STOP.

---

# 64. Final Decision

Return exactly ONE:

## OPTION A —
ICON-004 TECHNOLOGY / RESEARCH VISUAL IDENTITY
PRODUCTION BATCH 2 FINAL CLOSE CANDIDATE READY

Use only if:

exactly six new production primaries exist;

all six satisfy semantic boundaries;

6/6 alpha PASS;

6/6 96px readable;

6/6 128px PASS;

14/22 resolver coverage verified;

remaining 8 category fallback verified;

10/10 used category compacts remain valid;

family coherence passes;

technology-vs-building gate passes;

runtime desktop passes;

runtime narrow passes;

mixed coverage passes;

root gates pass;

inventory/accounting updated;

no gameplay/content breach.

Do NOT claim independent seal.

---

## OPTION B —
PRODUCTION BATCH 2 NEEDS ONE BOUNDED REPAIR

Use when the batch is otherwise complete but one coherent repair remains.

State exact repair scope.

---

## OPTION C —
ONE SELECTED TECHNOLOGY FAILS SEMANTIC / VISUAL CONTRACT

Use only after bounded repair proves that one of the approved six cannot
honestly fit the production family.

Do not substitute another technology automatically.

---

## OPTION D —
PRODUCTION INTEGRATION REQUIRES MATERIAL ARCHITECTURE / UX DECISION

Use only if the existing sealed production architecture genuinely cannot
accept Batch 2 without broader change.

State the exact decision.

---

# 65. Execution Summary

Return:

# Project Genesis
# ICON-004 Technology / Research Visual Identity
## Detailed Production Batch 2 — Execution Summary

### Baseline

- HEAD:
- branch:
- Batch 1 present:
YES / NO

### Exact Batch

1. basic_woodworking
2. industrial_assembly
3. smart_grid
4. warehouse_systems
5. process_automation
6. organic_chemistry

### New Primary Art

- target:
6

- completed:
X / 6

- 1024×1024:
X / 6

- real alpha:
X / 6

### Scale

- 64px inspection:
- 96px readable:
X / 6

- 128px pass:
X / 6

- 256px inspection:

### Semantic Gate

- honest:
X / 6

- unsupported gameplay implications:
0 / 6

- building confusion:
PASS / FAIL

### Family

- existing Batch 1 unchanged:
YES / NO

- 14-primary family coherence:
PASS / FAIL

- repetition:
PASS / FAIL

### Production Coverage

- before:
8 / 22

- added:
6

- after:
14 / 22

- category-only remaining:
8 / 22

- category compact:
10 / 10 used

### Resolver

- detailed:
14 / 14

- remaining category fallback:
8 / 8

- unknown fallback:
PASS / FAIL

- broken mappings:
0 / N

### Runtime

- desktop:
PASS / FAIL

- narrow:
PASS / FAIL

- mixed coverage:
PASS / FAIL

- broken images:
0 / N

- blank/gray unresolved:
0 / N

### Evidence

- 14-family:
- new-six:
- scale:
- tech-vs-building:
- desktop:
- narrow:
- mixed:

### Deferred

Later detailed:
- distribution_networks
- polymer_science
- sustainable_agriculture
- crop_optimization

Abstract pilot:
- corporate_management
- executive_leadership
- financial_planning
- predictive_analytics

### Scenario B

- unique new authored concepts:
6

- derivative inflation:
NO

- inventory updated:
YES / NO

- target changed:
NO

### Gates

- typecheck:
- lint:
- tests:
- build:web:
- alpha:
- manifest:
- registry:
- resolver:
- runtime:

### Firewalls

- research content:
NONE

- gameplay:
NONE

- ResearchScreen redesign:
NONE

- ICON-001:
NONE

- ICON-002:
NONE

- ICON-003:
NONE

- World:
NONE

- Batch 3:
NOT STARTED

- Abstract pilot:
NOT STARTED

### Repository Integrity

- task-owned:
- unrelated:

- commit:
NONE

- push:
NONE

- tag:
NONE

### Final Decision

OPTION A / OPTION B / OPTION C / OPTION D

STOP.

---

# CORE RULE

BATCH 2 HAS ALREADY BEEN SELECTED.

DO NOT REVIEW THE SELECTION AGAIN.

CREATE EXACTLY:

basic_woodworking
industrial_assembly
smart_grid
warehouse_systems
process_automation
organic_chemistry.

MAKE ALL SIX AS BEAUTIFUL, DETAILED AND PRODUCTION-QUALITY AS THE APPROVED
ICON-004 FAMILY.

BUT KEEP THEIR SEMANTICS DISTINCT:

WOODWORKING IS NOT CNC.

ASSEMBLY IS NOT THE ROBOT CELL.

SMART GRID IS NOT A POWER PLANT.

WAREHOUSE SYSTEMS IS NOT A WAREHOUSE BUILDING.

PROCESS AUTOMATION IS NOT FACTORY_AUTOMATION AGAIN.

ORGANIC CHEMISTRY IS NOT GENERIC LAB GLASSWARE.

PRESERVE THE EIGHT SEALED PRIMARIES.

EXTEND COVERAGE FROM:

8 / 22

TO:

14 / 22.

LEAVE THE OTHER EIGHT DEFERRED.

DO NOT FORCE ABSTRACT ART.

DO NOT REDESIGN RESEARCH.

DO NOT CHANGE GAMEPLAY.

DO NOT START PERFORMANCE WORK WITHOUT EVIDENCE.

DO NOT COMMIT.

RETURN ONE FINAL CLOSE CANDIDATE WITH REAL VISUAL AND RUNTIME EVIDENCE.

THEN STOP.