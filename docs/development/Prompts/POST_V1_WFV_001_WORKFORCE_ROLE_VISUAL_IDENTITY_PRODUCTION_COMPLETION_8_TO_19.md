# POST-V1 WFV-001 — Workforce Role Visual Identity Production Completion 8→19

## Mode

Bounded production-art completion slice.

This task continues the already human-approved and sealed WFV-001 Workforce Role Visual Identity direction.

The purpose is to complete production visual coverage from the currently sealed **8/19** Workforce primaries toward **19/19**, using the existing WFV-001 visual grammar and runtime architecture.

This is NOT:

- a new art-direction pilot,
- a Workforce UI redesign,
- a compact-glyph project,
- a gameplay/content rebalance,
- an employee-system redesign,
- a generic visual audit,
- a new asset-family invention,
- or permission to reopen sealed Scenario-B families.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

Use consolidated Definition-of-Done mode.

Fix obvious task-local defects before returning the close candidate.

Return ONE final close candidate unless a genuine stop condition is reached.

Do not commit, push, or tag.

---

# 1. Existing authority — DO NOT REOPEN

WFV-001 Art Direction has already passed the human gate.

Authoritative contract:

`docs/design/workforce/WORKFORCE_ROLE_VISUAL_IDENTITY_WFV_001_ART_CONTRACT.md`

Current sealed authority:

- WFV-001 Art Direction: `APPROVED / PASS / SEALED`
- Tier-1 primary grammar:
  **Direction C — Hybrid Human + Occupational Context**
- core composition:
  **1 person + 1 dominant occupational cue**
- Direction A:
  **controlled fallback only where a hybrid depiction would be semantically artificial**
- Direction B:
  rejected as primary grammar because of collision risk with ICON-004 / ICON-005
- production masters:
  real RGBA transparency
- no blueprint/grid presentation backgrounds in production masters
- visual family must remain recognizably HUMAN / WORKFORCE first

Do not reopen these decisions.

Do not produce another A/B/C comparison.

Do not regenerate the existing eight production assets merely for stylistic preference.

Existing production coverage:

**8 / 19**

Existing Batch-1 IDs:

1. `employee_production_worker`
2. `employee_senior_engineer`
3. `employee_executive_director`
4. `employee_maintenance_technician`
5. `employee_senior_researcher`
6. `employee_logistics_coordinator`
7. `employee_financial_analyst`
8. `employee_operations_supervisor`

These eight are production authority and must remain unchanged unless a hard technical asset defect is discovered.

---

# 2. Objective

Complete the remaining Workforce visual coverage.

Target:

**8/19 → 19/19 individual WFV-001 production primary coverage**

However:

Do NOT force a dishonest Hybrid-C depiction merely to hit 19/19.

For each of the remaining eleven enabled Employee Types:

1. inspect authoritative content semantics,
2. determine the strongest honest occupational depiction,
3. use Direction C wherever semantically defensible,
4. use approved Direction A only where adding an occupational context object would create unsupported or artificial meaning,
5. stop only if a role cannot be represented honestly under either approved grammar.

The desired outcome is 19/19.

19/19 is a coverage target, not permission to invent semantics.

---

# 3. Baseline and working-tree discipline

Before modifying anything:

Record:

- branch,
- HEAD,
- working-tree state,
- current enabled Employee Type count,
- current WFV-001 production manifest count,
- current WFV resolver coverage,
- current runtime fallback behavior.

Verify that the repository still contains:

- 19 enabled Employee Types,
- 8 WFV-001 production primaries,
- the sealed WFV-001 contract,
- existing WFV resolver/runtime integration,
- ICON-002 fallback for non-WFV roles.

If counts differ because legitimate work has landed since Batch 1:

do not blindly restore historical counts.

Document the current authoritative state and reconcile this prompt against it.

Clearly distinguish:

- task-owned changes,
- predecessor WFV changes if unexpectedly uncommitted,
- unrelated working-tree churn.

Do not absorb unrelated changes.

---

# 4. Re-audit the remaining eleven roles

