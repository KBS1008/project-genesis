# POST-V1 PDM-001
# Confirm / Rejection Lifecycle Test Delta

## MODE

TINY TEST-CLOSURE DELTA.

PDM-001 production implementation is already a close candidate.

This task exists ONLY to close the missing direct integration proof around:

> placement session
> → candidate
> → explicit confirm
> → existing placeBuilding command
> → success / rejection lifecycle.

This is NOT:

- a PDM redesign;
- a coordinate redesign;
- a placement-session redesign;
- a World redesign;
- a gameplay change;
- a production-code refactor;
- runtime certification.

Default expectation:

> ADD FOCUSED TEST COVERAGE ONLY.

Production code may change ONLY if the new tests expose a genuine PDM-local defect.

No speculative cleanup.

No commit.
No push.
No tag.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

Return one close candidate.

---

# 1. READ FIRST

Read:

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/architecture/reviews/POST_V1_PDM_001_PRODUCT_UX_CONTRACT.md`
- `docs/architecture/reviews/POST_V1_PDM_001_COORDINATE_CONTRACT_CONSISTENCY_CLOSEOUT.md`
- `docs/architecture/reviews/POST_V1_PDM_001_BOUNDED_IMPLEMENTATION_CLOSE_CANDIDATE.md`

Also inspect the actual current implementation of:

- `GameWorkspaceProvider.tsx`
- `building-map-placement-session.ts`
- `BuildingsScreen.tsx`
- `WorldScreen.tsx`
- existing workspace/provider test infrastructure
- `game-workspace-mock.ts`
- existing `runCommand` test patterns
- existing `placeBuilding` mocks/spies

Do not perform broad architecture discovery.

---

# 2. BASELINE

Record:

- branch;
- exact HEAD;
- HEAD subject;
- `origin/master`;
- HEAD/origin relationship;
- working-tree status;
- existing PDM task-owned diff;
- unrelated WIP.

Expected implementation baseline in the current close candidate:

`500a00a086fa083c1bca461ccbe87b1f23f9b675`

But verify actual Git truth.

The PDM implementation is currently local/uncommitted.

Do not:

- clean;
- restore;
- stage;
- commit;
- push;
- move;
- delete

existing PDM work or unrelated WIP.

---

# 3. CURRENT GATE STATUS

Treat the existing PDM bounded implementation as:

> `CLOSE CANDIDATE / SMALL TEST DELTA REQUIRED`

The following implementation areas are NOT being reopened:

- Buildings → map-placement entry;
- raw X/Y removal from normal flow;
- transient placement session;
- World placement mode;
- coordinate adapter;
- stable anchor O;
- `s = 1`;
- `round`;
- negative unprojection → no-pick;
- no presentation-derived gameplay cap;
- camera conversion;
- pan/zoom behavior;
- preview;
- existing marker domain projection;
- preview→final projection contract;
- cancel UX;
- Save/API firewall;
- gameplay firewall.

Do not reimplement these unless a focused lifecycle test exposes a real defect.

---

# 4. EXACT GAP TO CLOSE

The current close-candidate report states that:

> provider-level confirm/rejection integration is not isolated in a dedicated test.

This is the only reason for this delta.

Directly prove the lifecycle boundary where transient placement becomes real gameplay mutation.

The required contract is:

> pick / repick = no placement mutation

> explicit confirm = exactly one existing placeBuilding invocation

> success = session cleared, World retained

> rejection = session/candidate retained, no false success

> cancel = no placement mutation, session cleared

> navigation away = no placement mutation, stale session cleared

---

# 5. TEST AT THE CORRECT BOUNDARY

Prefer testing through the smallest existing integration boundary that directly exercises:

- `GameWorkspaceProvider`;
- placement-session state;
- `runCommand`;
- `placeBuilding`;
- navigation state.

Do NOT test only a pure helper if that bypasses the behavior being certified.

Do NOT require full browser/E2E infrastructure.

Use existing React/provider/component test conventions.

A small provider harness is acceptable if consistent with repository test patterns.

Do not create a new general testing framework.

---

# 6. STRUCTURED TEST CONTROL

Tests should manipulate placement state through the real public/context actions where practical.

Prefer:

> start placement
> → set candidate
> → confirm/cancel/navigation action

over:

> manually mutating internal React state.

The test should prove integration behavior, not reproduce implementation logic inside the test.

---

# 7. REQUIRED TEST A — PICK / REPICK DOES NOT MUTATE GAMEPLAY

Prove:

1. start a valid placement session;
2. set candidate P1;
3. verify `placeBuilding` has been called:

> `0`

4. replace candidate with P2;
5. verify `placeBuilding` remains:

> `0`

No placement mutation before explicit confirm.

This test may be combined with another lifecycle test if the assertions remain explicit.

---

# 8. REQUIRED TEST B — CONFIRM CALLS EXISTING PATH EXACTLY ONCE

Given:

- valid placement session;
- known `buildingTypeId`;
- known building name;
- candidate Position `{ x, y }`;
- existing placeability state permitting confirm;

when explicit confirm executes:

prove:

> `placeBuilding` called exactly once.

Also prove the payload contains the exact session/candidate values:

- `buildingTypeId`;
- name;
- x;
- y.

Do not merely assert:

> called.

Assert the exact relevant payload.

---

# 9. REGION SEMANTICS IN CONFIRM TEST

The confirm test must also ensure PDM did not silently invent pointer-derived region semantics.

If the current approved command call omits `regionId`:

assert the actual call shape accordingly.

Do not add region behavior just for the test.

---

# 10. REQUIRED TEST C — SUCCESS LIFECYCLE

Configure the existing placement command mock to succeed.

Then prove:

1. active placement session exists before confirm;
2. candidate exists before confirm;
3. explicit confirm invokes existing placement path;
4. command succeeds;
5. placement session is cleared;
6. candidate is therefore cleared with the session;
7. active screen remains:

> World

8. no automatic navigation back to Buildings occurs.

This must exercise the real success path rather than manually clearing session state.

---

# 11. REQUIRED TEST D — REJECTION LIFECYCLE

Configure the existing `placeBuilding` / command path to reject deterministically.

Use the existing error/mocking conventions.

Do NOT invent a new gameplay validation rule.

Then prove:

1. placement session exists before confirm;
2. candidate exists;
3. confirm invokes `placeBuilding` exactly once;
4. command rejects;
5. placement session still exists;
6. same candidate remains available;
7. player remains on World / in placement mode;
8. no false success lifecycle occurs;
9. no success-driven session clear occurs.

If existing global error presentation can be asserted cheaply through established patterns, assert it.

But the mandatory proof is:

> rejection preserves placement state and does not masquerade as success.

---

# 12. REJECTION MUST NOT BECOME NO-PICK

The rejection test must preserve the distinction:

> command rejection

is NOT:

> map no-pick.

After rejection, the valid candidate should not disappear merely because the authoritative command rejected.

Do not change coordinate semantics.

---

# 13. REQUIRED TEST E — CANCEL IS MUTATION-FREE

Given:

- active placement session;
- candidate selected;

when cancel executes:

prove:

- `placeBuilding` called `0` times;
- session cleared;
- candidate cleared;
- approved destination is Buildings.

Exercise the actual cancel action.

---

# 14. REQUIRED TEST F — NAVIGATION AWAY CLEARS WITHOUT PLACEMENT

Given:

- active placement session;
- candidate selected;

when ordinary navigation leaves World:

prove:

- `placeBuilding` called `0` times;
- placement session clears;
- returning to World does not resurrect the old candidate/session.

Use the current navigation architecture.

Do not create a second routing mechanism.

---

# 15. OPTIONAL DOUBLE-CONFIRM TEST

Inspect the actual current `isBusy` / `runCommand` behavior.

If a deterministic focused test is straightforward:

prove rapid/repeated confirm cannot create two placement calls while the first command is active.

If existing architecture already makes this fully covered by an authoritative shared `runCommand` test and reproducing it here would only duplicate infrastructure:

cite the existing test/evidence in the report.

Do NOT redesign command concurrency in this delta.

If a real PDM-local double-submit defect is discovered:

fix it.

---

# 16. TEST ASSERTION QUALITY

Do not write tests that pass merely because mocks are too shallow.

The tests must observe the real PDM lifecycle boundary.

At minimum, the suite must directly prove:

| Action | placeBuilding | Session after action |
|---|---:|---|
| Pick P1 | 0 | retained |
| Repick P2 | 0 | retained |
| Confirm success | 1 | cleared |
| Confirm rejection | 1 | retained |
| Cancel | 0 | cleared |
| Navigate away | 0 | cleared |

For rejection:

candidate must remain.

For success:

World must remain active.

For cancel:

approved Buildings destination must be observed.

---

# 17. DO NOT REOPEN COORDINATE TESTS

The existing coordinate tests already cover the approved coordinate contract.

Do not rewrite them unless a genuine regression is discovered.

Keep frozen:

- anchor O;
- `s = 1`;
- `round`;
- negative → no-pick;
- no presentation-derived upper bound;
- shared projection.

This delta is about lifecycle proof.

---

# 18. DO NOT REOPEN MARKER PROJECTION

Existing PDM implementation reports:

> default-region building markers use shared domain projection.

Do not modify marker projection unless lifecycle testing reveals an actual connected defect.

No visual redesign.

---

# 19. PRODUCTION-CODE CHANGE POLICY

Expected production-code changes:

> NONE.

If all required tests pass against current implementation:

do not touch production code.

If a required test fails because the current implementation violates the approved PDM contract:

fix the smallest PDM-local production defect.

Then:

- identify the defect;
- identify the exact production change;
- add regression coverage;
- rerun all required gates.

Do not conceal the production change as “test-only.”

---

# 20. NO TEST-ONLY PRODUCT BEHAVIOR

Do not modify production behavior solely to make a brittle test easier.

Tests must adapt to legitimate current architecture.

Production changes require a real contract defect.

---

# 21. GAMEPLAY FIREWALL

Do not change:

- placement prerequisites;
- building costs;
- collision;
- placement capacity;
- construction;
- workforce;
- production;
- transport;
- research;
- finance;
- milestones;
- region gameplay rules.

No new gameplay rule.

---

# 22. SAVE / API FIREWALL

Do not change:

- save schema;
- Position persistence;
- API request schema;
- placement endpoint;
- API semantics;
- region persistence.

If lifecycle proof unexpectedly requires such a change:

STOP.

---

# 23. VISUAL FIREWALL

Do not change:

- building art;
- map art;
- placement preview visuals;
- world scenic presentation;
- layout

unless a tiny testability hook is absolutely necessary and architecture-consistent.

Prefer no visual changes.

Scenario-B remains PAUSED.

---

# 24. TESTABILITY HOOKS

Avoid production test IDs/hooks unless existing repository conventions require them.

Prefer testing:

- context actions;
- semantic controls;
- existing mocks;
- provider harness.

Do not add public production APIs solely for tests when a smaller test harness can exercise the existing context.

---

# 25. FOCUSED TEST COMMANDS

Run the smallest relevant test set first.

Include all new/modified lifecycle tests plus directly affected existing PDM tests.

Report exact commands and exact counts.

Do not stop at focused tests.

---

# 26. ROOT GATES

After focused tests pass, run:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build:web`

