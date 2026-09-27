# POST-V1 TIME-UX-R1 — Runtime Evidence Completion
# Production Auto-Transport Cycle Hint Certification

## MODE

EVIDENCE-ONLY completion for the already implemented:

> TIME-UX-R1 — Player-Facing Tick Terminology Residual Closure

Independent review status:

> REVISE — IMPLEMENTATION PASS CANDIDATE / PRODUCTION RUNTIME CONTRACT INCOMPLETE

The TIME-UX-R1 implementation is FROZEN.

Do NOT redesign it.

Do NOT extend the time-UX family.

Do NOT refactor the formatter.

Do NOT change player-facing time semantics.

Do NOT start another material slice.

This task closes exactly ONE missing evidence item:

> certify the real Production runtime path that renders the auto-transport estimate previously expressed as `~N Ticks`, and prove that the actual player-facing runtime now renders the equivalent `~N Zyklus/Zyklen` presentation with the same numeric value.

The existing close candidate already provides:

- Company runtime PASS;
- Chart runtime PASS;
- Narrow viewport PASS;
- post-fix TIME-A audit = 0;
- focused tests PASS;
- root typecheck PASS;
- root lint PASS;
- full tests PASS;
- build:web PASS.

Do not redo implementation merely because this evidence pass exists.

Return ONE updated close candidate.

Update the EXISTING TIME-UX-R1 close candidate.

Do not create a second TIME-UX-R1 close report.

No commit.
No push.
No tag.

---

# 1. READ FIRST

