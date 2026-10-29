# PROJECT GENESIS — POST-V1 WORLD WEB

# SCENIC BUILDING GROUNDING AND PERSPECTIVE

## 0. MISSION

You are Cursor working in the existing Project Genesis repository:

`D:\Cursor\Project Genesis`

Your assignment is to implement one **small, focused, visually meaningful improvement** to the grounding and perspective presentation of existing buildings on the World Web map.

This task implements the preferred recommendation from the completed:

**Scenic Scale and Perspective Review**

The selected direction is:

`OPTION 2 — LIGHTWEIGHT SCENIC INTEGRATION`

The objective is to make existing buildings appear more naturally connected to the scenic landscape.

The implementation must preserve the current building sizes, region labels, terrain artwork, world coordinates, and gameplay systems.

This is not a building-resizing task.

This is not a world-map redesign.

This is not another general visual-polish pass.

### Primary objectives

1. Improve the visual ground contact of existing building representations.
2. Improve building sprite anchoring where a demonstrable presentation issue exists.
3. Improve consistency between building shadows and terrain lighting.
4. Preserve the current apparent building sizes.
5. Preserve all approved region-label styling.
6. Preserve the current terrain artwork.
7. Preserve existing building data and selection behavior.
8. Produce real, directly comparable before-and-after browser screenshots.
9. Demonstrate a visible improvement or document why the current architecture prevents one.
10. Deliver one bounded implementation handoff.

### Core success condition

**Buildings should appear more convincingly placed on the landscape without becoming larger or smaller.**

If the available architecture or artwork does not support a meaningful improvement within this scope, do not force cosmetic changes.

Report the limitation and stop.

---

# 1. MANDATORY FIRST ACTION

Before any other operation, read the complete implementation guide:

`D:\Cursor\Project Genesis\docs\development\CURSOR_IMPLEMENTATION_GUIDE.md`

Record:

* Exact path.
* SHA-256.
* Read timestamp.
* Applicable implementation requirements.
* Repository preservation requirements.
* Testing requirements.
* Handoff requirements.
* Git and worktree safety rules.

Follow the guide.

If the guide cannot be read, stop and report:

`BLOCKED — IMPLEMENTATION GUIDE UNAVAILABLE`

Do not continue based on assumptions.

---

# 2. AUTHORITATIVE OWNER DECISIONS

The following decisions are binding.

## 2.1 Region labels are approved and frozen

The project owner explicitly approved the current region-label presentation.

Preserve exactly:

* Current font sizes.
* Current font family.
* Current font weight.
* Current light or white text color.
* Current dark outline.
* Current text shadows.
* Current label positions.
* Current zoom behavior.
* Current visibility thresholds.
* Current responsive behavior.

Do not modify region-label components or styles.

Do not propose another label redesign.

The labels are not part of this task.

## 2.2 Building sizes are frozen

The project owner explicitly decided not to change building sizes.

Preserve:

* Current building sprite dimensions.
* Current apparent building size.
* Current building zoom behavior.
* Current building scale limits.
* Current building world coordinates.
* Current building positions.
* Current building hit-test geometry.

Do not:

* Reduce building sizes.
* Increase building sizes.
* Introduce new building-scale multipliers.
* Change sprite width or height.
* Change camera scaling.
* Modify building placement positions.

If a future size adjustment appears useful, record:

`REQUIRES_EXPLICIT_OWNER_APPROVAL`

Do not implement it.

## 2.3 Terrain artwork is frozen

Preserve existing:

* Mountains.
* Forests.
* Individual trees embedded in the terrain.
* Rivers.
* Waterways.
* Roads and paths embedded in the terrain.
* Region artwork.
* Terrain textures.
* World background geometry.

Do not edit or replace terrain images.

Do not introduce new landscape artwork.

## 2.4 Gameplay is frozen

Do not change:

* Building entities.
* Construction rules.
* Economy.
* Production.
* Transport simulation.
* Savegame schemas.
* Backend APIs.
* Region geometry.
* World coordinates.

---

# 3. PROJECT BASELINE

The following increments are administratively closed:

1. Slice 5 — Visual Polish & Game UI.
2. Slice 6 — Scenic World Operations & Logistics Presentation.
3. Scenic Map Visual Enhancement.
4. Scenic Map Visual Composition Upgrade.
5. Scenic Building Integration.
6. Scenic Scale and Perspective Review.

Do not reopen their historical acceptance programs.

The most recent review handoff is:

`project-genesis-post-v1-world-web-scenic-scale-and-perspective-review-handoff.zip`

Previously reviewed SHA-256:

`c88c9523fe34e9e6095e337018e6f8dd5bc22679eabef712e9a39fbd5144f30f`

Locate the handoff if available.

Use its findings as the starting point.

Do not reconstruct previous audit chains.

The current repository state remains the implementation source of truth.

---

# 4. REVIEW FINDINGS TO APPLY

The completed Scenic Scale and Perspective Review identified the following relevant characteristics.

## 4.1 Existing map composition

The World Web currently combines:

* Static scenic terrain artwork.
* Trees embedded in the terrain image.
* Rivers embedded in the terrain image.
* Paths embedded in the terrain image.
* Separate data-driven building representations.
* Separate transport overlays.
* Separate region labels.

## 4.2 Building representation

The review reported that typical building markers have an apparent width of approximately 37 CSS pixels in the examined rendering state.

This is a contextual observation, not a target for resizing.

Do not assume all building types have identical dimensions.

Verify the actual current implementation.

## 4.3 Main visual limitation

The primary visual issue is not necessarily building size.

It is the visual relationship between:

* Building sprites.
* Their visual anchor points.
* Ground-contact shadows.
* Terrain lighting.
* Existing scenic background.

Buildings can appear like interface markers rather than structures standing on the landscape.

## 4.4 Measurement limitations

Individual trees, rivers, and paths are generally embedded in the background artwork.

Their real-world dimensions and authoritative coordinates are not available as independent objects.

Do not invent physical scale measurements.

Do not attempt to resize terrain features.

---

# 5. STRICT IMPLEMENTATION SCOPE

## In scope

* Existing building sprite presentation.
* Existing building visual anchor treatment.
* Ground-contact shadow positioning.
* Shadow direction.
* Shadow softness.
* Shadow opacity.
* Subtle building-to-terrain visual integration.
* Building layer ordering where directly necessary.
* Focused browser verification.
* Focused regression testing.
* Evidence documentation.

## Out of scope

* Building resizing.
* Region-label changes.
* Terrain-image changes.
* New artwork.
* New building types.
* New buildings.
* Fake settlements.
* New roads.
* New terrain systems.
* World-coordinate changes.
* Construction-rule changes.
* New backend APIs.
* Savegame changes.
* Camera architecture changes.
* Minimap architecture changes.
* Complete renderer replacement.
* 3D engine integration.
* Hex-grid conversion.
* Unrelated refactoring.
* Historical audit reconstruction.

Do not expand the task.

---

# 6. PRESERVATION PREFLIGHT

Before editing:

1. Record current Git branch.
2. Record current HEAD.
3. Record Git status.
4. Identify unrelated tracked and untracked WIP.
5. Identify intended implementation files.
6. Record source-file hashes.
7. Record protected-file hashes.
8. Record protected deleted-save absence states.
9. Record region-artwork hashes.
10. Record building-artwork hashes.
11. Record current label-related source hashes.
12. Record current building-scaling source hashes.

## Protected categories

Preserve:

* Personal save files.
* Environment files.
* Deleted saves expected to remain absent.
* Region artwork.
* Building artwork.
* Save backups.
* Unrelated WIP.
* Existing test harnesses.
* Existing diagnostic scripts.
* Historical handoffs.

Known examples include:

`Saves/browser-session.json`

`apps/web/.env.local`

`apps/api/saves/Daniela.json`

`apps/api/saves/Jallah.json`

Verify actual paths and case.

Do not assume this list is exhaustive.

## Special preservation checks

The following must remain unchanged:

`REGION_LABEL_PRESENTATION`

`BUILDING_APPARENT_SCALE`

`BUILDING_WORLD_POSITION`

`TERRAIN_ARTWORK`

`GAMEPLAY_DATA`

