# POST-V1 PDM-001
# Direct Map Building Placement
# Product / UX Contract Definition

## MODE

READ-ONLY PRODUCT / UX CONTRACT DEFINITION.

No implementation.

No production-code changes.

No product-test changes.

No gameplay/content/save/API changes.

No art.

No commit.
No push.
No tag.

PDM-001 has already passed the Next-Material-Slice decision as:

> MATERIALITY: HIGH

> IMPLEMENTATION READY: NO

> CONTRACT-DEFINITION READY: YES

The purpose of this task is to define the authoritative Product / UX Contract required before implementation can begin.

This is NOT an implementation prompt.

This is NOT a map redesign.

This is NOT a gameplay-design exercise.

This is NOT permission to invent new building-placement rules.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

---

# 1. READ FIRST

Read:

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/architecture/reviews/POST_V1_NEXT_MATERIAL_SLICE_DELTA_GATE_AFTER_WORKFORCE_NAV_001.md`
- `docs/architecture/reviews/POST_V1_NEXT_MATERIAL_SLICE_DELTA_GATE_AFTER_WORKFORCE_NAV_001_BASELINE_RECHECK.md`

Then inspect only the current code required to define the PDM contract.

At minimum inspect current authoritative paths for:

- Buildings / building catalog;
- current placement form;
- current X/Y inputs;
- existing place-building action;
- `PlaceBuildingUseCase`;
- domain `Position`;
- placement validation/rejection;
- World/map rendering;
- map pan/zoom;
- building marker coordinates;
- region/map geometry;
- current navigation between Buildings and World;
- current narrow/mobile World behavior.

Do not perform another repository-wide UX audit.

---

# 2. BASELINE

Record:

- branch;
- exact HEAD;
- HEAD subject;
- `origin/master`;
- HEAD/origin relationship;
- working-tree status;
- unrelated WIP.

Expected reviewed baseline:

> WORKFORCE-NAV-001 committed / pushed / sealed

Previous verified commit:

`500a00a086fa083c1bca461ccbe87b1f23f9b675`

Do not assume this SHA remains current.

Verify actual Git truth.

Unrelated WIP must remain untouched.

---

# 3. SEALED WORK

Treat as CLOSED / PASS / SEALED:

- WORKFORCE-NAV-001
- WORKFORCE-GUIDANCE-001
- RESEARCH-METRICS-001
- RESEARCH-STATUS-001
- TRANSPORT-STATUS-001
- TIME-UX-R1
- PGD family
- V1 release gates
- sealed visual tracks

Scenario-B remains PAUSED.

Do not reopen any of these.

---

# 4. CONFIRMED PDM STARTING POINT

The previous gate established:

- manual X/Y is still the normal player-facing building-placement path;
- direct map placement does not exist;
- the World map currently supports region/building interaction and pan/zoom;
- rendered World building-marker positions are not currently authoritative placement coordinates;
- no authoritative map-pointer → domain `Position` contract exists;
- no placement preview contract exists;
- PDM remains HIGH materiality;
- PDM implementation is NOT ready;
- PDM Product / UX Contract Definition IS ready.

Do not redo that gate.

This task must resolve the missing contract.

---

# 5. PRODUCT GOAL

The target player experience is:

> The player should place a building by choosing its position directly on the World map instead of having to reason about raw X/Y coordinates.

The intended high-level flow is:

> choose building
> → enter placement mode
> → choose location on World
> → see candidate placement
> → confirm
> → existing authoritative placement command executes

with:

> cancel

available before confirmation.

This is the target UX direction.

The exact implementation mechanism must follow repository architecture.

---

# 6. CORE PRODUCT PRINCIPLE

Direct map placement changes:

> how the player selects a position.

It must NOT change:

> whether the placement is allowed.

Existing gameplay/application/domain authority remains authoritative for:

- building availability;
- prerequisites;
- cost;
- position validity;
- region/bounds rules;
- construction behavior;
- placement rejection;
- any existing occupancy constraints;
- any existing gameplay restrictions.

PDM is a direct-manipulation UX layer over existing placement semantics.

---

# 7. RAW X/Y PRODUCT DECISION

The normal player workflow must no longer require manual entry of raw X/Y coordinates.

Contract target:

> Raw X/Y is not the primary normal-player placement interaction after PDM.

Determine whether current architecture justifies:

A. removing the raw X/Y controls from normal player presentation;

or:

B. retaining them only as a clearly secondary/fallback mechanism.

Do NOT choose fallback merely because it is easy to keep.

Assess whether any actual player workflow requires manual coordinates.

Developer/debug needs are not automatically player needs.

The contract report must make an explicit decision.

---

# 8. PLACEMENT-MODE ENTRY

Define exactly how the player enters direct placement mode.

Preferred product direction:

> The player chooses a placeable building from the existing Buildings/Baukatalog flow and activates the existing placement action.

Instead of asking for X/Y immediately, the application transitions into:

> World placement mode

for that selected building.

Determine the smallest architecture-consistent entry point.

Do not create a second building catalog.

Do not duplicate prerequisite/cost logic.

---

# 9. SELECTED BUILDING CONTEXT

Placement mode must carry structured context identifying:

- selected building type/definition;
- any existing placement/application data already required by the place-building command.

Do not derive selected building identity from:

- German labels;
- DOM text;
- image filename;
- list position.

Use authoritative existing identifiers.

Placement mode is transient presentation/application state.

---

# 10. WORLD TRANSITION

Decide whether entering placement mode should:

> navigate automatically to World

or:

> activate placement inside an already-visible World context.

Use current application/navigation architecture to choose the coherent contract.

The player must not have to manually navigate to World after explicitly choosing:

> Gebäude platzieren.

The selected building context must survive the transition.

---

# 11. PLACEMENT-MODE VISIBILITY

The player must clearly understand that the World is temporarily in building-placement mode.

Define a minimal presentation contract.

It should communicate at least:

- which building is being placed;
- that the player should choose a location;
- how to cancel.

Do not design a large new overlay if existing shell/panel architecture can communicate this compactly.

Do not rely on cursor shape alone.

---

# 12. MAP INTERACTION OWNERSHIP

While placement mode is active:

- map pointer/click interaction may select a candidate placement position;
- normal World interaction must not accidentally perform conflicting actions.

Determine current conflicts such as:

- region selection;
- building marker selection;
- drag-to-pan;
- click-to-select;
- other pointer handlers.

Define which interactions remain active during placement mode.

Do not break pan/zoom unnecessarily.

---

# 13. PAN / ZOOM PRODUCT CONTRACT

Preferred product contract:

> Pan and zoom remain available during placement mode.

Reason:

the player may need to inspect the World before choosing a position.

Placement must therefore interpret pointer position in a way that remains correct under current pan/zoom state.

Do not disable navigation around the map merely to avoid coordinate conversion unless current architecture makes this unavoidable and the report clearly identifies the blocker.

---

# 14. COORDINATE AUTHORITY — CRITICAL

This is the central contract problem.

Trace:

- domain `Position`;
- existing X/Y placement range/semantics;
- World SVG/viewBox/logical coordinate space;
- pan/zoom transform;
- region geometry;
- existing building marker positioning.

Explicitly distinguish:

> presentation coordinates

from:

> authoritative domain placement coordinates.

Do NOT assume current decorative/algorithmic marker positions are valid domain positions.

---

# 15. MAP → DOMAIN POSITION CONTRACT

Define an authoritative conceptual transformation:

> visible World pointer location
> → map logical coordinate
> → domain placement `Position`

The contract must specify:

- input coordinate space;
- handling of viewport offset;
- handling of current pan;
- handling of current zoom;
- map logical coordinate space;
- conversion to domain X/Y;
- bounds behavior;
- deterministic rounding/normalization if required.

Do not implement the formula.

But the contract must be precise enough that implementation can later implement and test one deterministic transform.

---

# 16. NO INVENTED SNAPPING

Do not introduce grid snapping unless existing placement semantics already establish discrete integer/grid positions.

If domain `Position` requires integers:

determine the existing normalization rule.

If current X/Y inputs already enforce integer coordinates:

reuse that authority.

The contract may specify deterministic conversion to that existing representation.

Do not invent:

- hex grids;
- tile grids;
- nearest-region snapping;
- marker snapping;
- arbitrary spacing rules.

---

# 17. DOMAIN BOUNDS

Trace existing authoritative placement bounds.

The map-to-position contract must map only into the existing valid domain coordinate space.

Do not infer validity solely from SVG dimensions.

The visual map may have margins/padding/presentation geometry that are not gameplay coordinates.

Explicitly define how out-of-domain pointer positions behave.

Preferred UX:

> no valid candidate placement is produced outside the authoritative placement domain.

---

# 18. REGION SEMANTICS

Determine whether current building placement has authoritative region membership semantics.

If region is derived from domain `Position`:

reuse it.

If region is separately selected:

preserve existing authority.

If World region geometry is only presentational and cannot authoritatively determine gameplay region:

do not invent polygon-based gameplay rules.

Document exact current truth.

---

# 19. PLACEMENT PREVIEW — PRODUCT DECISION

Direct placement must provide a candidate preview before gameplay mutation.

Required:

> selecting/moving the candidate position does NOT place the building.

The player must be able to inspect the candidate before confirmation.

Define a transient:

> placement candidate

concept.

This candidate is presentation/application state only.

It must not enter save state.

---

# 20. PREVIEW VISUAL

The candidate preview should use the existing building visual language where practical.

Preferred hierarchy:

1. existing building artwork/marker for the selected building;
2. existing category/building presentation if no dedicated artwork is available;
3. bounded generic placement representation only if necessary.

Do not generate new art.

Do not reopen Scenario-B.

The preview must be visually distinguishable from an already-placed building.

---

# 21. PREVIEW POSITION

The preview must track the current candidate domain position mapped back into the World presentation.

This is important:

> pointer → domain Position → preview presentation

should use one coherent transform contract.

Do not allow the preview to use one coordinate model while confirmation submits another.

The preview should represent the position that would actually be submitted.

---

# 22. VALID / INVALID FEEDBACK

The player needs feedback before confirmation.

Determine what current authoritative placement validation can be evaluated before executing the final place-building mutation.

Preferred contract:

> candidate validity is derived from existing placement/application/domain validation semantics.

Do not duplicate gameplay rules in UI.

Do not create a separate frontend-only validity model that can drift from the command.

---

# 23. VALID CANDIDATE PRESENTATION

For a candidate currently considered valid:

the UI should clearly indicate:

> placement can be confirmed.

Use existing design language where possible.

Do not prescribe new colors unless current design tokens already establish valid/success semantics.

Text/icon/state can be used.

The contract is semantic, not pixel-design specification.

---

# 24. INVALID CANDIDATE PRESENTATION

For a candidate currently considered invalid:

- show that placement cannot currently be confirmed;
- preserve the candidate so the player can choose another position;
- show an existing authoritative reason if one is safely available.

Do not invent new rejection reasons.

Do not expose raw internal enum/ID text if existing player-facing formatting exists.

---

# 25. CONFIRM PRODUCT DECISION

Placement requires an explicit confirmation step.

A map click selecting a candidate must NOT immediately execute gameplay placement.

Required sequence:

> choose candidate
> → inspect preview/validity
> → confirm placement

Confirmation executes the existing authoritative placement application path.

Prefer reuse of:

> existing `placeBuilding` / `PlaceBuildingUseCase`

or the current equivalent.

Do not create a second placement command.

---

# 26. CONFIRM CONTROL

Define an explicit player-facing confirmation action.

Preferred wording should follow existing Buildings terminology.

Possible semantic action:

> `Gebäude platzieren`

Use repository terminology to choose exact wording.

Do not blindly add a second identically named button if that would make source vs confirmation ambiguous.

The report must recommend exact player-facing wording based on existing terminology.

---

# 27. INVALID CONFIRM

When candidate placement is invalid:

> confirm must not execute the placement command.

Prefer disabled/unavailable confirm plus visible reason.

Do not rely on letting the player repeatedly submit known-invalid placement merely to receive an error.

However, final command validation must still remain authoritative.

UI prevalidation is not a security/gameplay authority replacement.

---

# 28. CANCEL PRODUCT DECISION

Placement mode must always provide an explicit:

> Abbrechen

or repository-authoritative equivalent.

Cancel must:

- leave placement mode;
- clear candidate position;
- clear selected placement context;
- perform no gameplay mutation.

Do not require the player to place something after entering placement mode.

---

# 29. CANCEL DESTINATION

Determine the coherent post-cancel destination from current navigation architecture.

Preferred product behavior:

> return to the prior Buildings placement/catalog context when that context is reliably available.

If preserving exact prior context would require disproportionate navigation infrastructure:

a stable Buildings destination is acceptable.

Do not invent browser-history-like state unless architecture already supports it.

Make an explicit contract decision.

---

# 30. SUCCESS BEHAVIOR

After successful confirmed placement:

- clear placement mode;
- clear candidate state;
- do not leave stale placement intent;
- present the newly placed building in the normal game state.

Determine whether current architecture naturally supports remaining on World after placement.

Preferred product direction:

> remain on World so the player can see the newly placed building.

Do not automatically reopen the building catalog unless current product flow clearly requires it.

---

# 31. REJECTION BEHAVIOR

If final authoritative placement execution rejects the candidate despite prevalidation:

- remain in placement mode;
- keep or restore the candidate where safe;
- present the authoritative player-facing rejection;
- allow correction/retry;
- do not silently exit placement mode;
- do not mutate unrelated state.

Do not invent recovery semantics that contradict the existing command/application result model.

---

# 32. ONE PLACEMENT PER CONFIRM

One confirmation corresponds to one building placement attempt.

Do not introduce:

- multi-place mode;
- repeated stamping;
- shift-click placement;
- placement queues.

Those are separate product decisions.

PDM-001 is one selected building → one confirmed placement.

---

# 33. NO AUTO-CONSTRUCTION CHANGES

After placement succeeds:

all existing construction/building lifecycle behavior remains unchanged.

Do not change:

- build duration;
- costs;
- workforce;
- Production;
- energy;
- transport;
- prerequisites.

PDM ends at selecting/submitting position and presenting the result.

---

# 34. RAW X/Y FALLBACK DECISION

Explicitly determine one of:

## A — REMOVE FROM NORMAL PLAYER FLOW

Use if raw coordinates have no established player-facing need.

The underlying domain Position remains internal/application data.

or:

## B — SECONDARY ADVANCED FALLBACK

Use only if current repository/product evidence establishes a real player need.

If retained:

- it must not remain the primary path;
- direct placement remains default;
- fallback must use the same authoritative validation.

Do NOT retain X/Y merely because deleting controls feels risky.

---

# 35. KEYBOARD / POINTER CONTRACT

Define minimum interaction semantics without overdesign.

At minimum decide:

- pointer/tap chooses candidate;
- explicit UI action confirms;
- explicit UI action cancels.

If current application already has a standard Escape-to-cancel convention, it may be reused.

Do not introduce keyboard shortcuts without existing convention/evidence.

Keyboard accessibility must not require coordinate entry.

---

# 36. NARROW VIEWPORT CONTRACT

PDM must have a coherent narrow behavior.

Target viewport:

> approximately 480×900

The contract must define:

- placement mode remains usable;
- map remains visible enough to choose a position;
- selected building identity remains understandable;
- confirm/cancel remain reachable;
- candidate validity remains understandable.

Do not solve narrow mode by restoring manual X/Y as the primary interaction.

---

# 37. NARROW CONTROL PLACEMENT

Determine whether existing responsive shell patterns support:

- compact top/bottom action bar;
- existing sidebar/drawer;
- another current responsive control surface.

Prefer reuse.

Do not design a new mobile shell.

The contract report should specify semantic placement, not pixel-perfect CSS.

---

# 38. MAP PAN ON NARROW

If map pan is already required on narrow:

placement mode must coexist with it.

Define an interaction distinction based on existing input patterns.

For example:

- drag = pan;
- tap/click = choose candidate.

Only adopt this if compatible with current map implementation.

Do not invent gesture complexity unnecessarily.

---

# 39. BUILDING MARKER INTERACTION DURING PLACEMENT

Determine how existing building markers behave while placement mode is active.

Preferred contract:

> placement intent takes precedence over normal building selection when the player is choosing a candidate location.

But do not make existing buildings disappear.

If clicking an existing marker currently opens/selects it, define whether that behavior is temporarily suppressed during placement mode.

Avoid accidental navigation away from placement.

---

# 40. REGION INTERACTION DURING PLACEMENT

Likewise determine whether normal region selection should:

- remain available;
- be suppressed;
- or coexist with candidate selection.

The contract should minimize ambiguous clicks.

Do not change region gameplay semantics.

---

# 41. PLACEMENT MODE EXIT BY NAVIGATION

Define what happens if the player navigates to another primary section while placement mode is active.

Preferred safe contract:

> leaving World cancels the transient placement session unless the existing navigation architecture supports preserving it safely.

No gameplay mutation.

No persisted placement session.

No stale candidate on later World return.

---

# 42. TRANSIENT STATE CONTRACT

PDM placement session state may include:

- selected building definition/id;
- candidate domain Position;
- validity/presentation result;
- origin/navigation context if needed.

It must remain transient.

It must NOT be added to:

- save schema;
- domain aggregate persistence;
- API persistence;
- simulation state.

Do not serialize unfinished placement sessions.

---

# 43. EXISTING COMMAND AUTHORITY

Trace the current final placement call.

The contract must state exactly which existing application/domain path remains authoritative after confirmation.

Expected shape:

> PDM confirmation
> → existing placement application command/use case
> → existing domain validation/mutation

Do not allow:

> map component directly mutates game state.

---

# 44. VALIDATION AUTHORITY MATRIX

Create a small authority matrix in the report.

At minimum:

| Concern | Authority |
|---|---|
| Building type availability | existing authority |
| Prerequisites | existing authority |
| Cost | existing authority |
| Domain Position representation | existing authority |
| Placement bounds | existing authority |
| Occupancy/collision if applicable | existing authority |
| Candidate pointer mapping | NEW PDM UX/application contract |
| Preview state | NEW transient PDM contract |
| Confirm/cancel | NEW PDM UX contract |
| Final placement mutation | existing placement command/use case |

Do not invent an authority where none exists.

If one is genuinely absent, state:

> NOT ESTABLISHED

and assess whether that blocks implementation.

---

# 45. COORDINATE CONTRACT — REQUIRED OUTPUT

The report must contain a dedicated conceptual coordinate pipeline.

Use actual repository names where possible.

Required structure:

> **Pointer / viewport coordinate**
>
> ↓
>
> **World-local rendered coordinate**
>
> ↓ inverse current pan/zoom transform
>
> **World logical coordinate**
>
> ↓ deterministic PDM mapping
>
> **Domain `Position { x, y }`**
>
> ↓ existing normalization/validation
>
> **Candidate placement**

Then define the inverse required for preview:

> Domain `Position`
>
> ↓
>
> World logical/render coordinate
>
> ↓ current pan/zoom
>
> preview screen position

If current architecture requires a different pipeline:

document the actual coherent equivalent.

Do not provide implementation code.

---

# 46. COORDINATE MAPPING DECISION STANDARD

The contract is sufficient only if a later implementation prompt can ask for deterministic tests such as:

> Given map transform T and pointer P,
> candidate domain Position is exactly X/Y.

and:

> Given domain Position X/Y,
> preview renders at the corresponding World logical position.

If the contract cannot support deterministic bidirectional tests:

it is not ready.

---

# 47. IMPORTANT — DECORATIVE MAP GEOMETRY

Do not silently treat existing procedural/algorithmic building marker placement as domain truth.

If current World markers are positioned for visual layout rather than domain X/Y:

the contract must explicitly separate those systems.

A later PDM implementation may require introducing a proper authoritative map projection for placeable coordinates.

That is acceptable if bounded.

But the contract must say so clearly.

---

# 48. EXISTING BUILDINGS AFTER PDM

Assess whether existing placed buildings can eventually be rendered using the same domain→World mapping required by PDM.

This is relevant because:

> candidate preview and final placed building should not jump to an unrelated visual position after confirmation.

Do not implement this now.

But explicitly classify:

- REQUIRED FOR PDM correctness;
- desirable follow-up;
- unnecessary because current architecture already aligns them.

If current algorithmic marker placement would cause the confirmed building to visually jump away from its preview:

that is a material implementation-contract issue and must be captured.

---

# 49. PREVIEW → FINAL VISUAL CONTINUITY

Product requirement:

> After confirmation, the resulting placed building should appear at the same logical World location represented by the preview, within normal rendering tolerance.

If current World rendering cannot satisfy this because placed markers ignore domain Position:

identify this as part of PDM's required implementation boundary.

Do NOT classify it as optional visual polish.

This is interaction correctness.

---

# 50. EXISTING BUILDING MIGRATION FIREWALL

Do not propose save migrations solely to reposition existing buildings.

Existing saved domain Positions already remain authoritative.

If World rendering must begin honoring those positions:

that should preferably be a presentation mapping change.

If repository truth shows otherwise:

state the blocker.

Do not invent migration work.

---

# 51. ERROR PRESENTATION

Reuse existing player-facing placement/building error formatting where available.

Do not expose:

- raw error enum;
- raw internal ID;
- stack trace;
- command object.

If no suitable presentation exists:

identify the bounded presentation contract needed.

Do not broaden into general error-system redesign.

---

# 52. ACCESSIBILITY / CLARITY

The contract must not rely solely on:

- color;
- tiny cursor changes;
- hover-only state.

At minimum the player must have textual or structural confirmation of:

- selected building;
- placement mode;
- valid/invalid state;
- confirm;
- cancel.

Keep this bounded.

---

# 53. NO TUTORIAL EXPANSION

Do not modify tutorial/onboarding.

If PDM eventually changes tutorial instructions:

record:

> tutorial follow-up may be required after PDM implementation

but do not contract tutorial behavior here.

---

# 54. NO VISUAL PRODUCTION

No new:

- icons;
- building artwork;
- World artwork;
- cursor art;
- overlays requiring bespoke art.

Reuse existing visual assets/components.

Scenario-B remains PAUSED.

---

# 55. NO ECONOMY / GAMEPLAY CHANGE

Explicitly verify the proposed contract does not alter:

- costs;
- prerequisites;
- availability;
- construction time;
- worker requirements;
- Production;
- transport;
- energy;
- research;
- milestones.

PDM changes interaction only.

---

# 56. IMPLEMENTATION BOUNDARY FORECAST

Without writing code, identify the likely bounded implementation ownership.

Expected families may include:

- Buildings placement presentation;
- structured transient placement intent/state;
- World map interaction;
- coordinate adapter/projection;
- placement preview;
- existing placement-command adapter;
- focused tests;
- runtime evidence.

Do not name speculative files as mandatory if repository inspection does not support them.

Classify expected files/modules based on actual architecture.

---

# 57. ARCHITECTURE BOUNDARY

The contract should prefer:

> one explicit map/domain coordinate adapter

over duplicated coordinate math across React components.

The World UI should not independently reproduce placement-domain rules.

The placement form should not own map projection.

The domain should not learn about pixels.

Maintain separation:

> viewport/render geometry
> ↔ presentation/application adapter
> ↔ domain Position.

---

# 58. IMPLEMENTATION READINESS QUESTIONS

The contract report must determine whether, after this task, all of these are answered:

1. How does placement mode start?
2. What building context is carried?
3. Where does placement happen?
4. How is placement mode shown?
5. Can the player pan?
6. Can the player zoom?
7. What selects a candidate?
8. What coordinate spaces exist?
9. How are they converted?
10. How is domain Position normalized?
11. What bounds apply?
12. What rules define validity?
13. Where do those rules come from?
14. How is candidate validity shown?
15. What does preview render?
16. Does preview correspond to final domain Position?
17. How is placement confirmed?
18. What existing command executes?
19. How is placement cancelled?
20. What happens after success?
21. What happens after rejection?
22. What happens when navigating away?
23. What happens on narrow viewport?
24. What happens to normal marker/region interactions?
25. What happens to raw X/Y?
26. Does any save/API change occur?
27. Does any gameplay rule change?
28. Can implementation be tested deterministically?
29. Can runtime evidence prove preview→final continuity?

If any material answer remains unresolved:

contract is not yet implementation-ready.

---

# 59. PRODUCT DECISION VS REPOSITORY FACT

For every major contract item classify it as one of:

> EXISTING AUTHORITY

> APPROVED PRODUCT DECISION

> DERIVED UX CONTRACT

> UNRESOLVED / BLOCKING

This prevents assumptions from silently becoming gameplay rules.

Use this classification especially for:

- coordinate mapping;
- validity;
- snapping/normalization;
- preview;
- confirm;
- cancel;
- raw X/Y fallback;
- narrow behavior.

---

# 60. PRODUCT DECISION DEFAULTS

Unless current repository authority contradicts them, use these approved product-direction defaults:

1. Direct map placement becomes the normal placement path.
2. Selecting a building and choosing placement transitions into World placement mode.
3. Pan/zoom remain available.
4. Pointer/tap selects a candidate; it does not immediately place.
5. Candidate preview is shown before mutation.
6. Existing gameplay placement validation remains authoritative.
7. Valid/invalid state is communicated before confirm where possible.
8. Placement requires explicit confirmation.
9. Cancel performs no gameplay mutation.
10. Successful placement remains on World.
11. Leaving placement mode/navigation clears transient placement state.
12. One placement per placement session.
13. No automatic repeated placement.
14. No new gameplay rules.
15. No save/API changes.
16. Narrow uses direct placement too.
17. Raw X/Y is not the primary normal-player workflow.
18. Preview and final placed building must represent the same logical position.

If one default conflicts with existing authority:

do NOT force it.

Document the conflict.

---

# 61. DO NOT INVENT COORDINATE NUMBERS

This prompt intentionally does NOT prescribe:

- World logical width;
- World logical height;
- domain min/max;
- scaling factors;
- origin;
- axis direction;
- rounding constants.

Cursor must derive these from repository truth.

If repository truth does not establish enough information to define a deterministic mapping:

return a blocking contract result.

Do not choose arbitrary numbers.

---

# 62. CONTRACT VALIDATION EXAMPLES

The final contract should include conceptual acceptance scenarios.

At minimum:

## Scenario A — Enter placement

Given a placeable building is selected,
when the player chooses placement,
then World enters placement mode carrying that building context.

## Scenario B — Choose candidate

Given placement mode,
when the player selects a valid World location,
then a candidate domain Position and preview are shown,
without placing the building.

## Scenario C — Pan/zoom

Given placement mode and an unchanged logical location,
when the player pans/zooms,
then candidate domain Position remains unchanged and preview tracks correctly.

## Scenario D — Invalid candidate

Given an invalid candidate,
then the player receives invalid feedback and cannot knowingly confirm it.

## Scenario E — Confirm

Given a valid candidate,
when the player confirms,
then the existing placement command executes once with the selected building and candidate domain Position.

## Scenario F — Cancel

Given placement mode,
when the player cancels,
then placement state clears and no gameplay mutation occurs.

## Scenario G — Final continuity

Given a successful placement,
then the resulting building appears at the logical location represented by the preview.

## Scenario H — Narrow

Given approximately 480×900,
the player can select candidate, understand validity, confirm, and cancel without raw X/Y entry.

Adapt wording to actual repository semantics.

---

# 63. TESTABILITY FORECAST

Define the later implementation test strategy conceptually.

Expected focused tests:

- coordinate adapter;
- inverse/round-trip mapping where appropriate;
- pan/zoom invariance;
- candidate state;
- no mutation before confirm;
- valid confirm submits existing command;
- invalid confirm blocked;
- cancel clears state;
- navigation-away clears state;
- preview/final mapping continuity;
- narrow control state where component-testable.

Do not write tests now.

---

# 64. RUNTIME CERTIFICATION FORECAST

Define what later runtime evidence must prove.

Expected desktop flow around 1440×900:

> Buildings
> → select placeable building
> → placement mode
> → World
> → choose candidate
> → preview
> → confirm
> → building appears at preview location.

Expected invalid path:

> invalid candidate
> → feedback
> → no placement.

Expected cancel path:

> candidate
> → cancel
> → no building placed.

Expected narrow flow around 480×900:

> same core placement workflow remains usable.

Do not capture evidence now.

---

# 65. CONTRACT REPORT PATH

Create:

`docs/architecture/reviews/POST_V1_PDM_001_PRODUCT_UX_CONTRACT.md`

Do not overwrite previous PDM delta gates.

---

# 66. REQUIRED REPORT STRUCTURE

Use:

## A. Executive contract result

## B. Baseline

## C. Existing placement authority

## D. Existing World/map authority

## E. Player problem

## F. Approved placement flow

## G. Placement-mode entry and exit

## H. Coordinate-space model

## I. Map → domain Position contract

## J. Domain Position → preview/final rendering contract

## K. Pan/zoom interaction

## L. Placement candidate / preview

## M. Validity authority and feedback

## N. Confirm contract

## O. Cancel contract

## P. Success and rejection behavior

## Q. Raw X/Y disposition

## R. Desktop interaction

## S. Narrow interaction

## T. Existing marker/region interaction during placement

## U. Transient state / save/API firewall

## V. Validation authority matrix

## W. Implementation boundary forecast

## X. Testability forecast

## Y. Runtime certification forecast

## Z. Remaining blockers

## AA. Final implementation-readiness decision

Keep it precise.

Do not pad the report with generic UX theory.

---

# 67. REQUIRED CONTRACT TABLE

Include one main contract table:

| Contract item | Decision | Authority | Implementation consequence |
|---|---|---|---|
| Placement entry | ... | ... | ... |
| World transition | ... | ... | ... |
| Candidate selection | ... | ... | ... |
| Coordinate mapping | ... | ... | ... |
| Pan/zoom | ... | ... | ... |
| Preview | ... | ... | ... |
| Validity | ... | ... | ... |
| Confirm | ... | ... | ... |
| Cancel | ... | ... | ... |
| Success | ... | ... | ... |
| Rejection | ... | ... | ... |
| Raw X/Y | ... | ... | ... |
| Narrow | ... | ... | ... |
| Save/API | ... | ... | ... |

No numeric scoring.

---

# 68. REQUIRED FACTUAL QUESTIONS

Explicitly answer:

1. What branch was reviewed?
2. What exact HEAD was reviewed?
3. What is the HEAD subject?
4. What is `origin/master`?
5. Does HEAD equal `origin/master`?
6. What unrelated WIP exists?
7. Is WORKFORCE-NAV still sealed?
8. Does Scenario-B remain paused?
9. What exact current UI starts building placement?
10. Where are raw X/Y entered?
11. What exact application path executes placement?
12. What exact domain Position type is used?
13. What normalization does Position require?
14. What placement bounds exist?
15. What existing validation determines placement success?
16. Are prerequisites validated by the existing path?
17. Are costs validated by the existing path?
18. Are occupancy/collision rules present?
19. Does placement currently have region semantics?
20. What coordinate space does World render?
21. What coordinate space does placement consume?
22. Are current building marker coordinates authoritative domain coordinates?
23. How are current markers positioned?
24. What pan transform exists?
25. What zoom transform exists?
26. Can pointer coordinates be transformed into World-local coordinates?
27. Is an inverse pan/zoom transform feasible?
28. What deterministic mapping from World logical coordinate to domain Position is justified?
29. Does that mapping require arbitrary new gameplay numbers?
30. Is integer/grid normalization already authoritative?
31. Is snapping required by existing semantics?
32. Does PDM need new snapping rules?
33. How should out-of-domain pointer positions behave?
34. How is region membership handled?
35. What starts placement mode?
36. Does selecting placement navigate to World?
37. What selected-building context must be carried?
38. Where should transient placement state live conceptually?
39. Is any placement state persisted?
40. What interaction selects a candidate?
41. Does candidate selection mutate gameplay?
42. What preview is shown?
43. Can existing building art be reused?
44. How is preview visually distinguished from a placed building?
45. Does preview use the exact candidate domain Position?
46. Can preview and final building share one projection contract?
47. Would current final marker rendering cause a preview→final jump?
48. If yes, is correcting domain→World marker projection required for PDM correctness?
49. What existing authority determines candidate validity?
50. Can validity be evaluated before final mutation?
51. How is valid state communicated?
52. How is invalid state communicated?
53. Are authoritative rejection reasons available?
54. What exact action confirms placement?
55. Does confirm reuse the existing placement command/use case?
56. Can confirm execute more than once accidentally?
57. Is invalid confirm prevented?
58. Does final command validation remain authoritative?
59. What exact action cancels placement?
60. Does cancel mutate gameplay?
61. Where does cancel return the player?
62. What happens after successful placement?
63. Does placement mode clear after success?
64. Does the player remain on World?
65. What happens after final command rejection?
66. Does rejection keep the player in placement mode?
67. What happens when the player navigates away?
68. Does stale placement state survive?
69. How do map pan and zoom behave during placement?
70. How do existing building-marker clicks behave during placement?
71. How do region clicks behave during placement?
72. Can drag-to-pan coexist with candidate selection?
73. What is the narrow interaction contract?
74. Are confirm/cancel reachable around 480×900?
75. Does narrow still use direct map placement?
76. Is raw X/Y removed from the normal player flow?
77. If raw X/Y remains, what evidence justifies it?
78. Is raw X/Y still primary anywhere?
79. Are any new gameplay rules required?
80. Are any new placement validity rules required?
81. Are any save changes required?
82. Are any API changes required?
83. Are any domain persistence changes required?
84. Is a new global navigation framework required?
85. Is new art required?
86. Does Scenario-B remain paused?
87. What explicit coordinate adapter boundary should later implementation own?
88. Can coordinate behavior be tested deterministically?
89. Can pan/zoom invariance be tested?
90. Can no-mutation-before-confirm be tested?
91. Can cancel be tested?
92. Can preview→final continuity be tested?
93. What desktop runtime flow should later certify PDM?
94. What invalid runtime flow should later certify PDM?
95. What cancel runtime flow should later certify PDM?
96. What narrow runtime flow should later certify PDM?
97. Does the completed contract answer all material implementation questions?
98. What material questions remain unresolved?
99. Is PDM implementation now READY after this contract?
100. If not, what exact blocker remains?
101. Is a bounded implementation prompt justified next?
102. Was any production code changed?
103. Was any product-test code changed?
104. Was any gameplay/content/save/API code changed?
105. Was there any commit?
106. Was there any push?
107. Was there any tag?

---

# 69. STOP CONDITIONS

STOP and return a blocked contract result if:

- current placement gameplay authority cannot be established;
- domain Position semantics cannot be established;
- map coordinate space cannot be established sufficiently;
- deterministic map → domain mapping would require arbitrary invented gameplay numbers;
- current World rendering is fundamentally incompatible with preview/final positional continuity and no bounded presentation adapter can resolve it;
- placement validity would require new gameplay rules;
- confirm would require a second placement command;
- PDM requires save migration;
- PDM requires API redesign;
- direct placement would require reopening sealed visual work;
- narrow placement requires a new application shell;
- material product semantics remain unresolved after repository inspection;
- baseline integrity is not trustworthy.

Do not implement through uncertainty.

---

# 70. FINAL DECISION

Return exactly ONE.

## OPTION A — PDM CONTRACT COMPLETE / IMPLEMENTATION READY

Use only when the report establishes:

- authoritative existing placement command/use case;
- authoritative domain Position semantics;
- deterministic coordinate mapping contract;
- pan/zoom behavior;
- placement-mode entry;
- transient selected-building context;
- candidate selection;
- preview;
- preview→final continuity;
- validity authority;
- valid/invalid presentation semantics;
- explicit confirm;
- explicit cancel;
- success behavior;
- rejection behavior;
- navigation-away behavior;
- raw X/Y disposition;
- narrow behavior;
- no new gameplay rules;
- no save/API changes;
- bounded implementation architecture;
- deterministic test strategy;
- deterministic runtime certification strategy.

State:

> **PDM-001 PRODUCT / UX CONTRACT:**  
> `COMPLETE / PASS`

> **MATERIALITY:**  
> `HIGH`

> **PLACEMENT MODE:**  
> `CONTRACTED`

> **MAP → DOMAIN POSITION:**  
> `CONTRACTED`

> **PAN / ZOOM:**  
> `CONTRACTED`

> **PREVIEW:**  
> `CONTRACTED`

> **VALIDITY:**  
> `EXISTING AUTHORITY REUSED`

> **CONFIRM:**  
> `CONTRACTED`

> **CANCEL:**  
> `CONTRACTED`

> **PREVIEW → FINAL CONTINUITY:**  
> `CONTRACTED`

> **RAW X/Y NORMAL FLOW:**  
> `<REMOVED / SECONDARY FALLBACK>`

> **NARROW:**  
> `CONTRACTED`

> **GAMEPLAY RULES:**  
> `UNCHANGED`

> **SAVE / API:**  
> `UNCHANGED`

> **ART:**  
> `NONE`

> **IMPLEMENTATION READY:**  
> `YES`

> **NEXT PROMPT TYPE:**  
> `PDM-001 BOUNDED IMPLEMENTATION`

---

## OPTION B — CONTRACT DELTA REQUIRED

Use when most of the contract is established but one or more bounded product/UX questions remain unresolved.

State:

> **PDM-001 PRODUCT / UX CONTRACT:**  
> `PARTIAL`

> **ESTABLISHED:**  
> `<concise list>`

> **UNRESOLVED:**  
> `<exact questions>`

> **WHY REPOSITORY AUTHORITY DOES NOT RESOLVE THEM:**  
> `<evidence>`

> **IMPLEMENTATION READY:**  
> `NO`

> **NEXT STEP:**  
> `HUMAN PRODUCT DECISION`

Do not invent the missing decisions.

---

## OPTION C — ARCHITECTURE DISCOVERY REQUIRED

Use when the product direction is clear but repository architecture cannot yet support a deterministic contract.

State:

> **PDM MATERIALITY:**  
> `HIGH`

> **PRODUCT DIRECTION:**  
> `CLEAR`

> **ARCHITECTURE CONTRACT:**  
> `NOT READY`

> **EXACT BLOCKER:**  
> `<coordinate/map/application boundary>`

> **NEXT STEP:**  
> `BOUNDED PDM ARCHITECTURE DISCOVERY`

Do not implement.

---

## OPTION D — GAMEPLAY CONTRACT REQUIRED

Use only when PDM cannot proceed without defining genuinely new gameplay placement rules.

State:

> **PDM PRODUCT DIRECTION:**  
> `CLEAR`

> **EXISTING GAMEPLAY AUTHORITY:**  
> `INSUFFICIENT`

> **EXACT MISSING GAMEPLAY RULE:**  
> `<rule>`

> **IMPLEMENTATION READY:**  
> `NO`

Do not invent the rule.

---

## OPTION E — BASELINE NOT READY

Use when Git/repository integrity prevents a trustworthy contract review.

---

# 71. DEFINITION OF DONE

This contract-definition task is complete only when:

- [ ] implementation guide read
- [ ] previous PDM delta gate read
- [ ] baseline recheck read
- [ ] branch recorded
- [ ] exact HEAD recorded
- [ ] HEAD subject recorded
- [ ] origin/master recorded
- [ ] HEAD/origin relationship verified
- [ ] unrelated WIP classified
- [ ] sealed work respected
- [ ] Scenario-B pause respected
- [ ] current Buildings placement flow traced
- [ ] raw X/Y flow traced
- [ ] existing placement command/use case traced
- [ ] domain Position traced
- [ ] placement bounds traced
- [ ] existing placement validation traced
- [ ] cost/prerequisite authority traced
- [ ] occupancy/collision authority checked
- [ ] region semantics checked
- [ ] World coordinate space traced
- [ ] marker positioning traced
- [ ] pan transform traced
- [ ] zoom transform traced
- [ ] presentation vs domain coordinates separated
- [ ] placement-mode entry contracted
- [ ] selected-building context contracted
- [ ] World transition contracted
- [ ] placement-mode visibility contracted
- [ ] pointer/candidate interaction contracted
- [ ] pan behavior contracted
- [ ] zoom behavior contracted
- [ ] map → domain Position pipeline contracted
- [ ] domain Position → preview pipeline contracted
- [ ] deterministic normalization contracted
- [ ] no invented snapping
- [ ] domain bounds behavior contracted
- [ ] region behavior contracted
- [ ] transient candidate state contracted
- [ ] preview representation contracted
- [ ] preview uses candidate domain Position
- [ ] validity authority contracted
- [ ] valid feedback contracted
- [ ] invalid feedback contracted
- [ ] confirm semantics contracted
- [ ] invalid confirm behavior contracted
- [ ] final command authority preserved
- [ ] cancel semantics contracted
- [ ] cancel destination contracted
- [ ] success behavior contracted
- [ ] rejection behavior contracted
- [ ] navigation-away behavior contracted
- [ ] one-placement-per-session contracted
- [ ] raw X/Y disposition explicitly decided
- [ ] marker interaction during placement contracted
- [ ] region interaction during placement contracted
- [ ] narrow behavior contracted
- [ ] narrow controls contracted
- [ ] transient-state firewall established
- [ ] save/API firewall established
- [ ] preview→final continuity assessed
- [ ] existing-building projection implications assessed
- [ ] no save migration invented
- [ ] no gameplay rule invented
- [ ] no new art required
- [ ] authority matrix completed
- [ ] coordinate pipeline documented
- [ ] implementation boundary forecast documented
- [ ] testability forecast documented
- [ ] runtime certification forecast documented
- [ ] all material unresolved questions listed
- [ ] implementation readiness explicitly decided
- [ ] contract report written
- [ ] exactly one final option returned
- [ ] no production-code changes
- [ ] no product-test changes
- [ ] no gameplay/content/save/API changes
- [ ] no art
- [ ] no commit
- [ ] no push
- [ ] no tag

---

# 72. CORE EXECUTION RULE

PDM-001 exists because manual raw X/Y placement is a poor normal-player interaction for a spatial World.

The player should choose the building's location on the World itself.

But direct manipulation must not invent new gameplay.

Existing placement rules remain authoritative.

The contract must therefore bridge:

> World pointer interaction

to:

> existing domain Position

to:

> existing placement command.

The most important requirement is positional integrity:

> the location the player previews must be the logical location the game actually submits and ultimately presents after placement.

Do not reuse decorative marker coordinates as gameplay truth unless repository evidence proves they are authoritative.

Do not invent coordinate ranges.

Do not invent snapping.

Do not invent placement validity.

Do not place immediately on click.

Use a transient candidate.

Show a preview.

Show validity.

Require explicit confirmation.

Allow explicit cancellation.

Keep pan/zoom usable.

Make narrow placement usable.

Remove raw X/Y from the primary normal-player workflow unless repository evidence establishes a real reason to retain it as secondary fallback.

Do not change gameplay.

Do not change saves.

Do not change APIs.

Do not create new art.

Do not implement anything in this task.

Produce one precise Product / UX Contract that a later implementation prompt can execute without guessing.

If the repository does not provide enough authority to define that contract deterministically:

STOP and identify the exact missing decision or architecture boundary.

Then STOP.

# END OF PROMPT