Report exact outcomes.

For lint report:

- errors;
- warnings.

Current prior close-candidate baseline was:

- typecheck PASS;
- lint PASS;
- tests PASS — 289 files / 1090 tests;
- build:web PASS.

Do not assume these numbers remain unchanged.

Record the new actual totals.

---

# 27. ROOT FAILURE HANDLING

If a root gate fails:

determine whether the delta caused it.

If task-owned:

fix it.

If clearly unrelated/pre-existing:

provide hard evidence.

Do not use an unproven baseline-debt claim.

---

# 28. UPDATE CLOSE-CANDIDATE REPORT

Update:

`docs/architecture/reviews/POST_V1_PDM_001_BOUNDED_IMPLEMENTATION_CLOSE_CANDIDATE.md`

Do not create a second large implementation report.

Add a concise section such as:

> `Confirm / Rejection Lifecycle Test Delta`

and update:

- focused tests;
- root gate totals;
- remaining issues;
- final close-candidate decision.

Remove the previous lifecycle-test gap from Remaining Issues if closed.

Do not erase historical truth; clearly state that the gap was closed by this delta.

---

# 29. REQUIRED DELTA EVIDENCE TABLE

Include:

| Lifecycle invariant | Test / evidence | Result |
|---|---|---|
| Pick does not place | ... | PASS/FAIL |
| Repick does not place | ... | PASS/FAIL |
| Confirm calls placeBuilding once | ... | PASS/FAIL |
| Confirm uses exact candidate x/y | ... | PASS/FAIL |
| Confirm preserves building type/name | ... | PASS/FAIL |
| Region semantics unchanged | ... | PASS/FAIL |
| Success clears session | ... | PASS/FAIL |
| Success remains on World | ... | PASS/FAIL |
| Rejection retains session | ... | PASS/FAIL |
| Rejection retains candidate | ... | PASS/FAIL |
| Rejection remains World/placement mode | ... | PASS/FAIL |
| Rejection not converted to no-pick | ... | PASS/FAIL |
| Cancel does not place | ... | PASS/FAIL |
| Cancel clears session | ... | PASS/FAIL |
| Cancel returns Buildings | ... | PASS/FAIL |
| Navigation away does not place | ... | PASS/FAIL |
| Navigation away clears session | ... | PASS/FAIL |
| Stale session does not resurrect | ... | PASS/FAIL |

