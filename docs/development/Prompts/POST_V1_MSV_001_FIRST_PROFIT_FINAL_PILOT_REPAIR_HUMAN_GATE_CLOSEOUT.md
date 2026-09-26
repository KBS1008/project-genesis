# POST-V1 MSV-001 — First-Profit Final Pilot Repair & Human-Gate Closeout

## MODE

Bounded final pilot repair + evidence refresh + human-gate closeout candidate.

This is NOT:
- a new art-direction exploration,
- a production batch,
- a milestone UI implementation,
- a gameplay/content change,
- a broad visual redesign,
- an invitation to regenerate already-approved pilot art.

The MSV-001 art direction has already received HUMAN APPROVAL with exactly one bounded visual defect remaining:

`first_profit` contains baked/readable text inside the artwork.

Repair that defect, revalidate the affected evidence, update the pilot authority documents accurately, and STOP with one final human-gate closeout candidate.

Follow:

`docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`

Do not commit, push, or tag.

---

# 1. HUMAN REVIEW AUTHORITY — DO NOT REOPEN

Human review of the existing MSV-001 pilot established:

## Art direction

**APPROVED**

The approved family language is:

> Stylized industrial achievement vignette inside a restrained octagonal industrial frame, centered on accomplishment/payoff rather than a catalog object.

## Tier model

**APPROVED**

- Tier 1 = detailed Achievement Primary
- Tier 2 = derived compact Achievement Medallion

## Existing pilot decisions

- `first_production` → **PASS**
- `first_steel` → **PASS**
- `first_consumer_goods` → **PASS**
- `first_profit` → **REVISE — ONE BOUNDED DEFECT**

## Scalability

8/8 milestone coverage is considered:

**VIABLE WITH SPECIAL CARE FOR ABSTRACT ECONOMIC MILESTONES**

especially:

- `first_profit`
- `profit_100`

Do not reopen these human decisions unless hard new evidence demonstrates a material problem.

---

# 2. EXACT DEFECT TO REPAIR

The current `first_profit` pilot visibly contains baked text:

> `FIRST PROFITABLE SALE`

This violates the existing MSV-001 contract.

Relevant contract rules include:

- no readable text,
- no milestone names baked into artwork,
- no numbers,
- no progress bars,
- no UI labels,
- no logos,
- no pseudo-writing.

The existing pilot report's claim that no baked text was observed is therefore incorrect for `first_profit`.

This task must correct both:

1. the artwork defect;
2. any report/evidence statements that incorrectly imply the old artwork passed the no-text gate.

---

# 3. SCOPE FIREWALL

## Allowed

Only task-local MSV-001 pilot repair work required to:

- repair `first_profit`;
- derive its repaired Tier-2 medallion;
- rerun technical QA;
- regenerate affected MSV-001 evidence;
- correct pilot documentation;
- produce a final human-gate closeout candidate.

## Forbidden

Do NOT:

- activate MSV-001 in production;
- create a runtime milestone registry/resolver;
- create `MilestoneVisual`;
- wire milestone art into runtime UI;
- modify milestone gameplay;
- modify milestone triggers;
- modify milestone YAML semantics;
- change milestone rewards;
- change milestone names/localization;
- create the remaining four milestone production assets;
- start MSV-001 Production;
- regenerate `first_production`;
- regenerate `first_steel`;
- regenerate `first_consumer_goods`;
- change ICON-001;
- change ICON-002;
- change ICON-003;
- change ICON-004;
- change ICON-005;
- change WFV-001;
- change World visuals;
- change Production visuals;
- change Research visuals;
- change Workforce visuals;
- redesign progression UI;
- absorb unrelated working-tree churn.

No commit.
No push.
No tag.

---

# 4. BASELINE FIRST

Before editing:

1. record:
   - branch,
   - HEAD,
   - working-tree state;

2. identify all existing MSV-001 pilot files;

3. distinguish:
   - task-owned predecessor MSV-001 pilot files,
   - unrelated working-tree changes;

4. do not absorb unrelated churn.

Confirm current production state remains:

> MSV-001 production milestone art = 0/8

The existing four pilot concepts remain DEV/PILOT until the later production phase.

---

# 5. AUTHORITATIVE SEMANTICS — `first_profit`

Re-read the authoritative milestone definition for:

`first_profit`

from:

`game-content/milestones/*.yaml`

Also inspect the existing MSV-001 semantic inventory and contract.

The intended accomplishment is the first successful resource sale / first commercial success.

The repaired artwork must communicate:

> industrial commercial success / value creation / first successful sale

without relying on written language.

Do NOT turn it into:

