# POST-V1 PDM-001
# Runtime Evidence Gate Completion

## MODE

TINY EVIDENCE-COMPLETION / REPORT-CLOSURE PASS.

The previous PDM-001 Runtime Evidence Gate did NOT produce the required final Markdown runtime report.

However, runtime-evidence tooling appears to have been created, including:

- `tools/capture-pdm-001-runtime-evidence.mjs`
- `tools/build-pdm-001-placement-evidence-fixture.mjs`

Do NOT restart PDM architecture work.

Do NOT redesign the evidence harness merely because the report is missing.

Your task is:

1. inspect the actual current repository state;
2. verify the evidence scripts and fixture;
3. run the runtime evidence if it has not already been successfully run;
4. inspect the actual produced evidence;
5. fix only obvious bounded evidence/PDM-local defects if required;
6. create the REQUIRED runtime evidence Markdown report;
7. return one final runtime-gate decision.

No commit.
No push.
No tag.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

---

# 1. READ FIRST

Read completely:

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/architecture/reviews/POST_V1_PDM_001_PRODUCT_UX_CONTRACT.md`
- `docs/architecture/reviews/POST_V1_PDM_001_COORDINATE_CONTRACT_CONSISTENCY_CLOSEOUT.md`
- `docs/architecture/reviews/POST_V1_PDM_001_BOUNDED_IMPLEMENTATION_CLOSE_CANDIDATE.md`
- `docs/development/Prompts/POST_V1_PDM_001_RUNTIME_EVIDENCE_GATE.md`

Inspect:

- `tools/capture-pdm-001-runtime-evidence.mjs`
- `tools/build-pdm-001-placement-evidence-fixture.mjs`
- `tools/evidence-fixtures/pdm-001-map-placement.json` if already generated;
- PDM runtime screenshots/evidence if already generated;
- actual current Git state.

The previous Runtime Evidence Gate prompt remains authoritative.

This prompt only completes its missing execution/reporting obligations.

---

# 2. BASELINE

Record:

- branch;
- exact HEAD;
- HEAD subject;
- `origin/master`;
- HEAD/origin relationship;
- working-tree status;
- PDM implementation diff;
- PDM evidence-tool diff;
- unrelated WIP.

Previously reviewed implementation baseline:

`500a00a086fa083c1bca461ccbe87b1f23f9b675`

Do not assume it is still current.

Verify Git truth.

Do not:

- clean;
- restore;
- stash;
- stage;
- commit;
- push;
- tag;
- delete unrelated WIP.

---

# 3. CURRENT GATE STATUS

Treat as already approved for runtime evidence:

> PDM-001 BOUNDED IMPLEMENTATION

Treat as CLOSED / PASS:

> PDM-001 CONFIRM / REJECTION LIFECYCLE TEST DELTA

Do not reopen:

- placement architecture;
- coordinate contract;
- `s = 1`;
- `round`;
- no-pick semantics;
- marker projection contract;
- transient placement session;
- gameplay rules;
- Save/API semantics.

Current problem:

> required Runtime Evidence Gate Markdown report is missing.

---

# 4. VERIFY EXISTING EVIDENCE TOOLING

Inspect the existing evidence scripts before changing anything.

Verify that the capture harness actually exercises the approved runtime flow.

Expected existing coverage includes:

- desktop 1440×900;
- narrow 480×900;
- desktop cancel;
- Buildings entry;
- absence of normal X/Y fields;
- `Position auf Karte wählen`;
- automatic transition to World;
- placement mode;
- candidate selection;
- preview;
- no gameplay mutation before confirm;
- pan;
- zoom;
- explicit confirm;
- exactly one new building;
- candidate Position == resulting building Position;
- preview→final anchor continuity;
- cancel with no building creation.

Do not rewrite working evidence code for stylistic reasons.

---

# 5. VERIFY FIXTURE

Inspect:

`tools/build-pdm-001-placement-evidence-fixture.mjs`

and its actual source save.

Confirm:

- source save exists;
- source save is an established deterministic repository fixture/save;
- target fixture is generated deterministically;
- fixture does not bypass placement validation;
- fixture does not alter gameplay rules;
- selected building is legitimately placeable.

Record exact source and target paths.

---

# 6. BUILD FIXTURE

If required, execute the established fixture builder.

Expected conceptual command:

> `node tools/build-pdm-001-placement-evidence-fixture.mjs`

Use the actual repository command/path.

Verify that:

`tools/evidence-fixtures/pdm-001-map-placement.json`

is produced successfully.

Do not manually edit the generated save to manufacture a PASS.

---

# 7. START ACTUAL APPLICATION

Start the application using the repository-standard runtime command.

Record:

- exact command;
- actual origin/URL;
- environment;
- relevant ports.

The evidence script must run against the actual application.

Do not fake HTTP responses except through existing application test/evidence infrastructure explicitly designed for this purpose.

---

# 8. RUN EVIDENCE CAPTURE

Run:

`tools/capture-pdm-001-runtime-evidence.mjs`

using the actual appropriate Node command/environment.

Record:

- exact command;
- exit code;
- console output;
- any errors;
- duration if readily available.

A script existing on disk is NOT evidence that it passed.

It must actually run successfully.

---

# 9. DO NOT ACCEPT SCRIPT SUCCESS BLINDLY

After successful execution:

inspect the produced evidence artifacts.

Do not conclude PASS only because:

> process exited 0.

Verify that screenshots correspond to the intended runtime states.

---

# 10. REQUIRED DESKTOP ARTIFACTS

Verify actual desktop evidence exists for approximately:

> 1440×900.

Expected artifact family includes:

- Buildings entry;
- World placement mode;
- preview;
- confirmed placement.

Check actual filenames rather than assuming them.

The screenshots must visibly support the claimed state.

---

# 11. REQUIRED NARROW ARTIFACTS

Verify actual narrow evidence exists for approximately:

> 480×900.

Expected artifact family includes:

- Buildings entry;
- World placement mode;
- preview;
- confirmed placement.

Check that:

- placement controls are reachable;
- map is usable;
- preview is visible;
- direct placement works;
- raw X/Y fallback is not required.

Do not mark narrow PASS based solely on desktop behavior.

---

# 12. REQUIRED CANCEL ARTIFACTS

Verify actual cancel evidence exists.

Expected flow:

> Buildings
> → World placement
> → candidate
> → preview
> → Abbrechen
> → Buildings

Verify the evidence harness also confirms:

- building count unchanged;
- named candidate building absent after cancel.

---

# 13. NO MUTATION BEFORE CONFIRM

Confirm from actual harness execution that:

- building count before candidate selection is recorded;
- building count after candidate selection is unchanged;
- candidate building name is absent before confirm.

This is mandatory runtime evidence.

---

# 14. CONFIRM SUCCESS

Confirm from actual execution:

- explicit `Gebäude platzieren` is used;
- placement mode exits only after success;
- URL/screen remains World;
- exactly one new building exists;
- placed building is found by its deterministic name.

Do not infer this from source alone.

Use actual execution result.

---

# 15. DOMAIN POSITION CONTINUITY

Confirm the actual runtime harness proves:

> picked candidate x/y == resulting placed building x/y.

Record the actual candidate Position used in each successful flow if readily available from execution/evidence.

At minimum certify:

- desktop;
- narrow.

---

# 16. PREVIEW → FINAL CONTINUITY

Confirm the runtime harness compares:

- preview World anchor;
- final marker World anchor.

Record:

- tolerance used;
- whether desktop passed;
- whether narrow passed.

The existing bounded tolerance may be retained if it is already justified by marker presentation geometry.

Do not loosen it merely to obtain PASS.

---

# 17. PAN

Confirm actual runtime execution includes an intentional drag/pan.

Verify:

- placement mode remains;
- candidate remains unchanged;
- no building is created due to pan.

If the existing harness only proves candidate label stability but does not directly recheck building count immediately after pan, determine whether the already-established no-mutation-before-confirm + later exactly-one placement is sufficient.

Do not add redundant instrumentation unless needed for trustworthy evidence.

---

# 18. ZOOM

Confirm actual runtime execution changes zoom while candidate exists.

Verify:

- candidate domain label remains unchanged;
- placement mode remains coherent;
- final confirm still succeeds.

Do not redesign zoom behavior.

---

# 19. NO-PICK

The original Runtime Evidence Gate allowed:

> `N/A — not safely/naturally runtime-reachable`

for below-origin no-pick when the normal camera does not expose such a point.

Determine actual runtime reachability.

If naturally reachable:

test it.

If not naturally reachable:

report:

> `N/A — BELOW-ORIGIN NO-PICK NOT NATURALLY RUNTIME-REACHABLE`

and cite the already-passed coordinate adapter test as technical contract evidence.

Do not modify camera behavior to manufacture no-pick evidence.

---

# 20. POSITIVE OUTSIDE-ART / NO CAP

Determine whether the runtime candidate positions used by the harness already establish a positive Position outside the old presentation footprint.

If yes:

record that evidence.

If not and such a point is naturally reachable:

test one.

If not naturally reachable:

report:

> `N/A — RUNTIME CAMERA/PRESENTATION DOES NOT NATURALLY EXPOSE A USEFUL OUTSIDE-ART POINT`

and rely on the existing high-coordinate adapter test.

Do not modify camera behavior solely for evidence.

---

# 21. COMMAND REJECTION

The previous lifecycle integration test already proves rejection semantics.

Attempt runtime command-rejection evidence only if a legitimate deterministic existing-authority fixture already exists.

Do not invent:

- collision;
- capacity;
- fake invalid coordinates;
- fake region rules;
- evidence-only gameplay validation.

If unavailable, report:

> `N/A — NO SAFE DETERMINISTIC RUNTIME REJECTION FIXTURE`

and cite the provider lifecycle integration test in the report.

This does NOT block runtime PASS.

---

# 22. SCREENSHOT INSPECTION

Inspect each produced screenshot.

For each artifact determine:

- viewport;
- screen;
- placement state;
- whether relevant controls are visible;
- whether preview/final state is visually coherent;
- whether anything obvious contradicts the automated assertions.

Do not perform a general visual-quality review.

PDM correctness is the scope.

---

# 23. EVIDENCE DIRECTORY

Use the repository-established evidence directory.

Expected from the current harness:

`docs/architecture/reviews/evidence/`

Verify actual output.

Do not invent a new evidence location.

---

# 24. EVIDENCE SCRIPT STATUS

The evidence scripts themselves are task-owned PDM evidence tooling.

Record whether they are:

- new;
- modified;
- already present before this completion pass.

Do not treat them as production gameplay code.

---

# 25. PRODUCTION CODE POLICY

Default:

> NO PRODUCTION CODE CHANGES.

If the evidence run passes:

do not touch production code.

If the run exposes a small obvious PDM-local defect:

fix it only if:

- bounded;
- contract-preserving;
- no stop condition triggered.

Then:

- add/update regression test;
- rerun focused tests;
- rerun all root gates;
- rerun runtime evidence;
- regenerate affected screenshots.

---

# 26. EVIDENCE-HARNESS DEFECT POLICY

If the runtime application works but the evidence harness has a small local defect:

fix the harness.

Examples:

- stale selector;
- incorrect evidence filename;
- missing wait;
- screenshot captured before stable state;
- deterministic fixture path mistake.

Do not alter production behavior to accommodate a broken evidence script.

After fixing the harness:

rerun it from start.

---

# 27. ROOT GATE POLICY

If this completion pass changes only:

- evidence scripts;
- evidence fixture;
- screenshots;
- Markdown report

and does not modify production/test source:

follow the implementation guide and determine whether root gates need rerunning.

At minimum, preserve the latest verified prior results in the report:

- `pnpm typecheck` PASS
- `pnpm lint` PASS
- `pnpm test` PASS — 290 files / 1095 tests
- `pnpm build:web` PASS

If executable evidence scripts are subject to repository lint:

run the appropriate lint/gate required by repository policy.

If any production/test source changes:

MANDATORY rerun:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build:web`