---

# 30. REQUIRED FACTUAL QUESTIONS

Explicitly answer:

1. What branch was tested?
2. What exact HEAD is the repository on?
3. What is `origin/master`?
4. Does HEAD equal `origin/master`?
5. Is the existing PDM implementation still local/uncommitted?
6. What unrelated WIP exists?
7. What files were changed by this delta?
8. Were production files changed?
9. If production files changed, what exact defect required it?
10. What test boundary was used for provider/workspace lifecycle integration?
11. Does starting placement call `placeBuilding`?
12. Does picking P1 call `placeBuilding`?
13. Does repicking P2 call `placeBuilding`?
14. What exact action first calls `placeBuilding`?
15. How many times is `placeBuilding` called on one successful confirm?
16. What exact `buildingTypeId` is asserted?
17. What exact name is asserted?
18. What exact candidate x/y is asserted?
19. Is `regionId` added by PDM?
20. What happens to the placement session after success?
21. What happens to the candidate after success?
22. What screen is active after success?
23. Does success navigate back to Buildings?
24. What happens when `placeBuilding` rejects?
25. Is the placement session retained on rejection?
26. Is the candidate retained on rejection?
27. Is the player still on World/in placement mode?
28. Is rejection ever converted into no-pick?
29. Does rejection trigger a false success/session clear?
30. Does cancel call `placeBuilding`?
31. Does cancel clear session?
32. Where does cancel navigate?
33. Does navigation away call `placeBuilding`?
34. Does navigation away clear the session?
35. Can the stale session reappear after returning to World?
36. Was double-confirm behavior tested directly?
37. If not, what existing authoritative evidence covers it?
38. Were coordinate semantics changed?
39. Was `s = 1` changed?
40. Was `round` changed?
41. Was marker projection changed?
42. Was raw X/Y behavior changed beyond the existing PDM implementation?
43. Was gameplay changed?
44. Was save behavior changed?
45. Was API behavior changed?
46. Was region gameplay changed?
47. Was Scenario-B reopened?
48. What focused test command(s) were run?
49. How many focused tests passed?
50. Did `pnpm typecheck` pass?
51. Did `pnpm lint` pass?
52. How many lint errors?
53. How many lint warnings?
54. Did `pnpm test` pass?
55. How many test files passed?
56. How many tests passed?
57. Did `pnpm build:web` pass?
58. Does any PDM lifecycle-test gap remain?
59. Does any known PDM-local implementation defect remain?
60. Is PDM-001 now ready for runtime evidence?
61. Was there any commit?
62. Was there any push?
63. Was there any tag?

