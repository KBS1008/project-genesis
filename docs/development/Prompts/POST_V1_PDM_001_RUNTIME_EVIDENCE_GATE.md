# POST-V1 PDM-001
# Direct Map Building Placement
# Runtime Evidence Gate

## MODE

RUNTIME CERTIFICATION / EVIDENCE GATE.

PDM-001 implementation and lifecycle integration tests are already complete and have passed independent review for runtime evidence.

This task exists to prove the approved player-facing PDM flow in the actual running application.

This is NOT:

- architecture discovery;
- product redesign;
- coordinate-contract redesign;
- gameplay design;
- implementation expansion;
- general bug-fixing;
- World visual redesign;
- Scenario-B visual production.

Primary objective:

> certify that Direct Map Building Placement actually works for a player at runtime.

Default expectation:

> EVIDENCE FIRST.

Production code should remain unchanged.

If runtime evidence exposes an obvious bounded PDM-local defect, fix it in this pass only if the fix is small, contract-preserving, and clearly task-local.

Then rerun affected tests/root gates and recapture affected runtime evidence.

No commit.
No push.
No tag.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

Return one runtime close candidate.

---

# 1. READ FIRST

Read completely:

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/architecture/reviews/POST_V1_PDM_001_PRODUCT_UX_CONTRACT.md`
- `docs/architecture/reviews/POST_V1_PDM_001_COORDINATE_CONTRACT_CONSISTENCY_CLOSEOUT.md`
- `docs/architecture/reviews/POST_V1_PDM_001_BOUNDED_IMPLEMENTATION_CLOSE_CANDIDATE.md`

Also inspect only as needed:

- existing runtime/evidence tooling;
- existing deterministic fixture tooling;
- existing dev/runtime fixture conventions;
- existing screenshot/evidence conventions.

Do not reopen implementation architecture merely because this is a runtime gate.

---

# 2. CURRENT AUTHORIZED STATE

Treat as already reviewed:

> PDM-001 BOUNDED IMPLEMENTATION:
> `PASS FOR RUNTIME EVIDENCE`

Treat as CLOSED / PASS:

> PDM-001 CONFIRM / REJECTION LIFECYCLE TEST DELTA

Current reported root gates:

- `pnpm typecheck` — PASS
- `pnpm lint` — PASS
- `pnpm test` — PASS — 290 files / 1095 tests
- `pnpm build:web` — PASS

Do not rerun architecture discovery.

Do not reopen the Product / UX Contract.

---

# 3. BASELINE

Before runtime work, record:

- branch;
- exact HEAD;
- HEAD subject;
- `origin/master`;
- HEAD/origin relationship;
- working-tree status;
- PDM task-owned local diff;
- unrelated WIP.

Previously reported implementation baseline:

`500a00a086fa083c1bca461ccbe87b1f23f9b675`

Verify actual Git truth.

Do not assume the baseline is unchanged.

The PDM implementation is expected to remain local/uncommitted.

Do not:

- clean;
- restore;
- stash;
- stage;
- commit;
- push;
- tag;
- delete unrelated files;
- move unrelated files.

Protect unrelated WIP.

---

# 4. SEALED CONTRACT

Do NOT reopen:

- direct map placement as normal placement flow;
- transient placement session;
- Buildings → World transition;
- stable coordinate anchor;
- `s = 1`;
- `round`;
- negative unprojection → no-pick;
- no presentation-derived gameplay cap;
- pickability ≠ gameplay validity;
- existing placeBuilding authority;
- preview→final logical continuity;
- raw X/Y removal from normal placement;
- default-region semantics;
- Save/API firewall;
- gameplay firewall.

Runtime evidence tests the implementation against this contract.

It does not renegotiate it.

---

# 5. RUNTIME CERTIFICATION TARGET

Certify the actual player-facing flow:

> Buildings
> → select a placeable building
> → enter required non-coordinate placement data
> → Position auf Karte wählen
> → automatic transition to World
> → placement mode visible
> → choose map candidate
> → preview visible
> → explicit Gebäude platzieren
> → placement succeeds
> → newly placed building appears at the same logical anchor as preview.

Also certify:

- Cancel;
- pan/zoom stability;
- no-pick where deterministically reachable;
- narrow viewport;
- no raw X/Y dependency.

Command rejection should be runtime-certified only if a deterministic existing-authority fixture can produce it without inventing gameplay rules.

---

# 6. EVIDENCE STRATEGY

Use deterministic runtime state wherever possible.

Prefer existing:

- save fixtures;
- dev fixtures;
- runtime pilots;
- evidence harnesses;
- seeded deterministic state.

Do not manually alter domain state in browser devtools merely to manufacture a PASS.

Do not create gameplay rules for evidence.

If a tiny evidence-only fixture is necessary:

it must use existing authoritative data/state structures and must not modify production gameplay semantics.

Document it exactly.

---

# 7. FIXTURE REQUIREMENTS

Choose or construct a deterministic state where:

- Buildings screen is reachable;
- at least one building is legitimately placeable;
- prerequisites are satisfied;
- sufficient funds/resources exist if required;
- required name/input can be provided;
- World is reachable;
- placement can succeed through existing authoritative command.

Do not bypass:

- prerequisites;
- cost;
- domain validation.

The evidence must prove the real flow.

---

# 8. DO NOT USE RAW X/Y TO COMPLETE THE FLOW

The runtime certification itself must use:

> direct World-map placement.

Do not use hidden/manual X/Y controls, devtools, or direct API calls to complete the certified placement.

The point of this gate is to prove the player no longer needs raw coordinates.

---

# 9. DESKTOP CERTIFICATION

Primary desktop viewport:

> approximately 1440×900.

Use the actual running web application.

Certify the complete normal flow.

Capture evidence at meaningful checkpoints.

Do not generate dozens of redundant screenshots.

---

# 10. DESKTOP CHECKPOINT A — BUILDINGS ENTRY

Capture evidence showing:

- Buildings screen;
- selected building / placement context;
- required non-coordinate input;
- `Position auf Karte wählen`;
- no normal X/Y coordinate fields required.

The evidence should make it clear that direct map placement is the normal path.

---

# 11. DESKTOP CHECKPOINT B — WORLD PLACEMENT MODE

Activate:

> `Position auf Karte wählen`.

Capture World immediately after transition.

Evidence must show:

- automatic transition to World;
- placement mode active;
- selected building identity understandable;
- placement instruction visible;
- confirm/cancel controls visible or appropriately disabled;
- no stale unrelated placement session.

---

# 12. DESKTOP CHECKPOINT C — CANDIDATE + PREVIEW

Choose a deterministic map candidate.

Capture evidence showing:

- candidate selected;
- preview visible;
- placement controls remain visible;
- building has not yet been placed.

If UI displays candidate coordinates as part of the approved placement chrome:

record them.

Do not require the player to understand or enter them.

---

# 13. NO MUTATION BEFORE CONFIRM

Before clicking:

> `Gebäude platzieren`

prove that candidate selection has not already created the building.

Use the strongest practical runtime evidence available.

This may be demonstrated by:

- building count/state;
- map state;
- relevant runtime data;
- absence of final building before confirm.

Do not rely solely on visual resemblance if preview and final marker are similar.

---

# 14. DESKTOP CHECKPOINT D — CONFIRM

Explicitly activate:

> `Gebäude platzieren`.

Prove:

- authoritative placement succeeds;
- placement mode exits;
- player remains on World;
- new building exists;
- no automatic return to Buildings;
- no duplicate placement.

Capture post-confirm evidence.

---

# 15. PREVIEW → FINAL CONTINUITY

This is a HARD runtime correctness gate.

Compare:

> preview logical anchor

with:

> final building logical anchor.

The newly placed building must not jump to an unrelated presentation slot after confirmation.

Use evidence sufficient to establish continuity.

Preferred:

- before-confirm screenshot;
- after-confirm screenshot;
- same camera state where practical;
- candidate/domain Position evidence if existing tooling exposes it safely.

Do not use visual intuition alone if a stronger deterministic check is available.

State the exact evidence.

---

# 16. DOMAIN POSITION CONTINUITY

Where runtime tooling can inspect resulting building state without changing it:

record:

- candidate x/y;
- resulting persisted/runtime building x/y.

They must match.

This is evidence, not a new player-facing requirement.

Do not expose raw coordinates to the normal player workflow just for certification.

---

# 17. PAN STABILITY

Enter a fresh placement session or use a pre-confirm candidate state as appropriate.

Certify:

- pan remains usable;
- panning does not accidentally place;
- panning does not accidentally confirm;
- placement mode remains active;
- candidate/domain semantics remain stable.

If the selected candidate is retained during pan:

verify its preview remains attached to the same logical World location.

---

# 18. ZOOM STABILITY

Certify:

- zoom remains usable;
- zoom does not mutate gameplay;
- zoom does not alter the candidate domain Position;
- preview remains anchored to the same logical World position;
- confirm remains coherent after zoom.

Use runtime evidence and/or safe state inspection.

Do not infer correctness merely because the unit test exists.

This gate needs runtime corroboration.

---

# 19. PAN VS PICK

Demonstrate that an intentional pan gesture does not accidentally create a new placement candidate if the interaction model distinguishes drag from tap.

If the implementation's current interaction model has a deterministic drag threshold:

exercise it normally.

Do not tune the threshold in this evidence pass unless an actual defect is exposed.

---

# 20. CANCEL CERTIFICATION

Start a fresh placement session.

Select a candidate.

Capture evidence showing preview.

Then activate:

> `Abbrechen`.

Prove:

- no building is created;
- placement session clears;
- candidate clears;
- player returns to Buildings according to the approved contract.

Capture the post-cancel state.

---

# 21. CANCEL MUTATION CHECK

Use a deterministic before/after signal where practical.

Examples:

- building count unchanged;
- target building absent;
- game state unchanged with respect to placement.

Do not rely only on disappearance of preview.

Preview disappearance proves session cleanup, not necessarily absence of gameplay mutation.

---

# 22. NO-PICK CERTIFICATION

The approved no-pick condition is:

> unprojection below non-negative domain origin.

It is NOT:

> outside painted region artwork.

If the current viewport/camera permits a deterministic player interaction that maps below the domain origin:

exercise it.

Prove:

- no valid candidate is produced from that pick;
- no building is created;
- no placement command succeeds;
- placement mode remains coherent.

Do not use an arbitrary positive point outside region art as no-pick evidence.

---

# 23. NO-PICK PRACTICAL LIMITATION

If the actual camera/viewport makes below-origin interaction impossible or unreasonable to reach through normal UI:

do NOT alter production behavior merely to force a screenshot.

In that case:

- state `NO-PICK RUNTIME INTERACTION NOT NATURALLY REACHABLE`;
- cite the existing adapter test as deterministic technical evidence;
- do not fail PDM solely because the camera prevents direct user access to below-origin logical space.

But verify that no positive point is incorrectly rejected because it lies outside old region artwork.

---

# 24. POSITIVE OUTSIDE-ART CERTIFICATION

Where safely reachable in the current World presentation, choose a positive candidate beyond the old painted/default-region footprint.

Prove it is not rejected merely because of presentation geometry.

This is especially valuable evidence for:

> no presentation-derived gameplay cap.

If the UI/camera cannot naturally expose such a point:

do not modify the camera solely for evidence.

Use existing automated high-coordinate proof and record the runtime limitation.

---

# 25. COMMAND REJECTION CERTIFICATION

Attempt runtime command-rejection evidence ONLY if a deterministic fixture can use an existing authoritative rejection.

Examples may include an already-established prerequisite/cost change between entry and confirm only if such a state can occur legitimately and deterministically.

Do NOT invent:

- collision;
- capacity;
- fake invalid coordinate;
- fake region rule;
- special evidence-only gameplay validation.

If a legitimate deterministic rejection fixture exists:

certify:

- candidate remains;
- placement session remains;
- World remains active;
- rejection is visible;
- no building created;
- rejection is not converted into no-pick.

---

# 26. COMMAND REJECTION FALLBACK

If no safe deterministic runtime rejection fixture exists:

state:

> `COMMAND REJECTION RUNTIME FIXTURE: NOT SAFELY AVAILABLE`

and rely on the already-passed provider integration test for lifecycle correctness.

This is acceptable.

Do not manufacture a gameplay rule just to obtain runtime rejection evidence.

---

# 27. NARROW CERTIFICATION

Use approximately:

> 480×900.

Certify the actual direct-placement flow.

At minimum:

> Buildings
> → Position auf Karte wählen
> → World placement mode
> → candidate
> → preview
> → confirm or cancel.

Evidence must show:

- no raw X/Y fallback;
- selected building understandable;
- placement instruction usable;
- map usable;
- candidate/preview visible;
- confirm reachable;
- cancel reachable;
- controls not clipped beyond practical use.

---

# 28. NARROW PAN / ZOOM

Verify narrow placement does not become unusable because placement controls consume the viewport.

At minimum establish:

- map remains interactable;
- pan works where applicable;
- zoom remains coherent where applicable;
- confirm/cancel remain reachable.

Do not redesign narrow layout unless a real PDM-local usability defect prevents completion.

---

# 29. ORIENTATION

Do not create a new orientation contract.

Certify the requested narrow viewport only.

If existing responsive architecture naturally supports other viewport shapes, note that only as incidental evidence.

No landscape-specific redesign in this gate.

---

# 30. EXISTING BUILDING MARKERS

During runtime evidence, inspect at least one existing default-region building marker.

Ensure the implementation does not visibly regress into obvious list-slot relocation behavior during the PDM flow.

The critical proof remains:

> newly placed building final anchor matches its preview.

Do not start a general map-marker visual review.

---

# 31. WORLD VISUAL QUALITY IS NOT THIS GATE

Do not fail PDM merely because the overall World is still visually sparse or because future World beautification could improve it.

This gate asks:

> Does direct placement work correctly and understandably?

Not:

> Is the World map visually final?

Do not reopen WFV or Scenario-B.

---

# 32. SCREENSHOT / EVIDENCE QUALITY

Evidence must be readable.

Avoid:

- cropped controls;
- hidden placement bar;
- devtools covering the relevant UI;
- screenshots where preview/final cannot be distinguished;
- screenshots without viewport context;
- ambiguous filenames.

Use deterministic descriptive filenames.

Example family:

- `pdm001-desktop-buildings-entry.png`
- `pdm001-desktop-world-placement-mode.png`
- `pdm001-desktop-preview.png`
- `pdm001-desktop-confirmed.png`
- `pdm001-desktop-cancel-preview.png`
- `pdm001-desktop-cancelled.png`
- `pdm001-narrow-preview.png`
- `pdm001-narrow-confirmed.png`

Follow repository evidence conventions if they specify another naming/location pattern.

---

# 33. EVIDENCE STORAGE

Store runtime evidence in the repository's established evidence location.

Do not invent a new top-level evidence system.

If PDM already has an established review/evidence directory convention:

use it.

Record every evidence artifact path in the report.

---

# 34. RUNTIME DATA INSPECTION

Read-only inspection of runtime/application state is allowed where existing evidence tooling supports it.

Do not mutate game state through:

- browser console;
- direct API requests;
- database edits;
- hidden dev hooks

to make the certification pass.

Fixture initialization through established deterministic tooling is allowed.

---

# 35. DEVTOOLS

Devtools may be used for read-only diagnosis/evidence if needed.

They must not become the mechanism by which placement succeeds.

The certified flow must remain player-operable through the UI.

---

# 36. PRODUCTION CODE CHANGE POLICY

Default:

> NO PRODUCTION CODE CHANGES.

If runtime certification exposes a small obvious PDM-local defect:

examples:

- confirm clipped at 480×900;
- candidate click broken due to task-local pointer wiring;
- preview disappears incorrectly during zoom;
- success marker jumps because shared projection is not actually used;
- cancel fails to clear UI session;
- placement bar blocks all map interaction;

then:

1. identify the defect;
2. verify it is PDM-local;
3. fix the smallest implementation defect;
4. add/update regression test;
5. rerun focused tests;
6. rerun all root gates;
7. recapture affected runtime evidence.

Do not return a known easy PDM-local defect merely to create another prompt.

---

# 37. MATERIAL DEFECT POLICY

STOP instead of redesigning if runtime evidence reveals:

- coordinate-contract contradiction;
- required change to `s = 1`;
- required change to `round`;
- need for gameplay coordinate bounds;
- need for collision/capacity rules;
- need for new region gameplay semantics;
- save migration;
- API redesign;
- material World architecture redesign;
- material navigation architecture redesign;
- cross-scope regression;
- gameplay/product ambiguity.

Return evidence and exact blocker.

---

# 38. NO GENERAL CLEANUP

Do not use runtime testing as an excuse to fix:

- unrelated CSS;
- unrelated World visuals;
- unrelated warnings;
- tutorial issues;
- unrelated navigation;
- other raw IDs;
- economy behavior;
- Scenario-B visuals.

Record material observations only if they affect PDM certification.

---

# 39. ROOT GATES AFTER NO-CODE EVIDENCE

If runtime certification makes NO production/test changes:

do not rerun expensive root gates merely for ceremony unless the implementation guide requires it.

You may rely on the immediately preceding verified gates:

- typecheck PASS;
- lint PASS;
- tests 290 files / 1095 PASS;
- build:web PASS.

But verify that no source/test code changed during this evidence pass.

Record:

> `ROOT GATES REUSED FROM LIFECYCLE CLOSE CANDIDATE — NO CODE CHANGES`

If evidence tooling adds task-owned scripts/code:

run the appropriate gates.

---

# 40. ROOT GATES AFTER CODE CHANGE

If any production or test code changes:

run:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build:web`

