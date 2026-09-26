# POST-V1 MSV-001 — Milestone Achievement Visual Identity
# Production Completion 4→8

## MODE

Bounded production completion.

Promote the four human-approved MSV-001 pilot milestone visuals, author the exact four remaining milestone visuals, complete the 8/8 production family, activate one authoritative milestone visual resolver, integrate the approved visual hierarchy into the existing milestone/progression runtime surface, validate real runtime behavior, update Scenario-B accounting, produce one final close candidate, and STOP.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

No new art-direction exploration.
No broad milestone UX redesign.
No gameplay/content rebalance.
No unrelated visual-family work.
No commit.
No push.
No tag.

---

# 1. HUMAN-GATED AUTHORITY — FROZEN

MSV-001 has completed human visual review.

The following decisions are now authoritative.

## Overall art direction

**APPROVED / PASS / SEALED**

Approved visual language:

> A stylized industrial achievement vignette inside a restrained octagonal industrial frame, centered on accomplishment/payoff rather than a catalog object.

The result must read as:

> “I achieved something important.”

It must NOT read primarily as:

- a resource;
- a building;
- a technology;
- a production recipe;
- a workforce role;
- an ordinary dashboard icon.

---

# 2. APPROVED TWO-TIER MODEL

## Tier 1 — Achievement Primary

Detailed authored milestone artwork.

Purpose:

> What important accomplishment did the player achieve?

Expected presentation strength:

- strong at 128–256 px;
- useful around 96 px;
- suitable for progression/reward presentation.

## Tier 2 — Achievement Medallion

Derived compact representation from the Tier-1 Primary.

Purpose:

> Compact recognition of the same achievement.

Primary compact target:

- 48 px;
- 64 px.

Additional validation:

- 32 px diagnostic;
- 96 px.

Do not create an unrelated second visual language for medallions.

---

# 3. APPROVED STATE MODEL

Milestone state remains UI-owned.

Approved principle:

- LOCKED → CSS/UI modulation/desaturation/treatment;
- COMPLETED → full artwork;
- other runtime states → existing UI treatment where applicable.

Do NOT bake state into separate art assets.

Do NOT create separate locked/completed PNG families.

---

# 4. FOUR HUMAN-APPROVED PILOTS

The following four pilot Primaries are approved and SEALED as visual direction:

1. `first_production`
2. `first_steel`
3. `first_profit`
4. `first_consumer_goods`

Important:

`first_profit` refers to the FINAL REPAIRED VERSION.

The rejected predecessor containing baked:

`FIRST PROFITABLE SALE`

must NEVER be promoted.

The repaired no-text version is the only approved `first_profit` authority.

Do not regenerate these four unless a hard technical production defect makes promotion impossible.

Promotion is preferred over regeneration.

---

# 5. EXACT PRODUCTION TARGET

Current conceptual state before this task:

- enabled milestones: expected 8;
- approved Tier-1 pilot concepts: 4;
- approved derived Tier-2 pilot medallions: 4;
- production MSV-001 coverage: 0/8.

This task must finish at:

> **8/8 production Tier-1 milestone Primaries**

and:

> **8/8 production Tier-2 milestone Medallions**

Exactly four existing approved pilots are promoted.

Exactly four remaining milestones receive new production artwork.

Do not create more than the authoritative enabled milestone inventory.

If the current content inventory differs from the historical expected 8:

STOP and classify the difference before creating art.

Do not silently invent or omit milestones.

---

# 6. BASELINE FIRST

Before changing anything:

Record:

- branch;
- HEAD;
- working-tree state;
- current enabled milestone inventory;
- current MSV-001 pilot assets;
- current production registry state;
- current milestone runtime consumers.

Distinguish:

1. task-owned MSV-001 predecessor work;
2. unrelated working-tree churn.

Do not absorb unrelated changes.

Verify the actual milestone YAML/content files rather than relying only on historical reports.

---

# 7. AUTHORITATIVE 8-MILESTONE INVENTORY

Historically expected milestone IDs are:

1. `first_production`
2. `first_steel`
3. `first_profit`
4. `first_consumer_goods`
5. `first_machine_parts`
6. `first_industrial_machinery`
7. `first_advanced_electronics`
8. `profit_100`