---

# 31. STOP CONDITIONS

STOP if lifecycle testing reveals that closing the gap requires:

- coordinate-contract redesign;
- changing `s = 1`;
- changing `round`;
- new gameplay validation;
- new collision/capacity rules;
- region gameplay redesign;
- save migration;
- API redesign;
- new placement command;
- material workspace/navigation redesign;
- World visual redesign;
- Scenario-B reopening;
- broad production refactor;
- unexpected cross-scope regression.

Also STOP if the current implementation cannot preserve:

> rejection retains placement session + candidate

without a material architectural change.

Return the exact evidence.

---

# 32. TASK-LOCAL DEFECT RULE

If a required lifecycle test exposes a small obvious PDM-local defect:

fix it in this pass.

Examples:

- success clears too early;
- rejection accidentally clears candidate;
- confirm submits stale coordinates;
- confirm calls twice;
- cancel invokes command;
- navigation-away fails to clear;
- success navigates to wrong screen.

Do not return a new prompt for an obvious bounded fix.

After fixing:

rerun focused tests and all root gates.

---

# 33. RUNTIME EVIDENCE GATE

Do NOT perform broad runtime certification in this delta.

If this test delta passes:

the next step is:

> `PDM-001 RUNTIME EVIDENCE GATE`

Do not start another architecture review.