Read:

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/development/Prompts/POST_V1_TIME_UX_R1_PLAYER_FACING_TICK_TERMINOLOGY_RESIDUAL_CLOSURE.md`
- `docs/architecture/reviews/POST_V1_TIME_UX_R1_PLAYER_FACING_TICK_TERMINOLOGY_RESIDUAL_CLOSURE_CLOSE_CANDIDATE.md`

Inspect current relevant implementation and evidence tooling, especially:

- `src/application/facade/GameSessionDashboardBuilder.ts`
- `src/application/facade/player-facing-cycle-label.ts`
- its tests
- Production presentation path
- transport-related Production hint rendering
- existing TIME-UX-R1 runtime capture tooling
- existing deterministic evidence fixtures
- existing Production/transport E2E or evidence saves

Use CURRENT repository truth.

---

# 2. INDEPENDENT REVIEW FINDING

The current close candidate is NOT rejected for implementation quality.

Independent review accepted as credible:

- existing Zyklus/Zyklen presentation contract;
- 1 Zyklus = 1 internal tick presentation mapping;
- Company repair;
- Company Operations repair;
- Executive repair;
- chart repair;
- same-family Tick/Ticks residual closure;
- post-fix TIME-A count = 0;
- simulation/balance/save/API firewalls;
- PGD firewalls;
- Company runtime;
- Chart runtime;
- Narrow viewport;
- focused tests;
- root gates.

The remaining gap is narrow:

The close candidate states that the Production auto-transport blocker was changed to:

> `(~N Zyklen)`

but the runtime fixture did not expose that exact hint.

The Production evidence instead certified generic recipe-duration cycle copy.

That does NOT directly prove the repaired auto-transport builder hint traverses the real runtime path correctly.

This task must close that exact evidence gap.

---

# 3. BASELINE RECORD

Before evidence work record:

- branch;
- exact HEAD;
- HEAD subject;
- `origin/master`;
- HEAD/origin relationship;
- working-tree status;
- TIME-UX-R1 task-owned WIP;
- unrelated WIP.

TIME-UX-R1 is expected to remain uncommitted pending independent closure.

Do not commit it.

Do not reset/stash unrelated user work destructively.

---

# 4. IMPLEMENTATION FREEZE

The following TIME-UX-R1 production implementation is FROZEN:

- `player-cycle-presentation.ts`
- `player-facing-cycle-label.ts`
- Company mapper changes
- Operations mapper changes
- Executive mapper changes
- chart changes
- `GameSessionDashboardBuilder.ts`
- Market/Reports/Load/workspace cycle presentation
- Supply Chain cycle presentation

Do NOT modify these files during evidence completion.

Allowed changes are limited to evidence/certification artifacts such as:

- deterministic evidence-fixture builder;
- task-specific evidence fixture if required;
- runtime capture script;
- screenshot evidence;
- EXISTING close candidate report.

If runtime certification discovers that the actual Production path still renders incorrect Tick/Ticks terminology because of a genuine TIME-UX-R1 implementation defect:

STOP.

Do not silently repair production code.

Return:

> OPTION B — TIME-UX-R1 IMPLEMENTATION DEFECT DISCOVERED DURING RUNTIME CERTIFICATION

State the exact defect.

---

# 5. EXACT EVIDENCE TARGET

The target is NOT generic Production cycle copy.

The target is specifically the Production auto-transport/time-estimate hint whose pre-fix semantic form was:

> `~N Ticks`

and whose repaired semantic form should be:

> `~N Zyklen`

or, if N = 1:

> `~1 Zyklus`

The exact surrounding sentence may differ according to current runtime truth.

Do not force a historical literal if the current UI wraps this value in additional legitimate copy.

The required proof is:

1. the real Production runtime path is mounted;
2. the real auto-transport estimate hint is visible;
3. its numeric value N is known;
4. the visible player-facing unit is Zyklus/Zyklen;
5. `Tick` / `Ticks` is absent from that scoped hint;
6. N is unchanged from the underlying internal duration value;
7. no gameplay timing semantics were altered.

---

# 6. TRACE THE REAL RUNTIME CONDITION FIRST

Before constructing evidence state, trace exactly what makes the auto-transport hint appear.

Document:

- originating builder method;
- exact condition(s);
- relevant recipe state;
- relevant building state;
- relevant resource/inventory state;
- transport/logistics state;
- route/availability requirement if any;
- duration source;
- whether the hint appears for a blocker, estimate, or another Production state;
- exact internal field supplying N.

Do not guess.

Do not mutate saves until the rendering condition is understood.

---

# 7. NUMERIC SOURCE AUTHORITY

Identify the exact source of the displayed N.

Record:

- internal field/property;
- raw numeric value;
- semantic meaning;
- whether it is an absolute position, duration, interval, or estimate.

Expected semantic class:

> approximate duration / transport estimate

but use current code truth.

Prove that TIME-UX-R1 changes only its presentation label.

Required relationship:

> internal N before formatting = visible N after formatting

No conversion factor.

No rounding change unless the pre-existing presentation already applies one.

---

# 8. LEGITIMATE EVIDENCE STATE ORDER

Use the least invasive legitimate state source.

Preferred order:

1. existing valid save that naturally exposes the auto-transport hint;
2. existing deterministic E2E/evidence fixture that exposes it;
3. deterministic transform of an existing valid save;
4. task-specific deterministic evidence fixture preserving current save schema and gameplay semantics.

Do not modify canonical gameplay content merely to expose the hint.

Do not alter recipe YAML.

Do not alter transport durations.

Do not alter resource definitions.

Do not alter building definitions.

Do not alter game rules.

---

# 9. FIXTURE RULES

If a dedicated evidence fixture is required:

it may modify only the minimum legitimate runtime state required to expose the existing hint.

Document every changed field.

For each field record:

| Field | Source value | Evidence value | Why required | Gameplay rule changed? |
|---|---:|---:|---|---|

Expected final column:

> NO

The fixture must remain valid under the existing save schema.

Do not introduce impossible domain state.

Do not fabricate component props.

Do not bypass builder logic.

---

# 10. PREFERRED STATE REUSE

Inspect existing Production/transport saves and fixtures before creating anything new.

Candidates may include:

- existing M11/M12 E2E saves;
- Production closeout saves;
- PGD-RES-001 evidence fixture;
- transport-related evidence fixtures;
- other deterministic saves already used by current tests/evidence.

Reuse is preferred if it legitimately exposes the hint.

Do not select a fixture merely because it is convenient if the required runtime condition is absent.

---

# 11. NO FAKE RENDERING

Forbidden:

- directly rendering the component with injected fake props;
- monkeypatching builder output;
- modifying DOM text after render;
- intercepting API payloads to rewrite the hint;
- hardcoding expected text into capture tooling;
- hiding Tick/Ticks with CSS;
- screenshot editing;
- changing source code solely for evidence;
- changing formatter behavior;
- changing recipe/transport timing.

The screenshot must come from the actual application runtime path.

---

# 12. RUNTIME HEALTH FIRST

Before concluding that evidence cannot be captured, verify runtime health.

Check:

- API dev server;
- web dev server;
- session load;
- active session/workspace;
- dashboard/WebSocket state where relevant;
- Production route;
- client hydration;
- evidence fixture load sequence.

Use lessons from prior evidence work:

load deterministic session state through the supported server path BEFORE navigating into the target application screen when required by the current architecture.

Do not use arbitrary long sleeps as the primary synchronization mechanism.

Prefer explicit readiness assertions.

---

# 13. ALLOWED RUNTIME RECOVERY

If development runtime is stale/broken, allowed recovery includes:

- stop dev servers;
- clear generated `.next` cache;
- rebuild generated runtime artifacts;
- restart API/web dev servers;
- reinstall/use existing Playwright browser tooling if locally missing;
- reload deterministic evidence state.

Do not modify product code to solve an environment problem.

Document meaningful recovery actions.

---

# 14. PRODUCTION RUNTIME CERTIFICATION

At approximately:

> 1440×900

navigate through the legitimate application runtime to:

> Production

and expose the actual auto-transport estimate.

Required visible evidence:

- Production screen mounted;
- Recipe Catalog / relevant Production context visible;
- exact auto-transport estimate visible;
- `~N Zyklus/Zyklen` visible;
- no `Tick` / `Ticks` in the SAME scoped hint;
- relevant recipe/building context identifiable.

Do not use whole-page text absence as the primary assertion.

Use the narrowest stable DOM scope corresponding to the hint.

---

# 15. REQUIRED PROGRAMMATIC ASSERTIONS

The capture/evidence script must programmatically establish at least:

1. active application/session;
2. Production screen mounted;
3. target recipe or Production row identified;
4. target auto-transport hint exists;
5. hint contains expected numeric N;
6. hint contains expected Zyklus/Zyklen presentation;
7. hint does NOT contain `Tick` or `Ticks`;
8. underlying N matches the builder/source duration used for the hint where it can be deterministically asserted;
9. PGD-RES-001 player-facing resource label behavior remains intact on the relevant Production surface if that label is present.

Do not assert against unrelated DOM text.

---

# 16. EXPECTED TEXT LOGIC

Derive the expected text from actual state.

Do not hardcode an arbitrary N merely because a previous example used `5`.

If:

> N = 1

expected unit:

> `Zyklus`

If:

> N != 1

expected unit:

> `Zyklen`

Preserve approximation marker:

> `~`

if the current hint semantics use it.

---

# 17. NUMERIC INTEGRITY PROOF

The evidence must explicitly record:

| Field | Value |
|---|---|
| Recipe / operation | ... |
| Internal duration field | ... |
| Internal numeric N | ... |
| Visible numeric N | ... |
| Before terminology | `Tick/Ticks` semantic family |
| Runtime terminology | `Zyklus/Zyklen` |
| Numeric value changed? | NO |

This is important because TIME-UX-R1 is presentation-only.

---

# 18. PGD-RES-001 REGRESSION PROOF

The Production evidence should also verify that the already sealed resource-label behavior remains intact wherever the relevant state displays a resource requirement.

For example, if the chosen legitimate state contains `wood` internally and the player-facing hint is visible:

player copy should still use:

> `Holz`

not:

> `wood`

Do not force a resource blocker into the state solely for this check if doing so would prevent the auto-transport hint.

If both cannot coexist naturally:

use existing focused PGD-RES regression tests as the supporting proof and state that runtime coexistence was not forced.

Do not alter gameplay state unnaturally just to combine evidence.

---

# 19. GAMEPLAY INTEGRITY

Prefer evidence collection consisting of:

> load + navigate + inspect + screenshot

Do not execute gameplay commands if a deterministic fixture can expose the state.

Specifically avoid unless genuinely required:

- starting Production;
- buying resources;
- selling resources;
- creating transport orders;
- changing routes;
- researching;
- placing buildings;
- executing arbitrary simulation cycles.

If an existing legitimate saved state already contains an active condition:

use it.

---

# 20. NO TRANSPORT-STATUS SCOPE EXPANSION

The auto-transport duration hint is in scope because it is a TIME-UX-R1 repaired time string.

Transport status enums remain OUT OF SCOPE.

Do not fix:

- `IN_PROGRESS`
- `WAITING`
- `COMPLETED`

Do not touch Transport table presentation.

Do not redesign transport workflow.

---

# 21. NO OTHER TIME-UX IMPLEMENTATION

Do not revisit:

- Company mapper copy;
- Executive copy;
- chart copy;
- Market;
- Reports;
- Load Game;
- workspace event labels;
- Supply Chain;
- tutorial cycle strings;

unless runtime evidence proves a genuine implementation defect.

Their existing code/tests/evidence remain accepted for this completion pass.

This task is not a second residual audit.

---

# 22. EXISTING EVIDENCE REMAINS VALID

Do not regenerate existing screenshots merely for freshness unless the evidence setup requires it.

Previously accepted evidence includes:

- Company desktop;
- Chart desktop;
- Narrow viewport.

Preserve those artifacts.

Add/replace only the Production evidence needed to prove the exact auto-transport hint.

---

# 23. PRODUCTION EVIDENCE FILE

Preferred screenshot path:

`docs/architecture/reviews/evidence/TIME_UX_R1_PRODUCTION_AUTO_TRANSPORT_CYCLE_HINT_DESKTOP_1440x900.png`

If repository conventions require another exact filename, document it.

The screenshot must make the relevant Production context and target hint legible.

Do not create a giant screenshot if a normal viewport captures the required evidence.

---

# 24. OPTIONAL NARROW AUTO-TRANSPORT CHECK

A second 480×900 capture of this exact hint is NOT mandatory unless:

- the legitimate hint is long enough to introduce a task-owned wrap/overflow concern;
- or the desktop evidence reveals a layout issue.

The existing TIME-UX-R1 narrow certification remains valid for the general terminology change.

If you do capture narrow auto-transport evidence:

verify no destructive clipping and record it.

Do not redesign layout.

---

# 25. POST-EVIDENCE IMPLEMENTATION DIFF CHECK

After runtime certification verify:

- no frozen TIME-UX-R1 production source changed during this evidence pass;
- only evidence/certification artifacts changed.

Required statement:

> PRODUCTION IMPLEMENTATION CHANGED DURING EVIDENCE COMPLETION: NO

If production source changed:

classify why.

If it changed because a defect was found:

OPTION B, not OPTION A.

---

# 26. TESTS

Because production implementation is frozen, do not add redundant implementation tests merely for activity.

Re-run the focused tests most directly supporting the target hint:

- `player-facing-cycle-label.test.ts`;
- relevant `GameSessionDashboardBuilder.test.ts`.

Also re-run PGD-RES-001 formatter/builder regression if appropriate.

Record exact results.

---

# 27. ROOT QUALITY GATES

After evidence completion run:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build:web`

