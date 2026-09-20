# POST-V1 WFV-001 — Workforce Role Visual Identity Production Batch 1

## MODE

Bounded production-art batch + bounded Workforce runtime integration.

This task takes the HUMAN-APPROVED WFV-001 Workforce art direction and turns it into the first production-certified Workforce visual family.

This is NOT another art-direction exploration.

The art direction is already human-approved:

WFV-001 ART DIRECTION
APPROVED / PASS / SEALED

Primary grammar:
DIRECTION C — HYBRID HUMAN + OCCUPATIONAL CONTEXT

Production principle:
ONE PERSON + ONE DOMINANT OCCUPATIONAL CUE

Direction A — Person / Role Portrait:
allowed only as a controlled fallback/variant where a hybrid composition would become semantically artificial.

Direction B — Workstation / Tool Vignette:
NOT the primary Workforce grammar because apparatus-forward compositions collide too strongly with ICON-004 Technology and ICON-005 Production.

The objective now is:

1. freeze the approved production contract,
2. select exactly 8 employee types for Production Batch 1,
3. promote/rework the approved pilots where appropriate,
4. author the remaining Batch-1 production primaries,
5. technically certify all 8,
6. create one production resolver/registry path,
7. integrate them into the actual Workforce UI with a bounded thumbnail/layout slice,
8. preserve graceful fallback for the remaining 11 employee types,
9. validate desktop + narrow runtime behavior,
10. update Scenario-B accounting,
11. produce one final close candidate,
12. STOP.

Do not continue into Batch 2.

---

# 0. REQUIRED WORKFLOW

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

Before modifying anything:

- record branch,
- record exact HEAD,
- inspect working tree,
- classify all existing changes as:
  - task-owned predecessor WFV-001 pilot work,
  - current-task-owned,
  - unrelated,
  - generated/runtime churn.

Do not absorb unrelated changes.

The WFV-001 pilot may still exist as uncommitted predecessor work depending on repository state.

If so:

- preserve it,
- treat the human-approved contract/evidence as predecessor authority,
- do not accidentally classify it as unrelated,
- do not regenerate approved assets merely to obtain a clean diff.

No staging.
No commit.
No push.
No tag.

---

# 1. AUTHORITATIVE HUMAN GATE

Record the following in the Workforce visual contract version history.

## Human decision

WFV-001 Workforce Role Visual Identity Art Direction:

**APPROVED / PASS / SEALED**

Production authority:

### Tier-1 primary grammar

**Direction C — Hybrid Human + Occupational Context**

Each primary must communicate:

> “Who is this employee role, and what kind of work do they perform?”

The human figure is the primary discriminator.

The occupational cue supports the role.

The occupational cue must NOT replace the human.

---

# 2. FROZEN PRODUCTION ART RULES

## 2.1 Composition

Default:

**1 person + 1 dominant occupational cue**

Examples of cue classes:

- machine edge,
- precision jig,
- maintenance tool set,
- laboratory bench element,
- warehouse scanner/station,
- logistics planning terminal,
- rail dispatch console,
- office/analysis cue,
- strategy surface.

Do NOT create a cluttered room scene.

Do NOT create a complete building.

Do NOT create a complete production process.

Do NOT create a technology apparatus with a token person added to it.

The PERSON remains the primary visual anchor.

---

## 2.2 Background

Production primaries must use:

- real transparency,
- clean alpha,
- no baked card background,
- no blueprint grid,
- no technical graph-paper background,
- no UI frame,
- no text panel.

The blueprint/grid language visible in WFV-001 pilot evidence was an ART-DIRECTION PRESENTATION DEVICE.

It is NOT part of the production asset contract.

---

## 2.3 Human representation

Role identity must come from:

- clothing/PPE,
- posture,
- equipment,
- occupational context,
- supported work cues.

Do NOT encode role or seniority primarily through:

- gender,
- ethnicity,
- age,
- attractiveness,
- facial stereotypes,
- body type.

Do not create “executive = specific demographic” visual semantics.

Human diversity is allowed and desirable across the family, but it must not be the semantic mechanism that distinguishes roles.

---

## 2.4 Seniority

Where junior/senior versions exist, distinguish them through supported occupational complexity such as:

- responsibility context,
- precision/tool complexity,
- supervisory context,
- richer work cue,
- task complexity.

Do NOT rely on invented military-style rank insignia.

Do NOT invent gameplay hierarchy not present in content.

---

## 2.5 Visual quality

