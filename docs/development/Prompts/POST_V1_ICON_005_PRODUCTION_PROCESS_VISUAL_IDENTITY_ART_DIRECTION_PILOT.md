# Project Genesis
# ICON-005 Production / Process Visual Identity
# Art-Direction Pilot

MODE:
BOUNDED ART-DIRECTION PILOT

→ VERIFY AUTHORITATIVE RECIPE SEMANTICS
→ FREEZE SEALED VISUAL FAMILIES
→ DEFINE PROCESS-VISUAL GRAMMAR
→ CREATE EXACTLY 3 DETAILED PROCESS PRIMARY PILOTS
→ TECHNICAL / ALPHA QA
→ SCALE QA
→ PRODUCTION-CONTEXT MOCK
→ CROSS-FAMILY DIFFERENTIATION
→ HUMAN VISUAL GATE
→ REPORT
→ STOP

NO PRODUCTION REGISTRY ACTIVATION.
NO ProductionScreen RUNTIME INTEGRATION.
NO GAMEPLAY CHANGES.
NO CONTENT CHANGES.
NO RECIPE CHANGES.
NO BALANCE CHANGES.
NO BUILDING ART CHANGES.
NO RESEARCH ART CHANGES.
NO WORLD CHANGES.
NO COMMIT.
NO PUSH.
NO TAG.

---

# 1. Purpose

Scenario B — Target Production Quality remains active.

The following visual tracks are already SEALED:

ICON-001 resources
ICON-002 building categories
ICON-003 building visual identity 23/23
ICON-004 technology/research visual identity 22/22
World Visual Presentation Slice 1
menu/splash/loading scenics
brand art.

The Post-ICON-004 Scenario-B review selected:

PRODUCTION / MANUFACTURING PROCESS VISUAL IDENTITY

as the next material detailed-art workstream.

Current problem:

ProductionScreen is still primarily communicated through:

text
tables
generic operational glyphs
progress indicators.

Recipes/jobs do not have distinct detailed authored process identity.

The purpose of ICON-005 is therefore:

NOT to illustrate another building.

NOT to create another resource icon.

NOT to create a diagram.

It is to visually answer:

"WHAT INDUSTRIAL PROCESS IS HAPPENING?"

with beautiful, detailed game art.

---

# 2. Human Product Requirement

The user explicitly wants:

SCHÖNE
DETAILLIERTE
GRAFIKEN.

Functional symbols alone do not satisfy Scenario B.

The ICON-005 Tier-1 visual must therefore be:

visually rewarding
recognizable
detailed
game-like
industrial
semantically honest.

It should materially reduce the "ERP/table application" character of
Production.

---

# 3. Authority

Read first:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Then:

docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md

docs/architecture/reviews/
POST_V1_SCENARIO_B_POST_ICON_004_NEXT_VISUAL_WORKSTREAM_REVIEW.md

Inspect relevant sealed visual contracts for:

ICON-001
ICON-003
ICON-004.

These provide FAMILY COHERENCE references.

They do NOT define ICON-005 composition automatically.

---

# 4. Baseline

Record:

git rev-parse HEAD
git status --short
git log -1 --oneline
git diff --name-only
git diff --stat

Separate unrelated working-tree churn.

Do not absorb unrelated changes.

---

# 5. Frozen Pilot Subjects

Use exactly these three authoritative recipe IDs:

recipe_planks

recipe_steel

recipe_advanced_electronics

Do not substitute another recipe unless repository truth shows one of these
no longer exists or is disabled.

If that happens:

STOP and report semantic/content drift.

Do not silently choose replacements.

---

# 6. Why These Three

They intentionally stress different process classes:

recipe_planks
→ early / simple material transformation

recipe_steel
→ heavy industrial / thermal transformation

recipe_advanced_electronics
→ late / complex precision manufacturing.

The three must prove that one ICON-005 grammar can handle:

simple
heavy
precision

processes without becoming repetitive.