Record exact CURRENT results.

Do not copy the previous:

> 1057 tests

without rerunning.

All root gates must be truthfully reported.

If an unrelated baseline failure appears:

classify it.

Do not silently fix it.

---

# 28. POST-EVIDENCE TIME-A CHECK

Do not perform another broad implementation campaign.

Run a bounded verification that the already-repaired auto-transport hint source still contains no player-facing Tick/Ticks terminology.

Confirm:

> auto-transport hint TIME-A = 0

This complements the existing broader TIME-A = 0 audit.

---

# 29. UPDATE THE EXISTING CLOSE CANDIDATE

Update ONLY:

`docs/architecture/reviews/POST_V1_TIME_UX_R1_PLAYER_FACING_TICK_TERMINOLOGY_RESIDUAL_CLOSURE_CLOSE_CANDIDATE.md`

Do NOT create:

- a second TIME-UX-R1 close report;
- a separate evidence-completion close report.

Add a clearly dated/runtime-evidence-completion delta.

Preserve the original implementation record.

---

# 30. REQUIRED REPORT DELTA

The updated report must clearly state:

## Runtime evidence completion result

- why prior Production evidence was insufficient;
- exact real runtime condition required;
- exact evidence-state source;
- exact recipe/operation;
- exact internal duration source;
- exact N;
- exact visible hint;
- scoped raw Tick/Ticks result;
- whether PGD-RES behavior remained intact;
- screenshot path.