Report exact results.

No exceptions.

---

# 41. RUNTIME REPORT

Create:

`docs/architecture/reviews/POST_V1_PDM_001_RUNTIME_EVIDENCE_GATE.md`

Do not overwrite the implementation close-candidate report.

This runtime report becomes the evidence artifact for final independent closure review.

---

# 42. REQUIRED REPORT STRUCTURE

Use:

## A. Executive result

## B. Authority / reviewed inputs

## C. Baseline

## D. Runtime environment

## E. Fixture / deterministic state

## F. Desktop Buildings entry

## G. Desktop World transition

## H. Desktop candidate / preview

## I. No mutation before confirm

## J. Desktop confirm / success

## K. Preview → final continuity

## L. Pan stability

## M. Zoom stability

## N. Cancel

## O. No-pick

## P. Positive outside-art / no presentation cap

## Q. Command rejection

## R. Narrow 480×900

## S. Gameplay / Save / API integrity

## T. Evidence artifacts

## U. Code changes during runtime gate

## V. Tests / root gates

## W. Remaining observations

## X. Final runtime decision

---

# 43. REQUIRED RUNTIME EVIDENCE TABLE

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

Do not mark an untested item PASS.

Use:

> `N/A — not safely/naturally runtime-reachable`

where explicitly allowed by this prompt.

