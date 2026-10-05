# POST-V1 PDM-001
# Coordinate Contract Consistency Closeout

## MODE

TINY READ-ONLY DOCUMENT CONSISTENCY CLOSEOUT.

No architecture discovery.

No product redesign.

No coordinate-semantics redesign.

No implementation.

No production-code changes.

No product-test changes.

No gameplay/content/save/API changes.

No art.

No commit.
No push.
No tag.

The substantive PDM-001 Coordinate Semantics Delta has already repaired the coordinate contract.

This task exists ONLY because several stale statements from the pre-delta coordinate model remain inside the authoritative PDM contract document.

The goal is:

> make the entire PDM-001 Product / UX Contract internally consistent with the already-approved repaired coordinate semantics.

Do NOT reopen:

- `s = 1`;
- `round`;
- domain Position authority;
- projection origin;
- placement flow;
- preview;
- confirm/cancel;
- raw X/Y disposition;
- narrow behavior;
- default-region semantics;
- save/API firewall.

This is a consistency closeout, not another design round.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

---

# 1. READ FIRST

Read:

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/architecture/reviews/POST_V1_PDM_001_PRODUCT_UX_CONTRACT.md`
- `docs/architecture/reviews/POST_V1_PDM_001_COORDINATE_SEMANTICS_CONTRACT_DELTA.md`

If the delta is incorporated directly into the main contract and no separate delta report exists, use the incorporated:

> `Coordinate Semantics Delta`

section as authority.

Do not perform a broad repository scan.

Code inspection is unnecessary unless needed to resolve an actual contradiction between the two contract documents.

---

# 2. BASELINE

Record only:

- branch;
- exact HEAD;
- `origin/master`;
- HEAD/origin relationship;
- unrelated WIP.

Do not require a new code baseline merely because these review documents are local/uncommitted.

Do not touch unrelated WIP.

---

# 3. AUTHORITATIVE REPAIRED COORDINATE SEMANTICS

For this closeout, the following are FROZEN and authoritative.

## Domain Position

- domain `Position { x, y }` uses non-negative integers;
- no authoritative upper X/Y domain bound is established;
- PDM must not invent one.

## Presentation firewall

The following are presentation authority, not gameplay placement bounds:

- SVG extent;
- `WORLD_MAP_CELL_SIZE`;
- region `mapX/mapY`;
- region inset;
- rendered region footprint.

## Projection

Conceptual forward projection:

> `projectDomainPosition(position, ctx)`

with:

> `world = O + position * s`

where:

- `O` is the stable default-region presentation anchor;
- `s = 1`;
- `s` is PDM adapter/presentation semantics, not a gameplay bound.

## Unprojection

Conceptual inverse:

> `unprojectWorldPoint(worldPoint, ctx)`

uses the same stable projection context.

## Quantization

Quantization is:

> `round`

Classification:

> `PDM ADAPTER SEMANTICS`

It is NOT existing domain authority.

It is NOT `floor`.

## Negative result

Pointer locations whose unprojection would produce a negative domain coordinate:

> `no-pick`

Do not clamp.

## Positive positions beyond region artwork

A positive domain Position is NOT gameplay-invalid merely because it lies:

- outside the rendered region footprint;
- beyond `cellSize - inset`;
- beyond the currently painted region art.

Presentation geometry does not create a gameplay upper bound.

## Pickability vs validity

These concepts remain distinct:

> `no-pick`

means:

> the current UI location did not produce a candidate.

It does NOT mean:

> the domain declares that Position gameplay-invalid.

## Existing buildings

Existing buildings, preview, and newly placed buildings use the same domain→World projection anchor semantics.

## Preview → final continuity

The preview and final placed building must represent the same logical domain Position.

These decisions are NOT under review.

---

# 4. KNOWN STALE STATEMENTS

The independently reviewed contract still contains stale pre-delta statements.

At minimum inspect and repair every occurrence equivalent to:

### A. Old quantization

- `floor normalization`
- `integer floor`
- mapping descriptions that still use `floor`

These must become consistent with:

> `round` — PDM adapter semantics.

---

### B. Old footprint validity

Examples:

- `outside footprint → invalid`
- `outside footprint → disabled confirm`
- `footprint edge cases` when described as gameplay validity
- `Hints + footprint + command` when footprint is presented as domain validity

These must be rewritten using the repaired distinction:

> map pickability / projection availability

versus:

> authoritative gameplay/domain validity.

---

### C. Old mapping authority

Examples that imply:

> `WORLD_MAP_CELL_SIZE`, inset `4`, and `floor` collectively define domain placement range.

Correct them.

The presentation geometry may contribute to stable projection anchor/context.

It does NOT define an upper gameplay/domain placement bound.

---

### D. Old readiness summary

Any final readiness statement that still describes the superseded coordinate contract must be corrected before implementation readiness can be trusted.

---

### E. Old factual Q&A

Any factual-answer row that still says:

- `floor`;
- footprint defines invalidity;
- footprint defines placement range;
- outside footprint is gameplay-invalid;

must be synchronized with the repaired contract.

---

# 5. SEARCH-BASED CONSISTENCY PASS

Perform a bounded text search within the authoritative PDM contract for terms including:

- `floor`
- `footprint`
- `outside`
- `invalid`
- `cellSize`
- `inset`
- `upper bound`
- `round`
- `pick`
- `no-pick`
- `validity`
- `projection`

Review every occurrence only for consistency with the repaired coordinate semantics.

Do NOT mechanically replace words.

Some occurrences remain valid.

Examples:

- describing the old defect historically may remain;
- stating that footprint is presentation-only may remain;
- stating that no upper bound exists must remain.

Change only stale normative/current-contract claims.

---

# 6. TESTABILITY FORECAST REPAIR

The current testability forecast must no longer request:

> `floor normalization`

Replace with the repaired deterministic requirement:

> `round` quantization as PDM adapter semantics.

Do not treat footprint boundaries as gameplay-validity boundaries.

The later test contract should cover at least:

- domain origin;
- deterministic `round` quantization;
- negative-result → no-pick;
- positive Position beyond old region-art footprint is not rejected merely by presentation geometry;
- forward/inverse projection consistency;
- pan invariance;
- zoom invariance;
- existing-building projection;
- preview→final continuity.

Keep this a forecast only.

Do not write tests.

---

# 7. RUNTIME CERTIFICATION FORECAST REPAIR

Remove the stale runtime expectation:

> outside footprint → disabled confirm

if it refers merely to leaving the rendered region-art footprint.

Replace it with runtime evidence consistent with the repaired contract.

Expected invalid/no-candidate runtime path should demonstrate something actually supported by the repaired semantics, for example:

> a pointer location whose unprojection falls below the non-negative domain origin produces no candidate and confirm remains unavailable.

Do not invent a new gameplay-invalid location.

Keep command-rejection evidence separate from map no-pick evidence.

---

# 8. VALIDITY CONTRACT REPAIR

Ensure the contract consistently separates:

## MAP PICKABILITY

Can the UI location be transformed into a candidate non-negative domain Position?

from:

## GAMEPLAY / COMMAND VALIDITY

Do existing authoritative rules permit placement?

Examples include:

- building availability;
- prerequisites;
- cost;
- existing command/domain validation.

Presentation footprint must not appear as an authoritative gameplay validity rule.

---

# 9. MAIN CONTRACT TABLE REPAIR

Review the main contract table.

The `Validity` row must no longer imply:

> footprint = gameplay validity.

Use terminology consistent with the repaired contract, conceptually:

> pickability via coordinate adapter + existing hints/command authority

or the equivalent wording already established by the delta.

Do not redesign the table.

---

# 10. READINESS SECTION REPAIR

The final implementation-readiness section must summarize the ACTUAL repaired coordinate contract.

It must NOT claim that mapping authority is:

> `WORLD_MAP_CELL_SIZE + inset 4 + floor`

as though these establish the placement range.

Instead state the repaired truth:

- stable projection anchor/context;
- `s = 1` PDM adapter semantics;
- `round` quantization;
- non-negative domain Position;
- no presentation-derived upper bound;
- shared forward projection for preview/existing/final building;
- inverse projection for candidate selection;
- camera transformation separate from domain projection.

Keep it concise.

---

# 11. FACTUAL Q&A REPAIR

Update only Q&A answers affected by the Coordinate Semantics Delta.

At minimum verify the rows covering:

- coordinate mapping;
- quantization;
- snapping;
- pointer outside old footprint;
- region semantics;
- validity;
- implementation readiness.

Do not rewrite unaffected Q&A rows.

The Q&A must no longer contradict the main contract.

---

# 12. CONTRACT VALIDATION SCENARIOS REPAIR

Review the conceptual scenarios.

The stale scenario:

> outside footprint → invalid feedback, confirm disabled

must not remain if `outside footprint` only means outside presentation art.

Replace it with a scenario that follows repaired semantics.

For example:

## D — No-pick

Given a pointer location whose unprojection would produce a negative domain coordinate,

when the player selects that location,

then no candidate is produced and confirm remains unavailable.

Separately preserve command/domain rejection semantics where relevant.

Do not invent a new gameplay validation rule.

---

# 13. TERMINOLOGY CONSISTENCY

After edits, these terms must have stable meanings:

### `Position`

Authoritative domain `{ x, y }`.

### `projection`

Domain Position → World logical presentation.

### `unprojection`

World logical point → candidate domain Position / no-pick.

### `round`

PDM adapter quantization.

### `no-pick`

UI location cannot produce a candidate under adapter semantics.

### `pickable`

UI location can produce a candidate Position.

### `valid`

Placement is allowed under applicable authoritative placement rules.

### `region footprint`

Presentation geometry only.

Do not use `invalid` when only `no-pick` is meant.

---

# 14. DO NOT REOPEN `s = 1`

This closeout is NOT authorization to reconsider:

> `s = 1`.

Do not compare alternative scales.

Do not create adaptive projection.

Do not return to the finite-map/unbounded-domain design debate.

The Coordinate Semantics Delta already selected the repaired projection.

This task only synchronizes the remaining document.

---

# 15. DO NOT REOPEN `round`

Likewise:

> `round`

is frozen as PDM adapter semantics for this closeout.

Do not switch back to:

- floor;
- truncation;
- ceil.

Only remove stale references to the old quantization.

---

# 16. DO NOT REOPEN PRODUCT FLOW

Do not change:

- `Position auf Karte wählen`;
- automatic World transition;
- transient placement session;
- preview;
- explicit `Gebäude platzieren`;
- `Abbrechen`;
- success stays on World;
- rejection stays in placement mode;
- navigation-away cancellation;
- raw X/Y removed from normal flow;
- narrow direct placement;
- marker/region interaction suppression during placement.

These have already passed contract review.

---

# 17. DO NOT REOPEN GAMEPLAY

Do not add:

- coordinate maximum;
- collision;
- capacity;
- building footprint gameplay;
- region assignment from geometry;
- snapping gameplay;
- new prerequisites.

No gameplay changes.

---

# 18. SAVE / API / ART FIREWALL

Still unchanged:

- no save migration;
- no schema change;
- no API change;
- no new endpoint;
- no new persisted projection state;
- no art;
- Scenario-B remains PAUSED.

---

# 19. DOCUMENT OWNERSHIP

Primary document:

`docs/architecture/reviews/POST_V1_PDM_001_PRODUCT_UX_CONTRACT.md`

Edit this document only as needed to eliminate stale coordinate-contract statements.

If a separate delta report exists:

do not rewrite its already-correct substantive findings unless an actual contradiction is discovered.

Do not create another large review report.

---

# 20. OPTIONAL TINY CLOSEOUT RECORD

If repository conventions require a separate closeout record, create only:

`docs/architecture/reviews/POST_V1_PDM_001_COORDINATE_CONTRACT_CONSISTENCY_CLOSEOUT.md`

Keep it very small.

It should contain:

- baseline;
- stale statements corrected;
- consistency check;
- final readiness decision.

Do not duplicate the entire PDM contract.

If no separate record is required:

the corrected authoritative contract plus final Cursor report is sufficient.

---

# 21. REQUIRED CONSISTENCY TABLE

In the final Cursor response or tiny closeout record, include:

| Check | Result |
|---|---|
| Stale `floor` normative references | NONE / FAIL |
| Quantization consistently `round` | PASS/FAIL |
| Footprint used as gameplay upper bound | NONE / FAIL |
| Pickability vs validity consistently separated | PASS/FAIL |
| Testability forecast synchronized | PASS/FAIL |
| Runtime forecast synchronized | PASS/FAIL |
| Main contract table synchronized | PASS/FAIL |
| Validation scenarios synchronized | PASS/FAIL |
| Final readiness section synchronized | PASS/FAIL |
| Factual Q&A synchronized | PASS/FAIL |
| `s = 1` unchanged | PASS/FAIL |
| No gameplay rule added | PASS/FAIL |
| Save/API unchanged | PASS/FAIL |
| PDM contract internally consistent | PASS/FAIL |

---

# 22. REQUIRED FACTUAL QUESTIONS

Explicitly answer:

1. What branch was reviewed?
2. What exact HEAD was reviewed?
3. What is `origin/master`?
4. Does HEAD equal `origin/master`?
5. What unrelated WIP exists?
6. Was the substantive Coordinate Semantics Delta reopened?
7. Is `s = 1` unchanged?
8. Is quantization still `round`?
9. Is `round` consistently classified as PDM adapter semantics?
10. Does any current normative section still prescribe `floor`?
11. Does any current normative section still treat the region footprint as a domain upper bound?
12. Does any current normative section still call outside-region-art positions gameplay-invalid merely because of presentation geometry?
13. Is `WORLD_MAP_CELL_SIZE` consistently treated as presentation authority rather than a gameplay maximum?
14. Is inset `4` consistently treated as presentation authority rather than a gameplay bound?
15. Are pickability and gameplay validity consistently separated?
16. Is negative-result behavior consistently `no-pick`?
17. Are positive Positions beyond the old region-art footprint still permitted by the adapter contract?
18. Does the testability forecast use the repaired semantics?
19. Does the runtime-certification forecast use the repaired semantics?
20. Does the main contract table use the repaired semantics?
21. Do the conceptual validation scenarios use the repaired semantics?
22. Does the final readiness section use the repaired semantics?
23. Does the factual Q&A use the repaired semantics?
24. Do preview, existing buildings, and final markers still share the same projection?
25. Is preview→final continuity still required?
26. Is `distributeMarkerPosition` still non-authoritative for building position?
27. Did placement flow change?
28. Did confirm/cancel change?
29. Did raw X/Y disposition change?
30. Did narrow behavior change?
31. Was any gameplay rule added?
32. Was any save/API/schema behavior changed?
33. Was Scenario-B reopened?
34. Does any material coordinate contradiction remain?
35. Is PDM-001 Product / UX Contract now internally consistent?
36. Is PDM implementation now ready?
37. Is a bounded PDM implementation prompt justified next?
38. Was any production code changed?
39. Was any product-test code changed?
40. Was any gameplay/content/save/API code changed?
41. Was there any commit?
42. Was there any push?
43. Was there any tag?

---

# 23. STOP CONDITIONS

STOP without implementation if:

- correcting stale text exposes a genuine contradiction in the substantive Coordinate Semantics Delta;
- `s = 1` cannot coexist with another frozen contract requirement;
- `round` cannot coexist with another frozen contract requirement;
- preview→final continuity is no longer guaranteed;
- a deterministic projection contradiction remains;
- fixing consistency would require a new gameplay rule;
- fixing consistency would require a save/API change;
- the authoritative PDM contract and Coordinate Semantics Delta cannot be reconciled editorially.

If none of these occur:

finish the consistency closeout.

---

# 24. FINAL DECISION

Return exactly ONE.

## OPTION A — CONSISTENCY CLOSED / PDM IMPLEMENTATION READY

Use only when:

- all stale normative `floor` references are removed/corrected;
- `round` is consistent everywhere;
- no footprint-derived gameplay upper bound remains;
- outside-region-art is not mislabeled gameplay-invalid;
- pickability and validity are consistently separated;
- testability forecast is corrected;
- runtime forecast is corrected;
- main contract table is corrected;
- validation scenarios are corrected;
- readiness section is corrected;
- Q&A is corrected;
- no substantive coordinate decision was reopened;
- no material contradiction remains.

State:

> **PDM-001 COORDINATE CONTRACT CONSISTENCY:**  
> `CLOSED / PASS`

> **SUBSTANTIVE COORDINATE SEMANTICS:**  
> `UNCHANGED`

> **QUANTIZATION:**  
> `round — PDM ADAPTER SEMANTICS`

> **PRESENTATION-DERIVED GAMEPLAY CAP:**  
> `NONE`

> **PICKABILITY / DOMAIN VALIDITY:**  
> `CONSISTENTLY SEPARATED`

> **PREVIEW → FINAL CONTINUITY:**  
> `REQUIRED / CONTRACTED`

> **PDM-001 PRODUCT / UX CONTRACT:**  
> `COMPLETE / PASS`

> **IMPLEMENTATION READY:**  
> `YES`

> **NEXT PROMPT TYPE:**  
> `PDM-001 BOUNDED IMPLEMENTATION`

---

## OPTION B — MATERIAL CONTRACT CONTRADICTION REMAINS

Use only if consistency cleanup exposes a real unresolved semantic contradiction.

State:

> **PDM-001 COORDINATE CONTRACT CONSISTENCY:**  
> `BLOCKED`

> **EXACT CONTRADICTION:**  
> `<specific sections and claims>`

> **WHY EDITORIAL SYNCHRONIZATION CANNOT RESOLVE IT:**  
> `<reason>`

> **IMPLEMENTATION READY:**  
> `NO`

> **NEXT STEP:**  
> `<bounded contract decision required>`

Do not implement.

---

## OPTION C — BASELINE NOT READY

Use only if repository/Git integrity prevents trustworthy closeout.

---

# 25. DEFINITION OF DONE

This closeout is complete only when:

- [ ] implementation guide read
- [ ] authoritative PDM contract read
- [ ] Coordinate Semantics Delta read
- [ ] branch recorded
- [ ] exact HEAD recorded
- [ ] origin/master verified
- [ ] unrelated WIP untouched
- [ ] substantive coordinate semantics frozen
- [ ] `s = 1` unchanged
- [ ] `round` unchanged
- [ ] all normative `floor` references searched
- [ ] all stale normative `floor` references corrected
- [ ] all footprint references searched
- [ ] no footprint-derived gameplay upper bound remains
- [ ] all outside/invalid references searched
- [ ] no outside-region-art gameplay-invalid claim remains
- [ ] WORLD_MAP_CELL_SIZE classification consistent
- [ ] inset classification consistent
- [ ] pickability terminology consistent
- [ ] validity terminology consistent
- [ ] no-pick terminology consistent
- [ ] negative-result behavior consistent
- [ ] large-positive-Position semantics preserved
- [ ] testability forecast synchronized
- [ ] runtime certification forecast synchronized
- [ ] validity section synchronized
- [ ] main contract table synchronized
- [ ] validation scenarios synchronized
- [ ] readiness section synchronized
- [ ] factual Q&A synchronized
- [ ] preview/existing/final projection still shared
- [ ] preview→final continuity preserved
- [ ] distributeMarkerPosition remains non-authoritative
- [ ] placement flow unchanged
- [ ] confirm/cancel unchanged
- [ ] raw X/Y disposition unchanged
- [ ] narrow behavior unchanged
- [ ] no gameplay rule added
- [ ] no save/API/schema change
- [ ] Scenario-B remains paused
- [ ] authoritative PDM contract internally consistent
- [ ] implementation readiness explicitly decided
- [ ] exactly one final option returned
- [ ] no production-code changes
- [ ] no product-test changes
- [ ] no gameplay/content/save/API changes
- [ ] no art
- [ ] no commit
- [ ] no push
- [ ] no tag

---

# 26. CORE EXECUTION RULE

Do not redesign PDM.

Do not redesign coordinates.

The coordinate semantics have already been repaired.

This task only removes stale statements from the old model.

The authoritative current semantics are:

> non-negative integer domain Position

> no established upper domain bound

> stable projection origin O

> `s = 1` as PDM adapter semantics

> `round` as PDM adapter quantization

> negative unprojection → no-pick

> no presentation-derived gameplay maximum

> region footprint = presentation geometry

> pickability ≠ gameplay validity

> shared projection for preview, existing buildings, and final placed building

> preview→final continuity required.

Every normative section of the PDM contract must say the same thing.

Search for stale:

> floor

> footprint invalidity

> outside-footprint rejection

> presentation-derived bounds

and correct them.

Synchronize:

- Testability Forecast;
- Runtime Certification Forecast;
- Validity;
- Main Contract Table;
- Validation Scenarios;
- Final Readiness;
- Factual Q&A.

Do not reopen `s = 1`.

Do not reopen `round`.

Do not add gameplay rules.

Do not change saves/APIs.

Do not implement.

When the document is internally consistent:

declare the contract complete and implementation-ready.

Then STOP.

# END OF PROMPT