# POST-V1 WORKFORCE-GUIDANCE-001
# Production Workforce Blocker Actionability

## MODE

BOUNDED IMPLEMENTATION.

Implement exactly one player-guidance repair:

> When Production is stalled because the affected building has no assigned workforce, tell the player how to resolve that blocker using the existing workforce-management workflow.

This is a COPY-ONLY / PRESENTATION-ONLY slice.

Do NOT add structured navigation.

Do NOT add direct hire or assignment actions to Production.

Do NOT change workforce simulation.

Do NOT change production simulation.

Do NOT change staffing requirements.

Do NOT change employee compatibility.

Do NOT change save/API contracts.

Do NOT create new navigation/focus semantics.

Do NOT add art.

Do NOT reopen sealed PGD families.

Do NOT reopen TIME-UX.

Do NOT reopen TRANSPORT-STATUS-001.

No tag.

Do not commit or push until independent review.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

---

# 1. AUTHORITATIVE PREDECESSOR EVIDENCE

Read:

- `docs/architecture/reviews/POST_V1_NEXT_MATERIAL_SLICE_GATE_WORKFORCE_GUIDANCE_DELTA.md`
- `docs/architecture/reviews/POST_V1_TRANSPORT_STATUS_001_PLAYER_FACING_TRANSPORT_STATUS_LABELS_CLOSE_CANDIDATE.md`

The Workforce Guidance delta established:

- `STALLED_WORKFORCE` is a real Production blocker;
- Production currently shows `Keine Mitarbeiter`;
- affected building and recipe/job are identifiable;
- Production does NOT explain where employees are hired;
- Production does NOT explain how employees are assigned;
- Production provides NO direct workforce navigation;
- current resolution path is:
  - Production
  - manually navigate to Unternehmen
  - open Operatives Dashboard
  - Personal
  - hire employee if necessary
  - assign employee to affected building
  - return to Production;
- copy-only repair is implementation-ready;
- structured workforce navigation is NOT ready because no authoritative open-operations / Personal-focus contract exists.

The predecessor selected:

> `WORKFORCE-GUIDANCE-001 — Production Workforce Blocker Actionability`

as the next queued slice after TRANSPORT-STATUS-001.

TRANSPORT-STATUS-001 has now been independently accepted and subsequently committed/pushed by the human operator.

Verify current Git truth before implementation.

Do not redo the materiality gate.

---

# 2. BASELINE VERIFICATION

Record:

- branch;
- exact HEAD;
- HEAD subject;
- `origin/master`;
- HEAD/origin relationship;
- working-tree status;
- unrelated WIP.

Explicitly verify:

1. TIME-UX-R1 remains in ancestry.
2. TRANSPORT-STATUS-001 is now committed.
3. TRANSPORT-STATUS-001 is present on `origin/master`.
4. HEAD and `origin/master` relationship is understood.
5. Relevant PGD predecessor work remains present.

If the human's commit/push is not visible:

STOP and report the exact Git discrepancy.

Do not implement on an ambiguous baseline.

---

# 3. ROOT BASELINE

If HEAD is a new committed Transport closeout baseline, establish root health before or during implementation according to the implementation guide.