## Implementation freeze

State:

- frozen source files unchanged;
- no formatter changes;
- no builder changes;
- no gameplay changes.

## Current root gates

Use current rerun results.

---

# 31. REPLACE THE PRIOR PRODUCTION QUALIFICATION

The current close candidate says in substance:

> Production runtime PASS, but transport `~N` was not in fixture.

If evidence succeeds, replace that qualification with direct certification.

Expected final status:

> **PRODUCTION AUTO-TRANSPORT RUNTIME:**  
> `PASS`

Do not leave contradictory text elsewhere in the report claiming the target hint was still unreachable.

Historical context may state that the first pass lacked the state, but final gate sections must reflect the completed evidence.

---

# 32. REQUIRED EVIDENCE TABLE

Include/update:

| Surface | Runtime state | Internal N | Visible copy | Scoped Tick/Ticks? | Evidence |
|---|---|---:|---|---|---|
| Production auto-transport | ... | ... | `~N Zyklen` | NO | ... |

Use actual values.

---

# 33. REQUIRED STATE TABLE

If a fixture/transform was needed include:

| State field changed for evidence | Original | Evidence value | Why | Semantic rule changed? |
|---|---|---|---|---|

Every row must be auditable.

Do not hide state manipulation.

---

# 34. REQUIRED FIREWALL TABLE

