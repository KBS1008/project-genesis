# POST-V1 WORKFORCE-NAV-001
# Runtime Evidence Gate Completion

## MODE

EVIDENCE-ONLY GATE COMPLETION.

WORKFORCE-NAV-001 implementation has already passed independent code/scope review.

The remaining blocker is:

> actual Desktop + Narrow runtime certification has not yet been executed.

Do NOT redesign the implementation.

Do NOT expand scope.

Do NOT change production code or product test code unless actual runtime execution exposes a genuine task-local WORKFORCE-NAV-001 defect.

No commit.
No push.
No tag.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

---

# 1. PURPOSE

Complete the missing runtime evidence for:

> WORKFORCE-NAV-001 — Contextual Personnel Navigation

The approved runtime contract is:

> `STALLED_WORKFORCE`
> → `Personal verwalten`
> → Unternehmen
> → Operatives Dashboard
> → Personal
> → affected building workforce-assignment context focused

while preserving:

> no automatic hiring

and:

> no automatic assignment.

The implementation itself is already a close candidate.

This task exists only to prove that behavior in the actual running application.

---

# 2. READ FIRST

Read:

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/architecture/reviews/POST_V1_WORKFORCE_NAV_001_CONTEXTUAL_PERSONNEL_NAVIGATION_CLOSE_CANDIDATE.md`
- `docs/development/Prompts/POST_V1_WORKFORCE_NAV_001_CONTEXTUAL_PERSONNEL_NAVIGATION.md`
- `docs/architecture/reviews/POST_V1_WORKFORCE_GUIDANCE_001_PRODUCTION_WORKFORCE_BLOCKER_ACTIONABILITY_CLOSE_CANDIDATE.md`

Also inspect:

- `tools/capture-workforce-nav-001-runtime-evidence.mjs`
- `tools/evidence-fixtures/workforce-guidance-001-stalled-workforce.json`

Do not create a competing close-candidate report.

Update the existing WORKFORCE-NAV-001 close candidate.

---

# 3. CURRENT REVIEW STATUS

Independent review has already accepted:

- bounded architecture extension;
- structured `workforce_assignment` intent;
- affected `buildingId` context;
- transient navigation state;
- one-shot consumption;
- stale-building safety;
- no German-string parsing;
- no automatic hire;
- no automatic assignment;
- no Production auto-start;
- sealed WORKFORCE-GUIDANCE copy;
- focused tests;
- root gates.

Previously reported root gates:

- `pnpm typecheck` — PASS
- `pnpm lint` — PASS, 0 errors / 144 warnings
- `pnpm test` — PASS, 286 files / 1077 tests
- `pnpm build:web` — PASS

Do not repeat implementation analysis unnecessarily.

The only unresolved independent-review gate is runtime evidence.

---

# 4. BASELINE / WORKING TREE

Before runtime execution record:

- branch;
- exact HEAD;
- HEAD subject;
- `origin/master`;
- HEAD/origin relationship;
- working-tree status;
- task-owned WORKFORCE-NAV-001 diff;
- unrelated WIP.

Important:

WORKFORCE-NAV-001 is expected to remain UNCOMMITTED during this evidence pass.

Therefore:

> HEAD may still be the RESEARCH-METRICS-001 commit.

Do NOT require WORKFORCE-NAV-001 to appear in HEAD.

Expected implementation baseline from the close candidate:

`9864fa0454c19ed16b41999dc90b3078078c1bfa`

Verify actual current truth.

Do not reset, clean, stage, commit, or revert unrelated WIP.

---

# 5. IMPLEMENTATION SANITY CHECK

Before runtime capture, perform only a small sanity check.

Verify the task-owned implementation still contains the expected contract:

- structured `CompanyOperationsPendingNavigation`;
- `workforce_assignment`;
- affected `buildingId`;
- `Personal verwalten`;
- source condition based on `STALLED_WORKFORCE`;
- Company → operations navigation;
- Personal focus;
- affected-building context;
- one-shot clear;
- no hire/assign command from navigation.

Do not conduct another broad code review.

If these expected implementation elements are unexpectedly missing:

STOP with:

> BASELINE / EVIDENCE INTEGRITY BLOCKED

---

# 6. PRODUCTION-CODE FREEZE

This is an evidence-only pass.

Production code is FROZEN.

Do not change:

- navigation implementation;
- provider logic;
- Company screens;
- Production screens;
- view mappers;
- Workforce logic;
- domain;
- simulation;
- saves;
- API.

Exception:

If actual runtime execution exposes a genuine WORKFORCE-NAV-001 implementation defect:

STOP.

Classify:

> TASK-LOCAL IMPLEMENTATION DEFECT

Do NOT silently repair it during the evidence-only pass.

A separate bounded repair decision can then be made.

---

# 7. PRODUCT-TEST-CODE FREEZE

Existing product/unit/component tests are also FROZEN.

Do not modify tests merely to make evidence easier to capture.

Evidence tooling may receive a minimal task-local correction only if the evidence script itself is defective and product behavior is correct.

If evidence tooling changes:

- state exactly why;
- keep it evidence-only;
- do not change product semantics;
- record the diff in the report.

---

# 8. RUNTIME ENVIRONMENT

Use the repository-supported development environment.

Expected runtime approach from the existing close candidate:

- API + web development stack as required;
- `pnpm dev`;
- `PG_WEB_ORIGIN=http://127.0.0.1:3000`;
- `node tools/capture-workforce-nav-001-runtime-evidence.mjs`.

