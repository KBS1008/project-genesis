# POST-V1 — WBM-001 World Building Marker Visual Composition Repair

## Mode

BOUNDED VISUAL COMPOSITION REPAIR.

This is NOT a new workstream.
This is NOT a World redesign.
This is NOT an ICON-003 art revision.

Repair the failed WBM-001 HUMAN VISUAL GATE and return one final close candidate.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

No commit.
No push.
No tag.

---

# 1. Authority / Current Gate

WBM-001 is functionally successful but has NOT passed the human visual gate.

Functional implementation already achieved:

- generic `buildingTypeId` → ICON-003 compact resolution
- 23/23 production building resolution
- selection
- fallback
- existing marker distribution
- World layer integration
- desktop runtime
- narrow runtime

Do NOT reimplement these foundations.

Human review result:

> FAIL — ONE BOUNDED VISUAL COMPOSITION REPAIR REQUIRED

Reason:

The building markers technically exist, but they are visually too small and too tightly packed around the region label to materially improve the World fantasy.

The current result still reads too much like:

> graph / administrative map + tiny status icons

instead of:

> strategic world containing recognizable player infrastructure.

---

# 2. Core Diagnosis

Current default building glyph presentation is approximately:

- ~20×20 visible glyph
- 32×32 hit target

This is too small for the current World-map composition.

Observed problems:

1. building identities read as tiny toolbar/status icons;
2. multiple buildings form a cramped icon strip;
3. building icons compete with region title / biome label;
4. count badge adds further visual congestion;
5. selected building gains a ring but insufficient visual prominence;
6. region cards remain visually dominant over the industrial footprint;
7. narrow runtime evidence does not adequately expose the actual map content in the initial viewport.

The assets themselves are NOT rejected.

ICON-003 remains SEALED.

---

# 3. Repair Goal

Achieve this visual hierarchy:

1. WORLD / REGION remains geographic foundation
2. BUILDINGS become clearly recognizable inhabitants of that world
3. LABELS support the visual scene rather than competing with it
4. SELECTION clearly emphasizes one building
5. DENSITY remains readable
6. narrow viewport shows meaningful map content

A player should be able to glance at a populated region and perceive:

> "There are several different industrial facilities here."

without reading the labels first.

---

# 4. Hard Firewalls

Do NOT:

- regenerate ICON-003 art
- edit ICON-003 compact SVGs
- edit ICON-003 primary PNG/WebP assets
- create new building artwork
- reopen Building Visual Identity
- redesign biome art
- redesign route art
- change region topology
- change gameplay coordinates
- change placement semantics
- change building YAML
- change save semantics
- add 3D/world sprites
- introduce Canvas2D/WebGL
- redesign the whole WorldScreen
- modify minimap language
- create a new visual family

This is presentation/composition only.

---

# 5. Do Not Optimize for the Existing 20px Result

The current marker dimensions are NOT authority.

Determine a better bounded size experimentally.

Test at minimum three visible compact scales around:

- ~28px
- ~34px
- ~40px

or equivalent dimensions appropriate to the SVG World coordinate system.

Do not blindly select the largest.

Choose the smallest size that makes distinct ICON-003 silhouettes clearly recognizable at normal World fit.

The selected size must still support multiple buildings per region.

---

# 6. Marker Must Read as a World Object

The building compact should no longer look like a tiny toolbar icon floating above the region.

Explore bounded presentation adjustments using existing assets, for example:

- slightly larger compact
- restrained grounding plate
- subtle world-space shadow
- small anchor/footprint treatment
- better spacing
- controlled overlap
- stronger selected elevation/outline

Do NOT turn it into a UI card.

Do NOT add text inside the marker.

Do NOT add decorative chrome that competes with the building art.

The ICON-003 silhouette must remain the dominant marker content.

---

# 7. Region Composition

The current cluster visually collides with:

- region name
- biome label
- marker count
- other buildings

Repair the composition.

Buildings should occupy a deliberate visual zone within or immediately around the region footprint.

Region title and biome text must remain readable.

Avoid:

- one horizontal toolbar-like icon row
- all buildings piled around the region title
- count badge obscuring individual identities
- marker positions that make the region look like a legend widget

Reuse the existing deterministic positioning foundation where possible.

A small presentation-only spacing adjustment is allowed.

Do NOT alter authoritative geography.

---

# 8. Density Strategy

