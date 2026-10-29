# PROJECT GENESIS — POST-V1 WORLD WEB

# SCENIC SCALE AND PERSPECTIVE REVIEW

## 0. MISSION

You are Cursor working in the existing Project Genesis repository:

`D:\Cursor\Project Genesis`

Your assignment is to perform a **single, bounded, read-only visual and technical review** of scale, perspective, and scenic integration in the existing World Web map.

The project owner has reviewed the latest World Web screenshots and approved the current region-label presentation.

The project owner has also decided **not to change building sizes at this stage**.

The objective is to understand whether the existing buildings, trees, rivers, roads or paths, and landscape artwork form a visually coherent strategy-game world.

This is a **review and recommendation task only**.

Do not implement visual changes.

Do not change building sizes.

Do not modify region labels.

Do not modify artwork.

Do not change gameplay.

Do not start a new development or audit cycle.

### Primary questions

1. What visual scale relationships currently exist between buildings, trees, rivers, and terrain?
2. Are the existing building assets perspective-compatible with the world background?
3. Do the buildings appear visually grounded in the landscape?
4. Does the map use a consistent visual projection?
5. How do camera zoom and responsive layouts affect apparent object sizes?
6. Which visual inconsistencies are meaningful enough to address in a future implementation?
7. Which improvements could be made without changing building sizes, world coordinates, save data, or gameplay?
8. What is the smallest useful future implementation step, if any?

Produce evidence-based answers using the actual repository and existing visual assets.

Do not invent measurements or unsupported conclusions.

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
* Evidence requirements.
* Handoff requirements.

Follow the guide.

If the guide cannot be read, stop and report:

`BLOCKED — IMPLEMENTATION GUIDE UNAVAILABLE`

Do not continue based on assumptions.

---

# 2. PROJECT-OWNER DECISIONS — AUTHORITATIVE

The following decisions are binding.

## 2.1 Region labels are approved

The project owner explicitly approved the latest region-label presentation.

The approved characteristics are:

* Current apparent label size.
* Light or white lettering.
* Dark contrast outline.
* Good readability against the landscape.
* Controlled behavior during zoom.

**Do not change region-label implementation or styling.**

Do not recommend reopening region-label work unless you identify a specific, reproducible functional defect.

General aesthetic preference is not sufficient justification.

## 2.2 Building sizes remain unchanged

The project owner observed that buildings appear relatively large compared with the landscape.

The project owner nevertheless decided:

**Leave building sizes unchanged for now.**

Do not:

* Reduce building scale.
* Increase building scale.
* Change building sprite dimensions.
* Change building world positions.
* Change building zoom behavior.
* Change building selection geometry.

The review may identify potential scale inconsistencies, but any future size change requires separate owner approval.

## 2.3 Current map architecture remains intact

Do not propose a complete renderer replacement as the default solution.

Preserve:

* Existing world geometry.
* Existing region coordinates.
* Existing camera system.
* Existing minimap.
* Existing construction system.
* Existing building data.
* Existing transport semantics.
* Existing artwork.
* Existing savegame contracts.

## 2.4 Reference-image direction

The owner selected a long-term visual direction toward a more dimensional, inhabited strategy-game world.

The reference image contains:

* Scenic terrain.
* Forests and individual trees.
* Rivers and waterways.
* Roads or paths.
* Prominent buildings.
* Consistent lighting.
* Grounding shadows.
* A visually coherent environment.

This is an art-direction reference.

Do not copy third-party artwork or geometry.

---

# 3. PROJECT BASELINE

The following increments are administratively closed:

1. Slice 5 — Visual Polish & Game UI.
2. Slice 6 — Scenic World Operations & Logistics Presentation.
3. Scenic Map Visual Enhancement.
4. Scenic Map Visual Composition Upgrade.
5. Scenic Building Integration.

Do not reopen their historical acceptance programs.

The latest building-integration handoff is:

`project-genesis-post-v1-world-web-scenic-building-integration-handoff.zip`

Previously reviewed ZIP SHA-256:

`30da25d5b639807eaf0d3df1314a93aa48cc88d6e40015924b2db9a79e24ca2e`

Use the current repository state as the implementation source of truth.

Use previous handoffs only for relevant context.