Enumerate all currently enabled Employee Types from authoritative game content.

Produce a table containing:

| Employee ID | Player-facing name | Category/domain | Current visual | Relevant authoritative semantics | Proposed grammar | Proposed visual concept | Confidence |
|---|---|---|---|---|---|---|---|

For the eleven roles without WFV production primaries, classify each as exactly one:

- `HYBRID_C_SAFE`
- `PORTRAIT_A_PREFERRED`
- `SEMANTICALLY_BLOCKED`

Definitions:

### HYBRID_C_SAFE

The role has an authoritative occupational cue that can accompany the person without inventing unsupported meaning.

Examples of cue classes may include, only when content supports them:

- tools,
- control surfaces,
- inspection equipment,
- planning material,
- logistics equipment,
- technical instruments,
- safety equipment,
- administrative work objects.

Do not infer a specific machine/site/process merely because it looks attractive.

### PORTRAIT_A_PREFERRED

The person/role itself carries the reliable occupational identity, while adding a context object would be artificial, misleading, or overly specific.

Direction A remains a deliberate production fallback, not a lower-quality asset.

It must still meet the same production-quality standard.

### SEMANTICALLY_BLOCKED

Neither approved grammar can produce a meaningful, honest, distinct depiction from authoritative semantics.

This classification requires explicit evidence.

Do not use it merely because a role is difficult.

---

# 5. Production-completion selection rule

If all eleven roles are `HYBRID_C_SAFE` or `PORTRAIT_A_PREFERRED`:

produce all eleven.

Final target:

**19/19 WFV-001 production primaries**

If one or more are genuinely `SEMANTICALLY_BLOCKED`:

produce every non-blocked role in this slice.

Do not invent art for the blocked roles.

Return OPTION C at the end with exact blockers and evidence.

Do not artificially stop at another arbitrary batch size.

This is intended to be the Workforce primary-art completion slice.

---

# 6. Direction C production grammar

For every `HYBRID_C_SAFE` role:

Use the sealed grammar:

**human anchor + one dominant occupational cue**

The human must remain the primary semantic anchor.

The result must read:

> “This is a person performing a profession.”

It must NOT primarily read:

> “This is a machine / building / technology / production process.”

Target visual weighting:

- person: dominant or co-dominant,
- occupational context: one strong supporting cue,
- no busy multi-machine scene,
- no environment panorama,
- no building exterior,
- no process-diorama composition.

Preserve the sealed industrial visual language:

- stylized detailed industrial realism,
- steel blue / charcoal base,
- restrained safety-orange accents,
- controlled directional lighting,
- coherent camera/composition family,
- transparent background.

---

# 7. Direction A production fallback

For `PORTRAIT_A_PREFERRED` roles:

Use the already approved Direction-A fallback.

The asset must still feel like the same WFV-001 family.

Requirements:

- person-forward occupational portrait,
- bust / waist-up / suitable role silhouette,
- occupational clothing or role cues supported by content,
- no generic stock-photo appearance,
- no arbitrary gender/ethnicity/age semantics,
- no corporate glamour portrait,
- no fake insignia,
- no readable generated text,
- no logos,
- no unsupported uniforms,
- no baked UI/background.

Use lighting, palette, rendering quality, and silhouette treatment compatible with the Hybrid-C family.

Direction A must look intentional beside Direction C, not like a fallback from another game.

---

# 8. Human-depiction safety and semantic rules

Preserve the sealed contract.

Do not encode unsupported meaning through:

- gender,
- ethnicity,
- age,
- body type,
- social status,
- personality,
- health,
- nationality.

Occupational identity should come primarily from:

- clothing silhouette,
- PPE,
- tools,
- posture,
- workstation cue,
- role-appropriate objects.

Faces may remain stylized or lower-detail where useful for consistency.

Avoid:

- celebrity resemblance,
- exaggerated stereotypes,
- pin-up/glamour treatment,
- caricature,
- heroic military posing unless content explicitly supports it,
- fake company logos,
- fake text,
- pseudo-writing,
- badges containing generated text.

