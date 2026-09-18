# B2 Production Prompt Template (ICON-003)

**Template version:** `b2-production-v1`  
**Status:** APPROVED production authority (Batch 1)

## Fixed family constraints (all buildings)

Append verbatim to every primary generation brief:

- Canvas: **1024×1024** PNG master, **real alpha transparency** (no checkerboard, no white/gray backdrop baked into RGB).
- Camera: **3/4 isometric-like from southeast**, visually consistent family (not low-angle photo, not top-down).
- Occupancy: building complex **~58–72% of frame height**, centered horizontally; larger YAML footprints may read slightly wider.
- Ground: **industrial concrete pad** + restrained elliptical **ground shadow**, consistent orientation.
- Light: **upper-left key**, cool ambient fill, muted industrial palette compatible with dark UI.
- Detail hierarchy: strong **silhouette**, clear **functional architecture**, **restrained** secondary industrial detail.
- Forbidden: text, UI, labels, logos, gameplay numbers, nuclear tropes for coal, flask/lightning-as-identity, copyrighted game clones.

## Building-specific section

Replace `{BUILDING}` with authoritative identity from `game-content/buildings/{id}.yaml` (name/description/category only — no costs/unlocks in art).

## Post-processing (mandatory)

1. Run `tools/process-icon-003-batch-1.ts` background removal + alpha validation.
2. Record results in `ICON_003_BATCH_1_ALPHA_REPORT.json` (per-batch).
3. Sync runtime **WebP** + PNG to `apps/web/public/assets/buildings/`.

## Compact glyph

Hand-authored **48×48 viewBox SVG** derived from primary silhouette (`ICON-003-{id}-compact`), target **READABLE @ 32px**.