Target quality must be consistent with the sealed production families:

- ICON-003 Building Visual Identity,
- ICON-004 Technology Visual Identity,
- ICON-005 Production Process Visual Identity.

WFV must nevertheless remain visually distinct from all three.

Required read:

ICON-003:
“What building is this?”

ICON-004:
“What technology/capability is this?”

ICON-005:
“What production process is this?”

WFV-001:
“Who performs this kind of work?”

At 128–256 px, Workforce primaries must feel like actual game art, not administrative avatars.

---

# 3. SCALE CONTRACT

Primary Workforce art must be designed for:

- 96 px — strong practical UI read,
- 128 px — preferred rich UI presentation,
- 256 px — reward/detail tier.

64 px:

- silhouette/role should remain recognizable,
- fine occupational detail may be lost.

Do not optimize the entire family around 32 px.

This task does NOT introduce a mandatory 19-role compact glyph family.

Existing generic UI icons may continue to serve dense operational contexts.

---

# 4. AUTHORITATIVE EMPLOYEE INVENTORY

Re-audit current authoritative content.

Expected historical baseline:

`game-content/employees/*.yaml`

19 enabled employee types.

Do NOT assume the count if repository content changed.

Produce a current matrix containing:

- employee ID,
- authoritative player-facing name,
- category,
- gameplay function,
- building association if any,
- supported occupational cues,
- ambiguity risk,
- Batch-1 status,
- future depiction strategy.

Historical WFV-001 inventory contained:

1. employee_production_worker
2. employee_senior_production_worker
3. employee_operations_supervisor
4. employee_engineer_basic
5. employee_senior_engineer
6. employee_maintenance_technician
7. employee_researcher_basic
8. employee_senior_researcher
9. employee_lab_director
10. employee_logistics_operator
11. employee_logistics_coordinator
12. employee_distribution_clerk
13. employee_port_operator
14. employee_rail_dispatcher
15. employee_administrator_basic
16. employee_financial_analyst
17. employee_hr_manager
18. employee_regional_manager
19. employee_executive_director

Verify against current content.

Content authority wins.

---

# 5. BATCH-1 SIZE — EXACTLY 8 PRODUCTION PRIMARIES

Production Batch 1 must contain:

**EXACTLY 8 employee-role detailed primaries total.**

Not 8 new plus the pilots.

Exactly 8 production primaries after this task.

The three human-reviewed pilot roles are mandatory Batch-1 members:

1. `employee_production_worker`
2. `employee_senior_engineer`
3. `employee_executive_director`

These are ART-DIRECTION references.

They may be promoted only after conforming to the frozen production contract.

In particular:

- remove pilot-only blueprint/grid backgrounds,
- ensure genuine transparency,
- repair composition if necessary,
- preserve the approved visual concept where it already works.

Do NOT blindly regenerate a good pilot.

---

# 6. SELECT EXACTLY FIVE ADDITIONAL ROLES

Select exactly five additional employee types from current content.

The resulting 8-role family must stress-test the grammar across materially different Workforce semantics.

Selection must maximize semantic breadth.

The final eight should cover as many of these domains as current content permits:

- production,
- engineering,
- maintenance,
- research,
- logistics,
- administration/finance/management.

At minimum, the five new selections must collectively introduce:

- one research role,
- one logistics role,
- one maintenance or operational-supervision role,
- one administration/finance role.

Do not select five visually similar factory employees.

---

# 7. SELECTION CLASSIFICATION

Before authoring new art, classify all 19 current employee types as exactly one of:

- `SAFE_HYBRID`
- `HYBRID_WITH_CONSTRAINTS`
- `PORTRAIT_FALLBACK_CANDIDATE`
- `SEMANTICALLY_BLOCKED`

This is an evidence-based classification.

It is NOT permission to reduce the final Workforce target arbitrarily.

Production philosophy:

> Create a detailed Workforce primary for every employee type for which a semantically honest, visually distinct and player-valuable depiction is possible.

Do NOT impose an artificial final cap such as 8/19 or 12/19.

Batch 1 is only the first bounded production slice.

---

# 8. PILOT PROMOTION RULES

For:

- employee_production_worker
- employee_senior_engineer
- employee_executive_director

compare the existing approved pilot concepts against the production contract.

## Production Worker

The hybrid worker + industrial cue concept was visually strong.

Preserve:

- clear human silhouette,
- PPE/workwear,
- obvious manufacturing context.

Avoid:

- turning the cue into an ICON-005 machine/process hero.

---

## Senior Engineer

The hybrid engineer + precision/automation cue was one of the strongest pilot proofs.

Preserve:

- person-first composition,
- specialist/precision read,
- technical occupational context.

Avoid:

- technology-primary composition,
- complete robotics cell,
- full manufacturing process.

---

## Executive Director

The pilot proved the semantic direction but requires stricter production treatment.

The final production primary must NOT become:

- a nearly invisible dark businessman,
- generic corporate stock imagery,
- demographic-coded authority,
- a strategy diagram with a token person.

The executive must remain clearly readable as a HUMAN ROLE.

Use a restrained supported strategy/HQ cue.

If the approved Hybrid composition cannot meet the production readability bar without semantic invention, a controlled Direction-A-like person-dominant variant is allowed inside the sealed WFV family.

Document any such decision.

This does NOT reopen art direction.

---

# 9. FIVE NEW PRIMARIES — QUALITY BAR

For each newly selected employee type, create one production-quality detailed primary.

Default master:

- approximately 1024×1024,
- RGBA,
- genuine transparent background,
- production-quality rendering.

Required:

- person primary,
- one dominant occupational cue,
- coherent camera/perspective across family,
- coherent lighting,
- coherent rendering/detail density,
- readable silhouette,
- no baked text,
- no logos,
- no pseudo-writing,
- no UI chrome,
- no blueprint background,
- no checkerboard,
- no fake alpha.

Avoid unnecessary environmental scenery.

The role must still read when the image is reduced.

---

# 10. GENERATED-ART QA

Inspect every generated or transformed primary for:

- malformed hands,
- extra fingers/limbs,
- fused tools,
- impossible machinery,
- disconnected equipment,
- unreadable fake writing,
- accidental logos,
- malformed PPE,
- inconsistent perspective,
- floating props,
- checkerboard baked into pixels,
- white/black matte contamination,
- edge halos,
- accidental full-building composition,
- accidental ICON-004/005 composition.

Repair or regenerate task-local failures.

Do not document obvious broken art as “acceptable variance.”

---

# 11. FAMILY COHERENCE

Create an 8-primary family board.

The board must demonstrate that the assets look like one Workforce family.

Evaluate:

- person scale,
- crop,
- perspective,
- lighting,
- contrast,
- detail density,
- occupational cue prominence,
- human prominence,
- family palette,
- role differentiation.

Minor natural variation is acceptable.

A collage of unrelated art styles is not.

---

# 12. CROSS-FAMILY DIFFERENTIATION

Create explicit comparison evidence against sealed:

- ICON-001 resource,
- ICON-003 building,
- ICON-004 technology,
- ICON-005 production,
- WFV Batch-1 Workforce.

The Workforce family must be identifiable without reading labels.

Required discriminator:

**visible human role + occupational cue**

If a WFV asset looks primarily like a building, technology, or process, repair it.

---

# 13. PRODUCTION ASSET ARCHITECTURE

Inspect current asset architecture before implementation.

Follow existing project conventions.

Create a single authoritative Workforce visual resolution path.

Conceptually:

employee type ID
→ production-approved Workforce primary if available
→ safe generic Workforce fallback

Do not create duplicated hard-coded maps in multiple screens.

Use existing asset registry/loader conventions where appropriate.

A reusable presentation primitive may be introduced, for example:

`WorkforceRoleVisual`

or the architecture-appropriate equivalent.

Do not force this exact name if repository conventions indicate another abstraction.

Required behavior:

- known Batch-1 employee ID → correct detailed primary,
- known non-Batch-1 employee ID → safe fallback,
- unknown employee ID → safe fallback,
- missing/broken art must not create an empty gray slot.

---

# 14. BOUNDED WORKFORCE UI INTEGRATION

The WFV-001 pilot established that the current `PGEmployeesWidget` is text-only and has no dedicated art column.

Production integration therefore includes ONE bounded layout slice.

Objective:

Make employee art actually visible in the real Workforce runtime UI without redesigning Workforce UX.

Allowed:

- thumbnail column,
- thumbnail row-leading cell,
- compact role-art area,
- small responsive row adjustment,
- necessary spacing/alignment changes.

Not allowed:

- full Workforce screen redesign,
- new employee management flow,
- new cards architecture across the app,
- hiring-flow redesign,
- gameplay changes,
- employee-stat redesign,
- new filters/sorting unless technically necessary for existing behavior,
- shell/navigation redesign.