---

# 44. REQUIRED SCREENSHOT MANIFEST

For each screenshot/evidence artifact record:

- filename/path;
- viewport;
- fixture/save;
- exact state;
- what it proves.

Example:

| Artifact | Viewport | State | Proves |
|---|---|---|---|
| `...desktop-preview.png` | 1440×900 | candidate selected, pre-confirm | preview exists, no final building yet |

Do not list evidence that was not actually captured.

---

# 45. REQUIRED FACTUAL QUESTIONS

Explicitly answer:

1. What branch was runtime-tested?
2. What exact HEAD was used?
3. What was the HEAD subject?
4. What was `origin/master`?
5. Was HEAD equal to `origin/master`?
6. Was the PDM implementation still local/uncommitted?
7. What unrelated WIP existed?
8. What runtime command started the application?
9. What URL/environment was tested?
10. What fixture/save/state was used?
11. Was the fixture deterministic?
12. Which building type was used for successful placement?
13. What player-facing building name was used?
14. Were prerequisites genuinely satisfied?
15. Was placement genuinely affordable/allowed?
16. Did Buildings show `Position auf Karte wählen`?
17. Were normal-flow X/Y inputs absent?
18. Did starting placement automatically navigate to World?
19. Was placement mode visibly active?
20. Was selected building identity visible?
21. Was placement instruction visible?
22. Was confirm visible/reachable?
23. Was cancel visible/reachable?
24. Did selecting a candidate create a preview?
25. Did selecting a candidate create a real building before confirm?
26. What evidence proves no mutation before confirm?
27. Was pan usable during placement?
28. Did pan accidentally select/place?
29. Was zoom usable during placement?
30. Did zoom change the candidate domain Position?
31. Did preview remain anchored during camera changes?
32. Was an explicit confirm required?
33. Did confirm successfully place the building?
34. Did success remain on World?
35. Was exactly one new building created?
36. Did final building occupy the preview logical anchor?
37. What evidence proves preview→final continuity?
38. Were candidate x/y and resulting building x/y compared?
39. If yes, did they match exactly?
40. Was cancel tested from a state with a candidate?
41. Did cancel create any building?
42. Did cancel clear the placement session?
43. Did cancel return to Buildings?
44. Was a below-origin no-pick interaction naturally reachable?
45. If yes, what happened?
46. If no, what automated evidence remains authoritative?
47. Was a positive point outside old region artwork naturally reachable?
48. If yes, was it incorrectly capped?
49. Was command rejection safely reproducible at runtime?
50. If yes, did session/candidate remain?
51. If no, what integration test covers it?
52. Was desktop tested around 1440×900?
53. Was narrow tested around 480×900?
54. Did narrow require raw X/Y fallback?
55. Could narrow select a candidate?
56. Was preview visible on narrow?
57. Was confirm reachable on narrow?
58. Was cancel reachable on narrow?
59. Could the player complete direct placement on narrow?
60. Were any production files changed during this runtime gate?
61. Were any test files changed?
62. Were any evidence-only files/scripts added?
63. If code changed, what exact defect required it?
64. If code changed, were root gates rerun?
65. What are the final typecheck results?
66. What are the final lint results?
67. What are the final test totals?
68. What is the final build:web result?
69. Were any Save semantics changed?
70. Were any API semantics changed?
71. Were any gameplay placement rules changed?
72. Was any region gameplay changed?
73. Was Scenario-B reopened?
74. Does any known PDM-local defect remain?
75. Does any material runtime ambiguity remain?
76. Is PDM-001 ready to close and seal?
77. Was there any commit?
78. Was there any push?
79. Was there any tag?