Re-audit this against authoritative current content.

For each milestone record:

- ID;
- player-facing name;
- description;
- trigger semantics;
- reward if relevant;
- progression role;
- visual concept;
- production status.

Do not infer semantics from the ID alone.

Use the actual milestone definitions.

---

# 8. PROMOTE EXACTLY FOUR APPROVED PILOTS

Promote without unnecessary regeneration:

- `first_production`
- `first_steel`
- repaired `first_profit`
- `first_consumer_goods`

For each:

- promote approved Tier-1 Primary;
- produce/confirm production derivative;
- promote/derive Tier-2 Medallion;
- preserve approved composition;
- preserve no-text compliance;
- preserve family framing;
- run production asset QA.

If pilot → production path requires copying/derivation, keep provenance clear.

Do not count pilot and production copies as two authored concepts.

---

# 9. AUTHOR EXACTLY FOUR NEW TIER-1 PRIMARIES

Create production-quality detailed Primary artwork for exactly:

- `first_machine_parts`
- `first_industrial_machinery`
- `first_advanced_electronics`
- `profit_100`

All four must follow the SEALED MSV-001 art direction.

No new direction comparison.
No A/B/C pilot.
No human portraits.
No generic trophy family.
No plain category icon enlarged into a card.

---

# 10. NEW PRIMARY — `first_machine_parts`

Read the authoritative milestone semantics first.

The artwork should communicate the accomplishment of reaching meaningful machine-component production.

Preferred semantic territory may include, where supported:

- precision mechanical components;
- gears;
- shafts;
- machined assemblies;
- finished industrial components;
- movement from raw manufacturing toward usable machine parts.

The achievement should be about:

> machine-part capability reached

not:

> one random gear icon.

Avoid:

- copying ICON-001;
- simply displaying a resource stack;
- turning it into a machine-shop building;
- presenting an active production recipe scene indistinguishable from ICON-005.

Use accomplishment/payoff composition.

---

# 11. NEW PRIMARY — `first_industrial_machinery`

Read authoritative semantics.

Communicate progression into substantial industrial machinery.

Potential visual territory, only where semantically supported:

- completed industrial machine;
- assembled heavy equipment;
- manufacturing capability reaching machine-scale complexity;
- finished apparatus emerging from an industrial context.

It must feel like a larger progression step than `first_machine_parts`.

Do not simply reuse an ICON-003 building.

Do not create an ICON-005 process illustration with a decorative frame.

The accomplishment itself must dominate.

---

# 12. NEW PRIMARY — `first_advanced_electronics`

Read authoritative semantics.

Communicate reaching advanced electronics capability.

Potential supported visual territory:

- sophisticated electronic assemblies;
- advanced boards/modules;
- controlled electronics manufacturing;
- high-value technical systems;
- transition from mechanical industry toward advanced electronics.

Do NOT:

- clone an ICON-004 technology Primary;
- depict generic AI;
- use floating sci-fi holograms unless actually supported;
- invent semiconductor/fab semantics beyond the milestone/content;
- rely on readable PCB text or labels.

It must remain an achievement vignette.

---

# 13. NEW PRIMARY — `profit_100`

This is the highest semantic-risk item in this batch.

Treat it deliberately.

First inspect the exact authoritative milestone condition and player-facing wording.

The visual must communicate:

> a materially larger / established level of commercial success

relative to `first_profit`.

It must NOT merely be:

> `first_profit` with more gold objects.

Required relationship:

`first_profit`
→ first proof of successful commercial value creation

`profit_100`
→ established / scaled / substantial commercial success

Use an industrial-economic accomplishment metaphor.

Possible visual grammar may include, only where honest:

- scaled value-flow;
- multiple productive outputs converging into accumulated value;
- larger industrial/commercial throughput;
- established profitable industrial operation;
- visible escalation of the approved first-profit metaphor.

Do NOT use:

- `100` baked into artwork;
- `100 GC`;
- currency symbols;
- dollar/euro signs;
- cash;
- coins;
- banknotes;
- stock-market arrows;
- finance dashboards;
- readable charts;
- text;
- labels;
- trophy/crown clichés.

