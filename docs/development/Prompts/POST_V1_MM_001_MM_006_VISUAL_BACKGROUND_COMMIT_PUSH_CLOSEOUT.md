# Cursor Repository Closeout Prompt
# Project Genesis — Post-V1 Visual Background Cleanup

## MM-001 + MM-006 — Commit / Push Closeout

MODE:
REPOSITORY CLOSEOUT ONLY

NO IMPLEMENTATION.
NO ART ITERATION.
NO UI CHANGES.
NO TEST EXPANSION.
NO NEW VALIDATION SCOPE.
NO REGISTRY CHANGE.
NO SYNC-CODE CHANGE.
NO RELEASE CHANGE.
NO TAG CHANGE.

The following work is already approved and sealed:

MM-006 MENU-FREE BACKGROUND REPLACEMENT
= CLOSED / PASS, SEALED

MM-001 MENU-FREE BACKGROUND REPLACEMENT
= CLOSED / PASS, SEALED

This task exists only to safely commit and push the already-approved
repository changes.

---

# 1. Read Authority

Read:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md

Read:

docs/architecture/reviews/
POST_V1_MM_006_MENU_FREE_BACKGROUND_REPLACEMENT_CLOSE_CANDIDATE_REPORT.md

Read:

docs/architecture/reviews/
POST_V1_MM_001_MENU_FREE_BACKGROUND_REPLACEMENT_CLOSE_CANDIDATE_REPORT.md

Do not reinterpret their implementation decisions.

Do not reopen either asset.

---

# 2. Sealed Asset Expectations

## MM-006

Expected authoritative/runtime PNG SHA-256:

568bb64cca148aa32959755619b37486999427c61bb908fc6a29eb81059a789c

Expected runtime WebP SHA-256:

8b43dce51e99da852d2ec7c8945816d010228f792ca6ded1c469110a96a51f90

## MM-001

Expected authoritative/runtime PNG SHA-256:

fc91ce7adfa0208daa50209ef079883641dacaf296264dc1f56fc271772f2cf5

Expected runtime WebP SHA-256:

04cf6b19e27457f76f8a2d4a51c17d4218ef0051d8453772b67223951bdcec3c

Verify these exact hashes before commit.

If any sealed hash differs unexpectedly:

STOP.

Do not normalize or regenerate blindly.

---

# 3. Release Tags Must Remain Unchanged

Expected:

v1.0.0
c4bb643df6fda7792906f34fbbb20ff07e9bfeef

v1.0.0-rc.1
442665cd6437bdebff88fd1540cedc689238c240

Verify:

git rev-list -n 1 v1.0.0
git rev-list -n 1 v1.0.0-rc.1

No tag creation.
No tag movement.
No tag push.

---

# 4. Audit Actual Git History First

Important:

Previous reports showed:

HEAD:
517b1e51e51068ac0daffeccee0761d405d5816d

and a stale local origin/master ref.

Therefore do not assume repository topology.

Run first:

git status --short
git log --oneline --decorate -n 20
git rev-parse HEAD

Attempt:

git fetch origin

If fetch succeeds:

git rev-parse origin/master
git log --oneline --decorate --graph --all -n 30

If fetch fails due EPERM/environment:

record that exactly.

Do not fabricate remote state.

---

# 5. Classify Working Tree Changes

Inspect all current changes.

Classify every changed/untracked file into exactly one category:

A —
APPROVED MM-001 BACKGROUND CLEANUP

B —
APPROVED MM-006 BACKGROUND CLEANUP

C —
SHARED APPROVED VISUAL LIFECYCLE / CLOSEOUT DOC

D —
ALREADY COMMITTED APPROVED WORK

E —
UNRELATED DIRTY WORK

F —
AMBIGUOUS

Do not stage E.

Do not stage F until proven task-owned.

Preserve unrelated dirty work exactly.

---

# 6. Expected MM-001 Task-Owned Files

Expected candidates include:

docs/design/Bilder/einzelne_bilder/hochgeladen/
MM-001_Main_Menu_Final.png

docs/design/Mockups/main-menu/
MM-001_Main_Menu.png

apps/web/public/assets/main-menu/
MM-001.png

apps/web/public/assets/main-menu/
MM-001.webp

docs/design/VISUAL_ASSET_CATALOG.md

docs/design/VISUAL_PRODUCTION_BACKLOG.md

docs/design/VISUAL_ASSET_CHANGELOG.md

