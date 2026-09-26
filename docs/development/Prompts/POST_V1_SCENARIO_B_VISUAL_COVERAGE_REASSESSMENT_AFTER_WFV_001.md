# POST-V1 Scenario-B Visual Coverage Reassessment after WFV-001

## Mode

READ-ONLY / PLANNING REVIEW.

This task does NOT create production art.

This task does NOT implement a new visual family.

This task does NOT redesign gameplay or UI.

Its purpose is to establish the current authoritative Scenario-B visual-coverage state after the recently completed production-art tracks and select exactly ONE next material visual workstream.

Allowed changes:

- this review report
- `docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md` only where factual status/count corrections are required

Do not modify runtime code, gameplay, content YAML, assets, registries, tests, UI components, or sealed visual-family contracts.

Do not commit, push, or tag.

---

# 1. Context

Project Genesis V1 is already released and sealed.

Post-V1 visual development follows:

**Scenario B — Target Production Quality**

Historical planning envelope:

- approximately 380–520 authored visual deliverables
- approximately 12 procedural visual systems

This is a planning envelope, NOT a quota.

Do not create graphics merely to reach a number.

The objective is:

> The game should visually communicate its world, systems, progression, rewards, economy, and player actions strongly enough that it feels like a game rather than an administrative application.

Visual quality matters.

Simple functional icons are NOT automatically sufficient coverage when the player-facing fantasy calls for detailed visual representation.

---

# 2. Important sealed authorities

Treat completed visual tracks as SEALED unless hard new evidence proves a real defect.

Do NOT reopen them merely because another style might be possible.

At minimum inspect repository authority and verify the current status of:

## ICON-001 — Resources

Existing resource visual family.

Do not reopen generically.

## ICON-002 — Building Categories

Existing compact/category building visual language.

Do not reopen generically.

## ICON-003 — Building Visual Identity

Production building visual identity.

Expected current state from predecessor work:

- 23/23 enabled building types
- detailed primary art
- compact derivatives
- infrastructure extension for:
  - `access_road`
  - `port`
  - `rail_terminal`
- Building Visual Identity track SEALED

Verify repository truth.

Do not reopen without hard evidence.

## ICON-004 — Technology / Research Visual Identity

A detailed two-tier technology visual system was developed:

- detailed technology primary art
- category compact visual layer
- runtime Research integration
- later production completion work

Determine the exact current production coverage from repository authority.

Do NOT assume old intermediate counts.

Do NOT reopen the art direction.

## ICON-005 — Production / Recipe Visual Identity

Production/recipe detailed visual identity was implemented after ICON-004.

Determine exact current production coverage and status from repository authority.

Do NOT infer it from old planning documents alone.

## World Visual Presentation

World presentation has already received:

- biome-first presentation
- map plate
- route treatment
- player-facing biome names
- minimap language
- World visual refinement
- production building marker integration / later visual repairs

The World track has been reviewed repeatedly.

Do not automatically select another World-map pass.

Only classify a World gap as material if current repository/runtime evidence demonstrates a specific remaining player-facing problem.

## WFV-001 — Workforce Role Visual Identity

This track is now authoritative as:

**CLOSED / PASS / SEALED**

Expected production state:

- 19/19 enabled employee types have WFV-001 production primaries
- resolver/registry coverage 19/19
- runtime resolution repaired
- enabled employee roles must not fall back to ICON-002
- unknown/unmapped employee IDs retain a safe generic fallback

The final repair identified a runtime-consumer problem rather than missing art.

Do NOT reopen WFV-001.

---

# 3. Baseline audit

Record:

- branch
- HEAD
- working-tree state
- task-owned files
- unrelated churn

Identify all authoritative visual contracts, manifests, registries, master inventories, close reports, and production asset directories relevant to Scenario B.

Do not trust stale planning prose where production evidence supersedes it.

Use this priority:

1. current runtime/registry state
2. current manifests
3. sealed close reports
4. current visual contracts
5. master inventory
6. historical planning/review documents

Where documents disagree, identify the discrepancy and determine repository truth.

---

# 4. Rebuild the current authored-visual ledger

Recalculate Scenario-B coverage from the current repository.

Do NOT simply carry forward historical counts.

Separate at least:

### A. Detailed authored primary art

Examples:

- building primary art
- technology primary art
- recipe/process primary art
- workforce role primary art
- major scenic art
- other detailed player-facing illustrations

### B. Compact authored visuals

Examples:

- resource icons
- category glyphs
- compact building derivatives
- technology category glyphs
- other compact visual identities

### C. Scenic / environmental art

Examples:

- menu
- splash
- loading
- world/environment visual assets

### D. Procedural visual systems

Examples:

- world biome rendering
- routes
- overlays
- state visualization

### E. Generic UI iconography

Count separately.

Generic UI icons must NOT be used to claim detailed visual coverage.

### F. Evidence / derivatives

Do NOT count:

- evidence boards
- screenshots
- resized copies of the same concept
- runtime derivatives of the same master
- registry entries
- duplicated pilot copies
- fallback copies

as independent authored primary concepts.

Produce an honest current range if exact historical counting is ambiguous.

---

# 5. Re-audit enabled game-content inventory

Determine the current authoritative enabled content counts.

At minimum inspect:

- resources / goods
- recipes / production processes
- building types
- technologies
- employee types
- milestones
- regions
- cities
- biomes
- transport/infrastructure concepts
- company/progression concepts
- events if enabled
- tutorial/guidance systems

Do not assume historical counts such as 23 buildings, 22 technologies, 19 employees, etc. without verifying current repository truth.

Record current counts and visual coverage.

---

# 6. Domain coverage matrix

Create a current matrix for at least:

| Domain | Enabled content | Detailed art | Compact art | Procedural visuals | Runtime consumer | Coverage status | Material gap? |
|---|---:|---:|---:|---:|---|---|---|

Include:

1. World / biomes
2. Regions / cities
3. Buildings
4. Building states / upgrades
5. Resources / goods
6. Production / recipes
7. Energy
8. Transport / infrastructure
9. Warehousing / logistics
10. Market / economy
11. Research / technologies
12. Workforce
13. Company / management
14. Milestones / progression
15. Events
16. Tutorial / guidance
17. Navigation / shell
18. Decorative/environmental visual identity
19. Economic / operational visualization

Use coverage classifications such as:

- COMPLETE / SEALED
- STRONG
- PARTIAL
- WEAK
- TEXT-ONLY
- GENERIC-ICON-ONLY
- PROCEDURAL-ONLY
- GAP
- NOT APPLICABLE

Do not mark a domain complete merely because some icon exists.

---

# 7. Game-fantasy test

For every materially incomplete domain ask:

> If labels and explanatory text were blurred, would the player still understand what fantasy/system/progression this part of the game represents?

Evaluate especially:

- milestones
- market/economy
- transport
- logistics
- company progression
- events
- tutorial/guidance
- cities/regions
- energy
- building progression/upgrades

A technically correct table with text and generic symbols may still be visually underdeveloped.

---

# 8. Progression/reward test

Scenario B requires more than identification.

Inspect whether important player achievements receive meaningful visual payoff.

Ask:

- Does completing research feel visually rewarding?
- Does constructing/upgrading industry create visible progression?
- Do milestones feel like achievements?
- Does company growth gain visual identity?
- Does expanding logistics/transport become visually legible?
- Does economic progress look materially different?
- Do important events have visual presence?
- Does workforce development visibly communicate progression?

Classify each:

- STRONG
- ADEQUATE
- WEAK
- ABSENT

Do not reopen sealed families just to increase reward if the gap belongs to another domain.

---

# 9. Candidate next workstreams

From current evidence, identify only genuinely material candidates.

