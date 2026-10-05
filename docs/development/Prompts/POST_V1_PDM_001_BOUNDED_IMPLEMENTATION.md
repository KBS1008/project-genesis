# POST-V1 PDM-001
# Direct Map Building Placement
# Bounded Implementation

## MODE

BOUNDED IMPLEMENTATION + TESTS + CLOSE-CANDIDATE REPORT.

Implement the already-approved PDM-001 Product / UX Contract.

This is NOT:

- architecture discovery;
- product redesign;
- coordinate-contract redesign;
- gameplay design;
- map visual redesign;
- tutorial redesign;
- Scenario-B visual production.

The Product / UX Contract is COMPLETE / PASS.

The Coordinate Contract Consistency Closeout is CLOSED / PASS.

Implementation is authorized.

Do not reopen approved contract decisions merely because another implementation would be easier.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

No commit.
No push.
No tag.

Return one implementation close candidate for independent review.

---

# 1. READ FIRST

Read completely:

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/architecture/reviews/POST_V1_PDM_001_PRODUCT_UX_CONTRACT.md`
- `docs/architecture/reviews/POST_V1_PDM_001_COORDINATE_CONTRACT_CONSISTENCY_CLOSEOUT.md`

Also read:

- `docs/architecture/reviews/POST_V1_PDM_001_COORDINATE_SEMANTICS_CONTRACT_DELTA.md`

if that separate delta document exists.

The corrected Product / UX Contract is authoritative.

Do not implement from memory or from earlier superseded coordinate language.

---

# 2. BASELINE

Before editing, record:

- branch;
- exact HEAD;
- HEAD subject;
- `origin/master`;
- HEAD/origin relationship;
- working-tree status;
- unrelated WIP.

Previously reviewed baseline was:

`500a00a086fa083c1bca461ccbe87b1f23f9b675`

Do NOT assume that SHA is still current.

Verify actual Git truth.

Expected:

- `master`;
- `origin/master` aligned unless later authorized work exists;
- unrelated local WIP may exist.

Do not touch, clean, stage, restore, move, delete, or reformat unrelated WIP.

---

# 3. SEALED / FROZEN WORK

Treat as CLOSED / PASS / SEALED:

- WORKFORCE-NAV-001
- WORKFORCE-GUIDANCE-001
- RESEARCH-METRICS-001
- RESEARCH-STATUS-001
- TRANSPORT-STATUS-001
- TIME-UX-R1
- PGD milestone/technology/resource work
- V1 release gates
- sealed visual tracks
- BVI-001
- completed visual integration tracks

Scenario-B remains PAUSED.

Do not reopen them.

---

# 4. IMPLEMENTATION GOAL

Replace raw-coordinate-first normal building placement with direct World-map placement.

Required normal player flow:

> Buildings
> → choose building type
> → provide any still-required non-coordinate placement data
> → `Position auf Karte wählen`
> → World placement mode
> → choose candidate location
> → preview candidate
> → inspect pickability / placement feedback
> → explicitly confirm
> → existing authoritative placement command executes once
> → placed building appears at the same logical location represented by the preview

Player can also:

> cancel

without gameplay mutation.

This implementation changes:

> how the player chooses `Position`.

It does NOT change:

> whether placement is allowed.

---

# 5. HARD PRODUCT CONTRACT — DO NOT REOPEN

Implement these decisions as approved:

1. Direct World-map placement is the normal player placement path.
2. Buildings initiates placement.
3. Choosing map placement transitions the player to World.
4. Selected building placement context is transient.
5. Pan remains available during placement.
6. Zoom remains available during placement.
7. Pointer/tap chooses a candidate.
8. Candidate selection does NOT place the building.
9. Preview exists before gameplay mutation.
10. Confirm is explicit.
11. Cancel is explicit.
12. Existing placement application/domain authority remains authoritative.
13. Success remains on World.
14. Final command rejection remains in placement mode.
15. Leaving placement mode/navigation clears transient placement state.
16. One placement per placement session.
17. Raw X/Y is removed from the normal player placement workflow.
18. Narrow uses direct placement too.
19. No new art.
20. No new gameplay placement rules.
21. No save-schema changes.
22. No API-semantic changes.
23. Preview and final building represent the same logical domain Position.

Do not substitute a different UX.

---

# 6. CURRENT AUTHORITY TO REUSE

Trace actual current implementation before editing.

Reuse the existing authoritative path for final placement.

Expected conceptual authority:

> existing web placement action
> → existing place-building application path
> → `PlaceBuildingUseCase`
> → existing domain/building creation and `Position`

Use actual repository names.

Do not create a second placement command.

Do not let the World component directly mutate domain/game state.

---

# 7. EXISTING PLACEMENT VALIDATION

Preserve existing authority for all existing rules, including whatever current code actually owns for:

- building type availability;
- prerequisites;
- costs;
- domain Position construction;
- construction/building lifecycle;
- command rejection;
- existing region/default-region behavior;
- any existing validation actually present.

Do not duplicate these rules into a new map-only gameplay model.

Do not invent missing rules.

---

# 8. RAW X/Y NORMAL FLOW

The approved contract removes manual raw X/Y from the normal player placement workflow.

Implement that decision.

The player should not have to type:

- X-Position;
- Y-Position

to perform ordinary placement.

Do not retain raw X/Y as the primary placement path.

Do not retain it merely as a hidden/advanced fallback unless the approved contract explicitly requires such a fallback.

Do not remove domain `Position`.

Only remove/rework the player-facing coordinate-entry dependency.

---

# 9. NON-COORDINATE PLACEMENT DATA

Preserve any existing placement input still legitimately required by the application.

For example, if the existing flow requires a player-provided building name:

retain that input as appropriate.

Do not broaden PDM into a naming-flow redesign.

The map placement session must carry whatever bounded placement data is required so confirmation can invoke the existing placement path without asking for X/Y.

---

# 10. PLACEMENT SESSION

Introduce the smallest architecture-consistent transient placement-session state.

It should carry only what is required, conceptually including:

- selected building type/definition ID;
- required existing placement input such as name if applicable;
- candidate domain Position if one exists;
- bounded UI state needed for placement.

Do not persist the session.

Do not add it to:

- save schema;
- simulation state;
- domain aggregate persistence;
- API persistence.

---

# 11. STATE OWNERSHIP

Reuse current application/navigation state architecture.

Prefer an explicit typed placement-session model over loosely related booleans.

Do not create:

- a second router;
- a parallel global navigation framework;
- URL parsing hacks;
- German-copy parsing;
- DOM-text parsing.

The session must survive:

> Buildings → World

and then clear deterministically.

---

# 12. PLACEMENT SESSION LIFECYCLE

Implement explicit lifecycle semantics.

## Start

Buildings creates the placement session from structured building context.

## Candidate

World updates only transient candidate state.

## Confirm success

Clear placement session after successful authoritative placement.

## Confirm rejection

Remain in placement mode and retain enough candidate/session state for correction/retry.

## Cancel

Clear placement session without gameplay mutation.

## Navigate away

Clear placement session unless navigation is the controlled Buildings→World entry into placement mode.

No stale session on later World return.

---

# 13. BUILDINGS ENTRY

Modify the existing Buildings placement UI minimally.

The player selects the desired building using existing catalog/placement semantics.

The normal action becomes conceptually:

> `Position auf Karte wählen`

Use exact wording consistent with the approved contract and existing German UI terminology.

Do not create a second catalog.

Do not duplicate prerequisite presentation.

Do not duplicate cost presentation.

---

# 14. ENTRY VALIDATION

Before entering World placement mode, preserve any existing preconditions that are already knowable from the Buildings flow.

If the existing UI already blocks an unavailable building due to prerequisites/cost/etc.:

preserve that behavior.

Do not create a new frontend-only gameplay authority.

The final command remains authoritative.

---

# 15. WORLD TRANSITION

After the player starts map placement:

- store structured placement session;
- navigate to World through existing navigation architecture;
- activate placement mode.

The player must not need to manually navigate to World after choosing map placement.

Do not trigger placement command during transition.

---

# 16. WORLD PLACEMENT MODE

When a placement session exists, World enters a clear placement mode.

Show enough information to communicate:

- which building is being placed;
- that the player should choose a position;
- current candidate state;
- confirm action when applicable;
- cancel action.

Reuse existing World shell/panel/component language.

Do not build a large new overlay if unnecessary.

Do not require new visual assets.

---

# 17. PLACEMENT MODE MUST NOT RELY ONLY ON COLOR

Placement mode must remain understandable without color alone.

Use existing textual/structural UI.

At minimum expose:

- selected building label;
- placement instruction;
- confirm;
- cancel;
- relevant blocked/no-pick state.

Do not overdesign.

---

# 18. COORDINATE CONTRACT — FROZEN

Implement the approved coordinate contract exactly.

Do not return to the superseded footprint/floor model.

Authoritative semantics:

> Domain `Position { x, y }` = non-negative integer coordinates.

No authoritative upper X/Y domain bound has been established.

PDM must NOT invent one.

---

# 19. PRESENTATION GEOMETRY FIREWALL

These remain presentation facts:

- SVG extent;
- `WORLD_MAP_CELL_SIZE`;
- region `mapX/mapY`;
- region inset;
- painted region footprint;
- marker dimensions;
- marker overlap layout.

They do NOT become:

- gameplay maximum coordinates;
- placement capacity;
- collision;
- buildable border;
- domain upper bound.

Do not reject a positive domain Position merely because it exceeds a number derived from rendered region geometry.

---

# 20. COORDINATE ADAPTER

Create one explicit bounded coordinate adapter/projection boundary.

Do not scatter coordinate math across React components.

Conceptually it owns:

> domain Position ↔ World logical coordinate

Camera conversion remains separate.

Use repository-appropriate module naming and location.

The domain must not learn about SVG pixels.

---

# 21. STABLE PROJECTION CONTEXT

Use the approved stable projection context from the contract.

Conceptually:

> stable presentation anchor `O`

and:

> `s = 1`

where `s = 1` is:

> PDM adapter / presentation semantics

not:

> a gameplay bound.

Use the exact anchor derivation established by the corrected contract.

Do not invent a different anchor.

Do not introduce adaptive rescaling.

---

# 22. FORWARD PROJECTION

Implement the approved conceptual forward mapping:

> domain Position
> → World logical point

using the frozen contract.

Conceptually:

> `world = O + position * s`

with:

> `s = 1`

Use repository-appropriate types.

This projection must be deterministic.

---

# 23. UNPROJECTION

Implement the approved inverse mapping:

> World logical point
> → candidate domain Position | no-pick

Use the same projection context as forward projection.

Do not create a candidate using unrelated marker geometry.

---

# 24. QUANTIZATION — FROZEN

Use:

> `round`

for the approved PDM adapter quantization.

Classification:

> PDM ADAPTER SEMANTICS.

Do NOT use:

- `floor`;
- truncation;
- `ceil`.

Do not claim `round` is domain authority.

It belongs to the map↔domain adapter.

---

# 25. NEGATIVE RESULT

If unprojection would produce:

> x < 0

or:

> y < 0

return:

> no-pick

Do not clamp to zero.

Do not create a negative `Position`.

Do not call this a gameplay command rejection.

It is map-adapter pickability.

---

# 26. POSITIVE POSITIONS OUTSIDE REGION ART

Do NOT reject a candidate merely because its positive domain Position lies beyond the currently painted region footprint.

The contract explicitly prohibits a presentation-derived gameplay cap.

Therefore:

> outside painted region artwork

is NOT automatically:

> invalid gameplay Position.

Preserve this distinction in code and tests.

---

# 27. PICKABILITY VS VALIDITY

Keep two concepts distinct.

## Pickability

Can this World logical location produce a non-negative integer candidate Position through the coordinate adapter?

## Placement validity / command authority

Do existing authoritative placement rules permit the actual placement?

Do not collapse these into one `isValidBecauseInsideFootprint` style boolean.

Use clear typed/state semantics.

---

# 28. CAMERA CONVERSION

Reuse current World camera math.

Required conceptual input pipeline:

> viewport/pointer coordinate
> → remove relevant viewport/SVG offset
> → inverse current camera pan/zoom
> → World logical point
> → PDM unprojection
> → candidate domain Position / no-pick

Do not duplicate camera transform formulas if current helpers/hooks already provide them.

---

# 29. CAMERA INVARIANCE

The same World logical point must map to the same domain Position regardless of:

- pan;
- zoom;
- desktop/narrow viewport.

Pan/zoom affects presentation.

It must not alter domain coordinate semantics.

---

# 30. PAN DURING PLACEMENT

Keep current pan interaction usable where architecture supports it.

Do not disable pan merely to simplify placement.

Ensure a pan gesture does not accidentally confirm placement.

Candidate selection and pan must coexist using current pointer interaction conventions.

Do not invent complex gesture rules.

---

# 31. ZOOM DURING PLACEMENT

Keep current zoom usable.

Changing zoom must not change:

- candidate domain Position;
- stored placement position.

Preview should move visually as the camera changes while remaining anchored to the same World logical/domain position.

---

# 32. MAP CANDIDATE SELECTION

Pointer/tap/click selects a candidate.

Selection must:

- compute World logical point;
- unproject through the PDM adapter;
- produce candidate Position or no-pick;
- update transient state only.

It must NOT call the placement command.

---

# 33. NO MUTATION ON PICK

This is a hard correctness rule.

The following must NOT mutate gameplay:

- entering placement mode;
- moving pointer;
- choosing candidate;
- changing candidate;
- pan;
- zoom;
- cancel.

Only explicit confirm may invoke the existing placement command.

Add focused tests proving this.

---

# 34. CANDIDATE PREVIEW

When a candidate Position exists:

show a building placement preview anchored through:

> candidate domain Position
> → shared forward projection
> → World logical point.

Use existing building visual language/art where available.

No new art.

Preview must be visually distinguishable from an already-placed building.

Keep visual treatment bounded.

---

# 35. PREVIEW ANCHOR

The authoritative preview anchor is the projected candidate domain Position.

Any icon centering, size adjustment, or visual offset is presentation-only.

Do not change the submitted Position to compensate for icon dimensions.

---

# 36. EXISTING BUILDING MARKER PROJECTION

This is part of PDM correctness, not optional polish.

Existing placed buildings must use the same domain→World anchor semantics as the preview.

Current presentation-only slot distribution must no longer be authoritative for actual building location.

Specifically inspect current use of:

`distributeMarkerPosition(...)`

or current equivalent.

After PDM:

> domain Position

must establish the authoritative logical anchor.

---

# 37. `distributeMarkerPosition` BOUNDARY

Do not automatically delete a helper merely because it previously positioned markers.

Determine whether it still has a legitimate presentation-only overlap/decorative role.

If retained:

it must not override the authoritative domain anchor.

If unnecessary after the change:

remove only task-local dead usage/code when safe.

Do not broaden cleanup.

---

# 38. EXISTING BUILDINGS

Render existing buildings using their existing persisted/domain Position values.

Do NOT:

- rewrite coordinates;
- migrate saves;
- clamp coordinates;
- assign new coordinates;
- derive position from list index.

Presentation adapts to domain Position.

Domain state does not adapt to presentation.

---

# 39. OVERLAPPING BUILDINGS

Do not invent gameplay collision.

If two existing buildings have identical or nearby domain Positions:

that remains legal unless existing domain authority says otherwise.

Visual overlap is a presentation concern.

Do not mutate their Position to spread them apart.

Do not reject new placement merely because a marker visually overlaps unless existing authoritative placement logic already rejects it.

---

# 40. PREVIEW → FINAL CONTINUITY

This is a hard acceptance requirement.

Given candidate Position P:

1. preview is projected from P;
2. confirm submits P;
3. placement succeeds;
4. resulting building has P;
5. final World marker projects from P.

Therefore:

> preview and final marker occupy the same logical anchor.

No visual jump to an unrelated slot after refresh/re-render.

Add focused tests around this shared projection contract.

---

# 41. CANDIDATE FEEDBACK

Expose enough state for the player to understand:

- no candidate yet;
- no-pick where applicable;
- candidate chosen;
- known existing blocked prerequisite/cost state if already available;
- authoritative rejection after command attempt.

Do not invent new placement-error reasons.

---

# 42. NO-PICK

When pointer unprojection yields a negative result:

- no candidate is created/updated from that pick;
- confirm remains unavailable if no prior usable candidate exists, according to the approved session semantics;
- communicate the state only as much as needed.

Do not call it:

> ungültige Gameplay-Position

if the issue is adapter pickability.

---

# 43. EXISTING HINT / PRECONDITION AUTHORITY

Reuse existing structured availability/hint state where available.

Do not parse German copy.

Do not recreate prerequisite/cost logic from strings.

If existing building availability already says placement cannot proceed:

use that structured state.

Final command validation remains authoritative.

---

# 44. CONFIRM CONTROL

Provide explicit confirmation after candidate selection.

Use approved/current German terminology.

Expected semantic action:

> `Gebäude platzieren`

Use the exact wording established by the Product / UX Contract.

Do not execute placement on map click.

---

# 45. CONFIRM ENABLEMENT

Confirm requires at minimum:

- active placement session;
- candidate Position;
- map pickability satisfied;
- existing known blocking state not preventing submission where that state is already authoritative.

Do not invent a new frontend gameplay validator.

The final command remains authoritative.

---

# 46. CONFIRM EXECUTION

On explicit confirm:

invoke the existing authoritative placement application path exactly once with:

- selected building type;
- existing required placement data;
- candidate domain x/y;
- existing region/default-region semantics.

Do not create a second placement implementation.

Do not call lower-level domain mutation directly from World.

---

# 47. DOUBLE-SUBMIT SAFETY

Ensure normal UI interaction cannot accidentally submit the same placement twice while one confirm is in progress.

Reuse existing command/pending patterns where available.

Do not build a new generalized command queue.

Add a focused test if current architecture makes double submission plausible.

---

# 48. CONFIRM SUCCESS

On successful authoritative placement:

- clear placement session;
- clear candidate;
- remain on World;
- show normal World state;
- newly placed building renders through its persisted/domain Position;
- marker anchor matches preview anchor.

Do not automatically return to Buildings.

---

# 49. COMMAND REJECTION

If the final authoritative placement command rejects:

- do not pretend placement succeeded;
- remain in placement mode;
- retain candidate/session where safe;
- show existing player-facing rejection/error presentation;
- allow correction/retry;
- do not mutate unrelated state.

Do not translate a command rejection into map no-pick.

They are different states.

---

# 50. CANCEL

Provide explicit:

> `Abbrechen`

or exact approved equivalent.

Cancel must:

- clear placement session;
- clear candidate;
- perform zero gameplay mutation.

Use the approved destination behavior from the Product / UX Contract.

Do not invent a new navigation-history system.

---

# 51. NAVIGATION AWAY

If the player leaves World placement mode through ordinary navigation:

clear the transient placement session.

Returning later to World must not resurrect stale:

- selected building;
- candidate;
- confirm state.

Add a focused test.

---

# 52. NORMAL WORLD INTERACTIONS DURING PLACEMENT

Implement the contract-defined interaction priority.

Placement mode must not accidentally:

- select a normal building instead of candidate placement;
- open an inspector unexpectedly;
- trigger region navigation that abandons placement;
- execute another gameplay action.

Reuse the exact suppression/coexistence decisions from the Product / UX Contract.

Do not hide existing buildings.

---

# 53. BUILDING MARKER CLICKS DURING PLACEMENT

Follow the frozen contract.

If normal building selection is suppressed during placement:

implement that only while placement mode is active.

After cancel/success:

normal marker interaction must return.

Add a focused behavioral test where practical.

---

# 54. REGION CLICKS DURING PLACEMENT

Follow the frozen contract.

Do not derive gameplay region assignment from clicked visual region.

Current default-region/application semantics remain unchanged.

Placement mode must not smuggle in new region rules.

---

# 55. REGION ID

Preserve current placement semantics.

If current web placement does not send a region ID and application/domain defaults to the established default region:

keep that behavior.

Do not start sending region IDs based on pointer geometry unless the approved contract explicitly establishes it.

No new multi-region placement semantics.

---

# 56. NARROW VIEWPORT

Direct map placement must remain usable around:

> 480×900

Required:

- map visible enough to select position;
- selected building understandable;
- candidate state understandable;
- confirm reachable;
- cancel reachable;
- pan/zoom still coherent;
- no raw X/Y fallback required.

Reuse current responsive shell patterns.

Do not create a new mobile application shell.

---

# 57. DESKTOP VIEWPORT

Later runtime certification target:

> approximately 1440×900.

Implementation should support:

- clear placement mode;
- usable map;
- preview;
- confirm/cancel;
- stable pan/zoom;
- final marker continuity.

Do not optimize only for narrow.

---

# 58. ACCESSIBILITY

Keep implementation bounded but structurally understandable.

Do not rely solely on:

- color;
- hover;
- cursor shape.

Use semantic controls for:

- confirm;
- cancel.

Preserve normal keyboard/button accessibility patterns already used by the app.

Do not add speculative keyboard shortcuts.

---

# 59. NO TUTORIAL WORK

Do not update tutorial/onboarding in this slice.

If existing tutorial copy becomes factually stale due to removal of manual X/Y:

record it as:

> follow-up candidate

only if actual repository evidence shows such stale player-facing instruction.

Do not fix it unless it is directly inside the owned placement UI and necessary for correctness.

---

# 60. NO GENERAL WORLD REDESIGN

Do not modify:

- world generation;
- biome generation;
- route rendering;
- map scenic composition;
- minimap concept;
- region art;
- world visual language;
- camera behavior beyond what PDM integration strictly requires.

PDM is direct manipulation, not World Visual Phase 2.

---

# 61. NO NEW ART

Reuse existing:

- building art;
- markers;
- icons;
- UI components.

Do not generate/request/create:

- new building art;
- placement cursor art;
- placement overlays requiring new assets.

Scenario-B remains PAUSED.

---

# 62. NO GAMEPLAY CHANGES

Do not change:

- building costs;
- prerequisites;
- construction time;
- construction state;
- workers;
- production;
- energy;
- transport;
- research;
- milestones;
- finance behavior;
- placement collision;
- placement capacity.

If direct map placement appears to require one of these:

STOP.

---

# 63. SAVE / API FIREWALL

Do not change:

- save schema;
- persisted Position schema;
- placement API semantics;
- endpoint contract;
- region persistence semantics.

The current placement DTO/API already carries the placement data required by the approved contract.

If implementation unexpectedly requires a schema/API change:

STOP and report the blocker.

---

# 64. CONTENT FIREWALL

Do not change:

- YAML gameplay content;
- resource definitions;
- technologies;
- milestones;
- building balance/content.

PDM is application/presentation integration.

---

# 65. EXPECTED IMPLEMENTATION FAMILIES

Use actual repository architecture.

Likely bounded ownership includes:

- Buildings placement UI;
- existing workspace/navigation provider/state;
- World placement mode;
- coordinate projection/unprojection adapter;
- existing building-marker projection;
- focused PDM tests;
- task-local presentation styles if necessary.

Do not treat this list as permission to modify unrelated files.

Use the smallest coherent set.

---

# 66. COORDINATE ADAPTER TESTS

Add focused unit tests for the adapter.

At minimum prove:

## A. Origin

Domain Position near `{0,0}` projects deterministically from the approved anchor.

## B. Quantization

Unprojection uses:

> `round`

not `floor`.

Include at least one fractional case that distinguishes the two.

## C. Negative result

A World logical point that would unproject below domain origin returns no-pick.

No clamping.

## D. Positive high Position

A non-negative Position beyond the old presentation-footprint threshold is not rejected merely because of that old footprint.

## E. Round-trip

For representative selectable Positions:

> `unproject(project(P)) == P`

or the exact approved equivalent.

## F. Stable projection

Same Position + same projection context = same World logical point.

Do not encode a presentation-derived upper gameplay bound into tests.

---

# 67. CAMERA / POINTER TESTS

Where current architecture permits focused testing, prove:

- pan does not change candidate domain Position for the same World logical location;
- zoom does not change candidate domain Position for the same World logical location;
- viewport conversion and coordinate adapter are not conflated.

Reuse existing camera helpers in tests.

Do not duplicate camera implementation merely for test convenience.

---

# 68. PLACEMENT SESSION TESTS

Add focused tests proving:

- start session from Buildings;
- selected building context carried structurally;
- World enters placement mode;
- candidate selection updates transient state;
- no gameplay command on candidate pick;
- changing candidate still does not mutate gameplay;
- cancel clears session;
- navigation away clears session;
- success clears session;
- rejection retains placement mode appropriately.

Use current test conventions.

---

# 69. CONFIRM TESTS

Prove:

- no confirm without candidate;
- explicit confirm required;
- confirm calls existing placement path once;
- submitted x/y equal candidate Position;
- existing building type/context preserved;
- current region/default-region semantics preserved;
- success exits placement mode;
- rejection does not falsely exit as success.

Do not mock away the behavior under test so aggressively that the coordinate/session contract is unverified.

---

# 70. PREVIEW / FINAL CONTINUITY TEST

Add at least one focused test that demonstrates:

> candidate Position P
> → preview anchor A
> → placed building Position P
> → final marker anchor A.

This may be split between adapter/unit and component/integration tests if that fits architecture.

The invariant itself must be proven.

---

# 71. EXISTING MARKER TEST

Add/update focused tests proving an existing building marker derives its authoritative anchor from:

> building.position

through the shared projection.

Do not leave a test encoding:

> list index determines actual building location.

If presentation-only overlap behavior remains, test the domain anchor separately.

---

# 72. NO-MUTATION TEST

Explicitly prove that:

- entry;
- pick;
- repick;
- pan/zoom if represented in component state;
- cancel

do NOT call the authoritative place-building command.

This is a key PDM safety invariant.

---

# 73. NARROW COMPONENT TESTS

Where existing component test infrastructure supports it, verify controls remain structurally available in narrow/responsive state.

Do not attempt to replace later real runtime evidence with brittle viewport mocks.

The important runtime narrow proof happens after implementation review.

---

# 74. REGRESSION TESTS

Preserve/update existing tests affected by:

- removal of manual X/Y;
- World marker positioning;
- navigation state;
- Buildings placement form.

Do not simply delete meaningful assertions because the UI changed.

Replace superseded expectations with the approved PDM contract.

---

# 75. ROOT GATES

After focused tests pass, run repository-standard root gates.

At minimum:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build:web`