docs/architecture/reviews/
POST_V1_MM_001_EMBEDDED_UI_CLEANUP_AUDIT.md

docs/architecture/reviews/
POST_V1_MM_001_MENU_FREE_BACKGROUND_REPLACEMENT_CLOSE_CANDIDATE_REPORT.md

relevant MM-001 prompt files if repository policy tracks prompts.

This is not blanket staging permission.

Verify actual diffs.

---

# 7. Expected MM-006 Task-Owned Files

Expected candidates include:

docs/design/Bilder/einzelne_bilder/hochgeladen/
MM-006_Splash.png

docs/design/Mockups/main-menu/
MM-006_Splash.png

apps/web/public/assets/main-menu/
MM-006.png

apps/web/public/assets/main-menu/
MM-006.webp

docs/design/VISUAL_ASSET_CATALOG.md

docs/design/VISUAL_PRODUCTION_BACKLOG.md

docs/design/VISUAL_ASSET_CHANGELOG.md

docs/architecture/reviews/
POST_V1_MM_006_MENU_FREE_BACKGROUND_REPLACEMENT_AUDIT.md
if it exists and is intentionally tracked

docs/architecture/reviews/
POST_V1_MM_006_MENU_FREE_BACKGROUND_REPLACEMENT_CLOSE_CANDIDATE_REPORT.md

relevant MM-006 prompt files if repository policy tracks prompts.

Again:

verify actual diffs before staging.

---

# 8. Candidate Working Files

Temporary/generated candidate files must be reviewed carefully.

Examples may include:

MM-001_Main_Menu_Background_NoUI.png

MM-006_Splash_Background_NoUI.png
or similarly named candidate images.

Determine repository convention.

If these are explicitly intended as retained design-source working assets:

include only if lifecycle/history conventions support that.

If they were temporary staging candidates and the authoritative source has
already replaced them:

do not automatically stage them.

Do not delete them unless repository policy and task evidence clearly support
deletion.

If uncertain:

leave them uncommitted and report them.

Do not block the approved closeout solely because an optional candidate file
remains untracked.

---

# 9. Shared Lifecycle Documents

The following may contain both MM-001 and MM-006 approved updates:

docs/design/VISUAL_ASSET_CATALOG.md

docs/design/VISUAL_PRODUCTION_BACKLOG.md

docs/design/VISUAL_ASSET_CHANGELOG.md

Review their diffs carefully.

Stage them only if the current diff consists of approved MM-001/MM-006
lifecycle changes plus already-approved related visual closeout content.

If the same file contains unrelated unapproved edits:

use selective staging if safe.

Do not overwrite unrelated edits.

Do not use blanket checkout/reset.

---

# 10. Forbidden Staging

Do not stage unrelated changes in:

gameplay

domain

API

YAML

package versions

release files

M11/M12 historical material

unrelated visual assets

BR-001 source/runtime

ICON families

MM-007

unrelated saves

personal/editor files

temporary environment output

Do not use:

git add .

git add -A

unless you have first proven that every changed file is task-owned,
which is not expected here.

Prefer explicit paths.

---

# 11. No Revalidation Loop

Do not repeat:

browser QA

full visual audit

art review

responsive design review

coverage analysis

architecture review

The close candidates already passed those gates.

Only perform lightweight integrity checks needed for safe commit/push.

Accept existing classified historical typecheck/build debt.

Do not reopen it.

---

# 12. Lightweight Integrity Checks

Before staging:

verify four sealed asset hashes:

MM-001 PNG/source
MM-001 WebP
MM-006 PNG/source
MM-006 WebP

verify:

BR-001 runtime SVG still equals:

e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195

verify release tags.

No broad test suite required.

If a very cheap task-owned asset certification test is available and already
configured, it may be run once.

Do not create new tests.

---

# 13. Stage Explicitly

Stage only approved task-owned content.

Use explicit paths.

Then inspect:

git diff --cached --stat

git diff --cached --name-only

git diff --cached

Confirm:

- only approved MM-001/MM-006 closeout content staged;
- no unrelated source code;
- no release metadata;
- no tag mutation;
- no gameplay/domain/API/YAML;
- no accidental generated junk.

If staged diff contains unrelated material:

unstage selectively and correct.

---

# 14. Commit Strategy

Preferred outcome:

ONE final closeout commit for the remaining uncommitted
MM-001 + MM-006 visual background cleanup work.

Suggested commit message:

feat(web): close MM-001 and MM-006 menu-free backgrounds