Do not reconstruct historical audit chains.

---

# 4. STRICT REVIEW SCOPE

## In scope

* Existing world background artwork.
* Existing building artwork.
* Existing tree and forest representations.
* Existing river and waterway representations.
* Existing roads or paths, if present.
* Existing map projection.
* Existing building placement conventions.
* Existing visual anchoring.
* Existing shadow and lighting treatment.
* Existing camera zoom.
* Existing responsive rendering.
* Existing layer composition.
* Data-driven building positioning.
* Future visual-integration feasibility.

## Out of scope

* Source-code implementation changes.
* Artwork editing.
* Building resizing.
* Region-label changes.
* New building types.
* New terrain systems.
* New road networks.
* New gameplay mechanics.
* New backend APIs.
* Save schema changes.
* World-coordinate changes.
* Camera replacement.
* Minimap replacement.
* Hex-grid conversion.
* 3D engine integration.
* Unrelated architecture review.
* Historical acceptance revalidation.

Do not expand the scope.

---

# 5. READ-ONLY AND PRESERVATION REQUIREMENTS

This is a read-only review of application source, artwork, and gameplay data.

Before reviewing:

1. Record current Git branch.
2. Record current HEAD.
3. Record Git status.
4. Identify existing tracked and untracked WIP.
5. Identify protected data.
6. Record relevant source-file hashes.
7. Record relevant artwork hashes.

## Protected categories

Preserve:

* Personal save files.
* Environment files.
* Deleted saves expected to remain absent.
* Region artwork.
* Building artwork.
* Save backups.
* Unrelated WIP.
* Existing diagnostic scripts.
* Existing browser harnesses.
* Historical handoffs.

Known examples include:

`Saves/browser-session.json`

`apps/web/.env.local`

`apps/api/saves/Daniela.json`

`apps/api/saves/Jallah.json`

Verify actual paths and case.

Do not assume this list is exhaustive.

## Review execution

If browser inspection requires temporary files or synthetic fixtures:

* Use isolated temporary locations.
* Do not modify personal saves.
* Do not modify application source.
* Do not alter existing test harnesses.
* Clean up temporary state.
* Document what was created and removed.

Do not reset or clean unrelated WIP.

Do not commit or switch branches.

---

# 6. REFERENCE MATERIAL

The project owner supplied two relevant visual references.

## 6.1 Current Project Genesis screenshot

The current screenshot shows:

* A scenic terrain background.
* Mountains.
* Forests.
* Rivers.
* Distinct regions.
* Region boundaries.
* Approved light-colored region labels.

Use this image to understand the current visual presentation.

## 6.2 Desired strategy-world reference

The desired reference shows:

* A landscape containing many individually recognizable trees.
* Winding rivers.
* Roads or paths.
* Buildings placed within the environment.
* Building shadows.
* Terrain details.
* A coherent elevated or pseudo-isometric viewing angle.

The buildings are relatively prominent.

The reference should not be interpreted as requiring strict real-world scale.

## 6.3 Reference availability

Check whether both images are actually available in Cursor's working context.

Do not invent file paths.

If available, inspect them.

If unavailable, record:

* `CURRENT_SCREENSHOT_NOT_AVAILABLE`
* `ART_DIRECTION_REFERENCE_NOT_AVAILABLE`

as applicable.

Continue with repository assets and available browser evidence.

Do not claim direct image comparison if an image is missing.

---

# 7. REVIEW QUESTION 1 — EXISTING MAP PROJECTION

Inspect the actual World Web rendering architecture.

Identify:

* Rendering technology.
* World coordinate system.
* Camera transforms.
* Region artwork positioning.
* Building artwork positioning.
* Sprite scaling rules.
* Layer ordering.
* Any projection or pseudo-perspective conventions.

Determine whether the current map uses:

* A flat image projection.
* A perspective illustration.
* A pseudo-isometric visual style.
* A combination of these.

Do not classify the map as a true 3D or isometric system without evidence.

## Required conclusion

Explain whether the existing building artwork is visually compatible with the landscape projection.

Separate:

* Verified technical facts.
* Visual observations.
* Reasoned inferences.
* Unknowns.

---

