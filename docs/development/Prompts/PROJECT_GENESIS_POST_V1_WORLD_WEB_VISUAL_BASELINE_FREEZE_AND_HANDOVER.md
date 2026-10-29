# PROJECT GENESIS — POST-V1 WORLD WEB

# VISUAL BASELINE FREEZE AND HANDOVER

## 0. MISSION

You are Cursor working in the existing Project Genesis repository:

`D:\Cursor\Project Genesis`

Your assignment is to formally document, freeze, and hand over the current World Web visual presentation as the approved **Post-V1 Visual Baseline**.

This is a **documentation and handover task only**.

Do not implement new visual features.

Do not modify application source code.

Do not modify artwork.

Do not modify gameplay.

Do not start another visual-polish cycle.

The objective is to establish a reliable, evidence-based baseline that future Project Genesis development can preserve without repeatedly reopening completed visual work.

### Primary objectives

1. Identify the actual current World Web visual implementation.
2. Document the approved visual decisions.
3. Record the current rendering architecture.
4. Document the completed visual development increments.
5. Record the remaining known visual limitations.
6. Explicitly close the current scenic-polish iteration.
7. Establish preservation rules for future development.
8. Produce a concise visual baseline reference.
9. Produce a practical developer handover.
10. Deliver one verified documentation handoff ZIP.

### Core principle

**Freeze the current approved visual state without pretending that every historical visual objective was fully achieved.**

The current map is the accepted working baseline.

It is not a declaration that the world artwork is visually final forever.

Future improvements may be considered through separate, explicitly approved development tasks.

---

# 1. MANDATORY FIRST ACTION

Before any other operation, read:

`D:\Cursor\Project Genesis\docs\development\CURSOR_IMPLEMENTATION_GUIDE.md`

Record:

* Exact path.
* SHA-256.
* Read timestamp.
* Applicable repository rules.
* Preservation requirements.
* Documentation requirements.
* Evidence requirements.
* Handoff requirements.

Follow the guide.

If the guide cannot be read, stop and report:

`BLOCKED — IMPLEMENTATION GUIDE UNAVAILABLE`

Do not continue based on assumptions.

---

# 2. AUTHORITATIVE PROJECT-OWNER DECISIONS

The following decisions are binding.

## 2.1 Region labels are approved

The project owner explicitly approved the current region-label appearance.

Preserve:

* Current apparent font sizes.
* Current white or light lettering.
* Current dark contrast outline.
* Current label positioning.
* Current zoom behavior.
* Current visibility behavior.
* Current responsive behavior.

The project owner considers the current region labels correctly sized and clearly readable.

Do not redesign them.

Do not modify them during this task.

Do not recommend another cosmetic label adjustment.

### Baseline rule

`REGION_LABEL_PRESENTATION_FROZEN`

---

## 2.2 Building sizes remain unchanged

The project owner observed that buildings appear relatively large compared with the landscape.

The project owner nevertheless decided to preserve their current sizes.

This is an intentional decision.

Preserve:

* Existing sprite dimensions.
* Existing apparent building scale.
* Existing zoom-dependent scaling.
* Existing building positions.
* Existing selection geometry.

Do not resize buildings.

Do not reinterpret the earlier scale review as authorization to resize buildings.

### Baseline rule

`BUILDING_SCALE_FROZEN`

---

## 2.3 Existing scenic terrain artwork remains unchanged

Preserve the existing World Web artwork, including:

* Mountains.
* Forests.
* Trees.
* Rivers.
* Waterways.
* Paths.
* Terrain textures.
* Region artwork.

Do not replace or modify the images.

### Baseline rule

`SCENIC_TERRAIN_ARTWORK_FROZEN`

---

## 2.4 Current building artwork remains unchanged

Preserve existing building assets and their identities.

Do not:

* Replace building images.
* Repaint building images.
* Generate replacement assets.
* Change building types.
* Add decorative buildings.
* Introduce fake settlements.

### Baseline rule

`BUILDING_ARTWORK_FROZEN`

---

## 2.5 Current visual-polish iteration is closed

The project owner has decided not to continue with another series of small CSS or SVG shadow adjustments.

Do not reopen:

* Region-label polishing.
* Building-size experimentation.
* Minor building-shadow tuning.
* Repeated grounding adjustments.
* Repeated scenic contrast adjustments.

### Baseline rule

`CURRENT_SCENIC_POLISH_ITERATION_CLOSED`

---

# 3. PROJECT HISTORY AND CLOSED INCREMENTS