Required final gates remain:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build:web`

Do not repair unrelated WIP.

---

# 4. PLAYER PROBLEM

Current Production can enter:

> `STALLED_WORKFORCE`

Player-facing presentation currently includes:

> `Keine Mitarbeiter`

and:

> `Gestoppt wegen Personal`

The player can identify the affected building/job, but the Production surface does not explain how to resolve the blocker.

The current resolution workflow exists elsewhere:

> Unternehmen
> → Operatives Dashboard
> → Personal
> → employee hire if necessary
> → employee assignment to affected building
> → return to Produktion

The problem is NOT:

> the player cannot hire employees at all.

The problem is:

> Production tells the player WHAT is wrong but not WHERE/HOW to resolve it.

Repair exactly that.

---

# 5. CRITICAL DOMAIN TRUTH

Do NOT state or imply that a particular employee type is required unless current implementation has changed and hard domain evidence proves it.

The predecessor gate established:

- workforce allocation is headcount-based;
- assignment does not enforce employee type/building compatibility;
- any assigned employee can contribute to building workforce;
- `employee_production_worker` / `Produktionsmitarbeiter` is content-primary/flavor-appropriate for sawmills/factories;
- it is NOT an exclusive simulation requirement.

Therefore copy such as:

> `Stelle einen Produktionsmitarbeiter ein.`

is NOT acceptable as mandatory gameplay instruction under the current domain model.

Likewise do NOT say:

> `Das Sägewerk benötigt Produktionsmitarbeiter.`

as an exclusive rule.

Guidance must remain type-agnostic unless current authoritative domain behavior has changed.

---

# 6. WORKER-COUNT TRUTH

The predecessor gate established for `recipe_planks`:

> `workers: 2`

but also established:

- zero assigned workers → stalled;
- one assigned worker → non-zero efficiency / production can proceed more slowly;
- two workers correspond to full required headcount for that recipe.

This slice must NOT turn one recipe's worker count into a universal staffing instruction.

Do NOT hardcode:

> `Stelle 2 Mitarbeiter ein.`

Do NOT claim:

> `Das Sägewerk braucht immer 2 Mitarbeiter.`

unless current authoritative semantics prove such a generic statement.

The purpose of this slice is discoverability of the workforce workflow, not staffing optimization.

---

# 7. REQUIRED COPY SEMANTICS

The guidance must communicate the minimum deterministic resolution path:

1. workforce is missing at the affected production building;
2. employees are managed under:
   - `Unternehmen`
   - `Operatives Dashboard`
   - `Personal`;
3. if necessary, hire an employee there;
4. assign an available/hired employee to the affected building.

Preferred semantic shape:

> `Keine Mitarbeiter zugewiesen. Öffne Unternehmen → Operatives Dashboard → Personal, stelle bei Bedarf einen Mitarbeiter ein und weise ihn diesem Gebäude zu.`

This is semantic guidance, NOT mandatory literal wording.

Use repository-consistent German terminology.

Prefer concise player-facing copy.

Do not make the hint excessively instructional if the same meaning can be expressed cleanly.

The final copy must be derived from current UI terminology.

---

# 8. AFFECTED BUILDING CONTEXT

The player already sees the affected building in Production rows/cards.

Do not duplicate a building name into every hint unless the current presentation component requires it for clarity.

If the hint is scoped directly to a specific production job/building, wording such as:

> `... diesem Gebäude zuweisen.`

may be sufficient.

If the hint is rendered in a global summary where the affected building is NOT obvious, do not falsely imply a single target.

Inspect actual presentation context before choosing wording.

---

# 9. FIND THE SMALLEST CORRECT PRESENTATION BOUNDARY

Trace current Production presentation for `STALLED_WORKFORCE`.

Determine where actionable guidance provides the most value with the least duplication.

Potential existing locations include:

- Production summary;
- job row/status area;
- factory grouping;
- job inspector;
- existing hint/reason presentation.

Do NOT automatically add the same paragraph everywhere.

Prefer ONE authoritative player-guidance representation that appears where the player encounters the blocker.

If existing view data already has a reason/hint field, prefer extending that architecture rather than embedding logic directly in JSX.

Do not parse:

> `Keine Mitarbeiter`

to infer state.

Use structured state:

> `STALLED_WORKFORCE`

or existing structured view data.

---

# 10. PRESENTATION AUTHORITY

The implementation should preserve separation between:

- internal operational state;
- player-facing status label;
- player-facing resolution guidance.

Do not overload `formatProductionStatus` with a large workflow paragraph if that formatter is intended only for short status labels.

If a separate presentation helper/view-data field is architecturally cleaner, use it.

Example conceptual separation:

> `statusLabel = Keine Mitarbeiter`
>
> `guidance = Mitarbeiter unter Unternehmen → Operatives Dashboard → Personal verwalten und dem Gebäude zuweisen.`

Do not force this exact shape if current view-data architecture provides a better bounded mechanism.

No domain changes.

---

# 11. NO STRING-PARSING

Do NOT implement logic like:

> if statusLabel === 'Keine Mitarbeiter'

or:

> if reason.includes('Mitarbeiter')

Use the authoritative structured production operational state.

German copy is output, not application state.

---

# 12. EXISTING TERMINOLOGY

Verify exact current player-facing labels for:

- Unternehmen;
- Operatives Dashboard;
- Personal;
- Produktion;
- employee hire controls;
- employee assignment controls.

Use those terms consistently.

Do not introduce a new term such as:

- Personalverwaltung;
- Mitarbeiterzentrale;
- Workforce;
- Personalbüro;

unless it already exists authoritatively in current UI.

---

# 13. COPY-ONLY FIREWALL

This slice was explicitly approved as:

> COPY-ONLY READY

Therefore do NOT add:

- button;
- CTA;
- link;
- navigation action;
- `navigateToTarget`;
- `navigateToScreen`;
- pending navigation state;
- Company operations focus;
- Personal focus;
- employee-type focus;
- building assignment focus.

If implementation cannot provide useful guidance without adding navigation:

STOP and return evidence.

Do not silently expand scope.

---

# 14. STRUCTURED NAVIGATION DEFERRED

The predecessor gate established that structured navigation is NOT currently ready.

Known gaps include:

- no dedicated workforce navigation target;
- no employee-type focus;
- no Personal sidebar focus;
- no assignment-context focus;
- Company navigation can land on executive overview rather than directly on the required workforce context.

Do not solve these gaps here.

Record as deferred:

> `WORKFORCE-GUIDANCE structured-navigation follow-up`

A later product/UX decision may authorize it.

---

# 15. DIRECT COMMAND FIREWALL

Do not import/use employee command clients from Production.

Do not call:

- `hireEmployee`;
- `assignEmployee`.

Do not create new Production buttons that execute employee commands.

The existing Company/Operations workflow remains authoritative.

---

# 16. EMPLOYEE TYPE FIREWALL

Do not alter:

- employee YAML;
- employee prerequisites;
- employee costs;
- employee categories;
- employee descriptions;
- employee visual assets;
- employee compatibility rules.

Do not introduce a role recommendation unless it is clearly non-mandatory and genuinely improves the player experience.

For this bounded slice, type-agnostic guidance is preferred.

---

# 17. PRODUCTION LOGIC FIREWALL

Do not change:

- `GameSession.#resolveProductionOperationalState`;
- `EmployeeAllocationCalculator`;
- worker efficiency;
- recipe worker requirements;
- production progress;
- production duration;
- energy behavior;
- material behavior;
- auto-transport behavior;
- job state transitions.