Report exact results.

---

# 28. REQUIRED MARKDOWN REPORT

You MUST create:

`docs/architecture/reviews/POST_V1_PDM_001_RUNTIME_EVIDENCE_GATE.md`

This file is mandatory.

Do not finish the task without creating it.

Do not substitute:

- console output;
- screenshots only;
- chat summary;
- evidence script;
- updated implementation report.

The exact Markdown report above must exist before returning OPTION A.

---

# 29. VERIFY REPORT EXISTS

Before final response, explicitly verify on disk that:

`docs/architecture/reviews/POST_V1_PDM_001_RUNTIME_EVIDENCE_GATE.md`

exists.

Record this verification in your final response.

If it does not exist:

the task is NOT complete.

---

# 30. REQUIRED REPORT STRUCTURE

The Markdown report must contain:

## A. Executive result

## B. Authority / reviewed inputs

## C. Baseline

## D. Runtime environment

## E. Fixture / deterministic state

## F. Evidence harness

## G. Desktop Buildings entry

## H. Desktop World transition

## I. Desktop candidate / preview

## J. No mutation before confirm

## K. Desktop confirm / success

## L. Preview → final continuity

## M. Pan stability

## N. Zoom stability

## O. Cancel

## P. No-pick

## Q. Positive outside-art / no presentation cap

