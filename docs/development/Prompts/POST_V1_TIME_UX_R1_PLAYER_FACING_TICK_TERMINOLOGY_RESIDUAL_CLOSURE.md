# POST-V1 TIME-UX-R1 — Player-Facing Tick Terminology Residual Closure
# Bounded Presentation Consistency Implementation

## MODE

BOUNDED implementation + verification of exactly one approved material slice:

> TIME-UX-R1 — Player-Facing Tick Terminology Residual Closure

The approved player-facing time model already exists:

- internal simulation ticks remain internal;
- player-facing time uses `Zyklus / Zyklen`;
- presentation mapping remains 1 cycle = 1 existing tick;
- no rebalance;
- no simulation timing change;
- speed control remains game speed;
- existing migrated surfaces remain authoritative examples.

This slice closes the remaining ACTIVE player-facing `Tick` / `Ticks` terminology on the approved current surfaces.

This is a PRESENTATION CONSISTENCY repair.

It is NOT a simulation redesign.

It is NOT a time rebalance.

It is NOT a save/API migration.

It is NOT a broad localization cleanup.

It is NOT PDM work.

It is NOT Transport-status work.

It is NOT Tutorial work.

It is NOT Building-category cleanup.

It is NOT art work.

Return ONE consolidated close candidate.

No commit.
No push.
No tag.

---

# 1. READ FIRST

Read:

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/architecture/reviews/POST_V1_NEXT_MATERIAL_SLICE_GATE_AFTER_PGD_RES_001.md`

Also inspect CURRENT implementation of:

- `apps/web/src/presentation/formatting/player-cycle-presentation.ts`
- its tests
- `company-dashboard-view-mappers.ts`
- `company-operations-table-mappers.tsx`
- `executive-dashboard-view-mappers.ts`
- relevant dashboard chart components/mappers
- `src/application/facade/GameSessionDashboardBuilder.ts`
- existing Simulation Controls / Game Workspace time presentation
- Production Recipe Catalog duration presentation
- relevant tests for all changed surfaces

Use current repository truth.

Do not copy historical line numbers blindly.

---

# 2. BASELINE PRECONDITION

Before modifying anything verify:

- branch;
- exact HEAD;
- HEAD subject;
- `origin/master`;
- whether HEAD matches `origin/master`;
- working-tree status;
- unrelated WIP.

Verify from Git history that the accepted baseline includes:

- PGD-RES-001;
- PGD-002-S1 Baseline Lint Integrity Repair.

Expected historical references from the gate were:

- PGD-RES-001 commit `d472791`;
- PGD-002-S1 lint repair commit `7f36b0c`.

Use current Git truth if HEAD has legitimately advanced.

Do not reset unrelated work.

Do not absorb unrelated WIP.

If the approved commits are unexpectedly absent from the current baseline:

STOP with:

> BASELINE PRECONDITION NOT MET

and explain exactly what is missing.

---

# 3. BASELINE QUALITY HEALTH

Before implementation establish current root health according to the implementation guide.

At minimum:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build:web`

The accepted gate baseline was green.

If current baseline has a new unrelated root failure:

classify it before implementation.

Do not silently fix unrelated debt under TIME-UX-R1.

If trustworthy implementation/certification cannot proceed because baseline integrity is broken:

STOP.

---

# 4. SEALED PLAYER-FACING TIME CONTRACT

The existing time presentation contract is authoritative.

Player-facing terminology:

> `Zyklus`
> `Zyklen`

Internal terminology may remain:

> tick
> ticks
> tickNumber
> durationTicks
> intervalTicks
> elapsedTicks
> currentTick
> similar domain/API identifiers

The existence of internal `tick` identifiers is NOT a defect.

The defect is:

> player-visible presentation copy exposes `Tick` / `Ticks` where the approved presentation model requires `Zyklus` / `Zyklen`.

Do not rename internal domain concepts merely for presentation consistency.

---

# 5. PRESENTATION AUTHORITY

Primary authority:

`apps/web/src/presentation/formatting/player-cycle-presentation.ts`

Inspect its current exports and behavior before changing anything.

Reuse existing helpers wherever they already express the desired semantics.

Examples may include current equivalents of:

- cycle position;
- duration;
- per-cycle rate;
- singular/plural cycle labels.

Extend this presentation module ONLY when an approved player-facing pattern is genuinely missing.

