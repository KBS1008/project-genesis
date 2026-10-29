# PROJECT GENESIS — POST-V1 WORLD WEB

# SCENIC MAP VISUAL ENHANCEMENT

## 0. MISSION

You are Cursor working in the existing Project Genesis repository:

`D:\Cursor\Project Genesis`

Your assignment is to implement a focused visual enhancement of the existing Project Genesis World Web map.

The project owner has selected a long-term visual direction inspired by a supplied strategy-game reference image.

The desired result is a warmer, more dimensional, visually coherent, and more lively strategy-world presentation.

The existing World Web functionality must remain intact.

This task is a **visual implementation increment**, not a new gameplay system, architecture rewrite, or complete world-map replacement.

### Primary objectives

1. Preserve the existing World Web architecture and functionality.
2. Improve the visual depth of the existing landscape.
3. Integrate existing buildings more naturally into the map.
4. Improve the visual presentation of transport connections.
5. Strengthen the visual distinction between different region types.
6. Improve the relationship between the map and its surrounding UI.
7. Maintain readability during camera pan and zoom.
8. Preserve existing responsive and keyboard behavior.
9. Produce actual before-and-after browser screenshots.
10. Deliver one focused implementation handoff.

### Expected player-facing outcome

When the player opens the World Web, the map should feel more like a coherent, inhabited strategy-game environment and less like a collection of flat interface elements.

The player should more easily recognize:

* Landscape regions.
* Buildings.
* Operational connections.
* Selected areas.
* Relevant world activity.

The visual improvements must remain consistent with the established Project Genesis art direction.

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

# 2. PROJECT BASELINE

The relevant preceding development work is:

## Slice 5 — Visual Polish & Game UI

Administrative status:

`CLOSED WITH DOCUMENTED EVIDENCE LIMITATIONS`

Independent evidence verdict:

`OPTION B`

## Slice 6 — Scenic World Operations & Logistics Presentation

Administrative status:

`CLOSED WITH DOCUMENTED LIMITATIONS`

Independent evidence verdict:

`OPTION B`

Both slices are closed for the purpose of this task.

Do not reopen their historical audit cycles.

Do not repeat their complete acceptance programs.

Use their existing implementation as the functional baseline.

### Relevant existing capabilities

Preserve:

* World rendering.
* Region geometry.
* Camera pan.
* Camera zoom.
* Camera boundaries.
* Minimap.
* Region selection.
* Region Focus.
* Construction placement.
* Construction cancellation.
* Construction persistence.
* Operational map layers.
* Transport connections.
* Region inspector.
* Dynamic legend.
* Keyboard accessibility.
* Responsive layout.

Do not remove or replace these features.

---

# 3. AUTHORITATIVE SOURCES

Read the relevant existing architecture and visual implementation documentation.

Prioritize:

1. Mandatory implementation guide.
2. Current World Web architecture.
3. Existing artwork contracts.
4. Existing region-rendering implementation.
5. Existing building-rendering implementation.
6. Existing transport-rendering implementation.
7. Existing design tokens and styles.
8. Slice 5 final handover.
9. Slice 6 final handover.

### Relevant previous handoffs

Locate, where available:

`project-genesis-post-v1-world-web-slice-5-final-signoff-and-handover.zip`

`project-genesis-post-v1-world-web-slice-6-final-browser-verification-and-signoff-handoff.zip`

Previously reviewed Slice 5 ZIP SHA-256:

`f59ebef9e5d145865b7f6d4de5c0d2ce897ef9d0cc427374d6417026f06119f6`

Previously reviewed Slice 6 final ZIP SHA-256:

`3178edcbf694f44e647caf389ce3e17deb1ed8760873527842adba4b061acebb`

Use the handoffs for context.

Do not reconstruct historical evidence chains.

Do not reopen old acceptance investigations.

---

# 4. VISUAL REFERENCE — PROJECT OWNER'S CHOSEN DIRECTION

The project owner supplied a strategy-game reference image and explicitly selected:

**OPTION B — LONG-TERM VISUAL CONVERGENCE**