Likely candidate families may include — but are NOT limited to:

### Milestone / Achievement Visual Identity

Potential problem:

Milestones may still be predominantly text/system state despite being important progression rewards.

Possible future family:

`MV-001` or another repository-consistent identifier.

Do not pre-decide this candidate.

### Transport / Logistics Visual Identity

Potential problem:

Transport systems may still rely on generic icons, tables, routes, or abstract UI rather than authored transport/infrastructure imagery.

Determine whether the actual game content justifies a dedicated visual family.

### Market / Economy Visual Identity

Potential problem:

Economy may remain spreadsheet-like despite being a central gameplay system.

Distinguish between:

- useful data visualization
- decorative art
- commodity/resource art
- market-state visualization

Do not solve an information-design problem with decorative pictures.

### Company / Progression Visual Identity

Potential problem:

Company growth, headquarters progression, management tiers, or corporate advancement may lack meaningful visual reward.

### Events Visual Identity

Only if events are materially enabled and player-facing.

### Region / City Visual Identity

Only if current World rendering still fails to communicate meaningful place identity beyond biome rectangles/procedural language.

Do NOT reopen the whole World renderer merely to add art.

### Tutorial / Guidance Visual Layer

Only if visual instruction/action guidance is the real remaining problem.

### Other

If repository evidence reveals a more important domain, include it.

---

# 10. Candidate scoring — no cosmetic ranking

For each material candidate provide factual assessment across:

| Criterion | Finding |
|---|---|
| Player-facing frequency | |
| Gameplay importance | |
| Current visual weakness | |
| Progression/reward value | |
| Semantic clarity | |
| Existing reusable art | |
| New authored-art need | |
| Runtime consumer readiness | |
| Architecture risk | |
| Gameplay-semantic risk | |
| Estimated bounded first slice | |

Do not choose based on easiest implementation.

Prefer the gap with the highest material player-facing visual impact while respecting architecture and semantics.

---

# 11. Explicitly inspect Milestones

Because buildings, research, production, workforce, and much of the World have now received substantial visual treatment, perform a particularly careful audit of the milestone/progression layer.

Determine:

- current enabled milestone count
- authoritative milestone names/descriptions
- where milestones appear in runtime UI
- whether milestone IDs still leak anywhere
- whether milestones have authored art
- whether they use generic icons
- whether milestone completion receives visual emphasis
- whether different milestone meanings are visually distinguishable
- whether milestone art could safely be created without inventing gameplay semantics
- whether a detailed primary-art family would materially improve the game
- suitable display sizes
- whether compact + detailed two-tier treatment is useful
- whether milestone art should depict:
  - achieved capability
  - industrial accomplishment
  - company progression
  - symbolic reward
  - another evidence-backed grammar

Do NOT create milestone assets in this review.

This audit exists because milestone progression is a plausible next high-value visual domain, not because it has already been selected.

---

# 12. Explicitly inspect Transport / Logistics

Determine:

- enabled transport concepts
- actual player-facing transport mechanics
- current visual consumers
- current authored assets
- World transport representation
- transport-screen representation
- vehicle/infrastructure imagery
- whether route lines alone are carrying too much visual meaning
- whether new art would represent real gameplay concepts rather than imagined vehicles/mechanics

Do not invent:

- truck fleets
- trains
- ships
- animated traffic
- route capacity semantics
- vehicle classes

unless current content/runtime semantics actually support them.

---

# 13. Explicitly inspect Market / Economy

Determine whether the market's weakness is primarily:

A. missing authored visual identity,

B. information hierarchy / UX,

C. economic visualization,

D. already sufficiently represented through resource art,

or a combination.

Do not create decorative market art merely to hide a UX problem.

---

# 14. Scenario-B remaining-gap estimate

After the new inventory, state:

- approximate current authored-primary coverage
- compact coverage
- procedural-system coverage
- clearly missing visual domains
- optional enrichment domains
- domains that should NOT receive more art

