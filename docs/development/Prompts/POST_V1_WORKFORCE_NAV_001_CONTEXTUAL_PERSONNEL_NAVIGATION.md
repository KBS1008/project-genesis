# POST-V1 WORKFORCE-NAV-001
# Contextual Personnel Navigation for STALLED_WORKFORCE

## MODE

BOUNDED UX / NAVIGATION IMPLEMENTATION.

Implement exactly one player-actionability improvement:

> From a Production `STALLED_WORKFORCE` blocker, the player can explicitly navigate to
> Unternehmen → Operatives Dashboard → Personal,
> carrying the affected building as context so its workforce assignment is brought into focus.

This product/UX contract is now APPROVED.

Do not reopen the product decision.

This is NOT a Workforce simulation change.

This is NOT automatic hiring.

This is NOT automatic assignment.

This is NOT a new employee compatibility system.

This is NOT a Company Dashboard redesign.

No gameplay-rule changes.

No save/API changes unless current architecture unexpectedly makes transient navigation state impossible without them — in that case STOP.

No art.

No tag.

Do not commit or push until independent review.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

---

# 1. READ FIRST

Read:

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/architecture/reviews/POST_V1_NEXT_MATERIAL_SLICE_GATE_AFTER_RESEARCH_METRICS_001.md`
- `docs/architecture/reviews/POST_V1_WORKFORCE_GUIDANCE_001_PRODUCTION_WORKFORCE_BLOCKER_ACTIONABILITY_CLOSE_CANDIDATE.md`
- the implementation/report material for PGD-002-S1 prerequisite navigation
- current Company Operations navigation/provider implementation
- current Production workforce blocker implementation
- current Company → Operatives Dashboard → Personal implementation

Use CURRENT repository truth.

Do not blindly copy predecessor navigation code.

Understand the existing navigation architecture first.

---

# 2. PRODUCT / UX DECISION — AUTHORITATIVE

The following product decision is approved for WORKFORCE-NAV-001:

> When a Production job is blocked by `STALLED_WORKFORCE`, the player may activate an explicit action:
>
> `Personal verwalten`
>
> This action navigates to:
>
> `Unternehmen → Operatives Dashboard → Personal`
>
> and carries the affected building as navigation context.
>
> The Personal surface must bring the workforce assignment context for that building into focus.
>
> The player remains responsible for hiring and assigning employees.
>
> Nothing is hired or assigned automatically.

This decision resolves the previous WORKFORCE-NAV readiness blocker.

Do not ask for another product decision unless current architecture reveals a materially different unresolved semantic question.

---

# 3. CORE UX CONTRACT

The semantic navigation contract is:

> destination:
> Company / Operatives Dashboard / Personal
>
> context:
> affected building
>
> reason:
> workforce assignment

Conceptually:

`target = personnel`

plus:

`buildingId = affected building`

plus a semantic reason equivalent to:

`workforce_assignment`

Exact code/type/property names MUST come from current repository architecture.

Do NOT blindly introduce names from this prompt.

The semantic contract matters, not these illustrative identifiers.

---

# 4. BASELINE VERIFICATION

Before implementation record:

- branch;
- exact HEAD;
- HEAD subject;
- `origin/master`;
- HEAD/origin relationship;
- working-tree status;
- unrelated WIP.

Verify that the following sealed slices remain in ancestry:

- RESEARCH-METRICS-001
- RESEARCH-STATUS-001
- WORKFORCE-GUIDANCE-001
- TRANSPORT-STATUS-001
- TIME-UX-R1
- PGD-002-S1

The previous gate established RESEARCH-METRICS-001 as committed and pushed.

Verify current Git truth.

If baseline integrity is ambiguous:

STOP.

---

# 5. ROOT BASELINE

Use the latest trustworthy committed baseline.

Previously established health after RESEARCH-METRICS-001:

- `pnpm typecheck` — PASS
- `pnpm lint` — PASS, 0 errors / 144 warnings
- `pnpm test` — PASS, 283 files / 1072 tests
- `pnpm build:web` — PASS
- runtime evidence — PASS

Final root gates after WORKFORCE-NAV-001 are mandatory.

Do not repair unrelated failures.

---

# 6. SEALED WORK

Treat as CLOSED / PASS / SEALED:

- WORKFORCE-GUIDANCE-001
- RESEARCH-METRICS-001
- RESEARCH-STATUS-001
- TRANSPORT-STATUS-001
- TIME-UX-R1
- PGD-001
- PGD-TECH-001
- PGD-002-S1
- PGD-RES-001
- V1 release gates
- sealed visual tracks

Scenario-B remains PAUSED.

Do not reopen them.

---

# 7. ARCHITECTURE-FIT CHECK — BEFORE EDITING

Before implementation, trace the existing navigation architecture.

Inspect at minimum:

1. how Production currently emits/handles structured navigation intents;
2. how PGD-002-S1 navigates to Company/Research or milestone context;
3. current pending Company Operations navigation state;
4. provider/store/context ownership of that pending intent;
5. how Company Operatives Dashboard selects sections/tabs;
6. how `Personal` is selected;
7. how employee assignment controls identify buildings;
8. whether a building can already be selected/focused;
9. how one-shot navigation intents are consumed/cleared.

Write a short implementation note in the close report describing the existing path.

Do NOT create a second navigation framework.

---

# 8. ARCHITECTURE-FIT SUCCESS CONDITION

Proceed only if the approved UX contract can be implemented as a bounded extension of the existing navigation mechanism.

Expected shape:

> Production blocker
> → structured navigation intent
> → existing Company navigation/provider boundary
> → Operatives Dashboard
> → Personal
> → affected building workforce context

Small extensions to existing navigation types/state are allowed.

A new parallel global navigation subsystem is NOT allowed.

If implementation requires:

- a new application-wide router architecture;
- persisted navigation state;
- save migration;
- API change;
- broad Company Dashboard restructuring;

STOP with:

> ARCHITECTURE / SCOPE BLOCKED

---

# 9. SOURCE CONDITION

The action belongs specifically to the existing Production blocker:

> `STALLED_WORKFORCE`

Do not infer workforce problems from German strings.

Use the existing structured Production status/blocker state.

Do not parse:

> `Keine Mitarbeiter ...`

Do not inspect rendered copy to decide whether the navigation action appears.

The action must be driven by structured state.

---

# 10. EXISTING WORKFORCE GUIDANCE

WORKFORCE-GUIDANCE-001 already provides the approved explanatory copy.

Expected existing guidance is semantically equivalent to:

> Keine Mitarbeiter am Gebäude zugewiesen. Unter Unternehmen → Operatives Dashboard → Personal bei Bedarf einen Mitarbeiter einstellen und dem betroffenen Gebäude zuweisen.

That copy is SEALED.

Do not rewrite it merely because a button is now added.

The copy explains.

The new action navigates.

These responsibilities remain separate.

---

# 11. ACTION LABEL

Use:

> `Personal verwalten`

as the player-facing action label unless current repository terminology proves an exact established equivalent that is more authoritative.

Do not use:

- `Mitarbeiter einstellen`

because hiring may not be necessary;

- `Produktionsmitarbeiter einstellen`

because the simulation does not require a specific employee type;

- `Mitarbeiter automatisch zuweisen`

because automatic assignment is forbidden.

Preferred approved wording:

> `Personal verwalten`

---

# 12. ACTION VISIBILITY

The action should be available when the affected Production state is:

> `STALLED_WORKFORCE`

and the UI has the affected building context required for navigation.

Do not show the action for unrelated blockers such as:

- missing inputs;
- storage;
- transport;
- energy;
- prerequisite;
- generic idle state.

Do not broaden blocker actionability in this slice.

---

# 13. AFFECTED BUILDING CONTEXT

The navigation intent must carry the identity of the building whose Production job is blocked.

Use the authoritative existing building identifier.

Do not derive the building from:

- display name;
- German copy;
- DOM text;
- list position.

The building context must remain structured.

---

# 14. TRANSIENT NAVIGATION STATE

The workforce navigation context is transient UI state.

It must NOT become:

- save state;
- gameplay state;
- domain state;
- API state.

The intent should live at the existing navigation/presentation boundary.

Do not serialize it into saves.

Do not add it to gameplay commands.

---

# 15. ONE-SHOT INTENT SEMANTICS

The contextual navigation request must be consumed once.

Required behavior:

1. player clicks `Personal verwalten`;
2. Company / Operatives Dashboard opens;
3. Personal becomes the active relevant surface;
4. affected building workforce context is focused;
5. pending navigation intent is consumed/cleared.

Later normal navigation to Company must NOT unexpectedly reapply the old workforce focus.

Use existing one-shot/pending-intent conventions where available.

---

# 16. DESTINATION CONTRACT

The destination is specifically:

> Unternehmen → Operatives Dashboard → Personal

Do not merely navigate to:

> Unternehmen

and expect the player to find Personal manually.

Do not navigate to an unrelated employee screen if the authoritative current workflow is Company Operations → Personal.

The value of this slice is contextual navigation.

---

# 17. PERSONAL FOCUS CONTRACT

On arrival, the Personal surface must clearly establish:

> Which building needs workforce attention?

The affected building must be brought into focus using the smallest mechanism consistent with current UI architecture.

Acceptable examples depending on current implementation:

- select the affected building in an existing assignment selector;
- expand the affected building's assignment row;
- focus an existing building-assignment control;
- visually mark the affected building's assignment context.

Do not invent a materially new personnel-management UI if existing controls can represent the context.

---

# 18. FOCUS DOES NOT MEAN AUTO-ACTION

Focus must NOT:

- hire an employee;
- assign an employee;
- remove an assignment;
- start Production;
- change building state;
- change employee state.

It only positions the player at the relevant existing controls.

All gameplay actions remain explicit player actions.

---

# 19. HIRING SEMANTICS

The player may need to hire someone, but hiring is conditional.

The navigation must not imply:

> hiring is always required.

If an eligible/unassigned employee already exists, the player may assign them.

If no suitable available employee exists under current simulation rules, the player may use the existing hiring flow.

Do not alter hiring logic.

---

# 20. EMPLOYEE-TYPE FIREWALL

Do not require:

> `employee_production_worker`

or any other specific employee type solely for this workforce blocker.

Previous repository analysis established that the relevant Production workforce condition is assignment/headcount based rather than enforcing a specific employee type.

Do not introduce compatibility filtering.

Do not alter simulation rules.

Do not change employee definitions.

---

# 21. WORKER-COUNT FIREWALL

Do not hardcode:

> 1 worker

or:

> 2 workers

into navigation or guidance.

The navigation action exists because the building currently lacks sufficient assigned workforce under existing simulation state.

The Personal screen should expose current assignment controls.

Do not reinterpret recipe worker requirements.

---

# 22. PGD-002-S1 REUSE

Inspect PGD-002-S1 for architectural patterns such as:

- structured navigation intent;
- destination selection;
- contextual focus;
- one-shot consumption;
- clearing pending state.

Reuse the pattern where appropriate.

Do NOT copy:

- Research-specific fields;
- milestone semantics;
- German reason strings;
- technology focus logic.

Extend architecture semantically.

---

# 23. NAVIGATION TYPE DESIGN

If the existing pending Company Operations navigation type needs extension, keep it explicit and typed.

Prefer a discriminated semantic contract over loosely related optional fields.

Conceptual example ONLY:

> reason: workforce_assignment
>
> target: personnel
>
> buildingId: ...

Exact representation must fit current architecture.

Avoid a bag of optional properties where impossible combinations become easy.

Do not overengineer if the current type already has a suitable discriminated structure.

---

# 24. INVALID / STALE BUILDING CONTEXT

Handle a stale or unavailable building context safely.

If the intent references a building that cannot be resolved when Company opens:

- still navigate safely to the Personal surface if appropriate;
- do not crash;
- do not mutate gameplay;
- clear/consume the stale intent;
- do not silently select an unrelated building.

Use current defensive UI conventions.

Do not add a new global error system.

---

# 25. DIRECT NAVIGATION WITHOUT INTENT

Normal player navigation to:

> Unternehmen → Operatives Dashboard → Personal

must remain unchanged.

Without a workforce navigation intent:

- no building should be forcibly focused because of old state;
- no workforce-specific highlight should appear;
- no pending context should be fabricated.

Regression-test this.

---

# 26. MULTIPLE BLOCKED BUILDINGS

Do not design a multi-building workflow.

Each action originates from one affected Production/building context.

Clicking the action for Building A must navigate with:

> Building A

Clicking it later for Building B must navigate with:

> Building B

The most recent explicit player action determines the current intent.

Do not create a queue of navigation intents.

---

# 27. PLAYER-FACING DESTINATION STATE

After successful navigation, the player should be able to understand why they were brought there.

At minimum:

- Personal surface is active;
- affected building assignment context is visible/focused.

If the existing UI already displays the building name in the focused assignment control, reuse it.

Do not add redundant explanatory banners unless needed to make the context understandable.

If a tiny focus cue is necessary, keep it presentation-only and evidence-backed.

---

# 28. NO NEW GAMEPLAY CTA

`Personal verwalten` is a navigation CTA.

It must not invoke:

- hire command;
- assign command;
- production command.

The actual hire/assign controls remain the existing gameplay controls.

This distinction must be visible in tests.

---

# 29. EXPECTED IMPLEMENTATION BOUNDARY

Expected task-owned implementation may include:

- Production blocker presentation/action wiring;
- existing navigation intent type/state extension;
- Company Operations navigation consumer;
- Personal section activation;
- affected-building focus/selection;
- focused tests;
- runtime evidence;
- close-candidate report.

Potential files must be derived from repository truth.

Do not expand beyond these responsibilities.

---

# 30. EXPECTED NON-OWNED AREAS

Do not modify unless a tiny type import/reference is unavoidable:

- Production simulation;
- Research;
- Transport;
- economy;
- saves;
- API schemas;
- building placement;
- tutorial;
- map rendering;
- visual assets.

If substantial changes become necessary there:

STOP.

---

# 31. FOCUSED TEST — ACTION AVAILABILITY

Add/update focused tests proving:

Given:

> Production blocker = `STALLED_WORKFORCE`

Then:

> `Personal verwalten` is available.

Given unrelated blocker/status:

> workforce navigation action is absent.

Use structured state.

Do not construct tests around German guidance parsing.

---

# 32. FOCUSED TEST — INTENT PAYLOAD

When the player activates:

> `Personal verwalten`

assert the emitted/stored navigation intent contains:

- Personal destination semantics;
- affected building identity;
- workforce-assignment reason/context if architecture uses such a discriminator.

Do not merely assert:

> Company opened.

The contextual payload is the core of the slice.

---

# 33. FOCUSED TEST — DESTINATION

Given a valid workforce navigation intent:

assert:

- Company destination opens;
- Operatives Dashboard is selected;
- Personal is selected/active.

Use existing test boundaries where possible.

Do not create an oversized end-to-end unit test if provider/component tests can prove the contract cleanly.

---

# 34. FOCUSED TEST — BUILDING FOCUS

Given:

> intent buildingId = Building A

assert the Personal surface focuses/selects:

> Building A

and not another building.

Use the exact focus representation implemented by current UI architecture.

---

# 35. FOCUSED TEST — ONE-SHOT CONSUMPTION

Prove:

1. workforce intent is applied;
2. intent is consumed/cleared;
3. later normal Company navigation does not reapply the previous Building A focus.

This is mandatory.

Persistent stale focus would be a UX defect.

---

# 36. FOCUSED TEST — NO AUTO-HIRE / NO AUTO-ASSIGN

Where current test architecture permits, prove navigation itself causes no:

- hire command;
- assignment command.

At minimum inspect command/event boundaries and assert no gameplay mutation is triggered by the navigation action.

Do not duplicate domain tests.

---

# 37. FOCUSED TEST — STALE BUILDING

If straightforward:

Given:

> workforce navigation intent references unknown/stale buildingId

assert:

- no crash;
- no unrelated building selected;
- intent consumed safely.

This is recommended if current focus implementation makes the case cheap to test.

---

# 38. EXISTING WORKFORCE GUIDANCE REGRESSION

Verify WORKFORCE-GUIDANCE-001 copy remains present and semantically unchanged.

The new CTA supplements it.

Do not remove the explanatory guidance just because direct navigation now exists.

---

# 39. RUNTIME CERTIFICATION — PRIMARY PATH

Create/reuse a deterministic runtime state containing:

- one building with Production blocked by `STALLED_WORKFORCE`;
- affected building clearly identifiable;
- Personal management available.

Runtime flow:

1. open affected Production surface;
2. verify workforce blocker/guidance;
3. verify `Personal verwalten`;
4. click it;
5. verify Unternehmen opens;
6. verify Operatives Dashboard;
7. verify Personal active;
8. verify affected building context focused;
9. verify no employee was automatically hired;
10. verify no employee was automatically assigned.

This is the primary runtime proof.

---

# 40. RUNTIME CERTIFICATION — PLAYER RECOVERY

Where deterministic without changing gameplay rules:

after contextual navigation, demonstrate that the existing UI presents the controls needed for the player to resolve the problem.

It is NOT necessary to actually hire or assign if doing so complicates deterministic evidence.

The requirement is:

> player lands at the correct actionable existing controls.

Do not turn evidence capture into a gameplay automation slice.

---

# 41. RUNTIME CERTIFICATION — RETURN / STALE INTENT

If feasible in the same runtime evidence:

1. navigate away;
2. return normally to Company/Personal;
3. verify the old workforce intent does not forcibly reapply.

If this is cumbersome to prove visually:

unit/component/provider test evidence is sufficient for one-shot consumption.

Do not create excessive evidence tooling.

---

# 42. VIEWPORT

Primary runtime certification:

> desktop approximately 1440×900

Also perform a bounded narrow check around:

> 480×900

because navigation/focus must remain usable on the narrower shell.

This is not a visual redesign.

Required narrow proof:

- CTA remains reachable/readable;
- destination Personal controls remain usable;
- focused building context is not lost.

Do not fix unrelated responsive issues.

---

# 43. RUNTIME SCREENSHOTS

Prefer evidence equivalent to:

- workforce blocker with `Personal verwalten`;
- destination Personal surface with affected building focus;
- narrow destination/action if needed.

Use repository evidence naming conventions.

Screenshots must show enough surrounding UI to establish:

- source;
- destination;
- context.

Do not submit tightly cropped evidence that makes the navigation result ambiguous.

---

# 44. STRUCTURED-STATE AUDIT

After implementation verify:

- no German guidance string is parsed;
- no CTA visibility depends on rendered copy;
- building context uses authoritative identifier;
- destination uses structured navigation state;
- one-shot intent is explicitly consumed.

Record exact code paths.

---

# 45. COMMAND-SAFETY AUDIT

Verify the navigation action itself does not call:

- hire employee command;
- assign employee command;
- unassign employee command;
- start Production;
- modify building state.

Expected:

> navigation/presentation state only.

---

# 46. SAVE / API AUDIT

Verify no task-owned changes to:

- save schema;
- migrations;
- persisted game state;
- API DTOs;
- API routes;
- domain workforce status.

If any are required:

STOP.

---

# 47. ROOT GATES

After implementation run:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build:web`