The evidence save has five buildings in one region.

This is the primary stress case.

Five buildings must remain individually recognizable.

If five full-size markers cannot coexist cleanly at the selected zoom:

implement a bounded deterministic density treatment.

Allowed examples:

- improved radial/distributed placement
- controlled marker spacing
- minor scale adaptation based on local marker count
- restrained overlap hierarchy

Avoid aggregation unless absolutely necessary.

Do NOT immediately replace buildings with a generic "+5" cluster.

The purpose of WBM-001 is to SEE building identities.

The count badge may remain secondary if useful, but it must not replace the actual building visuals.

---

# 9. Selection Treatment

Current selection ring is functionally correct but visually weak.

Selected building should become immediately obvious without hiding neighboring buildings.

Allowed:

- slightly larger selected marker
- stronger but restrained selection ring
- subtle lift/shadow
- higher z-order
- existing accent treatment

Do NOT use giant halos.

Do NOT change navigation semantics.

---

# 10. Zoom Behavior

Verify marker presentation at meaningful existing zoom levels.

At minimum:

- World fit
- approximately 100%
- one zoomed-in state if supported

Markers should not become absurdly large or unreadably small.

If the existing SVG architecture naturally scales them with the map, document the behavior.

Only introduce bounded marker scaling logic if genuinely needed.

Do not redesign the camera.

---

# 11. Labels

Region name and biome label remain useful.

But they must not dominate the building cluster.

Use presentation hierarchy rather than removing information.

Possible bounded changes:

- reposition label within existing region geometry
- reduce collision with marker zone
- adjust spacing
- ensure buildings and labels occupy separate readable layers

Do not remove player-facing region identity.

---

# 12. Narrow Viewport — Mandatory Repair

The previous narrow screenshot does NOT demonstrate a satisfactory World experience.

At ~480×900 the initial visible viewport contains:

- shell
- navigation
- simulation controls
- legend
- map controls
- large empty map area

but little/no meaningful world geography in the captured initial viewport.

Repair or adjust the bounded World presentation so that a narrow user can reach/see meaningful map content without the screen appearing mostly empty.

First determine the actual cause:

- SVG sizing?
- viewport min-height?
- fit-world calculation?
- responsive layout?
- legend consuming canvas space?
- evidence capture scroll position?
- map translated below visible area?

Do NOT guess.

Fix only the actual task-local presentation issue.

If the map is correct but the evidence capture is simply at the wrong scroll position, repair the evidence capture rather than production UI.

If production UI genuinely hides the map on narrow viewport, make the smallest responsive fix required.

---

# 13. Legend

Do not redesign the legend.

However, verify that on narrow layouts it does not unnecessarily prevent the map itself from being visible.

A bounded responsive repositioning is allowed ONLY if evidence proves it is the cause.

Do not begin a generic responsive WorldScreen redesign.

---

# 14. Representative Visual Set

Runtime evidence must still demonstrate at least five building identities.

Use the existing evidence save where possible.

Required stress properties:

- ≥5 buildings in one populated region
- visually distinct compact identities
- one selected building
- at least one infrastructure grammar if available
- normal World fit
- narrow viewport

No gameplay/content manipulation solely for screenshots.

---

# 15. Human Blur Test

Perform a simple diagnostic:

Temporarily evaluate the map without relying on building labels.

Question:

> Can the reviewer perceive multiple distinct industrial objects/facilities?

PASS requires YES.

It is NOT necessary to identify every exact building type from silhouette alone.

But the result must clearly communicate:

- multiple buildings
- different building identities
- industrial footprint

rather than:

- dots
- badges
- toolbar glyphs

---

# 16. Visual Comparison Evidence

Create one before/after comparison using the previous WBM-001 evidence and repaired runtime.

Required:

`docs/architecture/reviews/evidence/WBM_001_REPAIR_BEFORE_AFTER.png`

The comparison must make marker scale/composition differences directly visible.

Do not count this as authored game art.

---

# 17. Required Final Runtime Evidence

Replace/update:

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_DESKTOP.png`

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_DESKTOP_SELECTED.png`

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_DENSE.png`

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_NARROW.png`

Also create:

`docs/architecture/reviews/evidence/WBM_001_REPAIR_BEFORE_AFTER.png`

Optional if useful:

`WBM_001_RUNTIME_ZOOMED.png`

All must come from the actual runtime.