---

# 9. Asset quality contract

Each new production primary should default to:

- approximately 1024×1024,
- PNG,
- RGBA,
- genuine transparent background,
- clean alpha,
- no checkerboard baked into pixels,
- no presentation board background,
- no UI frame.

Production art must remain legible at:

- 64 px,
- 80 px,
- 96 px,
- 128 px,
- 256 px.

Important:

Current runtime includes approximately:

- 80 px desktop,
- 56 px narrow.

56 px is a runtime compact presentation constraint.

Do not simplify the master artwork down to “icon quality” merely because narrow runtime uses a smaller derivative/display size.

The master remains detailed Scenario-B artwork.

---

# 10. Generated-art QA

Every newly authored primary must receive explicit visual QA.

Inspect for:

- malformed hands,
- extra/missing fingers,
- duplicated limbs,
- impossible body geometry,
- broken PPE,
- floating tools,
- merged human/machine geometry,
- impossible equipment,
- duplicated objects,
- fake text,
- pseudo-writing,
- logos,
- watermarks,
- broken perspective,
- accidental opaque matte,
- checkerboard contamination,
- alpha halos,
- clipped occupational cues,
- poor silhouette,
- excessive background residue.

Repair or regenerate task-local failures before close candidate.

Do not report obvious generated-art defects as “acceptable variance.”

---

# 11. Distinctness across the 19-role family

Completion must not result in nineteen near-identical people with minor prop swaps.

Assess the entire 19-role family.

Each role should derive identity from a controlled combination of:

- silhouette,
- occupational clothing,
- PPE,
- posture,
- context object,
- tool family,
- framing.

At the same time:

do not exaggerate differences into unsupported fantasy.

Required family test:

At approximately 96–128 px, a player should be able to perceive meaningful visual differences between roles without needing to read every label.

Do not require exact role identification from art alone.

The artwork supplements authoritative text; it does not replace it.

---

# 12. Cross-family firewall

WFV-001 must remain visually distinct from:

- ICON-001 Resources,
- ICON-002 Building Categories,
- ICON-003 Buildings,
- ICON-004 Technologies,
- ICON-005 Production Processes.

In particular:

### Against ICON-003

Do not make a workplace/building the dominant subject.

### Against ICON-004

Do not turn engineering/research roles into technology apparatus cards.

### Against ICON-005

Do not turn production roles into process-machine scenes.

WFV-001's invariant is:

**the HUMAN ROLE is the semantic center.**

---

# 13. Production asset structure

Follow the established WFV-001 Batch-1 asset architecture.

Do not create a parallel registry or second naming scheme.

Extend the existing production structure under the repository's current authoritative paths, expected around:

`docs/design/workforce/icon-wfv-001/`

and runtime assets around:

`apps/web/public/assets/workforce/`

Update the existing production manifest rather than inventing a new unrelated manifest format.

Keep pilot/reference assets under their existing DEV/pilot classification.

Do not count DEV pilot boards as production assets.

---

# 14. Resolver completion

Extend the existing WFV resolver so every newly approved production role resolves through the same architecture as Batch 1.

Expected hierarchy after successful 19/19 completion:

`employeeTypeId`
→ WFV-001 production primary
→ defensive ICON-002 category fallback for unknown/unsupported IDs

Important:

Even if all current 19 enabled Employee Types receive WFV art:

**retain the defensive fallback.**

Do not delete fallback behavior merely because current known coverage reaches 100%.

Unknown/future Employee Types must still render safely.

No duplicated employee-ID → asset maps across components.

Maintain one authoritative resolver/registry path.

---

# 15. Runtime integration

Do NOT redesign `PGEmployeesWidget`.

Reuse the existing Batch-1 Workforce art column.

Existing behaviors must remain intact:

- search,
- selection,
- salary display,
- employee type/name display,
- assignment information where applicable,
- responsive behavior,
- navigation,
- dashboard semantics.

Do not add:

- new employee cards,
- new inspector,
- new hire flow,
- new modal,
- new compact-glyph system,
- giant portraits,
- new Workforce screen.