`STALLED_WORKFORCE` semantics remain unchanged.

---

# 18. SAVE / API FIREWALL

No changes to:

- save schema;
- employee API;
- production API;
- DTO contracts;
- command payloads;
- migrations.

This is presentation guidance only.

---

# 19. TRANSPORT-STATUS-001 FIREWALL

TRANSPORT-STATUS-001 is now closed and should be treated as sealed.

Do not alter:

- `formatTransportStatus`;
- Transport row status presentation;
- Transport summary internal status separation;
- World Transport status labels;
- Transport runtime evidence.

If current baseline does not contain the committed Transport work:

STOP under baseline verification.

---

# 20. SEALED PGD FIREWALL

Do not reopen:

- PGD-001;
- PGD-TECH-001;
- PGD-002-S1;
- PGD-RES-001.

Do not modify Buildings prerequisite navigation.

Do not modify Research focus behavior.

Do not modify resource-label presentation.

This is a new Production workforce guidance family.

---

# 21. TIME-UX FIREWALL

Do not alter:

- Zyklus/Zyklen;
- player-cycle presentation;
- speed controls;
- production transport duration copy;
- chart cycle copy.

TIME-UX-R1 remains sealed.

---

# 22. VISUAL FIREWALL

No art.

Do not modify:

- WFV assets;
- employee portraits;
- ICON families;
- World visuals;
- Scenario-B assets.

Scenario-B remains paused.

---

# 23. PDM / TUTORIAL FIREWALL

Do not touch:

- PDM-001;
- building placement;
- X/Y controls;
- tutorial navigation/actionability.

Separate product-contract work.

---

# 24. FOCUSED TEST — GUIDANCE MAPPING

Add focused tests at the presentation/view-data layer.

Prove:

- `STALLED_WORKFORCE` produces actionable workforce guidance;
- guidance uses current UI terminology;
- guidance does NOT claim `Produktionsmitarbeiter` is mandatory;
- guidance does NOT hardcode a worker count;
- unrelated production states do NOT receive workforce guidance.

Representative non-workforce states should remain unchanged.

Do not rely only on snapshot tests.

---

# 25. FOCUSED TEST — PRODUCTION SCREEN

Add/update Production screen/component coverage.

Verify that a stalled-workforce job visibly presents:

- existing status semantics;
- new resolution guidance.

The test should establish that the player can learn:

> where workforce is managed

and:

> that the employee must be assigned to the affected building.

Do not require a navigation button because this slice intentionally has none.

---

# 26. NEGATIVE TESTS

Where appropriate, explicitly protect against semantic overstatement.

The player-facing workforce guidance must NOT contain mandatory claims equivalent to:

> Produktionsmitarbeiter erforderlich

or:

> 2 Mitarbeiter erforderlich