The following increments are administratively closed:

1. Slice 5 — Visual Polish & Game UI.
2. Slice 6 — Scenic World Operations & Logistics Presentation.
3. Scenic Map Visual Enhancement.
4. Scenic Map Visual Composition Upgrade.
5. Scenic Building Integration.
6. Scenic Scale and Perspective Review.
7. Scenic Building Grounding and Perspective.

Do not reopen their historical acceptance programs.

Do not rerun their complete audit suites.

Do not reconstruct historical review chains.

Use previous handoffs only where necessary to establish the visual baseline accurately.

## Important distinction

An administratively closed increment is not necessarily a fully verified visual success.

Document:

* What was implemented.
* What was verified.
* What remained limited.
* What the owner accepted as the current baseline.

Do not convert historical limitations into new PASS claims.

---

# 4. MOST RECENT IMPLEMENTATION HANDOFF

The latest visual implementation handoff is:

`project-genesis-post-v1-world-web-scenic-building-grounding-and-perspective-handoff.zip`

Previously reviewed SHA-256:

`5d1405dbef2e611a1768aa21401546664921895e63e033071ea411c0d1c03507`

Locate the archive if available.

Use it as relevant historical evidence.

Do not assume its findings supersede the current repository.

The current repository remains the implementation source of truth.

## Historical review conclusion

The previous review found:

* A focused building-grounding implementation was documented.
* Relevant technical tests were reported successful.
* No confirmed preservation damage was identified.
* The visual improvement was limited.
* Most supplied before-and-after screenshot pairs did not demonstrate a visible difference.
* The requested strong visual improvement was not sufficiently established.

Record this limitation accurately.

Do not claim the last increment produced a major scenic transformation.

Do not initiate another grounding experiment.

---

# 5. TASK TYPE AND STRICT SCOPE

This is a:

`DOCUMENTATION_ONLY_BASELINE_FREEZE`

## In scope

* Read-only inspection of relevant World Web source.
* Read-only inspection of relevant artwork.
* Read-only inspection of existing visual tests.
* Review of relevant previous handoff reports.
* Recording approved visual decisions.
* Recording known limitations.
* Documenting architecture.
* Creating a visual preservation contract.
* Creating a future-development handover.
* Creating one final handoff ZIP.

## Out of scope

* Source-code changes.
* CSS changes.
* SVG changes.
* React component changes.
* Artwork changes.
* Building scaling changes.
* Region-label changes.
* Camera changes.
* Minimap changes.
* Construction changes.
* Transport changes.
* Gameplay changes.
* Backend changes.
* Savegame changes.
* New visual features.
* New UI features.
* New art-direction prototypes.
* New screenshot comparison experiments.
* General repository audits.
* Historical acceptance revalidation.

Do not expand the scope.

---

# 6. PRESERVATION PREFLIGHT

Before producing documentation:

1. Record the current Git branch.
2. Record the current HEAD.
3. Record Git status.
4. Identify unrelated tracked WIP.
5. Identify unrelated untracked WIP.
6. Identify protected files.
7. Record relevant source-file hashes.
8. Record relevant artwork hashes.
9. Record relevant label-related source hashes.
10. Record relevant building-scale source hashes.
11. Record protected deleted-save absence states.
12. Identify existing review and handoff files.

## Protected categories

Preserve:

* Personal browser saves.
* Local environment files.
* Deleted saves expected to remain absent.
* Region artwork.
* Building artwork.
* Save backups.
* Unrelated WIP.
* Existing diagnostic scripts.
* Existing test harnesses.
* Historical handoffs.

Known examples include:

`Saves/browser-session.json`

`apps/web/.env.local`

`apps/api/saves/Daniela.json`

`apps/api/saves/Jallah.json`

Verify actual paths and case.

Do not assume this list is exhaustive.

## Safety requirements

Do not:

* Reset Git.
* Clean unrelated files.
* Switch branches.
* Commit changes.
* Modify personal saves.
* Modify environment files.
* Restore intentionally deleted saves.
* Delete historical handoffs.
* Overwrite unrelated documentation.

---

# 7. CURRENT VISUAL ARCHITECTURE

Inspect only the source files necessary to describe the current World Web rendering architecture.

Document:

1. World Web entry point.
2. Main map renderer.
3. Scenic terrain layer.
4. Region artwork.
5. Region boundaries.
6. Region labels.
7. Building marker layer.
8. Building artwork mapping.
9. Building visual scaling.
10. Building ground-contact treatment.
11. Transport overlay.
12. Resource heatmap.
13. Region selection.
14. Region inspector.
15. Camera.
16. Minimap.
17. Responsive behavior.

