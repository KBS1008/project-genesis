# Technology / Research Visual Identity — ICON-004 Visual Contract

**Status:** APPROVED / PRODUCTION AUTHORITY  
**Scope:** ICON-004 two-tier technology visual identity (Tier-1 detailed primary + Tier-2 category compact)  
**Batch 1 activated:** 2026-09-19 — 8 detailed primaries, 10/10 used category compacts  
**Batch 2 activated:** 2026-09-19 — +6 detailed primaries (14/22 cumulative)  
**Batch 3 activated:** 2026-09-19 — +4 detailed primaries (18/22 cumulative; 4 abstract deferred)

---

## 1. Purpose

Define scalable **research/technology domain identity** distinct from resources (ICON-001), building categories (ICON-002), and building types (ICON-003). Consumer-first: **32–48px** row/catalog glyphs in Research UI.

---

## 2. Consumer roles

| Role | Asset | Scale |
|------|--------|-------|
| Category domain glyph | `ICON-004-category-{TechnologyCategory}-pilot.svg` (pilot) | 32 / 48 primary |
| Future per-tech (optional) | `ICON-004-{technologyId}` | TBD by Model B/C |
| Fallback | Generic research glyph | Defensive only |

ResearchScreen **unchanged** in pilot; dev/static evidence only.

---

## 3. Visual language

Engineered industrial **knowledge** glyphs: contained silhouette in soft rounded frame (`48×48` viewBox). Shape-first differentiation; muted steel/slate palette compatible with dark UI (`#1a2230` field, `#5c6678` fill, `#9db4d0` / `#b8c9de` stroke).

Not: building silhouettes, resource piles, dashboard outline clones, emoji, letters, photoreal scenes.

---

## 4. Geometry & stroke

- Shared **rounded square field** (6px radius) for family coherence without generic toolbar circle badge.
- L1 silhouette dominates @32px; L2 detail @48px; minimal L3 @64px inspection only.
- Stroke weight **0.8–1.4** in 48-unit space; no hairline strokes.

---

## 5. Perspective policy

**Flat symbolic** — no 3/4 building camera. Depth via overlap only.

---

## 6. Palette policy

No rainbow category coding. Color supports readability, not sole identity. Reuse existing UI tokens where possible; do not duplicate semantic color systems silently.

---

## 7. Detail hierarchy

| Level | 32px | 48px | 64px |
|-------|------|------|------|
| L1 | Frame + one dominant symbol | Same, clearer | Same |
| L2 | Omit | Secondary cues | Optional |
| L3 | Omit | Omit | Light accent only |

---

## 8. Category differentiation (pilot six)

| Category | Motif |
|----------|--------|
| PRODUCTION | Gear + tool head |
| ENERGY | Pylon + bolt |
| LOGISTICS | Hub nodes + path |
| ELECTRONICS | Chip package |
| MANAGEMENT | Org hierarchy |
| AUTOMATION | Loop + dual station |

---

## 9. Technology-level extension strategy

Pilot tests **category-only** repetition. Provisional architecture (human gate):

`technologyId → optional per-tech ICON-004 → category ICON-004 → generic research fallback`

Final model selected after repetition evidence (see pilot review §Q).

---

## 10. State treatment boundary

Base glyph = **semantic identity only**. LOCKED / AVAILABLE / IN_PROGRESS / COMPLETED / SELECTED applied by **UI overlay** (opacity, border, tint, badge) — not baked into SVG masters.

---

## 11. Accessibility boundary

Text labels remain authoritative. Icons supplement recognition. State must not rely on color alone where UI supports non-color cues.

---

## 12. Forbidden patterns

Material Design clone pack; emoji; letters/abbreviations inside glyph; ICON-002/003 copy; neon cyberpunk; photoreal; invented mechanics; text inside icon.

---

## 13. Naming & format

- Pilot: `ICON-004-category-{CategoryId}-pilot.svg` under `docs/design/research/pilot-icon-004/category/`
- Production (future): `ICON-004-category-{CategoryId}.svg` or enum-mapped ID per registry convention

**Format:** SVG source; no embedded raster; no external fonts/URLs.

---

## 14. Future registry model (proposal only)

`TechnologyCategory → visual asset entry (component: TechnologyCategoryIcon or Research hint row)`  
Optional `technologyId` override map; single resolver — no duplicate mapping in screens.

---

## 15. Human approval gate