Use actual project commands if the implementation guide specifies exact equivalents.

Report exact outcomes.

Do not hide warnings.

Differentiate:

- errors;
- warnings.

Any new task-owned lint/type/test/build failure must be fixed before close candidate.

---

# 76. BASELINE DEBT

Do not opportunistically fix unrelated historical debt.

If a root gate fails:

1. determine whether PDM caused it;
2. if PDM caused it, fix it;
3. if clearly pre-existing and unrelated, provide hard evidence.

Do not use vague:

> probably pre-existing.

---

# 77. RUNTIME EVIDENCE — IMPLEMENTATION PHASE POLICY

This implementation prompt should produce a code close candidate first.

If the repository's normal evidence workflow makes runtime certification straightforward and deterministic, Cursor MAY collect runtime evidence in the same pass.

However:

do NOT block completion of the code close-candidate report solely because final visual/runtime evidence requires a dedicated evidence fixture/run.

If runtime evidence is not completed:

state exactly:

> `RUNTIME EVIDENCE: REQUIRED AFTER INDEPENDENT CODE REVIEW`

and provide the exact fixture/state requirements.

Do not fabricate screenshots.

---

# 78. EXPECTED LATER DESKTOP RUNTIME FLOW

The close-candidate report must state whether this is ready to certify:

> Buildings
> → choose a placeable building
> → provide required non-coordinate data
> → Position auf Karte wählen
> → World placement mode
> → pick candidate
> → preview visible
> → confirm
> → building placed
> → final marker remains at preview logical anchor.

Target:

> approximately 1440×900.

---

# 79. EXPECTED LATER NO-PICK RUNTIME FLOW

Certify later:

> placement mode
> → select a World logical location whose unprojection falls below non-negative domain origin
> → no candidate
> → no placement command
> → confirm unavailable if no previous usable candidate exists.

Do NOT use:

> outside painted region footprint

as the no-pick criterion.

---

# 80. EXPECTED LATER CANCEL FLOW

Certify later:

> placement mode
> → choose candidate
> → preview
> → cancel
> → no building created
> → placement session cleared.

---

# 81. EXPECTED LATER REJECTION FLOW

If a deterministic existing-authority rejection fixture can be constructed without inventing gameplay:

certify:

> candidate
> → confirm
> → existing command rejects
> → no building created
> → placement mode remains
> → rejection visible.

If no safe deterministic fixture exists:

do not invent a gameplay rule solely for evidence.

State the limitation.

---

# 82. EXPECTED LATER NARROW FLOW

Certify later around:

> 480×900.

Required:

> Buildings
> → map placement
> → candidate
> → preview
> → confirm/cancel reachable
> → no raw X/Y dependency.

