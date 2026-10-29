# PROJECT GENESIS — POST-V1 WORLD WEB

# SLICE 6 IMPLEMENTATION

## Scenic World Operations & Logistics Presentation

---

# 0. MISSION

You are Cursor working in the existing Project Genesis repository:

`D:\Cursor\Project Genesis`

Your assignment is to implement:

**Post-V1 World Web Slice 6 — Scenic World Operations & Logistics Presentation**

The project owner has approved the proposed Slice 6 functional direction and selected a long-term visual-design goal inspired by a supplied strategy-game reference image.

This implementation must deliver the approved Slice 6 functionality while establishing a restrained visual foundation for that longer-term direction.

The goal is to make existing Project Genesis simulation and logistics information visible, understandable, and useful directly on the World Web map.

The implementation must remain compatible with the current application architecture.

## Primary objectives

1. Display existing transport activity on the World Web map.
2. Provide reliable controls for operational map layers.
3. Extend the region inspector with relevant operational information.
4. Synchronize the map legend with visible layers.
5. Support keyboard-accessible layer controls.
6. Apply limited visual improvements inspired by the reference image.
7. Preserve existing map geometry and world interactions.
8. Preserve existing backend and persistence contracts.
9. Complete focused verification.
10. Produce one independently reviewable implementation handoff.

## Project-owner decisions

The following decisions are approved for this implementation:

**Slice 6 functional scope: APPROVED**

**Transport layer default: ON**

**Resources heatmap default: OFF**

**Existing building-layer default: PRESERVE**

**Existing presence-layer default: PRESERVE**

**Long-term visual direction: OPTION B**

The visual direction means:

> Develop Project Genesis toward a warm, scenic, layered strategy-world presentation with stronger landscape depth, integrated buildings, visible routes, and a living-world atmosphere.

This is a long-term art-direction goal.

It does not authorize implementing every aspect of the reference image in Slice 6.

## Completion objective

Deliver a functional, bounded Slice 6 implementation with focused tests and a complete handoff.

Avoid a prolonged sequence of audit and correction prompts.

---

# 1. MANDATORY FIRST ACTION

Before any other operation, read:

`D:\Cursor\Project Genesis\docs\development\CURSOR_IMPLEMENTATION_GUIDE.md`

Read the entire document.

Record:

* Exact path.
* SHA-256.
* Read timestamp.
* Applicable implementation requirements.
* Repository preservation rules.
* Testing expectations.
* Handoff requirements.
* Git and worktree safety requirements.

Follow the guide.

If the guide cannot be read, stop and report:

`BLOCKED — IMPLEMENTATION GUIDE UNAVAILABLE`

Do not continue based on assumptions.

---

# 2. AUTHORITATIVE IMPLEMENTATION INPUTS

## 2.1 Slice 6 proposed specification

Locate the previously generated handoff:

`project-genesis-post-v1-world-web-slice-6-specification-definition-handoff.zip`

Previously reviewed SHA-256:

`70424b2baea206a49e647b3b275fa9a4d6e2a0a139c8f2e31a60897fafeac2a6`

Read:

* `POST_V1_WORLD_WEB_SLICE_6_PROPOSED_SPECIFICATION.md`
* `SLICE_6_REQUIREMENTS_TRACEABILITY.json`
* `SLICE_6_ACCEPTANCE_CRITERIA.md`
* `SLICE_6_ARCHITECTURE_AND_DEPENDENCIES.md`
* `SLICE_6_PRESERVATION_BOUNDARIES.md`
* `SLICE_6_IMPLEMENTATION_APPROACH.md`
* `SLICE_6_OWNER_APPROVAL_DECISIONS.md`

The project owner has approved the functional direction in the conversation that initiated this implementation.

The approval includes the default-layer decisions and the long-term visual direction stated in Section 0.

Treat the approved functional scope as the implementation baseline.

Do not silently expand it.

If repository policy requires a separate formal approval record, document that requirement and comply with it before implementation. Do not fabricate an approval artifact or signature.

## 2.2 Slice 5 final handover

Locate:

`project-genesis-post-v1-world-web-slice-5-final-signoff-and-handover.zip`

Previously reviewed SHA-256:

`f59ebef9e5d145865b7f6d4de5c0d2ce897ef9d0cc427374d6417026f06119f6`