If a proposed implementation requires changing any of these, reject that implementation approach.

---

# 7. TARGETED IMPLEMENTATION DISCOVERY

Inspect only the relevant existing renderer and building presentation code.

Identify:

* Building sprite component.
* Building artwork mapping.
* Existing building anchor.
* Existing image bounds.
* Existing shadow implementation.
* Existing building wrapper or SVG group.
* Existing camera transform.
* Existing building scaling rules.
* Existing selection hit targets.
* Existing pointer-event behavior.
* Existing building layer ordering.

Relevant components may include:

`PGWorldCanvas.tsx`

`PGWorldWorkspace.tsx`

`world-components.css`

Verify actual paths.

Do not assume these are the only relevant files.

## Required discovery output

Before implementing, write a concise internal implementation note identifying:

1. The current building visual anchor.
2. The current ground-shadow behavior.
3. The relevant lighting or perspective inconsistency.
4. The smallest safe modification.
5. Why the modification should be visually noticeable.
6. Which protected properties remain unchanged.

Do not begin broad experimentation.

---

# 8. BASELINE BROWSER EVIDENCE

Before editing, capture the current building presentation in the actual running application.

## Required views

Capture:

1. Desktop world overview with buildings.
2. Representative building close-up.
3. Building against forested terrain, if available.
4. Building against open terrain, if available.
5. Building at normal camera zoom.
6. Building at higher camera zoom.

Avoid unnecessary duplicate screenshots.

## Evidence requirements

Record:

* Viewport dimensions.
* Camera position.
* Camera zoom.
* Selected region.
* Building entity or synthetic fixture identity.
* Building type.
* Building artwork.
* Screenshot path.

Use real browser screenshots.

Do not generate mock screenshots.

Do not edit screenshots.

Do not modify personal saves.

## Synthetic fixtures

If the current isolated test state contains no buildings:

* Use an existing safe synthetic fixture mechanism.
* Identify the fixture explicitly.
* Preserve actual application rendering behavior.
* Clean up after testing.

Do not fabricate screenshots.

If building visuals cannot be captured, document:

`BUILDING_VISUAL_BASELINE_NOT_AVAILABLE`

Do not claim visual verification.

---

# 9. FEATURE 1 — BUILDING GROUND CONTACT

## Objective

Make the building appear physically connected to the landscape.

## Requirements

Inspect the current contact point between the building sprite and the terrain.

Determine whether the existing presentation creates:

* A floating appearance.
* An incorrectly positioned shadow.
* A disconnected base.
* Excessive separation between building and terrain.
* A shadow that does not correspond to the sprite footprint.

## Preferred improvement

Where justified, implement a restrained ground-contact treatment.

Possible techniques include:

* A compact contact shadow.
* A more accurately positioned shadow.
* A shadow shape that better matches the visible building footprint.
* Improved shadow opacity.
* Improved shadow softness.
* Better shadow alignment with the visual anchor.

Use the smallest effective technique.

## Restrictions

Do not:

* Move the building world position.
* Change the building's apparent size.
* Change the building's image dimensions.
* Add a large decorative platform.
* Add fake foundations.
* Modify terrain pixels.
* Introduce new geometry that implies a gameplay footprint.
* Change building selection bounds.

## Acceptance

The building should appear more convincingly grounded without altering its size or gameplay position.

---

# 10. FEATURE 2 — VISUAL ANCHOR ALIGNMENT

## Objective

Ensure that the visual bottom or contact point of the building artwork aligns with the intended map presentation anchor.

## Critical distinction

A visual sprite anchor is not necessarily the same as:

* A building world coordinate.
* A construction coordinate.
* A selection coordinate.
* A simulation position.

Do not change authoritative coordinates.

## Requirements

Inspect:

* Existing image anchor conventions.
* Existing sprite offsets.
* Existing artwork transparency.
* Existing visual footprint.
* Existing shadow placement.
* Existing selection hit target.

If the current artwork has transparent padding or an inconsistent visual baseline, determine whether a **presentation-only** adjustment is appropriate.

## Allowed adjustments

Only where safe:

* Adjust a purely decorative shadow offset.
* Adjust a presentation-only visual wrapper.
* Adjust noninteractive decorative alignment.

