# POST-V1 TRANSPORT-STATUS-001
# Player-Facing Transport Status Labels

## MODE

BOUNDED IMPLEMENTATION.

Implement exactly one semantic presentation family:

> Player-facing Transport status labels.

Do not broaden this into a Transport UX redesign.

Do not change Transport simulation/domain semantics.

Do not change save/API enum values.

Do not modify Research status presentation.

Do not modify Production status presentation.

Do not modify Building status/category presentation.

Do not address Route-ID leakage.

Do not implement Workforce Guidance in this slice.

Do not implement PDM.

Do not modify Tutorial behavior.

No art.

No tag.

Do not commit or push until independent review.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

---

# 1. AUTHORITATIVE PREDECESSOR EVIDENCE

Read:

- `docs/architecture/reviews/POST_V1_NEXT_MATERIAL_SLICE_GATE_AFTER_TIME_UX_R1.md`
- `docs/architecture/reviews/POST_V1_NEXT_MATERIAL_SLICE_GATE_WORKFORCE_GUIDANCE_DELTA.md`

The authoritative previous gate selected:

> `TRANSPORT-STATUS-001 — Player-Facing Transport Status Labels`

The Workforce Guidance delta explicitly preserved this execution order.

Do not rerun either materiality gate.

---

# 2. BASELINE

Before implementation record:

- branch;
- exact HEAD;
- HEAD subject;
- `origin/master`;
- HEAD/origin relationship;
- working-tree status;
- unrelated WIP.

Expected committed baseline from the gates:

`c0395d96933e1b9ae43143a957e6e59baaacef5c`

If HEAD has legitimately advanced, record why and verify that the relevant predecessor work remains present.

Do not absorb unrelated WIP.

---

# 3. PROBLEM

The same Transport domain states currently have inconsistent player-facing presentation.

The authoritative enum is:

`src/domain/transport/TransportOrderStatus.ts`

with:

- `WAITING`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

A presentation formatter already exists:

`apps/web/src/presentation/formatting/presentation-formatters.ts`

→ `formatTransportStatus`

Existing presentation currently includes:

- `WAITING` → `Warteschlange`
- `IN_PROGRESS` → `Unterwegs`
- `COMPLETED` → `Abgeschlossen`
- unknown values → passthrough

The Company dashboard already uses formatted Transport status labels.

However, current player-primary paths still expose raw enum values:

1. dedicated Transport screen job rows;
2. World Map region inspector Transport rows.

This inconsistency is the entire primary defect family for this slice.

---

# 4. REQUIRED ENUM COVERAGE

Verify current enum truth before editing.

The expected authoritative values are:

- `WAITING`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

The final player-facing formatter must deliberately handle all authoritative enum members.

Do not leave `CANCELLED` accidentally dependent on generic passthrough.

Determine the appropriate existing German terminology from current repository/domain/product language.

If current repository truth already establishes the German cancellation terminology, use it.

If no deterministic terminology exists, STOP for product-copy ambiguity rather than inventing gameplay/product terminology.

Unknown/unexpected non-authoritative strings must remain safe and non-throwing.

---

# 5. SEMANTIC AUTHORITY

Maintain one central presentation authority:

`formatTransportStatus`

Do not create:

- component-local status maps;
- World-specific status maps;
- TransportScreen-specific translation switches;
- duplicate enum→German dictionaries.

Preferred architecture:

> internal `TransportOrderStatus`
> → central `formatTransportStatus`
> → player-facing `statusLabel`

Internal status values remain unchanged.

---

# 6. TRANSPORT SCREEN ROWS

Inspect:

`mapTransportJobRowsViewData`

and its associated row view model.

Current defect identified by the gate:

> `statusLabel: order.status`

Replace player-facing status presentation with the central formatter.

The resulting Transport table must display player-facing labels rather than:

- `WAITING`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

where those states are present.

Do not alter:

- route semantics;
- source/destination semantics;
- resource semantics;
- duration semantics;
- Transport commands.

---

# 7. CRITICAL SUMMARY-COUNT FIREWALL