---

# 46. PASS CRITERIA — MANDATORY

PDM-001 runtime may PASS only if all mandatory runtime behaviors are proven:

- Buildings entry works;
- no raw X/Y normal-flow dependency;
- automatic World transition works;
- placement mode is understandable;
- candidate selection works;
- preview works;
- candidate selection does not itself create the building;
- explicit confirm works;
- success remains on World;
- final building appears at preview logical anchor;
- pan remains usable;
- pan does not accidentally place;
- zoom remains coherent;
- cancel works;
- cancel performs no placement mutation;
- narrow direct placement is usable;
- no known PDM-local defect remains.

No-pick and command rejection may use the explicitly allowed N/A fallback only under the conditions defined above.

---

# 47. FAIL CONDITIONS

Runtime gate FAILS if any of these occur:

- raw X/Y still required in normal placement;
- map pick immediately creates building;
- preview absent;
- preview anchor materially differs from final marker anchor;
- confirm cannot be reached;
- confirm places duplicate buildings;
- success unexpectedly returns to Buildings;
- cancel creates a building;
- cancel leaves stale placement session;
- pan causes accidental placement;
- zoom changes candidate semantics;
- narrow cannot complete the flow;
- positive domain positions are rejected due only to presentation footprint;
- runtime exposes a PDM-local defect that remains unfixed;
- implementation violates the sealed coordinate contract.