# 8. REVIEW QUESTION 2 — BUILDING-TO-TREE SCALE

Inspect the current landscape and building artwork.

Determine whether individual trees are identifiable and measurable in the available imagery.

If they are:

* Select representative examples.
* Measure apparent image-space tree height or width.
* Measure representative building dimensions.
* Compare them using the same visual coordinate system.
* Record the measurement method.

If individual trees are baked into a background image:

* Document that fact.
* Explain the limitations of direct scale comparison.
* Do not invent tree world coordinates.

## Required output

Provide a table with:

* Building type.
* Building image-space dimensions.
* Representative tree image-space dimensions.
* Apparent size ratio.
* Measurement source.
* Confidence level.

Use `NOT_MEASURABLE` where appropriate.

## Important

Do not interpret image-space ratios as real-world physical dimensions.

Do not automatically recommend smaller buildings.

---

# 9. REVIEW QUESTION 3 — BUILDING-TO-RIVER SCALE

Inspect rivers and waterways visible in the current artwork.

Determine:

* Whether rivers are baked into the terrain image.
* Whether water features exist as separate renderable layers.
* Whether river width varies visually.
* Whether the current building artwork appears proportionally compatible.

Where measurements are possible:

* Compare representative building width with visible river width.
* Use the same screenshot and zoom level.
* Record the measurement locations.
* Distinguish narrow streams from broad river sections.

Do not use one arbitrary river section as a universal scale standard.

## Required output

Provide:

* Representative comparison.
* Image-space ratio where measurable.
* Visual interpretation.
* Limitations.
* Whether any future adjustment is actually necessary.

Do not recommend river resizing without clear evidence.

---

# 10. REVIEW QUESTION 4 — BUILDING-TO-ROAD SCALE

Determine whether actual roads or paths are represented in the current map.

Distinguish:

1. Roads baked into background artwork.
2. Roads represented by actual game data.
3. Transport-order connections.
4. Decorative paths.
5. Construction-related access roads.

Do not treat these as interchangeable.

If roads or paths are visible:

* Inspect their apparent width.
* Compare them with building footprints.
* Assess whether their visual relationship is coherent.

If no authoritative road geometry exists:

* Record that limitation.
* Do not invent a road network.
* Do not propose fake road connectivity as an immediate implementation.

## Required conclusion

Explain what road or path integration is feasible without changing gameplay data.

---

# 11. REVIEW QUESTION 5 — BUILDING PERSPECTIVE

Inspect existing building assets.

Evaluate:

* Viewing angle.
* Roof visibility.
* Visible wall proportions.
* Apparent depth.
* Vertical orientation.
* Image anchor point.
* Perspective consistency across building types.

Compare these characteristics with the terrain artwork.

## Required questions

* Do buildings appear to be viewed from a compatible angle?
* Do some assets use noticeably different perspectives?
* Are building sprites visually too upright or too flat?
* Are image anchors consistent?
* Do building shadows match the implied perspective?

Do not modify artwork.

Do not recommend a full asset replacement unless the evidence clearly shows that the existing assets cannot work.

---

# 12. REVIEW QUESTION 6 — LIGHTING AND GROUNDING

Inspect:

* Existing building shadows.
* Shadow direction.
* Shadow softness.
* Terrain lighting.
* Terrain highlights.
* Building contrast.
* Ground-contact appearance.

Determine whether buildings appear:

* Anchored.
* Floating.
* Pasted onto the background.
* Consistent with surrounding terrain.

## Important distinction

A building may appear disconnected because of:

* Incorrect shadow treatment.
* Incorrect anchor point.
* Incompatible perspective.
* Excessive contrast.
* Missing local ground treatment.
* Inconsistent artwork style.

Do not assume building size is the cause.

## Required output

Rank the likely visual causes of poor integration.

Use:

* `HIGH_CONFIDENCE`
* `MEDIUM_CONFIDENCE`
* `LOW_CONFIDENCE`
* `NOT_VERIFIED`

Support each assessment with evidence.

---

# 13. REVIEW QUESTION 7 — CAMERA AND ZOOM

Inspect the existing camera and building-scaling behavior.

Determine:

* How terrain scales.
* How buildings scale.
* How region labels scale.
* Whether buildings use bounded apparent scaling.
* Whether relative building-to-terrain proportions change during zoom.
* Whether building positions remain aligned.

## Important

Region-label styling is approved and must remain unchanged.

The review may inspect label scaling only to understand the rendering architecture.

Do not propose changing labels.

## Required browser views

Where practical, inspect:

* Low zoom.
* Normal overview zoom.
* Region Focus zoom.
* High zoom.
* Desktop viewport.
* Mobile viewport.

Document whether visual scale relationships remain coherent.

---

# 14. REVIEW QUESTION 8 — DATA AND POSITIONING LIMITATIONS

Inspect the existing building-data contract.

Identify:

* Building entity identity.
* Building type.
* Region association.
* Available position data.
* Visual position derivation.
* Artwork mapping.
* Selection behavior.

Determine whether building locations are:

* Authoritative world coordinates.
* Derived from region positions.
* Deterministic presentation positions.
* Aggregated region-level representations.

## Critical requirement

Do not confuse a visual display anchor with a simulation-authoritative location.

Document what the current data actually supports.

Do not invent exact building coordinates.

Do not propose save-schema changes as the default solution.

---

# 15. VISUAL COHERENCE ASSESSMENT

Evaluate the current map using these categories:

## VSC-001 — Projection consistency

Do terrain and buildings appear compatible?

## VSC-002 — Building-to-tree relationship

Do visible sizes appear plausible for a strategy-game presentation?

## VSC-003 — Building-to-river relationship

Do buildings and waterways appear proportionally coherent?

## VSC-004 — Building-to-road relationship

Are available roads or paths visually compatible with buildings?

## VSC-005 — Grounding

Do buildings appear connected to the terrain?

## VSC-006 — Lighting

Are lighting and shadows reasonably consistent?

## VSC-007 — Zoom consistency

Do apparent relationships remain coherent across camera zoom levels?

## VSC-008 — Data accuracy

Does the visual presentation respect actual building data and positioning limitations?

## VSC-009 — Visual hierarchy

Do landscape, buildings, routes, and labels have appropriate visual priority?

## VSC-010 — Implementation feasibility

Can meaningful improvements be achieved without changing building size or gameplay architecture?

### Allowed assessment results

Use:

* `COHERENT`
* `MINOR_INCONSISTENCY`
* `SIGNIFICANT_INCONSISTENCY`
* `NOT_VERIFIED`
* `NOT_APPLICABLE`

Each result must include evidence and confidence.

Do not use subjective impressions as proof of technical defects.

---

# 16. SCREENSHOT EVIDENCE

Use existing screenshots where sufficient.

Capture additional browser screenshots only when needed to answer a specific review question.

Do not create a large new screenshot suite.

## Recommended views

1. World overview.
2. Representative building area.
3. Building near forest.
4. Building near water, if available.
5. Low zoom.
6. High zoom.

If an appropriate scene is unavailable:

* Record `SCENE_NOT_AVAILABLE`.
* Explain why.
* Do not fabricate one.

## Evidence integrity

Do not:

* Generate mock screenshots.
* Use AI-generated images as browser evidence.
* Edit screenshots to exaggerate differences.
* Compare different zoom levels without accounting for scale.
* Present synthetic fixtures as personal game state.

A synthetic fixture may be used only if isolated, explicitly identified, and cleaned up.

---

# 17. MEASUREMENT METHODOLOGY

Document the measurement method before presenting numerical ratios.

Prefer:

* Image-space pixel measurements.
* Known viewport dimensions.
* Known camera zoom.
* Known sprite bounds.
* Existing renderer transforms.

For every ratio, identify:

* Numerator.
* Denominator.
* Measurement source.
* Camera zoom.
* Viewport.
* Assumptions.
* Confidence.

Do not invent physical dimensions.

Do not present rough visual estimates as exact measurements.

If a measurement cannot be made reliably, state:

`NOT_MEASURABLE`

---

# 18. RECOMMENDATION RULES

Recommendations must be:

* Specific.
* Evidence-based.
* Compatible with the existing architecture.
* Limited in scope.
* Safe for existing data.
* Ranked by expected visual impact.
* Ranked by implementation risk.

## Preferred recommendation order