---

# 15. RUNTIME PRESENTATION SIZE

On desktop, target approximately:

**72–96 px visible Workforce primary**

where the current layout can safely support it.

The art must be large enough to matter.

Do not reduce production art to a decorative 24 px thumbnail.

However:

do not destroy table readability merely to hit 96 px.

If current layout constraints require a smaller bounded value, use the largest safe value and document it.

At narrow/mobile widths:

- role name remains readable,
- salary/productivity/assignment information remains accessible,
- art must not cause horizontal page overflow,
- art must not create nested-scroll regressions.

A bounded responsive treatment is allowed.

---

# 16. NON-BATCH-1 FALLBACK UX

The remaining 11 employee types must remain functional.

Do NOT create:

- empty art boxes,
- broken-image icons,
- giant reserved blank thumbnail areas.

Choose a graceful bounded fallback.

Possible architecture:

- generic Workforce visual,
- existing generic people/role icon,
- compact neutral placeholder that intentionally reads as fallback.

Do not pretend a generic fallback is unique employee art.

Runtime evidence must visibly include:

- at least two Batch-1 detailed roles,
- at least one non-Batch-1 fallback role if test/runtime data permits.

If runtime fixture data does not naturally contain both, create a dev/test fixture for evidence without modifying gameplay content.

---

# 17. NO COMPACT FAMILY YET

Do NOT create 19 individual compact employee glyphs in this task.

Do not create a second full Workforce family merely because dense UI contexts exist.

Batch 1 tests Tier-1 detailed role identity first.

A later compact-tier decision may be made only after production family evidence exists.

---

# 18. RUNTIME STATES

Existing employee/runtime states remain UI-owned.

Do not bake into primary art:

- selected state,
- disabled state,
- assignment state,
- productivity value,
- salary,
- warning badge,
- building assignment,
- availability.

Those remain normal UI overlays/text/state.

The same primary must remain reusable.

---

# 19. PLAYER-FACING TEXT

Use authoritative player-facing employee names.

Do not introduce raw employee IDs into visible UI.

Do not “improve” names by inventing new terminology.

Do not change gameplay/content YAML merely to make art easier.

---

# 20. REQUIRED TECHNICAL QA

For all 8 Batch-1 production primaries verify:

- file exists,
- expected dimensions,
- RGBA,
- genuine alpha,
- no checkerboard,
- no obvious halo,
- no baked background,
- resolver mapping valid,
- runtime derivative valid if project architecture requires one.

Required result:

**8 / 8 PASS**

---

# 21. REQUIRED SCALE QA

Create a scale board containing all 8 production primaries at representative sizes.

At minimum evaluate:

- 64 px,
- 96 px,
- 128 px,
- 256 px.

Required:

- 8/8 recognizable at 96 px,
- 8/8 strong enough for intended runtime role at 96–128 px,
- no role depends on tiny text/details for identity.

64 px may lose detail but must not become meaningless noise.

---

# 22. REQUIRED EVIDENCE

Create/update evidence under:

`docs/architecture/reviews/evidence/`

Required:

1. `WFV_001_PRODUCTION_BATCH_1_FAMILY_BOARD.png`
   - all 8 production primaries
   - authoritative player-facing labels

2. `WFV_001_PRODUCTION_BATCH_1_SCALE_BOARD.png`
   - representative/all Batch-1 primaries across scale targets

3. `WFV_001_PRODUCTION_BATCH_1_CROSS_FAMILY_BOARD.png`
   - Resource / Building / Technology / Production / Workforce comparison

4. `WFV_001_PRODUCTION_BATCH_1_WORKFORCE_DESKTOP.png`
   - actual runtime Workforce UI
   - desktop around 1440×900

5. `WFV_001_PRODUCTION_BATCH_1_WORKFORCE_NARROW.png`
   - actual runtime Workforce UI
   - narrow around 480×900

6. `WFV_001_PRODUCTION_BATCH_1_MIXED_COVERAGE.png`
   - production detailed art + non-Batch-1 fallback together

Do not substitute static mocks for the required runtime screenshots.

Static boards may supplement runtime evidence.

---

# 23. RUNTIME VALIDATION

Validate the real application.

Desktop target:

approximately 1440×900.

Narrow target:

approximately 480×900.

Check:

- employee art actually renders,
- correct employee art resolves,
- names remain readable,
- salary/productivity/assignment remain usable,
- no broken images,
- no gray lazy-loading slots,
- no excessive row-height explosion,
- no horizontal page overflow,
- no overlapping controls,
- no raw IDs,
- fallback roles remain honest,
- existing Workforce actions still work.