- generic money art;
- coins;
- dollar/euro symbols;
- cash piles;
- casino imagery;
- stock-market clichés;
- literal charts with numbers;
- trophy imagery;
- a generic office;
- an ICON-003 building card;
- an ICON-005 production process;
- a resource icon in a decorative frame.

The current industrial/economic metaphor may be preserved if it remains semantically honest.

---

# 6. REPAIR STRATEGY

This is a repair, not a redesign.

Preserve as much of the approved `first_profit` visual concept as practical:

- industrial setting;
- accomplishment/payoff composition;
- established MSV octagonal achievement frame;
- approved palette;
- family camera/composition;
- economic/value-flow metaphor.

Remove ALL baked readable or pseudo-readable text from the artwork.

Specifically, the replacement must contain:

- no `FIRST PROFITABLE SALE`;
- no replacement caption;
- no plaque wording;
- no milestone title;
- no numbers;
- no currency symbol;
- no generated pseudo-text.

If simply editing/removing the text creates an obviously empty plaque/sign, repair the composition so the area reads naturally as part of the industrial achievement scene.

Do not merely blur the old words.

Do not cover the text with an obvious rectangle.

The final artwork must look intentionally designed without text.

---

# 7. TIER-1 PRIMARY REQUIREMENTS

Repair exactly:

`first_profit`

Tier-1 Achievement Primary.

Preserve the established production-direction technical target:

- approximately 1024×1024;
- RGBA;
- real transparency where required by the family;
- clean alpha;
- no checkerboard baked into opaque areas;
- no accidental matte/halo;
- no generated text;
- no logos;
- no obvious malformed industrial geometry;
- no duplicated foreign asset fragments.

Visual target:

- strong at 128–256 px;
- readable at 96 px;
- unmistakably an achievement/reward;
- clearly differentiated from the sealed visual families.

Do not modify the other three approved Tier-1 pilots.

---

# 8. TIER-2 MEDALLION REPAIR

Regenerate/derive only the `first_profit` Tier-2 medallion from the repaired Tier-1 primary.

Preserve the approved model:

> Tier-2 = derived medallion from Tier-1 with strengthened achievement frame and tighter crop.

Validate at:

- 32 px diagnostic;
- 48 px;
- 64 px;
- 96 px.

Primary compact acceptance sizes:

- 48 px;
- 64 px.

32 px remains diagnostic and does not need to carry fine semantic detail.

The repaired medallion must contain no residual readable or pseudo-readable text.

Do not regenerate the other three medallions unless evidence composition tooling requires recomposing the board from unchanged source assets.

If recomposed, their underlying art must remain byte-identical where practical.

---

# 9. NO-TEXT QA — MAKE THIS EXPLICIT

The previous pilot QA failed to catch visible text.

Strengthen the pilot-local QA/checklist so this cannot simply be reported as PASS again without visual inspection.

The final report must explicitly include a manual visual no-text review for all four pilot primaries:

| Milestone | Readable baked text | Pseudo-text concern | Result |
|---|---:|---:|---|
| first_production | ... | ... | PASS/FAIL |
| first_steel | ... | ... | PASS/FAIL |
| first_profit | ... | ... | PASS/FAIL |
| first_consumer_goods | ... | ... | PASS/FAIL |

Do not claim automated image tooling can reliably prove the absence of generated text if it cannot.

Technical tooling may verify dimensions/alpha/decode/etc.

The final no-text gate requires explicit visual inspection.

---

# 10. TECHNICAL QA

Run technical QA on the repaired `first_profit` primary and medallion.

Required:

## Primary

- decode PASS;
- expected dimensions PASS;
- RGBA PASS;
- alpha/transparency policy PASS;
- no checkerboard suspicion;
- no halo/matte issue;
- no corrupted pixels;
- no obvious crop failure.

## Medallion

- decode PASS;
- expected dimensions PASS;
- crop PASS;
- 48 px readability PASS;
- 64 px readability PASS.

Also confirm unchanged pilot files still resolve correctly.

Do not count evidence boards as production assets.

---

# 11. REQUIRED EVIDENCE REFRESH

Regenerate the MSV-001 evidence affected by the repaired `first_profit`.

At minimum refresh:

`docs/architecture/reviews/evidence/MSV_001_ART_DIRECTION_4_PILOT_FAMILY_BOARD.png`

`docs/architecture/reviews/evidence/MSV_001_ACHIEVEMENT_MEDALLION_BOARD.png`

`docs/architecture/reviews/evidence/MSV_001_STATIC_PROGRESSION_CONTEXT_MOCK.png`

Also refresh any other existing board that contains the old `first_profit` artwork.

If the scale board does not contain `first_profit`, it may remain unchanged.

If the state-treatment board only uses another milestone, it may remain unchanged.

If the cross-family board does not contain `first_profit`, it may remain unchanged.

