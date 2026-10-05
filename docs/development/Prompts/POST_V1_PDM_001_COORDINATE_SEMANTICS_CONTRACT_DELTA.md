# POST-V1 PDM-001
# Coordinate Semantics Contract Delta

## MODE

VERY SMALL READ-ONLY CONTRACT DELTA.

No implementation.

No production-code changes.

No product-test changes.

No gameplay/content/save/API changes.

No art.

No commit.
No push.
No tag.

The broader PDM-001 Product / UX Contract has already been completed and independently reviewed.

Most of that contract is accepted.

ONE material contract issue remains:

> the current PDM coordinate mapping incorrectly risks turning bounded World presentation geometry into a new gameplay/domain placement bound.

This task must resolve ONLY that coordinate-semantics issue.

Do NOT redo the full PDM review.

Do NOT redesign placement mode.

Do NOT revisit unrelated PDM decisions.

Do NOT implement anything.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

---

# 1. READ FIRST

Read:

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/architecture/reviews/POST_V1_PDM_001_PRODUCT_UX_CONTRACT.md`

Then inspect only the smallest current code surface required to establish coordinate authority.

Expected areas:

- domain `Position`;
- `Building.create`;
- current X/Y placement;
- `PlaceBuildingUseCase`;
- placement DTO/API shape;
- saved/current building Position usage;
- World logical geometry;
- `WORLD_MAP_CELL_SIZE`;
- region `mapX/mapY`;
- World camera math;
- existing building-marker layout;
- any existing conversion/projection utility.

Do not broaden beyond coordinate semantics.

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

Expected prior reviewed baseline:

`500a00a086fa083c1bca461ccbe87b1f23f9b675`

Do not assume that SHA remains current.

Verify actual Git truth.

Unrelated WIP must remain untouched.

---

# 3. BROADER PDM CONTRACT STATUS

Treat the following PDM decisions as FROZEN unless this coordinate delta makes one logically impossible:

- direct map placement becomes the normal player flow;
- Buildings initiates placement;
- application transitions to World;
- selected building context is transient;
- pan/zoom remain available;
- tap/click chooses a candidate;
- choosing a candidate does not mutate gameplay;
- preview exists before mutation;
- explicit confirm required;
- explicit cancel required;
- existing placement command/use case remains authoritative;
- success stays on World;
- command rejection stays in placement mode;
- navigation away clears placement state;
- one placement per placement session;
- raw X/Y removed from normal player placement flow;
- same direct-placement concept on narrow viewport;
- no new art;
- no save/API/schema changes;
- no new gameplay placement rules;
- preview and final placed building must represent the same logical position.

Do not reopen these merely because coordinate semantics need repair.

---

# 4. INDEPENDENT REVIEW FINDING TO RESOLVE

The previous contract established current repository truth:

> Domain `Position(x, y)` accepts non-negative integers.

and:

> no authoritative upper domain bound was established.

It also established:

> current web placement defaults buildings to `region_default` because the web path does not send `regionId`.

But the proposed PDM contract then used the rendered default-region footprint:

> `cellSize = WORLD_MAP_CELL_SIZE`
>
> `inset = 4`
>
> `size = cellSize - 8`

as the selectable placement plane and declared pointer positions outside that rectangle invalid.

That creates a semantic risk:

> bounded presentation geometry becomes an implicit upper placement bound even though no equivalent gameplay/domain bound currently exists.

This delta must resolve that mismatch.

---

# 5. CORE QUESTION

Answer:

> How should an existing non-negative integer domain `Position { x, y }` be represented and selected on a finite World presentation surface without inventing new gameplay placement limits?

The solution must support BOTH directions:

> World interaction → domain Position

and:

> domain Position → World presentation

without changing the meaning of existing saved/current domain positions.

---

# 6. DOMAIN AUTHORITY FIRST

Establish exact current authority for `Position`.

Explicitly verify:

- type/value-object definition;
- integer requirement;
- negative-coordinate behavior;
- upper bounds, if any;
- normalization;
- equality semantics if relevant;
- serialization;
- persisted examples if useful;
- whether existing saves/current fixtures contain positions beyond the proposed old World footprint.

Do not infer a maximum from UI defaults.

Do not infer a maximum from SVG size.

Do not infer a maximum from region dimensions.

Only repository-established gameplay/domain constraints count as gameplay bounds.

---

# 7. CURRENT UI SEMANTICS

Trace how the current X/Y form converts player input into domain coordinates.

Distinguish:

- HTML/input restrictions;
- `parseInt`;
- fallback behavior;
- domain validation.

Important:

> `parseInt` in the old form is not automatically a universal coordinate projection rule.

Determine what is truly domain authority versus old UI implementation detail.

---

# 8. FLOOR CLASSIFICATION CORRECTION

The previous contract described `floor` too strongly as existing authority.

Correct this classification.

Unless repository evidence proves otherwise:

> `floor` is NOT existing domain authority.

If `floor` is selected for map→domain quantization, classify it as:

> NEW PDM UX/APPLICATION ADAPTER CONTRACT

not:

> EXISTING AUTHORITY.

The report must make this explicit.

---

# 9. PRESENTATION GEOMETRY FIREWALL

The following are presentation facts unless repository evidence proves otherwise:

- `WORLD_MAP_CELL_SIZE`;
- SVG width/height;
- region `mapX/mapY`;
- region inset;
- rendered region rectangle;
- marker size;
- marker slot/distribution geometry.

They may be used to render or normalize coordinates.

They must NOT silently become:

- gameplay bounds;
- collision rules;
- maximum building Position;
- placement capacity;
- region ownership rules.

State this firewall explicitly.

---

# 10. EXISTING POSITION POPULATION

Perform a bounded evidence check for current domain Positions.

Inspect representative authoritative/current sources such as:

- fixtures;
- tests;
- seed/bootstrap state;
- saves already present in repository if appropriate;
- construction/building test cases.

Question:

> What range of Position values is actually used today?

This is evidence.

It is NOT permission to turn the largest observed value into a new maximum.

If values exceed the previously proposed `cellSize - 8` footprint range:

call that out explicitly.

If they do not:

still do not infer an upper bound.

---

# 11. FINITE MAP VS UNBOUNDED DOMAIN

The contract must explicitly resolve the mathematical mismatch:

> finite presentation rectangle

versus:

> domain Position with no established finite maximum.

Do not ignore this.

Do not solve it by arbitrary clipping.

Do not solve it by declaring positions above a presentation-derived number invalid.

---

# 12. ALLOWED SOLUTION FAMILIES

Evaluate the architecture against these conceptual families.

Do NOT assume one is correct before repository inspection.

## FAMILY A — NORMALIZED / ADAPTIVE PROJECTION

Domain coordinates remain unchanged.

World presentation derives a scale/extent from authoritative current building/candidate positions and maps them into the available region presentation area.

Possible characteristics:

- no new domain maximum;
- presentation scale may adapt;
- existing buildings and candidate use same projection;
- map selection needs an inverse projection based on the same current projection state.

Assess determinism and stability.

---

## FAMILY B — FIXED PRESENTATION PROJECTION WITH NON-GAMEPLAY SCALE

Define a fixed presentation conversion:

> N domain units = M World logical units

without claiming the finite viewport bounds the domain.

This may require:

- map/world plane capable of extending/panning beyond the visible region footprint;
- clipping/scroll/pan semantics;
- or a larger logical placement plane.

Assess whether current World architecture supports this without material redesign.

Do not invent N/M arbitrarily.

---

## FAMILY C — EXISTING AUTHORITY DISCOVERED

If repository inspection reveals an existing authoritative coordinate extent/projection not captured by the previous review:

reuse it.

Provide exact evidence.

---

## FAMILY D — PRODUCT / GAMEPLAY DECISION REQUIRED

If no deterministic bidirectional projection can be defined without choosing a new semantic extent or maximum that the repository does not establish:

do NOT invent one.

Return:

> HUMAN PRODUCT / GAMEPLAY COORDINATE DECISION REQUIRED

with the exact missing decision.

---

# 13. ADAPTIVE PROJECTION STABILITY

If considering adaptive projection, explicitly test the conceptual stability problem.

Example:

If the projection extent is based on:

> maximum currently placed X/Y

then adding a new building could rescale all existing building markers after confirmation.

That may violate:

> preview → final continuity

and create map-position drift.

Therefore determine whether adaptive projection can provide:

- deterministic selection;
- stable existing marker positions;
- preview→final continuity;
- no unexpected global repositioning after one placement.

If not:

reject that projection family.

Do not accept mathematically valid but UX-unstable mapping.

---

# 14. PREVIEW → FINAL CONTINUITY REMAINS HARD REQUIREMENT

The existing accepted requirement remains:

> The preview location and the final placed-building location must correspond to the same logical domain Position.

The implementation must not:

1. preview at one visual point;
2. submit domain Position;
3. refresh;
4. render the building somewhere unrelated.

Any coordinate contract that permits this is invalid.

---

# 15. EXISTING BUILDINGS MUST USE SAME PROJECTION

PDM cannot use a special candidate-only projection.

The coordinate contract must support:

> domain Position → World logical presentation

for:

- placement preview;
- newly placed building;
- existing buildings.

The same semantic projection must apply.

Decorative overlap handling may occur after the authoritative anchor is established, but must not replace the domain anchor.

---

# 16. EXISTING SAVE SEMANTICS

Existing saved/current domain Positions must retain their values and meaning.

Do not:

- renumber;
- normalize persisted coordinates;
- migrate coordinates merely to fit the map;
- clamp them to a presentation rectangle.

If rendering needs adaptation:

adapt presentation.

Do not rewrite gameplay state.

---

# 17. REGION DEFAULT SEMANTICS

Current web placement uses the default region path.

Preserve that unless repository authority proves otherwise.

Do NOT derive region membership from:

- pointer polygon;
- region rectangle;
- nearest region;
- mapX/mapY.

Multi-region placement remains outside PDM-001 unless current gameplay authority already defines it.

The coordinate adapter must not smuggle in new region gameplay semantics.

---

# 18. MAP PICKABLE AREA

Separate these concepts:

> where the player is allowed to click/select on the World UI

from:

> what domain Positions are legal gameplay Positions.

A bounded visual pick area may exist.

But:

> pointer outside pick area

should mean:

> no candidate selected from that UI location

not necessarily:

> that corresponding domain Position is gameplay-invalid.

Use precise terminology.

Avoid calling presentation footprint failures:

> invalid gameplay position

unless domain authority actually says so.

---

# 19. VALIDITY TERMINOLOGY

The contract should distinguish:

## PICKABILITY

Can this pointer location produce a candidate through the map adapter?

## DOMAIN VALIDITY

Would the authoritative placement command/domain accept the resulting Position and placement state?

These are not automatically identical.

Update contract terminology accordingly.

---

# 20. CANDIDATE VALIDITY

A candidate selected through the map should be classified using:

- map adapter pickability;
- existing prerequisite/cost/hint state;
- authoritative command/domain validation where safely previewable.

Do not add:

> inside region visual rectangle

as a gameplay validation rule.

It may be an interaction/pickability condition only.

---

# 21. DOMAIN → WORLD PROJECTION

Define one deterministic conceptual function:

> `projectDomainPosition(position, projectionContext) -> worldLogicalPoint`

The contract must state what `projectionContext` contains.

It may include presentation facts.

It must NOT include invented gameplay limits.

The same projection function/contract must work for existing buildings and preview.

---

# 22. WORLD → DOMAIN PROJECTION

Define the conceptual inverse:

> `unprojectWorldPoint(worldLogicalPoint, projectionContext) -> candidate Position | no-pick`

Requirements:

- deterministic;
- pan/zoom independent after conversion to World logical space;
- produces non-negative integer domain Position;
- does not invent a gameplay upper bound;
- consistent with forward projection to the required precision.

---

# 23. ROUND-TRIP REQUIREMENT

The contract must support a deterministic property such as:

> For every map-selectable domain Position P:
>
> `unproject(project(P)) == P`

or the repository-appropriate equivalent.

If exact round-trip is impossible because many domain positions map to the same rendered pixel:

define the deterministic quantization rule.

Do not hide ambiguity.

---

# 24. QUANTIZATION

If continuous pointer space must map to integer domain coordinates:

define quantization explicitly.

Possible operations include:

- floor;
- round;
- truncation.

Choose only after inspecting coordinate origin and projection behavior.

Classify the chosen operation as:

> PDM adapter semantics

unless existing domain authority explicitly mandates it.

Explain why it is deterministic and boundary-safe.

---

# 25. NEGATIVE POSITIONS

Existing domain authority rejects negative Position values.

The adapter must therefore never produce a negative candidate.

Define how pointer locations mapping below domain origin behave:

- no-pick;
- clamp;
- another existing-authority behavior.

Prefer not to clamp unless existing semantics support it, because clamping can make multiple unrelated pointer locations select Position 0.

Make an explicit contract decision.

---

# 26. UPPER POSITIONS

Because no upper domain bound is currently established:

the adapter must not reject a domain Position merely because:

> x or y exceeds a number derived from cellSize/SVG/region footprint.

If a chosen projection family cannot satisfy this:

that is a blocker.

Do not silently restore the old footprint cap.

---

# 27. PRESENTATION CLIPPING

If an existing domain Position projects outside the currently visible region/map surface:

define the presentation consequence.

Possible architecture-supported behaviors may include:

- larger logical plane;
- camera pan to extended content;
- presentation scaling;
- bounded clipping with explicit non-placeable visibility implications.

Do not choose an option that makes existing authoritative buildings disappear without addressing it.

If current architecture cannot represent arbitrary existing Positions coherently:

identify the blocker.

---

# 28. CAMERA SEMANTICS

Keep camera transform separate from domain projection.

Required conceptual pipeline:

> viewport pointer
> → remove viewport offset
> → inverse camera transform
> → World logical point
> → PDM coordinate unprojection
> → domain candidate Position

Forward:

> domain Position
> → PDM coordinate projection
> → World logical point
> → camera transform
> → screen position

Pan/zoom must not change the candidate domain Position.

---

# 29. CAMERA MATH AUTHORITY

Reuse current `WorldCameraState` / camera math where authoritative.

Do not duplicate pan/zoom formulas in unrelated components.

The coordinate adapter should consume World-logical coordinates after camera inversion, or expose a bounded helper consistent with current architecture.

---

# 30. DO NOT OVERLOAD SVG CELL SIZE

`WORLD_MAP_CELL_SIZE` may remain relevant for presentation.

But this delta must answer:

> Is cellSize merely display scale, or does repository authority establish a domain-units relationship?

If no relationship exists:

do not claim:

> 1 SVG px = 1 domain Position unit

merely because that is convenient.

This is one of the central checks.

---

# 31. DO NOT OVERLOAD REGION INSET

Likewise, the existing inset `4` is currently presentation geometry.

Unless repository evidence says otherwise:

it must not determine:

- minimum gameplay coordinate;
- maximum gameplay coordinate;
- buildable border;
- domain capacity.

It may define where a visual overlay is drawn.

Classify it correctly.

---

# 32. PLACEMENT PREVIEW ANCHOR

Once a valid coordinate projection is defined:

preview must anchor to the projected domain Position.

Any icon/marker visual offset is presentation-only.

Keep separate:

> authoritative anchor

from:

> icon centering / marker size / overlap offset.

---

# 33. OVERLAP PRESENTATION

No collision gameplay rule exists according to the previous contract.

Therefore multiple buildings may potentially have identical/nearby domain Positions under existing semantics.

The projection contract must not invent collision prevention.

If visual overlap occurs:

existing/presentation-only overlap treatment may be used.

But the authoritative anchor remains the domain-projected point.

Do not shift the actual logical placement Position.

---

# 34. EXISTING SLOT DISTRIBUTION

Current:

`distributeMarkerPosition(region, index, cellSize)`

is presentation-only.

Determine its future role under PDM.

Expected contract direction:

- it must no longer be the authoritative anchor for real building location;
- it may potentially remain as presentation-only overlap decoration if that does not break positional integrity;
- preview and final marker must share domain anchor semantics.

State the exact decision.

---

# 35. RAW POSITION COLUMN

The broader PDM contract already deferred cleanup of the raw Position list column.

Keep that decision frozen.

Do not expand this delta into:

- position-label localization;
- coordinate display redesign;
- building list cleanup.

Only coordinate semantics for direct map placement/rendering are in scope.

---

# 36. NO NEW GAMEPLAY CAPACITY

Do not derive:

> maximum number of buildings

from:

- available pixels;
- marker slots;
- cell size;
- region footprint;
- projection resolution.

PDM must not create placement capacity rules.

---

# 37. NO COLLISION RULE

Do not introduce:

- occupied coordinate rejection;
- minimum distance;
- marker spacing gameplay;
- no-overlap placement;
- building footprint size.

Unless current domain authority already defines them.

Visual overlap is not gameplay collision.

---

# 38. TESTABILITY STANDARD

The repaired contract must allow later deterministic tests.

At minimum:

### A. Non-negative origin

Known map pick near domain origin produces deterministic Position.

### B. Round trip

A representative map-selectable Position projects and unprojects consistently.

### C. Pan invariance

Same World logical point under different camera pan produces same domain Position.

### D. Zoom invariance

Same World logical point under different zoom produces same domain Position.

### E. Existing building projection

Known existing domain Position produces deterministic World anchor.

### F. Preview/final continuity

Candidate Position and final building use same projected anchor.

### G. No presentation-derived gameplay cap

A domain Position above the old `cellSize - 8` range is not declared gameplay-invalid merely because of presentation geometry.

### H. No negative candidate

Pointer below the coordinate origin does not produce negative Position.

Do not write tests now.

---

# 39. EXISTING HIGH POSITION TEST

If current fixtures/tests contain a Position greater than the old proposed footprint maximum:

use it as conceptual evidence for test G.

If not:

a later unit test may construct a valid non-negative Position above that presentation-derived threshold because domain authority permits it.

This does NOT create a new gameplay rule.

It verifies absence of the invented cap.

---

# 40. RUNTIME CONSEQUENCE

The final repaired contract must still make later runtime evidence possible:

> Buildings
> → map placement
> → choose candidate
> → preview
> → confirm
> → final marker remains at same logical anchor.

The runtime test does not need to prove the entire mathematical domain.

Unit tests should prove coordinate semantics.

Runtime proves interaction continuity.

---

# 41. NARROW BEHAVIOR

The broader narrow contract remains frozen.

Coordinate semantics must not differ between:

- desktop;
- narrow.

Viewport size and camera may differ.

Domain mapping semantics must not.

No X/Y fallback on narrow.

---

# 42. SAVE / API FIREWALL

The repaired projection must not require:

- save migration;
- Position schema change;
- placement DTO change;
- new `regionId` semantics;
- new API endpoint;
- new persisted projection state.

If a proposed solution requires one of these:

reject it for bounded PDM-001 and report the blocker.

---

# 43. PROJECTION STATE FIREWALL

Be careful with projection state.

If projection requires dynamic state that must persist across sessions to prevent marker movement:

that may violate the save/API firewall.

Explicitly assess this.

Prefer deterministic projection derived from existing stable inputs.

Do not create hidden persisted map-layout state.

---

# 44. REQUIRED AUTHORITY TABLE

Include:

| Coordinate concern | Current authority | Contract classification |
|---|---|---|
| Domain x/y type | ... | EXISTING AUTHORITY |
| Negative bound | ... | EXISTING AUTHORITY |
| Upper bound | ... | NOT ESTABLISHED / existing authority if found |
| Integer semantics | ... | ... |
| Old UI parseInt | ... | OLD UI BEHAVIOR |
| SVG logical extent | ... | PRESENTATION AUTHORITY |
| WORLD_MAP_CELL_SIZE | ... | PRESENTATION AUTHORITY unless proven otherwise |
| Region inset | ... | PRESENTATION AUTHORITY |
| Region mapX/mapY | ... | PRESENTATION AUTHORITY |
| Quantization | ... | PDM ADAPTER CONTRACT / existing authority |
| Domain→World projection | ... | PDM ADAPTER CONTRACT |
| World→Domain unprojection | ... | PDM ADAPTER CONTRACT |
| Pan/zoom transform | ... | EXISTING PRESENTATION AUTHORITY |
| Region membership | ... | EXISTING GAMEPLAY/APPLICATION AUTHORITY |
| Collision | ... | NOT ESTABLISHED unless found |

No vague authority labels.

---

# 45. REQUIRED OLD VS REPAIRED CONTRACT TABLE

Include:

| Concern | Previous PDM contract | Repaired contract |
|---|---|---|
| Region footprint | Used as selectable coordinate extent | ... |
| Pointer outside footprint | Called invalid candidate | ... |
| Domain upper bound | Implicitly presentation-bounded | ... |
| `floor` | Misclassified partly as existing authority | ... |
| `WORLD_MAP_CELL_SIZE` | Used as coordinate scale | ... |
| Region inset `4` | Used as domain mapping origin/boundary | ... |
| Existing high Positions | Potentially unrepresentable | ... |
| Preview→final | Required | still required |
| Existing markers | Slot layout replaced | ... |

This table must make the semantic repair obvious.

---

# 46. REQUIRED COORDINATE PIPELINE

Document the repaired conceptual pipeline.

It must clearly separate:

## CAMERA CONVERSION

> viewport
> → World logical

from:

## PDM COORDINATE CONVERSION

> World logical
> → domain Position

and the inverse.

Use actual repository terminology.

Do not merge camera pixels with domain coordinates.

---

# 47. REQUIRED FORMULA / ALGORITHM LEVEL

The delta is only complete if the later implementation does NOT need to guess the projection.

Therefore provide enough deterministic algorithm detail to implement it.

However:

do not invent constants unsupported by authority.

If a deterministic algorithm requires an arbitrary constant/product choice that repository evidence cannot supply:

choose:

> CONTRACT DELTA STILL BLOCKED

rather than inventing it.

---

# 48. PRODUCT DECISION ESCALATION FORMAT

If a human decision is required, make it precise.

Do NOT say:

> coordinate mapping unclear.

Instead state something like:

> Repository authority defines Position as unbounded non-negative integers and World as a finite presentation surface, but defines no stable scale/extent linking them. A product decision is required between [bounded alternatives] because choosing a finite domain extent would create new placement semantics.

Only include alternatives actually supported by the architecture investigation.

---

# 49. NO IMPLEMENTATION

Do not create:

- coordinate adapter;
- React state;
- placement overlay;
- tests;
- CSS;
- map changes.

This task only repairs the contract.

---

# 50. REPORT UPDATE

Update:

`docs/architecture/reviews/POST_V1_PDM_001_PRODUCT_UX_CONTRACT.md`

Do not rewrite accepted sections unnecessarily.

Add a clearly identified section:

> `Coordinate Semantics Delta`

and correct affected claims in:

- coordinate-space model;
- map→domain contract;
- domain→World projection;
- validity terminology;
- authority matrix;
- implementation-readiness decision.

Preserve useful prior evidence.

Do not create a second competing PDM contract document unless repository conventions require immutable review reports.

If convention requires a separate delta report, create:

`docs/architecture/reviews/POST_V1_PDM_001_COORDINATE_SEMANTICS_CONTRACT_DELTA.md`

and make it explicitly amend/supersede only the coordinate portions of the original contract.

---

# 51. REQUIRED DELTA REPORT STRUCTURE

If a separate delta report is required, use:

## A. Delta result

## B. Baseline

## C. Original coordinate defect

## D. Domain Position authority

## E. Presentation geometry authority

## F. Existing Position evidence

## G. Finite-map / domain-space resolution

## H. Repaired projection contract

## I. Quantization contract

## J. Pickability vs domain validity

## K. Existing-building projection

## L. Preview→final continuity

## M. Authority table

## N. Old vs repaired contract

## O. Deterministic test contract

## P. Remaining blockers

## Q. Final implementation-readiness decision

Keep all non-coordinate PDM contract decisions incorporated by reference.

---

# 52. REQUIRED FACTUAL QUESTIONS

Explicitly answer:

1. What branch was reviewed?
2. What exact HEAD was reviewed?
3. What is the HEAD subject?
4. What is `origin/master`?
5. Does HEAD equal `origin/master`?
6. What unrelated WIP exists?
7. Is the broader PDM contract otherwise frozen?
8. What exact type/value object defines domain Position?
9. Does domain Position require integers?
10. Does domain Position reject negatives?
11. Does domain Position define an upper X bound?
12. Does domain Position define an upper Y bound?
13. Does another authoritative gameplay layer define upper placement bounds?
14. Does the API define coordinate maxima?
15. Does save schema define coordinate maxima?
16. What exactly does the old X/Y UI do with entered numbers?
17. Is `parseInt` domain authority or old UI behavior?
18. Is `floor` existing domain authority?
19. If not, how must `floor` be classified?
20. What representative Position values exist in tests/fixtures/saves?
21. Do any exceed the previous presentation-derived footprint range?
22. Can absence of such examples establish an upper bound?
23. What exact logical coordinate space does World use?
24. What does `WORLD_MAP_CELL_SIZE` mean?
25. Is `WORLD_MAP_CELL_SIZE` gameplay authority?
26. What does region inset `4` mean?
27. Is inset `4` gameplay authority?
28. What do `mapX/mapY` mean?
29. Are `mapX/mapY` domain building coordinates?
30. Is the region visual rectangle a gameplay placement bound?
31. Was the previous contract wrong to treat it as such?
32. What is the difference between map pickability and domain validity?
33. Can pointer-outside-pick-area be called gameplay-invalid?
34. What projection solution families were evaluated?
35. Can adaptive projection remain stable after adding a building?
36. Would adaptive projection move existing markers?
37. Can a fixed projection be derived without arbitrary scale constants?
38. Does repository authority contain an existing scale/extent?
39. Can the World logical plane extend beyond the current region rectangle?
40. Can current camera architecture represent such an extended plane?
41. What exact repaired domain→World projection is proposed?
42. What exact repaired World→domain unprojection is proposed?
43. What is the projection context?
44. Does projection context contain any new gameplay maximum?
45. What quantization operation is used?
46. Why is that quantization deterministic?
47. Is quantization classified as adapter semantics?
48. How are negative-result pointer locations handled?
49. How are large positive domain Positions handled?
50. Are large positive Positions still gameplay-valid if existing authority otherwise accepts them?
51. Can existing buildings with large Positions be rendered?
52. Would any existing building disappear or be clipped?
53. Does the repaired projection require save migration?
54. Does it require coordinate mutation?
55. Does it require new persisted projection state?
56. Does it require API changes?
57. Does it require regionId changes?
58. Does it invent collision rules?
59. Does it invent placement capacity?
60. Does it invent a domain maximum?
61. What happens to `distributeMarkerPosition`?
62. What remains presentation-only overlap handling?
63. What is the authoritative marker anchor after PDM?
64. Does preview use that same anchor?
65. Does final placed building use that same anchor?
66. Can preview→final continuity be guaranteed?
67. Is the projection pan-independent?
68. Is it zoom-independent?
69. Can forward/inverse mapping be unit-tested deterministically?
70. Can a round-trip property be stated?
71. Can a Position above the old footprint threshold be tested without calling it invalid?
72. Does desktop/narrow use identical coordinate semantics?
73. Does the repaired contract change raw X/Y disposition?
74. Does it change confirm/cancel?
75. Does it change placement-mode flow?
76. Does it change gameplay rules?
77. Does it change save/API?
78. Does it reopen Scenario-B?
79. Is a human product/gameplay coordinate decision still required?
80. If yes, what exact decision?
81. If no, what repository authority makes the repaired projection non-arbitrary?
82. Is the coordinate contract now deterministic?
83. Is the broader PDM contract now implementation-ready?
84. Is a bounded PDM implementation prompt justified?
85. Was any production code changed?
86. Was any product-test code changed?
87. Was any gameplay/content/save/API code changed?
88. Was there any commit?
89. Was there any push?
90. Was there any tag?

---

# 53. STOP CONDITIONS

STOP if:

- no deterministic domain↔World projection can be defined from existing authority;
- the only available solution requires inventing a finite gameplay coordinate maximum;
- the only available solution requires arbitrary scale constants with product meaning;
- existing Positions cannot be represented without migration;
- projection requires new persisted layout state;
- projection requires new gameplay region semantics;
- projection requires collision/capacity rules;
- preview→final continuity cannot be guaranteed;
- map architecture would require material redesign beyond bounded PDM;
- baseline integrity is ambiguous.

Do not force OPTION A.

---

# 54. FINAL DECISION

Return exactly ONE.

## OPTION A — COORDINATE CONTRACT REPAIRED / PDM IMPLEMENTATION READY

Use only when:

- domain authority is preserved;
- no presentation-derived gameplay maximum exists;
- presentation geometry is correctly classified;
- pickability is separated from domain validity;
- deterministic forward projection is defined;
- deterministic inverse/unprojection is defined;
- quantization is explicitly classified;
- large positive Positions are not invalidated merely by presentation geometry;
- existing buildings can use the same projection;
- preview and final marker use the same anchor;
- pan/zoom invariance is preserved;
- no save/API/gameplay changes are required;
- deterministic tests are possible.

State:

> **PDM-001 COORDINATE SEMANTICS:**  
> `REPAIRED / PASS`

> **DOMAIN POSITION AUTHORITY:**  
> `UNCHANGED`

> **PRESENTATION-DERIVED GAMEPLAY CAP:**  
> `NONE`

> **PICKABILITY / DOMAIN VALIDITY:**  
> `SEPARATED`

> **QUANTIZATION:**  
> `<exact operation> — PDM ADAPTER SEMANTICS`

> **DOMAIN → WORLD PROJECTION:**  
> `CONTRACTED`

> **WORLD → DOMAIN UNPROJECTION:**  
> `CONTRACTED`

> **EXISTING BUILDING PROJECTION:**  
> `CONTRACTED`

> **PREVIEW → FINAL CONTINUITY:**  
> `GUARANTEED BY SHARED PROJECTION`

> **GAMEPLAY RULES:**  
> `UNCHANGED`

> **SAVE / API:**  
> `UNCHANGED`

> **PDM-001 PRODUCT / UX CONTRACT:**  
> `COMPLETE / PASS`

> **IMPLEMENTATION READY:**  
> `YES`

> **NEXT PROMPT TYPE:**  
> `PDM-001 BOUNDED IMPLEMENTATION`

---

## OPTION B — HUMAN COORDINATE PRODUCT DECISION REQUIRED

Use when:

- product direction is otherwise clear;
- domain is unbounded/non-negative;
- finite World presentation is established;
- but repository authority does not define a stable, non-arbitrary relationship between them.

State:

> **PDM-001 COORDINATE SEMANTICS:**  
> `BLOCKED`

> **DOMAIN AUTHORITY:**  
> `<exact truth>`

> **PRESENTATION AUTHORITY:**  
> `<exact truth>`

> **MISSING DECISION:**  
> `<precise decision>`

> **SUPPORTED ALTERNATIVES:**  
> `<bounded alternatives actually supported by architecture>`

> **WHY CURSOR MUST NOT CHOOSE:**  
> `<reason>`

> **IMPLEMENTATION READY:**  
> `NO`

> **NEXT STEP:**  
> `HUMAN PRODUCT DECISION`

Do not invent the choice.

---

## OPTION C — BOUNDED ARCHITECTURE DISCOVERY REQUIRED

Use only when a suitable product coordinate model appears possible but current architecture truth is insufficient to determine whether it can be implemented without material redesign.

State:

> **PRODUCT DIRECTION:**  
> `CLEAR`

> **COORDINATE SEMANTICS:**  
> `<established parts>`

> **ARCHITECTURE BLOCKER:**  
> `<exact unknown>`

> **NEXT STEP:**  
> `BOUNDED COORDINATE ARCHITECTURE DISCOVERY`

No implementation.

---

## OPTION D — GAMEPLAY CONTRACT REQUIRED

Use only if direct map placement genuinely requires a new gameplay coordinate bound/rule.

State:

> **EXISTING DOMAIN AUTHORITY:**  
> `INSUFFICIENT FOR DIRECT PLACEMENT`

> **MISSING GAMEPLAY RULE:**  
> `<exact rule>`

> **WHY UX PROJECTION CANNOT SOLVE IT:**  
> `<evidence>`

> **IMPLEMENTATION READY:**  
> `NO`

Do not invent the rule.

---

## OPTION E — BASELINE NOT READY

Use only for repository/Git integrity failure.

---

# 55. DEFINITION OF DONE

This delta is complete only when:

- [ ] implementation guide read
- [ ] PDM contract read
- [ ] branch recorded
- [ ] exact HEAD recorded
- [ ] origin/master verified
- [ ] unrelated WIP untouched
- [ ] broader PDM contract frozen
- [ ] domain Position authority traced
- [ ] negative bound verified
- [ ] upper bound verified or explicitly NOT ESTABLISHED
- [ ] API/save coordinate bounds checked
- [ ] old X/Y conversion classified
- [ ] `parseInt` correctly classified
- [ ] `floor` correctly classified
- [ ] representative existing Positions checked
- [ ] no observed-value maximum converted into gameplay rule
- [ ] World logical space traced
- [ ] WORLD_MAP_CELL_SIZE classified
- [ ] region inset classified
- [ ] mapX/mapY classified
- [ ] region visual rectangle classified
- [ ] presentation/gameplay firewall established
- [ ] pickability/domain validity separated
- [ ] finite-map/unbounded-domain mismatch explicitly resolved
- [ ] adaptive projection stability assessed if relevant
- [ ] fixed projection feasibility assessed if relevant
- [ ] existing projection authority checked
- [ ] human-decision need assessed
- [ ] domain→World projection defined or exact blocker stated
- [ ] World→domain unprojection defined or exact blocker stated
- [ ] projection context defined
- [ ] quantization explicitly defined/classified
- [ ] negative pointer behavior defined
- [ ] large positive Position behavior defined
- [ ] no invented upper domain bound
- [ ] no invented collision
- [ ] no invented placement capacity
- [ ] no invented region semantics
- [ ] existing building projection defined
- [ ] distributeMarkerPosition future role classified
- [ ] authoritative marker anchor defined
- [ ] preview uses same anchor
- [ ] final building uses same anchor
- [ ] preview→final continuity guaranteed or blocker stated
- [ ] pan invariance established
- [ ] zoom invariance established
- [ ] desktop/narrow semantics identical
- [ ] no save migration
- [ ] no Position mutation
- [ ] no new persisted projection state
- [ ] no API change
- [ ] no gameplay change
- [ ] authority table completed
- [ ] old-vs-repaired table completed
- [ ] coordinate pipeline documented
- [ ] deterministic test contract documented
- [ ] implementation readiness decided
- [ ] affected original-contract claims corrected/amended
- [ ] exactly one final option selected
- [ ] no production-code changes
- [ ] no product-test changes
- [ ] no gameplay/content/save/API changes
- [ ] no art
- [ ] no commit
- [ ] no push
- [ ] no tag

---

# 56. CORE EXECUTION RULE

The broader PDM interaction contract is not the problem.

The coordinate semantics are.

Domain `Position` is gameplay/application truth.

World geometry is presentation truth.

Do not confuse them.

A finite SVG region rectangle must not silently become a new gameplay coordinate maximum.

`WORLD_MAP_CELL_SIZE` is not automatically a domain extent.

Region inset `4` is not automatically a buildable border.

`mapX/mapY` are not automatically building coordinates.

`floor` is not automatically existing domain authority.

Correct those classifications.

Separate:

> map pickability

from:

> gameplay/domain validity.

Preserve existing non-negative domain Positions.

Do not migrate or clamp them to fit presentation.

Define one deterministic shared projection for:

> existing building
> placement preview
> newly confirmed building.

Define the inverse for map selection.

Keep camera pan/zoom separate from coordinate semantics.

Guarantee preview→final continuity.

Do not invent:

- upper bounds;
- collision;
- placement capacity;
- region membership;
- gameplay scale.

If repository authority is sufficient to define a stable deterministic projection:

repair the contract and mark PDM implementation-ready.

If it is not:

identify the exact human product/gameplay decision required.

Do not choose an arbitrary scale merely to unblock implementation.

Produce one small coordinate-semantics delta.

Then STOP.

# END OF PROMPT