## Forbidden adjustments

Do not:

* Change building world coordinates.
* Change construction placement.
* Change persisted positions.
* Change selection hit geometry.
* Change camera transforms.
* Change building scale.
* Introduce type-specific offsets without evidence.

## Acceptance

Any adjustment must preserve the existing interaction position while improving visual grounding.

---

# 11. FEATURE 3 — LIGHTING AND SHADOW CONSISTENCY

## Objective

Improve consistency between building presentation and the scenic background.

## Requirements

Inspect the existing terrain artwork for its apparent lighting direction.

Compare it with:

* Building sprite highlights.
* Existing building shadows.
* Existing contact shadows.
* Existing selection effects.

Determine whether the current shadow direction appears contradictory.

## Implementation

Where justified:

* Use a consistent shadow direction.
* Use restrained opacity.
* Use soft edges.
* Avoid excessive blur.
* Preserve building silhouette readability.

## Important limitation

The terrain is a static illustration.

Its lighting may not be perfectly uniform across all regions.

Do not invent a physically accurate lighting model.

Aim for a visually coherent compromise.

## Restrictions

Do not:

* Add dynamic lighting.
* Add time-of-day lighting.
* Modify terrain artwork.
* Replace building assets.
* Introduce a new rendering engine.
* Add expensive filters to every map element.

---

# 12. FEATURE 4 — BUILDING-TO-TERRAIN VISUAL HIERARCHY

## Objective

Reduce the impression that buildings are disconnected UI markers.

## Requirements

Where appropriate:

* Improve separation between sprite and terrain.
* Avoid excessive outlines.
* Avoid heavy glow.
* Keep buildings recognizable.
* Preserve existing asset identity.
* Maintain selection visibility.
* Preserve transport overlay readability.

## Important

Do not add unrelated scenic decorations.

Do not create fake roads.

Do not add decorative trees.

Do not add fake settlements.

Do not alter the background image.

The improvement must come from the presentation of existing building entities.

---

# 13. BUILDING SIZE — STRICT FREEZE

This requirement overrides all aesthetic preferences.

## Must remain unchanged

* Building sprite width.
* Building sprite height.
* Existing zoom-dependent scale.
* Existing scale limits.
* Existing world position.
* Existing image aspect ratio.

## Verification

Record representative building dimensions before and after implementation.

Use the same:

* Building entity.
* Building type.
* Viewport.
* Camera zoom.

Compare apparent rendered bounds.

If the implementation changes apparent building size, revert that part of the implementation.

Do not claim that a shadow-only change justifies changing sprite size.

---

# 14. REGION LABELS — STRICT FREEZE

Do not modify:

* Region-label font size.
* Region-label fill.
* Region-label stroke.
* Region-label outline.
* Region-label shadows.
* Region-label scaling.
* Region-label visibility thresholds.
* Region-label anchors.
* Region-label responsive behavior.

## Verification

Record relevant source-file hashes or focused source diffs.

If a shared CSS selector unintentionally changes region labels, correct the regression.

Do not redesign labels.

The project owner has approved their current appearance.

---

# 15. CAMERA, MINIMAP, AND CONSTRUCTION PRESERVATION

Verify that:

* Camera pan remains functional.
* Camera zoom remains functional.
* Building visuals remain aligned.
* Minimap remains aligned.
* Region selection remains functional.
* Building selection remains functional.
* Construction previews remain functional.
* Construction cancellation remains functional.
* Construction confirmation remains unchanged.
* Existing layer toggles remain functional.
* Inspector synchronization remains functional.

Do not alter these systems.

Run only focused regression checks relevant to modified building presentation.

---

# 16. PERFORMANCE REQUIREMENTS

The implementation must remain lightweight.

Avoid:

* Large SVG blur filters.
* Expensive per-frame calculations.
* New animation loops.
* New rendering dependencies.
* Large duplicated DOM trees.
* Complex dynamic lighting.
* High-frequency layout measurements.
* Heavy image-processing pipelines.

Prefer existing CSS or SVG capabilities.

If a proposed shadow treatment introduces visible rendering cost, simplify it.