Do not duplicate Zyklus grammar independently across multiple mappers if a small central helper is appropriate.

Do not turn this into a general i18n framework.

---

# 6. PRESERVE 1 CYCLE = 1 TICK PRESENTATION MAPPING

This slice must preserve:

> 1 player-facing Zyklus = 1 existing internal tick

for presentation purposes.

Examples:

- internal `1 tick` → player sees `1 Zyklus`
- internal `2 ticks` → player sees `2 Zyklen`
- internal current tick `42` → player position may show `Zyklus 42`
- internal interval `10 ticks` → player sees `alle 10 Zyklen`
- internal rate `/ tick` → player sees `/ Zyklus`

Do NOT:

- multiply values;
- divide values;
- convert to seconds/minutes/hours/days;
- change simulation speed;
- change job duration;
- change cooldowns;
- change production timing;
- change tax intervals;
- change payroll intervals;
- change historical event timing.

This is presentation only.

---

# 7. FIRST ACTION — EXACT CURRENT RESIDUAL AUDIT

Before editing, perform a targeted current audit for player-facing:

- `Tick`
- `Ticks`
- `/ Tick`
- `/Tick`
- `tick` where interpolated into visible copy

Search relevant web/application presentation paths.

Do NOT classify every internal identifier as a defect.

Build a before table:

| ID | File / surface | Current visible copy pattern | Classification | In TIME-UX-R1? |
|---|---|---|---|---|

Classify each occurrence as one of:

- `TIME-A` — active player-facing Tick/Ticks terminology defect;
- `TIME-B` — already correct Zyklus/Zyklen presentation;
- `TIME-C` — internal/domain/API identifier, not player-facing;
- `TIME-D` — test fixture/assertion for internal semantics;
- `TIME-E` — debug/dev-only technical output;
- `TIME-F` — dead/unreachable/not proven player-facing;
- `TIME-G` — separate semantic family not authorized here.

Only `TIME-A` belongs to this repair.

---

# 8. APPROVED SURFACE FAMILY

The materiality gate identified active residuals on these families:

## A. Company dashboard

Current examples included:

- header `Tick N`;
- payroll `/ 10 Ticks`;
- tax/contract intervals `alle N Ticks`;
- inspector construction/duration `N Ticks`;
- ledger timestamps `Tick N`.

Likely implementation area:

`company-dashboard-view-mappers.ts`

Use current truth.

## B. Company operations

Current example:

- tax subtitle `alle N Ticks`.

Likely area:

`company-operations-table-mappers.tsx`

## C. Executive dashboard

Current example:

- company summary `Tick ${tickLabel}`.

Likely area:

`executive-dashboard-view-mappers.ts`

## D. Dashboard charts

Current examples included:

- empty hints such as `Führen Sie Ticks aus…`;
- tooltips such as `Tick ${label}`.

Gate identified 5+ chart widgets.

Inspect the actual current chart family.

## E. Shared dashboard/player-facing hints

Current gate identified in:

`GameSessionDashboardBuilder.ts`

including:

- Production auto-transport estimate `~N Ticks`;
- economy/tutorial-style player-facing hint strings containing values such as `20 Ticks` / `30 Ticks`.

Repair only confirmed active player-facing time copy.

Do not assume historical line numbers.

---

# 9. SAME-FAMILY RULE

This slice is intended to CLOSE the active player-facing Tick/Ticks terminology family.

Therefore:

If the targeted audit finds another clearly active player-facing `Tick/Ticks` string that:

- expresses the same approved time-unit semantics;
- has the same authoritative Zyklus mapping;
- requires no gameplay/product decision;
- is presentation-only;

include it in TIME-UX-R1 even if it was omitted from the historical gate inventory.

Document it.

However, do NOT use this rule to expand into:

- status enums;
- category enums;
- resource IDs;
- route IDs;
- gameplay timing changes;
- new progress systems;
- tutorial navigation;
- general copy rewriting.

---

# 10. DO NOT BLINDLY REPLACE TEXT

No repository-wide search-and-replace.

Each changed occurrence must be semantically classified.

Examples:

`Tick 42`

may mean:

> `Zyklus 42`

while:

`10 Ticks`

may mean:

> `10 Zyklen`

and:

`1 Tick`

must be:

> `1 Zyklus`

A rate may require:

> `/ Zyklus`

An interval may require:

> `alle N Zyklen`

A chart instruction may need natural player-facing German rather than mechanically replacing one token.

