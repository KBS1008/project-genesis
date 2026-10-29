# PROJECT GENESIS — POST-V1 WORLD WEB

# SLICE 6 FINAL BROWSER VERIFICATION AND SIGNOFF

## 0. MISSION — ONE FINAL TARGETED VERIFICATION PASS

You are Cursor working in the existing Project Genesis repository:

`D:\Cursor\Project Genesis`

Your assignment is to complete the final targeted browser verification and signoff for:

**Post-V1 World Web Slice 6 — Scenic World Operations & Logistics Presentation**

The previous implementation handoff reported:

* 6 acceptance criteria: `PASS`
* 0 acceptance criteria: `FAIL`
* 2 acceptance criteria: `NOT_VERIFIED`

The two outstanding criteria are:

* `S6-AC-005` — Responsive Region Inspector
* `S6-AC-008` — Keyboard Accessibility of Operational Layer Controls

Your task is limited to these two criteria and their immediate regression boundaries.

This is not a new implementation cycle.

This is not a complete acceptance re-audit.

This is not a visual redesign.

### Primary objectives

1. Read the mandatory implementation guide.
2. Read the existing Slice 6 implementation handoff.
3. Identify the exact acceptance requirements for S6-AC-005 and S6-AC-008.
4. Run one focused browser verification pass.
5. Capture direct evidence for both criteria.
6. Fix confirmed defects only if they fall within this narrow scope.
7. Rerun only affected checks after a fix.
8. Preserve all protected data and unrelated WIP.
9. Produce one final Slice 6 signoff handoff.
10. End the Slice 6 review cycle.

### Non-negotiable finality rule

**Do not create another broad verification cycle.**

If the two criteria pass, document their successful verification.

If one or both cannot be verified, document the limitation and close the review with the appropriate qualified status.

If a confirmed blocking defect remains, report it explicitly rather than claiming completion.

Do not manufacture PASS results.

---

# 1. MANDATORY FIRST ACTION

Before any other operation, read the complete implementation guide:

`D:\Cursor\Project Genesis\docs\development\CURSOR_IMPLEMENTATION_GUIDE.md`

Record:

* Exact path.
* SHA-256.
* Read timestamp.
* Applicable testing requirements.
* Preservation requirements.
* Browser-testing conventions.
* Handoff requirements.
* Git and worktree safety rules.

Follow the guide.

If the guide cannot be read, stop and report:

`BLOCKED — IMPLEMENTATION GUIDE UNAVAILABLE`

Do not continue based on assumptions.

---

# 2. AUTHORITATIVE INPUTS

## 2.1 Slice 6 implementation handoff

Locate:

`project-genesis-post-v1-world-web-slice-6-implementation-handoff.zip`

Previously reviewed SHA-256:

`f2dd34446d1335ff7938541872ad78a9b2549acf1f941ce1c3f95969c5f0aaa8`

Read the relevant files, including:

* `FINAL_REPORT.md`
* `SLICE_6_IMPLEMENTATION_SUMMARY.md`
* `SLICE_6_REQUIREMENTS_COVERAGE.json`
* `SLICE_6_ACCEPTANCE_MATRIX.json`
* `SLICE_6_TEST_RESULTS.md`
* `SLICE_6_KNOWN_LIMITATIONS.md`
* `SLICE_6_REPOSITORY_PRESERVATION.json`
* `SLICE_6_CHANGED_FILES.json`

Use this handoff as the existing implementation baseline.

Do not repeat previously completed tests without a direct dependency on the two outstanding criteria.

## 2.2 Slice 6 specification

Locate:

`project-genesis-post-v1-world-web-slice-6-specification-definition-handoff.zip`

Previously reviewed SHA-256:

`70424b2baea206a49e647b3b275fa9a4d6e2a0a139c8f2e31a60897fafeac2a6`

Read:

* `POST_V1_WORLD_WEB_SLICE_6_PROPOSED_SPECIFICATION.md`
* `SLICE_6_ACCEPTANCE_CRITERIA.md`
* `SLICE_6_REQUIREMENTS_TRACEABILITY.json`

Use the project-owner-approved Slice 6 scope.

Do not add requirements.

## 2.3 Slice 5 boundary

Slice 5 remains administratively closed:

`CLOSED WITH DOCUMENTED EVIDENCE LIMITATIONS`

Independent evidence status:

`OPTION B`

Do not reopen Slice 5.

Do not rerun historical Slice 5 acceptance tests.

---

# 3. STRICT SCOPE

## Allowed

You may:

* Inspect relevant current source files.
* Inspect existing browser-test infrastructure.
* Run the application as required for focused browser verification.
* Run targeted browser tests for S6-AC-005 and S6-AC-008.
* Use synthetic test fixtures.
* Capture screenshots.
* Capture relevant browser console errors.
* Capture targeted interaction traces.
* Fix confirmed defects affecting the two outstanding criteria.
* Add or adjust focused regression tests for those defects.
* Run narrowly relevant static checks after changes.
* Create final signoff documentation.
* Package one final handoff ZIP.

## Forbidden

You must not:

* Implement new Slice 6 features.
* Redesign the World Web.
* Replace artwork.
* Change map geometry.
* Introduce a 3D engine.
* Modify simulation rules.
* Modify transport logic unrelated to the two criteria.
* Modify backend APIs.
* Modify savegame schemas.
* Modify personal saves.
* Modify environment files.
* Modify unrelated WIP.
* Rebuild the construction system.
* Rework camera behavior.
* Reimplement the minimap.
* Perform another full Slice 6 acceptance audit.
* Reconstruct historical source-hash chains.
* Reopen Slice 5.
* Create new visual-design tasks.
* Run unrelated test suites.
* Reset, clean, stash, or rewrite Git history.
* Commit without explicit authorization.

All code changes must be justified by a directly observed failure of S6-AC-005 or S6-AC-008.

---

# 4. PRESERVATION PREFLIGHT

Before launching the application or browser:

1. Record the current branch.
2. Record the current HEAD.
3. Record Git status.
4. Identify existing unrelated WIP.
5. Record hashes of relevant protected files.
6. Record absence states for protected deleted saves.
7. Identify any existing browser-test artifacts that must not be overwritten.
8. Identify the intended test fixture and its cleanup procedure.

## Protected categories

Preserve:

* Personal saves.
* Environment files.
* Deleted-save absence states.
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

## Test-data safety

Use synthetic fixtures wherever practical.

Do not use personal save files as disposable test fixtures.

Do not mutate persistent user state.

If the test environment cannot be isolated safely, do not proceed with state-changing browser interactions.

Report the limitation.

---

# 5. VERIFY THE EXISTING TEST ENVIRONMENT

Inspect the repository's existing browser-testing setup.

Determine:

* How the web application is started.
* How the browser harness is launched.
* Which test runner is already installed.
* Which ports are used.
* Whether a test API is required.
* Whether synthetic fixtures are supported.
* How test state is cleaned up.

Use existing project conventions.

Do not install new dependencies.

Do not introduce a new testing framework.

Do not create a parallel browser harness unless absolutely necessary for the two criteria.

## Browser availability

If browser automation is available, use it.

If the browser environment is unavailable:

1. Record the exact reason.
2. Do not fabricate screenshots or test results.
3. Mark affected criteria `NOT_VERIFIED`.
4. Produce the final qualified signoff.
5. Do not initiate another general verification cycle.

---

# 6. S6-AC-005 — RESPONSIVE REGION INSPECTOR

## Objective

Verify that the region inspector remains readable and usable at supported viewport sizes.

Use the viewport requirements defined by the existing project specification or test conventions.

Do not invent mandatory viewport dimensions.

If the project defines no explicit dimensions, select a small representative set covering desktop, tablet, and mobile layouts, and clearly label them as test choices rather than contractual requirements.

## Test procedure

1. Start the application in the isolated test environment.
2. Open the World Web.
3. Select a valid region.
4. Open or display the region inspector.
5. Verify the relevant operational sections.
6. Repeat at the selected viewport sizes.
7. Capture screenshots.
8. Inspect clipping, overflow, readability, and interaction accessibility.
9. Verify that important controls remain reachable.
10. Verify that the inspector does not make the world interface unusable.

## Required checks

Check:

* Inspector opens successfully.
* Selected region is correctly identified.
* Building information is readable where available.
* Production information is readable where available.
* Transport information is readable where available.
* Empty states are readable.
* Loading and error states do not break layout where testable.
* Text does not overlap important controls.
* Content is not unintentionally clipped.
* Scrolling works where necessary.
* Close and navigation controls remain accessible.
* The map remains usable.

## Evidence

Capture:

* Viewport dimensions.
* Browser and test environment.
* Selected region identifier.
* Screenshot paths.
* Relevant DOM or accessibility observations.
* Console errors relevant to the criterion.
* Test result.
* Any limitations.

## PASS rule

Mark `S6-AC-005` as `PASS` only when the required responsive behavior is directly demonstrated.

If a mandatory viewport fails, mark `FAIL`.