Do NOT calculate:

`520 - current = required remaining art`

Scenario B is not a quota.

Instead estimate what additional visual work is actually justified by the current game.

---

# 15. Select exactly ONE next material visual workstream

The review must end by selecting exactly one next workstream.

The selection must be evidence-backed.

For the selected workstream specify:

### Problem

What player-facing visual deficiency exists?

### Why now

Why is this more material than the other candidates?

### Existing foundation

What assets/components/data already exist?

### Proposed visual family

Use an identifier only if justified by repository conventions.

### Art hierarchy

For example:

- detailed primary
- compact glyph
- state overlay
- procedural visualization

Only include tiers that are actually justified.

### First bounded slice

Define ONE first slice.

Prefer an art-direction/contract pilot when a new visual grammar is required.

Do NOT jump directly into a large production batch unless the visual language is already authoritative.

### Human visual gate

If authored art is involved, require human visual approval before production activation.

---

# 16. Do not automatically select

Do NOT select any of these merely because they are known TODOs:

- another Building batch
- another Technology batch
- another Production batch
- another Workforce batch
- generic World polish
- responsive cleanup
- shell/sidebar beautification
- CI/CD
- lint warnings
- stale docs
- speculative performance work

Those require new material evidence.

---

# 17. Required report

Write:

`docs/architecture/reviews/POST_V1_SCENARIO_B_VISUAL_COVERAGE_REASSESSMENT_AFTER_WFV_001.md`

The report must contain:

1. baseline
2. authoritative sealed visual tracks
3. corrected Scenario-B authored ledger
4. current enabled-content inventory
5. domain coverage matrix
6. game-fantasy assessment
7. progression/reward assessment
8. Milestone audit
9. Transport/Logistics audit
10. Market/Economy audit
11. remaining material gaps
12. candidate workstream matrix
13. exactly one selected next workstream
14. exact first bounded slice
15. explicit firewalls
16. final decision

---

# 18. Master inventory update

If repository evidence shows that:

- WFV-001 is still marked incomplete,
- completed ICON families have stale counts,
- old pilot statuses remain,
- Scenario-B authored counts are stale,

update:

`docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`

Only make factual corrections.

Do not rewrite the document around a speculative future roadmap.

WFV-001 must reflect the independently accepted final state:

**19/19 — CLOSED / PASS / SEALED**

if repository evidence matches the final repair.

---

# 19. Final decision

Return exactly one:

## OPTION A — NEXT MATERIAL VISUAL WORKSTREAM IDENTIFIED

Use when one domain clearly has sufficient evidence to justify the next bounded visual slice.

State:

- workstream
- why it is material
- first bounded slice
- expected human gate

## OPTION B — TARGETED EVIDENCE NEEDED

Use only if two or more candidates remain materially indistinguishable because current runtime evidence is insufficient.

Specify exactly what small evidence capture is needed.

Do NOT request another broad audit.

## OPTION C — NO MATERIAL VISUAL WORKSTREAM

Use only if current game presentation is genuinely strong enough across the material domains.

Do not use this merely because the known visual families are complete.

---

# 20. Firewalls

Do not:

- generate art
- activate assets
- change gameplay
- change balance
- change save/API semantics
- redesign World
- redesign Research
- redesign Production
- redesign Workforce
- reopen ICON-001
- reopen ICON-002
- reopen ICON-003
- reopen ICON-004
- reopen ICON-005
- reopen WFV-001
- create speculative mechanics
- commit
- push
- tag

This is a bounded evidence-based portfolio review.

---

# 21. Core rule

The question is no longer:

> “Which asset family can we make next?”

The question is:

> “After Buildings, Research, Production, World, and Workforce received substantial production-quality visual treatment, where does Project Genesis still most visibly fail to look and feel like a finished strategy/management game?”

Answer that from current repository and runtime evidence.

Then select exactly one bounded next visual workstream and stop.