Use the repository's established evidence workflow.

Do not invent a second runtime harness if the existing script can be used.

---

# 9. PLAYWRIGHT / BROWSER SETUP

If the evidence script requires Playwright Chromium and the browser binary is missing:

use the repository-established safe browser installation approach.

Installing the expected Playwright browser binary is allowed.

Do NOT:

- upgrade Playwright;
- upgrade dependencies;
- modify package versions;
- modify lockfiles;
- add a new browser automation dependency.

If the required browser cannot be installed or launched safely:

return:

> RUNTIME ENVIRONMENT BLOCKED

with exact evidence.

Do not claim runtime PASS from tests alone.

---

# 10. EXISTING FIXTURE

Use:

`tools/evidence-fixtures/workforce-guidance-001-stalled-workforce.json`

Verify before execution that the fixture actually establishes the intended task-local state.

Required semantic state:

- a Production context exists;
- at least one affected building is identifiable;
- Production is blocked by `STALLED_WORKFORCE`;
- the affected building has no sufficient assigned workforce under existing fixture state;
- Company / Personal management is reachable.

Record the affected building identity/name used by runtime evidence.

Do not modify gameplay rules to manufacture the state.

---

# 11. PRIMARY DESKTOP RUNTIME FLOW

At approximately:

> 1440×900

execute the actual runtime flow.

Required sequence:

1. load the deterministic fixture;
2. reach the affected Production surface;
3. identify the `STALLED_WORKFORCE` state;
4. verify existing workforce guidance is visible;
5. verify `Personal verwalten` is visible;
6. record the affected building;
7. click `Personal verwalten`;
8. verify navigation reaches Unternehmen;
9. verify Operatives Dashboard is active;
10. verify Personal is the relevant focused destination;
11. verify the same affected building is represented in workforce-assignment context;
12. verify existing assignment controls are reachable;
13. verify no employee was automatically hired;
14. verify no employee was automatically assigned;
15. verify Production was not automatically started.

This must be actual browser/runtime behavior.

Source inspection is not a substitute.

---

# 12. SOURCE CTA ASSERTION

The evidence script should assert, using stable/scoped selectors where available:

- workforce blocker context exists;
- `Personal verwalten` exists;
- CTA corresponds to the expected affected building.

Do not rely on a page-wide regex if a scoped selector/data attribute is available.

Do not accidentally match unrelated Personal text elsewhere on the page.

---

# 13. DESTINATION ASSERTION

After clicking the CTA, assert actual destination state.

Required:

> Company / Unternehmen reached

and:

> Operatives Dashboard active

and:

> Personal workforce context active/visible.

Do not consider:

> Company screen opened

alone sufficient.

The contextual destination is the feature.

---

# 14. AFFECTED-BUILDING ASSERTION

This is mandatory.

The runtime must prove that the destination corresponds to the SAME building that originated the `STALLED_WORKFORCE` action.