If the browser environment prevents meaningful verification, mark `NOT_VERIFIED`.

Do not claim PASS based solely on static CSS inspection.

---

# 7. S6-AC-008 — KEYBOARD ACCESSIBILITY

## Objective

Verify that operational layer controls are keyboard accessible and do not interfere with existing construction or camera controls.

## Required checks

Verify:

1. Layer controls are reachable with Tab.
2. Focus is visibly indicated.
3. Enter activates the appropriate control.
4. Space activates the appropriate control where applicable.
5. The control's state is communicated accessibly.
6. Toggling the transport layer changes route visibility.
7. Keyboard operation does not accidentally confirm construction.
8. Keyboard operation does not unexpectedly move the camera.
9. Focus order remains logical.
10. The player can leave the layer controls without becoming trapped.

## Test procedure

1. Open the World Web in the isolated browser environment.
2. Establish the initial layer state.
3. Navigate to the operational layer controls using the keyboard.
4. Capture the focused state.
5. Toggle the transport layer with Enter.
6. Verify the actual layer state and route visibility.
7. Toggle it back with Space, where supported.
8. Verify the restored state.
9. Navigate through adjacent controls.
10. Verify focus behavior.
11. Exercise the immediate construction-safety boundary using synthetic test state where supported.
12. Verify that no unintended construction confirmation occurs.
13. Verify that layer activation does not trigger camera movement.

## Construction safety

Do not perform a real placement against personal persistent state.

Use an isolated synthetic fixture if construction-mode verification is necessary.

If safe construction isolation is unavailable:

* Do not perform state-changing construction actions.
* Record the limitation.
* Do not claim the construction-safety subcheck passed.

## Evidence

Capture:

* Initial layer state.
* Keyboard sequence.
* Focused element.
* Accessible name and state.
* Resulting layer state.
* Route visibility before and after.
* Camera state before and after.
* Construction state before and after where safely testable.
* Screenshot or trace paths.
* Relevant console errors.
* Final criterion status.

## PASS rule

Mark `S6-AC-008` as `PASS` only when the required keyboard interactions and immediate safety boundaries are directly demonstrated.

Do not infer accessibility from the presence of `tabIndex` or keyboard handlers alone.

---

# 8. DEFECT HANDLING

If either targeted browser test fails:

## Step 1 — Identify the failure

Record:

* Criterion ID.
* Reproduction steps.
* Expected behavior.
* Actual behavior.
* Relevant source files.
* Screenshot or trace evidence.
* Whether the failure is reproducible.

## Step 2 — Determine scope

Only fix defects directly related to:

* Responsive inspector layout.
* Inspector content reachability.
* Keyboard focus.
* Layer-control keyboard activation.
* Accessible layer-control state.
* Immediate camera or construction interference caused by layer controls.

Do not modify unrelated systems.

## Step 3 — Apply the smallest safe fix

Preserve existing architecture and WIP.

Avoid broad refactoring.

Do not change API or savegame contracts.

## Step 4 — Verify the fix

Rerun:

* The failed criterion.
* Its directly affected regression checks.

Do not rerun the entire Slice 6 acceptance suite.

## Step 5 — Record the result

Document:

* Root cause.
* Files changed.
* Fix.
* Tests rerun.
* Final status.
* Remaining limitations.

If a defect cannot be fixed safely within this task, stop expanding scope.

Report the defect and assign the appropriate final verdict.

---

# 9. EXISTING ACCEPTANCE RESULTS

The previous implementation handoff reported:

| Criterion | Previous result |
| --------- | --------------- |
| S6-AC-001 | PASS            |
| S6-AC-002 | PASS            |
| S6-AC-003 | PASS            |
| S6-AC-004 | PASS            |
| S6-AC-005 | NOT_VERIFIED    |
| S6-AC-006 | PASS            |
| S6-AC-007 | PASS            |
| S6-AC-008 | NOT_VERIFIED    |

This task must update only:

* `S6-AC-005`
* `S6-AC-008`

Preserve the original source and evidence references for the other six criteria.

Do not describe those six criteria as newly retested.

Do not silently strengthen their historical evidence status.

If a new targeted test reveals a concrete regression affecting another criterion, document it.

Do not conceal a confirmed regression merely because the corresponding criterion was previously marked PASS.

---

# 10. TARGETED TEST EXECUTION

Run one focused browser verification pass.

If necessary, run narrowly relevant static checks or unit tests.

Do not run unrelated suites.

## Test result requirements

For each executed check, record:

* Exact command.
* Execution timestamp.
* Exit code.
* Test name.
* Test count.
* PASS/FAIL result.
* Relevant evidence paths.
* Any environment limitation.