Do not reopen the Product / UX Contract.

---

# 34. FINAL DECISION

Return exactly ONE.

## OPTION A — LIFECYCLE TEST DELTA CLOSED / RUNTIME READY

Use only when:

- pick = zero placement calls;
- repick = zero placement calls;
- confirm = exactly one placement call;
- exact building type/name/x/y proven;
- region semantics unchanged;
- success clears placement session;
- success remains on World;
- rejection retains placement session;
- rejection retains candidate;
- rejection remains in placement mode;
- rejection is not converted to no-pick;
- cancel = zero placement calls;
- cancel clears session;
- cancel returns Buildings;
- navigation away = zero placement calls;
- navigation away clears session;
- stale session does not resurrect;
- focused tests pass;
- root gates pass;
- no known PDM-local defect remains.

State:

> **PDM-001 CONFIRM / REJECTION LIFECYCLE TEST DELTA:**  
> `CLOSED / PASS`

> **PICK / REPICK MUTATION:**  
> `NONE`

> **CONFIRM:**  
> `EXPLICIT / EXACTLY ONE PLACE-BUILDING CALL`

> **CONFIRM PAYLOAD:**  
> `BUILDING TYPE + NAME + CANDIDATE X/Y VERIFIED`

> **SUCCESS LIFECYCLE:**  
> `SESSION CLEARED / REMAIN WORLD`

> **REJECTION LIFECYCLE:**  
> `SESSION + CANDIDATE RETAINED`

> **REJECTION VS NO-PICK:**  
> `SEPARATE`

> **CANCEL:**  
> `NO MUTATION / SESSION CLEARED`

> **NAVIGATION AWAY:**  
> `NO MUTATION / SESSION CLEARED`

> **COORDINATE CONTRACT:**  
> `UNCHANGED`

> **GAMEPLAY / SAVE / API:**  
> `UNCHANGED`

> **ROOT GATES:**  
> `<exact results>`

> **PDM-001 IMPLEMENTATION CLOSE CANDIDATE:**  
> `PASS FOR RUNTIME EVIDENCE`

> **NEXT PROMPT TYPE:**  
> `PDM-001 RUNTIME EVIDENCE GATE`

> **COMMIT / PUSH / TAG:**  
> `NONE`

Then STOP.

---

## OPTION B — SMALL LIFECYCLE DEFECT REMAINS

Use only if one bounded PDM-local defect remains and cannot safely be fixed during this pass.

State:

> **PDM-001 LIFECYCLE DELTA:**  
> `PARTIAL`

> **EXACT DEFECT:**  
> `<defect>`

> **FAILED INVARIANT:**  
> `<invariant>`

> **WHY NOT SAFELY FIXED:**  
> `<reason>`

> **RUNTIME READY:**  
> `NO`

---

## OPTION C — MATERIAL CONTRACT / ARCHITECTURE BLOCKER