unless current domain semantics have materially changed and the implementation STOP condition has been invoked for reassessment.

Prefer testing structured behavior over brittle full-copy equality, but protect the critical semantic boundary.

---

# 27. RUNTIME CERTIFICATION

Use a legitimate deterministic state with:

- active/constructed sawmill;
- production job;
- zero assigned workers;
- resulting `STALLED_WORKFORCE`.

Preferred known scenario:

> sawmill
> + `recipe_planks`
> + zero assigned employees
> → tick
> → `STALLED_WORKFORCE`

At approximately:

> 1440×900

capture Production showing:

- affected building/job;
- `Keine Mitarbeiter` or current authoritative status label;
- new actionable workforce guidance.

The evidence must make it possible to verify that the player is told the real path:

> Unternehmen → Operatives Dashboard → Personal

and assignment to the affected building.

---

# 28. OPTIONAL DESTINATION VERIFICATION

Because the guidance names an existing UI destination, verify the destination still exists in current runtime/source:

> Unternehmen → Operatives Dashboard → Personal

This does NOT require implementing navigation.

A source/test verification is sufficient if runtime destination evidence already exists.

If the named path has changed, update guidance to current UI truth.

Do not ship stale instructions.

---

# 29. NARROW VIEWPORT

Check approximately:

> 480×900

because the new guidance text may wrap.

Verify:

- readable;
- no overflow;
- no clipped text;
- no destructive layout regression.

Do not redesign responsive layout.

---

# 30. SCOPED GUIDANCE AUDIT

After implementation inspect owned Production workforce-blocker presentation.

Expected:

- `STALLED_WORKFORCE` status remains understandable;
- actionable path is present;
- no mandatory employee-type misinformation;
- no hardcoded recipe-specific worker count;
- no button/navigation added;
- no duplicated guidance noise across unrelated surfaces.

Document where the final guidance appears.

---

# 31. ROOT GATES