Read the relevant handover documents.

Slice 5 remains:

`CLOSED WITH DOCUMENTED EVIDENCE LIMITATIONS`

Independent evidence status:

`OPTION B`

Do not reopen Slice 5.

Do not repeat its historical evidence investigations.

Use the existing implementation as the baseline for Slice 6.

## 2.3 Existing project architecture

Inspect the relevant current source files and contracts before editing.

Previously identified areas include:

* `WorldScreen.tsx`
* `PGWorldWorkspace.tsx`
* `PGWorldCanvas.tsx`
* `PGWorldInspector`
* `useWorldLayers.ts`
* `PGWorldLegend`

Previously identified data functions include:

* `fetchTransportOrders()`
* `fetchProductionJobs()`

These names are implementation leads, not proof of current source structure.

Verify the actual paths, signatures, types, and responsibilities.

Do not invent missing APIs.

Do not duplicate existing services.

---

# 3. VISUAL REFERENCE AND ART DIRECTION

The project owner supplied a reference screenshot showing a warm, stylized strategy-game world.

The image features:

* Layered terrain.
* A visually readable world.
* Integrated buildings.
* Visible roads.
* Distinct landscape materials.
* Soft shadows.
* Warm environmental colors.
* Clear information panels.
* A strong sense of depth.
* A lively settlement atmosphere.

The project owner selected:

**OPTION B — LONG-TERM VISUAL CONVERGENCE**

This means Project Genesis should gradually develop a similar level of visual richness.

## 3.1 Reference image handling

Use the image supplied by the project owner as an art-direction reference.

The image should be made available in Cursor's working context before implementation.

Do not assume that the image is already present in the repository.

Do not infer a repository file path for the image.

If the reference image is unavailable to Cursor, use the written visual requirements below and record:

`REFERENCE_IMAGE_NOT_AVAILABLE`

The absence of the image must not justify inventing or copying third-party assets.

## 3.2 Important visual principles

Apply the following principles where feasible within Slice 6:

### Warm scenic presentation

Prefer natural, harmonious colors compatible with existing Project Genesis artwork.

### Layered depth

Use restrained shadows, highlights, and visual hierarchy to distinguish terrain, routes, buildings, and interface elements.

### Integrated logistics

Transport routes should feel like part of the world rather than arbitrary technical lines.

### Readable operational information

The player should understand the world primarily through the map, with supporting details in the inspector.

### Visual restraint

Avoid excessive glow, flashing effects, or dense overlays.

### Existing identity

Preserve Project Genesis's established visual identity.

Do not replace existing artwork simply to resemble the reference.

## 3.3 Explicit visual exclusions

Do not:

* Convert the map to hexagonal geometry.
* Replace the current map coordinate system.
* Introduce a 3D engine.
* Replace the camera system.
* Rebuild the construction system.
* Redesign every region.
* Replace existing region illustrations.
* Replace protected building artwork.
* Introduce a new rendering framework.
* Copy the reference game's interface or assets.
* Reproduce the reference image as a background.
* Add speculative animated populations or vehicles unrelated to real game state.

These are potential future art-direction topics, not Slice 6 requirements.

## 3.4 Limited Slice 6 visual improvements

Within the existing rendering architecture, implement only lightweight improvements that directly support the new operational presentation.

Examples:

* Better route contrast.
* Subtle route shadows.
* Clear route endpoints.
* Improved layer hierarchy.
* Harmonized legend styling.
* Improved inspector readability.
* Restrained highlights for selected operational elements.

Do not let visual polish become an unbounded redesign.

---

# 4. PRESERVATION AND WORKTREE SAFETY

The repository contains protected data and existing work-in-progress.

Preservation is mandatory.

## 4.1 Protected categories

Protect:

* Personal save files.
* Environment files.
* Deleted saves expected to remain absent.
* World artwork.
* Building artwork.
* Save backups.
* Unrelated tracked WIP.
* Unrelated untracked WIP.
* Existing diagnostic scripts.
* Existing browser harnesses.
* Historical handoffs.

Known protected examples include:

`Saves/browser-session.json`

`apps/web/.env.local`

`apps/api/saves/Daniela.json`

`apps/api/saves/Jallah.json`

Verify actual paths and case.

Do not assume these examples form the complete protected inventory.

## 4.2 Preflight

Before editing:

1. Record current branch.
2. Record current HEAD.
3. Record Git status.
4. Identify relevant existing WIP.
5. Record protected-file hashes or absence states.
6. Identify the intended Slice 6 change set.
7. Record relevant existing source-file hashes.

Do not modify protected files.

Do not normalize unrelated WIP.

Do not reset or clean the repository.

Do not stash unrelated changes.

Do not commit unless explicitly required by the implementation guide and authorized.

## 4.3 During implementation

Keep changes limited to the approved Slice 6 scope.

Do not overwrite unrelated edits.

If an intended file already contains unrelated WIP, preserve it.

Do not remove or rewrite unrelated code merely to simplify implementation.

## 4.4 Postflight

After implementation:

1. Record branch and HEAD.
2. Record Git status.
3. Compare protected-file hashes.
4. Compare protected absence states.
5. Identify Slice 6 changes.
6. Identify unrelated pre-existing changes.
7. Document any unexpected changes.

A preservation claim must distinguish actual evidence from assumptions.

---

# 5. IMPLEMENTATION STRATEGY

Implement Slice 6 as one coherent feature increment.

The preferred order is:

1. Verify existing data contracts.
2. Add a safe operational data view.
3. Implement transport rendering.
4. Implement operational layer controls.
5. Extend the region inspector.
6. Synchronize the legend.
7. Add keyboard accessibility.
8. Apply restrained visual styling.
9. Run focused tests.
10. Produce the final handoff.

This order is guidance, not a requirement to create separate prompts.

Do not split the work into independent audit cycles.

---

# 6. FEATURE 1 — TRANSPORT ROUTES ON THE WORLD MAP

## Requirement

Display existing transport activity directly on the World Web map.

Use the application's existing transport data.

Do not invent transport orders.

Do not create new simulation rules.

## 6.1 Data integration

Inspect the existing transport-order API and related types.

Determine:

* How transport orders are represented.
* Which states indicate active transport.
* How origins and destinations are identified.
* Whether endpoints map to regions or buildings.
* Whether route geometry already exists.
* Whether direction is available.
* How loading, empty, and error states are represented.

Use existing contracts.

Do not introduce a new backend endpoint unless the approved specification explicitly requires it.

## 6.2 Route rendering

Display active transport routes using the existing map coordinate system.

Routes must:

* Correspond to actual transport data.
* Use valid world coordinates.
* Remain aligned during pan and zoom.
* Respect existing clipping and map boundaries.
* Avoid covering essential map controls.
* Be visually distinguishable from selection outlines and construction indicators.

## 6.3 Visual treatment

The visual style should support the long-term scenic direction.

Prefer:

* Warm, muted route colors.
* Clear origin and destination indicators.
* Subtle depth.
* Readable direction cues.
* Restrained highlighting.

Do not create decorative roads that imply nonexistent transport links.

Do not require a new terrain renderer.

## 6.4 Data limitations

If the existing data provides endpoints but not a physical road network, represent routes as **operational connections** rather than claiming they follow actual roads.

Do not fabricate road geometry.

Do not fabricate intermediate stops.

Do not fabricate vehicle positions.

## 6.5 Empty and error states

When no active transport orders exist:

* Show no false routes.
* Keep the map functional.
* Provide an appropriate empty-state indication where useful.

When transport data cannot be loaded:

* Do not crash the world map.
* Do not render stale data as confirmed current activity.
* Present a clear, restrained error state.
* Preserve unrelated map interactions.

---

# 7. FEATURE 2 — OPERATIONAL MAP LAYERS

## Requirement

Provide controls for relevant operational layers.

The player must be able to show or hide operational information without losing the underlying world map.

## 7.1 Existing layer state

Inspect:

`useWorldLayers.ts`

or the actual equivalent.

Determine the current layer names, defaults, persistence behavior, and state ownership.

Extend the existing mechanism.

Do not create a second conflicting layer system.

## 7.2 Approved defaults

Use:

| Layer             | Default                   |
| ----------------- | ------------------------- |
| Transport         | ON                        |
| Resources heatmap | OFF                       |
| Buildings         | Preserve existing default |
| Presence          | Preserve existing default |

If the existing layer contract cannot support these defaults safely, document the conflict and implement the smallest compatible adjustment.

Do not break existing saved preferences.

## 7.3 Layer behavior

