---
name: e-Licensing
description: A paper application form that agencies stamp, on a grey desk.
colors:
  desk: "#d4d5d7"
  paper: "#fbfbf8"
  paper-sunk: "#f0f1ee"
  graphite: "#2a2d34"
  graphite-soft: "#4a4f5a"
  rule-soft: "#b9bdc6"
  ink-blue: "#1f3b8c"
  ink-blue-deep: "#172c69"
  stamp-red: "#b7222a"
typography:
  display:
    fontFamily: "Mitr, Sarabun, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.25rem)"
    fontWeight: 500
    lineHeight: 1.35
  headline:
    fontFamily: "Mitr, Sarabun, sans-serif"
    fontSize: "2rem"
    fontWeight: 500
    lineHeight: 1.4
  title:
    fontFamily: "Mitr, Sarabun, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "Sarabun, Noto Sans Thai, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Sarabun, Noto Sans Thai, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  form: "2px"
  stamp: "3px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink-blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.form}"
    padding: "9px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.ink-blue-deep}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.graphite}"
    rounded: "{rounded.form}"
    padding: "9px 20px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.paper-sunk}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-blue}"
    rounded: "{rounded.form}"
    padding: "12px 14px"
    height: "48px"
  nav-cell:
    textColor: "{colors.graphite}"
    padding: "6px 16px"
    height: "44px"
  nav-cell-active:
    backgroundColor: "{colors.ink-blue}"
    textColor: "{colors.paper}"
  sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    padding: "40px 28px 32px"
  stamp:
    textColor: "{colors.stamp-red}"
    rounded: "{rounded.stamp}"
    padding: "4px 14px"
---

# Design System: e-Licensing

## Overview

**Creative North Star: "The Rubber-Stamp Form"**

The app is a paper application form that agencies stamp. A grey desk holds near-white sheets ruled in 1px graphite boxes with square corners. Filled values and the primary action are ballpoint blue; serials, step numbers and corrections are rubber-stamp red. Stamps are the one theatrical device: rotated slightly, double-bordered, pressed in with a short thunk.

Density is form-like: ruled rows and cells rather than cards, with generous Thai line-height. The landing page persuades and the rest of the app operates, in the same world and quieter. The first surface refuses the category default of a blue portal with a hero photo and a grid of service cards.

**Key Characteristics:**
- Flat ruled boxes, 1px graphite, near-square corners (2px)
- Three inks only: graphite, ink-blue, stamp-red
- Mitr for headings and stamp lettering, Sarabun for printed form text
- Stamps are rotated, double-bordered, ink-textured, multiply-blended
- Sample content is labeled as sample; no invented agencies

## Colors

A cool grey desk with warm-white paper and two inks, used sparingly.

### Primary
- **Ballpoint Ink Blue** (ink-blue): primary buttons, links, filled input values, page titles, active nav cell, focus ring, text selection, progress bar fill, success chips. Hover deepens to **Deep Ink Blue** (ink-blue-deep).

### Secondary
- **Rubber-Stamp Red** (stamp-red): step numbers, serial/stamp marks, error borders and error chips. Never a button fill.

### Neutral
- **Desk Grey** (desk): page ground, body background.
- **Form Paper** (paper): sheets, nav bar, input fill, text on blue.
- **Sunk Paper** (paper-sunk): header/footer bands of panels, hover wash, autofill.
- **Graphite** (graphite): body text, all 1px rules and borders, outline button text.
- **Soft Graphite** (graphite-soft): secondary text, labels, placeholder-adjacent copy.
- **Pale Rule** (rule-soft): dividers and the 1px hairline under a sheet.

### Named Rules
**The Two Inks Rule.** Blue means the user's own action or data; red means the system's mark or a problem. A third accent hue does not exist.

**The Ruled Not Tinted Rule.** Structure comes from graphite 1px lines, not from colored fills or tinted panels.

## Typography

**Display Font:** Mitr (with Sarabun, sans-serif)
**Body Font:** Sarabun (with Noto Sans Thai, sans-serif)

**Character:** Mitr's rounded, slightly stamped Thai letterforms head each form; Sarabun is the neutral printed text. Both carry Thai and Latin. Numerals are tabular body-wide.

