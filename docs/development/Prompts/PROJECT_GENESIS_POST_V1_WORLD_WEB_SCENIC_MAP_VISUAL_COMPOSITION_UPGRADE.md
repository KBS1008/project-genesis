# PROJECT GENESIS — POST-V1 WORLD WEB

# SCENIC MAP VISUAL COMPOSITION UPGRADE

## 0. MISSION

You are Cursor working in the existing Project Genesis repository:

`D:\Cursor\Project Genesis`

Your assignment is to implement a meaningful visual-composition upgrade of the existing Project Genesis World Web map.

The project owner has reviewed the previous Scenic Map Visual Enhancement screenshots and identified a specific recurring problem:

**Region labels are much too large and visually dominate the world map.**

This problem must be addressed as a primary implementation requirement.

The broader objective is to make the world map feel more like a coherent strategy-game environment in which:

* Landscapes form the visual foundation.
* Buildings are clearly visible and naturally integrated.
* Transport connections are visually understandable.
* Region names support navigation without dominating the scenery.
* The world map receives visual priority over decorative interface elements.

The previous scenic enhancement improved shadows and colors but did not sufficiently change the actual map composition.

**This task must produce a clearly visible improvement in map composition, not another minor CSS polish pass.**

### Primary objectives

1. Significantly reduce oversized region labels.
2. Implement sensible region-label behavior across zoom levels.
3. Prevent region labels from obscuring important map content.
4. Improve the visibility and visual integration of existing buildings.
5. Improve the composition of existing transport connections.
6. Improve the use of available world-map space.
7. Establish a clearer visual hierarchy between terrain, buildings, routes, labels, and overlays.
8. Preserve existing gameplay and map geometry.
9. Capture comparable before-and-after browser screenshots.
10. Deliver one focused implementation handoff.

### Project-owner visual direction

The project owner selected:

`OPTION B — LONG-TERM VISUAL CONVERGENCE`

The desired direction is a warm, dimensional, visually rich strategy-world presentation inspired by a supplied reference image.

This task represents one bounded implementation step toward that goal.

It does not authorize a complete 3D or hex-grid conversion.

---

# 1. MANDATORY FIRST ACTION

Before any other operation, read the complete implementation guide:

`D:\Cursor\Project Genesis\docs\development\CURSOR_IMPLEMENTATION_GUIDE.md`

Record:

* Exact path.
* SHA-256.
* Read timestamp.
* Relevant implementation requirements.
* Repository preservation requirements.
* Testing requirements.
* Handoff requirements.
* Git and worktree safety rules.

Follow the guide.

If the guide cannot be read, stop and report:

`BLOCKED — IMPLEMENTATION GUIDE UNAVAILABLE`

Do not continue based on assumptions.

---

# 2. PROJECT BASELINE

The following development increments are administratively closed:

## Slice 5 — Visual Polish & Game UI

Status:

`CLOSED WITH DOCUMENTED EVIDENCE LIMITATIONS`

Independent verdict:

`OPTION B`

## Slice 6 — Scenic World Operations & Logistics Presentation

Status:

`CLOSED WITH DOCUMENTED LIMITATIONS`

Independent verdict:

`OPTION B`

## Scenic Map Visual Enhancement

Status:

`CLOSED WITH DOCUMENTED LIMITATIONS`

Independent verdict:

`OPTION B`

The previous scenic enhancement introduced limited CSS/SVG visual improvements.

Its implementation handoff is:

`project-genesis-post-v1-world-web-scenic-map-visual-enhancement-handoff.zip`

Previously reviewed SHA-256:

`5827ba17bcf4343d2badb0ece1f11ab6f132703eeaad0ed612788b71e9119569`

Use the existing implementation as the baseline.

Do not reopen historical acceptance or preservation investigations.

Do not repeat previous full audit programs.

---

# 3. VISUAL REFERENCE

The project owner supplied a reference image showing a visually rich strategy-game world.