## Screenshots

Capture representative screenshots for:

* Responsive inspector on desktop.
* Responsive inspector on tablet, if applicable.
* Responsive inspector on mobile.
* Focused operational layer control.
* Layer state before and after keyboard activation.

Screenshots must originate from the actual running application or a clearly identified synthetic test environment.

Do not generate illustrative screenshots and present them as browser evidence.

## Browser traces

Capture a focused trace where supported by the existing test infrastructure.

Do not require an entirely new tracing system.

---

# 11. CLEANUP

After testing:

1. Close browser pages.
2. Close browser contexts.
3. Stop test-created application processes.
4. Remove only temporary artifacts created by this task where safe.
5. Restore synthetic fixture state.
6. Confirm no test-created persistent data remains.
7. Preserve all pre-existing files.
8. Record cleanup results.

Do not delete unrelated files.

Do not run broad cleanup commands.

If cleanup cannot be completed, document the exact remaining state.

Do not report successful cleanup without evidence.

---

# 12. PRESERVATION POSTFLIGHT

After testing and any targeted fixes:

1. Record branch and HEAD.
2. Record Git status.
3. Compare protected-file hashes.
4. Compare protected deleted-save absence states.
5. Identify changed files.
6. Separate intended changes from pre-existing WIP.
7. Record any unexpected changes.
8. Verify that personal saves were not modified.
9. Verify that environment files were not modified.
10. Verify that artwork was not modified.

Do not claim complete preservation verification for populations that were not actually checked.

Do not reopen historical Slice 5 preservation investigations.

---

# 13. FINAL SLICE 6 SIGNOFF STATUS

Assign exactly one final verdict.

## OPTION A — COMPLETE AND VERIFIED

Use only if:

* S6-AC-005 passes.
* S6-AC-008 passes.
* The six previously reported PASS criteria remain supported by their original evidence.
* No confirmed critical regression is discovered.
* No confirmed preservation breach exists.
* Required browser evidence is available.
* No blocking defect remains.

## OPTION B — IMPLEMENTED WITH DOCUMENTED LIMITATIONS

Use if:

* The main Slice 6 functionality remains implemented.
* One or both targeted criteria remain `NOT_VERIFIED`, or other noncritical evidence limitations remain.
* No confirmed critical defect or preservation breach prevents administrative closure.

## OPTION C — PARTIALLY IMPLEMENTED

Use if:

* A mandatory criterion fails because required functionality is incomplete.
* The issue cannot be resolved safely within the targeted scope.

## OPTION D — BLOCKED

Use if:

* A critical defect, unsafe test environment, or preservation conflict prevents safe completion.

## OPTION E — NOT IMPLEMENTED

Use only if the available evidence establishes that the intended Slice 6 implementation was not performed.

Do not force OPTION A.

Do not use OPTION B to conceal a confirmed mandatory functional failure.

---

# 14. ADMINISTRATIVE CLOSURE

Separate the final evidence verdict from the administrative closure decision.

Possible administrative statuses:

* `CLOSED_VERIFIED`
* `CLOSED_WITH_DOCUMENTED_LIMITATIONS`
* `NOT_CLOSED_BLOCKED`

If the two targeted criteria pass and no blocking issue remains:

`CLOSED_VERIFIED`

If browser verification remains incomplete but no confirmed blocking defect exists:

`CLOSED_WITH_DOCUMENTED_LIMITATIONS`

If a confirmed blocking defect remains:

`NOT_CLOSED_BLOCKED`

Do not claim unconditional independent verification merely because the internal acceptance matrix reports PASS.

Do not invent project-owner approval.

If formal human signoff is required by the implementation guide, record:

`PENDING_HUMAN_APPROVAL`

---

# 15. REQUIRED HANDOFF DOCUMENTS

Create one final documentation handoff containing:

## 15.1 `FINAL_REPORT.md`

Include:

* Executive summary.
* Scope of this verification.
* S6-AC-005 result.
* S6-AC-008 result.
* Browser environment.
* Targeted fixes, if any.
* Preservation result.
* Final evidence verdict.
* Administrative closure status.
* Remaining limitations.

## 15.2 `SLICE_6_FINAL_ACCEPTANCE_MATRIX.json`

Include all eight criteria.

For the original six PASS criteria, preserve their historical evidence references.

For S6-AC-005 and S6-AC-008, include new direct evidence.

Distinguish:

* `HISTORICAL_REPORTED_RESULT`
* `NEWLY_VERIFIED_RESULT`

