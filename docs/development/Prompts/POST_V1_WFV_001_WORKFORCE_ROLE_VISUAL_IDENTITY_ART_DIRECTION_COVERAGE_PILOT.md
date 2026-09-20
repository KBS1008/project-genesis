# POST-V1 WFV-001 — WORKFORCE ROLE VISUAL IDENTITY
## ART-DIRECTION & COVERAGE PILOT

Status: IMPLEMENTATION PROMPT
Mode: BOUNDED VISUAL ART-DIRECTION PILOT + HUMAN GATE
Track: POST-V1 / SCENARIO-B GAME ART
Workstream: WFV-001 — Workforce Role Identity
Production activation: NO
Human visual approval required: YES

---

# 0. PURPOSE

Project Genesis Scenario B targets a convincing production-game visual identity,
not merely functional administration UI.

The current authoritative visual inventory identifies Workforce as a material gap:

- 19 enabled Employee Types
- current presentation is predominantly / entirely textual
- no approved detailed Workforce role-art family exists
- Workforce therefore remains a material Scenario-B visual gap

WFV-001 must establish a coherent visual language for Employee / Workforce roles
BEFORE production artwork is created for the full workforce inventory.

This is NOT a 19-role production batch.

This slice must answer:

> What should a Project Genesis workforce role look like as game art?

The result must be visually rewarding, semantically honest, scalable across the
actual Employee-Type inventory, and clearly part of the same game as the already
approved Building / Technology / Production visual families.

---

# 1. AUTHORITATIVE BASELINE

Before changing anything:

1. Read:
   - `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
   - `docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`
   - relevant Workforce / Employee content definitions
   - relevant Workforce UI implementation
   - existing visual contracts for:
     - ICON-003 Building Visual Identity
     - ICON-004 Technology / Research
     - ICON-005 Production / Recipe art
   - current asset registry / resolver architecture

2. Record:
   - current branch
   - current HEAD
   - dirty working tree
   - task-owned vs unrelated changes

3. Do NOT absorb unrelated working-tree churn.

4. WBM-001 and previously sealed visual tracks are authoritative and must not
   be reopened.

---

# 2. FIREWALLS

Do NOT change:

- gameplay rules
- employee stats
- salaries
- productivity
- staffing requirements
- hiring rules
- workforce simulation
- content balancing
- save format
- API semantics
- Building Visual Identity
- ICON-003 assets
- ICON-004 assets
- ICON-005 assets
- World map
- WBM-001
- ResearchScreen
- ProductionScreen
- building placement
- milestone/player-guidance work
- simulation/time semantics

Do NOT perform a broad Workforce UX redesign.

Do NOT commit, push or tag.

---

# 3. INVENTORY AUDIT — ALL CURRENT EMPLOYEE TYPES

Re-audit the authoritative current Employee-Type inventory.

Historical expectation from the Scenario-B inventory:

- 19 enabled Employee Types

Do not blindly trust the historical number if content changed.

Produce an exact matrix containing for every enabled Employee Type:

- ID
- authoritative player-facing name
- description if available
- category / role family if one exists
- gameplay function
- relevant workplace/building associations if authoritative
- important visual cues supported by content
- visual ambiguity/risk
- candidate depiction strategy

Do NOT invent professions, uniforms, tools, machinery, gender, age,
ethnicity, hierarchy or workplace semantics not supported by authoritative
content.

---

# 4. CORE ART-DIRECTION QUESTION

Evaluate THREE possible visual models.

## MODEL A — PERSON / ROLE PORTRAIT

Detailed stylized worker or professional portrait/bust.

Examples conceptually:

- recognizable occupational silhouette
- clothing/PPE where semantically supported
- restrained workplace/tool cues

Advantages:
- humanizes workforce
- strongest distinction from Building/Technology/Production art
- potentially high emotional/game identity value

Risks:
- unsupported demographic assumptions
- repetitive faces
- difficult 19-role differentiation
- generated-art inconsistencies
- accidental corporate-stock-photo appearance

---

## MODEL B — ROLE / WORKSTATION VIGNETTE

Detailed occupational workstation/tool/equipment vignette without requiring
a visible person.

Examples conceptually:

- operator console
- engineering desk/equipment
- maintenance/tool station
- logistics terminal

Advantages:
- aligns well with industrial visual language
- lower demographic risk
- semantic objects may differentiate roles

Risks:
- may become too similar to Technology or Production art
- may feel lifeless
- can become another machine-icon family

---

## MODEL C — HYBRID HUMAN + OCCUPATIONAL CONTEXT

Stylized role character plus one or two strong occupational cues.

The person remains the primary semantic anchor.
Equipment/environment supports the profession.

Advantages:
- strongest potential Workforce identity
- human presence + industrial world
- high reward value at larger sizes

Risks:
- hardest consistency problem
- generation quality must be tightly controlled
- must avoid overcrowded scenes

---

# 5. PILOT SELECTION

Select EXACTLY THREE real enabled Employee Types.

They must be semantically diverse.

Selection requirements:

- at least one operational / industrial role
- at least one technical / specialist role
- at least one administrative / management / knowledge role

Use only actual authoritative Employee Types.

Prefer roles with sufficiently clear semantics to make the comparison fair.

Document WHY each role was selected.

---

# 6. REQUIRED ART-DIRECTION COMPARISON

For EACH of the three selected roles create:

- Direction A — Person / Role Portrait
- Direction B — Workstation / Tool Vignette
- Direction C — Hybrid Human + Occupational Context

Therefore:

3 roles × 3 directions = EXACTLY 9 pilot concepts.

These are DEV/PILOT assets.

They are NOT production assets.

Do not register them as production Workforce assets.

---

# 7. QUALITY TARGET

These pilots must test the actual Scenario-B quality bar.

They must NOT be:

- generic monochrome icons
- simple line glyphs
- flat admin avatars
- initials
- colored circles
- generic silhouettes
- stock-photo-style portraits
- tiny symbolic UI-only graphics

The detailed pilot artwork should target the same overall perceived quality
band as the approved detailed visual families:

- ICON-003 Building B2
- ICON-004 detailed Technology Primary Art
- ICON-005 detailed Production art

But Workforce must retain its own identity.

Target:

- authored/generated primary master around 1024×1024 where raster is used
- real transparency
- strong silhouette
- readable occupational identity
- detailed enough to reward viewing around 128–256 px
- still recognizable around 64–96 px

---

# 8. SHARED PROJECT GENESIS VISUAL LANGUAGE

All directions should test compatibility with the established game.

Preferred common characteristics:

- stylized detailed realism
- controlled industrial palette
- restrained highlights
- strong material definition
- deliberate lighting
- clean silhouette
- transparent background
- no baked UI frame
- no textual labels inside artwork
- no company logos
- no pseudo-writing
- no category badge baked into image
- no photorealistic stock-photo appearance

Do not simply copy the ICON-003 isometric-building composition.

Workforce must visually read as:

> PEOPLE / PROFESSIONS / HUMAN CAPABILITY

not:

> another building

and not:

> another technology machine

and not:

> another production recipe.

---

# 9. HUMAN-DEPICTION RULES

For directions containing people:

Do not encode unsupported gameplay meaning through:

- gender
- ethnicity
- age
- attractiveness
- body type

unless authoritative content explicitly requires something relevant.

The art family must be capable of representing the workforce without implying
that a role inherently belongs to one demographic.

For the pilot, focus primarily on:

- clothing silhouette
- PPE where supported
- pose
- occupational equipment
- role context
- professional visual language

rather than demographic identity.

Avoid exaggerated stereotypes.

---

# 10. GENERATED-ART QA

Every generated concept must be inspected for:

- malformed hands
- malformed faces
- impossible limbs
- duplicated equipment
- impossible tools
- nonsensical machinery
- fake text
- fake logos
- pseudo-writing
- floating objects
- broken perspective
- accidental background remnants
- checkerboard baked into artwork
- halo contamination
- poor alpha
- cropped head/tools
- inconsistent light direction

Repair/regenerate obvious pilot-local failures.

Do not present obviously defective images to the human gate merely because
generation technically completed.

---

# 11. SCALE TEST

Test every pilot direction at approximately:

- 64 px
- 96 px
- 128 px
- 256 px

The primary visual should be especially convincing at:

- 96–128 px for game UI
- 128–256 px for detail/reward contexts

Do NOT conclude that a direction succeeds merely because it works at 32 px.

This track is intended to add detailed game graphics.

---

# 12. WORKFORCE UI CONTEXT TEST

Inspect the real current Workforce presentation.

Do NOT redesign it.

Create static/dev-only context evidence showing representative pilot art in
the approximate real UI context.

Test whether the visual:

- makes roles immediately recognizable
- reduces spreadsheet/admin feeling
- preserves role name/stat readability
- avoids overwhelming dense UI
- can plausibly coexist with current controls

If the current Workforce UI cannot meaningfully show detailed artwork without
a later bounded layout slice, document that honestly.

Do NOT solve that layout problem in this pilot.

---

# 13. CROSS-FAMILY DIFFERENTIATION TEST

Create a board comparing representative:

- ICON-001 Resource
- ICON-003 Building Primary
- ICON-004 Technology Primary
- ICON-005 Production Primary
- WFV-001 pilot directions

Ask:

Can a player tell, without labels, that Workforce imagery represents a HUMAN
ROLE rather than:

- resource
- building
- technology
- recipe/process?

Record PASS / MIXED / FAIL for each direction.

---

# 14. 19-ROLE SCALABILITY TEST

Using the full authoritative Employee-Type inventory, evaluate how each
direction would scale.

For every role classify each model:

- STRONG
- VIABLE
- WEAK
- SEMANTICALLY_RISKY

Pay special attention to whether:

- portraits become repetitive
- workstation scenes overlap with Technology art
- hybrid scenes become too complex
- management/knowledge roles become generic office imagery
- industrial roles become indistinguishable workers

The chosen direction must work as a FAMILY, not merely produce three attractive
pilot images.

---

# 15. VISUAL REWARD TEST

The visual track exists because Project Genesis needs to look more like a game.

Explicitly evaluate:

At 128–256 px, does this art make hiring/unlocking/seeing a new employee type
feel visually meaningful?

Rate each direction for each pilot:

- STRONG
- GOOD
- WEAK

Do not use numerical scores.

---

# 16. OPTIONAL COMPACT LAYER — ASSESS ONLY

Assess whether Workforce eventually needs a second compact tier analogous to
ICON-004.

Possible examples:

- detailed Workforce Primary Art
- compact role/category glyph

But DO NOT build an entire compact production family in this pilot.

Only determine whether a two-tier architecture appears useful.

If existing generic DashboardIcons already satisfy compact contexts, note that.

Avoid creating another icon family without a demonstrated need.

---

# 17. REQUIRED EVIDENCE

Create at minimum:

`docs/architecture/reviews/evidence/WFV_001_ART_DIRECTION_FAMILY_BOARD.png`

All 9 concepts:
3 roles × A/B/C.

---

`docs/architecture/reviews/evidence/WFV_001_DIRECTION_A_PERSON_BOARD.png`

Three Person/Portrait concepts together.

---

`docs/architecture/reviews/evidence/WFV_001_DIRECTION_B_WORKSTATION_BOARD.png`

Three workstation concepts together.

---

`docs/architecture/reviews/evidence/WFV_001_DIRECTION_C_HYBRID_BOARD.png`

Three hybrid concepts together.

---

`docs/architecture/reviews/evidence/WFV_001_SCALE_BOARD.png`

Representative scale comparison at 64 / 96 / 128 / 256.

---

`docs/architecture/reviews/evidence/WFV_001_WORKFORCE_CONTEXT_MOCK.png`

Representative current Workforce UI context.

---

`docs/architecture/reviews/evidence/WFV_001_CROSS_FAMILY_BOARD.png`

Resource / Building / Technology / Production / Workforce comparison.

---

# 18. ART-DIRECTION CONTRACT

Create:

`docs/design/workforce/WORKFORCE_ROLE_VISUAL_IDENTITY_WFV_001_ART_CONTRACT.md`

Status must remain:

`PILOT / HUMAN APPROVAL REQUIRED`

until independent human review.

Document:

- inventory baseline
- visual goals
- tested directions
- camera/composition rules
- human depiction rules
- lighting
- palette
- transparency
- scale targets
- semantic honesty rules
- cross-family differentiation
- generated-art QA
- potential compact tier
- scalability findings

Do NOT mark any direction production authority yet.

---

# 19. PILOT MANIFEST

Create an explicit pilot manifest containing:

- employee type ID
- player-facing name
- direction A asset
- direction B asset
- direction C asset
- source/master path
- dimensions
- alpha status
- DEV/PILOT status

No production registry activation.

---

# 20. ALPHA / TECHNICAL QA

For raster pilots verify:

- expected dimensions
- RGBA
- real transparent pixels
- no baked checkerboard
- no obvious matte halo
- no accidental opaque background

Report exact results.

---

# 21. SCENARIO-B ACCOUNTING

This is a PILOT.

Do NOT count all nine concepts as nine finished Scenario-B production
deliverables.

Update:

`docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`

only enough to record:

`Workforce — WFV-001 ART-DIRECTION PILOT IN HUMAN REVIEW`

or equivalent.

Production Workforce coverage remains:

`0 / N`

until a later approved production slice activates assets.

Do not inflate authored-production totals.

---

# 22. REQUIRED REVIEW REPORT

Create:

`docs/architecture/reviews/POST_V1_WFV_001_WORKFORCE_ROLE_VISUAL_IDENTITY_ART_DIRECTION_COVERAGE_PILOT.md`

The report must contain:

1. baseline HEAD / branch
2. working-tree classification
3. authoritative Employee-Type inventory count
4. complete Employee-Type matrix
5. exact three selected pilots
6. why those three were selected
7. Direction A findings
8. Direction B findings
9. Direction C findings
10. 9-concept manifest
11. alpha QA
12. scale QA
13. Workforce-context assessment
14. cross-family assessment
15. full-inventory scalability matrix
16. visual-reward assessment
17. compact-tier assessment
18. recommended production architecture
19. Scenario-B accounting
20. firewalls
21. exact changed files
22. human-review evidence paths

---

# 23. FINAL DECISION

Return EXACTLY ONE:

## OPTION A — HUMAN VISUAL GATE READY

Use when:

- all 9 valid concepts exist
- technical QA passes
- evidence is complete
- at least one direction is credibly production-capable
- no architecture/product blocker exists

State the recommended direction, but DO NOT declare it approved.

Human approval remains required.

---

## OPTION B — ONE BOUNDED PILOT REPAIR REQUIRED

Use when the overall comparison is valid but one or more task-local assets have:

- generation defects
- alpha defects
- scale defects
- weak semantic identity
- cross-family confusion

Repair within this slice where obvious.

Return B only if a remaining issue genuinely requires another bounded pass.

---

## OPTION C — ART DIRECTION SEMANTICALLY BLOCKED

Use only if the actual Employee-Type content is too ambiguous to establish an
honest visual family without product decisions.

Explain the exact ambiguity.

Do not invent semantics.

---

## OPTION D — ARCHITECTURE / UX DECISION REQUIRED

Use only if production-quality Workforce art cannot be integrated later without
a genuine unresolved product/UX decision.

Do not use D merely because the current UI is dense.

---

# 24. STOP CONDITION

After the report and evidence are complete:

STOP.

Do NOT:

- create production art for all 19 roles
- activate pilot assets in production
- modify the Workforce runtime screen
- begin WFV-001 Production Batch 1
- create a 19-role registry
- redesign Workforce UX
- continue into another Scenario-B domain
- commit
- push
- tag

The next action is an independent human visual review.

---

# CORE RULE

WFV-001 is not an icon exercise.

The purpose is to find a beautiful, detailed, scalable visual identity for the
people and professions that operate the Project Genesis economy.

Test the real alternatives.

Do not choose a direction merely because it is easiest to generate.

The winning visual language must make Workforce feel like part of a game,
remain semantically honest across the actual employee inventory, and coexist
with Buildings, Technology and Production without becoming visually confused
with them.

Produce the evidence, request the human gate, then stop.