Layer controls must:

* Have clearly labeled states.
* Be reversible.
* Update the map immediately.
* Avoid changing simulation state.
* Avoid issuing unintended construction actions.
* Remain consistent with the legend.
* Work with existing responsive layouts.

## 7.4 Resource heatmap

The approved default is OFF.

Do not invent a new resource simulation or resource API.

If a resource layer already exists, integrate its visibility with the existing layer mechanism.

If a resource heatmap does not exist and the approved specification does not explicitly require implementing one, do not build a new heatmap.

Record the limitation instead.

## 7.5 Layer persistence

Preserve existing layer-preference behavior.

Do not introduce a savegame schema migration.

If preferences are not currently persisted, do not invent new persistence requirements without support from the approved specification.

---

# 8. FEATURE 3 — REGION INSPECTOR OPERATIONS

## Requirement

Extend the existing region inspector to present relevant operational information.

The inspector should help the player understand what is happening in the selected region.

## 8.1 Required information

Where supported by existing data, show:

* Relevant buildings.
* Relevant production jobs.
* Relevant transport orders.
* Appropriate operational status.

Do not invent values.

Do not display data from unrelated regions as if it belongs to the selected region.

## 8.2 Data relationships

Verify how existing data maps to:

* Regions.
* Buildings.
* Production jobs.
* Transport origins.
* Transport destinations.

Do not assume every entity has a direct region ID.

Use the actual domain model.

If a relationship cannot be established reliably, display a clear unavailable state rather than guessing.

## 8.3 Inspector interaction

The inspector must:

* Respond to region selection.
* Remain synchronized with the selected region.
* Avoid stale region data.
* Handle loading states.
* Handle empty states.
* Handle API errors.
* Remain readable at supported viewport sizes.
* Preserve existing close and selection behavior.

## 8.4 Visual style

Use a clean operational layout inspired by the reference image's readable side panels.

Prefer:

* Clear section hierarchy.
* Compact information groups.
* Legible typography.
* Consistent status indicators.
* Restrained decorative treatment.

Do not reproduce the reference game's UI.

Do not redesign unrelated application panels.

---

# 9. FEATURE 4 — DYNAMIC MAP LEGEND

## Requirement

Synchronize the map legend with the active operational layers.

The legend must explain what the player currently sees.

## 9.1 Legend behavior

The legend should:

* Reflect enabled layers.
* Use symbols consistent with map rendering.
* Explain route colors and markers.
* Avoid describing hidden layers as visible.
* Update when layer state changes.
* Remain usable on smaller screens.

## 9.2 Existing legend

Extend:

`PGWorldLegend`

or the actual equivalent.

Do not create a redundant second legend.

## 9.3 Visual consistency

Ensure that:

* Route color matches the legend.
* Endpoint markers match the legend.
* Status indicators use consistent terminology.
* Hidden operational elements do not remain incorrectly represented as active.

---

# 10. FEATURE 5 — KEYBOARD ACCESSIBILITY

## Requirement

Operational layer controls must be usable without a mouse.

## 10.1 Keyboard operation

Ensure:

* Controls are reachable by Tab.
* Focus is visible.
* Enter or Space activates controls appropriately.
* Control state is communicated accessibly.
* Keyboard operation does not trigger construction placement.
* Keyboard operation does not unexpectedly move the camera.
* Focus order remains logical.

Use semantic HTML controls where practical.

## 10.2 Existing keyboard behavior

Preserve:

* Camera keyboard controls.
* Region Focus behavior.
* Existing construction keyboard safety.
* Existing inspector navigation.

Do not reopen the entire Slice 5 keyboard test program.

Test only the interactions relevant to Slice 6 and their immediate regression boundaries.

---

# 11. DATA AND API CONTRACTS

Slice 6 is a presentation and integration increment.

It must not alter the underlying economic simulation.

## Required constraints

Do not:

* Change transport simulation rules.
* Change production simulation rules.
* Change resource calculations.
* Change building placement rules.
* Introduce new backend endpoints without explicit authorization.
* Modify savegame schemas.
* Perform destructive migrations.
* Modify personal save files.
* Invent transport records.
* Invent production jobs.
* Invent resource quantities.

Use existing data contracts.

## Type safety

Use existing TypeScript types where available.

Avoid unnecessary `any`.