The reference image shows a visually rich strategy-game map with:

* Dimensional terrain.
* Layered landscape surfaces.
* Warm natural colors.
* Distinct regional environments.
* Buildings integrated into their surroundings.
* Visible roads and transport connections.
* Soft shadows.
* A strong sense of spatial depth.
* Readable side panels.
* A coherent, inhabited world atmosphere.

The objective is to transfer these **visual principles** to Project Genesis.

Do not copy the reference game's artwork, assets, map layout, or interface exactly.

## 4.1 Reference image availability

Before implementation, check whether the reference image is available in Cursor's working context.

The image must be supplied by the project owner as an attachment or through an explicitly provided local path.

Do not invent a repository path for it.

If the image is available:

* Inspect it.
* Identify its major visual principles.
* Record which principles can be transferred safely.
* Use it as the primary visual reference.

If the image is unavailable:

* Record `REFERENCE_IMAGE_NOT_AVAILABLE`.
* Do not claim that the implementation visually matches the image.
* Use the written visual direction in this prompt.
* Do not block the entire implementation solely because the image is missing.

## 4.2 Target visual character

The enhanced World Web should feel:

* Warm.
* Scenic.
* Dimensional.
* Readable.
* Coherent.
* Inhabited.
* Strategically useful.

Avoid:

* Excessive visual noise.
* Neon effects.
* Unnecessary glow.
* Heavy animations.
* Overly saturated overlays.
* Decorative elements that obscure gameplay.
* Photorealistic assets that clash with the existing style.

---

# 5. SCOPE CONTROL

This is a bounded visual enhancement.

It must deliver a meaningful visible improvement without replacing the underlying world.

## In scope

* Landscape depth and layering.
* Region-specific visual treatment.
* Building presentation.
* Transport-route styling.
* Visual hierarchy.
* Shadows and highlights.
* Map-to-UI visual consistency.
* Selection readability.
* Focused responsive adjustments.
* Focused accessibility preservation.

## Out of scope

* New gameplay mechanics.
* New economic simulation rules.
* New transport simulation rules.
* New production mechanics.
* New backend APIs.
* Savegame schema changes.
* New construction mechanics.
* New region geometry.
* New world coordinate systems.
* A hex-grid conversion.
* A 3D engine.
* A new rendering framework.
* Complete replacement of existing artwork.
* Complete UI redesign.
* New map-navigation systems.
* Unrelated refactoring.

Do not expand the scope merely because the reference image contains additional features.

---

# 6. PRESERVATION PREFLIGHT

Before modifying files:

1. Record current Git branch.
2. Record current HEAD.
3. Record Git status.
4. Identify existing unrelated WIP.
5. Identify intended implementation files.
6. Record relevant preflight hashes.
7. Record protected-file hashes.
8. Record protected deleted-save absence states.
9. Record the existing artwork inventory.
10. Record the existing visual implementation baseline.

## Protected categories

Preserve:

* Personal save files.
* Environment files.
* Deleted saves expected to remain absent.
* Region artwork.
* Building artwork.
* Save backups.
* Unrelated tracked WIP.
* Unrelated untracked WIP.
* Existing diagnostic scripts.
* Existing browser harnesses.
* Historical handoffs.

Known examples include:

`Saves/browser-session.json`

`apps/web/.env.local`

`apps/api/saves/Daniela.json`

`apps/api/saves/Jallah.json`

Verify actual paths and case.

Do not assume these examples are exhaustive.

### Artwork protection

Existing artwork must not be overwritten, deleted, renamed, or replaced without explicit authorization.

Visual improvements should preferentially use:

* Existing assets.
* Existing rendering layers.
* CSS.
* SVG effects.
* Existing design tokens.
* Existing component structure.

Do not introduce new external image dependencies.

Do not download unlicensed artwork.

---

# 7. IMPLEMENTATION APPROACH

Implement one coherent visual improvement pass.

Use the following order:

1. Inspect the existing visual system.
2. Capture the current map appearance.
3. Improve landscape depth.
4. Improve region distinction.
5. Improve building integration.
6. Improve transport-route presentation.
7. Harmonize relevant UI elements.
8. Check camera and responsive behavior.
9. Capture after screenshots.
10. Run focused regression checks.
11. Produce the final handoff.

Do not create separate prompts for each step.

Do not perform a broad redesign before understanding the existing implementation.

---

# 8. FEATURE 1 — LANDSCAPE DEPTH

## Objective

Make the existing world map feel more dimensional.

The goal is a restrained layered appearance, not a true 3D conversion.

## Requirements

Where compatible with the current rendering architecture:

* Introduce subtle terrain depth cues.
* Improve separation between landscape and overlays.
* Use soft highlights and shadows.
* Improve visual hierarchy between foreground and background.
* Preserve region geometry.
* Preserve existing world coordinates.
* Preserve camera behavior.
* Preserve existing artwork.

## Preferred techniques

Consider:

* Subtle SVG filters.
* Lightweight CSS effects.
* Layered shadows.
* Region-edge highlights.
* Carefully controlled contrast.
* Existing texture treatment.

Use the simplest approach compatible with the existing rendering system.

## Restrictions

Do not:

* Replace region shapes.
* Alter collision or selection geometry.
* Shift region coordinates.
* Introduce parallax that breaks map alignment.
* Change world bounds.
* Rebuild the camera.
* Create fake elevation data.
* Invent terrain heights.

## Acceptance

The map should visibly gain depth while remaining geometrically and functionally unchanged.

---

# 9. FEATURE 2 — REGION VISUAL IDENTITY

## Objective

Make different regions easier to distinguish visually.

The existing Project Genesis world contains different environmental and economic regions.

Use their documented identities and existing artwork.

## Requirements

* Preserve existing region artwork.
* Improve visual distinction where necessary.
* Maintain a coherent overall palette.
* Avoid excessive color saturation.
* Keep region boundaries readable.
* Keep selected regions distinguishable.
* Preserve existing labels.
* Preserve accessibility-relevant contrast.

## Existing region examples

Previously protected artwork includes regions such as:

* Central Basin.
* Eastern Industrial Belt.
* Northern Highlands.
* Southern Coastal Belt.

Verify the actual current asset inventory.

Do not assume these are the only regions.

## Visual direction

Where supported by existing artwork:

* Industrial regions may use restrained warm industrial tones.
* Highland regions may emphasize natural terrain depth.
* Coastal regions may preserve their existing scenic identity.
* Central regions may maintain a balanced visual appearance.

Do not invent new biome classifications.

Do not alter simulation data to support visual styling.

---

# 10. FEATURE 3 — BUILDING INTEGRATION

## Objective

Make existing buildings appear more naturally integrated into the world.

## Requirements

Use existing building assets.

Improve:

* Visual anchoring.
* Shadow consistency.
* Scale relationships where appropriate.
* Separation from terrain.
* Readability during camera zoom.
* Consistency with surrounding map elements.

## Preferred techniques

Consider:

* Subtle grounding shadows.
* Consistent image rendering.
* Restrained outlines.
* Improved visual layering.
* Better contrast against terrain.

## Restrictions

Do not:

* Move building world coordinates.
* Change building IDs.
* Change placement rules.
* Change construction persistence.
* Change collision or hit-test geometry.
* Replace building artwork.
* Introduce fake buildings.
* Add decorative structures that resemble actual game entities.

## Construction compatibility

Ensure that:

* Placement previews remain distinguishable.
* Existing building selection remains functional.
* Construction confirmation remains unchanged.
* Construction cancellation remains unchanged.
* Keyboard construction safety remains intact.

---

# 11. FEATURE 4 — TRANSPORT CONNECTIONS

## Objective

Improve the scenic integration of the transport connections introduced in Slice 6.

## Requirements

Transport connections must:

* Remain linked to actual transport data.
* Remain aligned with world coordinates.
* Remain readable during pan and zoom.
* Respect operational layer visibility.
* Preserve direction indicators.
* Preserve endpoint semantics.
* Remain distinguishable from region boundaries.