## R. Command rejection

## S. Narrow 480×900

## T. Gameplay / Save / API integrity

## U. Evidence artifacts

## V. Code changes during runtime gate

## W. Tests / root gates

## X. Remaining observations

## Y. Final runtime decision

---

# 31. REQUIRED EXECUTIVE RESULT

The report must immediately state one of:

> `PASS — PDM-001 RUNTIME CERTIFIED / READY FOR FINAL CLOSURE REVIEW`

or:

> `PARTIAL — SMALL RUNTIME DELTA REQUIRED`

or:

> `BLOCKED — MATERIAL CONTRACT / ARCHITECTURE ISSUE`

or:

> `NOT CERTIFIABLE — BASELINE / ENVIRONMENT`

Do not bury the gate result.

---

# 32. REQUIRED RUNTIME TABLE

Include:

| Runtime invariant | Desktop | Narrow | Evidence | Result |
|---|---|---|---|---|
| Buildings entry visible | ... | ... | ... | PASS/FAIL |
| No raw X/Y required | ... | ... | ... | PASS/FAIL |
| Auto transition to World | ... | ... | ... | PASS/FAIL |
| Placement mode visible | ... | ... | ... | PASS/FAIL |
| Candidate selectable | ... | ... | ... | PASS/FAIL |
| Preview visible | ... | ... | ... | PASS/FAIL |
| No mutation before confirm | ... | ... | ... | PASS/FAIL |
| Explicit confirm works | ... | ... | ... | PASS/FAIL |
| Success remains World | ... | ... | ... | PASS/FAIL |
| Exactly one building created | ... | ... | ... | PASS/FAIL |
| Candidate Position = placed Position | ... | ... | ... | PASS/FAIL |
| Preview→final continuity | ... | ... | ... | PASS/FAIL |
| Pan usable | ... | ... | ... | PASS/FAIL |
| Pan does not place | ... | ... | ... | PASS/FAIL |
| Zoom coherent | ... | ... | ... | PASS/FAIL |
| Candidate semantics stable | ... | ... | ... | PASS/FAIL |
| Cancel reachable | ... | ... | ... | PASS/FAIL |
| Cancel creates no building | ... | ... | ... | PASS/FAIL |
| Session clears on cancel | ... | ... | ... | PASS/FAIL |
| No-pick semantics | ... | ... | ... | PASS/N-A/FAIL |
| Positive outside-art not capped | ... | ... | ... | PASS/N-A/FAIL |
| Command rejection lifecycle | ... | ... | ... | PASS/N-A/FAIL |