Preserve the original meaning.

Do not redesign unrelated copy.

---

# 11. SINGULAR / PLURAL

Correct player-facing grammar is required.

Use:

- `1 Zyklus`
- `N Zyklen` for N ≠ 1 where appropriate.

Do not introduce:

- `1 Zyklen`
- `2 Zyklus`

If the existing presentation authority already handles singular/plural:

reuse it.

If a tiny helper is needed:

add it to the existing presentation authority and test it.

Do not create parallel grammar helpers in multiple components.

---

# 12. CYCLE POSITION

Where the value represents a current/historical absolute simulation position and existing approved semantics map it to a player-facing cycle position:

use the existing cycle-position presentation.

Expected semantic form:

> `Zyklus N`

Do not convert absolute tick positions into durations.

Do not change the numeric value.

---

# 13. DURATION

Where a value represents a duration:

use the existing duration presentation contract.

Expected forms:

> `1 Zyklus`
> `N Zyklen`

Do not prepend `Zyklus` as though the duration were an absolute position.

Preserve the numeric value exactly.

---

# 14. INTERVALS

Where the current copy expresses:

> every N ticks

player-facing presentation should preserve that meaning using cycles.

Expected semantic form:

> `alle N Zyklen`

or the grammatically correct equivalent already established by the presentation authority.

Do not change the interval.

---

# 15. RATES

Where current player-facing copy expresses a per-tick rate:

use the approved per-cycle presentation.

Expected semantic family:

> `/ Zyklus`

Prefer existing `formatPerCycleRate` or current equivalent where appropriate.

Do not change the underlying numeric rate.

Do not convert economy calculations.

---

# 16. CHARTS

Inspect every chart occurrence individually.

For chart tooltips representing absolute time position:

prefer the established cycle-position presentation.

For empty-state/instructional copy:

replace technical Tick language with natural Zyklus language while preserving meaning.

Do not change:

- chart datasets;
- X values;
- sampling;
- aggregation;
- sorting;
- tooltip numeric source;
- chart libraries;
- visual styling.

Only presentation copy/formatting is in scope.

---

# 17. HISTORICAL / LEDGER COPY

Historical events may show an absolute time position.

Approved presentation model:

> `Zyklus N`

or an already established equivalent such as:

> `vor N Zyklen`

ONLY where current semantics deterministically support that relationship.

Do not invent relative-time calculations.

If the existing value is simply an absolute tick number:

preserve it as an absolute cycle number.

---

# 18. PRODUCTION AUTO-TRANSPORT HINT

The materiality gate identified player-facing copy equivalent to:

> `~${durationTicks} Ticks`

in a Production/dashboard hint.

Change presentation terminology only.

Preserve:

- same duration value;
- same approximation semantics;
- same transport behavior;
- same availability logic;
- same hint conditions;
- same resource semantics.

Expected family:

> `~N Zyklen`

with singular handled correctly if N can be 1.

Do NOT change Transport status labels in this slice.

---

# 19. ECONOMY / TUTORIAL-LIKE DASHBOARD HINTS

The gate identified current player-facing builder strings with examples such as:

- `20 Ticks`
- `30 Ticks`

Inspect exact current semantics.

If these are active player-facing duration/interval strings:

convert them to the corresponding cycle presentation.

Do NOT redesign Tutorial.

Do NOT add tutorial navigation.

Do NOT change thresholds or timings.

Only replace the presentation unit.

---

# 20. INTERNAL TICK FIREWALL

The following are explicitly allowed to remain tick-based internally:

- `tick`
- `ticks`
- `tickNumber`
- `durationTicks`
- `intervalTicks`
- `createdAtTick`
- `completedAtTick`
- DTO/API field names
- domain event fields
- simulation engine concepts
- scheduler logic
- save serialization
- test setup using tick values

Do not rename these simply to make search results disappear.

Residual source-code occurrences are expected.

The post-fix audit must distinguish internal occurrences from player-visible copy.

---

# 21. SIMULATION FIREWALL

Do not modify:

- simulation cadence;
- tick execution;
- game loop;
- pause behavior;
- 1×/2× speed behavior;
- scheduler;
- timers;
- progression math.

TIME-UX-R1 has zero simulation impact.

---

# 22. BALANCE FIREWALL

Do not change:

- construction durations;
- production durations;
- research durations;
- transport durations;
- payroll intervals;
- tax intervals;
- contract intervals;
- tutorial thresholds;
- economy values.