Promotion requires human **APPROVE ICON-004 CATEGORY DIRECTION** (or variant with selective per-tech). Pilot status until then.

---

## 16. Pilot findings (initial)

Six pilot glyphs @32/48: **6/6 READABLE** (agent QA). Repetition test: **CATEGORY + SELECTIVE PER-TECH** recommended (Model B provisional) — see architecture review.

---

## 17. Hero / raster tier boundary

Category SVG remains the **compact tier** for dense lists @32–48px. Detailed technology primary art (pilot) evaluates a **second raster tier** @64–256px — not a replacement for category glyphs.

---

## 18. Two-tier hierarchy (pilot extension)

| Tier | Role | Asset | Primary scale |
|------|------|--------|---------------|
| **Tier 1 — Detailed primary** | Per-technology identity, progression reward, hero moments | `ICON-004-tech-{technologyId}-primary-pilot.png` (pilot) | 96 / 128 acceptance; 256 inspection |
| **Tier 2 — Category compact** | Domain navigation in dense UI | `ICON-004-category-{CategoryId}-pilot.svg` | 32 / 48 |
| **Fallback** | Missing art | Generic research glyph | 32 |

Resolver (future): `technologyId → optional Tier-1 primary → Tier-2 category → fallback`.

---

## 19. Technology primary-art role

Depicts **capability / apparatus / process vignette** supported by content — not a building catalog entry, not a resource pile, not an invented mechanic. One dominant subject + controlled secondary cues; strong silhouette @96px.

---

## 20. Category compact role (unchanged)

Answers **which research domain** — not which exact machine. Must remain legible when Tier-1 is absent.

---

## 21. Camera & composition (detailed tier)

**Stylized 3/4 industrial-object vignette** — closer than ICON-003 building mass, shared lighting/material quality band (upper-left key, restrained steel/concrete palette). No full building envelope as hero subject. Minimal narrative scene; platform/ground optional.

---

## 22. Material rendering & detail hierarchy

B2-compatible stylized materials (matte metal, painted steel, cable/panel reads). L1 silhouette @96px; L2 panel/connector reads @128px; L3 micro-detail @256px only — strip L3 if it harms @96px.

---

## 23. Background / alpha (detailed tier)

1024×1024 PNG, RGBA. Edge-connected near-black studio backdrop removed via shared `building-art-alpha` pipeline. Target ≥15% transparent pixels; no checkerboard leak >5% opaque.

---

## 24. Runtime-size hypothesis

| Size | Expectation |
|------|-------------|
| 64 | Recognizable; secondary detail may drop |
| 96 | **Acceptance** — subject readable |
| 128 | **Acceptance** — reward without zoom |
| 256 | Inspection / unlock hero |

Not intended for 32px row icons — use Tier-2 SVG there.

---

## 25. Semantic honesty

Primary must match YAML technology meaning; no futuristic leap beyond content; no specific building ID implied; vehicles/units only if content supports.

---

## 26. Relationship to building art (ICON-003)

Same **game** — different **semantic job**. Buildings = placeable structures. Technology primaries = knowledge/equipment vignettes. Avoid reusing building primary compositions; avoid machine_shop / solar_plant / electronics_factory silhouette swaps.

---

## 27. Relationship to resource art (ICON-001)

Resources = tradable goods piles/icons. Technology = capability apparatus — no commodity pile framing.

---

## 28. Unlock / hero reuse (future)

Tier-1 suitable for completion/unlock static cards and milestone panels; state overlays remain UI responsibility (§10).

---

## 29. Future production naming

Pilot: `docs/design/research/pilot-icon-004/detailed-primary/ICON-004-tech-{technologyId}-primary-pilot.png`  
Production (proposal): `ICON-004-{technologyId}-primary.png` under design + runtime registry map — **not activated in pilot**.

---

## 30. Fallback hierarchy

`technologyId` → optional detailed primary → category SVG → generic research glyph. Never silently substitute ICON-003 building art for technology rows.

---

## 32. Production Batch 1 (2026-09-19)

Human visual gate **APPROVED / SEALED**. Contract promoted to **APPROVED / PRODUCTION AUTHORITY**. Batch 1 delivers **8** Tier-1 detailed primaries (3 promoted pilots + 5 new) and **10/10** used category compacts. Remaining technologies use Tier-2 category fallback until a later bounded batch. Evidence: `ICON_004_PRODUCTION_BATCH_1_*` boards and close-candidate report.