Run:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build:web`

Record exact results.

Fix task-owned defects.

Do not hide failures.

Do not repair unrelated WIP.

---

# 32. WORKING-TREE DISCIPLINE

Classify:

- task-owned changes;
- unrelated pre-existing WIP;
- generated/transient evidence.

Do not absorb unrelated files.

Especially do not absorb:

- visual pilots/assets;
- unrelated doc moves/deletes;
- saves;
- `.next`;
- other local evidence experiments.

---

# 33. EXPECTED CHANGE SHAPE

Prefer a small change set around:

- Production presentation/view-data helper or mapper;
- Production screen rendering only as necessary;
- focused tests;
- bounded evidence tooling/fixture only if necessary;
- one runtime PNG;
- one close-candidate report.

Avoid broad refactors.

If the task begins requiring Company screen architecture changes:

STOP.

That would violate copy-only scope.

---

# 34. CLOSE CANDIDATE REPORT

Create:

`docs/architecture/reviews/POST_V1_WORKFORCE_GUIDANCE_001_PRODUCTION_WORKFORCE_BLOCKER_ACTIONABILITY_CLOSE_CANDIDATE.md`

Required sections:

## A. Executive result

## B. Baseline & working tree

## C. Authoritative workforce semantics

## D. Pre-fix player problem

## E. Selected guidance boundary

## F. Final player-facing copy

## G. Implementation

## H. Semantic safeguards

## I. Focused tests

## J. Runtime evidence

## K. Narrow viewport

## L. Root gates

## M. Deferred structured navigation

## N. Deferred related work

## O. Final decision

Keep it evidence-focused.

---

# 35. REQUIRED FACTUAL QUESTIONS

Explicitly answer:

1. What branch was implemented?
2. What exact baseline HEAD was used?
3. What is `origin/master`?
4. Does baseline include committed TRANSPORT-STATUS-001?
5. Is TRANSPORT-STATUS-001 on `origin/master`?
6. Does TIME-UX-R1 remain in ancestry?
7. What unrelated WIP existed?
8. What authoritative state represents the workforce stall?
9. What exact condition creates the stall?
10. What existing player-facing status label remains?
11. Can the affected building be identified?
12. Can the affected job/recipe be identified?
13. What workforce rule does the simulation actually enforce?
14. Is an exact employee type required?
15. Can multiple employee types satisfy the simulation?
16. What does `employee_production_worker` mean in content?
17. Is `Produktionsmitarbeiter` presented as mandatory by the new guidance?
18. Is any recipe-specific worker count hardcoded into guidance?
19. What is the exact current destination for workforce management?
20. Does `Unternehmen` still exist as the first destination?
21. Does `Operatives Dashboard` still exist?
22. Does `Personal` still exist?
23. Does hire still occur there?
24. Does assignment still occur there?
25. Does hiring automatically assign?
26. Must the player still assign the employee to a building?
27. What exact final guidance copy is shown?
28. Where is the guidance rendered?
29. Is it scoped to `STALLED_WORKFORCE`?
30. Do unrelated Production states remain unchanged?
31. Does the implementation use structured state rather than German-string parsing?
32. Was `formatProductionStatus` kept appropriately bounded?
33. Was a separate guidance helper/view-data field used if appropriate?
34. Was any navigation button added?
35. Was any CTA added?
36. Was `navigateToTarget` added to this workflow?
37. Was `navigateToScreen` added to this workflow?
38. Was any Company focus state added?
39. Was any Personal focus state added?
40. Was any employee-type focus added?
41. Was any assignment-context focus added?
42. Were employee APIs imported into Production?
43. Was `hireEmployee` called from Production?
44. Was `assignEmployee` called from Production?
45. Was workforce simulation changed?
46. Was production simulation changed?
47. Were recipe worker requirements changed?
48. Was employee compatibility changed?
49. Was save schema changed?
50. Was API behavior changed?
51. Were focused mapper/helper tests added?
52. Was Production component coverage added/updated?
53. Do tests protect against mandatory employee-type misinformation?
54. Do tests protect against hardcoded worker-count misinformation?
55. Did focused tests pass?
56. Was runtime `STALLED_WORKFORCE` certified?
57. Does runtime evidence show the affected building/job?
58. Does runtime evidence show actionable workforce guidance?
59. Does runtime guidance name the real destination?
60. Was the destination reverified?
61. Did narrow viewport pass?
62. Did `pnpm typecheck` pass?
63. Did `pnpm lint` pass?
64. How many lint errors/warnings?
65. Did `pnpm test` pass?
66. What is the final test file/test count?
67. Did `pnpm build:web` pass?
68. Were any task-owned regressions found?
69. Was unrelated WIP untouched?
70. Was TRANSPORT-STATUS-001 left sealed?
71. Were PGD families left sealed?
72. Was TIME-UX left sealed?
73. Was any art added?
74. Does Scenario-B remain paused?
75. What structured-navigation work remains deferred?
76. Is WORKFORCE-GUIDANCE-001 ready for independent closure?
77. Was there any commit/push/tag?

---

# 36. STOP CONDITIONS

STOP and return evidence instead of guessing if:

- current domain now enforces a specific employee type for sawmills;
- current domain now enforces role/building compatibility;
- workforce-management destination differs materially from the predecessor gate;
- the named UI path no longer exists;
- useful guidance cannot be implemented without navigation;
- implementation requires new Company/Operations focus semantics;
- implementation requires employee command APIs in Production;
- implementation requires simulation changes;
- implementation requires save/API changes;
- authoritative staffing semantics are ambiguous;
- task-owned changes trigger unexpected cross-scope regressions;
- baseline does not contain the committed/pushed Transport slice;
- material scope expansion becomes necessary.

Do not invent product rules across a stop condition.

---

# 37. FINAL DECISION

Return exactly ONE.

## OPTION A — CLOSE CANDIDATE / PASS

Use only when:

- workforce blocker is correctly detected through structured state;
- player-facing status remains correct;
- guidance explains the real workforce-management path;
- guidance explains assignment to the affected building;
- no exact employee type is falsely presented as mandatory;
- no recipe-specific worker count is generalized;
- no navigation/CTA is added;
- no employee command is added to Production;
- workforce logic unchanged;
- production logic unchanged;
- save/API unchanged;
- focused tests pass;
- runtime evidence passes;
- narrow presentation passes;
- root gates pass;
- sealed families remain sealed.

State:

> **WORKFORCE-GUIDANCE-001:**  
> `CLOSE CANDIDATE / PASS`

> **PLAYER PROBLEM:**  
> `STALLED_WORKFORCE now includes actionable resolution guidance`

> **GUIDANCE DESTINATION:**  
> `Unternehmen → Operatives Dashboard → Personal`

> **REPAIR MODE:**  
> `COPY-ONLY`

> **EMPLOYEE TYPE REQUIREMENT:**  
> `NO FALSE MANDATORY TYPE CLAIM`

> **WORKER COUNT:**  
> `NO RECIPE-SPECIFIC GENERALIZATION`

> **NAVIGATION:**  
> `UNCHANGED / NONE ADDED`

> **WORKFORCE LOGIC:**  
> `UNCHANGED`

> **PRODUCTION LOGIC:**  
> `UNCHANGED`

> **SAVE / API:**  
> `UNCHANGED`

> **ART:**  
> `NONE`

> **STRUCTURED NAVIGATION:**  
> `DEFERRED`

> **COMMIT / PUSH / TAG:**  
> `NONE`

> **READY FOR INDEPENDENT REVIEW:**  
> `YES`

---

## OPTION B — REVISE

Use when the bounded copy-only approach is correct but task-owned defects remain.

List only exact remaining defects.

Do not expand scope.

---

## OPTION C — PRODUCT COPY / SEMANTIC DECISION REQUIRED

Use if truthful actionable copy cannot be written without choosing unsupported workforce semantics.

State the exact ambiguity.

Do not invent the answer.

---

## OPTION D — STRUCTURED NAVIGATION REQUIRED

Use only if current runtime architecture makes copy-only guidance materially insufficient to solve the confirmed problem.

State:

- why copy cannot provide a truthful resolution path;
- which missing navigation contract is required.

Do not implement that contract.

---

## OPTION E — BASELINE NOT READY

Use if committed TRANSPORT-STATUS-001 cannot be verified or baseline integrity is otherwise insufficient.

---

# 38. DEFINITION OF DONE

This implementation is complete only when:

- [ ] implementation guide read
- [ ] Workforce Guidance delta read
- [ ] Transport close candidate read
- [ ] current branch recorded
- [ ] exact baseline HEAD recorded
- [ ] origin/master recorded
- [ ] committed Transport slice verified
- [ ] pushed Transport slice verified
- [ ] TIME-UX ancestry verified
- [ ] unrelated WIP classified
- [ ] STALLED_WORKFORCE path reverified
- [ ] workforce simulation truth reverified
- [ ] employee-type semantics reverified
- [ ] workforce-management destination reverified
- [ ] hire workflow reverified
- [ ] assignment workflow reverified
- [ ] final guidance boundary selected
- [ ] final German copy documented
- [ ] guidance uses structured workforce state
- [ ] no German-string parsing
- [ ] no false mandatory employee-type claim
- [ ] no recipe-specific worker-count generalization
- [ ] no navigation added
- [ ] no CTA added
- [ ] no Company focus semantics added
- [ ] no Personal focus semantics added
- [ ] no employee-type focus added
- [ ] no assignment focus added
- [ ] no employee API imported into Production
- [ ] no direct hire added
- [ ] no direct assignment added
- [ ] workforce simulation unchanged
- [ ] production simulation unchanged
- [ ] recipe semantics unchanged
- [ ] employee compatibility unchanged
- [ ] save unchanged
- [ ] API unchanged
- [ ] Transport slice left sealed
- [ ] PGD families left sealed
- [ ] TIME-UX left sealed
- [ ] no art
- [ ] Scenario-B remains paused
- [ ] focused presentation tests PASS
- [ ] Production component tests PASS
- [ ] semantic-negative tests PASS
- [ ] runtime STALLED_WORKFORCE PASS
- [ ] actionable guidance visible
- [ ] actual destination still valid
- [ ] narrow viewport PASS
- [ ] root typecheck PASS
- [ ] root lint PASS
- [ ] root tests PASS
- [ ] root build:web PASS
- [ ] unrelated WIP untouched
- [ ] close-candidate report written
- [ ] structured navigation explicitly deferred
- [ ] exactly one final option returned
- [ ] no commit
- [ ] no push
- [ ] no tag

---

# 39. CORE EXECUTION RULE

The player already knows:

> `Keine Mitarbeiter`

after the stall occurs.

What the player does NOT know is:

> where to solve it.

Fix that information gap.

Tell the truth about the current game.

The game currently counts assigned workforce.

It does not require one exclusive sawmill employee type.

Do not tell the player otherwise.

Do not generalize one recipe's worker count into a building rule.

Use the real existing destination:

> Unternehmen → Operatives Dashboard → Personal

Tell the player to hire an employee there if necessary and assign an employee to the affected building.

Do not create a second employee-management workflow inside Production.

Do not add navigation before the navigation contract exists.

Do not parse translated copy as state.

Do not change simulation to make the copy easier.

Do not reopen Transport.

Do not reopen PGD.

Do not reopen TIME-UX.

Do not add art.

Finish one bounded player-guidance repair.

Produce one independently reviewable close candidate.

Then STOP.

# END OF PROMPT