The previous gate identified an important coupling:

`TransportScreen` summary logic currently compares values such as:

> `row.statusLabel === 'IN_PROGRESS'`

Once `statusLabel` becomes localized, this logic MUST NOT start comparing presentation strings.

Do not write:

> `row.statusLabel === 'Unterwegs'`

That would couple application logic to German copy.

Instead preserve/expose the internal status separately where needed.

Preferred shape:

> `status: order.status`
> `statusLabel: formatTransportStatus(order.status)`

Then:

- summary/KPI logic uses `status`;
- visible table text uses `statusLabel`.

Use the smallest architecture-compatible implementation.

Do not change the domain DTO merely for this presentation requirement.

---

# 8. WORLD REGION TRANSPORT ROWS

Inspect:

`mapWorldRegionOperationsViewData`

Current gate evidence identifies raw:

> `statusLabel: order.status`

for Transport entries in the World Map region inspector.

Use the same central `formatTransportStatus`.

World Transport rows and dedicated Transport rows must therefore use the same semantic presentation authority.

Do not modify unrelated World region sections.

In particular, do not repair in this slice:

- raw Building status;
- raw Production status;
- Research status;
- Building categories;
- other World semantic leaks.

Those are separate families.

---

# 9. COMPANY DASHBOARD

The Company dashboard already uses formatted Transport status presentation.

Treat it as regression territory.

Do not rewrite it unnecessarily.

Verify that this slice does not change its semantics.

---

# 10. ROUTE-ID FIREWALL

The previous gate confirmed that the Transport inspector exposes a technical:

> `Route-ID`

This is NOT part of TRANSPORT-STATUS-001.

Do not fix it here.

Do not hide it.

Do not rename it.

Do not redesign the inspector.

Record it as deferred semantic-ID debt in the close candidate.

---

# 11. RESOURCE / BUILDING LABEL FIREWALL

The gate found no primary Transport-table leakage requiring repair for:

- resource IDs;
- building IDs.

Do not reopen those presentation families without hard contradictory evidence.

Do not broaden the slice based on opportunistic cleanup.

---

# 12. RESEARCH FIREWALL

Research job statuses are a separate confirmed family.

Do not add:

`formatResearchStatus`

in this task.

Do not repair Research raw statuses.

Record as deferred.

---

# 13. PRODUCTION FIREWALL

Production operational states are outside this slice.

Do not alter:

- `formatProductionStatus`;
- `STALLED_WORKFORCE`;
- `STALLED_ENERGY`;
- Production hints;
- Production summary cards;
- workforce guidance.

The newly confirmed:

`WORKFORCE-GUIDANCE-001 — Production Workforce Blocker Actionability`

is explicitly queued AFTER this slice.

Do not absorb it.

---

# 14. BUILDING PRESENTATION FIREWALL

Do not repair:

- BuildingCategory;
- building status;
- Buildings catalog category labels.

Separate semantic family.

---

# 15. GAMEPLAY FIREWALL

TRANSPORT-STATUS-001 is presentation-only.

Must remain unchanged:

- TransportOrderStatus domain values;
- Transport state transitions;
- Transport duration;
- Transport routing;
- resource movement;
- order creation;
- order completion;
- cancellation behavior;
- economy;
- tick/cycle behavior.

No rebalance.

---

# 16. SAVE / API FIREWALL

Do not change:

- persisted Transport status values;
- API Transport status values;
- request payloads;
- response contracts;
- save schema;
- migrations.

Raw enums may continue internally.

Only player-facing presentation changes.

---

# 17. UNKNOWN FALLBACK

Preserve robust fallback behavior.

An unknown/unexpected status must:

- not throw;
- not render blank;
- not corrupt summary logic.

The existing formatter's passthrough behavior may remain for genuinely unknown values.

All currently authoritative enum members, however, should be explicitly covered if product terminology is deterministic.

---

# 18. FOCUSED TESTS — FORMATTER

Add/update focused formatter tests covering all authoritative Transport statuses.