Include:

| Area | Changed during evidence completion? |
|---|---|
| TIME-UX production implementation | NO |
| Simulation | NO |
| Timing values | NO |
| Save schema | NO |
| API | NO |
| Recipe YAML | NO |
| Transport rules | NO |
| PGD-RES implementation | NO |
| Transport statuses | NO |
| Art | NO |

If any answer differs:

explain it.

---

# 35. REQUIRED FACTUAL QUESTIONS

Explicitly answer:

1. What branch is the evidence completion based on?
2. What exact HEAD is the baseline?
3. Does HEAD match `origin/master`?
4. Is TIME-UX-R1 still uncommitted?
5. Which unrelated WIP was excluded?
6. Why was the original Production runtime evidence insufficient?
7. What exact code path creates the auto-transport estimate?
8. What exact condition makes it visible?
9. What recipe/operation was used?
10. What building/context was used?
11. What resource/transport condition was required?
12. What exact internal field supplies N?
13. What is the exact internal N?
14. What is the exact visible N?
15. Are internal and visible N identical?
16. Was any conversion factor applied?
17. What exact visible auto-transport hint was observed?
18. Does it use `Zyklus` or `Zyklen` correctly?
19. Is the approximation marker preserved?
20. Is `Tick` absent from the scoped hint?
21. Is `Ticks` absent from the scoped hint?
22. Was the actual Production runtime mounted?
23. Was the target hint programmatically located?
24. Was the screenshot captured from the real runtime path?
25. Was component prop injection used?
26. Was DOM text patched?
27. Was API response rewriting used?
28. Was CSS used to hide old terminology?
29. Was any recipe YAML changed?
30. Was any transport duration changed?
31. Was any simulation timing changed?
32. Was any save schema changed?
33. Was any API contract changed?
34. Was any TIME-UX production implementation changed during this pass?
35. Was `GameSessionDashboardBuilder.ts` changed during this pass?
36. Was `player-facing-cycle-label.ts` changed during this pass?
37. Was `player-cycle-presentation.ts` changed during this pass?
38. Was PGD-RES-001 implementation changed?
39. Does PGD-RES regression still pass?
40. Was gameplay executed to create evidence?
41. If yes, exactly what and why?
42. What fixture/save supplied the runtime state?
43. If transformed, exactly which fields changed?
44. Is the state valid under current save schema?
45. Does focused cycle-label testing pass?
46. Does focused builder testing pass?
47. Does root typecheck pass?
48. Does root lint pass?
49. Does full root test pass?
50. What is the current test count?
51. Does build:web pass?
52. Does bounded auto-transport TIME-A remain 0?
53. What new evidence artifacts were created?
54. Was the existing close candidate updated rather than duplicated?
55. Are Company runtime results still accepted?
56. Are Chart runtime results still accepted?
57. Is the existing narrow result still accepted?
58. Are Transport status enums unchanged?
59. Is PDM unchanged?
60. Is Tutorial navigation unchanged?
61. Is art unchanged?
62. Does Scenario-B remain paused?
63. Is the exact Production runtime evidence gap now closed?
64. Is TIME-UX-R1 ready for independent final closure?