Its relevant characteristics include:

* Warm natural colors.
* Dimensional terrain.
* Buildings integrated into the landscape.
* Roads and transport connections.
* Strong spatial hierarchy.
* A coherent inhabited-world atmosphere.
* Readable interface panels.
* Landscape scenery that remains visually dominant.

The reference image is an art-direction reference.

Do not copy its artwork, assets, map geometry, or interface.

## 3.1 Reference image availability

Check whether the project-owner reference image is available in Cursor's working context.

Do not invent a repository path.

If available:

1. Inspect the image.
2. Identify its relevant visual-composition principles.
3. Record how those principles can be transferred to Project Genesis.
4. Use it during implementation and visual evaluation.

If unavailable:

1. Record `REFERENCE_IMAGE_NOT_AVAILABLE`.
2. Continue using the written requirements in this prompt.
3. Do not claim direct visual matching.
4. Do not fabricate or substitute an unrelated reference image.

## 3.2 Important distinction

The previous enhancement mainly changed shadows and colors.

This task must change the actual visual hierarchy and composition of the map.

The most important change is the treatment of region labels.

---

# 4. STRICT IMPLEMENTATION SCOPE

## In scope

* Region-label sizing.
* Region-label positioning.
* Zoom-dependent label behavior.
* Region-label collision and overlap handling.
* Map visual hierarchy.
* Existing building-marker presentation.
* Existing transport-connection presentation.
* Relevant map layout and spacing.
* Focused responsive improvements.
* Focused accessibility preservation.
* Before-and-after browser evidence.

## Out of scope

* New gameplay mechanics.
* New economy rules.
* New transport rules.
* New backend APIs.
* Savegame schema changes.
* New world coordinates.
* New region geometry.
* Hex-grid conversion.
* 3D engine integration.
* Replacement of protected artwork.
* New construction mechanics.
* New camera architecture.
* Complete UI redesign.
* Unrelated application refactoring.
* Historical audit reconstruction.

Do not expand the task merely because the reference image contains additional features.

---

# 5. PRESERVATION PREFLIGHT

Before editing:

1. Record current branch.
2. Record current HEAD.
3. Record Git status.
4. Identify unrelated tracked and untracked WIP.
5. Identify intended implementation files.
6. Record relevant source-file hashes.
7. Record protected-file hashes.
8. Record protected deleted-save absence states.
9. Record the existing artwork inventory.
10. Record the current map composition.

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

Known protected examples include:

`Saves/browser-session.json`

`apps/web/.env.local`

`apps/api/saves/Daniela.json`

`apps/api/saves/Jallah.json`

Verify actual paths and case.

Do not assume this list is exhaustive.

## Artwork preservation

Do not overwrite, delete, rename, or replace existing region or building artwork.

Prefer existing rendering components, CSS, SVG, and design tokens.

Do not download external artwork.

Do not introduce new image dependencies.

---

# 6. BASELINE SCREENSHOTS — BEFORE IMPLEMENTATION

Before modifying the visual implementation, capture the current World Web.

Use the actual running application.

Capture representative views including:

1. Full world overview.
2. Region Focus.
3. A region with visible buildings.
4. Transport-layer view.
5. Desktop viewport.
6. Mobile viewport.

Where possible, include:

* A view demonstrating oversized region labels.
* A view showing labels near buildings.
* A view showing labels near transport connections.
* A view at a lower zoom level.
* A view at a higher zoom level.

Record:

* Viewport dimensions.
* Camera position.
* Camera zoom.
* Selected region.
* Visible layers.
* Fixture data.
* Screenshot path.

Use synthetic fixtures where necessary.

Do not modify personal saves.

These screenshots form the baseline for evaluating actual improvement.

---

# 7. PRIORITY 1 — REGION LABEL REDESIGN

## Objective

Make region labels significantly smaller, more balanced, and less intrusive.

**This is the highest-priority requirement in the entire task.**