---

# 83. IMPLEMENTATION QUALITY

Prefer:

- typed structured state;
- small pure coordinate helpers;
- reuse of existing navigation;
- reuse of existing command path;
- reuse of existing building visuals;
- focused tests;
- minimal component branching.

Avoid:

- giant placement component;
- duplicate placement validators;
- string parsing;
- magic gameplay constants;
- coordinate math duplicated across components;
- ad hoc global variables.

---

# 84. MAGIC CONSTANT FIREWALL

Do not introduce arbitrary constants representing:

- maximum X/Y;
- placement grid size;
- buildable region width;
- building spacing;
- collision radius;
- placement capacity.

The approved `s = 1` adapter semantics and approved stable anchor are already contracted.

Do not invent additional coordinate gameplay semantics.

---

# 85. TYPE BOUNDARY

Where practical, distinguish types/concepts for:

- World logical point;
- domain Position;
- screen/pointer coordinate;
- placement session;
- candidate/pick state.

Do not pass untyped `{x,y}` objects through multiple coordinate spaces if existing TypeScript architecture supports safer naming/types.

Keep this bounded; do not launch a repository-wide coordinate-type refactor.

---

# 86. ERROR BOUNDARY

Reuse existing player-facing error presentation.

Do not expose:

- raw exception;
- internal command object;
- stack trace;
- raw enum where formatted presentation exists.