Use actual repository paths.

Do not invent component names.

Do not assume that historical documentation reflects the current implementation exactly.

## Required output

Provide a concise architecture map:

| Visual element | Current implementation | Source location | Preservation rule |
| -------------- | ---------------------- | --------------- | ----------------- |

Distinguish:

* Background artwork.
* Interactive overlays.
* Simulation-driven entities.
* Presentation-only elements.

---

# 8. SCENIC TERRAIN BASELINE

Document the current terrain presentation.

Include:

* Region artwork paths.
* Artwork dimensions.
* Artwork hashes.
* Image formats.
* Layering behavior.
* Region positioning.
* Relationship to camera transforms.

Known historical region artwork paths include:

`apps/web/public/images/world/regions/central-basin.webp.png`

`apps/web/public/images/world/regions/eastern-industrial-belt.webp.png`

`apps/web/public/images/world/regions/northern-highlands.webp.png`

`apps/web/public/images/world/regions/southern-coastal-belt.webp.png`

Verify the actual current paths.

Do not assume all historical files are still used.

## Important

Trees, rivers, and paths may be embedded in static artwork.

Do not describe them as independently simulated objects unless the current source supports that claim.

Do not invent their world coordinates.

---

# 9. REGION-LABEL BASELINE

Document the exact current label implementation.

Include:

* Rendering component.
* Style source.
* Font size rules.
* Fill color.
* Stroke or outline.
* Shadow.
* Zoom behavior.
* Visibility thresholds.
* Responsive rules.
* Selection-dependent behavior.

Record actual values from the current source.

Do not infer values solely from historical reports.

## Required preservation statement

`REGION_LABEL_PRESENTATION_FROZEN`

The current approved appearance must remain the default in future unrelated development.

Future changes require explicit project-owner approval.

Do not implement changes now.

---

# 10. BUILDING-PRESENTATION BASELINE

Document:

* Building marker source.
* Building entity mapping.
* Building artwork paths.
* Sprite dimensions.
* Sprite scaling rules.
* Zoom-dependent behavior.
* Existing visual anchors.
* Existing decorative offsets.
* Existing ground-contact shadows.
* Existing layer ordering.
* Existing selection behavior.

Known historical building artwork includes:

`apps/web/public/images/world/buildings/headquarters.png`

`apps/web/public/images/world/buildings/warehouse.png`

`apps/web/public/images/world/buildings/substation.png`

`apps/web/public/images/world/buildings/access-road.png`

`apps/web/public/images/world/buildings/sawmill.png`

Verify actual paths and usage.

## Important

Document the latest grounding implementation as it exists.

Do not describe its visual benefit as conclusively established if the evidence does not support that conclusion.

## Required preservation statements

`BUILDING_SCALE_FROZEN`

`BUILDING_WORLD_POSITIONS_PRESERVED`

`BUILDING_ARTWORK_FROZEN`

---

# 11. CAMERA AND MINIMAP BASELINE

Document:

* Current camera state model.
* Pan behavior.
* Zoom behavior.
* Building zoom scaling.
* Region-label zoom behavior.
* Minimap synchronization.
* Region Focus behavior.
* Relevant responsive behavior.

Do not modify these systems.

## Preservation requirement

Future unrelated features must not change established camera and minimap contracts without explicit authorization.

---

# 12. TRANSPORT AND RESOURCE-LAYER BASELINE

Document the current layer model.

Include:

* Transport route presentation.
* Resource heatmap.
* Layer toggles.
* Legend.
* Region inspector integration.
* Relevant keyboard behavior.

Historical approved defaults include:

* Transport layer ON by default.
* Resource heatmap OFF by default.

Verify the current implementation.

If actual behavior differs from historical documentation:

* Record the discrepancy.
* Do not silently correct it.
* Do not modify the implementation during this task.

---

# 13. VISUAL BASELINE SCREENSHOTS

Use existing authentic browser screenshots where sufficient.

Do not create a new extensive screenshot suite.

## Preferred evidence

Include:

1. Current desktop world overview.
2. Current region-label presentation.
3. Current building presentation.
4. Current building-grounding appearance.
5. Current transport overlay, if available.
6. Current resource-layer presentation, if available.

## Evidence rules

Every screenshot must identify:

* Source.
* Capture date if known.
* Viewport if known.
* Camera zoom if known.
* Relevant layer state if known.
* Whether the screenshot represents the current repository.

