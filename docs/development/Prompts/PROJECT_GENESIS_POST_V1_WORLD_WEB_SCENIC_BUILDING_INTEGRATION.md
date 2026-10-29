# PROJECT GENESIS — POST-V1 WORLD WEB

# SCENIC BUILDING INTEGRATION

## 0. MISSION

You are Cursor working in the existing Project Genesis repository:

`D:\Cursor\Project Genesis`

Your assignment is to implement a focused, data-driven scenic building integration for the existing World Web map.

The project owner has also identified a new visual regression in the most recent screenshot:

**Region labels are now too small and use dark text that is difficult to read against the landscape.**

This regression must be corrected as part of the implementation.

The two mandatory objectives are:

1. Restore readable, balanced region labels without returning to the previous oversized-label behavior.
2. Integrate existing game buildings more visibly and naturally into the world landscape.

This is a bounded implementation task.

Do not rebuild the world map.

Do not introduce new gameplay systems.

Do not invent buildings.

Do not alter the economic simulation.

Do not modify savegame schemas.

The implementation must produce an actual, visible improvement demonstrated by real browser screenshots.

---

# 1. MANDATORY FIRST ACTION

Before any other operation, read:

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

If it cannot be read, stop and report:

`BLOCKED — IMPLEMENTATION GUIDE UNAVAILABLE`

Do not continue based on assumptions.

---

# 2. PROJECT BASELINE

The following development increments are closed:

## Slice 5 — Visual Polish & Game UI

Administrative status:

`CLOSED WITH DOCUMENTED EVIDENCE LIMITATIONS`

Independent verdict:

`OPTION B`

## Slice 6 — Scenic World Operations & Logistics Presentation

Administrative status:

`CLOSED WITH DOCUMENTED LIMITATIONS`

Independent verdict:

`OPTION B`

## Scenic Map Visual Enhancement

Administrative status:

`CLOSED WITH DOCUMENTED LIMITATIONS`

Independent verdict:

`OPTION B`

## Scenic Map Visual Composition Upgrade

Administrative status:

`CLOSED WITH DOCUMENTED LIMITATIONS`

Independent verdict:

`OPTION B`

The most recent composition upgrade corrected uncontrolled region-label scaling but introduced or exposed insufficient label readability.

Its handoff is:

`project-genesis-post-v1-world-web-scenic-map-visual-composition-upgrade-handoff.zip`

Previously reviewed SHA-256:

`cda1f4c3bd42a6f0e2bc7ca2aee870c4f69925f749d643939394c55b3d1e38e5`

Use the current repository implementation as the source of truth.

Do not reopen historical audit cycles.

Do not repeat complete Slice 5 or Slice 6 acceptance programs.

---

# 3. PROJECT-OWNER SCREENSHOT — IMPORTANT NEW EVIDENCE

The project owner supplied a new screenshot showing the current World Web map.

The screenshot demonstrates:

* A scenic landscape with mountains, forests, and plains.
* Region boundaries.
* Small, dark region labels.
* Labels that blend into the terrain.
* Poor readability in several landscape areas.
* A map that still does not prominently communicate existing buildings.

Visible examples include:

* Northern Highlands.
* Eastern Industrial Belt.
* Central Basin.
* Southern Coastal Belt.

The specific visual complaint is:

**"The region names are now too small and, in black, are barely recognizable."**

This complaint is authoritative.

Do not treat the previous label-size implementation as fully satisfactory.

## 3.1 Screenshot availability

Check whether the project-owner screenshot is available in Cursor's current context.

If available:

* Inspect it.
* Use it as the immediate reference for label readability.
* Record the relevant visual problems.

If unavailable:

* Record `OWNER_SCREENSHOT_NOT_AVAILABLE`.
* Continue using the written requirements.
* Do not invent a screenshot path.
* Do not claim to have inspected the image.

## 3.2 Original art-direction reference

The project owner previously supplied a separate strategy-game reference image showing a dimensional, inhabited world.