Numbers remain identical.

Only player-facing unit terminology changes.

---

# 23. SAVE / API FIREWALL

Do not change:

- save schema;
- migrations;
- serialization;
- API DTO fields;
- API field names;
- request/response contracts.

No `tickNumber → cycleNumber` migration.

No `durationTicks → durationCycles` API rename.

Presentation consumes existing internal values.

---

# 24. PGD FIREWALL

Do not modify semantic behavior from:

- PGD-001;
- PGD-TECH-001;
- PGD-002-S1;
- PGD-RES-001.

Specifically preserve:

- milestone labels;
- technology labels;
- Buildings prerequisite navigation;
- Research focus behavior;
- milestone navigation behavior;
- Production resource labels;
- unknown-ID fallbacks.

If a shared builder hint contains both a resource label and Tick terminology:

change only the time presentation portion.

---

# 25. TRANSPORT FIREWALL

Do NOT fix raw Transport statuses such as:

- `IN_PROGRESS`
- `WAITING`
- `COMPLETED`

That is a separate ready candidate.

Do not expand into Transport IA.

Only an approved Tick/Ticks duration appearing inside a shared player-facing hint belongs here.

---

# 26. RESEARCH STATUS FIREWALL

Do not fix raw Research job statuses.

They are a separate presentation family.

---

# 27. BUILDING CATEGORY FIREWALL

Do not fix raw categories such as:

- `PRODUCTION`
- `INFRASTRUCTURE`

That is a separate semantic-label family.

---

# 28. PDM FIREWALL

Do not touch:

- X/Y placement inputs;
- World Map placement;
- map click behavior;
- map→Position mapping;
- placement preview.

PDM-001 remains blocked on a product/UX contract.

---

# 29. TUTORIAL FIREWALL

Do not:

- add tutorial buttons;
- add tutorial navigation;
- change tutorial progression;
- alter tutorial completion logic.

Only active Tick/Ticks terminology inside already existing player-facing hint copy may be repaired.

---

# 30. ART FIREWALL

No image generation.

No asset changes.

No ICON work.

No BVI work.

No MVI work.

No World Map visual redesign.

Scenario-B remains paused.

---

# 31. TEST STRATEGY

Add or update focused tests before relying on runtime evidence.

## Presentation authority tests

If existing helper behavior is sufficient:

preserve its tests.

If extending the authority:

test at minimum:

- singular duration;
- plural duration;
- absolute cycle position if helper added/changed;
- interval if helper added;
- rate if helper changed.

## Mapper tests

Add/update representative assertions for:

- Company absolute position;
- Company duration/interval;
- Company Operations interval;
- Executive summary;
- at least representative chart tooltip/empty-state behavior.

## Builder tests

Assert representative player-facing hints:

- Production auto-transport duration uses Zyklus/Zyklen;
- economy/tutorial-like active hints use cycle terminology;
- underlying values are unchanged.

Do not merely assert that the word `Tick` disappeared.

Assert correct semantic output.

---

# 32. SEALED REGRESSION TESTS

Run focused regression tests for existing migrated time surfaces where practical:

- Simulation Controls;
- Game Workspace shell;
- Production Recipe Catalog duration.

The objective is to ensure TIME-UX-R1 does not regress already-correct Zyklus presentation.

Also run relevant PGD builder tests if `GameSessionDashboardBuilder.ts` changes.

---

# 33. POST-FIX RESIDUAL AUDIT

After implementation repeat the targeted audit.

Produce:

| ID | File / surface | Post-fix classification | Player-visible Tick/Ticks remains? | Reason |
|---|---|---|---|---|

Required target:

> 0 unresolved `TIME-A` occurrences inside the approved active player-facing family.

Do NOT claim:

> repository contains zero `tick` strings.

That would be false and undesirable.

Internal/domain/API/test tick terminology remains legitimate.

---

# 34. PROGRAMMATIC PLAYER-COPY CHECK

Where practical, add a bounded programmatic assertion over the relevant presentation outputs.

The check should prove:

- expected `Zyklus/Zyklen` copy exists;
- scoped player-facing `Tick/Ticks` does not remain.

Do not scan:

- serialized application state;
- API payloads;
- DOM attributes;
- source maps;
- internal field names.

Scope only player-visible copy.

---

# 35. RUNTIME CERTIFICATION — REQUIRED