The current oversized region names must no longer dominate the map.

## 7.1 Inspect existing implementation

Identify:

* The component responsible for region labels.
* Current font-size rules.
* Current scaling behavior.
* Current label anchors.
* Current zoom transformations.
* Current text wrapping.
* Current text shadows and outlines.
* Current responsive behavior.
* Current selection behavior.

Do not blindly override CSS.

Determine why the labels become excessively large.

Fix the actual sizing or scaling behavior.

## 7.2 Required visual result

Region labels must:

* Be substantially smaller than in the previous screenshots.
* Remain legible.
* Support navigation.
* Avoid dominating the landscape.
* Avoid covering important buildings.
* Avoid covering essential transport information.
* Remain visually subordinate to the world scenery.
* Maintain a consistent typographic hierarchy.

## 7.3 Label hierarchy

Use a clear distinction between:

### Normal region labels

Small, restrained, readable.

### Selected region label

May receive a modest emphasis.

Must not become oversized.

### Focused region label

May receive a modest emphasis.

Must not obscure the region itself.

### Low-zoom overview labels

Must remain readable without becoming enormous.

### High-zoom labels

Must not grow uncontrollably with camera zoom.

## 7.4 Zoom-dependent sizing

Implement sensible zoom-dependent label behavior.

The preferred outcome is that labels maintain a reasonable apparent screen size across supported zoom levels.

Avoid unrestricted scaling with the world transform.

If the existing architecture supports screen-space sizing, use it where practical.

Otherwise, use a bounded inverse-scale or equivalent technique.

The implementation must remain compatible with the existing camera.

Do not introduce a second camera system.

## 7.5 Suggested initial sizing targets

Treat these as visual design targets, not rigid requirements that override the actual rendering architecture:

* Normal desktop region labels: approximately 12–16 CSS pixels in apparent screen size.
* Selected region labels: approximately 14–18 CSS pixels.
* Mobile region labels: approximately 10–14 CSS pixels.

Use the current design system and actual browser screenshots to refine these values.

Do not blindly apply these numbers to SVG world units.

The final apparent screen size is what matters.

## 7.6 Long region names

Handle long names gracefully.

Possible approaches include:

* Controlled wrapping.
* Smaller type within a defined range.
* Compact label containers.
* Conditional abbreviation where an existing approved short name is available.

Do not invent new region names.

Do not truncate names in a way that makes regions ambiguous.

## 7.7 Label backgrounds

Avoid large opaque boxes.

Prefer restrained treatments such as:

* Subtle text contrast.
* Compact background chips.
* Soft outlines.
* Minimal shadows.

The labels should feel integrated into the world.

## 7.8 Acceptance

The previous oversized-label problem must be visibly corrected.

A reviewer should immediately recognize that the landscape now has greater visual priority than the text.

---

# 8. PRIORITY 2 — LABEL PLACEMENT AND OVERLAP

## Objective

Prevent labels from unnecessarily covering important map content.

## Requirements

Where feasible within the existing architecture:

* Keep labels inside or near their associated regions.
* Avoid important building markers.
* Avoid transport endpoints.
* Avoid important selection indicators.
* Avoid essential map controls.
* Avoid excessive overlap between neighboring labels.
* Preserve region identification.

## Implementation approach

Use the smallest compatible solution.

Possible techniques:

* Adjust existing label anchors.
* Apply bounded screen-space offsets.
* Use compact labels.
* Reduce label visibility at crowded zoom levels.
* Use existing collision or layout utilities if available.

Do not introduce a large label-placement engine.

Do not change region coordinates.

Do not change region hit-test geometry.

## Low-zoom behavior

If multiple labels overlap heavily at low zoom:

* Prefer smaller labels.
* Reduce secondary label prominence.
* Hide nonessential labels where necessary.
* Keep selected-region identification available.

Do not allow labels to obscure the entire map.

## Selection compatibility

Region selection must continue to work.