Check whether that image is available.

If unavailable, record:

`ORIGINAL_REFERENCE_IMAGE_NOT_AVAILABLE`

Do not claim direct visual matching.

Do not copy third-party artwork.

---

# 4. TASK PRIORITIES

Execute in this order:

1. Preservation preflight.
2. Inspect current region-label implementation.
3. Inspect existing building data and artwork contracts.
4. Capture baseline browser screenshots.
5. Correct region-label readability.
6. Implement data-driven scenic building integration.
7. Verify camera and construction compatibility.
8. Capture after screenshots.
9. Run focused tests.
10. Produce one complete handoff.

Do not turn this into a broad visual redesign.

---

# 5. STRICT SCOPE

## In scope

* Region-label readability.
* Region-label apparent size.
* Region-label contrast.
* Region-label outlines and backgrounds.
* Zoom-stable label presentation.
* Existing building data mapping.
* Existing building artwork reuse.
* Existing building visual anchoring.
* Building visibility across zoom levels.
* Building layer ordering.
* Building selection compatibility.
* Focused responsive adjustments.
* Focused browser evidence.

## Out of scope

* New gameplay mechanics.
* New building types.
* New construction rules.
* New production rules.
* New transport rules.
* New backend APIs.
* Savegame schema changes.
* Region geometry changes.
* World-coordinate changes.
* New roads.
* Fake buildings.
* Decorative settlements.
* Hex-grid conversion.
* 3D engine integration.
* Camera architecture replacement.
* Complete map redesign.
* Complete UI redesign.
* Unrelated refactoring.

---

# 6. PRESERVATION PREFLIGHT

Before editing:

1. Record current branch.
2. Record current HEAD.
3. Record Git status.
4. Identify unrelated tracked and untracked WIP.
5. Identify intended implementation files.
6. Record relevant source-file hashes.
7. Record protected-file hashes.
8. Record protected deleted-save absence states.
9. Record existing region artwork.
10. Record existing building artwork.
11. Record the current rendering architecture.

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

## Existing artwork

Previously protected building artwork includes assets such as:

* Headquarters.
* Warehouse.
* Substation.
* Access Road.
* Sawmill.

Verify the actual asset inventory.

Do not assume all these assets represent currently placed buildings.

Do not overwrite, delete, rename, or replace existing artwork.

Do not download external artwork.

---

# 7. BASELINE SCREENSHOTS

Before modifying the implementation, capture the current application.

Required views:

1. Desktop world overview.
2. Mobile world overview.
3. Region labels over dark terrain.
4. Region labels over light terrain.
5. A region with existing building data.
6. A selected region with building information.
7. Low camera zoom.
8. High camera zoom.

Record:

* Viewport dimensions.
* Camera position.
* Camera zoom.
* Selected region.
* Visible layers.
* Data fixture.
* Screenshot path.

Use actual browser screenshots.

Do not generate mock screenshots.

Use synthetic fixtures only where supported by the existing test infrastructure.

Do not modify personal saves.

---

# 8. PRIORITY 1 — FIX REGION-LABEL READABILITY

## Objective

Make region labels clearly readable while preserving the successful correction of oversized labels.

The previous implementation made labels smaller and more zoom-stable.

That behavior must remain.

However, the current labels are too small and too dark.

The goal is a balanced middle ground.

## 8.1 Inspect the actual implementation

Identify:

* Region-label component.
* Font family.
* Font weight.
* Font size.
* Text fill.
* Text stroke.
* Stroke width.
* Text shadows.
* Zoom scaling.
* Inverse scaling.
* Label visibility thresholds.
* Selection emphasis.
* Responsive behavior.

Inspect the existing functions where applicable:

`resolveScenicRegionLabelInverseScale`

`shouldRenderScenicRegionLabel`

Do not assume their current implementation is correct.

Do not remove inverse scaling merely to increase label size.

Fix the actual readability problem.

---

# 9. LABEL SIZE REQUIREMENTS

