# Cursor Repository Closeout Prompt
# Project Genesis — Post-V1 Visual Production

## BR-001 Phase 1 — Commit & Push Closeout

MODE:
REPOSITORY CLOSEOUT ONLY

BR-001 PHASE 1 HAS ALREADY PASSED EXTERNAL REVIEW.

FINAL EXTERNAL GATE:

BR-001 PHASE 1 — CLOSED / PASS, SEALED

THIS TASK DOES NOT REOPEN BR-001.

DO NOT IMPLEMENT FEATURES.
DO NOT REDESIGN.
DO NOT RUN ANOTHER COVERAGE REVIEW.
DO NOT CREATE ANOTHER VALIDATION DELTA.
DO NOT MODIFY RELEASE TAGS.

THE ONLY PURPOSE OF THIS TASK IS TO:

1. verify the approved BR-001 working-tree changes;
2. ensure the commit contains only BR-001 task-owned work;
3. create the final BR-001 Phase-1 commit;
4. push that commit to origin/master;
5. verify repository and tag integrity;
6. report the resulting commit SHA.

---

# 1. Authority

Read:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Read:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1_CLOSE_CANDIDATE_REPORT.md

Read the final state of:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1D_MAIN_MENU_FAVICON_CONSUMER_INTEGRATION_REPORT.md

Do not reinterpret the approved technical decisions.

The close candidate has already received external approval.

---

# 2. Final Approved State

BR-001 Phase 1 is:

CLOSED / PASS

and may now be committed.

Approved scope includes:

- BR-001 sealed source artwork;
- certified runtime SVG;
- certified favicon derivatives;
- visual asset registry/sync work from Phase 1C;
- MainMenuHome BR-001 consumer;
- MainMenuHome scoped styling;
- 32×32 favicon metadata wiring;
- focused tests;
- shell test/snapshot cleanup;
- BR-001 lifecycle documentation;
- BR-001 architecture/review reports.

Do not add new functionality.

---

# 3. Sealed Asset Integrity

Before staging anything, verify:

docs/design/branding/BR-001_Logo.svg

SHA-256:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Runtime:

apps/web/public/assets/branding/BR-001.svg

SHA-256:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Favicon 16:

apps/web/public/favicon-16x16.png

SHA-256:

b4102b39cd782581cbbd131f70fc1cce06087c17e3c4b23c2b01616dafa8623d

Favicon 32:

apps/web/public/favicon-32x32.png

SHA-256:

4a1a3e3dbdfb3ced65d1af2e900f1ec35a9b83752edbceeea50ae8166e5345c6

All four must match exactly.

If any hash differs:

STOP.

DO NOT COMMIT.

Report:

BR-001 COMMIT CLOSEOUT — BLOCKED /
SEALED ASSET INTEGRITY FAILURE

---

# 4. Release Integrity Before Commit

Verify:

git rev-list -n 1 v1.0.0

must equal:

c4bb643df6fda7792906f34fbbb20ff07e9bfeef

Verify:

git rev-list -n 1 v1.0.0-rc.1

must equal:

442665cd6437bdebff88fd1540cedc689238c240

Do not move either tag.

Do not create a new tag.

Do not reopen V1 release state.

---

# 5. Inspect Repository State

Run:

git status --short
git diff --stat
git diff --name-only
git diff --staged
git log --oneline --decorate -10
git rev-parse HEAD
git rev-parse origin/master

Determine:

- which BR-001 changes are already committed locally;
- which BR-001 changes remain uncommitted;
- whether unrelated dirty work exists;
- whether local master contains prior approved commits not yet on origin/master.

IMPORTANT:

The previously reported baseline showed:

HEAD:
f512ac7642171d1708c6a6fe143ca922e4e9cc94

origin/master:
730ed190bb9c3b64c426b185a32fe36528c4bda7

Therefore do NOT assume all BR-001 work is currently uncommitted.

Audit actual Git history first.

---

# 6. Identify the Exact Commit Boundary

Before staging, classify every relevant file as one of:

A. already committed approved BR-001 work

B. currently uncommitted approved BR-001 work

C. unrelated dirty work

D. ambiguous

Do not stage category C.

If any file is category D and cannot be resolved from Git history and the approved reports:

STOP.

Do not guess.

The final commit must contain only the remaining approved BR-001 work.