Do not sacrifice performance for a minor visual effect.

---

# 17. MANDATORY VISUAL IMPROVEMENT GATE

This task must not repeat the pattern of earlier visual increments where technical changes produced almost imperceptible screenshot differences.

## 17.1 Compare identical scenes

After implementation, capture the same building scenes as the baseline.

Use identical:

* Viewport.
* Camera position.
* Camera zoom.
* Selected region.
* Building entity.
* Layer state.
* Fixture data.

## 17.2 Evaluate the building area

Do not rely only on whole-screen pixel-difference statistics.

The building occupies a relatively small portion of the map.

Evaluate the relevant building area directly.

For each representative building, compare:

* Sprite silhouette.
* Contact point.
* Shadow position.
* Shadow softness.
* Shadow direction.
* Terrain integration.
* Apparent sprite size.

## 17.3 Evidence threshold

A change is meaningful only if a reviewer can identify a specific improvement in the building-to-ground relationship.

A tiny numerical pixel difference is not sufficient.

A large numerical pixel difference is also not sufficient by itself.

Provide a qualitative explanation tied to actual visible changes.

## 17.4 No forced implementation

If the available architecture or artwork does not permit a meaningful improvement without changing protected properties:

1. Do not force a cosmetic change.
2. Do not add arbitrary shadows.
3. Do not modify building size.
4. Do not modify terrain artwork.
5. Document the limitation.
6. Recommend a separately approved future approach.

Use:

`NO_MEANINGFUL_SAFE_VISUAL_CHANGE_AVAILABLE`

where appropriate.

---

# 18. STOP RULE — AVOID ANOTHER POLISH LOOP

This task has a strict bounded implementation policy.

## Maximum approach

1. Inspect the current implementation.
2. Select one focused grounding approach.
3. Implement it.
4. Capture the after screenshots.
5. Evaluate the visual result.
6. Apply at most one small directly related correction if necessary.
7. Finalize the handoff.

Do not perform repeated styling experiments.

Do not create multiple visual variants.

Do not conduct a broad art-direction redesign.

## If the first approach fails

If the selected approach produces no meaningful improvement:

* Revert the ineffective change.
* Document why it failed.
* Do not continue experimenting with unrelated CSS values.
* Finish with a limitation verdict.

A well-supported decision not to modify the renderer is preferable to an ineffective visual change.

---

# 19. ACCEPTANCE CRITERIA

Use the following criteria.

## SGP-AC-001 — Approved labels preserved

Region-label appearance and behavior remain unchanged.

## SGP-AC-002 — Building scale preserved

Building apparent size and zoom scaling remain unchanged.

## SGP-AC-003 — World positions preserved

Building world positions and relevant selection geometry remain unchanged.

## SGP-AC-004 — Terrain preserved

Existing landscape artwork remains unchanged.

## SGP-AC-005 — Ground-contact improvement

A meaningful improvement in building-to-terrain grounding is demonstrated.

## SGP-AC-006 — Perspective compatibility

The implemented treatment does not introduce new perspective inconsistencies.

## SGP-AC-007 — Lighting consistency

Building shadow treatment is visually compatible with the terrain.

## SGP-AC-008 — Interaction preservation

Building selection and construction behavior remain functional.

## SGP-AC-009 — Camera and minimap preservation

Camera pan, zoom, and minimap behavior remain functional.

## SGP-AC-010 — Responsive usability

Desktop and mobile presentation remain usable.

## SGP-AC-011 — Visual evidence

Real before-and-after screenshots demonstrate the result.

## SGP-AC-012 — Preservation

Protected files, artwork, and gameplay data remain unchanged.

### Allowed statuses

* `PASS`
* `FAIL`
* `NOT_VERIFIED`
* `NOT_APPLICABLE`

Do not invent additional status values.

Do not mark SGP-AC-005 PASS merely because a CSS shadow value changed.

---

# 20. FOCUSED TESTING

Run only relevant checks.

## Static checks

Where applicable:

* TypeScript.
* Lint.
* Build.

Use existing project commands.

## Browser checks

Verify:

1. World map loads.
2. Existing building artwork renders.
3. Building size remains unchanged.
4. Building position remains unchanged.
5. Building selection works.
6. Region selection works.
7. Camera pan works.
8. Camera zoom works.
9. Minimap remains aligned.
10. Construction previews remain usable.
11. Construction cancellation remains functional.
12. Layer controls remain functional.
13. Inspector remains usable.
14. Region labels remain unchanged.
15. Desktop presentation remains usable.
16. Mobile presentation remains usable.

## Test-data safety

Use isolated synthetic fixtures where necessary.

Do not modify personal saves.

Clean up temporary test state.

## Failure handling

If a directly related regression occurs:

1. Identify the cause.
2. Apply the smallest safe fix.
3. Rerun the affected check.
4. Document the result.

Do not expand into unrelated work.

---

# 21. POSTFLIGHT PRESERVATION

After implementation:

1. Record branch.
2. Record HEAD.
3. Record Git status.
4. Compare protected-file hashes.
5. Compare protected deleted-save absence states.
6. Compare artwork hashes.
7. Compare label-related source hashes or focused diffs.
8. Compare building-size behavior.
9. Compare building world-position behavior.
10. Identify intended changes.
11. Identify unrelated WIP.
12. Verify temporary fixture cleanup.

## Required preservation statements

Report:

`REGION_LABELS_UNCHANGED`

`BUILDING_SCALE_UNCHANGED`

`BUILDING_WORLD_POSITIONS_UNCHANGED`

`TERRAIN_ARTWORK_UNCHANGED`

`BUILDING_ARTWORK_UNCHANGED`

`GAMEPLAY_DATA_UNCHANGED`

Use these statements only when supported by actual checks.

---

# 22. REQUIRED HANDOFF DOCUMENTS

Create one final handoff containing:

## 22.1 `FINAL_REPORT.md`

Include:

* Executive summary.
* Implementation decision.
* Actual changes.
* Visual improvement assessment.
* Before-and-after evidence.
* Functional checks.
* Preservation results.
* Known limitations.
* Final verdict.

## 22.2 `BUILDING_GROUNDING_IMPLEMENTATION.md`

Explain:

* Existing rendering behavior.
* Identified visual issue.
* Selected approach.
* Exact implementation.
* Why the approach was chosen.
* Relevant source files.

## 22.3 `BUILDING_GROUNDING_VISUAL_COMPARISON.md`

Include:

* Before screenshot references.
* After screenshot references.
* Identical camera and viewport conditions.
* Building-area observations.
* Visible improvements.
* Limitations.

## 22.4 `BUILDING_GROUNDING_ACCEPTANCE_MATRIX.json`

Include SGP-AC-001 through SGP-AC-012.

For each criterion record:

* Status.
* Evidence.
* Relevant source files.
* Limitations.

## 22.5 `BUILDING_GROUNDING_TEST_RESULTS.md`

Include:

* Commands.
* Exit codes.
* Browser checks.
* Screenshots.
* Relevant errors.
* Limitations.

## 22.6 `BUILDING_GROUNDING_CHANGED_FILES.json`

Record:

* Exact changed paths.
* Purpose.
* Preflight SHA-256.
* Postflight SHA-256.
* Relevant acceptance criteria.
* Existing WIP considerations.

## 22.7 `BUILDING_GROUNDING_PRESERVATION.json`

Include:

* Preflight state.
* Postflight state.
* Protected hashes.
* Artwork hashes.
* Deleted-save absence states.
* Label preservation.
* Building-scale preservation.
* Building-position preservation.
* Unexpected changes.
* Preservation verdict.

## 22.8 `BUILDING_GROUNDING_KNOWN_LIMITATIONS.md`

Record only material limitations.

## 22.9 `BUILDING_GROUNDING_HANDOVER.md`

Explain:

* Current building presentation.
* Implemented grounding treatment.
* Relevant source locations.
* Frozen owner decisions.
* Remaining visual opportunities.
* Preservation constraints.

## 22.10 `BUILDING_GROUNDING_SOURCE_REFERENCES.json`

Include relevant source documents and hashes.

## 22.11 `handoff-manifest.json`

Include SHA-256 and size for every packaged file except the manifest itself.

## 22.12 Browser evidence

