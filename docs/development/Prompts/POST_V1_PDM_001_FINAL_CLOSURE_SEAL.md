# POST-V1 PDM-001
# Direct Map Building Placement
# Final Closure / Seal

## MODE

FINAL CLOSURE / SEAL REVIEW.

PDM-001 implementation, lifecycle integration, bounded runtime repair, and runtime evidence are complete.

This task does NOT implement another PDM slice.

This task exists only to:

1. verify final repository truth;
2. reconcile the complete PDM-001 task-owned diff with the sealed contracts;
3. verify all required implementation/runtime evidence exists;
4. verify the bounded runtime defect was correctly closed;
5. verify no material scope leakage occurred;
6. issue the formal PDM-001 closure/seal decision;
7. determine whether the task-owned PDM changes are commit/push ready.

Default expectation:

> READ / VERIFY / REPORT ONLY.

No production changes are expected.

No test changes are expected.

No evidence changes are expected.

No architecture changes.

No gameplay changes.

No new runtime capture unless existing evidence is missing, contradictory, or invalid.

Do NOT commit.
Do NOT push.
Do NOT tag.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

Return one final closure decision.

---

# 1. READ FIRST

Read completely:

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/architecture/reviews/POST_V1_PDM_001_PRODUCT_UX_CONTRACT.md`
- `docs/architecture/reviews/POST_V1_PDM_001_COORDINATE_CONTRACT_CONSISTENCY_CLOSEOUT.md`
- `docs/architecture/reviews/POST_V1_PDM_001_BOUNDED_IMPLEMENTATION_CLOSE_CANDIDATE.md`
- `docs/architecture/reviews/POST_V1_PDM_001_RUNTIME_EVIDENCE_GATE.md`

Also inspect the relevant PDM task-owned implementation/test/evidence files identified by those reports.

Do not start broad repository discovery.

Do not reopen already-closed design questions without hard contradictory evidence.

---

# 2. CURRENT EXPECTED GATE STATE

Treat the following as prior reviewed outcomes that must now be verified against repository truth:

## Product / UX Contract

Expected:

> `COMPLETE / PASS`

## Coordinate semantics

Expected:

> `CLOSED / PASS / SEALED FOR IMPLEMENTATION`

Including:

- domain Position remains non-negative integer;
- no presentation-derived upper gameplay bound;
- stable projection;
- `s = 1`;
- inverse uses `round`;
- negative unprojection → no-pick;
- pickability ≠ gameplay validity;
- same projection for preview and final/default-region marker.

## Bounded implementation

Expected:

> `PASS FOR RUNTIME EVIDENCE`

## Confirm / Rejection Lifecycle Test Delta

Expected:

> `CLOSED / PASS`

## Runtime Evidence Gate

Expected:

> `PASS`

## Current PDM status

Expected:

> `READY FOR INDEPENDENT FINAL CLOSURE REVIEW`

Verify all of this.

Do not merely repeat the reports.

---

# 3. BASELINE TRUTH

Record:

- branch;
- exact HEAD;
- HEAD subject;
- exact `origin/master`;
- HEAD/origin relationship;
- working-tree status;
- staged changes;
- unstaged changes;
- untracked files relevant to PDM;
- unrelated WIP.

Previously reported baseline:

`500a00a086fa083c1bca461ccbe87b1f23f9b675`

with subject:

`WORKFORCE-NAV-001: navigate from STALLED_WORKFORCE to Personal focus.`

Verify actual Git truth.

If HEAD has changed:

do not automatically fail.

Determine whether the new commits are legitimate unrelated repository progress or whether PDM was unexpectedly committed/modified.

---

# 4. PROTECT UNRELATED WIP

The repository is known to contain extensive unrelated local WIP.

Do not:

- reset;
- restore;
- clean;
- stash;
- stage;
- unstage;
- delete;
- move

unrelated work.

This closure review must distinguish:

> PDM task-owned diff

from:

> unrelated WIP.

Do not require a clean working tree.

---

# 5. IDENTIFY THE COMPLETE PDM TASK-OWNED DIFF

Build the final authoritative PDM task-owned file inventory from:

- Git diff/status;
- implementation close candidate;
- runtime report;
- actual repository contents.

At minimum reconcile the known PDM areas:

- coordinate adapter;
- coordinate tests;
- World overlay mapper integration;
- overlay tests;
- pointer/camera helper;
- pointer/camera tests;
- placement-session model/helpers;
- placement-session tests;
- `GameWorkspaceProvider`;
- Buildings placement entry;
- Buildings tests;
- World placement wiring;
- World workspace/viewport/canvas;
- preview marker;
- placement CSS;
- workspace testing mock;
- provider lifecycle integration tests;
- PDM evidence fixture tooling;
- PDM runtime capture tooling;
- generated PDM evidence fixture if repository policy retains it;
- runtime screenshots/evidence summary if repository policy retains them;
- PDM architecture/review reports;
- PDM prompt documents if prompts are tracked.

Do not assume every listed file must be committed.

Classify each according to repository policy.

---

# 6. FINAL SCOPE CLASSIFICATION

Classify task-owned changes into:

## A. Production

## B. Tests

## C. Evidence tooling

## D. Generated evidence / fixtures

## E. Architecture / review documentation

## F. Development prompts

For each category:

- list exact paths;
- state whether it belongs in the final PDM commit according to repository conventions;
- identify any generated/transient artifact that should NOT be committed.

Do not delete anything in this review.

If cleanup is needed before commit:

report it explicitly.

---

# 7. PRODUCT CONTRACT RECONCILIATION

Verify the final implementation still satisfies the approved player flow:

> Buildings
> → building selection / name
> → Position auf Karte wählen
> → automatic World transition
> → placement mode
> → map candidate
> → preview
> → explicit Gebäude platzieren
> → authoritative existing placement command
> → success remains World.

Also verify:

> Abbrechen
> → no placement mutation
> → session cleared
> → Buildings.

No new product semantics may have appeared during runtime repair.

---

# 8. RAW X/Y DISPOSITION

Verify final normal player flow does NOT require manual:

- X;
- Y

coordinate entry.

Domain Position must still exist internally.

Do not confuse:

> internal x/y

with:

> player-facing raw coordinate input.

Expected:

> raw X/Y removed from normal placement UI.

---

# 9. AUTHORITATIVE COMMAND PATH

Verify final confirm still reuses the existing placement authority.

Expected conceptual path:

> `confirmBuildingMapPlacement`
> → existing `runCommand`
> → existing `placeBuilding({ buildingTypeId, name, x, y })`

Verify:

- no second placement command;
- no bypass;
- no direct persistence mutation;
- no pointer-derived `regionId`;
- no evidence-only production shortcut.

---

# 10. COORDINATE CONTRACT FINAL CHECK

Verify actual final code still implements the sealed coordinate semantics.

Required:

- stable default-region anchor O;
- `s = 1`;
- forward projection:
  `world = O + position * s`;
- inverse quantization:
  `round`;
- negative raw coordinate:
  no-pick / null;
- no clamp to zero;
- no upper domain cap derived from SVG/grid/region footprint;
- canvas may expand for presentation;
- positive domain positions beyond painted footprint remain valid candidates subject only to existing gameplay authority.

Any material contradiction here blocks sealing.

---

# 11. PRESENTATION FIREWALL

Verify presentation geometry remains presentation-only.

The following must NOT have become gameplay bounds:

- SVG width/height;
- region footprint;
- cell size;
- inset;
- `mapX`;
- `mapY`;
- painted map extent.

Do not seal if presentation dimensions now reject otherwise valid positive domain Position.

---

# 12. PICKABILITY VS GAMEPLAY VALIDITY

Verify the implementation still separates:

> Can the map interaction produce a candidate?

from:

> Will authoritative placement accept it?

Expected:

- negative unprojection → no-pick;
- valid non-negative candidate may still later be rejected by authoritative placement;
- command rejection does not become no-pick.

No new client-side gameplay validation should have been invented.

---

# 13. PREVIEW CONTRACT

Verify:

- candidate selection itself causes no placement mutation;
- preview is transient;
- preview uses shared coordinate projection;
- preview is non-authoritative;
- preview does not intercept normal placement semantics incorrectly;
- explicit confirm is required.

---

# 14. PREVIEW → FINAL CONTINUITY

Verify both automated and runtime evidence.

Expected runtime evidence:

Desktop:

- picked domain: `19, 13`;
- placed domain: `19, 13`;
- preview anchor: `23, 17`;
- final anchor: `23, 17`;
- delta: `0, 0`.

Narrow:

- picked domain: `23, 15`;
- placed domain: `23, 15`;
- preview anchor: `27, 19`;
- final anchor: `27, 19`;
- delta: `0, 0`.

Reported tolerance:

> 2px.

Confirm these values are actually present in the final evidence/report and consistent with implementation.

Do not recapture merely for ceremony.

---

# 15. EXISTING BUILDING MARKERS

Verify default-region existing building markers still use persisted domain Position through the shared projection.

Ensure the old distributed presentation layout has not remained authoritative for the default-region buildings covered by PDM.

Other-region behavior must remain unchanged unless explicitly authorized.

Do not expand PDM into multi-region redesign.

---

# 16. CAMERA / POINTER CONTRACT

Verify:

- existing camera remains authoritative for pan/zoom;
- pointer is converted through viewport/camera inverse before domain unprojection;
- pan is distinguished from tap/pick;
- pan does not place;
- zoom does not change candidate domain semantics.

Do not redesign camera architecture.

---

# 17. TRANSIENT SESSION CONTRACT

Verify final placement session is:

- transient;
- UI/workspace state;
- not persisted into save schema.

Verify lifecycle:

### Start

- created from Buildings;
- transitions to World;
- survives the Buildings→World transition.

### Pick

- candidate updated;
- no placement mutation.

### Repick

- candidate replaced;
- no placement mutation.

### Confirm success

- existing place command invoked exactly once;
- session cleared only after successful command;
- remains World.

### Confirm rejection

- session retained;
- candidate retained;
- remains World/placement mode.

### Cancel

- no placement mutation;
- session cleared;
- returns Buildings.

### Navigation away from World

- session cleared;
- no placement mutation;
- stale session does not resurrect.

---

# 18. RUNTIME DEFECT CLOSURE

The Runtime Evidence Gate reported one bounded production defect:

> placement session could be cleared during Buildings → World entry because cleanup observed a session while navigation was still on Buildings.

Reported repair:

> clear placement session only when actually leaving World, using previous-screen semantics.

Inspect the final implementation.

Verify:

- defect is real and correctly understood;
- repair is minimal;
- repair does not weaken navigation-away cleanup;
- Buildings→World session now survives;
- World→other-screen session still clears;
- regression test directly covers the repaired behavior.

This runtime repair MUST be included in final PDM scope.

---

# 19. RUNTIME DEFECT REGRESSION CHECK

Verify the lifecycle integration test now proves at least:

- placement session retained after map-entry transition;
- successful confirm;
- rejection retention;
- cancel;
- navigation-away cleanup.

Do not require another test layer if current coverage is direct and sufficient.

---

# 20. DOUBLE-CONFIRM

Review existing evidence for double-submit protection.

Expected:

- existing `runCommand` / busy guard remains authoritative;
- no duplicate placement observed at runtime;
- one confirm creates exactly one building.

Do not invent a new concurrency subsystem.

If there is hard evidence of a remaining duplicate-submit hole:

do not seal.

---

# 21. DESKTOP RUNTIME CERTIFICATION

Verify final runtime report contains successful 1440×900 evidence for:

- Buildings entry;
- no X/Y fields;
- World transition;
- placement mode;
- candidate;
- preview;
- no mutation before confirm;
- confirm;
- exactly one building;
- remains World;
- preview→final continuity;
- pan;
- zoom.

Expected:

> PASS.

---

# 22. NARROW RUNTIME CERTIFICATION

Verify final runtime report contains successful approximately 480×900 evidence.

Required:

- direct map placement usable;
- no X/Y fallback;
- placement mode visible;
- candidate selectable;
- preview visible;
- confirm reachable;
- cancel controls reachable;
- successful confirm;
- preview→final continuity.

Expected:

> PASS.

Do not require a second narrow cancel run if the approved gate did not require it.

---

# 23. CANCEL RUNTIME CERTIFICATION

Verify runtime evidence proves:

- candidate/preview existed before cancel;
- building count remained unchanged;
- candidate building was not persisted;
- session cleared;
- Buildings became active.

Expected reported count:

> 5 → 5.

---

# 24. NO-PICK FINAL DISPOSITION

Runtime report may legitimately state:

> `N/A — BELOW-ORIGIN NO-PICK NOT NATURALLY RUNTIME-REACHABLE`

This does NOT block sealing if:

- coordinate adapter tests prove negative unprojection → no-pick;
- runtime camera simply does not naturally expose the relevant logical area;
- no production behavior was altered to manufacture evidence.

Verify those conditions.

---

# 25. POSITIVE OUTSIDE-ART FINAL DISPOSITION

Runtime report claims positive candidate positions beyond the painted default-region footprint succeeded.

Verify this evidence is internally consistent.

Expected runtime positions:

- desktop `19,13`;
- narrow `23,15`.

This is important corroboration that presentation geometry did not become a gameplay cap.

---

# 26. COMMAND REJECTION FINAL DISPOSITION

Runtime report may legitimately state:

> `N/A — NO SAFE DETERMINISTIC RUNTIME REJECTION FIXTURE`

This does NOT block sealing if direct provider integration tests prove:

- command rejection retains session;
- command rejection retains candidate;
- player remains in placement mode;
- no false success clear occurs.

Verify the integration evidence exists.

Do not invent a runtime rejection scenario now.

---

# 27. GAMEPLAY FIREWALL

Verify no PDM task-owned change modifies:

- placement prerequisites;
- placement costs;
- collision;
- capacity;
- construction semantics;
- workforce;
- production;
- transport;
- research;
- finance;
- milestone rules.

Expected:

> gameplay unchanged.

Any material gameplay change blocks seal unless already explicitly authorized.

---

# 28. SAVE FIREWALL

Verify no PDM task-owned production change modifies:

- save schema;
- Position persistence semantics;
- save migration;
- serialization contract.

The evidence fixture may copy an established save.

That is evidence tooling, not save-schema change.

Expected:

> save semantics unchanged.

---

# 29. API FIREWALL

Verify:

- no new placement API;
- no changed placement request contract;
- no changed endpoint semantics;
- normal existing placement path remains authoritative.

Expected:

> API unchanged.

---

# 30. REGION FIREWALL

Verify:

- no new region selection gameplay;
- no pointer-derived region assignment;
- no new region membership rule;
- no new multi-region placement semantics.

Other-region marker behavior must not have been broadened beyond approved PDM scope.

Expected:

> region gameplay unchanged.

---

# 31. VISUAL FIREWALL

Verify PDM did not reopen:

- WFV;
- Scenario-B visual production;
- new building art;
- general World beautification.

Placement preview/chrome styling is PDM-local and allowed.

General World visual quality is not a PDM closure criterion.

---

# 32. EVIDENCE HARNESS REVIEW

Verify evidence tooling is honest and contract-relevant.

Expected capture behavior includes machine assertions for:

- absence of raw X/Y labels;
- automatic World transition;
- candidate selection;
- building count unchanged before confirm;
- candidate building absent before confirm;
- pan candidate stability;
- zoom candidate stability;
- exactly one building after confirm;
- candidate x/y == placed x/y;
- preview anchor == final anchor within bounded tolerance;
- cancel leaves building count unchanged.

Do not treat screenshots alone as the only correctness evidence.

---

# 33. FIXTURE INTEGRITY

Verify the PDM runtime fixture is deterministic and derived from established repository state.

Reported:

- builder:
  `tools/build-pdm-001-placement-evidence-fixture.mjs`
- source:
  `saves/e2e-m11-phase6-production-closeout.json`
- target:
  `tools/evidence-fixtures/pdm-001-map-placement.json`
- building:
  `sawmill`.

Verify the fixture is a legitimate copy/derivation and does not manually edit state to bypass authority.

---

# 34. EVIDENCE ARTIFACT INTEGRITY

Verify the reported evidence artifacts actually exist in the repository/worktree as expected.

At minimum reconcile:

Desktop:
- Buildings entry;
- World placement mode;
- preview;
- confirmed.

Narrow:
- Buildings entry;
- World placement mode;
- preview;
- confirmed.

Cancel:
- pre-cancel preview;
- post-cancel Buildings state.

Machine:
- runtime evidence summary JSON.

Do not regenerate them if valid.

If report references missing artifacts:

do not seal until reconciled.

---

# 35. DUPLICATE / REDUNDANT EVIDENCE ARTIFACTS

The runtime report may contain more than one cancel-preview checkpoint.

Determine whether these are legitimate artifacts or accidental redundant generated evidence.

Do not delete them in this review.

If repository policy would exclude a redundant artifact from the final commit:

state that explicitly in commit-readiness guidance.

This alone does not invalidate runtime correctness.

---

# 36. ROOT GATE VERIFICATION

Latest reported post-runtime-repair gates:

- `pnpm typecheck` — PASS
- `pnpm lint` — PASS — 0 errors / 144 warnings
- `pnpm test` — PASS — 290 files / 1096 tests
- `pnpm build:web` — PASS

Verify the report and repository state support those results.

Do NOT rerun all gates solely for ceremony if:

- no source/test changes occurred after those gates;
- current diff matches the tested state.

If source/test files changed after the recorded gate:

rerun all four root gates.

If only this closure Markdown report is created:

do not rerun root gates unless repository policy explicitly requires it.

---

# 37. POST-GATE CHANGE CHECK

Determine whether any PDM production/test file changed AFTER the successful root-gate/runtime evidence state.

This is a hard closure question.

If YES:

identify exact changes and determine whether certification is stale.

If certification is stale:

do not seal without the necessary revalidation.

If NO:

record:

> `CERTIFIED PDM SOURCE/TEST STATE UNCHANGED SINCE FINAL GATES`

---

# 38. NO NEW IMPLEMENTATION IN CLOSURE REVIEW

Expected code change:

> NONE.

Do not make opportunistic cleanup.

Do not:

- rename files;
- refactor adapters;
- simplify provider state;
- restyle placement UI;
- alter evidence harness;
- update unrelated docs.

If an obvious documentation typo in the new closure report is yours:

fix it.

Otherwise this is read/verify/report.

---

# 39. MATERIAL CONTRADICTION RULE

If actual code contradicts the reports:

actual code wins.

Do not seal based on stale documentation.

Examples of seal blockers:

- `floor` instead of `round`;
- presentation-derived upper cap;
- session cleared before World entry;
- candidate mutates gameplay before confirm;
- confirm bypasses existing command;
- rejection clears session;
- cancel places a building;
- preview/final projection differs;
- narrow flow no longer usable;
- source changed after runtime certification without revalidation.

Return exact evidence.

---

# 40. CLOSURE REPORT

Create:

`docs/architecture/reviews/POST_V1_PDM_001_FINAL_CLOSURE_SEAL.md`

This is mandatory.

Do not overwrite:

- Product / UX Contract;
- Coordinate Consistency Closeout;
- Bounded Implementation Close Candidate;
- Runtime Evidence Gate.

The new document is the formal final PDM closure record.

---

# 41. REQUIRED CLOSURE REPORT STRUCTURE

Use:

## A. Executive decision

## B. Authority chain

## C. Repository baseline

## D. Final PDM task-owned inventory

## E. Product / UX contract reconciliation

## F. Coordinate contract reconciliation

## G. Placement-session lifecycle reconciliation

## H. Runtime defect repair closure

## I. Desktop runtime evidence

## J. Narrow runtime evidence

## K. Cancel evidence

## L. No-pick / outside-art / rejection disposition

## M. Gameplay / Save / API / Region firewall

## N. Evidence integrity

## O. Root gate integrity

## P. Post-gate change check

## Q. Remaining observations

## R. Commit / push readiness

## S. Final seal

---

# 42. AUTHORITY CHAIN TABLE

Include:

| Stage | Authority / evidence | Final status |
|---|---|---|
| Product / UX Contract | ... | PASS |
| Coordinate Semantics | ... | PASS / SEALED |
| Bounded Implementation | ... | PASS |
| Lifecycle Test Delta | ... | PASS |
| Runtime Repair | ... | PASS |
| Runtime Evidence | ... | PASS |
| Final Closure Review | this report | PASS/FAIL |

Do not mark a stage PASS unless verified.

---

# 43. FINAL CONTRACT TABLE

Include:

| Contract invariant | Final evidence | Result |
|---|---|---|
| Direct map placement normal flow | ... | PASS/FAIL |
| Raw X/Y not required | ... | PASS/FAIL |
| Existing placeBuilding authority | ... | PASS/FAIL |
| Candidate selection no mutation | ... | PASS/FAIL |
| Explicit confirm required | ... | PASS/FAIL |
| Confirm exactly one placement | ... | PASS/FAIL |
| Success remains World | ... | PASS/FAIL |
| Rejection retains session/candidate | ... | PASS/FAIL |
| Cancel no mutation | ... | PASS/FAIL |
| Navigation-away clears session | ... | PASS/FAIL |
| Buildings→World retains session | ... | PASS/FAIL |
| `s = 1` | ... | PASS/FAIL |
| inverse `round` | ... | PASS/FAIL |
| negative → no-pick | ... | PASS/FAIL |
| no presentation-derived cap | ... | PASS/FAIL |
| preview/final shared projection | ... | PASS/FAIL |
| persisted Position = selected Position | ... | PASS/FAIL |
| pan stable | ... | PASS/FAIL |
| zoom stable | ... | PASS/FAIL |
| desktop runtime | ... | PASS/FAIL |
| narrow runtime | ... | PASS/FAIL |
| gameplay unchanged | ... | PASS/FAIL |
| save unchanged | ... | PASS/FAIL |
| API unchanged | ... | PASS/FAIL |
| region gameplay unchanged | ... | PASS/FAIL |

---

# 44. FINAL TASK-OWNED INVENTORY TABLE

Include:

| Path | Category | Purpose | Final commit disposition |
|---|---|---|---|

Categories:

- Production
- Test
- Evidence tooling
- Generated evidence
- Architecture/review
- Prompt

For disposition use one of:

- `INCLUDE`
- `EXCLUDE — GENERATED/TRANSIENT`
- `REVIEW BEFORE COMMIT`

Base this on actual repository policy.

Do not invent a cleanup policy.

---

# 45. RUNTIME REPAIR TABLE

Include:

| Item | Evidence |
|---|---|
| Runtime defect | Session cleared during Buildings→World transition |
| Root cause | `<verified actual cause>` |
| Production fix | `<verified actual fix>` |
| Regression test | `<exact test>` |
| Buildings→World | PASS |
| World→other screen cleanup | PASS |
| Root gates after fix | PASS |
| Runtime evidence after fix | PASS |

If actual implementation differs from the report:

record actual truth.

---

# 46. EVIDENCE SUMMARY

Include exact verified runtime facts.

Expected:

### Desktop

- viewport 1440×900;
- candidate 19,13;
- placed 19,13;
- preview anchor 23,17;
- final anchor 23,17;
- anchor delta 0,0.

### Narrow

- viewport 480×900;
- candidate 23,15;
- placed 23,15;
- preview anchor 27,19;
- final anchor 27,19;
- anchor delta 0,0.

### Cancel

- candidate 17,11;
- no persisted building;
- building count 5→5;
- returns Buildings.

Verify before reporting.

---

# 47. REMAINING OBSERVATIONS

Separate:

> closure blockers

from:

> non-blocking observations.

Expected non-blocking observations may include:

- below-origin runtime no-pick not naturally reachable;
- runtime command rejection lacks safe deterministic fixture;
- `.next` dev cache issue requiring `pnpm dev:restart`;
- overall World visual quality remains outside PDM scope.

Do not convert non-blocking observations into new workstreams inside this task.

---

# 48. COMMIT READINESS

If final seal passes, determine whether PDM task-owned changes are ready for commit/push.

Do NOT perform commit or push.

State:

- whether task-owned file inventory is sufficiently isolated;
- whether any generated/transient evidence should be excluded;
- whether unrelated WIP must remain untouched;
- whether a task-owned commit can be safely prepared.

If commit readiness is YES:

provide a recommended commit subject.

Preferred style:

`PDM-001: add direct map building placement.`

If repository convention supports a more precise subject, use it.

Do not execute it.

---

# 49. TAG POLICY

PDM-001 does NOT require a release tag.

State:

> `TAG: NOT REQUIRED`

Do not create or recommend moving `v1.0.0`.

Do not create a PDM tag unless an explicit repository policy requires one.

---

# 50. REQUIRED FACTUAL QUESTIONS

Explicitly answer:

1. What branch is under final review?
2. What exact HEAD is under review?
3. What is the HEAD subject?
4. What is `origin/master`?
5. Does HEAD equal origin/master?
6. Is PDM still local/uncommitted?
7. What unrelated WIP exists?
8. What files constitute the final PDM task-owned diff?
9. Which are production files?
10. Which are test files?
11. Which are evidence-tool files?
12. Which are generated evidence files?
13. Which are architecture/review documents?
14. Which are prompts?
15. Does repository policy require all generated evidence to be committed?
16. Are any task-owned artifacts transient/excludable?
17. Does the final normal player flow use direct map placement?
18. Are raw X/Y inputs absent from normal flow?
19. Does confirm reuse existing `placeBuilding` authority?
20. Is any new placement command present?
21. Is pointer-derived `regionId` introduced?
22. Is `s = 1` still true?
23. Is inverse quantization still `round`?
24. Does negative unprojection still produce no-pick?
25. Is any presentation-derived upper gameplay bound present?
26. Can positive coordinates beyond painted footprint remain candidates?
27. Does candidate selection mutate gameplay?
28. Is explicit confirm required?
29. Does successful confirm create exactly one building?
30. Does success remain on World?
31. Does rejection retain session?
32. Does rejection retain candidate?
33. Does cancel create any building?
34. Does cancel clear session?
35. Does cancel return Buildings?
36. Does navigation away clear session?
37. Does stale session resurrect?
38. Does Buildings→World now retain session?
39. What exact runtime defect was found?
40. What exact production fix closed it?
41. What exact regression test covers it?
42. Does World→other-screen cleanup still work after the repair?
43. Do default-region existing markers use persisted Position projection?
44. Does preview use the same projection?
45. What desktop candidate Position was certified?
46. What desktop placed Position was observed?
47. What desktop preview/final anchors were observed?
48. What narrow candidate Position was certified?
49. What narrow placed Position was observed?
50. What narrow preview/final anchors were observed?
51. Did desktop preview→final continuity pass?
52. Did narrow preview→final continuity pass?
53. Did pan stability pass?
54. Did zoom stability pass?
55. Did desktop runtime pass?
56. Did narrow runtime pass?
57. Did cancel runtime pass?
58. Is no-pick runtime N/A acceptable under the approved gate?
59. Is command rejection runtime N/A acceptable under the approved gate?
60. Did positive outside-art behavior receive runtime corroboration?
61. Were gameplay placement rules changed?
62. Was save schema/semantics changed?
63. Was API contract changed?
64. Was region gameplay changed?
65. Was Scenario-B reopened?
66. Do all referenced evidence artifacts exist?
67. Does the runtime summary JSON exist?
68. Are any evidence artifacts obviously contradictory?
69. What are the latest verified typecheck results?
70. What are the latest verified lint results?
71. What are the latest verified test totals?
72. What is the latest verified build:web result?
73. Did any PDM production/test source change after those gates?
74. If yes, was it revalidated?
75. Does any known PDM-local defect remain?
76. Does any material contract ambiguity remain?
77. Is PDM-001 formally closable?
78. Is PDM-001 formally sealable?
79. Are task-owned changes commit-ready?
80. Are task-owned changes push-ready after commit?
81. What should be excluded from the commit, if anything?
82. What commit subject is recommended?
83. Is a tag required?
84. Was any commit performed?
85. Was any push performed?
86. Was any tag performed?

---

# 51. SEAL CRITERIA

PDM-001 may be declared:

> `CLOSED / PASS / SEALED`

only if ALL are true:

- Product / UX Contract verified;
- coordinate contract verified;
- implementation reconciles with contract;
- direct map placement is normal flow;
- raw X/Y not required;
- candidate pick causes no gameplay mutation;
- explicit confirm uses existing authority;
- success creates exactly one building;
- success remains World;
- rejection lifecycle covered;
- cancel no-mutation covered;
- navigation-away cleanup covered;
- Buildings→World runtime repair verified;
- runtime repair regression-tested;
- preview/final projection shared;
- desktop runtime PASS;
- narrow runtime PASS;
- cancel runtime PASS;
- preview→final continuity PASS;
- pan PASS;
- zoom PASS;
- no presentation-derived gameplay cap;
- gameplay unchanged;
- Save unchanged;
- API unchanged;
- region gameplay unchanged;
- root gates green after final production/test change;
- no PDM source/test changes after certification without revalidation;
- evidence artifacts reconcile;
- no known PDM-local defect remains;
- no material contract ambiguity remains.

---

# 52. SEAL BLOCKERS

Do NOT seal if any of these are true:

- actual code contradicts sealed coordinate semantics;
- runtime evidence is stale relative to source;
- session repair is not actually present;
- Buildings→World still clears placement session;
- navigation-away cleanup was broken by repair;
- preview/final continuity is not authoritative;
- raw X/Y remains required;
- confirm bypasses existing placement authority;
- duplicate placement remains possible through normal single confirm;
- gameplay/save/API semantics changed without authority;
- evidence artifacts referenced by the report are materially missing;
- a known PDM-local correctness defect remains;
- a material contract ambiguity remains.

---

# 53. CLOSURE-ONLY DOCUMENT CHANGE

The expected only new change from this prompt is:

`docs/architecture/reviews/POST_V1_PDM_001_FINAL_CLOSURE_SEAL.md`

If no defect is discovered:

do not modify production/test/evidence code.

If closure review itself exposes a genuine defect:

do NOT silently repair it unless it is a trivial documentation inconsistency.

For a production/test correctness defect:

return the appropriate blocker/delta option.

The final closure reviewer should not mutate the certified implementation behind the evidence.

---

# 54. FINAL DECISION

Return exactly ONE.

## OPTION A — PDM-001 CLOSED / PASS / SEALED

Use only when every seal criterion passes.

State:

> **PDM-001 FINAL CLOSURE:**  
> `CLOSED / PASS / SEALED`

> **PRODUCT / UX CONTRACT:**  
> `PASS`

> **COORDINATE CONTRACT:**  
> `PASS / SEALED`

> **BOUNDED IMPLEMENTATION:**  
> `PASS`

> **LIFECYCLE INTEGRATION:**  
> `PASS`

> **RUNTIME REPAIR:**  
> `PASS / REGRESSION TESTED`

> **DESKTOP 1440×900:**  
> `PASS`

> **NARROW 480×900:**  
> `PASS`

> **CANCEL:**  
> `PASS / NO MUTATION`

> **PREVIEW → FINAL CONTINUITY:**  
> `PASS`

> **PAN / ZOOM:**  
> `PASS`

> **PRESENTATION-DERIVED GAMEPLAY CAP:**  
> `NONE`

> **GAMEPLAY / SAVE / API / REGION:**  
> `UNCHANGED`

> **ROOT GATES:**  
> `PASS — <exact final verified results>`

> **POST-GATE SOURCE/TEST CHANGES:**  
> `<NONE / exact revalidated changes>`

> **KNOWN PDM-LOCAL DEFECTS:**  
> `NONE`

> **MATERIAL CONTRACT AMBIGUITIES:**  
> `NONE`

> **FINAL CLOSURE REPORT:**  
> `docs/architecture/reviews/POST_V1_PDM_001_FINAL_CLOSURE_SEAL.md`

> **TASK-OWNED COMMIT READINESS:**  
> `<READY / READY AFTER EXCLUDING LISTED TRANSIENT ARTIFACTS>`

> **RECOMMENDED COMMIT SUBJECT:**  
> `<subject>`

> **PUSH READINESS AFTER TASK-OWNED COMMIT:**  
> `YES`

> **TAG:**  
> `NOT REQUIRED`

> **COMMIT / PUSH / TAG PERFORMED:**  
> `NONE`

Then STOP.

---

## OPTION B — SMALL CLOSURE DELTA REQUIRED

Use only if a bounded, concrete PDM-local issue prevents seal.

State:

> **PDM-001 FINAL CLOSURE:**  
> `NOT SEALED`

> **EXACT BLOCKER:**  
> `<blocker>`

> **AFFECTED CONTRACT INVARIANT:**  
> `<invariant>`

> **EVIDENCE:**  
> `<evidence>`

> **NEXT STEP:**  
> `SMALL PDM-001 CLOSURE DELTA`

Do not implement it in this closure review.

---

## OPTION C — CERTIFICATION STALE

Use when PDM production/test source changed after the successful final gates/runtime evidence without equivalent revalidation.

State:

> **PDM-001 FINAL CLOSURE:**  
> `NOT SEALED`

> **CERTIFICATION:**  
> `STALE`

> **POST-CERTIFICATION CHANGES:**  
> `<exact files/changes>`

> **REQUIRED REVALIDATION:**  
> `<minimal required gates/evidence>`

---

## OPTION D — MATERIAL CONTRACT / ARCHITECTURE BLOCKER

Use only if actual repository truth reveals a material contradiction requiring a new product/architecture decision.

Do not invent the decision.

---

## OPTION E — REPOSITORY / EVIDENCE INTEGRITY BLOCKER

Use only if task-owned diff/evidence cannot be reliably distinguished or required evidence is materially missing/corrupt.

Provide exact evidence.

---

# 55. DEFINITION OF DONE

This final closure review is complete only when:

- [ ] implementation guide read
- [ ] Product / UX Contract read
- [ ] Coordinate Consistency Closeout read
- [ ] Bounded Implementation Close Candidate read
- [ ] Runtime Evidence Gate read
- [ ] actual branch recorded
- [ ] exact HEAD recorded
- [ ] exact origin/master recorded
- [ ] HEAD/origin relationship recorded
- [ ] unrelated WIP protected
- [ ] complete PDM task-owned diff identified
- [ ] production files classified
- [ ] test files classified
- [ ] evidence tooling classified
- [ ] generated evidence classified
- [ ] architecture/review docs classified
- [ ] prompts classified
- [ ] final commit disposition recorded for task-owned files
- [ ] direct map placement normal flow verified
- [ ] raw X/Y normal-flow absence verified
- [ ] existing placeBuilding authority verified
- [ ] no new placement command verified
- [ ] no pointer-derived region semantics verified
- [ ] `s = 1` verified
- [ ] `round` verified
- [ ] negative → no-pick verified
- [ ] no presentation-derived upper cap verified
- [ ] pickability/gameplay-validity separation verified
- [ ] candidate pick no-mutation verified
- [ ] explicit confirm verified
- [ ] exactly-one placement verified
- [ ] success remains World verified
- [ ] rejection retention verified
- [ ] cancel no-mutation verified
- [ ] navigation-away cleanup verified
- [ ] Buildings→World session retention verified
- [ ] runtime defect root cause verified
- [ ] runtime defect fix verified
- [ ] runtime defect regression test verified
- [ ] default-region marker projection verified
- [ ] preview shared projection verified
- [ ] desktop runtime evidence verified
- [ ] narrow runtime evidence verified
- [ ] cancel runtime evidence verified
- [ ] desktop Position continuity verified
- [ ] narrow Position continuity verified
- [ ] desktop anchor continuity verified
- [ ] narrow anchor continuity verified
- [ ] pan stability verified
- [ ] zoom stability verified
- [ ] no-pick N/A disposition verified
- [ ] outside-art runtime corroboration verified
- [ ] rejection N/A disposition verified
- [ ] gameplay firewall verified
- [ ] Save firewall verified
- [ ] API firewall verified
- [ ] region firewall verified
- [ ] Scenario-B remains paused
- [ ] evidence fixture integrity verified
- [ ] evidence harness integrity verified
- [ ] required evidence artifacts exist
- [ ] runtime summary exists
- [ ] root gate results verified
- [ ] post-gate source/test change check completed
- [ ] no known PDM-local defect remains for seal
- [ ] no material contract ambiguity remains for seal
- [ ] final closure report created
- [ ] commit readiness decided
- [ ] transient/excluded artifacts identified if applicable
- [ ] recommended commit subject provided if sealed
- [ ] push readiness decided
- [ ] tag policy stated
- [ ] exactly one final option returned
- [ ] no commit performed
- [ ] no push performed
- [ ] no tag performed

---

# 56. CORE EXECUTION RULE

PDM-001 has already passed implementation and runtime certification.

Do not build it again.

Do not redesign it.

Do not beautify it.

Do not expand it.

This review asks one final question:

> Does the actual final repository state match the approved PDM-001 contract and the certified runtime evidence closely enough to close and seal the work?

Verify actual code over documentation.

Verify actual evidence over claims.

Verify the runtime repair.

Verify the repair did not break navigation-away cleanup.

Verify no source/test changes occurred after certification without revalidation.

Verify the task-owned diff can be separated from unrelated WIP.

If all evidence reconciles:

> `PDM-001 CLOSED / PASS / SEALED`

and declare the task-owned changes commit-ready.

Do NOT commit.

Do NOT push.

Do NOT tag.

If a correctness contradiction exists:

do NOT seal.

Return the smallest accurate blocker classification.

Create:

`docs/architecture/reviews/POST_V1_PDM_001_FINAL_CLOSURE_SEAL.md`

Then STOP.

# END OF PROMPT