---

# 7. Authoritative Semantic Audit

Before creating art, inspect the actual recipe YAML/domain definitions.

For each pilot record:

player-facing name

inputs

input quantities

outputs

output quantities

production duration if relevant to presentation

required building/facility if defined

unlock requirements if relevant

other process semantics explicitly present in content.

Do not infer unsupported machinery.

Do not invent intermediate products.

Do not invent chemistry.

Do not invent transport mechanics.

Do not invent automation semantics.

Create:

| Recipe | Player Name | Inputs | Outputs | Facility | Safe Visual Cues | Forbidden Inferences |

This table becomes the semantic authority for the pilot.

---

# 8. ICON-005 Core Visual Question

Each Tier-1 primary must answer:

"WHAT TRANSFORMATION / MANUFACTURING PROCESS DOES THIS RECIPE REPRESENT?"

It should NOT primarily answer:

"Which building performs it?"

That belongs to ICON-003.

It should NOT primarily answer:

"What resource is this?"

That belongs to ICON-001.

It should NOT primarily answer:

"What technology was researched?"

That belongs to ICON-004.

---

# 9. Proposed Visual Grammar

Develop a coherent:

DETAILED INDUSTRIAL PROCESS VIGNETTE

grammar.

Preferred characteristics:

physical transformation scene
focused machinery/process apparatus
visible material interaction where semantically safe
3/4 object/process perspective
compact industrial composition
strong central process read
controlled environment/platform
high material detail
real transparency
industrial lighting
clear silhouette
Scenario-B production quality.

The art should feel related to Project Genesis without copying another family.

---

# 10. Critical Art-Direction Adjustment

DO NOT mechanically compose every image as:

INPUT ICON
→ MACHINE
→ OUTPUT ICON.

That would risk turning ICON-005 into a diagram family.

Instead:

show the process itself.

Input/output cues may appear naturally in the scene where useful.

Examples of acceptable visual logic:

raw material entering a cutting apparatus

heated material visibly undergoing metallurgical processing

precision electronics assembly under robotic/tooling equipment.

These examples are illustrative only.

Repository semantics remain authoritative.

The primary should first read as:

GAME ART.

Not:

INFOGRAPHIC.

---

# 11. Relationship to ICON-003

ICON-003 represents:

PLACEABLE BUILDING TYPE.

ICON-005 represents:

PROCESS / TRANSFORMATION.

Therefore ICON-005 should generally:

frame closer to machinery/process equipment

show active transformation

use less architectural mass

avoid complete building exteriors

avoid large roofs/walls/facades

avoid looking like another catalog building.

A viewer should be able to place:

ICON-003 machine_shop

beside:

ICON-005 process art

and understand that one is a facility and the other is an activity/process.

---

# 12. Relationship to ICON-001

ICON-001 resource identity may inform:

material shape
material color
recognizable output cues.

Do not:

paste resource icons into the primary

use UI badges

create floating inventory tokens

turn the art into an icon diagram.

Material cues should feel physically present in the process scene.

---

# 13. Relationship to ICON-004

ICON-004 represents capabilities / technologies.

ICON-005 should be more:

physical
active
transformational
production-oriented.

Avoid reproducing an ICON-004 technology apparatus unchanged.

A technology may show:

a capability.

A recipe should show:

that capability doing productive work.

---

# 14. Visual Style

Target:

stylized detailed industrial game art.

Maintain broad Project Genesis coherence:

controlled industrial palette
metal / wood / machinery material readability
3/4 perspective
high-detail central subject
dark-compatible composition
subtle warm/cool industrial lighting
strong silhouette.

Do NOT require exact identical camera geometry to ICON-003/004.

ICON-005 may use a slightly closer process-focused framing where this
improves transformation readability.

---

# 15. Primary Master Contract

Create exactly THREE pilot primary masters.

Preferred technical contract:

1024 × 1024

RGBA

real transparent background.

If the existing art tooling requires another source resolution before
derivation, document it.