The difference between `first_profit` and `profit_100` must be visually recognizable at 128–256 px.

If a semantically honest distinct solution cannot be achieved after bounded repair attempts:

STOP with a specific visual blocker.

Do not ship a duplicate-looking milestone merely to reach 8/8.

---

# 14. GLOBAL TIER-1 ART CONTRACT

All 8 production Primaries must conform to the SEALED MSV-001 contract.

Default technical target:

- approximately 1024×1024;
- RGBA;
- appropriate real transparency;
- clean alpha;
- production-quality raster art;
- consistent achievement framing;
- coherent industrial visual language.

No baked:

- milestone names;
- readable words;
- numbers;
- currency symbols;
- UI labels;
- logos;
- progress bars;
- completion badges;
- pseudo-writing.

No default human figure unless existing contract explicitly permits it.

No checkerboard baked into image.

No opaque matte where transparency is expected.

No obvious AI-generation artifacts.

No impossible/duplicated machinery that materially damages readability.

---

# 15. FAMILY PROGRESSION REQUIREMENT

The complete 8-piece family must not merely be individually attractive.

It must communicate progression.

At minimum visually assess these progression relationships:

### Industrial progression

`first_production`
→ `first_machine_parts`
→ `first_industrial_machinery`
→ `first_advanced_electronics`

The sequence should feel increasingly capable/advanced without inventing gameplay.

### Material progression

`first_steel`
must remain recognizably its own material achievement.

### Commercial progression

`first_profit`
→ `profit_100`

must clearly escalate.

### Consumer progression

`first_consumer_goods`
must remain distinguishable from the industrial machinery chain.

Create evidence that lets this be judged as a family.

---

# 16. DERIVE ALL 8 TIER-2 MEDALLIONS

Create/finalize one derived Tier-2 Medallion for every production milestone.

Required:

8/8.

Each medallion must:

- derive from its corresponding Primary;
- preserve the milestone's dominant cue;
- use the approved compact achievement framing;
- remain visually coherent with the family;
- remain distinguishable from generic category glyphs.

Validate at:

- 32 px diagnostic;
- 48 px;
- 64 px;
- 96 px.

Acceptance emphasis:

48/64 px.

Do not require fine scene comprehension at 32 px.

---

# 17. MANUAL NO-TEXT GATE — 8/8

The pilot phase demonstrated that automated QA alone is insufficient for generated text.

Perform explicit human-style visual inspection on all eight final Primaries.

Required matrix:

| Milestone | readable text | numbers/currency | pseudo-writing concern | result |
|---|---:|---:|---:|---|
| first_production | | | | |
| first_steel | | | | |
| first_profit | | | | |
| first_consumer_goods | | | | |
| first_machine_parts | | | | |
| first_industrial_machinery | | | | |
| first_advanced_electronics | | | | |
| profit_100 | | | | |

Every row must PASS.

If generated pseudo-text is materially visible:

repair/regenerate that asset.

Do not claim image tooling proves absence of text.

---

# 18. ALPHA / TECHNICAL QA — 8/8

For every Tier-1 Primary validate:

- file exists;
- decodes;
- expected dimensions;
- RGBA;
- transparency policy;
- no checkerboard contamination;
- no unintended matte;
- no obvious halo;
- no corrupt image;
- safe crop;
- manifest path correct.

For every Tier-2 Medallion validate:

- file exists;
- decodes;
- expected derivative dimensions;
- crop correct;
- visual source correct;
- manifest path correct.

Required:

> Primary technical QA 8/8 PASS

> Medallion technical QA 8/8 PASS

---

# 19. PRODUCTION ASSET ORGANIZATION

Follow established repository asset conventions.

Use the existing asset/source/derivative architecture.

Do not invent a parallel visual asset system.

Maintain provenance between:

- source/master;
- production Primary;
- derived Medallion.

Update/create the appropriate MSV-001 production manifest.

Manifest must identify at minimum:

- milestone ID;
- source/master;
- production Primary;
- Tier-2 Medallion;
- provenance;
- production status.

---