Include real before-and-after screenshots.

If implementation was safely abandoned, include the baseline evidence and explain why no after-change screenshots exist.

Do not include personal saves or environment secrets.

---

# 23. FINAL HANDOFF ZIP

Create exactly one archive:

`project-genesis-post-v1-world-web-scenic-building-grounding-and-perspective-handoff.zip`

Target location:

`D:\Cursor\Project Genesis\docs\architecture\reviews\project-genesis-post-v1-world-web-scenic-building-grounding-and-perspective-handoff.zip`

Do not overwrite historical handoffs.

Do not create additional archives.

---

# 24. ZIP INTEGRITY

After creating the archive:

1. Reopen it.
2. Verify all CRC values.
3. Verify every manifest-listed SHA-256.
4. Verify every manifest-listed file size.
5. Check for missing files.
6. Check for unexpected files.
7. Check for duplicate entries.
8. Check for absolute paths.
9. Check for path traversal.
10. Calculate the complete ZIP SHA-256.

Do not claim integrity PASS unless every check succeeds.

---

# 25. FINAL VERDICT

Assign exactly one verdict.

## OPTION A — IMPLEMENTED AND VERIFIED

Use only if:

* A meaningful visual grounding improvement is implemented.
* Before-and-after evidence demonstrates the improvement.
* Building sizes remain unchanged.
* Region labels remain unchanged.
* Relevant regression checks pass.
* No confirmed preservation breach exists.

## OPTION B — IMPLEMENTED WITH DOCUMENTED LIMITATIONS

Use if:

* A meaningful improvement is implemented.
* Some noncritical evidence or presentation limitations remain.
* Protected owner decisions are preserved.
* No confirmed critical preservation breach exists.

## OPTION C — NO MEANINGFUL SAFE CHANGE AVAILABLE

Use if:

* The current architecture or artwork prevents a meaningful improvement within the approved scope.
* Ineffective experimental changes have been reverted.
* No protected properties were altered.
* A concrete limitation and future option are documented.

This is an acceptable outcome.

Do not force an implementation.

## OPTION D — BLOCKED

Use if:

* A critical dependency or preservation conflict prevents safe work.

## OPTION E — NOT IMPLEMENTED

Use if:

* The task could not begin.

Do not force OPTION A.

Do not claim a meaningful improvement based solely on changed shadow values.

---

# 26. FINAL CURSOR RESPONSE

Your final response must include:

## A. Implementation result

Explain what changed or why no safe change was made.

## B. Building grounding

Describe the visible ground-contact result.

## C. Perspective and lighting

Explain the visual compatibility assessment.

## D. Before-and-after evidence

List actual screenshot pairs.

## E. Building scale

Confirm whether apparent size remained unchanged.

## F. Region labels

Confirm whether the approved styling remained unchanged.

## G. Functional preservation

Summarize focused regression checks.

## H. Protected data

Summarize preservation evidence.

## I. Changed files

List actual changes.

## J. Final verdict

Provide OPTION A/B/C/D/E.

## K. Final ZIP

Provide:

* Exact ZIP path.
* SHA-256.
* Entry count.
* Manifest validation.
* CRC validation.

---

# 27. FINAL NON-NEGOTIABLE INSTRUCTIONS

Implement only a meaningful, focused building-grounding improvement.

Preserve region labels exactly.

Preserve building sizes exactly.

Preserve building zoom behavior.

Preserve building world positions.

Preserve building selection geometry.

Preserve terrain artwork.

Preserve building artwork.

Preserve gameplay mechanics.

Preserve API contracts.

Preserve savegame schemas.

Preserve personal saves and environment files.

Do not invent buildings.

Do not invent roads.

Do not add fake foundations.

Do not introduce a 3D engine.

Do not rebuild the renderer.

Do not reopen historical audits.

Do not perform repeated visual-polish experiments.

Capture real browser screenshots.

Compare identical scenes.

Evaluate building areas rather than relying only on whole-screen pixel differences.

Report limitations honestly.

Produce one complete handoff.

**The goal is not to change the scale of the world. The goal is to make existing buildings feel more convincingly connected to the landscape while preserving every visual decision already approved by the project owner.**