Record exact results.

Prior trustworthy baseline:

- typecheck PASS;
- lint 0 errors / 144 warnings;
- tests 283 files / 1072 tests;
- build:web PASS.

Final counts may increase.

Fix all task-owned failures.

Do not repair unrelated WIP.

---

# 48. WORKING-TREE DISCIPLINE

Classify final working tree into:

## Task-owned

Only WORKFORCE-NAV-001 implementation/test/evidence/report/prompt artifacts.

## Unrelated pre-existing WIP

Leave untouched.

Do not stage.

Do not revert.

Do not clean unrelated work.

No commit.
No push.
No tag.

---

# 49. ADJACENT CANDIDATES REMAIN DEFERRED

Do not implement:

- BUILDING-CATEGORY-001;
- BUILDING-STATUS-001;
- TRANSPORT-ROUTE-ID-001;
- WORLD-PRODUCTION-STATUS-001;
- RESEARCH-JOB-ID-001;
- TUTORIAL-ACTIONABILITY-001;
- PDM-001.

The previous PAUSE gate was valid at the time.

WORKFORCE-NAV-001 is proceeding now because the human product decision supplied the previously missing UX contract.

That does not automatically unblock the other candidates.

---

# 50. PRODUCT CONTRACT TRACEABILITY

In the close report explicitly state that the previously missing product contract was resolved as:

> `STALLED_WORKFORCE`
> → `Personal verwalten`
> → Unternehmen / Operatives Dashboard / Personal
> → affected building workforce context
> → player manually hires/assigns as needed.

This is the authoritative WORKFORCE-NAV-001 behavior.

Do not reinterpret it.

---

# 51. CLOSE-CANDIDATE REPORT

Create:

`docs/architecture/reviews/POST_V1_WORKFORCE_NAV_001_CONTEXTUAL_PERSONNEL_NAVIGATION_CLOSE_CANDIDATE.md`

Required structure:

## A. Executive result

## B. Baseline & working tree

## C. Approved product/UX contract

## D. Existing navigation architecture

## E. Architecture-fit result

## F. Structured navigation intent

## G. STALLED_WORKFORCE source action

## H. Company / Operatives / Personal destination

## I. Affected-building focus

## J. One-shot consumption

## K. No-auto-action safety

## L. Focused regression tests

## M. Desktop runtime evidence

## N. Narrow runtime evidence

## O. Structured-state / command-safety audit

## P. Root gates

## Q. Sealed-work integrity

## R. Deferred adjacent issues

## S. Final decision

Keep it concise.

---

# 52. REQUIRED FACTUAL QUESTIONS

Explicitly answer:

1. What branch was implemented?
2. What exact baseline HEAD was used?
3. What was the baseline HEAD subject?
4. What was `origin/master`?
5. Did HEAD equal origin/master?
6. What unrelated WIP existed?
7. Is RESEARCH-METRICS-001 in ancestry?
8. Is RESEARCH-STATUS-001 in ancestry?
9. Is WORKFORCE-GUIDANCE-001 in ancestry?
10. Is TRANSPORT-STATUS-001 in ancestry?
11. Is TIME-UX-R1 in ancestry?
12. What exact existing navigation architecture was reused?
13. What existing PGD-002-S1 navigation pattern was relevant?
14. Where is pending Company Operations navigation state owned?
15. How is it consumed?
16. How is it cleared?
17. Did WORKFORCE-NAV require a new navigation framework?
18. What exact navigation type/state was extended?
19. Is the workforce navigation intent structured?
20. Does it contain Personal destination semantics?
21. Does it contain affected building identity?
22. Does it contain a workforce-assignment discriminator/reason where appropriate?
23. Is the intent transient UI state?
24. Is any part persisted?
25. What exact structured condition exposes `Personal verwalten`?
26. Is that condition `STALLED_WORKFORCE`?
27. Does CTA visibility parse German guidance text?
28. Is `Personal verwalten` absent for unrelated blockers?
29. What exact building identifier is carried?
30. Is building identity derived from display text anywhere?
31. What happens when the CTA is activated?
32. Does Unternehmen open?
33. Does Operatives Dashboard become active?
34. Does Personal become active?
35. Is the affected building workforce context focused?
36. What exact UI mechanism represents that focus?
37. Is the affected building name/context visible to the player?
38. Is any employee automatically hired?
39. Is any employee automatically assigned?
40. Is any employee automatically unassigned?
41. Is Production automatically started?
42. Is gameplay state mutated by navigation itself?
43. Does the existing hiring flow remain unchanged?
44. Does the existing assignment flow remain unchanged?
45. Was any specific employee type made mandatory?
46. Was `employee_production_worker` hardcoded?
47. Was any worker count hardcoded?
48. Was workforce simulation changed?
49. Was `STALLED_WORKFORCE` domain behavior changed?
50. Was WORKFORCE-GUIDANCE copy changed?
51. Does the existing guidance remain visible?
52. Is the intent one-shot?
53. At what point is it consumed?
54. At what point is it cleared?
55. Does later normal Company navigation reapply stale workforce focus?
56. What happens for a stale/unknown buildingId?
57. Can stale context select an unrelated building?
58. Does normal Personal navigation without an intent remain unchanged?
59. Can Building A and Building B each produce their own correct context?
60. Was any intent queue introduced?
61. Did focused action-visibility tests pass?
62. Did intent-payload tests pass?
63. Did destination tests pass?
64. Did building-focus tests pass?
65. Did one-shot-consumption tests pass?
66. Was no-auto-hire/no-auto-assign behavior verified?
67. Was stale-building behavior tested if practical?
68. What deterministic runtime fixture/state was used?
69. Which building was blocked?
70. Was `STALLED_WORKFORCE` visible/verified?
71. Was `Personal verwalten` visible?
72. Did clicking it reach Company?
73. Did it reach Operatives Dashboard?
74. Did it reach Personal?
75. Was the correct affected building focused?
76. Was no automatic hire observed?
77. Was no automatic assignment observed?
78. Did desktop runtime evidence pass?
79. Did narrow runtime evidence pass?
80. What screenshots were captured?
81. Did structured-state audit pass?
82. Did command-safety audit pass?
83. Were save contracts changed?
84. Were API contracts changed?
85. Was any gameplay rule changed?
86. Was Research changed?
87. Was Transport changed?
88. Was Time-UX changed?
89. Were PGD slices changed?
90. Was Tutorial changed?
91. Was PDM changed?
92. Was any art changed?
93. Does Scenario-B remain paused?
94. Did `pnpm typecheck` pass?
95. Did `pnpm lint` pass?
96. How many lint errors/warnings?
97. Did `pnpm test` pass?
98. What was the final test file/test count?
99. Did `pnpm build:web` pass?
100. Was unrelated WIP untouched?
101. Is WORKFORCE-NAV-001 ready for independent closure?
102. Was there any commit?
103. Was there any push?
104. Was there any tag?