Do not mark unexecuted runtime behavior PASS.

Use allowed N/A only where authorized.

---

# 33. REQUIRED ARTIFACT MANIFEST

Include every actual runtime artifact:

| Artifact | Viewport | State | What it proves |
|---|---|---|---|

Include exact repository-relative paths.

At minimum, if produced:

Desktop:
- Buildings entry
- World placement mode
- Preview
- Confirmed

Narrow:
- Buildings entry
- World placement mode
- Preview
- Confirmed

Cancel:
- Preview before cancel
- Post-cancel Buildings state

Do not list missing artifacts as if they exist.

---

# 34. REQUIRED FIXTURE DISCLOSURE

Report:

- fixture-builder path;
- source save path;
- generated target save path;
- selected building type;
- placement names;
- candidate positions;
- whether prerequisites/cost were legitimately satisfied.

Do not hide fixture manipulation.

---

# 35. REQUIRED HARNESS DISCLOSURE

Report:

- capture script path;
- browser/runtime technology used;
- headless/headed;
- web origin;
- exact run command;
- exit result.

State clearly whether screenshots were captured by automation.

---

# 36. REQUIRED CONTINUITY EVIDENCE

For desktop and narrow successful placement, report:

- picked candidate Position;
- resulting placed building Position;
- whether exact equality passed;
- preview anchor;
- final anchor;
- tolerance;
- whether anchor comparison passed.