Expected assertions should include current deterministic labels for:

- `WAITING`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

Also verify unknown fallback behavior if supported by the formatter contract.

Tests should protect central semantic authority.

---

# 19. FOCUSED TESTS — TRANSPORT VIEW DATA

Add/update tests for `mapTransportJobRowsViewData`.

Verify:

- internal status remains available for logic where required;
- `statusLabel` is player-facing;
- source/destination names remain unchanged;
- no gameplay values are mutated.

At minimum exercise representative:

- waiting;
- in-progress;
- completed.

Include cancelled if fixture construction is straightforward.

---

# 20. FOCUSED TESTS — SUMMARY COUNTS

Explicitly test the Transport summary behavior after localization.

The key regression to prevent:

> localization causes running/waiting/completed counts to become zero or incorrect.

Tests must prove summary classification uses internal status semantics, NOT localized `statusLabel`.

Do not parse German labels to recover status.

---

# 21. FOCUSED TESTS — WORLD

Add/update tests for the World region operations mapper.

Verify Transport rows use:

`formatTransportStatus`

semantics.

Do not alter assertions for unrelated World semantic families unless necessary because existing tests directly cover the same object shape.

Do not opportunistically localize other statuses.

---

# 22. RUNTIME CERTIFICATION

Runtime-certify the player-facing result.

Preferred state:

a deterministic session containing representative Transport orders.

Where feasible demonstrate:

- one `WAITING`;
- one `IN_PROGRESS`;
- one `COMPLETED`.

If `CANCELLED` cannot legitimately remain visible in current runtime, formatter/unit evidence is sufficient for that enum member.

Required runtime surface A:

> Transport screen @ approximately 1440×900

Verify:

- raw enum status strings are absent from visible Transport status cells;
- German status labels are visible;
- summary counts remain correct.

Required runtime surface B:

> World Map → region inspector → Transport section

Verify:

- Transport rows use the same player-facing labels;
- raw Transport enum values are absent from those scoped rows.

Do not require unrelated raw enums elsewhere on World to disappear.

---

# 23. NARROW VIEWPORT

Perform a bounded narrow check around:

> 480×900

only if the localized Transport labels affect layout/wrapping.

This is not a responsive redesign.

If no regression is observed, record PASS.

Do not alter global shell layout.

---

# 24. SCOPED RAW-ENUM AUDIT

After implementation, perform a scoped audit for the authoritative Transport enum values on the owned player-facing surfaces.

Owned surfaces:

- dedicated Transport job rows;
- World region Transport rows.

Expected active raw presentation occurrences:

> 0

Internal code/test/API/domain occurrences are expected and must not be treated as defects.

Do not turn this into a repository-wide enum cleanup.

---

# 25. ROOT GATES