---

# 53. STOP CONDITIONS

STOP and return evidence instead of improvising if:

- current navigation architecture cannot support the approved contract without a new global navigation framework;
- affected building identity is unavailable at the blocker action;
- Personal has no bounded way to represent affected-building focus;
- implementing focus requires redesigning Personnel management;
- navigation state would need to be persisted;
- save/API changes become necessary;
- the CTA would need to infer state from German copy;
- implementation requires automatic hiring or assignment;
- implementation requires defining employee-type compatibility;
- implementation requires new Workforce gameplay rules;
- current simulation contradicts the approved headcount/assignment semantics;
- stale intent cannot be consumed safely without material architecture changes;
- task-owned changes cause cross-scope regressions;
- implementation requires reopening sealed work;
- material scope expansion becomes necessary.

Do not invent semantics across a stop condition.

---

# 54. FINAL DECISION

Return exactly ONE.

## OPTION A — CLOSE CANDIDATE / PASS

Use only when:

- approved UX contract implemented;
- structured `STALLED_WORKFORCE` action exists;
- `Personal verwalten` works;
- Company / Operatives / Personal destination works;
- affected building context is carried structurally;
- affected building assignment context is focused;
- intent is one-shot and cleared;
- stale context is safe;
- normal Personal navigation remains unchanged;
- no German-string parsing;
- no automatic hiring;
- no automatic assignment;
- no gameplay mutation from navigation;
- no employee-type rule added;
- no worker count hardcoded;
- Workforce Guidance remains sealed;
- focused tests pass;
- desktop runtime evidence passes;
- narrow runtime evidence passes;
- root gates pass;
- save/API unchanged;
- gameplay unchanged;
- art unchanged;
- unrelated WIP untouched.