Use only if lifecycle testing reveals a genuine material contradiction.

State exact evidence.

Do not redesign.

---

## OPTION D — BASELINE / CROSS-SCOPE BLOCKER

Use only if repository integrity or an unexpected cross-scope regression prevents trustworthy completion.

---

# 35. DEFINITION OF DONE

This delta is complete only when:

- [ ] implementation guide read
- [ ] Product / UX Contract read
- [ ] Coordinate Consistency Closeout read
- [ ] current Bounded Implementation Close Candidate read
- [ ] actual provider implementation inspected
- [ ] existing test conventions inspected
- [ ] branch recorded
- [ ] exact HEAD recorded
- [ ] origin/master recorded
- [ ] existing PDM diff preserved
- [ ] unrelated WIP untouched
- [ ] correct provider/workspace integration boundary tested
- [ ] placement start does not call placeBuilding
- [ ] pick P1 does not call placeBuilding
- [ ] repick P2 does not call placeBuilding
- [ ] explicit confirm calls placeBuilding exactly once
- [ ] exact buildingTypeId asserted
- [ ] exact building name asserted
- [ ] exact candidate x asserted
- [ ] exact candidate y asserted
- [ ] region semantics unchanged
- [ ] success clears placement session
- [ ] success clears candidate
- [ ] success remains on World
- [ ] success does not navigate to Buildings
- [ ] rejection invokes placement path exactly once
- [ ] rejection retains placement session
- [ ] rejection retains candidate
- [ ] rejection remains on World
- [ ] rejection remains placement mode
- [ ] rejection does not become no-pick
- [ ] rejection does not trigger false success clear
- [ ] cancel calls placeBuilding zero times
- [ ] cancel clears session
- [ ] cancel clears candidate
- [ ] cancel returns Buildings
- [ ] navigation away calls placeBuilding zero times
- [ ] navigation away clears session
- [ ] returning to World does not resurrect stale session
- [ ] double-confirm directly tested OR authoritative existing coverage cited
- [ ] coordinate semantics unchanged
- [ ] `s = 1` unchanged
- [ ] `round` unchanged
- [ ] no coordinate cap introduced
- [ ] marker projection unchanged unless real defect required change
- [ ] no gameplay change
- [ ] no save change
- [ ] no API change
- [ ] no region gameplay change
- [ ] Scenario-B remains paused
- [ ] production code unchanged unless test exposed real PDM-local defect
- [ ] any production change explicitly documented
- [ ] focused tests PASS
- [ ] root typecheck PASS
- [ ] root lint PASS with exact error/warning counts
- [ ] root tests PASS with exact totals
- [ ] root build:web PASS
- [ ] implementation close-candidate report updated
- [ ] previous lifecycle-test gap marked closed if successful
- [ ] no known PDM-local lifecycle defect remains
- [ ] runtime readiness explicitly decided
- [ ] exactly one final option returned
- [ ] no commit
- [ ] no push
- [ ] no tag

---

# 36. CORE EXECUTION RULE

Do not redesign PDM.

The implementation already exists.

This task closes one missing proof:

> Does the transient placement session cross into real gameplay mutation correctly?

Prove:

> start = no mutation

> pick = no mutation

> repick = no mutation

> confirm = exactly one existing placeBuilding call

> confirm payload = exact building type + name + candidate x/y

> success = clear session, stay World

> rejection = retain session + candidate, stay placement mode

> rejection ≠ no-pick

> cancel = no mutation, clear session

> navigation away = no mutation, clear session.

Use the real provider/workspace lifecycle boundary.

Do not replace integration proof with pure helper tests.

Do not change production code unless a test exposes a genuine PDM-local defect.

If it does, fix the smallest defect in this pass.

Do not reopen coordinates.

Do not reopen gameplay.

Do not reopen saves/APIs.

Do not reopen visuals.

Do not reopen Scenario-B.

Run focused tests.

Run all root gates.

Update the existing implementation close-candidate report.

If all lifecycle invariants pass:

declare the delta CLOSED / PASS and PDM-001 ready for Runtime Evidence.

No commit.

No push.

No tag.

Then STOP.

# END OF PROMPT