Final pilot master must still satisfy the production-like 1024 square
evaluation contract.

---

# 16. Transparency

Real alpha required.

Forbidden:

white baked background
black baked background
checkerboard baked into image
fake transparency
large opaque square canvas.

Run programmatic alpha inspection.

Report:

dimensions
mode
transparent pixel percentage
fully opaque percentage
partial alpha percentage.

Human-check edges for:

halo
fringe
checkerboard artifacts.

---

# 17. No Text

Artwork must contain:

NO readable text.

NO labels.

NO logos.

NO pseudo-writing.

NO fake signage.

NO UI screens with generated gibberish.

Tiny abstract instrument markings are acceptable only when clearly
non-linguistic.

Generated accidental text is a QA failure.

Repair/regenerate before close candidate.

---

# 18. No People By Default

Do not add workers merely for atmosphere.

People would introduce a character-art grammar that ICON-005 does not need.

Use machinery and material interaction as the primary storytelling mechanism.

---

# 19. recipe_planks

Audit semantics first.

The final vignette should communicate a believable:

WOOD → PLANK / BOARD

transformation.

It must NOT merely show:

a sawmill building.

Prefer a process-focused apparatus/working scene.

The process should remain recognizable at 96–128 px.

Avoid excessive sawdust/detail noise that destroys silhouette.

---

# 20. recipe_steel

Audit semantics first.

The final vignette should communicate:

METALLURGICAL / STEEL PRODUCTION

without simply recreating:

smelter ICON-003

or an existing research furnace.

This is a critical differentiation test.

Focus on:

material transformation

rather than:

facility identity.

If molten/thermal cues are semantically safe, they may be used.

Do not invent unsupported specialized process steps.

---

# 21. recipe_advanced_electronics

Audit semantics first.

The final vignette should communicate:

ADVANCED ELECTRONICS MANUFACTURING / ASSEMBLY

rather than:

electronics factory building

or:

semiconductor research laboratory.

Potentially useful safe language may include:

precision assembly
board/component handling
robotic/tooling interaction
inspection/placement apparatus

only where compatible with repository semantics.

Avoid unreadable microscopic clutter.

This pilot is the strongest stress test for 96px readability.

---

# 22. Cross-Pilot Differentiation

At a glance, the three must differ by:

dominant material

apparatus silhouette

process gesture

industrial character.

They must not look like:

the same machine with different props.

Require a side-by-side family board.

---

# 23. Family Coherence

Despite differentiation, all three should clearly belong to one family through:

perspective language
material rendering
lighting discipline
detail density
ground/platform treatment
composition philosophy.

Do not achieve coherence merely through identical bases.

---

# 24. Active Process Read

Evaluate each pilot:

Does it visually imply something is being transformed / manufactured?

Classify:

STRONG
GOOD
WEAK.

Examples of process cues may include:

material feed
cutting
heating
forming
assembly
handling
precision placement.

Only use cues supported by recipe semantics.

A beautiful static machine with no process read is insufficient.

---

# 25. Technology-vs-Process Test

For each pilot ask:

Could this image plausibly be mistaken for an ICON-004 technology primary?

If YES:

explain why and repair if material.

ICON-005 should feel more like:

productive action

than:

capability apparatus.

---

# 26. Building-vs-Process Test

For each pilot ask:

Could this image plausibly be mistaken for an ICON-003 building primary?

If YES:

repair composition.

This is a HARD human-gate criterion.

---

# 27. Resource-vs-Process Test

For each pilot ask:

Does the scene collapse into simply depicting the output resource?

If YES:

increase process identity.

---

# 28. Scale Board

Render/test every pilot at:

64 px
96 px
128 px
256 px.

Primary runtime target:

96–128 px.

64 px:

recognizable bonus.

256 px:

detail/reward inspection.

Do not reject a strong detailed primary merely because tiny detail disappears
at 64.

But the dominant process silhouette must remain distinguishable.