Validate nullable or incomplete data appropriately.

Do not assume API data is always complete.

## Performance

Avoid unnecessary network requests.

Avoid refetching the same data independently in multiple child components when existing shared state can be reused.

Avoid expensive map recalculations on unrelated UI updates.

Do not introduce a major state-management dependency for this slice.

---

# 12. VISUAL POLISH WITHIN SLICE 6

Apply a small, coherent visual pass to the newly introduced operational elements.

## 12.1 Transport appearance

Use route styling that feels integrated into the scenic map.

Consider:

* Subtle shadows.
* Clear route layering.
* Warm neutral tones.
* Legible directional cues.
* Distinct selected or highlighted states.

## 12.2 Inspector appearance

Improve the operational sections without redesigning the entire application.

## 12.3 Layer controls

Make active and inactive states visually clear.

## 12.4 Legend

Ensure the legend feels like part of the same visual system.

## 12.5 Preserve existing artwork

Do not replace:

* Region images.
* Building images.
* Background scenery.
* Existing protected artwork.

Do not generate new art assets unless explicitly required by the approved Slice 6 specification.

## 12.6 Future visual development

Document opportunities for later work, such as:

* More dimensional terrain.
* Better building integration.
* Roads embedded in the landscape.
* Environmental animation.
* More detailed settlement presentation.

These must be recorded as **future art-direction possibilities**, not unfinished Slice 6 acceptance requirements.

Do not implement them during this slice.

---

# 13. ACCEPTANCE CRITERIA

Use the approved Slice 6 acceptance criteria as the authoritative baseline.

The expected functional acceptance areas are:

## S6-AC-001 — Transport visibility

Active transport orders appear correctly on the world map.

## S6-AC-002 — Scenic transport presentation

Routes are visually readable and compatible with the existing world style.

## S6-AC-003 — Operational layers

Layer controls correctly show and hide relevant map information.

## S6-AC-004 — Region inspector

The inspector presents correctly associated buildings, production jobs, and transport information.

## S6-AC-005 — Responsive inspector

Operational information remains usable at supported viewport sizes.

## S6-AC-006 — Dynamic legend

The legend matches the currently visible operational layers.

## S6-AC-007 — Contract preservation

Existing savegame and API contracts remain unchanged.

## S6-AC-008 — Keyboard accessibility

Layer controls are keyboard accessible and do not interfere with existing construction or camera controls.

## Acceptance interpretation

Read the actual approved specification for exact wording.

If the approved specification contains additional or more precise acceptance conditions, preserve them.

Do not silently weaken requirements.

Do not add unrelated acceptance gates.

---

# 14. FOCUSED TESTING STRATEGY

Run tests appropriate to the actual changed behavior.

Do not run an unlimited test campaign.

## 14.1 Static checks

Run relevant:

* TypeScript checks.
* Lint checks.
* Build checks.

Use the repository's existing scripts.

Do not invent new commands without inspecting package configuration.

## 14.2 Unit tests

Where applicable, verify:

* Transport-to-region mapping.
* Active transport filtering.
* Route visibility.
* Layer defaults.
* Layer toggling.
* Legend synchronization.
* Empty and error states.

## 14.3 Integration tests

Where applicable, verify:

* Existing API data integration.
* Inspector region filtering.
* Shared layer state.
* No unintended backend mutations.

## 14.4 Browser verification

If the existing test environment supports browser testing, perform one focused browser verification pass covering:

1. World map loads.
2. Transport layer is enabled by default.
3. Resource heatmap is disabled by default.
4. Active routes appear when supported fixture data exists.
5. Transport layer can be disabled.
6. Routes disappear when disabled.
7. Re-enabling restores the route presentation.
8. Region selection updates the inspector.
9. Inspector operational information is correct for the selected region.
10. Legend matches the visible layers.
11. Keyboard toggling works.
12. Construction remains protected from unintended keyboard actions.
13. Responsive inspector remains usable.

Do not invent successful results.

## 14.5 Test-data safety

Use synthetic fixtures where needed.

Do not use personal saves as disposable test fixtures.

Do not mutate protected user data.

Do not leave test-created state in persistent application storage.

## 14.6 Failure handling

If a test fails:

1. Identify the actual cause.
2. Fix defects within Slice 6 scope.
3. Rerun only the affected checks and immediate regressions.
4. Record the result.

