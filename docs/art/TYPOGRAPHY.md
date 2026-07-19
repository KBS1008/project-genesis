# Typography

**Project:** Project Genesis  
**Version:** 1.0  
**Status:** Active  
**Last Updated:** 2026-07-12

---

# Purpose

This document defines the official typography system of Project Genesis.

Typography is one of the most important visual components of the user experience. Players continuously read numbers, reports, statistics, production chains and financial information.

The typography system therefore prioritizes readability, consistency and accessibility over visual decoration.

---

# Design Goals

Typography should be:

- highly readable
- modern
- professional
- neutral
- scalable
- accessible
- timeless

Typography should support the simulation without drawing unnecessary attention.

---

# Typography Philosophy

Project Genesis is a business simulation.

The interface should resemble modern professional software rather than entertainment-focused applications.

Players should immediately understand information.

Text is information—not decoration.

---

# Font Families

## Primary UI Font

Recommended:

- Inter

Fallback:

- Segoe UI
- Roboto
- Helvetica Neue
- Arial
- sans-serif

Reason:

Inter is optimized for digital interfaces and remains highly readable at both small and large sizes.

---

## Monospaced Font

Recommended:

- JetBrains Mono

Fallback:

- Consolas
- Menlo
- Monaco
- monospace

Use for:

- debug information
- developer tools
- technical identifiers
- simulation logs

---

# Font Weights

Recommended weights:

| Weight | Usage            |
| ------ | ---------------- |
| 400    | Body text        |
| 500    | Labels           |
| 600    | Section headings |
| 700    | Page titles      |

Avoid excessive variation.

---

# Typography Scale

The exact pixel values will later be defined in DESIGN_TOKENS.md.

Recommended hierarchy:

| Level      | Usage                 |
| ---------- | --------------------- |
| Display    | Splash Screens        |
| H1         | Main Page Title       |
| H2         | Window Title          |
| H3         | Section Heading       |
| H4         | Group Heading         |
| Body Large | Primary Text          |
| Body       | Standard Text         |
| Small      | Secondary Information |
| Caption    | Helper Text           |
| Overline   | Categories            |

The scale should be modular and consistent.

---

# Line Height

General recommendations:

- generous spacing
- comfortable reading
- avoid cramped layouts

Dense tables may use reduced spacing while maintaining readability.

---

# Letter Spacing

Default spacing should remain neutral.

Increase spacing only for:

- overlines
- section labels
- navigation categories

Avoid decorative tracking.

---

# Text Alignment

Preferred:

- left aligned

Use centered text only for:

- splash screens
- logos
- empty states

Right alignment should be reserved for:

- numbers
- currencies
- percentages

---

# Numeric Typography

Economic simulations display large quantities of numbers.

Recommendations:

- align numbers consistently
- use tabular numerals if available
- maintain consistent decimal precision
- format currencies consistently

Numbers should be easier to compare than decorative.

---

# Tables

Tables are a core gameplay element.

Typography should support:

- fast scanning
- easy comparison
- dense information
- clear hierarchy

Headers should use a stronger font weight than body cells.

---

# Dashboards

Dashboard typography should emphasize:

- KPIs
- trends
- changes
- alerts

Large numbers should remain visually balanced.

---

# Color Usage

Text colors are defined in:

COLOR_PALETTE.md

General rules:

Primary text

Dark Neutral

Secondary text

Medium Gray

Disabled

Light Gray

Warnings

Warning Color

Errors

Error Color

Success

Success Color

Never use color as the only information carrier.

---

# Text Hierarchy

Hierarchy should be established through:

1. Size
2. Weight
3. Color
4. Spacing

Avoid relying solely on capitalization.

---

# Capitalization

Use sentence case throughout the interface.

Examples:

Correct:

```
Production overview
```

Incorrect:

```
PRODUCTION OVERVIEW
```

Exceptions:

- logos
- abbreviations
- technical identifiers

---

# Text Length

Prefer concise labels.

Buttons:

1–3 words

Dialogs:

Clear and direct.

Tooltips:

Short explanations.

Documentation:

Detailed.

---

# Accessibility

Typography should satisfy:

- WCAG AA contrast
- scalable text
- readable spacing
- minimum practical font sizes
- clear hierarchy

Avoid extremely small text.

---

# Localization

The typography system must support:

- German
- English
- French
- Spanish
- additional languages in the future

Layouts should accommodate longer translated text without breaking.

---

# Responsive Behaviour

Typography should scale appropriately across:

- Full HD
- 1440p
- 4K
- Ultra-wide displays

Scaling should preserve hierarchy.

---

# Animation

Text animations should be subtle.

Allowed:

- fade
- smooth transitions
- counting animations for statistics

Avoid:

- bouncing
- shaking
- flashing
- excessive movement

---

# Typography Review Checklist

Every interface should answer:

| Question                               | Status |
| -------------------------------------- | ------ |
| Is the text immediately readable?      | □      |
| Is hierarchy clear?                    | □      |
| Is spacing sufficient?                 | □      |
| Are numbers easy to compare?           | □      |
| Does typography support accessibility? | □      |
| Does it follow the design system?      | □      |

---

# Future Integration

Typography values will later be standardized through:

- DESIGN_TOKENS.md
- SPACING_SYSTEM.md
- GRID_SYSTEM.md
- UI_COMPONENT_LIBRARY.md

---

# Related Documents

- ART_DIRECTION.md
- VISUAL_PILLARS.md
- DESIGN_PRINCIPLES.md
- VISUAL_LANGUAGE.md
- COLOR_PALETTE.md
- UI_STYLE_GUIDE.md
- DESIGN_TOKENS.md

---

# Summary

Typography is a core component of the Project Genesis user experience.

The typography system emphasizes readability, consistency and long-term maintainability while supporting the analytical nature of a modern economic simulation.

Every text element should help players understand the simulation more quickly and with less cognitive effort.