---

# 7. Expected BR-001 Areas

Depending on what is already present in local commits, approved BR-001 work may include files under these areas:

docs/design/branding/

apps/web/public/assets/branding/

apps/web/public/favicon-16x16.png

apps/web/public/favicon-32x32.png

apps/web/src/presentation/assets/

apps/web/src/presentation/screens/menu/

apps/web/src/app/layout.tsx

focused BR-001 / visual registry tests

shell-components snapshot/structural test artifacts

runtime visual asset sync tooling

visual asset registry

docs/design/VISUAL_ASSET_CATALOG.md

docs/design/VISUAL_PRODUCTION_BACKLOG.md

docs/design/VISUAL_ASSET_CHANGELOG.md

docs/architecture/reviews/POST_V1_BR_001_*

relevant BR-001 development prompts if repository convention tracks them

This is NOT permission to stage every file in those directories.

Use actual diffs and Git history.

---

# 8. Preserve Unrelated Dirty Work

If unrelated working-tree changes exist:

LEAVE THEM UNTOUCHED.

Do not:

git add .

Do not:

git add -A

unless you have first proven that the entire working tree contains only approved BR-001 changes.

Prefer explicit file staging.

Do not stash unrelated user work unless repository instructions explicitly require it.

Do not reset unrelated files.

Do not clean the repository.

---

# 9. No New Implementation

During this closeout, do NOT modify:

BR-001 artwork

runtime derivatives

favicon strategy

MainMenuHome design

registry architecture

sync architecture

tests

CSS

coverage decisions

lifecycle decisions

unless a mechanical repository issue prevents committing an already approved file.

If you discover a substantive implementation problem:

STOP.

Do not repair it in this task.

---

# 10. Final Validation Before Staging

Do not repeat the entire implementation certification.

Perform only a lightweight repository closeout check.

Required:

- four asset hashes exact;
- approved focused test state is represented by the final reports;
- no known task-introduced failing test remains;
- lifecycle docs show BR-001 Phase 1 CLOSED/PASS;
- close candidate report shows READY TO CLOSE / PASS CANDIDATE;
- release tags unchanged.

Do not reopen historical root typecheck/build debt.

Do not require another browser QA session.

That work has already passed external review.

---

# 11. Stage Explicitly

Stage only the remaining approved BR-001 files.

Then run:

git diff --cached --stat
git diff --cached --name-status
git diff --cached

Review the entire staged delta.

Confirm:

- no unrelated file;
- no unexpected asset byte change;
- no release file;
- no package-version change;
- no tag operation;
- no unrelated visual feature;
- no gameplay/domain/API/YAML change.

If staged scope is contaminated:

unstage the unrelated files and re-check.

Do not commit until staged scope is clean.

---

# 12. Commit Strategy

Create ONE final closeout commit for the remaining uncommitted BR-001 Phase-1 work.

Do not squash or rewrite existing approved commits unless repository policy explicitly requires it.

Do not amend unrelated commits.

Do not rebase merely for cosmetic history cleanup.

Preserve already-existing BR-001 commits.

Recommended commit message:

feat(web): close BR-001 phase 1 branding

If the remaining delta is overwhelmingly documentation/test closeout because implementation is already committed, use instead:

docs: close BR-001 phase 1

Choose the message based on the actual staged delta.

Do not invent multiple commits unless technically necessary.

---

# 13. After Commit — Inspect Before Push

After committing, run:

git status --short
git show --stat --oneline HEAD
git show --name-status --format=fuller HEAD
git log --oneline --decorate -10
git rev-parse HEAD
git rev-parse origin/master

Confirm the new commit contains only the intended BR-001 closeout delta.

If it contains unrelated work:

DO NOT PUSH.

Report the problem.

Do not rewrite history automatically unless the correction is trivial and clearly safe under repository policy.

---

# 14. Push

If and only if the commit is clean:

push master to origin.

Use the normal repository push command.

Do not force push.

Do not push tags.

Do not create tags.

Expected operation conceptually:

git push origin master

Never:

git push --force

Never:

git push --tags

---

# 15. Verify Remote State

After push, verify:

git fetch origin

then:

git rev-parse HEAD
git rev-parse origin/master

Expected:

HEAD == origin/master

Record the exact final SHA.

Also verify again:

git rev-list -n 1 v1.0.0

must still equal:

c4bb643df6fda7792906f34fbbb20ff07e9bfeef

and:

git rev-list -n 1 v1.0.0-rc.1

must still equal:

442665cd6437bdebff88fd1540cedc689238c240

Tags moved:

NO

---

# 16. Final Asset Integrity After Push

Recalculate the four hashes one final time.

Expected:

BR-001 source SVG:
e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Runtime SVG:
e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

Favicon 16:
b4102b39cd782581cbbd131f70fc1cce06087c17e3c4b23c2b01616dafa8623d

Favicon 32:
4a1a3e3dbdfb3ced65d1af2e900f1ec35a9b83752edbceeea50ae8166e5345c6

All:

PASS

---

# 17. Do Not Create Another Closeout Document

Do NOT create another architecture review report solely for this Git operation.

The authoritative final review remains:

docs/architecture/reviews/
POST_V1_BR_001_PHASE_1_CLOSE_CANDIDATE_REPORT.md

The Git closeout result may be returned directly in Cursor's execution summary.

Only update an existing document if repository policy explicitly requires recording the final commit SHA.

Otherwise:

NO DOCUMENTATION CHANGE AFTER COMMIT.

---

# 18. Final State

If successful, BR-001 becomes:

BR-001 PHASE 1 — CLOSED / PASS, SEALED, PUSHED

This does NOT mean:

- V1 tag moves;
- new release;
- BR-001 Phase 2 starts;
- SplashScreen gets a logo;
- Workspace gets a logo;
- favicon 16 becomes wired;
- BR-002 begins automatically.

Those remain separate future decisions.

---

# 19. Final Execution Summary

Return exactly this structure:

# BR-001 Phase 1 — Commit & Push Closeout
## Execution Summary

### Baseline

- Branch:
- initial HEAD:
- initial origin/master:
- local commits ahead of origin before closeout:
- v1.0.0:
- v1.0.0-rc.1:

### Asset Integrity Before

- source SVG:
- runtime SVG:
- favicon 16:
- favicon 32:
- result:

### Working Tree Audit

- already committed BR-001 work:
- uncommitted approved BR-001 work:
- unrelated dirty work:
- ambiguous files:
- result:

### Staged Delta

- files staged:
- unrelated files staged:
- release files staged:
- result:

### Commit

- commit created:
- commit SHA:
- commit message:
- files in commit:
- unrelated work included:

### Push

- pushed:
- force push:
- tags pushed:
- result:

### Remote Verification

- final HEAD:
- final origin/master:
- HEAD == origin/master:
- v1.0.0:
- v1.0.0-rc.1:
- tags moved:

### Asset Integrity After

- source SVG:
- runtime SVG:
- favicon 16:
- favicon 32:
- result:

### Remaining Working Tree

- clean:
- unrelated dirty work preserved:
- remaining BR-001 uncommitted work:

### Final Decision

Use exactly one:

OPTION A —
BR-001 PHASE 1 — CLOSED / PASS, SEALED, PUSHED

OPTION B —
BR-001 PHASE 1 — CLOSED / PASS, SEALED /
COMMIT CREATED, PUSH BLOCKED

OPTION C —
BR-001 PHASE 1 — CLOSEOUT BLOCKED /
COMMIT SCOPE OR REPOSITORY STATE REQUIRES REVIEW

OPTION D —
BR-001 PHASE 1 — CLOSEOUT FAIL /
ASSET OR RELEASE INTEGRITY VIOLATION

STOP.

---

# CORE RULE

BR-001 IS ALREADY APPROVED.

THIS IS A GIT CLOSEOUT, NOT AN IMPLEMENTATION TASK.

AUDIT THE ACTUAL HISTORY FIRST.

DO NOT ASSUME ALL BR-001 FILES ARE UNCOMMITTED.

PRESERVE UNRELATED DIRTY WORK.

STAGE EXPLICITLY.

REVIEW THE STAGED DIFF.

CREATE ONE NECESSARY FINAL COMMIT.

PUSH MASTER NORMALLY.

NO FORCE PUSH.

NO TAG PUSH.

NO TAG MOVE.

VERIFY HEAD == ORIGIN/MASTER.

VERIFY SEALED ASSET HASHES.

REPORT THE FINAL SHA.

STOP.