## Visual direction

Prefer:

* Warm route colors.
* Subtle depth.
* Natural-looking line treatment.
* Clear endpoints.
* Restrained directional cues.
* Consistent selection feedback.

## Critical distinction

Transport connections are not necessarily physical roads.

If the existing data does not define a road network, do not fabricate one.

Do not visually imply that a route follows a physical road when the application only knows its endpoints.

## Restrictions

Do not:

* Change transport simulation.
* Invent routes.
* Invent vehicles.
* Invent intermediate stops.
* Add backend route generation.
* Change transport-order contracts.

---

# 12. FEATURE 5 — MAP AND UI HARMONY

## Objective

Make the map and its operational UI feel like parts of one visual system.

Relevant UI areas may include:

* Region inspector.
* Map legend.
* Operational layer controls.
* Region selection indicators.
* World map overlays.

## Requirements

* Maintain a coherent color palette.
* Maintain consistent typography.
* Improve visual hierarchy.
* Use restrained shadows and borders.
* Keep important controls discoverable.
* Avoid covering essential map content.
* Preserve keyboard focus visibility.
* Preserve responsive usability.

## Reference-image influence

The reference image uses readable information panels around a visually dominant world.

Adopt this principle where compatible with the existing interface.

The world map should remain the primary visual element.

## Restrictions

Do not redesign unrelated application screens.

Do not move major application navigation without authorization.

Do not replace the existing UI framework.

---

# 13. VISUAL CONSISTENCY AND ACCESSIBILITY

The enhancement must remain usable.

## Required checks

Verify:

* Region labels remain readable.
* Selection indicators remain visible.
* Transport connections remain distinguishable.
* Keyboard focus remains visible.
* Inspector content remains readable.
* Layer controls remain usable.
* Mobile layouts remain functional.
* Camera pan and zoom do not cause overlay misalignment.

## Motion

Do not introduce significant animation as part of this task.

If small decorative transitions are added, respect reduced-motion preferences.

Avoid animations that imply simulation activity not present in the underlying data.

---

# 14. BEFORE-AND-AFTER VISUAL EVIDENCE

This is a mandatory part of the task.

## 14.1 Before screenshots

Before modifying the visual implementation, capture the existing World Web appearance.

Use the actual application.

Capture representative views such as:

* Full world overview.
* Selected region.
* Region with visible buildings.
* Region with operational transport connections, if fixture data exists.
* Relevant desktop viewport.
* Relevant mobile viewport.

Use synthetic test data where necessary.

Do not modify personal saves.

## 14.2 After screenshots

After implementation, capture the same views.

Use:

* The same viewport dimensions.
* The same camera position.
* The same zoom.
* The same selected region.
* The same operational layer state.
* The same synthetic fixture data where possible.

## 14.3 Evidence integrity

Do not generate mock screenshots and present them as application evidence.

Do not use AI-generated images as browser screenshots.

Do not edit screenshots to exaggerate improvements.

Do not compare different scenes as if they were identical.

If a direct comparison cannot be captured, document why.

## 14.4 Visual comparison report

For each paired view, record:

* Before screenshot.
* After screenshot.
* Viewport.
* Camera state.
* Selected region.
* Visible layers.
* Actual visual changes.
* Remaining limitations.

---

# 15. FOCUSED TESTING

Run only tests relevant to the visual changes.

## Static checks

Use existing project commands for:

* TypeScript.
* Lint.
* Build.

Run the relevant checks for modified components.

## Browser verification

Verify:

1. World map loads.
2. Existing regions render.
3. Region selection works.
4. Camera pan works.
5. Camera zoom works.
6. Minimap remains aligned.
7. Buildings remain aligned.
8. Construction previews remain distinguishable.
9. Transport connections remain aligned.
10. Operational layer controls work.
11. Inspector remains readable.
12. Keyboard focus remains visible.
13. Desktop layout remains usable.
14. Mobile layout remains usable.

These are focused regression boundaries.