---

# 36. STOP CONDITIONS

STOP rather than expanding scope if:

1. the actual runtime hint still renders Tick/Ticks;
2. the visible N differs unexpectedly from the internal duration source;
3. certification requires changing TIME-UX production code;
4. certification requires changing gameplay timing;
5. certification requires changing recipe YAML;
6. certification requires changing transport rules;
7. certification requires changing save schema;
8. the target hint cannot be reached without inventing invalid state;
9. current code shows that the historical `~N` hint is dead/unreachable by design;
10. unrelated WIP prevents trustworthy runtime certification;
11. runtime health cannot be restored without product changes;
12. another material TIME-UX semantic ambiguity is discovered.

Do not hide these findings.

---

# 37. FINAL DECISION

Return exactly ONE.

## OPTION A — TIME-UX-R1 RUNTIME EVIDENCE COMPLETE

Use only when:

- real Production runtime is mounted;
- actual auto-transport estimate is visible;
- exact internal N is known;
- exact visible N matches;
- correct Zyklus/Zyklen grammar is visible;
- approximation semantics are preserved;
- scoped Tick/Ticks is absent;
- no production implementation changed;
- no timing/gameplay semantics changed;
- PGD-RES remains intact;
- focused tests pass;
- root typecheck passes;
- root lint passes;
- full tests pass;
- build:web passes;
- existing close candidate is updated;
- evidence artifact exists.

State:

> **TIME-UX-R1 RUNTIME EVIDENCE:**  
> `COMPLETE`

> **PRODUCTION AUTO-TRANSPORT RUNTIME:**  
> `PASS`

> **INTERNAL DURATION:**  
> `<N> TICK(S)`

> **PLAYER-FACING PRESENTATION:**  
> `<exact ~N Zyklus/Zyklen copy>`

> **NUMERIC VALUE:**  
> `UNCHANGED`

> **SCOPED TICK/TICKS:**  
> `ABSENT`

> **PRODUCTION IMPLEMENTATION CHANGED DURING EVIDENCE COMPLETION:**  
> `NO`

> **SIMULATION / BALANCE:**  
> `UNCHANGED`

> **SAVE / API:**  
> `UNCHANGED`

> **PGD-RES-001:**  
> `UNCHANGED / REGRESSION PASS`

> **COMPANY / CHART / NARROW EVIDENCE:**  
> `PREVIOUS PASS REMAINS VALID`

> **TRANSPORT STATUS ENUMS:**  
> `UNCHANGED / DEFERRED`

> **NEW ART:**  
> `NONE`

> **SCENARIO-B:**  
> `REMAINS PAUSED`

> **ROOT GATES:**  
> `PASS`

> **READY FOR INDEPENDENT FINAL CLOSURE:**  
> `YES`

---