If the current harness does not print these values but asserts them internally:

either:

- safely instrument evidence output to record them;

or:

- report that equality/anchor assertions passed and identify the exact harness assertions.

Prefer concrete values when easily obtainable.

Do not weaken assertions.

---

# 37. REQUIRED CANCEL EVIDENCE

Report:

- building count before;
- building count after cancel;
- whether named candidate building existed after cancel;
- resulting screen.

The report must prove:

> cancel ≠ placement.

---

# 38. REQUIRED CODE-CHANGE DISCLOSURE

State separately:

### Production files changed during completion pass

### Test files changed during completion pass

### Evidence tooling changed during completion pass

### Evidence artifacts generated

### Markdown reports generated

Do not merge these categories.

---

# 39. REQUIRED FACTUAL QUESTIONS

Explicitly answer in the report:

1. What branch was tested?
2. What exact HEAD was tested?
3. What was the HEAD subject?
4. What was `origin/master`?
5. Was HEAD equal to `origin/master`?
6. Was PDM implementation still local/uncommitted?
7. What unrelated WIP existed?
8. Did the required runtime report exist before this completion pass?
9. What fixture-builder script was used?
10. What source save was used?
11. What target evidence fixture was generated?
12. Was the fixture deterministic?
13. What building type was used?
14. What desktop placement name was used?
15. What narrow placement name was used?
16. What cancel placement name was used?
17. What exact command started the web app?
18. What web origin was tested?
19. What exact command ran the capture harness?
20. Did the capture harness exit successfully?
21. Was desktop 1440×900 executed?
22. Was narrow 480×900 executed?
23. Was cancel executed?
24. Were X/Y fields absent from normal Buildings flow?
25. Did `Position auf Karte wählen` work?
26. Did it transition automatically to World?
27. Was placement mode visible?
28. Was a candidate selected on desktop?
29. Was a candidate selected on narrow?
30. Did preview appear on desktop?
31. Did preview appear on narrow?
32. Did building count remain unchanged before confirm?
33. Was the candidate building absent before confirm?
34. Did pan preserve candidate semantics?
35. Did zoom preserve candidate semantics?
36. Did pan accidentally place?
37. Did explicit confirm succeed on desktop?
38. Did explicit confirm succeed on narrow?
39. Did each confirm create exactly one building?
40. Did success remain on World?
41. What candidate Position was used on desktop?
42. What resulting building Position was observed on desktop?
43. Did they match?
44. What candidate Position was used on narrow?
45. What resulting building Position was observed on narrow?
46. Did they match?
47. Did preview/final anchor comparison pass on desktop?
48. Did preview/final anchor comparison pass on narrow?
49. What tolerance was used?
50. Was cancel tested after candidate/preview?
51. Did cancel create a building?
52. Did building count remain unchanged after cancel?
53. Did cancel return to Buildings?
54. Was below-origin no-pick naturally reachable?
55. If not, what automated test remains authoritative?
56. Was positive outside-art runtime evidence naturally reachable?
57. If not, what automated test remains authoritative?
58. Was command rejection safely reproducible?
59. If not, what provider integration test remains authoritative?
60. Were any production files changed?
61. Were any test files changed?
62. Were evidence scripts changed?
63. What screenshots were generated?
64. Were screenshots manually inspected?
65. Did any screenshot contradict automated assertions?
66. Were root gates rerun?
67. If not, what prior verified root gate results are reused?
68. If rerun, what are the exact results?
69. Were Save semantics changed?
70. Were API semantics changed?
71. Were gameplay placement rules changed?
72. Were region gameplay semantics changed?
73. Was Scenario-B reopened?
74. Does any known PDM-local defect remain?
75. Does the required Markdown runtime report now exist?
76. Is PDM-001 ready for independent final closure review?
77. Was there any commit?
78. Was there any push?
79. Was there any tag?

---

# 40. PASS CRITERIA

OPTION A requires actual successful runtime evidence for all mandatory behaviors:

- deterministic fixture generated;
- actual application running;
- capture harness actually executed;
- desktop 1440×900 executed;
- narrow 480×900 executed;
- cancel flow executed;
- no raw X/Y dependency;
- automatic World transition;
- candidate selectable;
- preview visible;
- no mutation before confirm;
- explicit confirm;
- exactly one building created;
- success remains World;
- candidate Position equals resulting building Position;
- preview→final anchor comparison passes;
- pan preserves candidate;
- zoom preserves candidate;
- cancel creates no building;
- cancel returns Buildings;
- screenshots actually generated;
- screenshots inspected;
- no screenshot contradicts assertions;
- required Markdown report created;
- report existence verified;
- no known PDM-local defect remains.

No-pick, outside-art, and command rejection may use the explicitly authorized N/A fallback.

---

# 41. FAIL CONDITIONS

Do NOT return OPTION A if:

- evidence script was not actually run;
- screenshots were not actually generated;
- screenshots were not inspected;
- desktop flow failed;
- narrow flow failed;
- cancel flow failed;
- building appears before confirm;
- candidate/result Position differs;
- preview/final anchor differs beyond existing tolerance;
- pan changes candidate semantics;
- zoom changes candidate semantics;
- confirm creates more than one building;
- success leaves World unexpectedly;
- cancel creates a building;
- narrow controls are unusable;
- required Markdown report is missing;
- a known PDM-local defect remains.

---

# 42. STOP CONDITIONS

STOP for a material blocker if runtime completion requires:

- changing coordinate contract;
- changing `s = 1`;
- changing `round`;
- new gameplay bounds;
- collision;
- capacity;
- new region rules;
- Save migration;
- API redesign;
- material World architecture redesign;
- material navigation redesign;
- new art required for correctness;
- Scenario-B reopening.

Do not implement through a stop condition.

---

# 43. FINAL DECISION

Return exactly ONE.

## OPTION A — PDM-001 RUNTIME CERTIFIED / FINAL CLOSURE REVIEW READY

Use only when all mandatory runtime evidence passes and the required Markdown report exists.

State:

> **PDM-001 RUNTIME EVIDENCE GATE:**  
> `PASS`

> **REQUIRED REPORT:**  
> `docs/architecture/reviews/POST_V1_PDM_001_RUNTIME_EVIDENCE_GATE.md — EXISTS`

> **DESKTOP 1440×900:**  
> `PASS`

> **NARROW 480×900:**  
> `PASS`

> **CANCEL:**  
> `PASS / NO MUTATION`

> **RAW X/Y NORMAL FLOW:**  
> `NOT REQUIRED`

> **CANDIDATE PICK:**  
> `NO GAMEPLAY MUTATION`

> **EXPLICIT CONFIRM:**  
> `PASS`

> **EXACTLY ONE BUILDING:**  
> `PASS`

> **CANDIDATE POSITION → PLACED POSITION:**  
> `PASS`

> **PREVIEW → FINAL CONTINUITY:**  
> `PASS`

> **PAN:**  
> `PASS`

> **ZOOM:**  
> `PASS`

> **NO-PICK:**  
> `<PASS / N-A WITH AUTOMATED CONTRACT EVIDENCE>`

> **POSITIVE OUTSIDE-ART CAP:**  
> `<PASS / N-A WITH AUTOMATED CONTRACT EVIDENCE>`

> **COMMAND REJECTION:**  
> `<PASS / N-A WITH PROVIDER INTEGRATION EVIDENCE>`

> **GAMEPLAY / SAVE / API:**  
> `UNCHANGED`

> **KNOWN PDM-LOCAL DEFECTS:**  
> `NONE`

> **PDM-001:**  
> `READY FOR INDEPENDENT FINAL CLOSURE REVIEW`

> **COMMIT / PUSH / TAG:**  
> `NONE`

Then STOP.

---

## OPTION B — RUNTIME EVIDENCE INCOMPLETE

Use when evidence tooling exists but required execution/artifacts/report cannot yet support PASS.

State exactly:

- what ran;
- what did not run;
- what artifacts exist;
- what artifacts are missing;
- whether the Markdown report exists;
- exact next bounded action.

---

## OPTION C — SMALL PDM RUNTIME DEFECT

Use when actual runtime execution exposes a bounded PDM-local defect that cannot safely be fixed in this pass.

State:

- defect;
- evidence;
- failed invariant;
- why it could not be safely fixed.

---

## OPTION D — MATERIAL CONTRACT / ARCHITECTURE BLOCKER

Use only for a genuine material contradiction.

---

## OPTION E — BASELINE / ENVIRONMENT NOT CERTIFIABLE