---

# 18. Desktop Human Gate

Desktop PASS requires:

- building silhouettes visibly larger than previous result
- at least five distinct buildings perceivable
- no toolbar-row appearance
- no destructive overlap
- region title readable
- biome identity still readable
- routes/regions remain visually subordinate foundation
- selected building obvious
- map still feels coherent

---

# 19. Narrow Human Gate

Narrow PASS requires:

- meaningful map geography visible in evidence
- building markers actually visible
- controls do not consume the entire useful first map presentation
- no horizontal layout destruction
- marker identities remain readable
- map interaction remains usable

A narrow screenshot containing mostly empty map space is NOT sufficient.

---

# 20. Functional Regression Gates

Retain all WBM-001 functional guarantees:

- generic resolver
- 23/23 current production building coverage
- unknown fallback
- selection
- layer toggle
- region interaction
- pan/zoom
- deterministic marker positioning
- minimap unchanged unless unavoidable
- no new authored assets

Existing focused tests must remain green.

Add tests only where the repair introduces meaningful logic.

Do not create visual-number snapshot brittleness.

---

# 21. Root Lint Repair

Previous WBM-001 candidate reported root lint failure from:

`tools/capture-icon-005-production-runtime-evidence.mjs`

with an unused/global `setTimeout` issue.

This is predecessor tooling debt from the sealed ICON-005 workstream.

Because final project gates are expected green, inspect it.

If the failure is exactly the previously documented trivial tooling lint defect:

repair it semantics-neutrally in the smallest possible way.

Do NOT reopen ICON-005 production behavior.

Record this separately as:

`PREDECESSOR TOOLING GATE REPAIR`

If the lint failure is materially different, stop and report it.

---

# 22. Root Gates

Run:

`pnpm typecheck`

`pnpm lint`

`pnpm test`

`pnpm build:web`

Required final state:

- typecheck PASS
- lint PASS with 0 errors
- tests PASS
- build:web PASS

Do not return OPTION A with a known red root gate.

---

# 23. Scenario-B Accounting

Still:

- 0 new authored concepts
- 0 new ICON-003 assets
- 0 new art-family concepts

This repair changes presentation only.

Do not inflate Scenario-B authored counts.

---

# 24. Report

Update/create:

`docs/architecture/reviews/POST_V1_WBM_001_WORLD_BUILDING_MARKER_INTEGRATION_CLOSE_CANDIDATE.md`

Add a clearly separated section:

# Human Visual Gate Repair

Include:

## Diagnosis
## Marker Scale Experiments
## Chosen Scale
## Region Composition Repair
## Density Validation
## Selection Repair
## Narrow Viewport Diagnosis
## Narrow Viewport Repair
## Before / After
## Functional Regression Check
## Predecessor Tooling Gate Repair
## Root Gates
## Final Human-Gate Candidate

Do not hide the fact that the first visual candidate failed human review.

Preserve review history.

---

# 25. Final Decision

Return exactly one:

### OPTION A — WBM-001 REPAIRED FINAL CLOSE CANDIDATE READY

Only when:

- visual composition materially improved
- buildings visibly read as world objects
- ≥5-building density works
- selection visually works
- desktop runtime PASS
- narrow runtime PASS
- 23/23 functional resolution retained
- root gates all green
- no new authored art
- firewalls honored

### OPTION B — ONE FINAL BOUNDED VISUAL REPAIR REQUIRED

Use if one concrete presentation defect remains.

### OPTION C — CURRENT REGION GEOMETRY CANNOT SUPPORT READABLE BUILDING IDENTITY

Use only if evidence proves that readable building markers require a larger World presentation architecture decision.

### OPTION D — GATE BLOCKED BY UNRELATED REPOSITORY FAILURE

Use only for a genuine unrelated red gate that cannot safely be repaired locally.

---

# 26. Stop Rule

Do NOT continue into:

- Workforce art
- Milestone art
- Transport art
- Market art
- World redesign
- building primary art
- new region art
- placement UX
- Player Guidance

Return one repaired WBM-001 close candidate.

STOP.

---

# Core Rule

The first implementation proved that the plumbing works.

Now make it visually worthwhile.

Do not solve the problem with more art.

Solve:

scale
+ spacing
+ hierarchy
+ density
+ selection
+ narrow presentation.

The player should SEE an industrial footprint,
not a row of tiny UI icons.