Labels must not create unexpected click interception.

If labels are decorative, preserve or implement appropriate pointer-event behavior.

---

# 9. PRIORITY 3 — BUILDING VISIBILITY AND INTEGRATION

## Objective

Make existing buildings more recognizable as part of the world.

The previous screenshots showed relatively few visually prominent buildings.

This task should improve the presentation of buildings that actually exist in the current game state.

## 9.1 Existing data only

Use existing building data.

Do not invent buildings.

Do not add decorative buildings that resemble functional entities.

Do not change building coordinates.

Do not change building placement rules.

## 9.2 Visual integration

Improve where feasible:

* Building-marker readability.
* Visual grounding.
* Relative scale.
* Terrain contrast.
* Layer ordering.
* Separation from region labels.
* Visibility during camera zoom.

## 9.3 Existing artwork

Reuse protected building artwork.

Do not replace it.

If the existing renderer uses simplified building markers rather than full artwork, inspect whether the existing assets can be reused safely.

Do not introduce a new asset pipeline.

## 9.4 Visual hierarchy

Buildings should be visually distinguishable from:

* Region labels.
* Transport routes.
* Selection outlines.
* Construction previews.
* Decorative map elements.

## 9.5 Construction compatibility

Preserve:

* Building placement.
* Building selection.
* Placement previews.
* Construction cancellation.
* Construction confirmation.
* Persistence behavior.

Do not modify construction semantics.

---

# 10. PRIORITY 4 — TRANSPORT COMPOSITION

## Objective

Make existing transport connections easier to understand within the world composition.

## Requirements

Preserve:

* Actual transport data.
* Existing route endpoints.
* Existing route visibility controls.
* Existing direction indicators.
* Existing map coordinates.
* Existing transport semantics.

## Visual improvements

Where practical:

* Improve route layering.
* Reduce conflicts with region labels.
* Keep endpoint markers visible.
* Maintain readable direction indicators.
* Improve contrast against terrain.
* Use restrained, natural colors.

## Important limitation

Transport connections are not necessarily physical roads.

Do not fabricate a road network.

Do not invent intermediate route geometry.

Do not add fake vehicles.

Do not modify transport simulation.

## Browser evidence

If active transport data is available in the isolated test environment, capture at least one screenshot with a visible transport connection.

If no active transport exists:

* Use a safe synthetic fixture if supported.
* Otherwise document the limitation.
* Do not fabricate a successful route screenshot.

---

# 11. PRIORITY 5 — WORLD MAP SPACE AND COMPOSITION

## Objective

Make better use of the available World Web area.

The landscape should feel like the primary visual element.

## Requirements

Inspect:

* Map viewport sizing.
* Existing workspace padding.
* Inspector overlap.
* Legend placement.
* Layer-control placement.
* Empty surrounding space.
* Camera fit behavior.

Improve only where necessary.

## Desired result

* The world map is visually prominent.
* Important terrain remains visible.
* Region labels do not dominate.
* Buildings are easier to recognize.
* Operational information remains accessible.
* UI panels do not unnecessarily obscure the world.

## Restrictions

Do not:

* Rebuild the workspace layout.
* Change camera architecture.
* Change world bounds.
* Introduce new navigation systems.
* Move major application navigation.
* Break responsive layouts.

Prefer small, focused composition improvements.

---

# 12. MAP RENDERING ORDER

Review the existing rendering order.

The intended visual hierarchy is:

1. Landscape foundation.
2. Region-specific scenic treatment.
3. Existing buildings and world objects.
4. Operational transport connections and markers, with ordering adjusted where necessary for clarity.
5. Region labels.
6. Selection and focus indicators.
7. Interactive UI controls.

This is a conceptual hierarchy.

The exact technical rendering order may differ where interaction or readability requires it.

Do not reorder elements blindly.

Verify that:

* Buildings remain visible.
* Routes remain readable.
* Labels do not obscure critical elements.
* Selection indicators remain clear.
* Pointer interactions still work.