Do not create a new broad audit cycle.

If a failure cannot be resolved safely, document it as an explicit limitation.

Do not claim PASS without evidence.

---

# 15. REGRESSION BOUNDARIES

Slice 6 must preserve the existing World Web behavior.

Relevant immediate regression boundaries include:

* Camera pan and zoom.
* Minimap interaction.
* Region selection.
* Region Focus.
* Construction placement.
* Construction cancellation.
* Responsive layout.
* Existing layer behavior.
* Savegame persistence.
* Keyboard focus safety.

Do not repeat the entire historical Slice 5 acceptance program.

Verify only what is directly affected by Slice 6 changes.

---

# 16. DEFINITION OF DONE

Slice 6 is complete only when:

1. The approved functional scope is implemented.
2. Active transport information is rendered correctly.
3. Operational layer controls work.
4. Approved layer defaults are respected.
5. The region inspector shows relevant operational data.
6. The legend matches the map.
7. Keyboard controls work.
8. Existing construction and camera interactions remain safe.
9. Existing API contracts are preserved.
10. Existing savegame contracts are preserved.
11. Protected data remains unchanged.
12. Relevant tests have been executed and documented.
13. Known failures and limitations are explicitly reported.
14. The implementation change set is identified.
15. The final handoff is complete and internally consistent.

Do not mark the slice complete merely because the UI appears visually correct.

Do not claim full acceptance if mandatory criteria remain unverified.

---

# 17. IMPLEMENTATION CHANGE RECORD

Create a detailed record of actual changes.

For every modified file, include:

* Exact path.
* Purpose.
* Change category.
* Relevant requirement IDs.
* Preflight hash where available.
* Postflight hash.
* Whether the file contained pre-existing WIP.
* Whether unrelated content was preserved.

Separate:

* Application implementation changes.
* Test changes.
* Documentation changes.
* Existing unrelated WIP.

Do not describe pre-existing WIP as newly implemented Slice 6 work.

---

# 18. REQUIRED HANDOFF DOCUMENTS

Create one final handoff containing the following files.

## 18.1 `FINAL_REPORT.md`

Include:

* Executive summary.
* Implemented features.
* Requirement coverage.
* Acceptance results.
* Test results.
* Preservation results.
* Known limitations.
* Final implementation verdict.

## 18.2 `SLICE_6_IMPLEMENTATION_SUMMARY.md`

Explain the actual implementation.

## 18.3 `SLICE_6_REQUIREMENTS_COVERAGE.json`

Map every approved requirement to:

* Implementation files.
* Test evidence.
* Acceptance criteria.
* Final status.

## 18.4 `SLICE_6_ACCEPTANCE_MATRIX.json`

For each acceptance criterion record:

* ID.
* Description.
* Result.
* Evidence path.
* Relevant source files.
* Test method.
* Limitations.

Allowed results:

* `PASS`
* `FAIL`
* `NOT_VERIFIED`
* `NOT_APPLICABLE`

Do not use `PASS` without supporting evidence.

## 18.5 `SLICE_6_TEST_RESULTS.md`

Include:

* Commands executed.
* Exit codes.
* Test counts.
* Relevant logs.
* Browser verification results.
* Known limitations.

## 18.6 `SLICE_6_VISUAL_DESIGN_REPORT.md`

Include:

* Applied visual improvements.
* Relationship to the supplied reference image.
* Existing artwork preserved.
* Visual limitations.
* Future art-direction opportunities.

Do not present future visual work as completed Slice 6 functionality.

## 18.7 `SLICE_6_API_AND_PERSISTENCE_PRESERVATION.md`

Explain:

* Existing contracts used.
* Whether backend files changed.
* Whether savegame schemas changed.
* Whether personal saves changed.
* Evidence supporting preservation claims.

## 18.8 `SLICE_6_REPOSITORY_PRESERVATION.json`

Include:

* Preflight branch and HEAD.
* Postflight branch and HEAD.
* Protected-file hash comparisons.
* Protected absence-state comparisons.
* Existing WIP handling.
* Unexpected changes.
* Preservation verdict.

## 18.9 `SLICE_6_CHANGED_FILES.json`

List all actual Slice 6 changes.

## 18.10 `SLICE_6_KNOWN_LIMITATIONS.md`