Do not redesign the global error system.

---

# 87. WORKING TREE DISCIPLINE

Before final report:

- inspect `git status`;
- identify task-owned modified/new files;
- distinguish unrelated pre-existing WIP;
- do not stage anything;
- do not commit;
- do not push.

Do not claim a clean working tree if unrelated WIP exists.

---

# 88. CLOSE-CANDIDATE REPORT

Create:

`docs/architecture/reviews/POST_V1_PDM_001_BOUNDED_IMPLEMENTATION_CLOSE_CANDIDATE.md`

This report is task-owned.

Do not overwrite the Product / UX Contract.

---

# 89. REQUIRED CLOSE-CANDIDATE REPORT STRUCTURE

Use:

## A. Executive result

## B. Baseline

## C. Task-owned files

## D. Unrelated WIP

## E. Architecture implemented

## F. Placement-session lifecycle

## G. Buildings entry

## H. World placement mode

## I. Coordinate adapter

## J. Camera/pointer integration

## K. Candidate / no-pick semantics

## L. Preview

## M. Existing building-marker projection

## N. Preview → final continuity

## O. Confirm

## P. Cancel

## Q. Navigation-away behavior

## R. Command rejection behavior

## S. Raw X/Y disposition

## T. Desktop behavior

## U. Narrow behavior