This task completes art coverage inside the already approved integration.

---

# 16. Responsive behavior

Validate the real Workforce runtime at minimum:

### Desktop

approximately `1440×900`

### Narrow

approximately `480×900`

Requirements:

- thumbnails remain visible,
- no horizontal layout destruction,
- no image overflow,
- no row-height explosion,
- text remains usable,
- selected-row styling remains visible,
- salary/type columns behave as before,
- no broken images,
- no lazy gray placeholders.

Do not solve narrow-layout issues through a broad Company/Operations redesign.

Task-local CSS corrections are allowed where necessary to preserve the existing WFV integration.

---

# 17. Runtime fixture / evidence composition

Create or reuse a deterministic runtime fixture that demonstrates the completed family.

Runtime evidence must show more than the same two Batch-1 employees.

Ensure the evidence exercises a meaningful selection of the newly completed roles.

Where practical, show roles from multiple domains, for example:

- industrial/production,
- engineering/maintenance,
- research,
- logistics,
- administration/finance,
- management.

Do not alter gameplay/content semantics just to populate screenshots.

Use existing fixture/hire mechanisms or bounded evidence tooling.

---

# 18. Required visual evidence

Create/update evidence under the established review evidence location.

Required:

### A. Full family board

`WFV_001_PRODUCTION_COMPLETION_19_ROLE_FAMILY_BOARD.png`

Show all current production Workforce primaries together.

If final coverage is below 19 because of genuine semantic blockers, filename may reflect actual count, but explain why.

### B. New-role family board

`WFV_001_PRODUCTION_COMPLETION_NEW_ROLES_BOARD.png`

Show the eleven completion candidates, clearly labeled with player-facing role names.

### C. Scale board

`WFV_001_PRODUCTION_COMPLETION_SCALE_BOARD.png`

Exercise representative new roles at:

- 64
- 80/96
- 128
- 256 px

Include at least:

- one industrial role,
- one technical/research role,
- one administrative/management role.

### D. Cross-family board

`WFV_001_PRODUCTION_COMPLETION_CROSS_FAMILY_BOARD.png`

Compare representative WFV assets against:

- ICON-001,
- ICON-003,
- ICON-004,
- ICON-005.

Demonstrate that Workforce remains person-first.

### E. Desktop runtime

`WFV_001_PRODUCTION_COMPLETION_WORKFORCE_DESKTOP.png`

Actual runtime.

### F. Narrow runtime

`WFV_001_PRODUCTION_COMPLETION_WORKFORCE_NARROW.png`

Actual runtime.

### G. Mixed/new-role runtime evidence

`WFV_001_PRODUCTION_COMPLETION_NEW_ROLE_COVERAGE.png`

Actual runtime containing multiple newly completed roles.

Do not substitute static mocks for required runtime evidence.

---

# 19. Alpha and technical asset QA

Programmatically verify every new production master.

For each:

- file exists,
- dimensions correct,
- RGBA,
- alpha channel present,
- meaningful transparent pixels,
- no accidental fully opaque square,
- no obvious alpha-edge corruption.

If all eleven are produced:

required result:

**11/11 new assets PASS**

Also verify all existing eight still resolve.

Full production family:

**19/19 manifest/resolver/path integrity PASS**

Do not modify an existing sealed Batch-1 asset solely to improve an alpha statistic if it already passed its authority gate.

---

# 20. Full coverage matrix

The close report must contain one row for every enabled Employee Type.

Required columns:

| Employee ID | Player name | Category/domain | Grammar | Production asset | Resolver | Runtime | Fallback needed | QA |
|---|---|---|---|---|---|---|---|---|

Expected successful state:

- 19 enabled,
- 19 production primaries,
- 19 resolver mappings,
- 19 runtime-capable,
- zero known enabled roles relying on ICON-002 fallback,
- defensive unknown-ID fallback still present.

If current content count changed, use actual current values and explain.

---

# 21. Human visual quality gate before close candidate

This slice does NOT require another art-direction decision.