Do not regenerate unrelated evidence merely to create churn.

---

# 12. REQUIRED NEW FOCUSED REPAIR EVIDENCE

Create one focused before/after validation board:

`docs/architecture/reviews/evidence/MSV_001_FIRST_PROFIT_FINAL_REPAIR_BOARD.png`

It should show:

## OLD / rejected pilot

Small reference only, clearly marked:

`OLD — REJECTED: baked text`

## NEW / repaired pilot

Show repaired primary at approximately:

- 256 px;
- 128 px;
- 96 px.

Also show repaired medallion at:

- 64 px;
- 48 px.

The purpose is not aesthetic decoration.

It must make the repaired defect independently reviewable.

---

# 13. VISUAL ACCEPTANCE GATE

Before declaring the repair close-ready, inspect the actual generated images.

The repaired `first_profit` must satisfy ALL:

### A. No text

No readable:

- words;
- milestone names;
- captions;
- currency symbols;
- numbers;
- pseudo-writing.

### B. Semantic honesty

Still communicates:

- first commercial success;
- industrial value creation;
- successful sale/payoff.

### C. Family coherence

Still unmistakably belongs beside:

- `first_production`;
- `first_steel`;
- `first_consumer_goods`.

### D. Cross-family differentiation

Must not collapse into:

- ICON-001 resource;
- ICON-003 building;
- ICON-004 technology;
- ICON-005 process;
- WFV-001 workforce.

### E. Compact viability

48/64 px medallion remains readable as a distinct achievement.

### F. Reward quality

At 128–256 px it should feel like a meaningful game achievement, not an administrative dashboard icon.

If the repaired asset fails one of these gates:

repair it within this task.

Do not return a known weak close candidate.

---

# 14. CONTRACT UPDATE

Update:

`docs/design/milestones/MILESTONE_VISUAL_IDENTITY_MSV_001_ART_CONTRACT.md`

Do NOT rewrite history.

Preserve the pilot history and append the human-gate outcome.

Record accurately:

- Art Direction → APPROVED;
- Tier model → APPROVED: Primary + derived Medallion;
- `first_production` → PASS;
- `first_steel` → PASS;
- `first_consumer_goods` → PASS;
- original `first_profit` → REVISE due baked text;
- repaired `first_profit` → pending final human closeout until this repair is reviewed;
- 8/8 scalability → VIABLE with special care for abstract economic milestones.

The contract is still NOT production authority during this task.

Do not set it to production authority.

Appropriate post-task status is conceptually:

`ART DIRECTION APPROVED / PILOT FINAL HUMAN CLOSEOUT PENDING`

until independent human review seals the repaired asset.

---

# 15. PILOT REPORT CORRECTION

Update the existing pilot review/report:

`docs/architecture/reviews/POST_V1_MSV_001_MILESTONE_ACHIEVEMENT_VISUAL_IDENTITY_ART_DIRECTION_CONTRACT_PILOT.md`

Preserve history.

Correct the previous inaccurate statement that implied no baked text existed.

Record:

- human reviewer found baked `FIRST PROFITABLE SALE` text in `first_profit`;
- this violated the contract;
- one bounded repair was ordered;
- art direction itself remained approved;
- other three pilots remained approved;
- repaired evidence paths;
- current closeout status.

Do not pretend the original QA caught the defect.

This audit trail matters.

---

# 16. INVENTORY UPDATE

Update:

`docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`

only if necessary to accurately represent the state.

Production accounting remains:

> MSV-001 = 0/8 production

The four Tier-1 and four Tier-2 pilot assets remain:

> DEV / PILOT / excluded from production Scenario-B authored totals

Do not increase the Scenario-B production count.

Do not mark MSV-001 production ACTIVE.

If the inventory currently says human gate open, update only to the most accurate state, e.g.:

> MSV-001 art direction approved; final repaired pilot awaiting independent seal; 0/8 production.

---

# 17. DO NOT TOUCH THE REMAINING FOUR MILESTONES

Do not create art for:

- `first_machine_parts`;
- `first_industrial_machinery`;
- `first_advanced_electronics`;
- `profit_100`.

Their scalability has already been assessed.

They belong to the later production phase after the pilot is sealed.

Especially:

do NOT attempt to solve `profit_100` during this repair.

---

# 18. TEST / QUALITY GATES

Because this is primarily an art/document/evidence repair, run the relevant repository gates according to the implementation guide.

At minimum verify no task-local breakage.

If task changes touch executable tooling, run the relevant focused tooling/tests.