## V. Gameplay / Save / API firewall

## W. Focused tests

## X. Root gates

## Y. Runtime evidence status

## Z. Remaining issues

## AA. Final close-candidate decision

Be factual.

Do not declare the slice SEALED.

Independent review decides closure.

---

# 90. REQUIRED IMPLEMENTATION TABLE

Include:

| Contract item | Implementation | Evidence |
|---|---|---|
| Placement entry | ... | ... |
| Placement session | ... | ... |
| World transition | ... | ... |
| Coordinate projection | ... | ... |
| Coordinate unprojection | ... | ... |
| Quantization | `round` | ... |
| Negative result | no-pick | ... |
| Presentation-derived cap | none | ... |
| Pan/zoom | ... | ... |
| Preview | ... | ... |
| Existing markers | ... | ... |
| Preview→final | ... | ... |
| Confirm | ... | ... |
| Cancel | ... | ... |
| Navigation away | ... | ... |
| Raw X/Y | removed from normal flow | ... |
| Narrow | ... | ... |
| Save/API | unchanged | ... |
| Gameplay | unchanged | ... |

---

# 91. REQUIRED FACTUAL QUESTIONS

Explicitly answer:

1. What branch was implemented on?
2. What exact baseline HEAD was used?
3. What was the baseline HEAD subject?
4. What was `origin/master` before implementation?
5. Was baseline HEAD equal to `origin/master`?
6. What unrelated WIP existed before implementation?
7. What files are task-owned by PDM-001?
8. Were any unrelated files modified?
9. What component starts map placement?
10. What exact player action starts placement?
11. Are raw X/Y inputs still present in the normal player flow?
12. If any raw X/Y UI remains, why?
13. What structured placement context is carried?
14. Where does transient placement-session state live?
15. Is placement-session state persisted?
16. What clears the session on cancel?
17. What clears it on success?
18. What happens on command rejection?
19. What happens on navigation away?
20. What exact existing navigation path transitions Buildings→World?
21. Does entering placement mode call the placement command?
22. Does selecting a candidate call the placement command?
23. Does repicking call the placement command?
24. Does cancel call the placement command?
25. What exact action calls the placement command?
26. What existing placement application/use-case path is reused?
27. Was a second placement command created?
28. Was domain mutation moved into World UI?
29. What module owns domain↔World projection?
30. What is the stable projection anchor?
31. Is `s = 1` implemented?
32. How is `s = 1` classified?
33. Is `round` implemented?
34. Is `floor` used anywhere in PDM candidate quantization?
35. How is `round` classified?
36. What happens when unprojection produces negative x/y?
37. Is clamping used?
38. Is there any presentation-derived upper X/Y bound?
39. Can a positive Position beyond the old footprint threshold still be projected?
40. Does `WORLD_MAP_CELL_SIZE` define gameplay capacity?
41. Does region inset define gameplay bounds?
42. Are pickability and gameplay validity represented separately?
43. How are viewport coordinates converted to World logical coordinates?
44. Is existing camera math reused?
45. Does pan alter candidate domain Position for the same World logical point?
46. Does zoom alter candidate domain Position for the same World logical point?
47. What interaction selects a candidate?
48. What state represents no candidate?
49. What state represents no-pick?
50. What state represents a selected candidate?
51. What visual represents the preview?
52. Does preview use existing building visual language?
53. Was new art created?
54. What exact coordinate anchors preview?
55. What exact coordinate anchors existing building markers?
56. What happened to `distributeMarkerPosition`?
57. Can presentation overlap handling override domain anchor?
58. Are existing persisted building Positions changed?
59. Was any save migration added?
60. Do existing buildings render from their domain Position?
61. Does a newly placed building render from its resulting domain Position?
62. Is preview→final continuity guaranteed by shared projection?
63. What test proves preview→final continuity?
64. What test proves `round` rather than `floor`?
65. What test proves negative-result no-pick?
66. What test proves no presentation-derived upper cap?
67. What test proves candidate pick does not mutate gameplay?
68. What test proves cancel does not mutate gameplay?
69. What test proves explicit confirm is required?
70. What test proves confirm calls the existing placement path once?
71. What test proves submitted x/y match candidate Position?
72. What test proves success clears placement mode?
73. What test proves rejection does not falsely report success?
74. What test proves navigation away clears stale placement state?
75. What happens to normal building-marker interaction during placement?
76. What happens to normal region interaction during placement?
77. Is regionId now derived from pointer geometry?
78. Were default-region semantics changed?
79. Was collision added?
80. Was placement capacity added?
81. Was a maximum coordinate added?
82. Were building costs changed?
83. Were prerequisites changed?
84. Was construction behavior changed?
85. Were gameplay/content YAML files changed?
86. Was save schema changed?
87. Was API schema/semantics changed?
88. Was Scenario-B reopened?
89. Does desktop placement mode remain usable?
90. Does narrow placement mode remain usable?
91. Are confirm and cancel reachable on narrow?
92. Does narrow require raw X/Y fallback?
93. What focused test command(s) were run?
94. Did focused tests pass?
95. Did `pnpm typecheck` pass?
96. Did `pnpm lint` pass?
97. How many lint errors and warnings?
98. Did `pnpm test` pass?
99. How many test files/tests passed?
100. Did `pnpm build:web` pass?
101. Was runtime evidence captured?
102. If yes, what exact flows were certified?
103. If no, what exact runtime evidence remains?
104. Are there any task-owned known defects?
105. Are there any material contract deviations?
106. Is the implementation ready for independent review?
107. Was there any commit?
108. Was there any push?
109. Was there any tag?