Do not invent missing metadata.

## Current-state distinction

Historical screenshots may be included for context.

Do not label historical screenshots as current-state evidence unless their correspondence with the current implementation is verified.

## Optional browser capture

If no suitable current screenshot exists, capture only the minimum needed to document the current baseline.

Do not alter personal saves.

Do not generate synthetic artwork.

Do not fabricate visual evidence.

If a current screenshot cannot be obtained, record:

`CURRENT_VISUAL_SCREENSHOT_NOT_VERIFIED`

This is a documentation limitation, not permission to modify the renderer.

---

# 14. KNOWN VISUAL LIMITATIONS

Document the remaining limitations honestly.

At minimum, evaluate whether the following remain applicable:

## VBL-LIM-001 — Building-to-terrain scale

Buildings may appear relatively large compared with trees and other scenic features.

This is currently accepted.

No resizing is authorized.

## VBL-LIM-002 — Static terrain artwork

Trees, rivers, and paths embedded in terrain images cannot be manipulated as independent world objects.

Document the actual implementation.

## VBL-LIM-003 — Perspective mismatch

Separate building sprites may not perfectly match the scenic terrain projection.

Document only what is supported by current evidence.

## VBL-LIM-004 — Limited grounding improvement

The latest grounding implementation produced limited independently demonstrated visual change.

Do not overstate its effect.

## VBL-LIM-005 — Scene-dependent visual consistency

Building integration may vary depending on the background terrain.

Do not invent evidence for untested scenes.

## VBL-LIM-006 — Visual-reference gap

The current World Web does not necessarily reproduce the fully integrated look of the owner's reference strategy-world image.

Record this as a future art-direction consideration.

Do not treat it as an immediate defect requiring another polish pass.

## VBL-LIM-007 — Evidence limitations

Record any missing screenshots, unavailable references, or unverified behaviors.

### Required classification

Each limitation must be marked:

* `ACCEPTED_CURRENT_BASELINE`
* `FUTURE_OPTIONAL_IMPROVEMENT`
* `NOT_VERIFIED`
* `NO_LONGER_APPLICABLE`

Use evidence for the classification.

Do not silently erase known limitations.

---

# 15. VISUAL BASELINE FREEZE CONTRACT

Create a clear preservation contract for future Cursor tasks.

## Frozen by owner decision

1. Region-label appearance.
2. Current building sizes.
3. Current building artwork.
4. Current terrain artwork.
5. Current visual-polish closure decision.

## Preserved by existing technical contracts

1. World coordinates.
2. Building entity identity.
3. Building positions.
4. Building selection behavior.
5. Camera behavior.
6. Minimap behavior.
7. Construction behavior.
8. Transport semantics.
9. Savegame schemas.
10. API contracts.

## Not permanently prohibited

Future work may revisit:

* World illustration style.
* Building artwork style.
* Building perspective.
* Terrain integration.
* New scenic features.

However, these require a new, explicitly approved scope.

Do not treat this baseline freeze as a permanent ban on future art direction.

## Mandatory future-task instruction

Future Cursor prompts affecting World Web rendering must:

1. Read this baseline document.
2. Identify affected frozen elements.
3. State whether owner approval exists.
4. Preserve unrelated frozen elements.
5. Include focused regression evidence.
6. Avoid reopening completed polish tasks by default.

---

# 16. CHANGE-CONTROL RULES

Document a simple decision process.

## Category A — Unrelated gameplay development

Allowed to proceed without reopening visual work.

Must preserve the visual baseline.

## Category B — New gameplay-driven visual feature

May add necessary visual elements.

Must preserve frozen existing presentation unless explicitly authorized.

## Category C — Targeted visual correction

Requires:

* Specific reproducible defect.
* Defined scope.
* Explicit approval if a frozen property is affected.
* Focused evidence.

## Category D — Major art-direction upgrade

Requires:

* Separate project-owner decision.
* Defined visual target.
* Asset strategy.
* Technical feasibility.
* Preservation plan.
* Acceptance criteria.

Do not implement Category C or D during this task.

---

# 17. FUTURE DEVELOPMENT HANDOVER

Create a concise handover for the next Project Genesis development increment.

The handover must explain:

* What is visually stable.
* What is approved.
* What is intentionally unchanged.
* Which historical tasks are closed.
* Which limitations are accepted.
* Which files future developers should inspect.
* Which protected assets must not be modified.
* Which tests are relevant for regression checks.
* Which visual work should not be repeated.