Evaluate these possibilities before proposing building-size changes:

1. Improve building ground-contact treatment.
2. Improve building shadow consistency.
3. Improve artwork anchor alignment.
4. Improve contrast against terrain.
5. Improve layer ordering.
6. Improve local visual separation.
7. Improve perspective consistency where existing assets allow it.

Do not recommend all of them automatically.

Recommend only changes supported by the actual review.

## Building-size restriction

You may document a possible scale inconsistency.

However:

**Do not recommend immediate building resizing as the default next step.**

If a future scale change appears justified, mark it:

`REQUIRES_EXPLICIT_OWNER_APPROVAL`

## Region-label restriction

The approved label design is frozen.

Do not recommend cosmetic changes to it.

---

# 19. FUTURE IMPLEMENTATION OPTIONS

Provide at most three realistic options.

For each option include:

* Objective.
* Expected visual benefit.
* Exact affected rendering areas.
* Data requirements.
* Artwork requirements.
* Risk.
* Estimated implementation complexity.
* Preservation implications.
* Whether building sizes would change.
* Whether owner approval is required.

Use these categories:

### OPTION 1 — NO CHANGE

Keep the current presentation.

Use if the visual relationships are already sufficiently coherent.

### OPTION 2 — LIGHTWEIGHT SCENIC INTEGRATION

Improve grounding, anchors, shadows, or layer treatment without changing building sizes.

Use if these are the main identified issues.

### OPTION 3 — TARGETED ARTWORK OR PROJECTION WORK

Recommend a separately approved future implementation only if the current assets or projection create a significant limitation.

Do not treat this as authorization to implement it.

## Required final recommendation

Select one preferred option.

Explain why.

Do not automatically select the most complex option.

---

# 20. REVIEW BOUNDARIES

This task must remain a single bounded review.

Do not:

* Perform a full repository audit.
* Revalidate every historical acceptance criterion.
* Investigate unrelated gameplay systems.
* Create a new rendering prototype.
* Rewrite components.
* Modify CSS.
* Modify SVG.
* Modify artwork.
* Modify save data.
* Start an implementation cycle.
* Request repeated verification passes.

If evidence is insufficient, document the limitation and make a conditional recommendation.

Do not continue indefinitely searching for perfect evidence.

---

# 21. POSTFLIGHT PRESERVATION

At completion:

1. Record Git branch.
2. Record HEAD.
3. Record Git status.
4. Compare relevant source-file hashes.
5. Compare protected-file hashes.
6. Compare artwork hashes.
7. Verify protected deleted-save absence states.
8. Identify any temporary files.
9. Confirm temporary cleanup.
10. Record unexpected changes.

The expected result is:

`APPLICATION_SOURCE_UNCHANGED`

`ARTWORK_UNCHANGED`

`BUILDING_SCALE_UNCHANGED`

`REGION_LABELS_UNCHANGED`

`GAMEPLAY_DATA_UNCHANGED`

Do not claim these results unless verified.

Review documentation and the final handoff archive are permitted outputs.

---

# 22. REQUIRED HANDOFF DOCUMENTS

Create one final review handoff containing the following files.

## 22.1 `FINAL_REPORT.md`

Include:

* Executive summary.
* Scope.
* Project-owner decisions.
* Key findings.
* Visual coherence assessment.
* Recommended next step.
* Preservation result.
* Limitations.
* Final verdict.

## 22.2 `SCENIC_SCALE_AND_PERSPECTIVE_ANALYSIS.md`

Explain the actual rendering and projection findings.

## 22.3 `SCENIC_SCALE_MEASUREMENTS.md`

Include:

* Building-to-tree comparisons.
* Building-to-river comparisons.
* Building-to-road comparisons.
* Measurement methods.
* Sources.
* Assumptions.
* Confidence.
* `NOT_MEASURABLE` results where applicable.

## 22.4 `BUILDING_PERSPECTIVE_AND_GROUNDING_REPORT.md`

Document:

* Building asset perspectives.
* Terrain perspective.
* Anchor behavior.
* Shadows.
* Lighting.
* Ground-contact appearance.
* Evidence-based limitations.

## 22.5 `SCENIC_VISUAL_COHERENCE_MATRIX.json`