Before final close candidate, run the normal root gates unless the implementation guide provides a narrower justified path:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build:web`

Required result:

- typecheck PASS;
- lint 0 errors;
- tests PASS;
- build:web PASS.

Also report:

- primary technical QA;
- medallion technical QA;
- manual no-text visual QA;
- evidence generation status.

Do not repair unrelated pre-existing failures outside task scope.

If a root gate fails because of unrelated baseline churn, prove that clearly rather than absorbing it.

---

# 19. FINAL CLOSEOUT REPORT

Create:

`docs/architecture/reviews/POST_V1_MSV_001_FIRST_PROFIT_FINAL_PILOT_REPAIR_HUMAN_GATE_CLOSEOUT.md`

The report must contain:

## A. Baseline

- branch;
- HEAD;
- working-tree classification.

## B. Exact defect

State explicitly:

> Original `first_profit` contained baked readable text `FIRST PROFITABLE SALE`, violating the MSV-001 no-text contract.

## C. Repair performed

Describe exactly what changed.

## D. Asset integrity

For repaired primary + medallion:

- dimensions;
- format;
- alpha;
- decode;
- artifact inspection.

## E. No-text matrix

All four pilot primaries.

## F. Visual gate

For repaired `first_profit`:

- semantic honesty;
- family coherence;
- cross-family differentiation;
- 96/128/256 readability;
- 48/64 medallion readability;
- reward quality.

## G. Evidence

List all refreshed/new evidence paths.

## H. Unchanged approved pilots

Explicitly confirm:

- `first_production` unchanged;
- `first_steel` unchanged;
- `first_consumer_goods` unchanged.

If byte identity can be proven, report hashes.

## I. Production firewall

Confirm:

- 0/8 production;
- no registry/resolver;
- no runtime wiring;
- no milestone gameplay/content change;
- no remaining-four production art;
- no unrelated family changes.

## J. Scenario-B accounting

Confirm:

- pilot assets remain excluded;
- production primary count unchanged.

## K. Repository gates

Report exact commands and results.

## L. Final recommendation

Choose exactly ONE:

### OPTION A — FINAL PILOT HUMAN-GATE CLOSEOUT CANDIDATE READY

Use only if:
- repaired first_profit passes all visual/technical gates;
- no baked text remains;
- three previously approved pilots remain intact;
- evidence refreshed;
- repository gates acceptable;
- production remains 0/8.

### OPTION B — ONE BOUNDED REPAIR STILL REQUIRED

Use if the new `first_profit` still has a concrete repairable visual defect.

Name exactly that defect.

### OPTION C — ART-DIRECTION ISSUE DISCOVERED

Use only if hard new evidence shows the already-approved MSV-001 art direction itself cannot satisfy the contract.

This should require strong evidence.

### OPTION D — BLOCKED BY NON-TASK BASELINE FAILURE

Use only if a genuine unrelated repository failure prevents trustworthy closeout.

---

# 20. STOP CONDITION

After producing the final closeout candidate:

STOP.

Do not:

- declare human approval yourself;
- mark MSV-001 SEALED;
- promote pilots to production;
- start Production Batch;
- create the remaining four milestone assets;
- wire runtime milestone visuals;
- commit;
- push;
- tag.

Independent human review will determine the final seal.

---

# 21. CONSOLIDATED DEFINITION OF DONE

This task is DONE only when all of the following are true:

- [ ] only `first_profit` art was repaired;
- [ ] baked `FIRST PROFITABLE SALE` text is gone;
- [ ] no replacement text/pseudo-text exists;
- [ ] repaired primary remains semantically honest;
- [ ] repaired primary matches approved MSV family;
- [ ] repaired medallion is derived and readable at 48/64 px;
- [ ] `first_production` remains approved/unchanged;
- [ ] `first_steel` remains approved/unchanged;
- [ ] `first_consumer_goods` remains approved/unchanged;
- [ ] technical QA passes;
- [ ] explicit manual no-text QA covers all four pilots;
- [ ] affected family evidence refreshed;
- [ ] focused repair board created;
- [ ] contract history updated honestly;
- [ ] previous report's missed-text QA claim corrected honestly;
- [ ] inventory remains 0/8 production;
- [ ] Scenario-B production accounting unchanged;
- [ ] no runtime activation occurred;
- [ ] no gameplay/content semantics changed;
- [ ] no unrelated visual family changed;
- [ ] repository gates are green or any unrelated baseline failure is proven;
- [ ] exactly one final closeout report exists;
- [ ] Cursor stops after the close candidate;
- [ ] no commit/push/tag performed.

---

# CORE RULE

The MSV-001 art direction is already approved.

Do not redesign it.

Repair exactly one known defect:

`first_profit` must communicate industrial commercial success WITHOUT baked text.

Then prove the repair visually and technically, preserve the other three approved pilots, keep MSV-001 at 0/8 production, return one final human-gate closeout candidate, and STOP.