### Hierarchy
- **Display** (Mitr 500, clamp(2rem, 4.2vw, 3.25rem), 1.35): page title (h1), ink-blue, max 18ch, balanced wrap.
- **Headline** (Mitr 500, 2rem, 1.4): section headings (h2); h3 to h6 step down 1.75, 1.5, 1.25, 1.125rem.
- **Title** (Mitr 500, 1.125rem, 1.5): panel titles, chips, notes heading (1rem).
- **Body** (Sarabun 400, 1rem, 1.7): copy, capped around 60-68ch; secondary 0.9375rem / 1.65.
- **Label** (Sarabun, 0.8125rem, 1.5): captions, helper text, brand subline. Bold 700 for buttons, step labels and links. No uppercase tracking.

### Named Rules
**The Thai Line-Height Rule.** Never set Thai text below 1.4 line-height; body sits at 1.65 to 1.7.

## Layout

Desk-grey page, container max 1152px (nav inner 1200px), padding 32px 24px, gap 32px. Home is a two-column grid: sheet at 2fr, sample-stamp panel at minmax(280px, 1fr). Below 900px it collapses to one column; below 720px the nav cells become a 2-column grid and the sticky nav becomes static; below 560px step rows drop the link to a full-width row. Rhythm uses 8, 12, 16, 24, 32px. Steps are rows of ruled cells: 56px number cell, text, action cell.

## Elevation & Depth

Mostly flat, with depth from ruled borders. The only shadow lifts a sheet or panel off the desk like loose paper.

### Shadow Vocabulary
- **Sheet lift** (`box-shadow: 0 1px 0 var(--rule-soft), 0 14px 28px -18px rgba(42,45,52,0.45)`): sheets and the stamp-slot panel only. MUI Paper and buttons have elevation 0.

### Named Rules
**The Paper On Desk Rule.** One soft lift for sheets; every other element is flat with a 1px rule.

## Shapes

Square-cornered: 2px on buttons, inputs, chips; 0 on progress bars and sheets. Stamps use 3px with a 2px border plus a 1px outline offset 2px (double border); the large stamp is 4px plus 2px at offset 4px. Checklist bullets are empty 12px squares with a 1px rule. Chip variants: success is blue outline, warning is graphite dashed, error is red outline, all transparent fill.

## Components

### Buttons
- **Shape:** 2px corners, min height 44px, padding 9px 20px, 1rem 700, no uppercase.
- **Primary:** ink-blue fill, paper text; hover ink-blue-deep, no shadow.
- **Outline:** 1px graphite border and text; hover paper-sunk wash.

### Inputs / Fields
- **Style:** paper fill, 1px graphite border, 2px corners, min height 48px, ink-blue entered text.
- **Focus:** border becomes 2px ink-blue. **Error:** border stamp-red.

### Navigation
Thin sticky paper bar with a bottom 1px rule. Brand is Mitr 600 in ink-blue with a soft-graphite subline. Links are boxed cells in one ruled strip (44px min, 0.9375rem 500); hover paper-sunk; active ink-blue fill with paper text; 160ms ease-out.

### Stamp (signature)
Mitr 500 label in blue, red or graphite, rotated by `--tilt` (default -4deg), double border, `mix-blend-mode: multiply`, with the SVG `#stamp-ink` grain filter. The `thunk` entrance is 420ms ease-out (cubic-bezier(0.16,1,0.3,1)), scaling 1.4 to 1 and settling a 6deg rotation. It plays on load only and is disabled under reduced motion.

### Sheet and step rows
Paper panel with 1px graphite border; header and footer bands in paper-sunk; rows divided by 1px rules; action cells invert to blue fill on hover.

## Do's and Don'ts

### Do:
- **Do** build every surface from sheets on the desk and ruled 1px graphite cells.
- **Do** reserve ink-blue for user action and data, and stamp-red for system marks and errors.
- **Do** label stamp examples as samples.
- **Do** keep 44px minimum targets and the 2px focus outline in ink-blue.

### Don't:
- **Don't** use a hero photo, a service-card grid or a generic blue portal look.
- **Don't** round corners beyond 2px (3px on stamps only) or use pill shapes.
- **Don't** add shadows beyond the sheet lift.
- **Don't** stamp-effect everything; stamps are marks of agency action, not decoration.