## Important

Do not choose the next gameplay feature without owner input.

Do not invent a new product roadmap.

Do not create a new visual implementation prompt.

The next development task will be selected separately.

---

# 18. NO NEW AUDIT CYCLE

This is a bounded documentation task.

Do not:

* Run the entire historical test suite.
* Reopen all prior visual handoffs.
* Perform a full architecture audit.
* Perform a full security audit.
* Revalidate every previous acceptance criterion.
* Generate new comparison matrices for old screenshots.
* Create new visual experiments.
* Repeatedly recapture screenshots.
* Investigate unrelated repository areas.

Use the minimum evidence needed to establish an accurate baseline.

If a historical claim cannot be independently verified, mark it accordingly.

Do not turn documentation uncertainty into an endless investigation.

---

# 19. DOCUMENTATION OUTPUT LOCATION

Create one canonical baseline document at:

`D:\Cursor\Project Genesis\docs\development\WORLD_WEB_VISUAL_BASELINE.md`

This document is intended to be the primary reference for future World Web development.

## Required sections

1. Purpose.
2. Baseline status.
3. Owner-approved decisions.
4. Current visual architecture.
5. Terrain artwork.
6. Region labels.
7. Building presentation.
8. Camera and minimap.
9. Transport and resource overlays.
10. Known limitations.
11. Preservation contract.
12. Change-control rules.
13. Relevant source files.
14. Relevant tests.
15. Historical handoff references.
16. Future developer checklist.

## Documentation quality

Keep it concise and operational.

Avoid copying entire historical reports.

Use exact paths and source references.

Do not invent values.

Do not describe unverified behavior as verified.

---

# 20. REQUIRED HANDOFF DOCUMENTS

Create one final handoff containing the following files.

## 20.1 `FINAL_REPORT.md`

Include:

* Executive summary.
* Task scope.
* Baseline decision.
* Documentation changes.
* Verified facts.
* Historical limitations.
* Preservation results.
* Final verdict.

## 20.2 `WORLD_WEB_VISUAL_BASELINE.md`

Include a copy of the canonical baseline document.

The canonical repository document remains the source of truth.

## 20.3 `VISUAL_BASELINE_ARCHITECTURE.md`

Provide the concise visual architecture map.

## 20.4 `VISUAL_BASELINE_FREEZE_CONTRACT.md`

Document:

* Frozen properties.
* Preserved technical contracts.
* Future approval requirements.
* Change-control rules.

## 20.5 `VISUAL_BASELINE_KNOWN_LIMITATIONS.md`

Record accepted limitations and future optional improvements.

## 20.6 `VISUAL_BASELINE_HISTORY.md`

Summarize the closed visual increments.

Distinguish:

* Implemented.
* Verified.
* Administratively closed.
* Limited.

Do not overstate historical outcomes.

## 20.7 `VISUAL_BASELINE_SOURCE_REFERENCES.json`

Include:

* Relevant source files.
* Relevant artwork.
* Relevant documentation.
* SHA-256 values where appropriate.

## 20.8 `VISUAL_BASELINE_PRESERVATION.json`

Include:

* Preflight state.
* Postflight state.
* Protected hashes.
* Artwork hashes.
* Deleted-save absence states.
* Existing WIP handling.
* Unexpected changes.
* Preservation verdict.

## 20.9 `VISUAL_BASELINE_HANDOVER.md`

Provide the practical developer handover.

## 20.10 `VISUAL_BASELINE_KNOWN_EVIDENCE_GAPS.md`

Record only material evidence limitations.

## 20.11 `handoff-manifest.json`

Include SHA-256 and file size for every packaged file except the manifest itself.

## 20.12 Optional screenshots

Include only authentic screenshots needed to identify the baseline.

Do not include personal saves, secrets, or unrelated files.

---

# 21. POSTFLIGHT PRESERVATION

After writing documentation:

1. Record branch.
2. Record HEAD.
3. Record Git status.
4. Verify intended documentation changes.
5. Compare application-source hashes.
6. Compare region-artwork hashes.
7. Compare building-artwork hashes.
8. Compare protected-file hashes.
9. Compare deleted-save absence states.
10. Identify unrelated WIP.
11. Confirm no application changes occurred.
12. Confirm no gameplay changes occurred.

## Expected result

`APPLICATION_SOURCE_UNCHANGED`

`REGION_LABELS_UNCHANGED`

`BUILDING_SCALE_UNCHANGED`

`TERRAIN_ARTWORK_UNCHANGED`