Use only when the application/evidence environment itself prevents trustworthy certification.

Provide hard evidence.

---

# 44. DEFINITION OF DONE

This completion pass is complete only when:

- [ ] implementation guide read
- [ ] original Runtime Evidence Gate prompt read
- [ ] Product / UX Contract read
- [ ] latest implementation close candidate read
- [ ] actual Git baseline recorded
- [ ] unrelated WIP protected
- [ ] existing evidence scripts inspected
- [ ] fixture builder inspected
- [ ] deterministic source save verified
- [ ] evidence fixture generated
- [ ] actual application started
- [ ] exact runtime command recorded
- [ ] exact web origin recorded
- [ ] capture harness actually executed
- [ ] capture exit result recorded
- [ ] desktop 1440×900 flow executed
- [ ] desktop Buildings entry artifact exists
- [ ] desktop World placement artifact exists
- [ ] desktop preview artifact exists
- [ ] desktop confirmed artifact exists
- [ ] narrow 480×900 flow executed
- [ ] narrow Buildings entry artifact exists
- [ ] narrow World placement artifact exists
- [ ] narrow preview artifact exists
- [ ] narrow confirmed artifact exists
- [ ] cancel flow executed
- [ ] cancel preview artifact exists
- [ ] cancelled-state artifact exists
- [ ] no raw X/Y dependency proven
- [ ] auto World transition proven
- [ ] candidate selection proven
- [ ] preview proven
- [ ] no mutation before confirm proven
- [ ] pan tested
- [ ] pan candidate stability proven
- [ ] zoom tested
- [ ] zoom candidate stability proven
- [ ] desktop confirm proven
- [ ] narrow confirm proven
- [ ] exactly one new building proven
- [ ] candidate/result Position equality proven
- [ ] preview/final continuity proven
- [ ] cancel no-mutation proven
- [ ] cancel return to Buildings proven
- [ ] no-pick tested OR valid N/A recorded
- [ ] positive outside-art tested OR valid N/A recorded
- [ ] command rejection tested OR valid N/A recorded
- [ ] screenshots manually inspected
- [ ] screenshot manifest written
- [ ] runtime evidence table written
- [ ] fixture disclosure written
- [ ] harness disclosure written
- [ ] code-change disclosure written
- [ ] gameplay unchanged
- [ ] Save semantics unchanged
- [ ] API semantics unchanged
- [ ] region gameplay unchanged
- [ ] Scenario-B remains paused
- [ ] root gate policy correctly applied
- [ ] `docs/architecture/reviews/POST_V1_PDM_001_RUNTIME_EVIDENCE_GATE.md` created
- [ ] exact report path verified to exist on disk
- [ ] report contains final runtime decision
- [ ] no known PDM-local defect remains for OPTION A
- [ ] exactly one final option returned
- [ ] no commit
- [ ] no push
- [ ] no tag

---

# 45. CORE EXECUTION RULE

Do not start PDM over.

The implementation exists.

The lifecycle tests passed.

The evidence tooling exists.

The missing deliverable is the completed, verified Runtime Evidence Gate.

Actually run the evidence.

Do not confuse:

> evidence script exists

with:

> runtime evidence passed.

Generate the deterministic fixture.

Run the real application.

Run the capture harness.

Inspect the resulting screenshots.

Verify desktop.

Verify narrow.

Verify cancel.

Verify no mutation before confirm.

Verify exactly one building after confirm.

Verify candidate Position equals placed Position.

Verify preview anchor equals final anchor within the existing bounded tolerance.

Verify pan and zoom preserve candidate semantics.

Use authorized N/A only for no-pick, outside-art, and command rejection when they are not safely runtime-reachable.

Do not invent gameplay just for evidence.

Do not redesign production code if the harness is the problem.

If the harness has a small defect:

fix the harness and rerun it.

If PDM has a small bounded runtime defect:

fix it, test it, rerun root gates, and recapture evidence.

Most importantly:

CREATE:

`docs/architecture/reviews/POST_V1_PDM_001_RUNTIME_EVIDENCE_GATE.md`

and verify that exact file exists before declaring PASS.

No Markdown report:

> NO OPTION A.

No actual evidence run:

> NO OPTION A.

No inspected artifacts:

> NO OPTION A.

No commit.

No push.

No tag.

Then STOP.

# END OF PROMPT