Do not paper over a FAIL with screenshots.

---

# 48. STOP CONDITIONS

STOP and return a material blocker if runtime certification requires:

- changing the coordinate contract;
- changing `s = 1`;
- changing `round`;
- adding a coordinate maximum;
- adding collision;
- adding placement capacity;
- inventing region membership rules;
- save migration;
- API redesign;
- new placement command;
- material navigation redesign;
- material World architecture redesign;
- new art required for correctness;
- Scenario-B reopening;
- gameplay redesign.

Do not implement through a stop condition.

---

# 49. SMALL RUNTIME DEFECT RULE

If runtime exposes an obvious bounded PDM-local defect that can be safely fixed without violating any stop condition:

fix it now.

Examples:

- narrow confirm clipped;
- pointer pick handler not firing;
- preview incorrectly intercepts clicks;
- session not clearing visually;
- candidate preview miswired;
- final marker accidentally still using old slot layout.

Then:

- add/update regression test;
- rerun focused tests;
- rerun root gates;
- recapture affected evidence.

Aim for one runtime close candidate.

---

# 50. FINAL DECISION

Return exactly ONE.

## OPTION A — PDM-001 RUNTIME CERTIFIED / CLOSE READY

Use only when all mandatory runtime evidence passes and no known PDM-local defect remains.