Record only genuine remaining limitations.

Do not create speculative defect lists.

## 18.11 `SLICE_6_HANDOVER.md`

Explain:

* Implemented functionality.
* Relevant architecture.
* New UI behavior.
* Relevant source locations.
* Acceptance status.
* Preservation requirements.
* Remaining limitations.
* Future visual-development possibilities.

## 18.12 `SLICE_6_SOURCE_REFERENCES.json`

Include source documents and relevant hashes.

## 18.13 `handoff-manifest.json`

Include every packaged file except the manifest itself.

For each file record:

* Relative path.
* SHA-256.
* File size.

Additional focused evidence files may be included where needed.

Do not include private saves, environment secrets, or unrelated repository files.

---

# 19. FINAL HANDOFF ZIP

Create:

`project-genesis-post-v1-world-web-slice-6-implementation-handoff.zip`

Target location:

`D:\Cursor\Project Genesis\docs\architecture\reviews\project-genesis-post-v1-world-web-slice-6-implementation-handoff.zip`

Do not overwrite previous handoffs.

Do not include unrelated WIP.

Do not include protected personal data.

Include sufficient evidence to understand what was implemented and tested.

---

# 20. ZIP INTEGRITY

After creating the archive:

1. Reopen the ZIP.
2. Verify every CRC.
3. Verify every manifest-listed SHA-256.
4. Verify every manifest-listed file size.
5. Check for missing files.
6. Check for unexpected files.
7. Check for duplicate entries.
8. Check for absolute paths.
9. Check for path traversal.
10. Calculate the complete ZIP SHA-256.

Do not report integrity PASS unless every check succeeds.

---

# 21. FINAL IMPLEMENTATION VERDICT

Assign exactly one final verdict.

## OPTION A — COMPLETE AND VERIFIED

Use only if:

* All mandatory Slice 6 requirements are implemented.
* All mandatory acceptance criteria pass.
* Required verification evidence is available.
* No confirmed preservation breach exists.
* No blocking defect remains.

## OPTION B — IMPLEMENTED WITH DOCUMENTED LIMITATIONS

Use if:

* The main functionality is implemented.
* Remaining limitations are explicitly documented.
* Full independent acceptance cannot be claimed.
* No confirmed critical preservation breach exists.

## OPTION C — PARTIALLY IMPLEMENTED

Use if:

* Important mandatory functionality remains incomplete.

## OPTION D — BLOCKED

Use if:

* A critical dependency, preservation conflict, or unresolved failure prevents safe completion.

## OPTION E — NOT IMPLEMENTED

Use if:

* Implementation could not begin.

Do not force OPTION A.

Do not hide failures.

Do not classify incomplete mandatory functionality as fully complete.

---

# 22. FINAL CURSOR RESPONSE

Your final response must include:

## A. Implementation result

State what was actually implemented.

## B. Visual result

Explain how the new presentation supports the selected long-term visual direction.

## C. Functional coverage

Summarize transport routes, layers, inspector, legend, and keyboard accessibility.

## D. Acceptance results

Provide the acceptance matrix summary.

## E. Testing

State which checks actually ran and their results.

## F. Preservation

State whether protected data and existing WIP were preserved.

## G. Changed files

Summarize the actual change set.

## H. Limitations

List only material remaining limitations.

## I. Final verdict

Provide OPTION A/B/C/D/E.

## J. Final ZIP

Provide:

* Exact ZIP path.
* ZIP SHA-256.
* ZIP entry count.
* Manifest validation.
* CRC validation.

---

# 23. FINAL NON-NEGOTIABLE INSTRUCTIONS

Implement the approved Slice 6 functionality.

Use the existing Project Genesis architecture.

Preserve the existing map geometry.

Preserve existing artwork.

Preserve existing savegame and API contracts.

Preserve personal saves and environment files.

Do not introduce new simulation rules.

Do not invent transport data.

Do not fabricate route geometry.

Do not create a new 3D engine.

Do not redesign the entire world.

Do not reopen Slice 5.

Do not create an unnecessary sequence of audit prompts.

Apply restrained visual improvements consistent with the long-term scenic direction.

Run focused tests.

Document actual evidence.

Report limitations honestly.

Produce one complete implementation handoff.

**The goal is a working, readable, visually coherent operational World Web—not another prolonged verification cycle.**