Runtime certification is required for OPTION A.

Use legitimate deterministic application state.

Do not inject fake component props.

Do not patch rendered text.

Do not alter domain timing to manufacture evidence.

Certify at least:

1. Company dashboard/operations;
2. Production hint containing a time estimate;
3. one chart state that previously exposed Tick/Ticks.

If one exact historical occurrence is no longer reachable in current runtime:

document why and certify another active occurrence from the same family.

---

# 36. COMPANY RUNTIME EVIDENCE

At approximately:

> 1440×900

certify Company/Operations player-facing time copy.

Capture at least one surface showing one or more of:

- `Zyklus N`;
- `N Zyklen`;
- `alle N Zyklen`;
- `/ Zyklus`.

The corresponding visible scoped copy must not contain `Tick` / `Ticks`.

Suggested evidence filename:

`docs/architecture/reviews/evidence/TIME_UX_R1_COMPANY_CYCLE_TERMINOLOGY_DESKTOP_1440x900.png`

Use repository naming conventions if they differ.

---

# 37. PRODUCTION RUNTIME EVIDENCE

Certify a legitimate Production state where the auto-transport/time estimate is visible.

Required assertions:

- same numeric duration as internal source;
- player-facing unit is Zyklus/Zyklen;
- raw Tick/Ticks terminology absent from the scoped hint;
- resource-label behavior from PGD-RES-001 remains correct.

Suggested evidence filename:

`docs/architecture/reviews/evidence/TIME_UX_R1_PRODUCTION_CYCLE_HINT_DESKTOP_1440x900.png`

Do not trigger gameplay merely for evidence unless the established evidence fixture legitimately contains the state.

---

# 38. CHART RUNTIME EVIDENCE

Certify at least one chart occurrence that previously showed player-facing Tick/Ticks.

Preferred examples:

- tooltip absolute position;
- empty-state instruction.

Prove the current equivalent uses Zyklus terminology.

Suggested evidence filename:

`docs/architecture/reviews/evidence/TIME_UX_R1_CHART_CYCLE_TERMINOLOGY_DESKTOP_1440x900.png`

If a tooltip requires hover:

use deterministic evidence tooling.

---

# 39. NARROW VIEWPORT CHECK

At approximately:

> 480×900

spot-check the changed player-facing time copy.

Focus on longer strings such as:

- `alle N Zyklen`;
- multi-part Production hints;
- Company table/subtitle copy.

Required:

- no destructive clipping caused by TIME-UX-R1;
- no task-owned horizontal overflow;
- terminology remains readable.

Capture a narrow screenshot if the changed copy materially wraps.

Suggested filename:

`docs/architecture/reviews/evidence/TIME_UX_R1_CYCLE_TERMINOLOGY_NARROW_480x900.png`

Do not redesign responsive layout in this slice.

---

# 40. RUNTIME STATE INTEGRITY

Evidence collection must not silently alter gameplay semantics.

Record whether evidence tooling:

- loads an existing save;
- creates a deterministic evidence fixture;
- navigates only;
- executes ticks;
- starts production;
- buys resources;
- changes research;
- changes buildings.

If ticks must be executed solely to reach a chart state, use existing supported runtime behavior and record it.

Do not modify timing values.

---

# 41. BEFORE / AFTER SEMANTIC TABLE

Include representative examples:

| Surface | Internal value | Before | After | Numeric value changed? |
|---|---:|---|---|---|
| Company position | 42 ticks | `Tick 42` | `Zyklus 42` | NO |
| Interval | 10 ticks | `alle 10 Ticks` | `alle 10 Zyklen` | NO |
| Production estimate | 5 ticks | `~5 Ticks` | `~5 Zyklen` | NO |

Use actual current examples and values.

Do not fabricate numbers merely to fill the table.

---

# 42. ROOT QUALITY GATES