Do not repeat the complete historical Slice 5 or Slice 6 acceptance programs.

## Test-data safety

Use synthetic fixtures where appropriate.

Do not modify personal save files.

Do not leave test-created persistent state behind.

## Failure handling

If a directly related regression occurs:

1. Identify the cause.
2. Apply the smallest safe fix.
3. Rerun the affected check.
4. Document the result.

Do not expand into unrelated refactoring.

---

# 16. PERFORMANCE

Visual enhancements must not create disproportionate rendering cost.

Prefer lightweight techniques.

Avoid:

* Expensive repeated SVG filters.
* Large blurred shadows applied to many elements.
* Excessive DOM duplication.
* Unnecessary render loops.
* Large new asset downloads.
* High-frequency animations.
* New rendering dependencies.

If an effect causes visible performance degradation, simplify or remove it.

Do not sacrifice map usability for visual decoration.

---

# 17. DEFINITION OF DONE

The visual enhancement is complete when:

1. Existing map geometry is preserved.
2. Existing artwork is preserved.
3. Landscape depth is visibly improved.
4. Region visual distinction is maintained or improved.
5. Buildings appear more naturally anchored.
6. Transport connections remain accurate and visually integrated.
7. Relevant UI elements use a coherent visual language.
8. Camera and minimap behavior remain functional.
9. Construction behavior remains functional.
10. Responsive usability is preserved.
11. Keyboard accessibility is preserved.
12. Before-and-after screenshots are available.
13. Relevant focused checks pass.
14. Protected files remain unchanged.
15. Actual changes and limitations are documented.
16. The final handoff is complete.

Do not claim success solely because CSS changes were made.

The result must be visibly demonstrated.

---

# 18. IMPLEMENTATION CHANGE RECORD

For every modified file, record:

* Exact path.
* Purpose.
* Relevant visual objective.
* Preflight SHA-256.
* Postflight SHA-256.
* Existing WIP considerations.
* Tests covering the change.

Separate:

* Application changes.
* Test changes.
* Documentation changes.
* Pre-existing unrelated WIP.

Do not attribute unrelated existing changes to this task.

---

# 19. PRESERVATION POSTFLIGHT

After implementation:

1. Record branch.
2. Record HEAD.
3. Record Git status.
4. Compare protected-file hashes.
5. Compare protected deleted-save absence states.
6. Compare protected artwork hashes.
7. Identify intended visual changes.
8. Identify unrelated existing WIP.
9. Record unexpected changes.
10. Verify test fixture cleanup.

Do not claim preservation PASS for files that were not checked.

Do not modify protected data to simplify testing.

---

# 20. REQUIRED HANDOFF DOCUMENTS

Create one final handoff containing:

## 20.1 `FINAL_REPORT.md`

Include:

* Executive summary.
* Implemented visual improvements.
* Reference-image availability.
* Before-and-after evidence.
* Test results.
* Preservation results.
* Known limitations.
* Final verdict.

## 20.2 `SCENIC_MAP_VISUAL_IMPLEMENTATION_SUMMARY.md`

Explain the actual visual implementation.

## 20.3 `SCENIC_MAP_BEFORE_AFTER_COMPARISON.md`

Reference paired screenshots.

## 20.4 `SCENIC_MAP_VISUAL_ACCEPTANCE_MATRIX.json`

Record:

* Requirement.
* Result.
* Evidence.
* Relevant source files.
* Limitations.

Allowed results:

* `PASS`
* `FAIL`
* `NOT_VERIFIED`
* `NOT_APPLICABLE`

## 20.5 `SCENIC_MAP_TEST_RESULTS.md`

Include:

* Commands.
* Exit codes.
* Browser checks.
* Screenshots.
* Relevant errors.
* Limitations.

## 20.6 `SCENIC_MAP_ART_DIRECTION_REPORT.md`

Explain:

* Which visual principles were applied.
* How they relate to the reference image.
* Which existing assets were preserved.
* What remains for future visual work.

Do not claim that the map fully matches the reference image.