Do not present all eight criteria as newly verified.

## 15.3 `S6_AC_005_RESPONSIVE_INSPECTOR_EVIDENCE.md`

Include:

* Viewports.
* Test steps.
* Screenshots.
* Observations.
* Result.
* Limitations.

## 15.4 `S6_AC_008_KEYBOARD_ACCESSIBILITY_EVIDENCE.md`

Include:

* Keyboard sequences.
* Focus observations.
* Layer-state transitions.
* Camera safety.
* Construction safety.
* Screenshots or traces.
* Result.
* Limitations.

## 15.5 `SLICE_6_TARGETED_TEST_RESULTS.json`

Include:

* Commands.
* Exit codes.
* Test counts.
* Evidence paths.
* Results.

## 15.6 `SLICE_6_TARGETED_FIXES.md`

If no fixes were necessary, state:

`No application-code fixes were required.`

If fixes were necessary, document each one.

## 15.7 `SLICE_6_FINAL_PRESERVATION.json`

Include:

* Preflight state.
* Postflight state.
* Protected-file comparisons.
* Protected absence-state comparisons.
* Intended changes.
* Unexpected changes.
* Cleanup results.

## 15.8 `SLICE_6_FINAL_SIGNOFF.md`

Include:

* Final evidence verdict.
* Administrative closure status.
* Acceptance summary.
* Preservation summary.
* Remaining limitations.
* Whether any additional Slice 6 verification is planned.

## 15.9 `SLICE_6_HANDOVER_TO_VISUAL_ENHANCEMENT.md`

Summarize:

* Implemented Slice 6 operational features.
* Existing map architecture.
* Existing visual improvements.
* Long-term scenic visual direction.
* Reference-image availability.
* Protected artwork.
* Known constraints for future visual work.

Do not create a new visual-enhancement specification.

Do not implement visual-enhancement features.

## 15.10 `SLICE_6_SOURCE_REFERENCES.json`

List the relevant existing handoffs and source files.

## 15.11 `handoff-manifest.json`

Include SHA-256 and size for every packaged file except the manifest itself.

## Additional evidence

Include the actual targeted browser screenshots and traces when available.

Do not package personal save contents, environment secrets, or unrelated WIP.

---

# 16. FINAL HANDOFF ZIP

Create exactly one final archive:

`project-genesis-post-v1-world-web-slice-6-final-browser-verification-and-signoff-handoff.zip`

Target location:

`D:\Cursor\Project Genesis\docs\architecture\reviews\project-genesis-post-v1-world-web-slice-6-final-browser-verification-and-signoff-handoff.zip`

Do not overwrite earlier handoffs.

Do not create additional archives.

---

# 17. ZIP INTEGRITY

After creating the archive:

1. Reopen the ZIP.
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

# 18. FINAL CURSOR RESPONSE

Your final response must contain:

## A. Verification scope

Confirm that only S6-AC-005 and S6-AC-008 were targeted.

## B. Responsive Inspector

Provide the actual result and evidence.

## C. Keyboard Accessibility

Provide the actual result and evidence.

## D. Targeted fixes

List actual fixes or state that none were required.

## E. Final acceptance summary

Report:

* PASS count.
* FAIL count.
* NOT_VERIFIED count.
* Historical versus newly verified results.

## F. Preservation

Report protected-file comparisons and cleanup results.

## G. Final evidence verdict

Provide OPTION A/B/C/D/E.

## H. Administrative closure

Provide:

* `CLOSED_VERIFIED`
* `CLOSED_WITH_DOCUMENTED_LIMITATIONS`
* `NOT_CLOSED_BLOCKED`

## I. Final ZIP

Provide:

* Exact path.
* SHA-256.
* Entry count.
* Manifest validation.
* CRC validation.

## J. Finality statement

Include:

**"Slice 6 has completed its final targeted verification pass. No additional broad Slice 6 audit cycle is planned. Future work will proceed according to the next approved development scope, and any newly discovered defect will be handled as a concrete, separately scoped issue."**

---

# 19. FINAL NON-NEGOTIABLE INSTRUCTIONS

Verify only the two outstanding criteria.

Do not repeat the full Slice 6 acceptance program.

Do not reopen Slice 5.

Do not introduce new features.

Do not redesign the world map.

Do not modify protected personal data.

Do not invent test evidence.

Do not force OPTION A.

Fix only confirmed defects within the narrow scope.

If browser verification is unavailable, report the limitation and finish the handoff.

Do not initiate another general audit cycle.

**Complete the targeted verification, document the true result, and bring the Slice 6 review cycle to a definitive end.**