# 20. AUTHORITATIVE RUNTIME RESOLVER

Create or extend exactly one authoritative MSV-001 runtime resolution path.

Conceptually:

milestone ID
→ production Achievement Primary
→ production Achievement Medallion

Unknown milestone ID
→ safe generic milestone fallback

Do not duplicate mappings across screens.

Follow existing project architecture and asset-registry conventions.

A reusable primitive such as:

`MilestoneVisual`

is acceptable if consistent with repository patterns.

Do not force that exact name if architecture already has the proper abstraction.

Required behavior:

- known 8 milestone IDs resolve deterministically;
- Tier-1 requested → Primary;
- compact requested → Medallion;
- unknown ID → safe fallback;
- no broken URL;
- no empty gray slot;
- no accidental unrelated family fallback.

---

# 21. FALLBACK MUST REMAIN

Even with 8/8 current content coverage, preserve a defensive unknown-ID fallback.

Future or malformed content must not crash rendering.

Do not use fallback as an excuse for a missing current milestone mapping.

Current authoritative milestone inventory must resolve:

> 8/8 specific MSV-001 visuals.

---

# 22. BOUNDED RUNTIME INTEGRATION

Inspect the actual current milestone/progression UI.

Integrate MSV-001 only into an existing appropriate player-facing milestone/progression surface.

Do NOT invent a new milestone system.

Do NOT broadly redesign navigation.

Use the approved hierarchy:

### Reward/progression context

Use Tier-1 Primary where the existing layout can reasonably support meaningful detailed art.

Target:

approximately 96–128 px or larger where existing layout permits.

### Compact row/list context

Use Tier-2 Medallion.

Target:

48–64 px.

Do not put a 1024 master directly into a tiny 32 px slot.

Do not create giant blank Primary slots for layouts that are naturally compact.

---

# 23. LOCKED / COMPLETED RUNTIME STATES

Use existing milestone state.

Art must remain state-neutral.

Apply locked/completed visual treatment through UI/CSS/modulation.

Validate at least:

- one locked milestone;
- one completed milestone.

Required:

- locked still identifiable;
- completed art remains visually rewarding;
- no separate duplicate locked art asset;
- no baked checkmark;
- no baked lock;
- no misleading completion state.

---

# 24. PLAYER-FACING TEXT

Use authoritative player-facing milestone names.

Do not introduce raw IDs such as:

`first_machine_parts`

into visible UI.

This task is not the Player Guidance workstream, but MSV-001 integration must not introduce new raw-ID leakage.

Do not broadly repair unrelated existing text debt unless directly caused by this task.

---

# 25. REQUIRED EVIDENCE — FAMILY

Create:

`docs/architecture/reviews/evidence/MSV_001_PRODUCTION_8_OF_8_PRIMARY_FAMILY_BOARD.png`

Must show all 8 Tier-1 Primaries at a meaningful comparable size with player-facing labels outside the artwork.

Purpose:

- family coherence;
- semantic differentiation;
- progression;
- quality consistency.

---

# 26. REQUIRED EVIDENCE — MEDALLIONS

Create:

`docs/architecture/reviews/evidence/MSV_001_PRODUCTION_8_OF_8_MEDALLION_FAMILY_BOARD.png`

Show all 8 at:

- 48 px;
- 64 px;

and optionally 96 px if useful.

Purpose:

prove compact family viability.

---

# 27. REQUIRED EVIDENCE — PROGRESSION

Create:

`docs/architecture/reviews/evidence/MSV_001_PRODUCTION_PROGRESSION_LADDER_BOARD.png`

Show at minimum:

### Industrial ladder

- first_production
- first_machine_parts
- first_industrial_machinery
- first_advanced_electronics

### Commercial ladder

- first_profit
- profit_100

The board should make escalation independently reviewable.

---

# 28. REQUIRED EVIDENCE — CROSS-FAMILY

Create or refresh:

`docs/architecture/reviews/evidence/MSV_001_PRODUCTION_CROSS_FAMILY_DIFFERENTIATION_BOARD.png`

Compare representative production assets from:

- ICON-001 Resource;
- ICON-003 Building;
- ICON-004 Technology;
- ICON-005 Process;
- WFV-001 Workforce;
- MSV-001 Milestone.

MSV-001 must still read as:

> achievement / progression reward

not one of the other asset families.

---

# 29. REQUIRED EVIDENCE — RUNTIME

Capture actual runtime evidence.

At minimum:

`docs/architecture/reviews/evidence/MSV_001_PRODUCTION_RUNTIME_DESKTOP.png`

`docs/architecture/reviews/evidence/MSV_001_PRODUCTION_RUNTIME_NARROW.png`

`docs/architecture/reviews/evidence/MSV_001_PRODUCTION_RUNTIME_LOCKED_COMPLETED.png`

Use actual application runtime, not static mocks.

Suggested viewport targets:

- desktop ~1440×900;
- narrow ~480×900.

Evidence must show the real milestone/progression consumer.

---

# 30. RUNTIME ACCEPTANCE

Inspect actual screenshots.

Desktop must show:

- MSV art visible;
- no broken images;
- no giant empty spaces;
- readable labels;
- no raw IDs introduced;
- no art/text collision;
- no gray lazy-loading placeholders;
- coherent achievement presentation.

Narrow must show:

- no destructive overflow;
- milestone art remains useful;
- labels remain readable;
- no clipped controls;
- no giant art forcing unusable horizontal layout;
- medallions/Primaries scale appropriately.

Locked/completed evidence must show:

- state treatment works;
- artwork remains recognizable;
- no duplicated state assets.

Repair task-local runtime defects before close candidate.

---

# 31. PROGRAMMATIC 8/8 RESOLUTION CHECK

Create/run a deterministic check proving:

- authoritative milestone count = expected current inventory;
- all 8 current IDs have production Primary mappings;
- all 8 have Medallion mappings;
- all paths exist;
- all assets decode;
- no duplicate milestone IDs;
- no duplicate accidental mapping;
- unknown ID safely falls back.

Required close state if inventory remains historical:

> 8/8 Primary resolution PASS

> 8/8 Medallion resolution PASS

> unknown fallback PASS

---

# 32. TESTS

Add focused tests appropriate to the architecture.

At minimum cover:

- known milestone → correct Primary;
- known milestone → correct Medallion;
- all authoritative IDs resolve;
- unknown ID fallback;
- manifest integrity;
- asset paths;
- runtime component behavior where appropriate;
- locked/completed treatment where reasonably testable.

Do not write brittle tests against irrelevant CSS implementation details.

Do not delete or weaken existing tests.

---

# 33. SCENARIO-B ACCOUNTING

Update:

`docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`

Accurately.

Rules:

### Promoted pilots

The four approved pilots become production authored concepts.

Count each exactly once.

Do NOT count:

- pilot copy + production copy separately;
- Primary + runtime derivative separately;
- evidence screenshots;
- medallion crop as another Tier-1 Primary;
- registry entries;
- fallback mappings.

### Four new Primaries

Each new authored Tier-1 Primary counts once.

### Tier-2 Medallions

Record as secondary/derived visual deliverables according to the existing ledger convention.

Do not pretend they are eight additional independent Primary art directions.

MSV-001 should become:

> ACTIVE / COMPLETE — 8/8 current milestone visual coverage

or the exact equivalent consistent with inventory terminology.

Scenario B overall remains:

> IN PROGRESS

unless an entirely separate portfolio review proves otherwise.

Do NOT mark Scenario B complete merely because MSV-001 is complete.

---

# 34. CONTRACT PROMOTION

Update:

`docs/design/milestones/MILESTONE_VISUAL_IDENTITY_MSV_001_ART_CONTRACT.md`

Preserve version/history.

Record:

- Human Art Direction approval;
- final `first_profit` repair approval;
- Tier-1 Primary model approved;
- Tier-2 derived Medallion model approved;
- locked/completed state model approved;
- production completion activation;
- 8/8 coverage result.

After successful completion, contract may become:

> **APPROVED / PRODUCTION AUTHORITY**

Do not erase the historical rejected first_profit variant.

Keep the repair history concise but auditable.

---

# 35. PILOT/CLOSEOUT HISTORY