## OPTION B — TIME-UX-R1 IMPLEMENTATION DEFECT DISCOVERED DURING RUNTIME CERTIFICATION

Use if real runtime proves the implementation itself is wrong.

Do NOT repair it in this evidence-only task.

State:

- exact runtime state;
- expected presentation;
- actual presentation;
- internal N;
- visible N;
- affected source path;
- likely bounded repair surface.

---

## OPTION C — TIME-UX-R1 RUNTIME CERTIFICATION BLOCKED

Use if the exact runtime condition cannot be legitimately certified.

State:

- exact condition required;
- what evidence states were attempted;
- why they were insufficient;
- whether target path is active/reachable;
- whether production implementation remained frozen;
- what specific next decision/action is required.

Do not claim TIME-UX-R1 complete.

---

# 38. DEFINITION OF DONE

This evidence completion is complete only when:

- [ ] implementation guide read
- [ ] TIME-UX-R1 implementation prompt read
- [ ] existing TIME-UX-R1 close candidate read
- [ ] branch recorded
- [ ] exact HEAD recorded
- [ ] origin/master recorded
- [ ] working tree classified
- [ ] TIME-UX-R1 WIP identified
- [ ] unrelated WIP excluded
- [ ] production implementation frozen
- [ ] real auto-transport hint code path traced
- [ ] exact visibility conditions documented
- [ ] internal duration source identified
- [ ] exact N identified
- [ ] legitimate evidence-state source selected
- [ ] existing save/fixture reuse considered first
- [ ] no recipe YAML changed
- [ ] no transport rule changed
- [ ] no simulation timing changed
- [ ] no save schema changed
- [ ] no API contract changed
- [ ] no fake props used
- [ ] no DOM text patching used
- [ ] no API rewriting used
- [ ] no CSS hiding used
- [ ] real Production runtime mounted
- [ ] target recipe/operation identified
- [ ] actual auto-transport hint visible
- [ ] exact visible N recorded
- [ ] visible N equals internal N
- [ ] approximation marker preserved
- [ ] correct singular/plural verified
- [ ] scoped Tick absent
- [ ] scoped Ticks absent
- [ ] screenshot captured
- [ ] screenshot path recorded
- [ ] programmatic scoped assertions pass
- [ ] PGD-RES behavior checked
- [ ] focused cycle-label tests pass
- [ ] focused builder tests pass
- [ ] bounded auto-transport TIME-A = 0
- [ ] no frozen production source changed
- [ ] Company previous runtime evidence retained
- [ ] Chart previous runtime evidence retained
- [ ] Narrow previous runtime evidence retained
- [ ] Transport statuses unchanged
- [ ] Research statuses unchanged
- [ ] Building categories unchanged
- [ ] PDM unchanged
- [ ] Tutorial navigation unchanged
- [ ] art unchanged
- [ ] Scenario-B remains paused
- [ ] root typecheck passes
- [ ] root lint passes
- [ ] full root tests pass
- [ ] current test count recorded
- [ ] build:web passes
- [ ] evidence delta audited
- [ ] existing close candidate updated
- [ ] no duplicate close report created
- [ ] exactly one final option returned
- [ ] no commit
- [ ] no push
- [ ] no tag

---

# 39. CORE EXECUTION RULE

TIME-UX-R1 is already an implementation PASS candidate.

Do not improve it.

Prove it.

The missing proof is exact:

> the real Production auto-transport estimate that used to expose `~N Ticks`
> must now visibly expose the same N as `~N Zyklus/Zyklen`.

Trace the real condition.

Use legitimate deterministic state.

Preserve N.

Preserve approximation semantics.

Use the real application path.

Scope the DOM assertion to the actual hint.

Do not substitute generic Production duration copy.

Do not change Production code.

Do not change the formatter.

Do not change the builder.

Do not change timing.

Do not change gameplay.

Do not change saves or API contracts.

Do not fix Transport statuses.

Do not start another slice.

Update the existing close candidate.

Run the focused tests and current root gates.

Return ONE evidence-completion decision.

Then STOP.

# END OF PROMPT