State:

> **WORKFORCE-NAV-001:**  
> `CLOSE CANDIDATE / PASS`

> **SOURCE:**  
> `STALLED_WORKFORCE`

> **ACTION:**  
> `Personal verwalten`

> **DESTINATION:**  
> `Unternehmen → Operatives Dashboard → Personal`

> **BUILDING CONTEXT:**  
> `PASS`

> **ONE-SHOT INTENT:**  
> `PASS`

> **AUTO-HIRE:**  
> `NONE`

> **AUTO-ASSIGN:**  
> `NONE`

> **GAMEPLAY:**  
> `UNCHANGED`

> **SAVE / API:**  
> `UNCHANGED`

> **DESKTOP RUNTIME:**  
> `PASS`

> **NARROW RUNTIME:**  
> `PASS`

> **ROOT GATES:**  
> `PASS`

> **ART:**  
> `NONE`

> **COMMIT / PUSH / TAG:**  
> `NONE`

> **READY FOR INDEPENDENT REVIEW:**  
> `YES`

---

## OPTION B — REVISE

Use when the approved architecture fits and the bounded implementation is directionally correct, but task-owned defects remain.

List only exact remaining defects.

Do not fix adjacent candidates.

---

## OPTION C — ARCHITECTURE / SCOPE BLOCKED