Preserve:

- original pilot report;
- first-profit repair closeout;
- human-gate history.

Do not rewrite history as though the initial pilot passed first try.

The final production report should reference the approved/repaired lineage.

---

# 36. FIREWALLS

This task must not change:

- milestone trigger semantics;
- milestone reward semantics;
- milestone progression rules;
- simulation behavior;
- economy;
- production recipes;
- research;
- workforce mechanics;
- building mechanics;
- world/map mechanics;
- placement;
- transport;
- time/cycle semantics;
- save format;
- API contracts unless strictly required for existing milestone visual presentation and semantically neutral;
- unrelated visual families.

Do not reopen sealed:

- ICON-001;
- ICON-002;
- ICON-003;
- ICON-004;
- ICON-005;
- WFV-001;
- Building Visual Identity;
- World Visual Presentation;
- Time UX.

---

# 37. ROOT QUALITY GATES

Before final close candidate run:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build:web`

Required:

- typecheck PASS;
- lint PASS with 0 errors;
- test PASS;
- build:web PASS.

Also run all focused MSV asset/resolver tests.

If a gate fails because of task-local work:

repair it.

Do not return a known task-local gate failure.

If a genuinely unrelated baseline failure appears, prove it with baseline evidence rather than absorbing unrelated scope.

---

# 38. ASSET GATES

Required final asset gates:

- Tier-1 Primary existence: 8/8 PASS;
- Tier-1 decode: 8/8 PASS;
- Tier-1 dimensions: 8/8 PASS;
- Tier-1 alpha: 8/8 PASS;
- Tier-1 manual no-text: 8/8 PASS;
- Tier-2 Medallion existence: 8/8 PASS;
- Tier-2 decode: 8/8 PASS;
- Tier-2 48/64 readability: 8/8 PASS;
- manifest integrity: PASS;
- runtime resolver: 8/8 PASS;
- unknown fallback: PASS.

---

# 39. FINAL COVERAGE MATRIX

Include a complete matrix:

| Milestone ID | Player name | Primary | Medallion | No-text QA | Runtime resolves | Visual status |
|---|---|---:|---:|---:|---:|---|
| first_production | ... | PASS | PASS | PASS | PASS | production |
| first_steel | ... | PASS | PASS | PASS | PASS | production |
| first_profit | ... | PASS | PASS | PASS | PASS | repaired/promoted |
| first_consumer_goods | ... | PASS | PASS | PASS | PASS | production |
| first_machine_parts | ... | PASS | PASS | PASS | PASS | new production |
| first_industrial_machinery | ... | PASS | PASS | PASS | PASS | new production |
| first_advanced_electronics | ... | PASS | PASS | PASS | PASS | new production |
| profit_100 | ... | PASS | PASS | PASS | PASS | new production |

Use authoritative current player names.

---

# 40. FINAL REPORT

Create:

`docs/architecture/reviews/POST_V1_MSV_001_MILESTONE_ACHIEVEMENT_VISUAL_IDENTITY_PRODUCTION_COMPLETION_4_TO_8_CLOSE_CANDIDATE.md`

Required sections:

## A. Baseline
- branch;
- HEAD;
- working-tree classification.

## B. Authority
- human-gated art direction;
- repaired first_profit approval;
- frozen tier/state model.

## C. Current content inventory
- authoritative milestone count;
- IDs;
- player names.

## D. Pilot promotion
- exact four promoted;
- provenance;
- confirmation rejected first_profit not promoted.

## E. Four new Primaries
For each:
- semantic concept;
- differentiation;
- quality assessment.

## F. `profit_100` special review
Explicitly compare:
- first_profit;
- profit_100.

Explain why they are visually and semantically distinct.

## G. Tier-2 Medallions
- 8/8;
- scale QA.

## H. Technical asset QA
- dimensions;
- alpha;
- decode;
- no-text matrix.

## I. Registry/resolver
- architecture;
- 8/8 resolution;
- fallback.

## J. Runtime integration
- actual consumer;
- desktop;
- narrow;
- locked/completed.

## K. Coverage matrix
Full 8/8 table.

## L. Scenario-B accounting
- promoted concepts counted once;
- new concepts counted once;
- derived assets not double-counted;
- Scenario B remains honest.

## M. Contract/inventory updates
Exact status.

## N. Firewalls
Confirm no gameplay/content/unrelated visual changes.

## O. Repository gates
Exact commands/results.

## P. Evidence
List every evidence artifact.

## Q. Final decision

Choose exactly ONE option below.

---

# 41. FINAL DECISION OPTIONS

## OPTION A — MSV-001 PRODUCTION COMPLETION 8/8 FINAL CLOSE CANDIDATE READY

Use only if:

- authoritative current milestone inventory verified;
- 8/8 Primaries production-ready;
- 8/8 Medallions production-ready;
- all no-text gates pass;
- all technical asset gates pass;
- all runtime mappings pass;
- actual runtime evidence passes;
- first_profit repaired asset is the promoted version;
- profit_100 is genuinely distinct;
- root gates green;
- firewalls respected.

## OPTION B — ONE BOUNDED REPAIR REQUIRED

Use if one or a small number of concrete task-local defects remain.

List them exactly.

Repair obvious task-local defects before choosing this option.

## OPTION C — CONTENT/SEMANTIC BLOCKER

Use only if authoritative current milestone semantics make one of the four remaining visuals genuinely ambiguous or contradictory.

Do not invent gameplay semantics.

## OPTION D — RUNTIME/ARCHITECTURE BLOCKER

Use only if production integration requires a genuine architecture/product decision beyond this bounded task.

Prove why.

---

# 42. STOP CONDITION

After the final close-candidate report:

STOP.

Do not:

- start another visual family;
- start another MSV phase;
- redesign milestone UI;
- add extra milestone artwork;
- modify gameplay;
- commit;
- push;
- tag.

Independent review will determine the final seal.

---

# 43. CONSOLIDATED DEFINITION OF DONE

This task is complete only when:

- [ ] current authoritative milestone inventory is verified;
- [ ] exactly four approved pilots are promoted;
- [ ] repaired first_profit is the only promoted first_profit;
- [ ] exactly four new Primaries are authored;
- [ ] Tier-1 coverage is 8/8;
- [ ] Tier-2 Medallion coverage is 8/8;
- [ ] no-text QA is 8/8;
- [ ] technical Primary QA is 8/8;
- [ ] technical Medallion QA is 8/8;
- [ ] progression ladder visually passes;
- [ ] first_profit vs profit_100 differentiation passes;
- [ ] cross-family differentiation passes;
- [ ] one authoritative resolver exists;
- [ ] current IDs resolve 8/8;
- [ ] unknown fallback works;
- [ ] actual runtime integration exists;
- [ ] desktop runtime passes;
- [ ] narrow runtime passes;
- [ ] locked/completed treatment passes;
- [ ] no raw IDs were newly exposed;
- [ ] no gray/broken asset slots exist;
- [ ] contract is updated to production authority only if all gates pass;
- [ ] inventory records MSV-001 honestly;
- [ ] Scenario-B accounting contains no double counting;
- [ ] Scenario B overall remains IN PROGRESS unless separately proven complete;
- [ ] gameplay/content semantics are unchanged;
- [ ] sealed unrelated visual families remain untouched;
- [ ] typecheck passes;
- [ ] lint passes with 0 errors;
- [ ] tests pass;
- [ ] build:web passes;
- [ ] final close-candidate report exists;
- [ ] Cursor stops;
- [ ] no commit/push/tag occurred.

---

# CORE RULE

MSV-001 no longer needs an art-direction experiment.

The visual language is human-approved and SEALED.

Promote the exact four approved pilots, using ONLY the repaired no-text `first_profit`.

Create exactly four remaining milestone Achievement Primaries.

Finish 8/8 derived Medallions.

Make `profit_100` a genuine escalation of commercial achievement rather than a duplicated `first_profit`.

Activate one authoritative runtime resolver.

Put the art into the real existing milestone/progression experience.

Prove 8/8 resolution and real desktop/narrow/state behavior.

Do not change gameplay.

Do not double-count art.

Return one production-completion close candidate and STOP.