Region labels must be:

* Clearly readable at normal desktop zoom.
* Readable on mobile where displayed.
* Smaller than the original oversized labels.
* Stable across supported zoom levels.
* Visually subordinate to the landscape.
* Distinguishable from buildings and transport markers.

## Suggested apparent screen-size targets

Use these as initial design targets:

### Desktop

Normal region labels:

Approximately **14–17 CSS pixels**.

Selected region:

Approximately **16–19 CSS pixels**.

### Mobile

Normal region labels:

Approximately **12–15 CSS pixels**.

Selected region:

Approximately **14–17 CSS pixels**.

These are apparent rendered sizes, not raw SVG world units.

Adapt them to the actual renderer and viewport.

Do not apply these numbers blindly.

## Critical rule

**Do not restore the original oversized region names.**

Use bounded sizing.

The labels must remain stable during camera zoom.

---

# 10. LABEL COLOR AND CONTRAST

## Objective

Ensure labels remain readable over both dark and light landscape areas.

The current black text is unacceptable.

## Required visual treatment

Prefer a light, warm, high-contrast text color such as:

* Warm ivory.
* Soft off-white.
* Light parchment.

Combine it with a restrained dark outline or shadow.

Possible initial styling:

* Light text fill.
* Dark charcoal outline.
* Moderate font weight.
* Subtle text shadow.

The exact values must be tuned against the actual landscape.

## Contrast requirements

Test labels against:

* Dark mountain areas.
* Forested areas.
* Light grassland.
* Sandy or dry terrain.
* Region boundaries.
* Mixed high-detail textures.

Do not rely on one screenshot.

## Stroke requirements

The outline must:

* Improve readability.
* Remain visually restrained.
* Avoid recreating the previous heavy-label appearance.

Avoid excessively thick text strokes.

## Optional background treatment

If necessary, use a very compact, semi-transparent label background.

Do not create large opaque boxes.

Do not obscure the terrain.

## Accessibility

Aim for readable contrast across representative terrain backgrounds.

Where exact contrast ratios cannot be reliably measured against textured imagery, use browser screenshots and representative sampled backgrounds to document the assessment.

Do not claim formal WCAG compliance without an appropriate measurement method.

---

# 11. LABEL ZOOM BEHAVIOR

Preserve the principle of zoom-stable labels.

Verify:

* Minimum supported zoom.
* Normal world overview zoom.
* Region Focus zoom.
* Maximum supported zoom.
* Desktop viewport.
* Mobile viewport.

## Requirements

* Labels must not become huge at high zoom.
* Labels must not become unreadably small at low zoom.
* Selected-region identification must remain available.
* Label visibility changes must not cause confusing flicker.
* Labels must not block region selection.

If the current low-zoom visibility threshold hides too many labels, adjust it conservatively.

Do not create a complex label-placement engine.

---

# 12. PRIORITY 2 — BUILDING DATA DISCOVERY

## Objective

Understand how actual game buildings are represented before changing their visual presentation.

Inspect the existing data flow from application state or API to World Web rendering.

Identify:

* Building entity identifiers.
* Building types.
* Region association.
* Existing position data.
* Existing building artwork mapping.
* Construction state.
* Ownership state where relevant.
* Visibility rules.
* Selection behavior.
* Existing building markers.
* Existing building rendering layers.

## Critical requirement

**Every visible functional building must correspond to an actual building entity in the loaded game state or an explicitly identified synthetic test fixture.**

Do not invent building instances.

Do not invent coordinates.

Do not infer exact building positions from region names alone.

Do not generate fake settlements.

## Data limitations

If buildings have only a region association and no precise world coordinates:

1. Document that limitation.
2. Inspect existing region-anchor or placement conventions.
3. Reuse an existing documented deterministic placement convention if available.
4. Otherwise implement a clearly identified region-level building representation.
5. Do not pretend that the displayed position is an authoritative building location.

Do not change save schemas to solve missing visual-position data.

---