However, Cursor must perform a production-quality self-review of the new artwork before returning it for independent human review.

For every new primary assess:

- semantic honesty,
- human-role dominance,
- occupational readability,
- family coherence,
- cross-family differentiation,
- 64–96 px readability,
- 128–256 px reward/detail quality,
- generated-art cleanliness.

Classification:

- `PASS`
- `REPAIR_REQUIRED`
- `SEMANTIC_BLOCKER`

Repair `REPAIR_REQUIRED` assets before returning the close candidate.

Do not hide weak artwork behind an overall family PASS.

The final screenshots/boards will still be human-reviewed externally before the track is sealed.

---

# 22. Scenario-B accounting

Update:

`docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`

Count honestly.

If eleven new independent production primaries are created:

WFV authored production-primary contribution becomes:

**19**

Do not double-count:

- pilot concepts,
- runtime copies,
- resized derivatives,
- evidence boards,
- regenerated intermediate failures,
- registry entries,
- screenshots.

If an existing pilot is merely copied/promoted, count the underlying production concept once.

Update Workforce status from:

`PARTIAL — WFV-001 PRODUCTION BATCH 1 — 8/19`

to an honest result such as:

`COMPLETE CANDIDATE — WFV-001 PRIMARY COVERAGE 19/19`

Do NOT mark the track `SEALED` before independent human review.

If coverage remains below 19 because of semantic blockers, retain `PARTIAL` and state exact coverage.

Scenario-B's overall planning envelope remains unchanged.

Do not reinterpret the 380–520 range as a quota.

---

# 23. Contract update

Update:

`docs/design/workforce/WORKFORCE_ROLE_VISUAL_IDENTITY_WFV_001_ART_CONTRACT.md`

Preserve version history.

Record:

- Production Completion 8→19,
- actual final coverage,
- Direction-C usage count,
- Direction-A fallback usage count,
- any semantic blockers,
- production manifest authority,
- runtime resolver authority,
- defensive fallback retained.

Do not rewrite historical pilot decisions.

Do not claim independent final seal inside the contract.

Use status such as:

`WFV-001 PRODUCTION COMPLETION — HUMAN REVIEW PENDING`

until external review.

---

# 24. Tests

Add or update focused tests as appropriate.

At minimum verify:

1. all production WFV IDs resolve,
2. all currently enabled employee IDs expected to have production art resolve,
3. unknown employee ID still reaches safe fallback,
4. asset registry contains no duplicate WFV IDs,
5. production manifest agrees with resolver,
6. production asset paths exist,
7. `WorkforceRoleVisual` still renders fallback safely,
8. `PGEmployeesWidget` remains compatible with completed coverage.

Do not create brittle tests that snapshot generated artwork pixels.

Test architecture/coverage, not artistic aesthetics.

---

# 25. Root quality gates

Before returning the close candidate run:

`pnpm typecheck`

Expected:

PASS

`pnpm lint`

Expected:

PASS with **0 errors**

`pnpm test`

Expected:

PASS

`pnpm build:web`

Expected:

PASS

Also run all task-local asset/manifest/resolver QA.

If a root gate fails because of an obvious task-local defect:

fix it in this slice.

Do not return a knowingly repairable close candidate.

If a failure is clearly unrelated pre-existing churn:

prove that with evidence rather than silently absorbing unrelated files.

---

# 26. Firewalls

Do NOT modify gameplay semantics.

Do NOT modify employee balance.

Do NOT modify:

- salaries,
- productivity values,
- hiring requirements,
- employee unlock logic,
- building requirements,
- research requirements,
- save semantics,
- simulation behavior.

Do NOT reopen:

- ICON-001,
- ICON-002,
- ICON-003,
- ICON-004,
- ICON-005,
- Building Visual Identity,
- World visual work,
- Production screen,
- Research screen,
- Player Guidance,
- time/cycle semantics.

Do NOT start:

- Workforce compact glyphs,
- employee animation,
- portraits in unrelated screens,
- employee inspector redesign,
- hire-flow redesign,
- Company screen redesign.