State:

> **PDM-001 RUNTIME EVIDENCE GATE:**  
> `PASS`

> **DESKTOP 1440×900:**  
> `PASS`

> **NARROW 480×900:**  
> `PASS`

> **NORMAL PLACEMENT:**  
> `BUILDINGS → WORLD DIRECT MAP PLACEMENT`

> **RAW X/Y NORMAL FLOW:**  
> `NOT REQUIRED`

> **CANDIDATE PICK:**  
> `NO GAMEPLAY MUTATION`

> **PREVIEW:**  
> `PASS`

> **EXPLICIT CONFIRM:**  
> `PASS`

> **SUCCESS DESTINATION:**  
> `WORLD`

> **PREVIEW → FINAL CONTINUITY:**  
> `PASS`

> **PAN:**  
> `PASS`

> **ZOOM:**  
> `PASS`

> **CANCEL:**  
> `PASS / NO MUTATION`

> **NO-PICK:**  
> `<PASS / N-A WITH AUTOMATED CONTRACT EVIDENCE>`

> **POSITIVE OUTSIDE-ART CAP:**  
> `<PASS / N-A WITH AUTOMATED CONTRACT EVIDENCE>`

> **COMMAND REJECTION:**  
> `<PASS / N-A WITH PROVIDER INTEGRATION EVIDENCE>`