---

# 13. ACCESSIBILITY AND RESPONSIVENESS

Preserve existing accessibility behavior.

## Required checks

* Region labels remain readable.
* Selected regions remain identifiable.
* Keyboard focus remains visible.
* Operational layer controls remain keyboard accessible.
* Inspector remains usable.
* Mobile labels do not become oversized.
* Mobile controls remain reachable.
* Text does not overlap essential controls.
* Camera zoom does not cause uncontrolled label scaling.

## Reduced motion

Do not introduce significant new animations.

If small transitions are added, respect reduced-motion preferences.

---

# 14. VISUAL QUALITY GATES

The implementation must satisfy the following visual gates.

## VC-001 — Region label scale

Region labels are substantially smaller than in the baseline screenshots.

## VC-002 — Zoom stability

Region labels remain reasonably sized across supported zoom levels.

## VC-003 — Label overlap

Region labels do not unnecessarily obscure important buildings, transport endpoints, or controls.

## VC-004 — Landscape priority

The landscape is visually more prominent than the region labels.

## VC-005 — Building integration

Existing buildings remain recognizable and visually integrated.

## VC-006 — Transport readability

Existing transport connections remain readable and accurately represented.

## VC-007 — World composition

The map uses available space effectively without breaking navigation.

## VC-008 — Functional preservation

Camera, minimap, selection, construction, layers, and inspector remain functional.

## VC-009 — Responsive behavior

Desktop and mobile layouts remain usable.

## VC-010 — Evidence

Comparable before-and-after screenshots demonstrate the visual changes.

## Acceptance interpretation

Do not mark a gate PASS without relevant evidence.

Use:

* `PASS`
* `FAIL`
* `NOT_VERIFIED`
* `NOT_APPLICABLE`

Do not force a complete verdict if mandatory evidence is missing.

---

# 15. AFTER SCREENSHOTS

After implementation, capture the same views as the baseline.

Use the same:

* Viewport dimensions.
* Camera position.
* Camera zoom.
* Selected region.
* Layer state.
* Fixture data where possible.

## Mandatory comparisons

Include:

1. Desktop world overview — before and after.
2. Mobile world overview — before and after.
3. Region Focus — before and after.
4. Building visibility — before and after.
5. Transport-layer view — before and after, if supported.
6. Low-zoom label behavior — before and after.
7. High-zoom label behavior — before and after.

## Label evidence

For representative labels, record:

* Region name.
* Viewport.
* Zoom.
* Apparent rendered font size or measured text bounds.
* Before state.
* After state.

The measurement method must be explained.

Do not compare raw SVG font units as if they were CSS pixels.

## Evidence integrity

Use real browser screenshots.

Do not generate mock screenshots.

Do not manipulate screenshots to exaggerate changes.

Do not compare different camera positions as if they were identical.

---

# 16. FOCUSED TESTING

Run relevant existing project checks.

## Static checks

Where applicable:

* TypeScript.
* Lint.
* Build.

Use existing scripts.

## Browser checks

Verify:

1. World map loads.
2. Region labels render correctly.
3. Labels remain appropriately sized at low zoom.
4. Labels remain appropriately sized at high zoom.
5. Region selection works.
6. Camera pan works.
7. Camera zoom works.
8. Minimap remains aligned.
9. Buildings remain aligned.
10. Construction previews remain usable.
11. Transport routes remain aligned.
12. Layer toggles work.
13. Inspector remains readable.
14. Keyboard focus remains visible.
15. Mobile layout remains usable.

## Testing boundaries

Do not repeat the complete Slice 5 or Slice 6 acceptance programs.

Do not perform unrelated tests.

## Failure handling

If a directly related regression occurs:

1. Identify the cause.
2. Apply the smallest safe fix.
3. Rerun the affected check.
4. Document the result.

Do not expand into unrelated refactoring.

---

# 17. PERFORMANCE