Small task-local presentation fixes required for existing WFV thumbnails are permitted.

---

# 27. Stop conditions

Stop and return evidence instead of guessing if:

1. authoritative employee semantics genuinely cannot support either approved Direction C or Direction A for one or more roles;
2. current content inventory materially differs from the expected 19 and creates scope ambiguity;
3. completion requires gameplay/product semantics not present in authoritative content;
4. asset architecture requires a material cross-family redesign;
5. an unexpected cross-scope regression cannot be repaired locally;
6. a sealed asset/contract integrity failure is discovered.

Do NOT stop for:

- normal generated-art cleanup,
- alpha repair,
- minor CSS adjustment,
- evidence-script repair,
- ordinary resolver/test fixes,
- difficulty making roles visually distinct.

Those are task-local responsibilities.

---

# 28. Required close-candidate report

Create:

`docs/architecture/reviews/POST_V1_WFV_001_WORKFORCE_ROLE_VISUAL_IDENTITY_PRODUCTION_COMPLETION_8_TO_19_CLOSE_CANDIDATE.md`

The report must include:

1. branch + HEAD baseline
2. working-tree classification
3. authoritative employee inventory
4. starting coverage
5. remaining-role semantic audit
6. `HYBRID_C_SAFE / PORTRAIT_A_PREFERRED / SEMANTICALLY_BLOCKED` classification
7. exact new production assets
8. Direction-C vs Direction-A decisions
9. semantic rationale per new role
10. generated-art QA per new role
11. alpha QA
12. scale QA
13. full-family coherence
14. cross-family differentiation
15. production manifest result
16. resolver result
17. defensive fallback result
18. full 19-role coverage matrix
19. runtime desktop validation
20. runtime narrow validation
21. new-role runtime validation
22. Scenario-B accounting
23. contract/inventory updates
24. tests
25. root gates
26. firewalls
27. residual risks
28. exact evidence paths
29. exact changed-file list
30. final decision

---

# 29. Final decision

Return exactly ONE:

### OPTION A — WFV-001 PRIMARY PRODUCTION COMPLETION 19/19 — FINAL CLOSE CANDIDATE READY

Use only if:

- all current enabled Employee Types have honest production primaries,
- all new art passes QA,
- runtime works,
- manifest/resolver coverage is complete,
- defensive fallback remains,
- root gates are green,
- no firewall breach occurred.

### OPTION B — ONE BOUNDED REPAIR REQUIRED

Use only when a small number of concrete task-local defects remain that could not responsibly be repaired in the current pass.

State exact defects.

### OPTION C — SEMANTICALLY BLOCKED BELOW 19/19

Use only when one or more roles cannot honestly be depicted under either sealed Direction C or approved Direction A.

State:

- blocked IDs,
- authoritative semantics,
- why C would be dishonest,
- why A is insufficient,
- achieved coverage.

Do not invent art merely to avoid OPTION C.

### OPTION D — GENUINE PRODUCT / ARCHITECTURE DECISION REQUIRED

Use only for a real ambiguity that materially exceeds this bounded art-completion slice.

---

# 30. Commit discipline

Do NOT:

- stage,
- commit,
- push,
- tag.

Return the final close candidate for independent review.

The external reviewer will decide whether WFV-001 Production Completion can be declared:

`CLOSED / PASS / SEALED`

---

# Core rule

The Workforce art direction is already decided.

Do not redesign it.

Start from the sealed 8/19 production family.

Audit the remaining eleven roles against authoritative semantics.

Use the approved Hybrid-C grammar wherever honest:

**one human + one dominant occupational cue.**

Use approved Direction A only when a hybrid cue would be artificial.

Create every remaining semantically honest production primary.

Target **19/19**.

Keep the human role visually dominant.

Do not turn Workforce art into buildings, technologies, production machines, or generic UI icons.

Preserve the existing resolver and runtime integration.

Retain the defensive fallback for unknown future IDs.

Validate the actual game at desktop and narrow sizes.

Produce full-family visual evidence.

Run all root gates.

Return one completion close candidate.

Then stop.