# 13. BUILDING ARTWORK INTEGRATION

## Objective

Use existing Project Genesis building artwork to make actual buildings visually recognizable on the map.

## Requirements

Where technically compatible:

* Reuse existing building artwork.
* Preserve existing asset files.
* Map building types to appropriate assets.
* Provide a safe fallback for unsupported types.
* Preserve entity identity.
* Preserve building selection behavior.
* Preserve construction behavior.

## Asset mapping

Inspect the actual available assets.

Do not assume that every asset is appropriate for every building type.

Do not use an Access Road image as a generic building.

Do not substitute unrelated artwork.

## Fallbacks

If a building type lacks suitable artwork:

* Use the existing building marker.
* Preserve its identity.
* Document the fallback.

Do not create misleading artwork.

---

# 14. BUILDING POSITION AND VISUAL ANCHORING

## Objective

Make existing buildings feel connected to the terrain rather than floating above it.

## Requirements

Preserve:

* Existing world coordinates.
* Existing region coordinates.
* Existing construction positions.
* Existing selection hit areas.
* Existing camera transforms.

Improve:

* Grounding shadows.
* Visual anchoring.
* Consistent artwork alignment.
* Building scale.
* Terrain contrast.
* Layer ordering.

## Visual direction

Prefer:

* Subtle contact shadows.
* Consistent image proportions.
* Restrained outlines.
* Clear silhouettes.
* Warm scenic integration.

Avoid:

* Heavy glow.
* Oversized building sprites.
* Artificial perspective distortions.
* Excessive shadows.
* Decorative fake foundations.
* Misleading terrain alterations.

---

# 15. BUILDING SCALE AND CAMERA ZOOM

Buildings must remain recognizable across supported zoom levels.

## Requirements

* No uncontrolled enlargement.
* No excessive shrinking.
* No camera misalignment.
* No sudden positional jumps.
* No broken selection hit areas.
* No distortion of artwork aspect ratios.

Use bounded visual scaling where appropriate.

Do not create a new camera system.

Do not modify the world coordinate system.

## Density handling

If multiple buildings are associated with one region:

* Preserve actual entity counts.
* Avoid unreadable overlap.
* Use an existing documented layout convention if available.
* Otherwise use a compact, clearly labeled region-level representation.
* Do not invent exact placement coordinates.

If aggregation is necessary, the displayed count must correspond to real data.

---

# 16. BUILDING INTERACTION

Preserve existing interaction behavior.

Verify:

* Building selection.
* Region selection.
* Construction placement.
* Construction previews.
* Construction cancellation.
* Construction confirmation.
* Inspector synchronization.
* Keyboard accessibility.

Do not let decorative artwork intercept unrelated pointer events.

Do not create a second conflicting selection system.

Do not add new building actions.

---

# 17. MAP RENDERING HIERARCHY

Review the existing map layers.

The intended visual result is:

1. Scenic terrain.
2. Existing world objects.
3. Actual building representations.
4. Operational routes and markers.
5. Readable region labels.
6. Selection and focus indicators.
7. Interactive UI controls.

This is a conceptual hierarchy.

Use the actual rendering architecture to determine safe technical ordering.

## Important requirements

* Labels must not obscure buildings unnecessarily.
* Buildings must remain visible against terrain.
* Routes must remain readable.
* Selection indicators must remain visible.
* Interactive hit targets must remain functional.

Do not reorder layers blindly.

---

# 18. RESPONSIVE PRESENTATION

Verify the implementation on:

* Desktop.
* Tablet where practical.
* Mobile.

## Requirements

* Labels remain readable.
* Buildings remain recognizable.
* Building artwork does not cover essential controls.
* Inspector remains usable.
* Layer controls remain accessible.
* Camera pan and zoom remain functional.
* No new horizontal overflow.
* No clipping of essential information.

If a compact building representation is needed on mobile, it must preserve entity identity and data accuracy.

---

# 19. VISUAL ACCEPTANCE CRITERIA