Run the required root gates:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build:web`

Record exact results.

Expected baseline before this task:

- typecheck PASS;
- lint PASS with 0 errors;
- test PASS;
- build:web PASS.

If a gate fails:

classify task-owned vs pre-existing/unrelated.

Fix task-owned defects before returning the close candidate.

Do not hide failures.

---

# 26. WORKING-TREE DISCIPLINE

The repository may contain unrelated WIP.

Before and after implementation classify:

- task-owned files;
- pre-existing unrelated files;
- generated/transient files.

Do not absorb unrelated:

- BVI assets;
- doc mass moves/deletes;
- pilots;
- saves;
- `.next`;
- visual/design artifacts;
- unrelated evidence tooling.

Do not clean unrelated WIP unless explicitly required.

---

# 27. EXPECTED TASK-OWNED CHANGE SHAPE

Prefer a small change set around:

- central presentation formatter;
- workspace/Transport view mapper;
- World region operations mapper;
- Transport row/view-model type if needed for internal status;
- focused tests;
- bounded runtime evidence;
- one close-candidate report.

Avoid broad refactors.

If implementation begins touching many unrelated screens, STOP and reassess scope.

---

# 28. CLOSE CANDIDATE REPORT

Create:

`docs/architecture/reviews/POST_V1_TRANSPORT_STATUS_001_PLAYER_FACING_TRANSPORT_STATUS_LABELS_CLOSE_CANDIDATE.md`

Required structure:

## A. Executive result

## B. Baseline & working tree

## C. Authoritative status contract

## D. Pre-fix defect evidence

## E. Implementation

## F. Internal status vs presentation separation

## G. Transport screen result

## H. World region result

## I. Formatter coverage

## J. Focused tests

## K. Runtime evidence

## L. Scoped raw-enum audit

## M. Root gates

## N. Deferred semantic families

## O. Final decision

Keep it evidence-focused.

---

# 29. REQUIRED FACTUAL QUESTIONS

Explicitly answer:

1. What branch was implemented?
2. What exact baseline HEAD was used?
3. What was `origin/master`?
4. What unrelated WIP existed?
5. What authoritative Transport status type was used?
6. What are all authoritative enum values?
7. What German label is used for `WAITING`?
8. What German label is used for `IN_PROGRESS`?
9. What German label is used for `COMPLETED`?
10. What German label is used for `CANCELLED`?
11. What happens for unknown statuses?
12. Which formatter is the central authority?
13. Did any duplicate local status map get introduced?
14. Which Transport mapper exposed raw status before the fix?
15. Which World mapper exposed raw status before the fix?
16. Does the Transport row model now preserve internal status separately where required?
17. Does visible `statusLabel` use the central formatter?
18. Do summary counts use internal status?
19. Do summary counts avoid German-string comparison?
20. Are WAITING counts correct?
21. Are IN_PROGRESS counts correct?
22. Are COMPLETED counts correct?
23. Does localization alter Transport simulation?
24. Does localization alter order state transitions?
25. Does localization alter duration/routing?
26. Does localization alter save data?
27. Does localization alter API contracts?
28. Does the Company dashboard remain semantically unchanged?
29. Are resource labels unchanged?
30. Are building labels unchanged?
31. Is Route-ID still explicitly out of scope?
32. Is Research status still explicitly out of scope?
33. Is Production status still explicitly out of scope?
34. Is BuildingCategory still explicitly out of scope?
35. Is Workforce Guidance still explicitly queued separately?
36. Were formatter tests added/updated?
37. Were Transport mapper tests added/updated?
38. Were summary-count regression tests added/updated?
39. Were World Transport mapper tests added/updated?
40. Did focused tests pass?
41. Was Transport runtime certified?
42. Was World Transport runtime certified?
43. Are raw Transport enum strings absent from scoped Transport status cells?
44. Are raw Transport enum strings absent from scoped World Transport rows?
45. Was narrow viewport checked where relevant?
46. What is the final scoped raw-enum count?
47. Did `pnpm typecheck` pass?
48. Did `pnpm lint` pass?
49. How many lint errors/warnings?
50. Did `pnpm test` pass?
51. What is the final test file/test count?
52. Did `pnpm build:web` pass?
53. Were any task-owned regressions found?
54. Were unrelated WIP files left untouched?
55. Were any sealed families reopened?
56. Was any art added?
57. Did Scenario-B remain paused?
58. Is TRANSPORT-STATUS-001 ready for independent closure?
59. What remains deferred?
60. Was there any commit/push/tag?

---

# 30. STOP CONDITIONS

STOP and return evidence rather than guessing if:

- authoritative Transport status enum differs materially from gate evidence;
- `CANCELLED` has no deterministic product terminology and requires a product-copy decision;
- Transport summary semantics cannot be preserved without changing application/domain behavior;
- mapper architecture requires a material API/save change;
- runtime evidence reveals a broader Transport workflow defect that cannot be separated;
- sealed work would need to be reopened;
- task-owned changes cause cross-scope regression;
- implementation requires material scope expansion.

Do not invent a solution across a stop condition.

---

# 31. FINAL DECISION

Return exactly ONE.

## OPTION A — CLOSE CANDIDATE / PASS

Use only when:

- all authoritative statuses have deterministic player-facing handling;
- owned Transport rows are localized;
- owned World Transport rows are localized;
- internal status is preserved for logic;
- summary counts remain correct;
- no German-copy logic coupling exists;
- focused tests pass;
- runtime evidence passes;
- scoped raw-enum audit passes;
- root gates pass;
- no gameplay/save/API change occurred;
- no scope expansion occurred.

State:

> **TRANSPORT-STATUS-001:**  
> `CLOSE CANDIDATE / PASS`

> **PLAYER-FACING STATUS AUTHORITY:**  
> `TransportOrderStatus → formatTransportStatus`

> **TRANSPORT SCREEN:**  
> `PASS`

> **WORLD TRANSPORT ROWS:**  
> `PASS`

> **SUMMARY SEMANTICS:**  
> `PASS — INTERNAL STATUS`

> **GAMEPLAY:**  
> `UNCHANGED`

> **SAVE / API:**  
> `UNCHANGED`

> **ART:**  
> `NONE`

> **WORKFORCE-GUIDANCE-001:**  
> `DEFERRED / NEXT QUEUED SLICE`

> **COMMIT / PUSH / TAG:**  
> `NONE`

> **READY FOR INDEPENDENT REVIEW:**  
> `YES`

---

## OPTION B — REVISE

Use if the bounded implementation is fundamentally correct but task-owned defects remain.

List only the exact remaining defects.

Do not start unrelated cleanup.

---

## OPTION C — PRODUCT COPY DECISION REQUIRED

Use if an authoritative status — especially `CANCELLED` — lacks deterministic player-facing terminology.

State the exact missing terminology decision.

Do not invent it.

---

## OPTION D — ARCHITECTURE / SCOPE BLOCKED

Use if the required fix cannot remain presentation-only or bounded.

State exact evidence.

---

# 32. DEFINITION OF DONE

This implementation is complete only when:

- [ ] implementation guide read
- [ ] previous material gate read
- [ ] Workforce Guidance delta read
- [ ] baseline recorded
- [ ] working tree classified
- [ ] authoritative Transport enum verified
- [ ] all authoritative enum members enumerated
- [ ] central formatter verified
- [ ] CANCELLED handling explicitly decided from existing authority
- [ ] unknown fallback preserved
- [ ] raw Transport screen status path identified
- [ ] raw World Transport status path identified
- [ ] Transport row presentation localized
- [ ] World Transport row presentation localized
- [ ] internal Transport status preserved for logic
- [ ] summary counts use internal status
- [ ] no summary logic compares German labels
- [ ] no duplicate status map introduced
- [ ] Company dashboard regression-checked
- [ ] Route-ID left out of scope
- [ ] Research status left out of scope
- [ ] Production status left out of scope
- [ ] Building status/category left out of scope
- [ ] Workforce Guidance left out of scope
- [ ] PDM left out of scope
- [ ] Tutorial left out of scope
- [ ] no gameplay change
- [ ] no save change
- [ ] no API change
- [ ] no art
- [ ] formatter tests complete
- [ ] Transport mapper tests complete
- [ ] summary regression tests complete
- [ ] World Transport mapper tests complete
- [ ] focused tests PASS
- [ ] Transport runtime PASS
- [ ] World Transport runtime PASS
- [ ] narrow check performed if relevant
- [ ] scoped raw-enum audit = 0 on owned visible surfaces
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

# 33. CORE EXECUTION RULE

This is a presentation-consistency repair.

The Transport domain already knows its states.

The presentation layer already knows how to translate most of them.

Use that authority everywhere this slice owns.

Do not change domain state to improve UI text.

Do not make summary logic depend on translated text.

Keep:

> internal status for logic

and:

> formatted status for players.

Do not repair Route-ID.

Do not repair Research status.

Do not repair Production status.

Do not repair Building categories.

Do not absorb Workforce Guidance.

`WORKFORCE-GUIDANCE-001` is explicitly queued after this slice.

Finish exactly one semantic family.

Produce one independently reviewable close candidate.

Then STOP.

# END OF PROMPT