Alternative if actual staged content is overwhelmingly asset/docs only:

docs: close MM-001 and MM-006 visual backgrounds

Choose based on actual staged content.

Do not amend unrelated historical commits.

Do not squash unrelated work.

Do not rebase unless absolutely required for normal push and safe under
repository policy.

---

# 15. Push

After successful commit:

attempt normal:

git push origin master

NO force push.

NO --force-with-lease.

NO tag push.

If push is rejected because remote advanced:

STOP before any risky history rewrite.

Fetch if possible.

Report the divergence.

Do not rebase or merge automatically unless repository policy makes the
resolution trivial and unambiguous.

If environment blocks push:

report exact error.

Do not claim success.

---

# 16. Post-Push Verification

If push succeeds:

run:

git rev-parse HEAD
git rev-parse origin/master

Verify:

HEAD == origin/master

Verify tags again:

git rev-list -n 1 v1.0.0

git rev-list -n 1 v1.0.0-rc.1

Verify sealed hashes again.

Run:

git status --short

Report unrelated dirty files still preserved.

Do not clean unrelated work.

---

# 17. No New Closeout Document Unless Needed

Do not create another repository closeout document unless:

- project policy explicitly requires the final commit SHA to be recorded; or
- an existing lifecycle document contains a dedicated field for final commit.

If no such requirement exists:

the git commit itself is sufficient.

Do not create documentation churn.

---

# 18. Final Success State

Success requires:

- MM-001 sealed hashes exact;
- MM-006 sealed hashes exact;
- BR-001 untouched;
- tags unchanged;
- only approved task-owned changes committed;
- unrelated dirty work preserved;
- push successful;
- HEAD == origin/master after push.

Then report:

MM-001 + MM-006 VISUAL BACKGROUND CLEANUP —
CLOSED / PASS, SEALED, PUSHED

---

# 19. Failure / Stop Conditions

STOP and report if:

- sealed MM-001/MM-006 hash mismatch;
- BR-001 unexpected modification;
- tag mismatch;
- ambiguous mixed staged diff cannot be separated safely;
- remote history diverged materially;
- push rejected requiring risky history rewrite;
- repository state suggests unrelated work would be overwritten;
- fetch/push blocked and remote state cannot be verified.

Do not improvise around these.

---

# 20. Execution Summary

Return:

# MM-001 + MM-006 — Visual Background Commit / Push Closeout
## Execution Summary

### Repository Baseline

- Branch:
- initial HEAD:
- fetch:
- origin/master:
- divergence:
- v1.0.0:
- v1.0.0-rc.1:

### Sealed Asset Verification

- MM-001 PNG/source SHA-256:
- MM-001 WebP SHA-256:
- MM-006 PNG/source SHA-256:
- MM-006 WebP SHA-256:
- BR-001 SHA-256:
- result:

### Working Tree Classification

- approved MM-001 files:
- approved MM-006 files:
- shared lifecycle files:
- already committed approved files:
- unrelated dirty files:
- ambiguous files:

### Staging

- staged files:
- unrelated staged files:
- cached diff reviewed:
- result:

### Commit

- commit created:
- commit SHA:
- commit message:

### Push

- push attempted:
- push result:
- remote error if any:

### Post-Push Verification

- final HEAD:
- origin/master:
- HEAD == origin/master:
- v1.0.0:
- v1.0.0-rc.1:
- tags unchanged:
- sealed hashes unchanged:
- unrelated dirty work preserved:

### Final Decision

Use exactly one:

OPTION A —
MM-001 + MM-006 VISUAL BACKGROUND CLEANUP —
CLOSED / PASS, SEALED, PUSHED

OPTION B —
REPOSITORY CLOSEOUT BLOCKED —
NO DATA LOSS / NO RISKY HISTORY CHANGE

STOP.

---

# CORE RULE

THIS IS NOT AN IMPLEMENTATION TASK.

MM-001 AND MM-006 ARE ALREADY APPROVED.

DO NOT TOUCH THEIR DESIGN OR ARCHITECTURE.

AUDIT THE REAL GIT STATE.

VERIFY THE SEALED HASHES.

STAGE ONLY APPROVED FILES.

PRESERVE UNRELATED DIRTY WORK.

MAKE ONE SAFE CLOSEOUT COMMIT IF APPROPRIATE.

PUSH NORMALLY.

DO NOT MOVE TAGS.

DO NOT FORCE PUSH.

VERIFY HEAD == ORIGIN/MASTER.

REPORT.

STOP.