The composition upgrade must remain lightweight.

Avoid:

* New rendering frameworks.
* Expensive layout loops.
* Unnecessary DOM duplication.
* Large collision-detection systems.
* High-frequency recalculation.
* Heavy SVG filters.
* New asset downloads.
* Excessive animation.

If label positioning requires recalculation, use existing camera and rendering state efficiently.

Do not introduce performance regressions for decorative improvements.

---

# 18. DEFINITION OF DONE

The implementation is complete when:

1. Oversized region labels are visibly corrected.
2. Label sizes remain controlled during zoom.
3. Labels no longer dominate the world map.
4. Important buildings remain visible.
5. Transport connections remain readable.
6. The landscape has clearer visual priority.
7. Existing world geometry is preserved.
8. Existing artwork is preserved.
9. Existing camera behavior is preserved.
10. Existing minimap behavior is preserved.
11. Existing construction behavior is preserved.
12. Existing operational layers remain functional.
13. Desktop and mobile layouts remain usable.
14. Before-and-after screenshots are available.
15. Focused tests have been executed.
16. Protected data remains unchanged.
17. The final handoff is complete.

**The oversized-label correction is mandatory.**

Do not mark the task complete if region labels remain visually dominant.

---

# 19. IMPLEMENTATION CHANGE RECORD

For every modified file, record:

* Exact path.
* Purpose.
* Visual objective.
* Preflight SHA-256.
* Postflight SHA-256.
* Existing WIP considerations.
* Relevant tests.

Separate:

* Application changes.
* Test changes.
* Documentation changes.
* Pre-existing unrelated WIP.

Do not attribute unrelated existing changes to this task.

---

# 20. PRESERVATION POSTFLIGHT

After implementation:

1. Record branch.
2. Record HEAD.
3. Record Git status.
4. Compare protected-file hashes.
5. Compare protected deleted-save absence states.
6. Compare protected artwork hashes.
7. Identify intended changes.
8. Identify unrelated WIP.
9. Record unexpected changes.
10. Verify synthetic test cleanup.

Do not claim preservation PASS for files that were not actually checked.

Do not modify personal saves.

---

# 21. REQUIRED HANDOFF DOCUMENTS

Create one final handoff containing:

## 21.1 `FINAL_REPORT.md`

Include:

* Executive summary.
* Implemented composition changes.
* Region-label correction.
* Building improvements.
* Transport improvements.
* Before-and-after evidence.
* Test results.
* Preservation results.
* Known limitations.
* Final verdict.

## 21.2 `VISUAL_COMPOSITION_IMPLEMENTATION_SUMMARY.md`

Explain the actual implementation.

## 21.3 `REGION_LABEL_REDESIGN_REPORT.md`

Document:

* Original label behavior.
* Root cause of oversized labels.
* New sizing behavior.
* Zoom-dependent behavior.
* Label-placement improvements.
* Before-and-after measurements.
* Remaining limitations.

## 21.4 `VISUAL_COMPOSITION_BEFORE_AFTER.md`

Reference paired screenshots.

## 21.5 `VISUAL_COMPOSITION_ACCEPTANCE_MATRIX.json`

Include VC-001 through VC-010.

For each criterion record:

* Result.
* Evidence.
* Relevant source files.
* Limitations.

## 21.6 `VISUAL_COMPOSITION_TEST_RESULTS.md`

Include:

* Commands.
* Exit codes.
* Browser checks.
* Screenshots.
* Relevant errors.
* Limitations.

## 21.7 `VISUAL_COMPOSITION_ART_DIRECTION_REPORT.md`

Explain:

* Reference-image availability.
* Applied composition principles.
* Landscape priority.
* Building integration.
* Transport integration.
* Remaining long-term visual opportunities.

## 21.8 `VISUAL_COMPOSITION_CHANGED_FILES.json`

Record the actual change set.

## 21.9 `VISUAL_COMPOSITION_PRESERVATION.json`

