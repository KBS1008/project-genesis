# POST-V1 — WBM-001 Final Marker Grounding Repair

## Mode

FINAL BOUNDED VISUAL REPAIR.

This is the last WBM-001 repair unless a genuine blocker appears.

Do NOT reopen:
- marker scale exploration
- World architecture
- ICON-003
- geography
- gameplay
- density architecture
- responsive architecture

No commit.
No push.
No tag.

---

# 1. Current State

WBM-001 functional integration is complete.

Confirmed:

- 23/23 building-type resolution PASS
- ICON-003 compact assets reused
- 34px base marker scale selected
- lower-band distribution implemented
- selection treatment implemented
- narrow capture repaired
- typecheck PASS
- lint PASS, 0 errors
- tests PASS
- build:web PASS

The first human repair materially improved visibility.

However:

> HUMAN VISUAL GATE remains OPEN.

---

# 2. Remaining Visual Defect

The repaired markers are now large enough to see.

The remaining problem is the MARKER FRAME.

Current runtime reads visually as:

> several large white circular UI badges placed over the region

rather than:

> several recognizable industrial facilities inhabiting the region.

The white plate/circle has too much visual weight.

It competes with and partially dominates the actual sealed ICON-003 compact artwork.

This is now the ONLY primary WBM-001 visual defect to solve.

---

# 3. Do Not Change the Successful Parts

Freeze:

- ~34px base visual scale
- existing lower-band layout
- current deterministic density strategy
- 46px interaction target
- current region geometry
- current route geometry
- current camera behavior
- current label hierarchy unless a tiny local adjustment is necessary
- existing ICON-003 compact assets
- 23/23 resolver
- current selection/navigation semantics

Do NOT restart 28/34/40 experiments.

Do NOT redesign the World.

---

# 4. Target Visual Language

The ICON-003 building silhouette must become the dominant visible object.

Desired reading:

    [building art]
       subtle grounding

NOT:

    ( LARGE WHITE UI CIRCLE )
          tiny building

The player should first perceive:

- sawmill
- warehouse
- infrastructure
- administration
- energy facility

as different industrial objects.

The plate exists only to preserve contrast and interaction clarity.

---

# 5. Repair the Plate

Experiment locally with restrained marker grounding.

Preferred direction:

- strongly reduce white fill prominence
- use transparent or dark/translucent grounding
- subtle neutral outline
- restrained shadow
- allow the SVG building silhouette to occupy most of the marker
- preserve contrast against all current biome fills

Possible solutions include:

- translucent dark circular/rounded plate
- very low-opacity neutral backing
- compact soft shadow without a full opaque plate
- restrained halo behind only the silhouette

Do NOT add new authored art.

Do NOT bake backgrounds into ICON-003.

Do NOT modify the compact SVG source files.

This belongs in World marker presentation only.

---

# 6. Building Art Occupancy

At the existing ~34px marker scale, maximize useful ICON-003 occupancy.

The compact should visually use most of the available marker area.

Avoid excessive padding caused by the World wrapper.

Check representative types:

- sawmill
- warehouse
- power_substation
- headquarters
- access_road

Infrastructure grammar may retain its appropriate aspect ratio.

Do not stretch SVGs.

---

# 7. Selected State

Selection must remain obvious after reducing the white plate.

Use the existing selection ring/accent hierarchy.

Selection may use:

- accent outline
- restrained outer glow
- current selected scale
- higher z-order

Do NOT make every unselected marker look selected.

---

# 8. Region Integration

The markers should feel visually anchored to Central Basin.

They should not look like floating web controls.

Use restrained:

- shadow
- grounding
- opacity
- border treatment

No new terrain art.

No building footprints requiring gameplay coordinates.

No roads.

No fake placement semantics.

---

# 9. Count Badge

Review the blue "5" badge after marker-frame repair.

It may remain.

But it must be clearly secondary to the actual building cluster.

If necessary, make a tiny presentation-only adjustment to:

- size
- offset
- visual weight

Do NOT replace individual markers with the count.

---

# 10. Human Blur Test

At World fit:

Ignore labels.

The populated region should read as:

> a region containing several different facilities

rather than:

> a region with several white UI dots.

PASS requires the building silhouettes to dominate the marker cluster.

---

# 11. Required Runtime Evidence

Refresh:

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_DESKTOP.png`

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_DESKTOP_SELECTED.png`

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_DENSE.png`

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_NARROW.png`

Create:

`docs/architecture/reviews/evidence/WBM_001_FINAL_GROUNDING_BEFORE_AFTER.png`

The before side must use the current repaired white-plate candidate.

The after side must show the final grounding treatment at equivalent scale/zoom.

---

# 12. Human Visual Gate

PASS requires all of the following:

- buildings visibly dominate their marker frames
- white circles no longer dominate the cluster
- five-building Central Basin remains readable
- different silhouettes remain perceptible
- region name remains readable
- biome remains readable
- count badge secondary
- selected building obvious
- markers feel anchored to the map
- no toolbar/pin-cluster appearance
- no new authored art
- narrow presentation remains usable

---

# 13. Functional Regression

Retain:

- 23/23 resolution PASS
- generic resolver
- unknown fallback
- selection
- keyboard/focus behavior
- layer toggles
- pan/zoom
- region interaction
- minimap unchanged

Do not change functionality merely for screenshots.

---

# 14. Root Gates

Run:

pnpm typecheck
pnpm lint
pnpm test
pnpm build:web

Required:

- typecheck PASS
- lint PASS / 0 errors
- tests PASS
- build:web PASS

---

# 15. Report

Update:

`docs/architecture/reviews/POST_V1_WBM_001_WORLD_BUILDING_MARKER_INTEGRATION_CLOSE_CANDIDATE.md`

Preserve previous history.

Add:

# Final Marker Grounding Repair

with:

## Remaining Human-Gate Defect
## Plate Experiments
## Final Grounding Treatment
## ICON-003 Occupancy
## Selected State
## Dense Region Validation
## Narrow Validation
## Before / After
## Regression Gates
## Final Human Visual Candidate

Do not rewrite history to claim the previous candidate passed.

---

# 16. Final Decision

Return exactly one:

### OPTION A — WBM-001 FINAL HUMAN-SEAL CANDIDATE READY

Only if the actual building artwork now visually dominates the marker treatment and all gates are green.

### OPTION B — WBM-001 REQUIRES PRODUCT-LEVEL WORLD PRESENTATION DECISION

Only if the remaining problem cannot be solved through marker presentation without reopening World architecture.

No additional iterative cosmetic repair option.

---

# 17. Stop

After producing the evidence and report:

STOP.

Do not begin another World task.
Do not create new art.
Do not continue Scenario-B work.
Do not modify ICON-003.
Do not commit/push/tag.

---

# Core Rule

The scale is now good enough.

Do not make the markers bigger.

Make the BUILDINGS more visible than their UI containers.

The final map should show industrial objects,
not white map pins.