Verify using the implementation's actual focus representation, such as:

- selected building;
- focus hint;
- assignment focus data attribute;
- highlighted matching assignment action;
- visible building name.

Prefer machine assertions plus screenshot corroboration.

Do not infer building identity from list position.

---

# 15. NO-AUTO-HIRE ASSERTION

Record employee state before CTA navigation.

After destination navigation verify:

> no employee was automatically hired.

Use deterministic observable state where possible.

Examples:

- employee count unchanged;
- no new employee row;
- no hire command side effect.

Do not perform a hire during this evidence step.

---

# 16. NO-AUTO-ASSIGN ASSERTION

Record assignment state before CTA navigation.

After destination navigation verify:

> no employee was automatically assigned to the affected building.

Use deterministic observable state where possible.

The destination may highlight/select assignment controls.

That is allowed.

Actual assignment mutation is NOT allowed.

---

# 17. NO-AUTO-PRODUCTION ASSERTION

Where observable in the fixture:

verify the navigation itself does not resolve the Production blocker or automatically start Production.

The expected state after navigation remains:

> player action required.

Do not alter simulation to prove this.

---

# 18. WORKFORCE GUIDANCE INTEGRITY

Verify the existing WORKFORCE-GUIDANCE-001 explanatory copy remains visible at the source state.

The CTA supplements the guidance.

It does not replace it.

Do not edit the guidance copy during this evidence pass.

---

# 19. DESKTOP SCREENSHOTS

Capture readable evidence around 1440×900.

Preferred paths:

`docs/architecture/reviews/evidence/WORKFORCE_NAV_001_PRODUCTION_CTA_DESKTOP_1440x900.png`

`docs/architecture/reviews/evidence/WORKFORCE_NAV_001_COMPANY_PERSONAL_FOCUS_DESKTOP_1440x900.png`

The first screenshot must establish:

- Production context;
- workforce blocker/guidance;
- `Personal verwalten`;
- affected building context where practical.

The second screenshot must establish:

- Unternehmen / Operatives context;
- Personal destination;
- affected building workforce context;
- assignment controls/focus.

Avoid screenshots cropped so tightly that source/destination context becomes ambiguous.

---

# 20. NARROW RUNTIME FLOW

Repeat the relevant runtime path around:

> 480×900

Required proof:

1. source workforce blocker is usable;
2. `Personal verwalten` is reachable/readable;
3. CTA can be activated;
4. destination reaches Company / Operations / Personal;
5. affected building context remains understandable;
6. relevant assignment controls remain usable/reachable;
7. no automatic hire;
8. no automatic assignment.

This is a usability certification, not a responsive redesign.

---

# 21. NARROW SCREENSHOTS

Capture narrow evidence using repository naming conventions.

Preferred paths:

`docs/architecture/reviews/evidence/WORKFORCE_NAV_001_PRODUCTION_CTA_NARROW_480x900.png`

`docs/architecture/reviews/evidence/WORKFORCE_NAV_001_COMPANY_PERSONAL_FOCUS_NARROW_480x900.png`

If the existing evidence script uses an equivalent deterministic filename convention, retain it and document exact paths.

---

# 22. NARROW-SCOPE FIREWALL

Do NOT fix unrelated narrow-layout defects.

If an unrelated shell/responsive issue is visible but does not prevent WORKFORCE-NAV-001:

record it only if materially relevant.

If an existing unrelated responsive defect makes the task impossible to certify:

STOP with exact evidence.

Do not broaden this slice into responsive cleanup.

---

# 23. ONE-SHOT RUNTIME PROOF

If inexpensive and deterministic in the existing script:

after successful contextual navigation:

1. navigate away;
2. return normally to Company / Personal;
3. verify the previous workforce intent does not forcibly reapply.

If this is cumbersome to demonstrate reliably in runtime:

the existing focused automated test evidence is sufficient for one-shot consumption.

Do NOT block runtime completion solely because this particular behavior is not visually recaptured, provided the existing focused test remains PASS.

State which proof was used.

---

# 24. MACHINE ASSERTIONS

Prefer the evidence script to fail non-zero when any required owned behavior fails.

At minimum assert:

- source CTA found;
- source affected building identified;
- destination reached;
- Personal context reached;
- affected building matches source;
- no auto-hire;
- no auto-assign.

If practical also assert:

- blocker remains unresolved immediately after navigation;
- one-shot state does not reapply.

Do not report PASS from screenshots alone when machine-readable assertions are available.

---

# 25. EVIDENCE SCRIPT CHANGES

The existing script is:

`tools/capture-workforce-nav-001-runtime-evidence.mjs`

Prefer running it unchanged.

If it cannot correctly exercise the already-implemented feature due to an evidence-tool defect:

a minimal evidence-only correction is allowed.

Examples:

- wrong selector;
- incorrect URL;
- fixture-loading bug;
- screenshot timing issue;
- assertion accidentally targeting an unrelated element.

Not allowed:

- modifying product code to satisfy the script;
- weakening assertions so a defect passes;
- replacing real runtime assertions with source inspection.

Document every evidence-script change.

---

# 26. FAILURE CLASSIFICATION

If runtime behavior differs from the approved contract, classify the failure before touching code.

Examples:

## TASK-LOCAL IMPLEMENTATION DEFECT

Use if:

- CTA absent despite `STALLED_WORKFORCE`;
- CTA opens wrong destination;
- Personal not reached;
- wrong building focused;
- intent remains stale;
- auto-hire occurs;
- auto-assign occurs;
- navigation mutates gameplay;
- narrow UI makes the owned CTA/destination unusable due to task-owned implementation.

STOP.

Do not fix during this evidence-only task.

## EVIDENCE TOOL DEFECT

Use only when:

- product behavior is correct;
- evidence harness/selectors/fixture-loading are wrong.

Minimal evidence-only repair allowed.

## RUNTIME ENVIRONMENT BLOCKED

Use when:

- required dev stack cannot run;
- browser binary cannot be installed/launched;
- environment prevents real execution.

Do not substitute tests.

---

# 27. PRODUCT-CODE DIFF CHECK

After runtime evidence, verify:

> no production-code changes occurred during this evidence completion.

Record result.

If production code changed:

STOP unless the change was already present before this evidence task.

Do not hide implementation changes inside evidence completion.

---

# 28. PRODUCT-TEST DIFF CHECK

Verify:

> no product/unit/component test changes occurred during evidence completion.

Evidence tooling and screenshots/report updates are separate.

Record result.

---

# 29. ROOT GATE POLICY

If:

- no production code changed;
- no product test code changed;
- only runtime evidence/tooling/report artifacts changed;

then do NOT rerun the entire root gate suite merely for ceremony.

Reference the already-established close-candidate root PASS:

- typecheck PASS;
- lint PASS — 0 errors / 144 warnings;
- test PASS — 286 files / 1077 tests;
- build:web PASS.

If production or product-test code changes for any reason:

the evidence-only contract has been violated.

STOP and classify appropriately.

Do not silently rerun gates and continue as though this were still evidence-only.

---

# 30. SEALED-WORK INTEGRITY

Verify no changes to:

- WORKFORCE-GUIDANCE-001 copy/semantics;
- RESEARCH-METRICS-001;
- RESEARCH-STATUS-001;
- TRANSPORT-STATUS-001;
- TIME-UX;
- PGD family;
- Tutorial;
- PDM;
- visual tracks.

Scenario-B remains PAUSED.

---

# 31. UPDATE EXISTING CLOSE-CANDIDATE REPORT

Update:

`docs/architecture/reviews/POST_V1_WORKFORCE_NAV_001_CONTEXTUAL_PERSONNEL_NAVIGATION_CLOSE_CANDIDATE.md`

Do NOT create another competing close-candidate report.

Replace stale statements such as:

> runtime capture not executed

or:

> run capture script before merge

with actual evidence results.

Update at minimum:

- Executive result;
- Desktop runtime evidence;
- Narrow runtime evidence;
- no-auto-hire evidence;
- no-auto-assign evidence;
- affected-building cross-navigation proof;
- screenshot paths;
- evidence-script command/result;
- final decision;
- relevant factual-question answers.

Do not rewrite already-correct implementation sections unnecessarily.

---

# 32. REQUIRED RUNTIME EVIDENCE TABLE

Add/update a concise table equivalent to:

| Check | Desktop 1440×900 | Narrow 480×900 |
|---|---|---|
| `STALLED_WORKFORCE` source | PASS/FAIL | PASS/FAIL |
| Workforce guidance visible | PASS/FAIL | PASS/FAIL |
| `Personal verwalten` visible/reachable | PASS/FAIL | PASS/FAIL |
| Company reached | PASS/FAIL | PASS/FAIL |
| Operatives Dashboard reached | PASS/FAIL | PASS/FAIL |
| Personal context reached | PASS/FAIL | PASS/FAIL |
| Source building = focused building | PASS/FAIL | PASS/FAIL |
| Assignment controls reachable | PASS/FAIL | PASS/FAIL |
| Auto-hire | NONE/FAIL | NONE/FAIL |
| Auto-assign | NONE/FAIL | NONE/FAIL |

Use actual results only.

Do not prefill PASS before execution.

---

# 33. REQUIRED FACTUAL QUESTIONS

Explicitly answer:

1. What branch was used?
2. What exact HEAD was present during runtime capture?
3. What was the HEAD subject?
4. What was `origin/master`?
5. Did HEAD equal origin/master?
6. Was WORKFORCE-NAV still uncommitted?
7. What task-owned implementation diff existed?
8. What unrelated WIP existed?
9. Did the expected structured workforce navigation implementation still exist?
10. Was `workforce_assignment` present?
11. Was affected `buildingId` present?
12. Was `Personal verwalten` present in implementation?
13. Was source state still based on `STALLED_WORKFORCE`?
14. Was any German-string parsing found?
15. What exact fixture was used?
16. What affected building did the fixture establish?
17. Was the runtime dev stack actually started?
18. What exact evidence command was executed?
19. Was Playwright Chromium available?
20. If installed, what safe command was used?
21. Was the desktop flow actually executed?
22. Was `STALLED_WORKFORCE` observed/asserted?
23. Was workforce guidance observed?
24. Was `Personal verwalten` observed?
25. Was the source building identified?
26. Was the CTA actually clicked?
27. Did Unternehmen open?
28. Did Operatives Dashboard become active?
29. Was Personal context reached?
30. Was the same affected building focused?
31. How was affected-building identity asserted?
32. Were assignment controls reachable?
33. Was employee state recorded before navigation?
34. Was employee state unchanged after navigation?
35. Was any employee automatically hired?
36. Was assignment state recorded before navigation?
37. Was assignment state unchanged after navigation?
38. Was any employee automatically assigned?
39. Was Production automatically started?
40. Did navigation itself mutate gameplay?
41. What desktop screenshots were captured?
42. Did desktop runtime certification pass?
43. Was the narrow flow actually executed?
44. Was the narrow CTA readable/reachable?
45. Could the narrow CTA be activated?
46. Did narrow navigation reach Company?
47. Did narrow navigation reach Operations?
48. Did narrow navigation reach Personal context?
49. Was the correct building context preserved on narrow?
50. Were assignment controls reachable on narrow?
51. Was there any auto-hire on narrow?
52. Was there any auto-assign on narrow?
53. What narrow screenshots were captured?
54. Did narrow runtime certification pass?
55. Was one-shot behavior runtime-tested?
56. If not, what existing focused test proves it?
57. Did the evidence script use machine assertions?
58. Did it fail on owned behavior mismatch?
59. Was the evidence script changed?
60. If yes, why exactly?
61. Were evidence-script changes evidence-only?
62. Was production code changed during evidence completion?
63. Was product test code changed during evidence completion?
64. Were save/API/domain files changed?
65. Was Workforce Guidance changed?
66. Was Research changed?
67. Was Transport changed?
68. Was Time-UX changed?
69. Was PGD changed?
70. Was Tutorial changed?
71. Was PDM changed?
72. Was art changed?
73. Does Scenario-B remain paused?
74. Are prior root gates still applicable?
75. What were those root gate results?
76. Was the existing close-candidate report updated?
77. Were stale “runtime not executed” claims removed?
78. Does the report now contain actual Desktop evidence?
79. Does the report now contain actual Narrow evidence?
80. Does the report contain affected-building cross-navigation proof?
81. Does the report contain no-auto-hire proof?
82. Does the report contain no-auto-assign proof?
83. Is WORKFORCE-NAV-001 now ready for independent final closure?
84. Was there any commit?
85. Was there any push?
86. Was there any tag?