Use the following criteria.

## SBI-AC-001 — Label readability

Region labels are clearly readable over representative dark and light terrain.

## SBI-AC-002 — Balanced label size

Region labels are larger and more readable than in the latest owner screenshot but remain substantially smaller than the original oversized labels.

## SBI-AC-003 — Zoom stability

Region labels remain appropriately sized across supported zoom levels.

## SBI-AC-004 — Data-driven buildings

Every displayed building corresponds to an actual building entity or an explicitly identified synthetic fixture.

## SBI-AC-005 — Building artwork

Existing suitable building artwork is reused where supported.

Unsupported types use documented fallbacks.

## SBI-AC-006 — Building anchoring

Building representations appear visually connected to the terrain.

## SBI-AC-007 — Building scale

Buildings remain recognizable and aligned during pan and zoom.

## SBI-AC-008 — Building interactions

Existing selection and construction behavior remain functional.

## SBI-AC-009 — Responsive usability

Desktop and mobile presentations remain usable.

## SBI-AC-010 — Functional preservation

Camera, minimap, layers, inspector, and relevant existing World Web functionality remain intact.

## SBI-AC-011 — Visual evidence

Real before-and-after screenshots demonstrate label and building improvements.

## SBI-AC-012 — Preservation

Protected data and artwork remain unchanged.

## Allowed statuses

* `PASS`
* `FAIL`
* `NOT_VERIFIED`
* `NOT_APPLICABLE`

Do not invent additional status values.

Do not mark a criterion PASS without relevant evidence.

---

# 20. MANDATORY BROWSER EVIDENCE

Capture real browser screenshots after implementation.

## Required comparisons

1. Desktop overview — before and after.
2. Mobile overview — before and after.
3. Labels over dark terrain — before and after.
4. Labels over light terrain — before and after.
5. Low-zoom label presentation — before and after.
6. High-zoom label presentation — before and after.
7. Building representation — before and after.
8. Selected building or building-related region — before and after.

## Building evidence

At least one after screenshot must show actual building artwork or an explicitly documented fallback tied to building data.

If the current test state contains no buildings:

1. Use an isolated synthetic fixture if supported.
2. Identify the fixture clearly.
3. Capture the result.
4. Clean up test state.
5. Do not modify personal saves.

If neither real nor synthetic building data can be rendered, record:

`BUILDING_VISUAL_EVIDENCE_NOT_AVAILABLE`

Do not claim full visual verification.

## Label evidence

For representative region labels, record:

* Region name.
* Viewport.
* Camera zoom.
* Apparent rendered size.
* Text fill.
* Outline treatment.
* Readability assessment.
* Screenshot reference.

Do not present raw SVG world units as CSS pixel measurements.

## Screenshot integrity

Do not:

* Generate mock screenshots.
* Use AI-generated screenshots as browser evidence.
* Edit screenshots to exaggerate changes.
* Compare different camera positions as equivalent.
* Hide test failures.

---

# 21. FOCUSED TESTING

Run relevant existing project checks.

## Static checks

Where applicable:

* TypeScript.
* Lint.
* Build.

## Browser checks

Verify:

1. World map loads.
2. Region labels render.
3. Labels remain readable at normal zoom.
4. Labels remain readable at low zoom.
5. Labels remain appropriately sized at high zoom.
6. Existing buildings render.
7. Building artwork matches actual building types.
8. Building selection works.
9. Region selection works.
10. Camera pan works.
11. Camera zoom works.
12. Minimap remains aligned.
13. Construction previews remain usable.
14. Construction cancellation remains functional.
15. Transport layers remain functional.
16. Inspector remains usable.
17. Keyboard focus remains visible.
18. Mobile layout remains usable.

## Scope boundary

Do not rerun the complete historical acceptance programs.

Do not investigate unrelated features.

## Failure handling

For directly related regressions:

1. Identify the cause.
2. Apply the smallest safe correction.
3. Rerun the affected test.
4. Document the result.