If lazy loading causes screenshot/runtime blanks for these small critical assets, fix it locally using the project's established pattern rather than documenting it as acceptable.

---

# 24. COVERAGE MATRIX

Produce a complete current Employee Visual Coverage Matrix.

For every enabled employee type include:

- ID,
- player name,
- category,
- classification,
- Batch-1 yes/no,
- production primary yes/no,
- fallback behavior,
- semantic risk,
- recommended later treatment.

After this task, expected production coverage if authoritative inventory remains 19:

**8 / 19 detailed Workforce primaries**

Do not mark Workforce visual identity complete.

Status should become something equivalent to:

**PARTIAL — WFV-001 PRODUCTION BATCH 1 — 8/19**

---

# 25. SCENARIO-B ACCOUNTING

Update:

`docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`

Count honestly.

Rules:

- each production-approved detailed Workforce primary counts once,
- promoted pilot concepts count once total, not once as pilot + once as production,
- runtime derivatives do not count as new concepts,
- evidence boards do not count,
- screenshots do not count,
- registry entries do not count,
- fallback reuse does not count as unique role art,
- DEV pilot assets remain excluded unless explicitly promoted.

If exactly 8 production primaries exist after this task:

add exactly 8 Workforce primary concepts to production authored accounting.

Do not double-count the nine WFV pilot concepts.

Update Workforce status from:

`WFV-001 PILOT IN REVIEW (0/19 production)`

to an honest Batch-1 state such as:

`WFV-001 PRODUCTION BATCH 1 ACTIVE — 8/19`

only if all production gates pass.

---

# 26. CONTRACT UPDATE

Update:

`docs/design/workforce/WORKFORCE_ROLE_VISUAL_IDENTITY_WFV_001_ART_CONTRACT.md`

Preserve version history.

Record:

- human approval,
- Direction C production authority,
- Direction A controlled fallback rule,
- Direction B rejected as primary grammar,
- 1 person + 1 cue rule,
- no production blueprint background,
- genuine transparent-alpha requirement,
- demographic-neutral semantic rule,
- scale contract,
- Batch-1 production activation,
- exact eight production IDs,
- runtime integration contract,
- remaining coverage.

Do not rewrite history.

---

# 27. TESTS

Add/update focused tests where appropriate.

At minimum verify programmatically:

1. all 8 Batch-1 IDs resolve to detailed primaries,
2. every production manifest entry points to an existing asset,
3. non-Batch-1 known IDs resolve safely,
4. unknown employee ID resolves safely,
5. no duplicate employee mapping,
6. production coverage count is exactly 8,
7. UI component does not require a primary to render,
8. fallback does not expose raw IDs,
9. existing Workforce behavior remains intact.

Use the project's established test style.

---

# 28. ROOT QUALITY GATES

Before final close candidate run:

`pnpm typecheck`

Expected:
PASS

`pnpm lint`

Expected:
PASS with 0 errors.
Existing unrelated warnings may remain if they were already accepted baseline debt.

`pnpm test`

Expected:
PASS

`pnpm build:web`

Expected:
PASS

Also run task-specific asset QA.

Required:

- alpha: 8/8 PASS,
- dimensions: 8/8 PASS,
- manifest/path integrity: PASS,
- resolver: PASS,
- runtime resolution: 8/8 PASS.

Do not hide a red root gate behind task-local success.

---

# 29. FIREWALLS

Do NOT modify gameplay semantics.

Do NOT modify:

- simulation timing,
- production balance,
- employee salaries/productivity,
- employee requirements,
- hiring rules,
- building requirements,
- research rules,
- save schema,
- API semantics,
- world map,
- building placement,
- ICON-001,
- ICON-002,
- ICON-003,
- ICON-004,
- ICON-005,
- WBM-001,
- ProductionScreen,
- ResearchScreen,
- Player Guidance workstream,
- milestone semantics.

Do not reopen sealed art families.

Read them only as comparison references.

---

# 30. DEFINITION OF DONE

Batch 1 is close-ready only if ALL are true:

- [ ] authoritative employee inventory re-audited
- [ ] human-approved WFV art direction recorded as production authority
- [ ] exactly 8 Batch-1 employee IDs
- [ ] exact 3 approved pilot roles included
- [ ] exactly 5 additional roles selected
- [ ] selection spans materially different Workforce semantics
- [ ] all 19/current roles classified
- [ ] 8/8 production primaries exist
- [ ] production primaries have real transparent backgrounds
- [ ] no blueprint/grid backgrounds remain in production masters
- [ ] human is primary visual anchor in all 8
- [ ] occupational cue is semantically supported
- [ ] no role relies on demographic stereotype
- [ ] generated-art QA passed
- [ ] alpha 8/8 PASS
- [ ] dimension QA 8/8 PASS
- [ ] scale QA PASS
- [ ] 8-primary family board PASS
- [ ] cross-family differentiation PASS
- [ ] authoritative resolver/registry implemented
- [ ] Batch-1 resolution 8/8 PASS
- [ ] remaining roles have graceful fallback
- [ ] bounded Workforce runtime integration implemented
- [ ] desktop runtime PASS
- [ ] narrow runtime PASS
- [ ] mixed detailed/fallback runtime PASS
- [ ] no broken/gray art slots
- [ ] no raw employee IDs introduced
- [ ] existing Workforce functionality preserved
- [ ] complete Employee Visual Coverage Matrix produced
- [ ] Scenario-B accounting updated without double counting
- [ ] Workforce inventory status remains PARTIAL, not COMPLETE
- [ ] contract version history updated
- [ ] typecheck PASS
- [ ] lint PASS with 0 errors
- [ ] tests PASS
- [ ] build:web PASS
- [ ] firewalls respected
- [ ] no commit/push/tag

---

# 31. CLOSE-CANDIDATE REPORT

Create:

`docs/architecture/reviews/POST_V1_WFV_001_WORKFORCE_ROLE_VISUAL_IDENTITY_PRODUCTION_BATCH_1_CLOSE_CANDIDATE.md`

The report must contain:

1. baseline branch + exact HEAD,
2. working-tree classification,
3. authoritative employee count,
4. complete employee matrix,
5. classification of every employee type,
6. exact Batch-1 eight,
7. explanation for five new selections,
8. pilot promotion/rework decisions,
9. detailed asset manifest,
10. alpha QA,
11. generated-art QA,
12. scale QA,
13. family-coherence assessment,
14. cross-family differentiation,
15. resolver/registry architecture,
16. fallback behavior,
17. Workforce UI integration changes,
18. desktop runtime result,
19. narrow runtime result,
20. mixed-coverage runtime result,
21. complete post-batch coverage matrix,
22. Scenario-B accounting delta,
23. contract/inventory updates,
24. tests,
25. root gate results,
26. firewalls,
27. changed-files list,
28. evidence paths,
29. residual risks,
30. exactly one final decision.

---

# 32. FINAL DECISION — EXACTLY ONE

Return exactly one:

## OPTION A — FINAL CLOSE CANDIDATE READY

Use only if all DoD items and gates pass.

## OPTION B — ONE BOUNDED REPAIR REQUIRED

Use if one or a few task-local art/runtime/QA defects remain.

Fix them within this task where straightforward, then return one final close candidate.

Do not create repeated review loops.

## OPTION C — BATCH SELECTION SEMANTICALLY BLOCKED

Use only if five additional semantically honest roles cannot be selected from current authoritative content without inventing unsupported semantics.

Explain exact blockers.

## OPTION D — RUNTIME INTEGRATION REQUIRES GENUINE PRODUCT/UX DECISION

Use only if the existing Workforce UI structurally cannot accommodate a bounded visual integration without a material UX redesign.

Do not use this option merely because CSS work is required.

---

# 33. STOP CONDITION

After producing the final close-candidate report:

STOP.

Do NOT:

- start Production Batch 2,
- produce all remaining 11 roles,
- create 19 compact glyphs,
- redesign WorkforceScreen,
- start Transport visual identity,
- start Milestone art,
- reopen World,
- reopen ICON-003/004/005,
- commit,
- push,
- tag.

Wait for independent human/ChatGPT review.

---

# CORE RULE

WFV-001 is no longer an art-direction experiment.

The family direction is sealed:

**Human first.
Occupation second.
One person + one meaningful cue.
Beautiful detailed game art.
No blueprint background.
No demographic role coding.
No machine/process taking over the composition.**

Production Batch 1 must prove that this grammar works across eight genuinely different employee roles AND inside the real Workforce UI.

Exactly 8 detailed production primaries.

3 approved pilot roles + exactly 5 additional roles.

The remaining roles must degrade gracefully.

Then stop with one close candidate.