After focused tests and runtime certification run:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build:web`

Record exact current results.

Do not copy historical test counts.

Expected:

> all root gates PASS.

Do not repair unrelated warnings.

---

# 43. DIFF AUDIT

Before closing, audit every task-owned changed file.

Expected families:

- central player-cycle presentation formatter/tests if needed;
- Company mapper/tests;
- Company Operations mapper/tests;
- Executive mapper/tests;
- chart presentation/tests;
- narrow `GameSessionDashboardBuilder` hint copy/tests;
- evidence tooling/fixtures;
- runtime PNG evidence;
- close candidate report.

No domain/simulation/save/API/content/art files should change.

If they do:

explain why.

If not strictly required by the approved presentation slice:

revert/exclude them.

---

# 44. TASK-LOCAL REPAIR POLICY

If implementation introduces an obvious task-local defect:

fix it before returning the close candidate.

Examples:

- wrong singular/plural;
- missed active TIME-A occurrence in the approved family;
- chart tooltip still says Tick;
- a mapper test fails because expected copy was not updated;
- evidence script has a task-owned lint error;
- narrow changed copy is destructively clipped.

Do not create unnecessary review loops for trivial defects.

Return one consolidated close candidate.

---

# 45. STOP CONDITIONS

STOP rather than expanding scope if:

1. baseline commits are missing;
2. root baseline integrity is unexpectedly broken;
3. an occurrence requires changing gameplay timing;
4. Zyklus mapping is ambiguous for an active surface;
5. a player-facing Tick value does not map 1:1 to the approved cycle semantics;
6. save/API migration appears necessary;
7. a fix requires domain/simulation changes;
8. scope expands into Transport status enums;
9. scope expands into Research status enums;
10. scope expands into Building category labels;
11. scope expands into PDM;
12. scope expands into Tutorial navigation;
13. scope expands into general localization/i18n;
14. scope expands into art;
15. unrelated WIP prevents trustworthy runtime certification.

Return exact blocker evidence.

Do not invent semantics.

---

# 46. CLOSE CANDIDATE REPORT

Create:

`docs/architecture/reviews/POST_V1_TIME_UX_R1_PLAYER_FACING_TICK_TERMINOLOGY_RESIDUAL_CLOSURE_CLOSE_CANDIDATE.md`

Required structure:

## A. Executive result

## B. Repository baseline

## C. Approved player-facing time contract

## D. Pre-fix Tick/Ticks residual audit

## E. Presentation authority

## F. Implementation

## G. Singular/plural behavior

## H. Company / Operations repair

## I. Executive repair

## J. Chart repair

## K. Dashboard / Production hint repair

## L. Post-fix residual audit

## M. Runtime — Company

## N. Runtime — Production

## O. Runtime — Chart

## P. Narrow viewport

## Q. Gameplay / Simulation / Save / API firewalls

## R. PGD / deferred-family firewalls

## S. Focused tests

## T. Root quality gates

## U. Diff ownership

## V. Deferred issues

## W. Final decision

Keep the report evidence-focused.

Do not turn it into another product review.

---

# 47. REQUIRED TABLES

Include at minimum:

## Residual audit table

| ID | Surface | Before | Classification | Action |

## Semantic before/after table

| Surface | Internal value | Before | After | Value changed? |

## Runtime evidence table

| Surface | State | Expected player copy | Raw Tick/Ticks visible? | Evidence |

## Firewall table

| Area | Changed? | Evidence / note |

## Residual post-fix table

| Occurrence | Classification | Player-facing defect remains? |

## Gate table

| Gate | Result |

## Diff ownership table

| File | Why changed | Presentation only? |

---

# 48. REQUIRED FACTUAL QUESTIONS

Explicitly answer:

1. What branch is the implementation based on?
2. What exact HEAD is the baseline?
3. Does HEAD match `origin/master`?
4. Is PGD-RES-001 present in baseline history?
5. Is the PGD-002-S1 lint repair present in baseline history?
6. Was baseline root health green before implementation?
7. What is the authoritative player-facing time formatter/module?
8. What exact player-facing unit is approved?
9. Does 1 Zyklus still equal 1 internal tick for presentation?
10. Was any conversion factor introduced?
11. How many active TIME-A occurrences were found before repair?
12. Which surfaces contained them?
13. Were any historical gate occurrences no longer active?
14. Were any additional active same-family occurrences found?
15. Did any internal/domain/API tick identifier get renamed?
16. Did any simulation logic change?
17. Did game speed semantics change?
18. Did any timing value change?
19. Did any construction duration change?
20. Did any production duration change?
21. Did any research duration change?
22. Did any transport duration change?
23. Did any payroll/tax/contract interval change?
24. Did any save schema change?
25. Did any API field/contract change?
26. How is singular `1` presented?
27. How are plural durations presented?
28. How are absolute time positions presented?
29. How are intervals presented?
30. How are per-cycle rates presented?
31. Were Company dashboard Tick/Ticks residuals repaired?
32. Were Company Operations residuals repaired?
33. Was Executive copy repaired?
34. Were active chart residuals repaired?
35. Was Production auto-transport time copy repaired?
36. Were active economy/tutorial-like builder time strings repaired?
37. Does PGD-RES-001 resource-label behavior remain unchanged?
38. Did Transport status enums change?
39. Did Research status enums change?
40. Did Building category enums change?
41. Did PDM change?
42. Did Tutorial navigation change?
43. Did any art change?
44. Does Scenario-B remain paused?
45. How many unresolved TIME-A occurrences remain after repair?
46. Was Company runtime certified?
47. What exact Company copy was observed?
48. Was Production runtime certified?
49. What exact Production time copy was observed?
50. Was a chart runtime occurrence certified?
51. What exact chart copy was observed?
52. Was narrow viewport checked?
53. Was task-owned overflow introduced?
54. Were focused tests green?
55. Does root typecheck pass?
56. Does root lint pass?
57. Does full root test pass?
58. What is the current test count?
59. Does build:web pass?
60. Which task-owned files changed?
61. Were unrelated WIP files excluded?
62. Is the slice ready to close?

---

# 49. FINAL DECISION

Return exactly ONE.

## OPTION A — TIME-UX-R1 COMPLETE

Use only when:

- approved baseline is present;
- baseline integrity is healthy;
- active player-facing TIME-A family was audited;
- all approved active Tick/Ticks presentation defects are repaired;
- central Zyklus presentation authority is reused;
- singular/plural semantics are correct;
- numeric values are unchanged;
- 1 Zyklus = 1 internal tick remains intact;
- no simulation changes;
- no balance changes;
- no save/API changes;
- no internal-ID rename campaign;
- Company runtime is certified;
- Production runtime is certified;
- chart runtime is certified;
- narrow viewport is checked;
- post-fix unresolved TIME-A count is 0;
- PGD sealed behavior remains intact;
- Transport statuses unchanged;
- Research statuses unchanged;
- Building categories unchanged;
- PDM unchanged;
- Tutorial navigation unchanged;
- art unchanged;
- focused tests pass;
- typecheck passes;
- lint passes;
- full tests pass;
- build:web passes;
- task-owned diff is clean.

State:

> **TIME-UX-R1:**  
> `COMPLETE`

> **PLAYER-FACING TIME UNIT:**  
> `ZYKLUS / ZYKLEN`

> **PRESENTATION MAPPING:**  
> `1 ZYKLUS = 1 INTERNAL TICK`

> **UNRESOLVED ACTIVE TIME-A OCCURRENCES:**  
> `0`

> **SIMULATION / BALANCE:**  
> `UNCHANGED`

> **SAVE / API:**  
> `UNCHANGED`

> **COMPANY RUNTIME:**  
> `PASS`

> **PRODUCTION RUNTIME:**  
> `PASS`

> **CHART RUNTIME:**  
> `PASS`

> **NARROW VIEWPORT:**  
> `PASS`

> **PGD-001 / PGD-TECH-001 / PGD-002-S1 / PGD-RES-001:**  
> `UNCHANGED / SEALED`

> **TRANSPORT / RESEARCH STATUS ENUMS:**  
> `UNCHANGED / DEFERRED`

> **BUILDING CATEGORY ENUMS:**  
> `UNCHANGED / DEFERRED`

> **PDM-001:**  
> `UNCHANGED / BLOCKED ON PRODUCT CONTRACT`

> **NEW ART:**  
> `NONE`

> **SCENARIO-B:**  
> `REMAINS PAUSED`

> **ROOT GATES:**  
> `PASS`

> **READY FOR INDEPENDENT REVIEW:**  
> `YES`

---

## OPTION B — TIME-UX SEMANTIC AMBIGUITY DISCOVERED

Use if an active player-facing Tick/Ticks occurrence cannot safely map to the approved Zyklus semantics without inventing behavior.

State:

- exact surface;
- current value semantics;
- why 1:1 presentation mapping is not justified;
- decision required.

Do not guess.

---

## OPTION C — TIME-UX-R1 IMPLEMENTATION / RUNTIME BLOCKED

Use if:

- baseline integrity prevents work;
- required runtime state cannot be established;
- Company/Production/chart certification cannot be completed;
- unrelated WIP prevents trustworthy verification;
- required repair crosses an explicit firewall.

State:

- exact blocker;
- completed implementation/evidence;
- missing evidence;
- whether production changes were made.

Do not claim completion.

---

# 50. DEFINITION OF DONE

TIME-UX-R1 is complete only when:

- [ ] implementation guide read
- [ ] materiality gate read
- [ ] current time presentation authority inspected
- [ ] current tests inspected
- [ ] branch recorded
- [ ] exact HEAD recorded
- [ ] origin/master recorded
- [ ] HEAD/origin relationship established
- [ ] PGD-RES-001 baseline presence verified
- [ ] PGD-002-S1 lint repair baseline presence verified
- [ ] unrelated WIP classified
- [ ] baseline typecheck established
- [ ] baseline lint established
- [ ] baseline tests established
- [ ] baseline build:web established
- [ ] exact current Tick/Ticks residual audit completed
- [ ] every candidate occurrence classified
- [ ] TIME-A family identified
- [ ] internal tick identifiers preserved
- [ ] presentation authority reused
- [ ] no duplicate time grammar introduced unnecessarily
- [ ] singular `1 Zyklus` correct
- [ ] plural `N Zyklen` correct
- [ ] absolute positions use approved cycle presentation
- [ ] durations use approved cycle presentation
- [ ] intervals use approved cycle presentation
- [ ] per-cycle rates use approved cycle presentation
- [ ] Company dashboard residuals repaired
- [ ] Company Operations residuals repaired
- [ ] Executive residuals repaired
- [ ] active chart residuals repaired
- [ ] Production auto-transport time hint repaired
- [ ] active same-family builder strings repaired
- [ ] numeric values unchanged
- [ ] no conversion factor introduced
- [ ] simulation unchanged
- [ ] speed semantics unchanged
- [ ] balance unchanged
- [ ] construction timing unchanged
- [ ] production timing unchanged
- [ ] research timing unchanged
- [ ] transport timing unchanged
- [ ] payroll/tax/contract intervals unchanged
- [ ] save schema unchanged
- [ ] API contracts unchanged
- [ ] PGD-001 unchanged
- [ ] PGD-TECH-001 unchanged
- [ ] PGD-002-S1 unchanged
- [ ] PGD-RES-001 unchanged
- [ ] Transport status enums unchanged
- [ ] Research status enums unchanged
- [ ] Building category enums unchanged
- [ ] PDM unchanged
- [ ] Tutorial navigation unchanged
- [ ] art unchanged
- [ ] Scenario-B remains paused
- [ ] focused presentation tests pass
- [ ] focused mapper tests pass
- [ ] focused builder tests pass
- [ ] sealed time-surface regressions pass
- [ ] post-fix residual audit completed
- [ ] unresolved TIME-A count = 0
- [ ] Company runtime certified
- [ ] Company screenshot captured
- [ ] Production runtime certified
- [ ] Production screenshot captured
- [ ] chart runtime certified
- [ ] chart evidence captured
- [ ] narrow viewport checked
- [ ] no task-owned destructive overflow
- [ ] runtime evidence did not alter timing semantics
- [ ] root typecheck passes
- [ ] root lint passes
- [ ] full tests pass
- [ ] build:web passes
- [ ] exact current gate results recorded
- [ ] final diff audited
- [ ] unrelated WIP excluded
- [ ] close candidate written
- [ ] exactly one final option returned
- [ ] no commit
- [ ] no push
- [ ] no tag

---

# 51. CORE EXECUTION RULE

The simulation still runs on ticks.

The player does not need to see that implementation detail.

The approved presentation model is already:

> Zyklus / Zyklen

with:

> 1 Zyklus = 1 existing internal tick

for presentation only.

TIME-UX-R1 closes the remaining player-facing terminology inconsistency.

Do not rebalance time.

Do not rename domain/API fields.

Do not change simulation.

Do not change saves.

Do not change API contracts.

Do not alter numeric durations or intervals.

Do not fix Transport statuses.

Do not fix Research statuses.

Do not fix Building categories.

Do not start PDM.

Do not redesign Tutorial.

Do not touch art.

Audit the active player-facing family.

Use the existing presentation authority.

Repair all confirmed same-family TIME-A occurrences.

Prove unresolved TIME-A = 0.

Certify Company, Production, chart, and narrow runtime presentation.

Run all root gates.

Return ONE consolidated close candidate.

Then STOP.

# END OF PROMPT