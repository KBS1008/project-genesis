# Cursor Review Prompt
# Project Genesis
# Post-V1 Game Art & Visual Content
# ICON-004 — Technology / Research Visual Identity
# Production Batch 2 — Selection & Abstract-Semantics Review

MODE:
READ-ONLY / PLANNING REVIEW
→ VERIFY POST-BATCH-1 BASELINE
→ AUDIT EXACTLY THE 14 REMAINING TECHNOLOGIES
→ CLASSIFY VISUAL SEMANTICS
→ IDENTIFY STRONG DETAILED-ART CANDIDATES
→ IDENTIFY SPECIAL / ABSTRACT CASES
→ DEFINE EXACTLY ONE BATCH-2 PRODUCTION SET
→ DEFINE DEFERRED ABSTRACT STRATEGY
→ STOP

THIS IS NOT AN ART PRODUCTION SLICE.

DO NOT CREATE NEW ART.
DO NOT GENERATE IMAGES.
DO NOT MODIFY PRODUCTION ASSETS.
DO NOT MODIFY ICON-004 REGISTRY / RESOLVER.
DO NOT MODIFY ResearchScreen.
DO NOT MODIFY RESEARCH CONTENT.
DO NOT MODIFY GAMEPLAY.
DO NOT MODIFY TECHNOLOGY SEMANTICS.
DO NOT REOPEN BATCH 1.
DO NOT REOPEN THE APPROVED ICON-004 ART DIRECTION.
DO NOT START MILESTONE ART.
DO NOT START RESEARCH UX REDESIGN.
DO NOT COMMIT.
DO NOT PUSH.
DO NOT TAG.

ALLOWED CHANGES:

1. this review report;
2. GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md only if current factual
   production coverage is stale.

---

# 1. Purpose

ICON-004 Production Batch 1 is:

CLOSED / PASS / SEALED.

Current production authority:

Tier 1:
DETAILED TECHNOLOGY PRIMARY ART

Tier 2:
TECHNOLOGYCATEGORY COMPACT GLYPH

Fallback:
GENERIC RESEARCH IDENTITY.

Current sealed production coverage:

8 / 22 technologies with detailed Tier-1 primaries

10 / 10 used TechnologyCategory values with production compact identity

14 technologies without detailed Tier-1 art.

The human product direction remains:

Project Genesis should receive beautiful, detailed game graphics wherever
technology semantics can support them honestly.

We are NOT imposing an arbitrary final cap such as:

8 detailed technologies

14 detailed technologies

or:

22 detailed technologies.

Instead:

every remaining technology must be evaluated on its own semantics.

The purpose of this review is to determine:

1. which remaining technologies can safely enter Production Batch 2 now;

2. which remaining technologies need a special visual rule;

3. which genuinely abstract technologies should be handled separately;

4. whether any technology should remain category-only;

5. exactly which technologies Production Batch 2 should contain.

---

# 2. Authority

Read first:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Then read:

docs/design/
GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md

docs/design/research/
TECHNOLOGY_RESEARCH_ICON_004_VISUAL_CONTRACT.md

docs/design/research/production/batch-1/
ICON_004_PRODUCTION_BATCH_1_MANIFEST.json

docs/architecture/reviews/
POST_V1_ICON_004_TECHNOLOGY_RESEARCH_VISUAL_IDENTITY_PRODUCTION_BATCH_1_CLOSE_CANDIDATE.md

Also inspect:

the approved ICON-004 detailed pilot report;

the Scenario-B Visual Coverage Progress Review;

current production ICON-004 assets;

current category compact assets;

TechnologyVisual;

technology visual resolver;

ResearchScreen integration.

Inspect authoritative content:

game-content/research/*.yaml

TechnologyCategory definition

research dependencies

deterministic unlock/effect data.

CURRENT REPOSITORY STATE IS AUTHORITY.

---

# 3. Sealed Authority

Do not reopen:

ICON-004 detailed art direction

ICON-004 category compact direction

ICON-004 two-tier architecture

Production Batch 1 art

Production Batch 1 resolver

Production Batch 1 runtime integration

ICON-001

ICON-002

ICON-003

Building Visual Identity.

Batch 1 production technologies remain:

precision_machining

renewable_energy

semiconductor_process

advanced_metallurgy

coal_efficiency

intermodal_logistics

circuit_design

factory_automation.

Verify them against current repository state.

Do not reevaluate their art direction.

---

# 4. Repository Baseline

Record:

git rev-parse HEAD
git status --short
git log -1 --oneline
git diff --name-only
git diff --stat

The user has committed and pushed Batch 1.

Verify that the new HEAD contains the sealed Batch-1 production work.

If it does not:

report the discrepancy.

Do not reconstruct it from working-tree assumptions.

---

# 5. Verify Current Production Coverage

Programmatically or deterministically verify:

enabled technologies

detailed primary mappings

category compact mappings.

Expected from the sealed Batch-1 close:

22 enabled technologies

8 detailed production primaries

10 used categories

10 production category compacts

14 technologies without detailed primary.

If current values differ:

use current repository truth and explain why.

Do not silently preserve stale counts.

---

# 6. Remaining Technology Set

The previous Batch-1 close candidate listed these 14 remaining technologies:

basic_woodworking

industrial_assembly

smart_grid

distribution_networks

warehouse_systems

corporate_management

executive_leadership

process_automation

financial_planning

organic_chemistry

polymer_science

sustainable_agriculture

crop_optimization

predictive_analytics

VERIFY THIS LIST.

Do not assume it is still exact.

The final review must operate on the actual remaining set.

---

# 7. Required Semantic Audit

For every remaining technology inspect:

technology ID

player-facing name

TechnologyCategory

description

dependencies

deterministic unlock/effect

position in progression where deterministically established

relationship to existing buildings/resources/systems where explicit.

Do not infer mechanics from the technology name alone.

Do not invent lore.

Do not invent machinery.

---

# 8. Visual Classification

Classify every remaining technology into exactly one of:

A — DIRECT_DETAILED

B — PROCESS_VIGNETTE

C — SYSTEM_VIGNETTE

D — ABSTRACT_SPECIAL

E — CATEGORY_ONLY_CANDIDATE

F — SEMANTICALLY_BLOCKED.

Definitions follow.

---

# 9. A — DIRECT_DETAILED

Use when the technology supports a concrete physical subject under the
approved ICON-004 contract.

Examples of subject TYPES:

machine

apparatus

technical assembly

material-processing equipment

specialized mechanism

industrial subsystem.

This classification should be the easiest fit for the existing production
language.

---

# 10. B — PROCESS_VIGNETTE

Use when the technology is better represented by:

a transformation

a material process

a production process

a sequence of connected apparatus

rather than one object.

The visual still needs a concrete industrial subject.

Do not turn this into an infographic.

---

# 11. C — SYSTEM_VIGNETTE

Use when the technology describes a network/system rather than a single
machine.

Possible visual grammar:

multiple connected physical nodes

control equipment

distribution equipment

logistics equipment

warehouse system components

grid/control hardware.

The image must remain:

detailed game art

not:

a flat diagram.

Do not invent system mechanics.

---

# 12. D — ABSTRACT_SPECIAL

Use when the technology is materially player-relevant but inherently abstract.

Likely candidates may include, depending on actual content:

corporate management

executive leadership

financial planning

predictive analytics.

Do not automatically assign those exact classifications.

Inspect actual content.

These technologies may require a separate visual grammar later.

They should NOT be forced into Batch 2 merely to increase coverage.

---

# 13. E — CATEGORY_ONLY_CANDIDATE

Use only when:

the category glyph may genuinely provide enough identity

AND

technology-specific detailed art would likely be repetitive, misleading or
low-value.

This is NOT:

"too difficult to draw."

It requires an actual player-value/semantic argument.

Do not permanently approve category-only status in this review.

Human decision remains required.

---

# 14. F — SEMANTICALLY_BLOCKED

Use when authoritative content does not provide enough information to create
honest technology-specific imagery.

State exactly what is missing.

Do not fill the gap with imagination.

---

# 15. Detailed Subject Proposal

For every remaining technology propose:

ONE preferred detailed visual subject

if classification A/B/C.

Examples must be based on actual semantics.

The subject description should be concrete enough for a future production
prompt.

Bad:

"some logistics equipment"

"AI machine"

"finance visual"

"advanced factory."

Good form:

specific apparatus/process/system subject
+
what aspect represents the technology
+
what must NOT be implied.

Do not generate the art.

---

# 16. Unsupported-Implication Check

For every proposed visual subject record:

what the image could accidentally imply.

Examples:

vehicle mechanics

robot workforce

new power source

new resource

new building

new network behavior

financial market mechanics

AI autonomy.

Mark whether that implication can be avoided through composition.

---

# 17. Building-Confusion Risk

For every A/B/C candidate assess:

LOW

MEDIUM

HIGH

risk of looking like ICON-003 Building Art.

Detailed Technology Primary Art should depict:

technology/capability/process/system

rather than:

another placeable building.

HIGH risk does not automatically reject a technology.

It may require a more focused apparatus composition.

---

# 18. Repetition Risk

Assess whether the proposed art would become visually repetitive with:

existing eight primaries

other remaining candidates.

Examples:

multiple robot cells

multiple warehouse scenes

multiple solar/power scenes

multiple PCB/electronics scenes.

Classify:

LOW

MEDIUM

HIGH.

If HIGH:

state the differentiation rule.

---

# 19. Existing-Art Reuse

Inspect whether existing:

ICON-003 building primaries

ICON-003 compacts

ICON-001 resources

World visual systems

can provide contextual inspiration or bounded reuse.

Do NOT propose using a building image as the technology primary.

Do NOT duplicate existing artwork and call it new technology art.

Possible reuse may include:

visual motifs

material language

apparatus cues

not authored-concept duplication.

---

# 20. Progression Reward Value

For every remaining technology classify detailed-art reward value:

HIGH

MEDIUM

LOW.

Ask:

Would receiving/seeing a detailed image materially improve the feeling of
technological progress?

Do not use technology importance inferred from its name.

Use deterministic progression/unlock evidence where available.

---

# 21. Player Exposure

Classify likely visual exposure under current Research presentation:

HIGH

MEDIUM

LOW.

Use actual ResearchScreen behavior/current progression where deterministically
known.

Do not invent analytics.

This is a qualitative structural classification.

---

# 22. Batch-2 Eligibility

A technology is normally BATCH-2 ELIGIBLE when:

classification is A/B/C;

semantic honesty is strong;

visual subject is concrete;

building-confusion risk is manageable;

repetition risk is manageable;

detailed-art reward value is meaningful;

no product decision is required.

Do not select D/E/F technologies for the normal Batch-2 production set.

---

# 23. Batch-2 Size

Recommend exactly ONE bounded Batch-2 size.

Preferred range:

5–8 new detailed primaries.

Do not automatically choose eight because Batch 1 had eight.

Choose the number supported by the safe candidate pool.

No promoted pilots exist in Batch 2 unless current repository evidence reveals
an already-approved unpromoted technology primary.

Do not invent one.

---

# 24. Batch-2 Selection

Select exactly the technologies for Production Batch 2.

The selection must be ordered only for implementation convenience, not as a
political/evaluative ranking.

For each selected technology provide:

ID

player-facing name

category

classification

detailed subject

semantic boundary

building-confusion rule

differentiation rule.

This is the authoritative proposed Batch-2 set pending independent review.

---

# 25. Strong Candidate Check

Pay particular attention to the current semantics of:

basic_woodworking

industrial_assembly

smart_grid

distribution_networks

warehouse_systems

process_automation

organic_chemistry

polymer_science

sustainable_agriculture

crop_optimization.

These LOOK potentially visual from their names.

But:

DO NOT assume eligibility from their names.

Verify each against content.

---

# 26. Abstract Set

Pay particular attention to:

corporate_management

executive_leadership

financial_planning

predictive_analytics

if still present.

Determine whether they truly require:

ABSTRACT_SPECIAL

or whether actual content supports an honest physical/system vignette.

Do not default to:

boardroom

executive portrait

money chart

glowing brain

robot head

holographic AI face.

Those are generic visual clichés, not semantic solutions.

---

# 27. Abstract Visual Grammar Question

For D — ABSTRACT_SPECIAL technologies, assess whether a future shared
subgrammar could work.

Possible conceptual families to evaluate, NOT implement:

OPERATIONAL DECISION SYSTEM

INFORMATION / ANALYTICS APPARATUS

CONTROL ROOM / INSTRUMENTATION

DOCUMENT / PLANNING TABLEAU

ORGANIZATIONAL SYSTEM VISUALIZATION.

These are hypotheses only.

Reject any that would make Project Genesis look like corporate stock art.

---

# 28. Do Not Solve Abstract Art Yet

This review should decide whether abstract technologies deserve:

a separate 2–3 technology art-direction pilot

or:

category-only fallback pending stronger product evidence.

Do NOT create abstract art.

Do NOT extend the production contract yet.

---

# 29. Coverage Projection

Calculate projected coverage after the proposed Batch 2.

Example:

current:
8 / 22 detailed

Batch 2:
+N

projected:
(8+N) / 22 detailed.

Also show remaining counts by:

DIRECT/PROCESS/SYSTEM

ABSTRACT_SPECIAL

CATEGORY_ONLY_CANDIDATE

SEMANTICALLY_BLOCKED.

Do not imply that projected coverage equals final target.

---

# 30. Scenario-B Accounting Projection

Estimate only the unique authored concepts added by Batch 2.

Do not count:

runtime derivatives

resizes

screenshots

registry mappings

evidence boards.

Do not change the Scenario-B target.

The question is:

Does this Batch add meaningful game-facing visual content?

not:

Does it help reach a quota?

---

# 31. Category Compact Layer

The compact category family is already:

10 / 10 USED CATEGORIES

production-active.

Do not create more category icons in this review.

Verify only that proposed Batch-2 technologies already have valid category
fallback coverage.

If not:

report the inconsistency.

---

# 32. ResearchScreen

Do not redesign it.

Assess only whether the existing mixed-coverage integration can accept the
proposed Batch-2 primaries automatically through the resolver.

Expected preferred answer:

new approved primary mapping
→ existing TechnologyVisual
→ existing ResearchScreen.

If material UI work would be required:

state why.

Do not implement it.

---

# 33. Production Pipeline Reuse

Assess whether Batch 1 established a reusable pipeline for:

1024×1024 master

alpha cleanup

runtime derivative

manifest

registry

resolver

scale board

family board

runtime capture.

Identify what Batch 2 can reuse unchanged.

The goal is to make Batch 2 mostly:

ART PRODUCTION + REGISTRY DATA

rather than architecture work.

---

# 34. Batch-1 Lessons

Extract only lessons relevant to Batch 2.

Include:

what worked;

what should be frozen;

what generated-art defects required attention;

dark-pad/runtime presentation lesson;

PNG/WebP lesson;

runtime evidence lesson;

semantic technology-vs-building lesson.

Do not reopen Batch 1.

---

# 35. Performance Boundary

The prior close candidate noted large PNG masters/runtime concerns.

Inspect current runtime derivative behavior.

Do not start a performance workstream.

Only answer:

Does Batch 2 require any bounded asset-format rule to avoid multiplying a
known obvious problem?

If current production runtime loads full 1024 PNGs directly:

flag this clearly.

If appropriate optimized runtime derivatives already exist:

record that.

Do not optimize without measured or obvious structural need.

---

# 36. Required Remaining-Tech Matrix

Include every remaining technology:

| Technology | Player Name | Category | Class | Preferred Subject | Building Risk | Repetition Risk | Reward Value | Batch 2? |
|------------|-------------|----------|-------|-------------------|---------------|-----------------|--------------|----------|

Exactly one row per remaining technology.

---

# 37. Required Semantic Boundary Matrix

For all A/B/C candidates:

| Technology | Depicted Capability | Must Not Imply | Honesty Confidence | Special Rule |
|------------|----------------------|----------------|--------------------|--------------|

Use:

HIGH

MEDIUM

LOW

for honesty confidence.

Do not use numeric scoring.

---

# 38. Required Batch-2 Production Set

Include:

| Technology | Category | Class | Primary Subject | Differentiation Rule | Production Notes |
|------------|----------|-------|-----------------|----------------------|------------------|

Exactly N rows matching the recommended Batch-2 size.

No alternates in this table.

---

# 39. Required Deferred Set

Include:

| Technology | Class | Why Deferred | Next Required Action |
|------------|-------|--------------|----------------------|

Use actions such as:

ABSTRACT ART-DIRECTION PILOT

LATER DETAILED BATCH

CATEGORY-ONLY HUMAN DECISION

PRODUCT SEMANTICS REQUIRED.

Do not say REJECTED unless there is hard evidence that detailed art is
inappropriate.

Prefer:

DEFERRED — NOT REJECTED.

---

# 40. Required Coverage Projection

Include:

CURRENT:
8 / 22 detailed

BATCH 2:
+N

PROJECTED:
X / 22 detailed

REMAINING:
Y / 22

Then break remaining down by classification.

Use current verified counts if they differ.

---

# 41. Required Pipeline Assessment

Include:

| Pipeline Stage | Batch-1 State | Reusable for Batch 2? | Change Needed? |
|----------------|---------------|-----------------------|----------------|
| master generation | | | |
| alpha QA | | | |
| derivatives | | | |
| manifest | | | |
| registry | | | |
| resolver | | | |
| ResearchScreen | | | |
| evidence | | | |
| runtime capture | | | |

The desired outcome is minimal architecture churn.

---

# 42. Required First Production Slice

This review must define exactly ONE next production slice.

It should normally be:

ICON-004 TECHNOLOGY DETAILED PRODUCTION BATCH 2

with the exact selected technologies.

Define:

exact IDs

asset count

master format

approved art contract

alpha requirements

scale gates

registry work

runtime evidence

firewalls

stop conditions.

Do NOT write the full implementation prompt in the review.

Give enough scope for ChatGPT to create it after independent review.

---

# 43. Non-Art Issues

Keep separate:

raw prerequisite technology IDs in localized copy

Player Guidance / Direct Manipulation

Research UX redesign

responsive redesign

performance unless evidence becomes material

accessibility workstream

deployment/auth/persistence.

Do not absorb them into Batch 2.

---

# 44. Master Inventory

Update:

docs/design/
GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md

ONLY if the committed Batch-1 state is not already accurately represented.

Do not record projected Batch-2 assets as production.

Do not increment authored totals for planned work.

---

# 45. Repository Integrity

This is a read-only/planning review.

Expected task-owned changes:

docs/architecture/reviews/
POST_V1_ICON_004_TECHNOLOGY_DETAILED_PRODUCTION_BATCH_2_SELECTION_REVIEW.md

and only if necessary:

docs/design/
GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md

No production code.

No assets.

No generated images.

No registry changes.

No tests required unless repository policy specifically requires docs-only
validation.

Before finalizing:

git status --short
git diff --name-only
git diff --stat

---

# 46. Required Review Report

Create:

docs/architecture/reviews/
POST_V1_ICON_004_TECHNOLOGY_DETAILED_PRODUCTION_BATCH_2_SELECTION_REVIEW.md

Required sections:

## A. Executive Summary

## B. Repository Baseline

## C. Sealed Batch-1 Authority

## D. Current Production Coverage

## E. Remaining Technology Audit

## F. Visual Classification Model

## G. Remaining-Tech Matrix

## H. Direct Detailed Candidates

## I. Process-Vignette Candidates

## J. System-Vignette Candidates

## K. Abstract-Special Candidates

## L. Category-Only Candidates

## M. Semantic Blockers

## N. Semantic Boundary Matrix

## O. Building-Confusion Assessment

## P. Repetition / Family-Diversity Assessment

## Q. Progression Reward Assessment

## R. Batch-2 Eligibility

## S. Exact Batch-2 Production Set

## T. Deferred Set

## U. Abstract Visual Grammar Assessment

## V. Coverage Projection

## W. Scenario-B Accounting Projection

## X. Category Compact Compatibility

## Y. ResearchScreen Compatibility

## Z. Production Pipeline Reuse

## AA. Batch-1 Lessons

## AB. Performance / Runtime Asset Boundary

## AC. Non-Art Issues

## AD. Master Inventory Status

## AE. Repository Integrity

## AF. First Production Slice

## AG. Final Decision

---

# 47. Final Decision

Return exactly ONE:

## OPTION A —
ICON-004 DETAILED PRODUCTION BATCH 2
CLEARLY DEFINED AND READY FOR IMPLEMENTATION PROMPT

Use when:

the remaining set is verified;

a safe Batch-2 pool exists;

exactly one bounded Batch-2 set is selected;

each selected technology has an honest concrete subject;

the approved art contract can be reused;

no ResearchScreen redesign is required;

no product semantics decision blocks the batch.

---

## OPTION B —
BATCH 2 REMAINS MATERIAL BUT REQUIRES ONE PRODUCT DECISION

Use when a meaningful Batch exists but one specific product-semantic decision
is required before selecting it.

State the exact question.

---

## OPTION C —
NO NORMAL DETAILED BATCH REMAINS;
ABSTRACT ART-DIRECTION PILOT IS NEXT

Use only if the remaining technologies are predominantly abstract/special and
there is no coherent safe normal production batch.

---

## OPTION D —
ICON-004 DETAILED PRODUCTION SHOULD PAUSE

Use only if current evidence shows additional detailed primaries would not
materially improve player-facing visual quality.

Do not choose this merely because category compacts exist.

---

# 48. Execution Summary

Return:

# Project Genesis
# ICON-004 Technology / Research Visual Identity
## Production Batch 2 Selection Review — Execution Summary

### Baseline

- HEAD:
- branch:
- working tree:
- Batch 1 committed:
YES / NO

### Current Coverage

- enabled technologies:
- detailed primaries:
- category-only:
- used categories:
- category compacts:

### Remaining Set

- total:
- verified against content:
YES / NO

### Classification

- DIRECT_DETAILED:
- PROCESS_VIGNETTE:
- SYSTEM_VIGNETTE:
- ABSTRACT_SPECIAL:
- CATEGORY_ONLY_CANDIDATE:
- SEMANTICALLY_BLOCKED:

### Batch 2

- recommended size:
- exact technologies:

1.
2.
3.
4.
5.
6.
7.
8.

Remove unused numbered lines.

### Batch-2 Semantics

- honest subjects:
PASS / FAIL

- building confusion manageable:
YES / NO

- repetition manageable:
YES / NO

- new art direction required:
YES / NO

### Projected Coverage

- current:
8 / 22

- Batch 2:
+N

- projected:
X / 22

- remaining:
Y / 22

### Abstract Technologies

- count:
- separate art-direction pilot likely:
YES / NO

- category-only candidates:
- semantically blocked:

### Pipeline

- Batch-1 pipeline reusable:
YES / NO

- architecture changes required:
YES / NO

- ResearchScreen changes required:
YES / NO

### Scenario B

- projected unique new authored concepts:
N

- target changed:
NO

### Repository Integrity

- report:
- inventory changed:
YES / NO

- production code:
NONE

- assets:
NONE

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

BATCH 1 PROVED THAT BEAUTIFUL DETAILED TECHNOLOGY ART WORKS.

DO NOT REOPEN THAT QUESTION.

NOW LOOK ONLY AT THE 14 TECHNOLOGIES THAT STILL LACK DETAILED ART.

FOR EACH ONE ASK:

WHAT REAL TECHNOLOGICAL CAPABILITY DOES THE CONTENT SUPPORT?

CAN THAT CAPABILITY BECOME A BEAUTIFUL, DETAILED, DISTINCT PROJECT GENESIS
VIGNETTE WITHOUT INVENTING GAMEPLAY?

IF YES:

CLASSIFY THE RIGHT VISUAL GRAMMAR.

IF NO:

DO NOT FORCE IT.

SELECT ONE STRONG NORMAL PRODUCTION BATCH FROM THE SAFE CANDIDATES.

KEEP ABSTRACT MANAGEMENT / FINANCE / ANALYTICS CASES SEPARATE IF THEIR
SEMANTICS REQUIRE A DIFFERENT VISUAL LANGUAGE.

DO NOT USE GENERIC CORPORATE STOCK-ART CLICHES.

DO NOT CREATE ART IN THIS REVIEW.

DO NOT CHANGE THE GAME.

DO NOT REOPEN SEALED BATCH 1.

RETURN THE EXACT BATCH-2 SET.

THEN STOP.