---

# 29. Production Context Mock

Create a DEV/EVIDENCE-ONLY static mock showing:

ProductionScreen-like recipe catalog/list

at least all three pilot subjects

player-facing recipe names

art at realistic intended scale

existing surrounding UI language.

Also show:

one active job/process row

using one detailed primary.

Do NOT modify ProductionScreen runtime.

Do NOT create registry entries.

Do NOT claim production activation.

Purpose:

human evaluation of whether detailed process art materially improves the
screen.

---

# 30. Cross-Family Board

Create an evidence board containing:

3 ICON-005 process pilots

representative ICON-003 building primaries

relevant ICON-001 resources

representative ICON-004 technology primaries.

The board must make it possible to answer:

Does ICON-005 belong to the same game?

AND:

Does ICON-005 have a distinct semantic job?

---

# 31. Semantic Honesty Board / Notes

For each pilot identify visually:

which depicted cues correspond to authoritative recipe semantics.

Do not add text inside the artwork itself.

Evidence-board annotations are allowed.

---

# 32. Progression / Reward Mock

Create one static optional-but-preferred board showing:

early:
recipe_planks

mid:
recipe_steel

late:
recipe_advanced_electronics.

Question:

Does production progression visually become more sophisticated/rewarding?

This must not force later recipes to be visually busier solely because they
are later.

Judge sophistication, not clutter.

---

# 33. Remaining Four Recipe Scalability Review

Without creating their art, inspect all remaining enabled recipes.

Expected historical holdouts include:

recipe_machine_parts
recipe_industrial_machinery
recipe_consumer_goods
recipe_advanced_planks

Verify current repository truth.

For each classify:

SAFE_UNDER_ICON_005

CONDITIONAL

SEMANTIC_RISK

BLOCKED.

Explain why.

The pilot should establish whether the grammar plausibly scales to all 7.

Do NOT generate their production art in this slice.

---

# 34. Full Recipe Matrix

Produce:

| Recipe | Player Name | Inputs | Output | Process Class | ICON-005 Fit | Risk | Notes |

for all currently enabled recipes.

This is analysis only.

---

# 35. Optional Compact Tier

Do NOT create a compact ICON-005 family by default.

First determine whether:

ICON-001 resources

existing generic UI

or detailed primaries at reduced scale

already cover dense contexts.

Recommend a compact tier only if repository/runtime evidence demonstrates a
real need.

Do not manufacture extra assets for Scenario-B counting.

---

# 36. Pilot Status

All three new masters remain:

DEV / PILOT

until human approval.

They do NOT count as:

production-active ICON-005 coverage

yet.

They may be counted in inventory only as:

PILOT / NOT PRODUCTION

and must not inflate confirmed production totals.

---

# 37. Asset Location

Follow repository asset conventions.

Use a clearly separated pilot path, for example consistent with existing
visual-pilot structure.

Do not place pilot files into active runtime registry paths if that would
imply production status.

Record exact paths in manifest.

---

# 38. Manifest

Create an ICON-005 pilot manifest containing:

recipe ID

player-facing name

source path

pilot master path

dimensions

alpha status

semantic cues

process class

status = PILOT

generation/tool provenance where repository convention requires it.

Do not add production registry mappings.

---

# 39. Contract Document

Create:

docs/design/production/
PRODUCTION_PROCESS_ICON_005_VISUAL_CONTRACT.md

Status:

PILOT / HUMAN APPROVAL REQUIRED

Include:

purpose

semantic role

relationship to ICON-001

relationship to ICON-003

relationship to ICON-004

camera/composition

process-action requirement

material language

alpha

text prohibition

people policy

scale behavior

building-vs-process rule

technology-vs-process rule

resource-vs-process rule

generated-art QA

future production activation rules

version history.

Do not mark:

APPROVED
PRODUCTION AUTHORITY
SEALED.

Human approval is required first.

---

# 40. Required Evidence

Create:

docs/architecture/reviews/evidence/
ICON_005_PROCESS_ART_DIRECTION_FAMILY_BOARD.png

docs/architecture/reviews/evidence/
ICON_005_PROCESS_ART_DIRECTION_SCALE_BOARD.png

docs/architecture/reviews/evidence/
ICON_005_PROCESS_ART_DIRECTION_PRODUCTION_CONTEXT_MOCK.png

docs/architecture/reviews/evidence/
ICON_005_PROCESS_ART_DIRECTION_CROSS_FAMILY_BOARD.png

docs/architecture/reviews/evidence/
ICON_005_PROCESS_ART_DIRECTION_SEMANTIC_BOARD.png

Prefer also:

docs/architecture/reviews/evidence/
ICON_005_PROCESS_ART_DIRECTION_PROGRESSION_BOARD.png

Evidence may use static composites.

This is not runtime certification.

---

# 41. Human Visual Gate

Do not self-seal the art direction.

Cursor may report technical/semantic readiness.

Final art-direction approval belongs to human review.

The human gate must assess:

BEAUTIFUL / PRODUCTION-QUALITY?

PROCESS RATHER THAN BUILDING?

PROCESS RATHER THAN TECHNOLOGY?

MORE THAN RESOURCE DEPICTION?

THREE SUBJECTS DISTINCT?

ONE FAMILY?

SEMANTICALLY HONEST?

READABLE AT 96/128?

REWARDING AT 256?

IMPROVES PRODUCTION GAME FEEL?

If any pilot is materially weak:

recommend one bounded art repair.

Do not reopen the entire Scenario-B plan.

---

# 42. Technical QA

Run relevant asset checks.

At minimum:

3 / 3 files exist

3 / 3 correct dimensions

3 / 3 RGBA / alpha

3 / 3 no baked background

3 / 3 no text/logo artifact

manifest/path integrity

evidence files exist.

If tooling scripts are created solely for pilot QA:

keep them task-local

and document them.

Do not modify broad production tooling unnecessarily.

---

# 43. Root Gates

Because this pilot should not change runtime code, still run:

pnpm typecheck
pnpm lint
pnpm test
pnpm build:web

Report exact outcomes.

If a root gate fails due to clearly unrelated pre-existing working-tree churn:

prove that with baseline/diff evidence.

Do not repair unrelated code in this art pilot.

If the pilot itself caused a gate failure:

repair it.

---

# 44. Scenario-B Accounting

Update:

docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md

only enough to record:

Production / Process Visual Identity:
ICON-005 ART-DIRECTION PILOT IN REVIEW

3 pilot primaries:
DEV / PILOT / NOT PRODUCTION

Do NOT count them as sealed production concepts yet.

Scenario-B planning envelope remains:

~380–520 authored deliverables
+ ~12 procedural systems

unless hard new evidence says otherwise.

No quota chasing.

---

# 45. Firewalls

Explicitly report:

V1:
SEALED / UNCHANGED

ICON-001:
SEALED / UNCHANGED

ICON-002:
SEALED / UNCHANGED

ICON-003:
SEALED / UNCHANGED

ICON-004:
SEALED / UNCHANGED

World Slice 1:
SEALED / UNCHANGED

Building visual identity:
SEALED / UNCHANGED

Research visual identity:
SEALED / UNCHANGED

gameplay:
UNCHANGED

recipe/content semantics:
UNCHANGED

balance:
UNCHANGED

simulation:
UNCHANGED

save:
UNCHANGED

ProductionScreen runtime:
UNCHANGED

production registry:
UNCHANGED.

---

# 46. Report

Create:

docs/architecture/reviews/
POST_V1_ICON_005_PRODUCTION_PROCESS_VISUAL_IDENTITY_ART_DIRECTION_PILOT.md

Required sections:

A. Executive Summary
B. Repository Baseline
C. Authority / Sealed Tracks
D. Recipe Semantic Audit
E. ICON-005 Semantic Role
F. Proposed Visual Grammar
G. Pilot Subject Selection
H. recipe_planks
I. recipe_steel
J. recipe_advanced_electronics
K. Alpha / Technical QA
L. Scale QA
M. Active Process Read
N. Building-vs-Process Test
O. Technology-vs-Process Test
P. Resource-vs-Process Test
Q. Family Coherence
R. Cross-Family Differentiation
S. Production Context Mock Findings
T. Progression / Reward Findings
U. Remaining Recipe Scalability
V. Full Seven-Recipe Matrix
W. Compact-Tier Decision
X. Scenario-B Accounting
Y. Firewalls
Z. Repository Integrity
AA. Human Gate Package
AB. Final Decision

---

# 47. Final Decision

Return exactly one:

OPTION A —
ICON-005 ART DIRECTION PILOT READY FOR HUMAN VISUAL APPROVAL

Use only if all three are technically and semantically viable.

OPTION B —
ONE BOUNDED ART REPAIR REQUIRED

Name exact pilot and exact defect.

OPTION C —
ICON-005 GRAMMAR DOES NOT SCALE ACROSS THE THREE PROCESS CLASSES

Explain concrete conflict.

OPTION D —
RECIPE SEMANTICS ARE INSUFFICIENT FOR HONEST PROCESS ART

Identify exact missing product/content decision.

Do not self-approve production.

---

# 48. Repository Integrity

At end:

git status --short
git diff --name-only
git diff --stat

Separate:

task-owned

unrelated.

No staging.

No commit.

No push.

No tag.

---

# 49. Definition of Done

BASELINE
→ READ AUTHORITY
→ FREEZE ICON-001/002/003/004
→ VERIFY 3 RECIPE IDs
→ AUDIT RECIPE SEMANTICS
→ DEFINE ICON-005 PILOT CONTRACT
→ CREATE EXACTLY 3 PRIMARY PILOTS
→ ALPHA QA
→ GENERATED-ART QA
→ SCALE 64/96/128/256
→ ACTIVE PROCESS TEST
→ BUILDING-vs-PROCESS TEST
→ TECHNOLOGY-vs-PROCESS TEST
→ RESOURCE-vs-PROCESS TEST
→ FAMILY BOARD
→ PRODUCTION CONTEXT MOCK
→ CROSS-FAMILY BOARD
→ SEMANTIC BOARD
→ PROGRESSION BOARD IF USEFUL
→ REVIEW REMAINING 4 RECIPES
→ FULL 7-RECIPE MATRIX
→ ROOT GATES
→ UPDATE INVENTORY AS PILOT ONLY
→ REPORT
→ HUMAN GATE
→ STOP.

---

# CORE RULE

ICON-005 IS NOT "MORE FACTORY ART."

ICON-003 ALREADY OWNS THE FACTORY.

ICON-005 OWNS THE PROCESS.

SHOW:

CUTTING
FORMING
HEATING
ASSEMBLING
HANDLING
TRANSFORMING

ONLY WHERE AUTHORITATIVE SEMANTICS SUPPORT IT.

THE PLAYER SHOULD SEE THE ART AND FEEL:

"THIS IS WHAT MY INDUSTRY IS DOING."

NOT:

"THIS IS ANOTHER BUILDING."

NOT:

"THIS IS A RESOURCE ICON."

NOT:

"THIS IS A RESEARCH MACHINE."

DO NOT TURN THE FAMILY INTO INPUT→OUTPUT INFOGRAPHICS.

MAKE BEAUTIFUL DETAILED GAME ART FIRST.

PRESERVE SEMANTIC HONESTY.

CREATE EXACTLY THREE PILOTS.

DO NOT ACTIVATE THEM IN PRODUCTION.

DO NOT CREATE THE OTHER FOUR RECIPES.

DO NOT REOPEN SEALED FAMILIES.

HUMAN APPROVAL IS REQUIRED.

THEN STOP.