Use when the approved product contract cannot be implemented as a bounded extension of existing navigation architecture.

State:

- exact architecture limitation;
- exact missing boundary;
- why a new/global system would be required.

Do not invent a replacement architecture.

---

## OPTION D — PRODUCT CONTRACT CONFLICT

Use only if current repository truth proves the approved UX contract conflicts with an existing authoritative product/gameplay rule.

State exact evidence.

Do not silently override either contract.

---

## OPTION E — BASELINE NOT READY

Use when Git/root baseline cannot be trusted.

---

# 55. DEFINITION OF DONE

This implementation is complete only when:

- [ ] implementation guide read
- [ ] next-material gate read
- [ ] Workforce Guidance close candidate read
- [ ] PGD-002-S1 navigation implementation/report inspected
- [ ] current Company navigation architecture inspected
- [ ] current Personal surface inspected
- [ ] branch recorded
- [ ] exact baseline HEAD recorded
- [ ] baseline subject recorded
- [ ] origin/master recorded
- [ ] HEAD/origin relationship verified
- [ ] unrelated WIP classified
- [ ] sealed ancestry verified
- [ ] approved UX contract recorded
- [ ] architecture-fit check completed before editing
- [ ] existing navigation mechanism reused
- [ ] no parallel navigation framework created
- [ ] STALLED_WORKFORCE structured source verified
- [ ] affected building identity available
- [ ] `Personal verwalten` implemented
- [ ] CTA visibility uses structured state
- [ ] no German guidance parsing
- [ ] structured navigation intent implemented
- [ ] Personal destination represented
- [ ] affected building context represented
- [ ] workforce-assignment semantics represented
- [ ] intent remains transient UI state
- [ ] Company destination opens
- [ ] Operatives Dashboard becomes active
- [ ] Personal becomes active
- [ ] affected building assignment context focused
- [ ] focus mechanism documented
- [ ] no auto-hire
- [ ] no auto-assign
- [ ] no auto-unassign
- [ ] no auto-start Production
- [ ] no employee type requirement added
- [ ] no worker count hardcoded
- [ ] existing hiring behavior unchanged
- [ ] existing assignment behavior unchanged
- [ ] intent consumed once
- [ ] intent cleared after consumption
- [ ] stale intent handled safely
- [ ] normal Personal navigation unchanged
- [ ] multiple source buildings carry correct individual context
- [ ] no intent queue introduced
- [ ] Workforce Guidance copy unchanged
- [ ] action visibility tests PASS
- [ ] intent payload tests PASS
- [ ] destination tests PASS
- [ ] building focus tests PASS
- [ ] one-shot tests PASS
- [ ] no-auto-action safety verified
- [ ] stale-building test added if practical
- [ ] deterministic runtime state established
- [ ] desktop source CTA runtime PASS
- [ ] desktop destination runtime PASS
- [ ] correct building focus runtime PASS
- [ ] no auto-hire runtime PASS
- [ ] no auto-assign runtime PASS
- [ ] narrow CTA usability PASS
- [ ] narrow destination usability PASS
- [ ] runtime screenshots captured
- [ ] structured-state audit PASS
- [ ] command-safety audit PASS
- [ ] no save changes
- [ ] no API changes
- [ ] no gameplay-rule changes
- [ ] no Research changes
- [ ] no Transport changes
- [ ] no Time-UX changes
- [ ] no PGD changes
- [ ] no Tutorial changes
- [ ] no PDM changes
- [ ] no art
- [ ] Scenario-B remains paused
- [ ] root typecheck PASS
- [ ] root lint PASS
- [ ] root tests PASS
- [ ] root build:web PASS
- [ ] unrelated WIP untouched
- [ ] close-candidate report written
- [ ] exactly one final option returned
- [ ] no commit
- [ ] no push
- [ ] no tag

---

# 56. CORE EXECUTION RULE

The product decision is now made.

When Production is blocked by:

> `STALLED_WORKFORCE`

the player gets:

> `Personal verwalten`

That action must take the player directly to:

> Unternehmen → Operatives Dashboard → Personal

with:

> the affected building as structured workforce-assignment context.

The destination must focus the existing assignment context for that building.

Then the player decides what to do.

The game must NOT hire for them.

The game must NOT assign for them.

The game must NOT require a specific employee type unless existing simulation independently requires it.

The game must NOT parse German copy to decide where to navigate.

The navigation context must be transient.

It must be consumed once.

It must not reappear on later normal navigation.

Reuse the existing navigation architecture.

Do not build a parallel system.

Do not redesign Personnel.

Do not change Workforce simulation.

Do not change saves or API.

Do not reopen Workforce Guidance.

Do not reopen Research.

Do not reopen Transport.

Do not implement Tutorial.

Do not implement PDM.

Do not add art.

Implement the smallest correct structured-navigation slice.

Prove the source action.

Prove the destination.

Prove the affected-building focus.

Prove one-shot consumption.

Prove no automatic gameplay action.

Run root gates.

Produce one independently reviewable close candidate.

Then STOP.

# END OF PROMPT