---

# 34. STOP CONDITIONS

STOP immediately if:

- actual runtime exposes a task-local implementation defect;
- CTA is missing under the intended fixture;
- CTA is driven by the wrong state;
- CTA reaches only Company but not the required Personal context;
- wrong building is focused;
- affected building cannot be established deterministically;
- navigation automatically hires;
- navigation automatically assigns;
- navigation automatically starts Production;
- navigation causes another gameplay mutation;
- owned narrow behavior is unusable;
- fixture does not establish the intended state and correcting it would require gameplay/product changes;
- runtime environment cannot execute the application;
- required browser cannot be made available safely;
- evidence capture would require dependency/package/lockfile changes;
- production code would need modification;
- product tests would need modification;
- save/API/domain changes become necessary;
- sealed work would need reopening;
- unrelated WIP prevents trustworthy evidence.

Do not convert an evidence-only task into an implementation repair.

---

# 35. FINAL DECISION

Return exactly ONE.

## OPTION A — RUNTIME EVIDENCE COMPLETE / CLOSE CANDIDATE PASS

Use only when actual runtime execution proves:

- Desktop source state PASS;
- Desktop CTA PASS;
- Desktop destination PASS;
- Desktop affected-building focus PASS;
- Desktop no-auto-hire PASS;
- Desktop no-auto-assign PASS;
- Narrow source/CTA PASS;
- Narrow destination PASS;
- Narrow affected-building context PASS;
- Narrow no-auto-hire PASS;
- Narrow no-auto-assign PASS;
- machine assertions PASS;
- screenshots captured;
- no production-code changes during evidence completion;
- no product-test changes during evidence completion;
- existing close-candidate report updated;
- stale runtime-not-executed language removed.

State:

> **WORKFORCE-NAV-001:**  
> `RUNTIME EVIDENCE COMPLETE / CLOSE CANDIDATE PASS`

> **DESKTOP 1440×900:**  
> `PASS`

> **NARROW 480×900:**  
> `PASS`

> **SOURCE:**  
> `STALLED_WORKFORCE`

> **ACTION:**  
> `Personal verwalten`

> **DESTINATION:**  
> `Unternehmen → Operatives Dashboard → Personal`

> **SOURCE BUILDING = FOCUSED BUILDING:**  
> `PASS`

> **AUTO-HIRE:**  
> `NONE`

> **AUTO-ASSIGN:**  
> `NONE`

> **GAMEPLAY MUTATION FROM NAVIGATION:**  
> `NONE`

> **PRODUCT CODE CHANGED DURING EVIDENCE PASS:**  
> `NO`

> **PRODUCT TEST CODE CHANGED DURING EVIDENCE PASS:**  
> `NO`

> **ROOT GATES:**  
> `PRIOR PASS REMAINS APPLICABLE`

> **REPORT UPDATED:**  
> `YES`

> **COMMIT / PUSH / TAG:**  
> `NONE`

> **READY FOR INDEPENDENT FINAL CLOSURE:**  
> `YES`

---

## OPTION B — RUNTIME ENVIRONMENT BLOCKED

Use when actual runtime cannot be executed for environmental reasons.

State:

- exact environment blocker;
- exact attempted command;
- whether browser installation was attempted;
- whether product behavior remains unverified.

Do NOT claim runtime PASS.

---

## OPTION C — TASK-LOCAL IMPLEMENTATION DEFECT

Use when real runtime reveals an owned implementation defect.

State:

- exact failing runtime step;
- expected behavior;
- actual behavior;
- screenshot/assertion evidence;
- likely owned code boundary if determinable without repair.

Do NOT fix it in this pass.

---

## OPTION D — BASELINE / EVIDENCE INTEGRITY BLOCKED

Use when:

- task-owned implementation cannot be distinguished from unrelated WIP;
- expected implementation disappeared;
- fixture/evidence integrity cannot be trusted;
- baseline changed unexpectedly.

State exact evidence.

---

# 36. DEFINITION OF DONE

This evidence gate is complete only when:

- [ ] implementation guide read
- [ ] WORKFORCE-NAV close candidate read
- [ ] WORKFORCE-NAV implementation prompt read
- [ ] WORKFORCE-GUIDANCE close candidate read
- [ ] evidence script inspected
- [ ] fixture inspected
- [ ] branch recorded
- [ ] exact HEAD recorded
- [ ] HEAD subject recorded
- [ ] origin/master recorded
- [ ] HEAD/origin relationship verified
- [ ] task-owned diff classified
- [ ] unrelated WIP classified
- [ ] expected structured implementation sanity-checked
- [ ] production code frozen
- [ ] product test code frozen
- [ ] repository-supported runtime started
- [ ] actual evidence command executed
- [ ] Playwright/browser availability established
- [ ] deterministic fixture loaded
- [ ] affected building identified
- [ ] Desktop runtime actually executed
- [ ] Desktop `STALLED_WORKFORCE` verified
- [ ] Desktop workforce guidance verified
- [ ] Desktop `Personal verwalten` verified
- [ ] Desktop CTA clicked
- [ ] Desktop Company destination verified
- [ ] Desktop Operatives Dashboard verified
- [ ] Desktop Personal context verified
- [ ] Desktop source building = focused building verified
- [ ] Desktop assignment controls reachable
- [ ] Desktop no-auto-hire verified
- [ ] Desktop no-auto-assign verified
- [ ] Desktop no-auto-production verified where observable
- [ ] Desktop source screenshot captured
- [ ] Desktop destination screenshot captured
- [ ] Narrow runtime actually executed
- [ ] Narrow CTA reachable/readable
- [ ] Narrow CTA activated
- [ ] Narrow Company destination verified
- [ ] Narrow Operations destination verified
- [ ] Narrow Personal context verified
- [ ] Narrow source building = focused building verified
- [ ] Narrow assignment controls reachable
- [ ] Narrow no-auto-hire verified
- [ ] Narrow no-auto-assign verified
- [ ] Narrow source screenshot captured
- [ ] Narrow destination screenshot captured
- [ ] machine assertions PASS
- [ ] evidence script fails on owned mismatch
- [ ] one-shot runtime proof captured OR existing focused test referenced
- [ ] no production-code changes during evidence completion
- [ ] no product-test-code changes during evidence completion
- [ ] no save/API/domain changes
- [ ] Workforce Guidance unchanged
- [ ] Research unchanged
- [ ] Transport unchanged
- [ ] Time-UX unchanged
- [ ] PGD unchanged
- [ ] Tutorial unchanged
- [ ] PDM unchanged
- [ ] no art changes
- [ ] Scenario-B remains paused
- [ ] prior root-gate PASS verified applicable
- [ ] existing close-candidate report updated
- [ ] stale runtime-not-executed language removed
- [ ] actual Desktop evidence recorded
- [ ] actual Narrow evidence recorded
- [ ] screenshot paths recorded
- [ ] no-auto-action evidence recorded
- [ ] exactly one final option returned
- [ ] no commit
- [ ] no push
- [ ] no tag

---

# 37. CORE EXECUTION RULE

Do not implement WORKFORCE-NAV-001 again.

It already has a bounded implementation candidate.

The missing proof is actual runtime behavior.

Run the real application.

Load the deterministic workforce-stall fixture.

Prove:

> `STALLED_WORKFORCE`

shows:

> `Personal verwalten`

Then actually click it.

Prove the running game reaches:

> Unternehmen → Operatives Dashboard → Personal

and prove:

> the affected source building is the building brought into workforce-assignment focus.

Prove this on:

> Desktop 1440×900

and:

> Narrow 480×900.

Also prove that navigation performs:

> no automatic hire

and:

> no automatic assignment.

Use machine assertions where possible.

Capture readable screenshots.

Do not replace runtime proof with source inspection.

Do not replace runtime proof with unit tests.

Do not change production code.

Do not change product tests.

If the implementation fails:

STOP and report the defect.

If the environment fails:

STOP and report the environment blocker.

If actual Desktop and Narrow runtime both pass:

update the existing close candidate with the real evidence and return one close candidate.

No commit.

No push.

No tag.

Then STOP.

# END OF PROMPT