Do not create an open-ended audit cycle.

---

# 22. PERFORMANCE

Keep the implementation lightweight.

Avoid:

* New rendering frameworks.
* Large rendering dependencies.
* Expensive per-frame layout calculations.
* Unnecessary DOM duplication.
* Excessive SVG filters.
* Large numbers of overlapping image elements.
* Heavy animations.
* New external artwork downloads.

Reuse existing rendering structures.

If building density becomes high, prefer a bounded presentation strategy rather than rendering unlimited overlapping sprites.

---

# 23. DEFINITION OF DONE

The task is complete when:

1. Region labels are readable over dark terrain.
2. Region labels are readable over light terrain.
3. Region labels are appropriately sized.
4. Labels remain stable across zoom levels.
5. Existing building data is mapped correctly.
6. Existing suitable building artwork is reused.
7. Building representations are visually grounded.
8. Building representations remain aligned during pan and zoom.
9. Building and region interactions remain functional.
10. Construction behavior remains unchanged.
11. Camera and minimap remain functional.
12. Responsive layouts remain usable.
13. Before-and-after screenshots exist.
14. Relevant focused checks have been executed.
15. Protected data and artwork remain unchanged.
16. One complete handoff is produced.

Do not mark the task complete merely because a building image component was added.

The implementation must visibly demonstrate data-driven building integration.

Do not mark the task complete if region labels remain dark and unreadable.

---

# 24. CHANGE RECORD

For every modified file, record:

* Exact path.
* Purpose.
* Relevant acceptance criteria.
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

# 25. PRESERVATION POSTFLIGHT

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
10. Verify test-fixture cleanup.

Do not claim preservation PASS for files that were not checked.

Do not modify personal saves.

---

# 26. REQUIRED HANDOFF DOCUMENTS

Create one final handoff containing:

## 26.1 `FINAL_REPORT.md`

Include:

* Executive summary.
* Region-label readability correction.
* Building integration implementation.
* Data sources.
* Artwork mapping.
* Browser evidence.
* Test results.
* Preservation results.
* Known limitations.
* Final verdict.

## 26.2 `SCENIC_BUILDING_IMPLEMENTATION_SUMMARY.md`

Explain the actual implementation.

## 26.3 `REGION_LABEL_READABILITY_REPORT.md`

Document:

* Previous problem.
* Root cause.
* New font sizing.
* New contrast treatment.
* Zoom behavior.
* Representative screenshots.
* Remaining limitations.

## 26.4 `BUILDING_DATA_MAPPING_REPORT.md`

Document:

* Building data source.
* Entity identifiers.
* Region association.
* Position source.
* Artwork mapping.
* Fallback behavior.
* Data limitations.

Do not include private save contents.

## 26.5 `BUILDING_VISUAL_EVIDENCE.md`

Reference actual screenshots and explain what each demonstrates.

## 26.6 `SCENIC_BUILDING_ACCEPTANCE_MATRIX.json`

Include SBI-AC-001 through SBI-AC-012.

For each criterion record:

* Result.
* Evidence.
* Relevant source files.
* Limitations.

## 26.7 `SCENIC_BUILDING_TEST_RESULTS.md`

Include:

* Commands.
* Exit codes.
* Browser checks.
* Screenshots.
* Relevant errors.
* Limitations.

## 26.8 `SCENIC_BUILDING_CHANGED_FILES.json`

Record the actual change set.

## 26.9 `SCENIC_BUILDING_PRESERVATION.json`

Include:

* Preflight state.
* Postflight state.
* Protected hashes.
* Artwork hashes.
* Deleted-save absence states.
* Existing WIP handling.
* Unexpected changes.
* Preservation verdict.

## 26.10 `SCENIC_BUILDING_KNOWN_LIMITATIONS.md`

Record only material limitations.

## 26.11 `SCENIC_BUILDING_HANDOVER.md`

Explain:

* Building rendering architecture.
* Label readability implementation.
* Data-driven building mapping.
* Artwork mapping.
* Relevant source locations.
* Preservation constraints.

## 26.12 `SCENIC_BUILDING_SOURCE_REFERENCES.json`

Include relevant source documents and hashes.

## 26.13 `handoff-manifest.json`

Include SHA-256 and size for every packaged file except the manifest itself.

## 26.14 Browser evidence

Include actual before-and-after screenshots.

Include focused browser traces or test results where available.

Do not include personal saves or environment secrets.

---

# 27. FINAL HANDOFF ZIP

Create:

`project-genesis-post-v1-world-web-scenic-building-integration-handoff.zip`

Target location:

`D:\Cursor\Project Genesis\docs\architecture\reviews\project-genesis-post-v1-world-web-scenic-building-integration-handoff.zip`

Do not overwrite historical handoffs.

Do not create additional handoff archives.

---

# 28. ZIP INTEGRITY

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

# 29. FINAL VERDICT

Assign exactly one final verdict.

## OPTION A — COMPLETE AND VERIFIED

Use only if:

* Region labels are demonstrably readable.
* Region-label sizes remain controlled.
* Data-driven building integration is implemented.
* Building visuals are demonstrated in actual browser evidence.
* Relevant regression checks pass.
* No confirmed preservation breach exists.
* No blocking defect remains.

## OPTION B — IMPLEMENTED WITH DOCUMENTED LIMITATIONS

Use if:

* The main objectives are implemented.
* Some noncritical evidence or presentation limitations remain.
* Label readability is demonstrably improved.
* Building integration is substantially implemented.
* No confirmed critical preservation breach exists.

## OPTION C — PARTIALLY IMPLEMENTED

Use if:

* Label readability remains inadequate.
* Building integration is materially incomplete.
* Important mandatory requirements remain unimplemented.

## OPTION D — BLOCKED

Use if:

* A critical dependency or preservation conflict prevents safe completion.

## OPTION E — NOT IMPLEMENTED

Use if:

* Implementation could not begin.

Do not force OPTION A.

Do not claim complete building integration when only placeholders are visible.

---

# 30. FINAL CURSOR RESPONSE

Your final response must include:

## A. Region-label result

Explain the readability correction.

## B. Label sizing and zoom

Explain the final sizing behavior.

## C. Building data

Explain which actual entities are represented.

## D. Building artwork

Explain which existing assets are used.

## E. Building positioning

Explain the authoritative or fallback position source.

## F. Before-and-after evidence

List actual screenshot pairs.

## G. Acceptance results

Provide SBI-AC-001 through SBI-AC-012.

## H. Functional preservation

Summarize focused regression checks.

## I. Protected data

Summarize preservation evidence.

## J. Changed files

List actual changes.

## K. Final verdict

Provide OPTION A/B/C/D/E.

## L. Final ZIP

Provide:

* Exact ZIP path.
* SHA-256.
* Entry count.
* Manifest validation.
* CRC validation.

---

# 31. FINAL NON-NEGOTIABLE INSTRUCTIONS

Fix the small, dark, unreadable region labels.

Use readable contrast over textured terrain.

Preserve bounded, zoom-stable label sizing.

Do not restore oversized labels.

Render actual buildings from existing game data.

Reuse suitable existing building artwork.

Do not invent building entities.

Do not invent authoritative building coordinates.

Preserve existing map geometry.

Preserve existing construction mechanics.

Preserve existing gameplay rules.

Preserve existing API contracts.

Preserve existing savegame schemas.

Preserve personal saves and environment files.

Preserve existing artwork.

Do not introduce a 3D engine.

Do not fabricate roads or settlements.

Do not reopen historical audit cycles.

Capture real browser screenshots.

Run focused regression checks.

Document actual evidence.

Report limitations honestly.

Produce one complete implementation handoff.

**The desired result is a readable scenic world map where region names are balanced and clearly visible, while actual buildings become recognizable elements of the landscape rather than abstract or disconnected markers.**