## 20.7 `SCENIC_MAP_CHANGED_FILES.json`

Record the actual change set.

## 20.8 `SCENIC_MAP_PRESERVATION.json`

Include:

* Preflight state.
* Postflight state.
* Protected hashes.
* Artwork hashes.
* Deleted-save absence states.
* Existing WIP handling.
* Unexpected changes.
* Preservation verdict.

## 20.9 `SCENIC_MAP_KNOWN_LIMITATIONS.md`

Record only material limitations.

## 20.10 `SCENIC_MAP_HANDOVER.md`

Explain:

* Current visual architecture.
* Implemented improvements.
* Remaining art-direction opportunities.
* Relevant source locations.
* Preservation constraints.

## 20.11 `SCENIC_MAP_SOURCE_REFERENCES.json`

Include relevant source documents and hashes.

## 20.12 `handoff-manifest.json`

Include SHA-256 and size for every packaged file except the manifest itself.

## 20.13 Browser evidence

Include actual before-and-after screenshots.

Include focused browser traces or test results where available.

Do not include private saves or environment secrets.

---

# 21. FINAL HANDOFF ZIP

Create:

`project-genesis-post-v1-world-web-scenic-map-visual-enhancement-handoff.zip`

Target location:

`D:\Cursor\Project Genesis\docs\architecture\reviews\project-genesis-post-v1-world-web-scenic-map-visual-enhancement-handoff.zip`

Do not overwrite historical handoffs.

Do not create additional handoff archives.

---

# 22. ZIP INTEGRITY

After creating the ZIP:

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

# 23. FINAL VERDICT

Assign exactly one final verdict.

## OPTION A — COMPLETE AND VERIFIED

Use only if:

* The required visual improvements are implemented.
* Before-and-after evidence demonstrates the changes.
* Relevant regression checks pass.
* No confirmed preservation breach exists.
* No blocking defect remains.

## OPTION B — IMPLEMENTED WITH DOCUMENTED LIMITATIONS

Use if:

* The main visual improvements are implemented.
* Some evidence or noncritical visual limitations remain.
* No confirmed critical preservation breach exists.

## OPTION C — PARTIALLY IMPLEMENTED

Use if:

* Important mandatory visual objectives remain incomplete.

## OPTION D — BLOCKED

Use if:

* A critical dependency or preservation conflict prevents safe completion.

## OPTION E — NOT IMPLEMENTED

Use if:

* Implementation could not begin.

Do not force OPTION A.

Do not present subjective visual preference as objective proof.

---

# 24. FINAL CURSOR RESPONSE

Your final response must include:

## A. Visual implementation result

Explain what visibly changed.

## B. Reference-image alignment

Explain which visual principles were adopted.

## C. Before-and-after evidence

List the actual screenshot pairs.

## D. Functional preservation

Summarize the focused regression results.

## E. Protected assets

Confirm preservation evidence.

## F. Changed files

Summarize the actual change set.

## G. Known limitations

List only material remaining limitations.

## H. Final verdict

Provide OPTION A/B/C/D/E.

## I. Final ZIP

Provide:

* Exact ZIP path.
* SHA-256.
* Entry count.
* Manifest validation.
* CRC validation.

---

# 25. FINAL NON-NEGOTIABLE INSTRUCTIONS

Implement a visible, bounded scenic-map enhancement.

Preserve existing map geometry.

Preserve existing artwork.

Preserve existing gameplay mechanics.

Preserve existing API contracts.

Preserve existing savegame schemas.

Preserve personal saves and environment files.

Do not introduce a 3D engine.

Do not rebuild the world map.

Do not invent buildings or roads.

Do not copy the reference game's artwork.

Do not reopen Slice 5 or Slice 6.

Do not create an unnecessary audit cycle.

Capture real before-and-after browser screenshots.

Run focused regression checks.

Document actual evidence.

Report limitations honestly.

Produce one complete implementation handoff.

**The objective is a visibly more dimensional, scenic, and coherent Project Genesis world map while preserving the functionality and data already established.**