`BUILDING_ARTWORK_UNCHANGED`

`GAMEPLAY_DATA_UNCHANGED`

`PROTECTED_USER_DATA_UNCHANGED`

Do not claim a result without supporting checks.

The canonical baseline document and final handoff files are the only intended repository additions or modifications.

---

# 22. FINAL HANDOFF ZIP

Create exactly one archive:

`project-genesis-post-v1-world-web-visual-baseline-freeze-and-handover.zip`

Target location:

`D:\Cursor\Project Genesis\docs\architecture\reviews\project-genesis-post-v1-world-web-visual-baseline-freeze-and-handover.zip`

Do not overwrite historical handoffs.

Do not create additional archives.

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

# 24. ACCEPTANCE CRITERIA

## VBF-AC-001 — Canonical baseline created

`docs/development/WORLD_WEB_VISUAL_BASELINE.md` exists and accurately describes the current implementation.

## VBF-AC-002 — Approved region labels documented

Current label styling is recorded and frozen.

## VBF-AC-003 — Building sizes documented

Current building scaling is recorded and frozen.

## VBF-AC-004 — Artwork documented

Relevant region and building assets are identified.

## VBF-AC-005 — Architecture documented

The current rendering structure is accurately summarized.

## VBF-AC-006 — Historical limitations preserved

Known visual and evidence limitations are not misrepresented as successes.

## VBF-AC-007 — Change control established

Future approval rules are explicit.

## VBF-AC-008 — Development handover complete

Future developers can identify protected properties and relevant files.

## VBF-AC-009 — Application preserved

No application source or gameplay changes occurred.

## VBF-AC-010 — Protected data preserved

Personal saves, environment files, artwork, and deleted-save absence states remain intact.

## VBF-AC-011 — Handoff integrity

The ZIP and manifest pass integrity validation.

### Allowed statuses

* `PASS`
* `FAIL`
* `NOT_VERIFIED`
* `NOT_APPLICABLE`

Do not invent additional status values.

---

# 25. FINAL VERDICT

Assign exactly one verdict.

## OPTION A — BASELINE FROZEN AND VERIFIED

Use if:

* The canonical baseline exists.
* Approved visual decisions are documented.
* Known limitations are accurately recorded.
* Preservation is verified.
* Handoff integrity passes.

## OPTION B — BASELINE FROZEN WITH LIMITATIONS

Use if:

* The canonical baseline exists.
* Main decisions are documented.
* Some noncritical evidence remains unavailable.
* No confirmed critical preservation breach exists.

## OPTION C — BASELINE INCOMPLETE

Use if:

* Required baseline information is missing.

## OPTION D — BLOCKED

Use if:

* A critical dependency prevents safe documentation.

## OPTION E — NOT STARTED

Use if:

* The task could not begin.

Do not force OPTION A.

---

# 26. FINAL CURSOR RESPONSE

Your final response must include:

## A. Baseline status

Confirm whether the visual baseline was created.

## B. Canonical document

Provide the exact path:

`docs/development/WORLD_WEB_VISUAL_BASELINE.md`

## C. Frozen owner decisions

Confirm:

* Region-label presentation frozen.
* Building scale frozen.
* Terrain artwork frozen.
* Building artwork frozen.
* Current scenic-polish iteration closed.

## D. Current architecture

Summarize the rendering layers.

## E. Known limitations

Summarize the accepted visual limitations.

## F. Preservation

Confirm what was actually verified.

## G. Documentation changes

List all changed or created documentation files.

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

# 27. FINAL NON-NEGOTIABLE INSTRUCTIONS

This is a documentation and handover task.

Do not modify application source.

Do not modify CSS.

Do not modify SVG.

Do not modify React components.

Do not modify artwork.

Do not modify region labels.

Do not modify building sizes.

Do not modify building positions.

Do not modify camera behavior.

Do not modify minimap behavior.

Do not modify transport behavior.

Do not modify construction behavior.

Do not modify gameplay.

Do not modify APIs.

Do not modify savegame schemas.

Do not modify personal saves.

Do not modify environment files.

Do not restore intentionally deleted saves.

Do not reopen historical audits.

Do not begin another scenic-polish cycle.

Do not claim that limited visual improvements were major successes.

Do not invent measurements, screenshots, or verification results.

Create one canonical baseline document.

Create one verified handoff ZIP.

**The purpose of this task is to preserve the current approved World Web presentation, document its known limitations honestly, and allow Project Genesis development to continue without repeatedly revisiting the same visual-polish work.**
