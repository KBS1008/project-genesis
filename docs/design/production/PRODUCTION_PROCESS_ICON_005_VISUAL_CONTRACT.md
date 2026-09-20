# Production Process Visual Identity — ICON-005 Visual Contract

**Status:** **APPROVED / PRODUCTION AUTHORITY** — **7/7 production-active** (close candidate; independent seal external)

**Version:** 2026-09-20-icon-005-production-7-of-7-v1  
**Scope:** Tier-1 detailed **process / recipe** primary art (pilot only)

---

## 1. Purpose

ICON-005 answers: **“What industrial process / transformation is happening?”** for enabled production recipes. It is **not** building placement art (ICON-003), resource inventory icons (ICON-001), or research capability art (ICON-004).

---

## 2. Semantic role

| Layer | Role |
|-------|------|
| **Tier 1 — Process primary** | Per-recipe transformation identity on ProductionScreen (future) |
| **Building** | ICON-003 — where work can occur |
| **Resource** | ICON-001 — what is traded/stored |
| **Technology** | ICON-004 — what capability was unlocked |

Resolver (future, not pilot): `recipeId → optional ICON-005 primary → building/resource fallbacks → generic`.

---

## 3. Relationship to ICON-001

Material cues (wood, ore, steel, electronics) may inform **physical props in the vignette**. Forbidden: floating resource UI badges, pasted inventory icons, diagram arrows between icon tokens.

---

## 4. Relationship to ICON-003

ICON-003 = **placeable facility**. ICON-005 = **active process apparatus** — closer framing, less architectural mass, no full building exteriors as hero subject.

---

## 5. Relationship to ICON-004

ICON-004 = capability / instrumentation grammar. ICON-005 = **productive transformation in action** — must not reuse technology primaries unchanged.

---

## 6. Camera / composition

3/4 process-focused vignette; compact platform; strong central silhouette; industrial lighting compatible with dark UI; may be slightly closer than building primaries for transformation readability.

---

## 7. Process-action requirement

Primary must read as **ongoing or recently active transformation**, not static warehouse still-life.

---

## 8. Material language

Stylized detailed industrial game art — metal, wood, heat, precision assembly as appropriate per recipe YAML semantics.

---

## 9. Alpha

1024×1024 RGBA target; real transparency; programmatic alpha QA required before human gate.

---

## 10. Text prohibition

No readable text, labels, logos, fake UI screens, or pseudo-writing.

---

## 11. People policy

No workers/people by default — machinery and material interaction only.

---

## 12. Scale behavior

Acceptance inspection: **96 / 128**; reward inspection: **256**; catalog row targets **64–96** (future consumer).

---

## 13. Building-vs-process rule

Side-by-side with matching `buildingTypes` from recipe YAML: process art must not be confused with building catalog primary.

---

## 14. Technology-vs-process rule

Side-by-side with related research tech where applicable: process art must not duplicate ICON-004 primary composition.

---

## 15. Resource-vs-process rule

Must exceed “single resource icon on neutral background” — must show **transformation apparatus**.

---

## 16. Generated-art QA

Edge halo, accidental text, watermark, checkerboard bake — fail and repair before promotion.

---

## 17. Future production activation rules

Requires: human seal of pilot grammar, bounded production batch, manifest, registry entries, runtime files under dedicated paths, **no** ProductionScreen wiring until production slice explicitly authorizes.

---

## 18. Production assets (active)

Masters: `docs/design/production/icon-005/primary/ICON-005-{recipeId}-primary.png`  
Runtime: `apps/web/public/assets/process/`  
Manifest: `ICON_005_PRODUCTION_7_OF_7_MANIFEST.json`  
Resolver: `process-visual-asset-ids.ts` + `ProductionProcessVisual` on ProductionScreen recipe catalog.

Pilot history preserved under `pilot-icon-005/`.

---

## 19. Version history

| Date | Change |
|------|--------|
| 2026-09-20 | Pilot contract — 3 recipe art-direction primaries |
| 2026-09-20 | **Production 7/7** — promote 3 pilots + 4 new primaries; registry + bounded ProductionScreen integration |

**APPROVED / PRODUCTION AUTHORITY for enabled recipes (7/7).** Independent track seal remains external review.