Include:

* Preflight state.
* Postflight state.
* Protected hashes.
* Artwork hashes.
* Deleted-save absence states.
* Existing WIP handling.
* Unexpected changes.
* Preservation verdict.

## 21.10 `VISUAL_COMPOSITION_KNOWN_LIMITATIONS.md`

Record only material limitations.

## 21.11 `VISUAL_COMPOSITION_HANDOVER.md`

Explain:

* Current rendering architecture.
* Label sizing implementation.
* Building presentation.
* Transport presentation.
* Relevant source locations.
* Preservation constraints.

## 21.12 `VISUAL_COMPOSITION_SOURCE_REFERENCES.json`

Include relevant source documents and hashes.

## 21.13 `handoff-manifest.json`

Include SHA-256 and size for every packaged file except the manifest itself.

## 21.14 Browser evidence

Include actual before-and-after screenshots.

Include focused browser traces or test results where available.

Do not include private saves or environment secrets.

---

# 22. FINAL HANDOFF ZIP

Create:

`project-genesis-post-v1-world-web-scenic-map-visual-composition-upgrade-handoff.zip`

Target location:

`D:\Cursor\Project Genesis\docs\architecture\reviews\project-genesis-post-v1-world-web-scenic-map-visual-composition-upgrade-handoff.zip`

Do not overwrite historical handoffs.

Do not create additional handoff archives.

---

# 23. ZIP INTEGRITY

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

# 24. FINAL VERDICT

Assign exactly one final verdict.

## OPTION A — COMPLETE AND VERIFIED

Use only if:

* The oversized region-label problem is visibly corrected.
* Zoom-dependent label behavior is verified.
* The required composition improvements are implemented.
* Before-and-after evidence demonstrates the changes.
* Relevant regression checks pass.
* No confirmed preservation breach exists.
* No blocking defect remains.

## OPTION B — IMPLEMENTED WITH DOCUMENTED LIMITATIONS

Use if:

* The main improvements are implemented.
* Some noncritical limitations remain.
* The mandatory label correction is demonstrably effective.
* No confirmed critical preservation breach exists.

## OPTION C — PARTIALLY IMPLEMENTED

Use if:

* The mandatory label correction remains incomplete.
* Important composition objectives remain unimplemented.

## OPTION D — BLOCKED

Use if:

* A critical dependency or preservation conflict prevents safe completion.

## OPTION E — NOT IMPLEMENTED

Use if:

* Implementation could not begin.

Do not force OPTION A.

Do not claim success merely because CSS values changed.

---

# 25. FINAL CURSOR RESPONSE

Your final response must include:

## A. Region-label result

Explain exactly how oversized labels were corrected.

## B. Zoom behavior

Explain the new label-sizing behavior.

## C. Building composition

Summarize actual improvements.

## D. Transport composition

Summarize actual improvements.

## E. Before-and-after evidence

List the actual screenshot pairs.

## F. Visual acceptance

Provide VC-001 through VC-010 results.

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

# 26. FINAL NON-NEGOTIABLE INSTRUCTIONS

Correct the oversized region labels.

Make label sizing stable across zoom levels.

Make the landscape visually dominant.

Improve existing building visibility.

Improve existing transport composition.

Preserve existing map geometry.

Preserve existing artwork.

Preserve existing gameplay mechanics.

Preserve existing API contracts.

Preserve existing savegame schemas.

Preserve personal saves and environment files.

Do not introduce a 3D engine.

Do not invent buildings or roads.

Do not reopen historical Slice 5 or Slice 6 audits.

Do not perform another minor shadow-only polish pass.

Capture real before-and-after browser screenshots.

Run focused regression checks.

Document actual evidence.

Report limitations honestly.

Produce one complete implementation handoff.

**The primary success criterion is unmistakable: the region names must become substantially smaller, and the world map must finally look more like a landscape with buildings and transport connections than a large collection of region labels.**