> **COORDINATE CONTRACT:**  
> `UNCHANGED`

> **GAMEPLAY / SAVE / API:**  
> `UNCHANGED`

> **PRODUCTION CODE CHANGED DURING GATE:**  
> `<NO / YES — exact bounded fix>`

> **ROOT GATES:**  
> `<REUSED — NO CODE CHANGES / exact rerun results>`

> **KNOWN PDM-LOCAL DEFECTS:**  
> `NONE`

> **PDM-001:**  
> `READY FOR INDEPENDENT FINAL CLOSURE REVIEW`

> **COMMIT / PUSH / TAG:**  
> `NONE`

Then STOP.

---

## OPTION B — SMALL RUNTIME DELTA REQUIRED

Use only when one bounded PDM-local runtime defect remains and could not safely be corrected in this pass.

State:

> **PDM-001 RUNTIME EVIDENCE GATE:**  
> `PARTIAL`

> **EXACT DEFECT:**  
> `<defect>`

> **FAILED RUNTIME INVARIANT:**  
> `<invariant>`

> **EVIDENCE:**  
> `<artifact>`

> **WHY NOT SAFELY FIXED:**  
> `<reason>`

> **NEXT STEP:**  
> `SMALL PDM RUNTIME DELTA`

Do not use this option for an obvious fixable local defect.

---

## OPTION C — MATERIAL CONTRACT / ARCHITECTURE BLOCKER

Use only if runtime exposes a genuine material contradiction.

State:

> **PDM-001 RUNTIME:**  
> `BLOCKED`

> **EXACT BLOCKER:**  
> `<evidence>`

> **SEALED CONTRACT ITEM AFFECTED:**  
> `<item>`

> **WHY IMPLEMENTATION CANNOT CONTINUE WITHOUT NEW DECISION:**  
> `<reason>`

Do not invent the decision.

---

## OPTION D — BASELINE / ENVIRONMENT NOT CERTIFIABLE