---

# 92. STOP CONDITIONS

STOP and return a blocked close candidate if implementation requires:

- inventing a domain coordinate maximum;
- turning World presentation footprint into gameplay bounds;
- changing `s = 1`;
- changing `round`;
- new placement collision rules;
- new placement capacity rules;
- new region-membership gameplay rules;
- save migration;
- Position schema change;
- placement API redesign;
- new endpoint;
- new persisted projection state;
- a second placement command;
- bypassing `PlaceBuildingUseCase` or current authoritative equivalent;
- material World architecture redesign;
- new gameplay content;
- reopening Scenario-B;
- new art required for correctness;
- an unresolved preview→final positional jump;
- inability to preserve pan/zoom semantics;
- inability to clear transient placement state safely;
- material product ambiguity not already resolved by the contract;
- unexpected cross-scope regression.

Do not implement through a stop condition.

---

# 93. TASK-LOCAL DEFECT RULE

Within the authorized PDM scope:

fix obvious task-local defects before returning.

Examples:

- candidate not clearing;
- double submit;
- wrong coordinate after zoom;
- preview using different projection;
- marker still using list-index anchor;
- narrow confirm inaccessible;
- stale placement session;
- test encoding superseded X/Y flow.

Do not return a known easy PDM-local defect merely to create another prompt.

Aim for one close candidate.

---

# 94. NO SCOPE-CREEP RULE

Do not fix unrelated issues discovered while implementing PDM.

Record them only if materially relevant.

Examples outside scope:

- tutorial redesign;
- general World beautification;
- transport UX;
- research UX;
- building-category localization;
- unrelated raw IDs;
- unrelated lint warnings;
- Scenario-B art;
- economy balancing.

---

# 95. FINAL DECISION

Return exactly ONE.

## OPTION A — PDM-001 IMPLEMENTATION CLOSE CANDIDATE READY

Use only when:

- normal placement no longer depends on raw X/Y;
- Buildings starts structured placement session;
- World placement mode works;
- coordinate adapter follows approved contract;
- `s = 1`;
- `round`;
- negative → no-pick;
- no presentation-derived gameplay cap;
- camera conversion is correct;
- candidate pick does not mutate gameplay;
- preview exists;
- existing markers use domain Position projection;
- preview→final continuity is implemented;
- explicit confirm uses existing placement path;
- cancel is mutation-free;
- navigation-away clears state;
- rejection behavior is correct;
- desktop/narrow implementation is coherent;
- focused tests pass;
- root gates pass or any unrelated baseline failure is proven with hard evidence;
- no stop condition is triggered.

State:

> **PDM-001 BOUNDED IMPLEMENTATION:**  
> `CLOSE CANDIDATE / PASS`

> **NORMAL PLACEMENT:**  
> `DIRECT WORLD MAP`

> **RAW X/Y NORMAL FLOW:**  
> `REMOVED`

> **PLACEMENT SESSION:**  
> `TRANSIENT / STRUCTURED`

> **DOMAIN POSITION AUTHORITY:**  
> `UNCHANGED`

> **COORDINATE SCALE:**  
> `s = 1 — PDM ADAPTER SEMANTICS`

> **QUANTIZATION:**  
> `round — PDM ADAPTER SEMANTICS`

> **NEGATIVE UNPROJECTION:**  
> `NO-PICK`

> **PRESENTATION-DERIVED GAMEPLAY CAP:**  
> `NONE`

> **PREVIEW → FINAL CONTINUITY:**  
> `IMPLEMENTED`

> **FINAL PLACEMENT AUTHORITY:**  
> `EXISTING PLACE-BUILDING PATH`

> **GAMEPLAY:**  
> `UNCHANGED`

> **SAVE / API:**  
> `UNCHANGED`

> **SCENARIO-B:**  
> `PAUSED`

> **ROOT GATES:**  
> `<exact results>`

> **RUNTIME EVIDENCE:**  
> `<COMPLETE / REQUIRED AFTER INDEPENDENT CODE REVIEW>`

> **READY FOR INDEPENDENT REVIEW:**  
> `YES`

> **COMMIT / PUSH / TAG:**  
> `NONE`

Then STOP.

---

## OPTION B — SMALL PDM IMPLEMENTATION DELTA REQUIRED

Use only when implementation is substantially complete but one bounded task-local defect remains that cannot safely be corrected in this pass.

State:

> **PDM-001 IMPLEMENTATION:**  
> `PARTIAL`

> **EXACT REMAINING DEFECT:**  
> `<one bounded defect>`

> **WHY IT COULD NOT BE SAFELY FIXED:**  
> `<reason>`

> **CONTRACT IMPACT:**  
> `<exact impact>`

> **NEXT STEP:**  
> `SMALL PDM IMPLEMENTATION DELTA`

Do not use this option for obvious fixable defects.

---

## OPTION C — CONTRACT / ARCHITECTURE BLOCKER

Use only if implementation reveals a genuine contradiction not resolvable within the approved contract.

State:

> **PDM-001 IMPLEMENTATION:**  
> `BLOCKED`

> **EXACT BLOCKER:**  
> `<evidence>`

> **CONTRACT SECTION AFFECTED:**  
> `<section>`

> **WHY IMPLEMENTATION CANNOT CONTINUE WITHOUT NEW DECISION:**  
> `<reason>`

Do not invent the decision.

---

## OPTION D — BASELINE / CROSS-SCOPE BLOCKER

Use only for repository integrity or unexpected material regression that prevents a trustworthy close candidate.

---

# 96. DEFINITION OF DONE

This implementation task is complete only when:

- [ ] implementation guide read
- [ ] Product / UX Contract read
- [ ] Coordinate Consistency Closeout read
- [ ] Coordinate Delta read if separate
- [ ] branch recorded
- [ ] exact baseline HEAD recorded
- [ ] origin/master recorded
- [ ] baseline relationship verified
- [ ] unrelated WIP identified
- [ ] unrelated WIP untouched
- [ ] sealed tracks respected
- [ ] Scenario-B remains paused
- [ ] existing placement path traced
- [ ] existing placement validation authority preserved
- [ ] raw X/Y removed from normal player placement flow
- [ ] required non-coordinate placement data preserved
- [ ] typed/structured transient placement session implemented
- [ ] placement session not persisted
- [ ] Buildings placement entry implemented
- [ ] Buildings→World transition implemented
- [ ] World placement mode implemented
- [ ] selected building identity visible
- [ ] placement instruction visible
- [ ] coordinate adapter centralized
- [ ] stable approved projection anchor used
- [ ] `s = 1` implemented
- [ ] `round` implemented
- [ ] no PDM candidate `floor`
- [ ] negative unprojection returns no-pick
- [ ] no clamping to zero
- [ ] no presentation-derived upper gameplay bound
- [ ] WORLD_MAP_CELL_SIZE not used as gameplay capacity
- [ ] region inset not used as gameplay bound
- [ ] pickability separated from gameplay validity
- [ ] existing camera conversion reused
- [ ] pan works coherently
- [ ] zoom works coherently
- [ ] pan does not change domain semantics
- [ ] zoom does not change domain semantics
- [ ] pointer/tap selects candidate
- [ ] candidate pick does not mutate gameplay
- [ ] candidate repick does not mutate gameplay
- [ ] preview implemented
- [ ] preview uses candidate domain Position
- [ ] preview uses shared forward projection
- [ ] existing building markers use domain Position anchor
- [ ] distributeMarkerPosition no longer authoritative
- [ ] existing persisted Positions unchanged
- [ ] no collision rule added
- [ ] no capacity rule added
- [ ] no coordinate maximum added
- [ ] preview→final continuity implemented
- [ ] explicit confirm implemented
- [ ] confirm uses existing placement path
- [ ] confirm submits candidate x/y
- [ ] confirm cannot accidentally double-submit
- [ ] success clears placement session
- [ ] success remains on World
- [ ] final building uses same domain projection
- [ ] rejection remains in placement mode
- [ ] rejection does not masquerade as no-pick
- [ ] explicit cancel implemented
- [ ] cancel performs no gameplay mutation
- [ ] cancel clears session
- [ ] navigation-away clears session
- [ ] normal marker interaction restored after placement mode
- [ ] region semantics unchanged
- [ ] regionId not invented from pointer geometry
- [ ] default-region semantics preserved
- [ ] narrow placement coherent around 480×900
- [ ] narrow confirm reachable
- [ ] narrow cancel reachable
- [ ] narrow does not require X/Y fallback
- [ ] no new art
- [ ] no tutorial expansion
- [ ] no World visual redesign
- [ ] no gameplay balance change
- [ ] no content/YAML change
- [ ] no save-schema change
- [ ] no API-semantic change
- [ ] coordinate adapter tests added
- [ ] `round` vs `floor` test added
- [ ] negative no-pick test added
- [ ] high positive Position/no-cap test added
- [ ] round-trip test added
- [ ] placement-session tests added
- [ ] no-mutation-before-confirm test added
- [ ] confirm test added
- [ ] cancel test added
- [ ] navigation-away test added
- [ ] existing marker projection test added
- [ ] preview→final continuity test added
- [ ] affected regression tests updated rather than deleted
- [ ] focused tests PASS
- [ ] root typecheck PASS
- [ ] root lint checked and exact errors/warnings reported
- [ ] root tests PASS
- [ ] root build:web PASS
- [ ] task-owned files identified
- [ ] unrelated WIP still untouched
- [ ] close-candidate report written
- [ ] runtime evidence status explicitly stated
- [ ] no known easy task-local defect left unresolved
- [ ] exactly one final option returned
- [ ] no commit
- [ ] no push
- [ ] no tag

---

# 97. CORE EXECUTION RULE

The contract phase is over.

Implement the approved PDM-001 interaction.

The player should no longer place buildings by reasoning about raw X/Y coordinates.

They should:

> choose the building
> → choose its location on the World
> → see the candidate
> → explicitly confirm.

But the map is only the interaction layer.

Gameplay authority remains where it already exists.

Do not invent placement rules.

Do not invent coordinate limits.

Do not turn region artwork into gameplay bounds.

Do not use `floor`.

Use:

> stable approved anchor

> `s = 1`

> `round`

> negative unprojection → no-pick

> no presentation-derived upper gameplay cap.

Keep:

> camera conversion

separate from:

> domain coordinate projection.

Use one shared domain→World projection for:

> preview

> existing buildings

> newly placed building.

The position previewed must be the position submitted.

The position submitted must be the position stored.

The position stored must project back to the same logical World anchor.

Candidate selection must not mutate gameplay.

Only explicit confirmation may invoke the existing authoritative place-building path.

Cancel must mutate nothing.

Navigation away must leave no stale placement session.

Keep desktop and narrow coherent.

Do not reopen Scenario-B.

Do not change saves.

Do not change APIs.

Do not change gameplay balance/content.

Fix obvious PDM-local defects in this pass.

Return one bounded implementation close candidate for independent review.

Do not commit.

Do not push.

Do not tag.

Then STOP.

# END OF PROMPT