Include VSC-001 through VSC-010.

For each criterion record:

* Result.
* Evidence.
* Confidence.
* Limitations.

## 22.6 `SCENIC_SCALE_RECOMMENDATIONS.md`

Include:

* Ranked findings.
* At most three future options.
* Preferred option.
* Expected visual impact.
* Implementation complexity.
* Risks.
* Owner-approval requirements.

## 22.7 `SCENIC_SCALE_SOURCE_REFERENCES.json`

Include:

* Relevant source files.
* Relevant artwork.
* Relevant documentation.
* SHA-256 values where appropriate.

## 22.8 `SCENIC_SCALE_PRESERVATION.json`

Include:

* Preflight state.
* Postflight state.
* Protected hashes.
* Artwork hashes.
* Deleted-save absence states.
* Existing WIP handling.
* Unexpected changes.
* Preservation verdict.

## 22.9 `SCENIC_SCALE_KNOWN_LIMITATIONS.md`

Record only material evidence limitations.

## 22.10 `SCENIC_SCALE_HANDOVER.md`

Explain:

* Current visual architecture.
* Important findings.
* Approved label presentation.
* Frozen building sizes.
* Recommended next action.
* Relevant source locations.
* Preservation constraints.

## 22.11 `handoff-manifest.json`

Include SHA-256 and size for every packaged file except the manifest itself.

## 22.12 Optional browser evidence

Include only screenshots needed to support specific findings.

Do not include personal saves, environment secrets, or unrelated files.

---

# 23. FINAL HANDOFF ZIP

Create exactly one archive:

`project-genesis-post-v1-world-web-scenic-scale-and-perspective-review-handoff.zip`

Target location:

`D:\Cursor\Project Genesis\docs\architecture\reviews\project-genesis-post-v1-world-web-scenic-scale-and-perspective-review-handoff.zip`

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

## OPTION A — REVIEW COMPLETE

Use if:

* Relevant architecture and artwork were inspected.
* Main scale and perspective questions were answered.
* Evidence limitations were documented.
* A concrete recommendation was produced.
* No confirmed preservation breach exists.

## OPTION B — REVIEW COMPLETE WITH LIMITATIONS

Use if:

* The main review was completed.
* Some comparisons remain unmeasurable or unverified.
* A useful conditional recommendation is still possible.
* No confirmed critical preservation breach exists.

## OPTION C — REVIEW INCOMPLETE

Use if:

* Important required questions could not be addressed.

## OPTION D — BLOCKED

Use if:

* A critical dependency prevents safe review.

## OPTION E — NOT STARTED

Use if:

* The review could not begin.

Do not force OPTION A.

A `NOT_MEASURABLE` finding is acceptable when supported by an explanation.

---

# 26. FINAL CURSOR RESPONSE

Your final response must include:

## A. Main finding

Are the current building-to-landscape proportions visually coherent?

## B. Building-to-tree relationship

Summarize the evidence.

## C. Building-to-river relationship

Summarize the evidence.

## D. Building-to-road relationship

Summarize the evidence.

## E. Perspective

Explain whether buildings and terrain use compatible viewing angles.

## F. Grounding and lighting

Identify the most relevant visual issues, if any.

## G. Zoom

Explain whether apparent proportions remain consistent.

## H. Recommended next step

Select one preferred option.

## I. Protected decisions

Confirm:

* Region labels unchanged.
* Building sizes unchanged.
* Artwork unchanged.
* Gameplay unchanged.

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

This is a review, not an implementation.

Do not modify region labels.

Do not modify building sizes.

Do not modify artwork.

Do not modify application source.

Do not modify gameplay rules.

Do not modify API contracts.

Do not modify savegame schemas.

Do not invent building positions.

Do not invent road networks.

Do not infer physical scale from image-space measurements.

Do not reopen historical audits.

Do not create an unnecessary verification cycle.

Use actual repository evidence.

Distinguish measurements from visual estimates.

Document unknowns honestly.

Provide one concrete recommendation.

Produce one complete handoff.

**The goal is to establish whether Project Genesis already has a sufficiently coherent scenic scale and perspective, and to identify the smallest worthwhile future improvement without changing the approved region labels or current building sizes.**