Use only if trustworthy runtime certification is impossible because of a genuine environment/baseline problem unrelated to PDM behavior.

Provide hard evidence.

---

# 51. DEFINITION OF DONE

This runtime gate is complete only when:

- [ ] implementation guide read
- [ ] Product / UX Contract read
- [ ] Coordinate Consistency Closeout read
- [ ] latest Bounded Implementation Close Candidate read
- [ ] current lifecycle delta status confirmed
- [ ] branch recorded
- [ ] exact HEAD recorded
- [ ] origin/master recorded
- [ ] PDM local diff preserved
- [ ] unrelated WIP protected
- [ ] deterministic runtime fixture selected
- [ ] fixture does not bypass gameplay authority
- [ ] actual application started
- [ ] desktop tested around 1440×900
- [ ] Buildings entry captured
- [ ] `Position auf Karte wählen` captured
- [ ] no raw X/Y dependency confirmed
- [ ] automatic World transition confirmed
- [ ] placement mode captured
- [ ] selected building identity visible
- [ ] placement instruction visible
- [ ] candidate selected
- [ ] preview captured
- [ ] no mutation before confirm proven
- [ ] explicit confirm performed
- [ ] successful placement proven
- [ ] success remains World
- [ ] exactly one building created
- [ ] preview→final logical continuity proven
- [ ] candidate/result Position compared where safely available
- [ ] pan tested
- [ ] pan does not place
- [ ] zoom tested
- [ ] zoom does not change candidate semantics
- [ ] preview remains logically anchored
- [ ] cancel tested with candidate
- [ ] cancel creates no building
- [ ] cancel clears session
- [ ] cancel returns Buildings
- [ ] no-pick runtime-tested OR valid N/A documented
- [ ] positive outside-art behavior runtime-tested OR valid N/A documented
- [ ] command rejection runtime-tested OR valid N/A documented
- [ ] narrow tested around 480×900
- [ ] narrow direct placement works
- [ ] narrow does not require X/Y
- [ ] narrow preview visible
- [ ] narrow confirm reachable
- [ ] narrow cancel reachable
- [ ] evidence artifacts stored
- [ ] screenshot manifest complete
- [ ] runtime evidence table complete
- [ ] gameplay unchanged
- [ ] save semantics unchanged
- [ ] API semantics unchanged
- [ ] region gameplay unchanged
- [ ] Scenario-B remains paused
- [ ] production code unchanged OR bounded runtime defect documented/fixed
- [ ] if code changed, regression test added
- [ ] if code changed, root typecheck PASS
- [ ] if code changed, root lint PASS
- [ ] if code changed, root tests PASS
- [ ] if code changed, root build:web PASS
- [ ] if no code changed, prior gates explicitly reused
- [ ] no known PDM-local defect remains for PASS
- [ ] runtime report written
- [ ] exactly one final option returned
- [ ] no commit
- [ ] no push
- [ ] no tag

---

# 52. CORE EXECUTION RULE

This is the final runtime proof of PDM-001.

Do not redesign it.

Prove the player can actually:

> choose a building
> → choose Position auf Karte
> → arrive on World
> → pick a location
> → see a preview
> → explicitly confirm
> → see the real building at the same logical location.

Prove that:

> pick is not placement.

Prove that:

> preview and final building agree.

Prove that:

> pan and zoom do not corrupt placement semantics.

Prove that:

> cancel mutates nothing.

Prove the same direct-placement concept remains usable around:

> 480×900.

Do not use raw X/Y to make the certification pass.

Do not turn presentation geometry into gameplay bounds.

Do not invent rejection rules.

Do not invent region rules.

Do not reopen coordinates.

Do not reopen gameplay.

Do not reopen Save/API.

Do not reopen Scenario-B.

If an obvious PDM-local runtime defect appears:

fix it in this pass, test it, rerun gates, and recapture evidence.

If a material contract issue appears:

STOP.

Produce:

`docs/architecture/reviews/POST_V1_PDM_001_RUNTIME_EVIDENCE_GATE.md`

Return one runtime close candidate.

No commit.

No push.

No tag.

Then STOP.

# END OF PROMPT