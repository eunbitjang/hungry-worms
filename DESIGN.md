---
name: Hungry Worms
description: Sunlit Soil — warm paper, deep forest, and one orange that only ever means "act"
colors:
  canterbury-green: "#1F8A4C"
  forest-floor: "#0F5132"
  new-leaf: "#7FB800"
  kiln-orange: "#E07A2F"
  kiln-orange-deep: "#C5661A"
  paper: "#F7F6F1"
  card-white: "#FFFFFF"
  wet-soil: "#2B2A26"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.2em"
rounded:
  lg: "0.5rem"
  xl: "0.75rem"
  2xl: "1rem"
  3xl: "1.5rem"
  full: "9999px"
spacing:
  gutter: "1rem"
  gutter-lg: "2rem"
  card: "1.5rem"
  card-lg: "2rem"
  section: "4rem"
  section-lg: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.kiln-orange}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.kiln-orange-deep}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.canterbury-green}"
    rounded: "{rounded.full}"
    padding: "10px 16px"
  card:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.wet-soil}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  card-dark:
    backgroundColor: "{colors.forest-floor}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.2xl}"
    padding: "28px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.wet-soil}"
    rounded: "{rounded.lg}"
    padding: "10px 14px"
  eyebrow:
    backgroundColor: "transparent"
    textColor: "{colors.canterbury-green}"
    typography: "{typography.label}"
---

# Design System: Hungry Worms

## Overview

**Creative North Star: "Sunlit Soil"**

Warm paper in daylight, deep forest in shade. Every surface in this system is one of
two materials: an off-white page that reads like recycled stock, or a dark green band
that reads like soil and canopy. Both carry a faint grain so nothing looks vacuum-sealed.
The palette comes from the actual business — leaf, forest, soil, and the kiln orange of a
warm action — and the writing on top of it is plain and specific, because the product's
credibility rests on numbers that can be checked.

This is a sales asset for people with a reporting deadline. Optimism is carried by
colour and texture, never by adjectives or ornament. Content is generously spaced and
falls in a single readable column at any width; density is a portal concern, not a
marketing-page one.

Three looks are explicitly rejected. **Tech SaaS**: violet-to-blue gradients, neon glows,
glassy floating panels, dark heroes. **Cold corporate IR**: uniform grey, stock handshake
photography, dense unstyled tables. **Waste-hauler trade**: fluorescent safety orange and
yellow, truck-and-plant photography, industrial-equipment framing. The first is where an
AI drifts when unattended; the other two are where this category drifts.

**Key Characteristics:**
- Two materials only — warm paper and deep forest — each with a faint grain
- One orange, reserved entirely for actions the business gets paid for
- Flat at rest, lifting only in response to the cursor
- Generous pill geometry on anything clickable; soft rectangles on anything readable
- Real photography of Canterbury sites, worms, and produce; never stock abstraction

## Colors

An eco palette taken from the material itself: three greens from leaf to soil-shade, a
warm paper ground, and a single fired-clay orange that exists only to be clicked.

### Primary
- **Canterbury Green** (`#1F8A4C`): The signature green. Links, active navigation, eyebrow
  labels, icon accents, focus rings, and the tint behind hovered menu items. This is the
  colour the brand is recognised by.
- **Forest Floor** (`#0F5132`): The dark ground. Full-bleed hero and feature bands, dark
  cards, the logo mark on light backgrounds. Deep enough to carry white body text at AA.

### Secondary
- **New Leaf** (`#7FB800`): The bright accent, used only on dark ground — stat units, small
  labels, icon strokes, the "Buy Worms" link in the header. It is too light to sit on paper
  as text.

### Tertiary
- **Kiln Orange** (`#E07A2F`): Conversion only. Every "Start a free trial", "Contact",
  "Buy Worms" pill.
- **Kiln Orange Deep** (`#C5661A`): The hover and press state of the above. It appears
  nowhere else.

### Neutral
- **Paper** (`#F7F6F1`): The page ground and the fill inside form fields. Warm, never a
  cold grey.
- **Card White** (`#FFFFFF`): The surface that sits on Paper. The white-on-off-white
  contrast is what separates a card from the page — hairline borders only reinforce it.
- **Wet Soil** (`#2B2A26`): All body and heading text on light ground, and the tint every
  shadow is mixed toward. A brown-black, never a pure black.

### Named Rules

**The One Orange Rule.** Kiln Orange marks actions the business gets paid for: starting a
trial, making contact, buying worms. It never appears on an icon, a badge, a chart series,
a border, or a heading. If a screen shows two orange things, one of them is wrong.

**The Warm Neutral Rule.** There is no grey in this system. Neutrals run through Paper and
Wet Soil, and translucency is always expressed against those (`soil/10` borders,
`white/65` text on dark), never against a cold grey.

**The Leaf-on-Dark Rule.** New Leaf is legible on Forest Floor and illegible on Paper. It
may be used as text only on dark bands; on light ground it appears solely as a fill or
icon.

## Typography

**Display Font:** Plus Jakarta Sans (fallback ui-sans-serif, system-ui, sans-serif)
**Body Font:** Inter (fallback ui-sans-serif, system-ui, sans-serif)

**Character:** Jakarta's slightly geometric, humanist forms give the headings warmth
without novelty; Inter underneath keeps long paragraphs and data plain. All display type
is set at weight 800 with `-0.02em` tracking — the tightening is what makes big numbers
look confident rather than merely large.

### Hierarchy
- **Display** (800, 3.75rem, line-height 1.05): The hero headline, once per page. Steps
  down to 3rem at the small breakpoint and 2.25rem on phones.
- **Headline** (800, 2.25rem, line-height 1.1): Section titles. Typically written as
  2.25rem with a 1.875rem phone step.
- **Title** (800, 1.25–1.5rem): Card and list-item headings.
- **Body** (400, 1rem, line-height 1.65): Paragraphs, capped around 65ch. Drops to
  0.875rem inside cards and supporting copy.
- **Label** (700, 0.75rem, `0.2em` tracking, uppercase): The eyebrow above every section
  heading, and stat units. Always in Canterbury Green on light ground or New Leaf on dark.

### Named Rules

**The Eyebrow Rule.** Every major section opens with the same three-part stack: an
uppercase Label eyebrow, a Headline, and one supporting sentence. This repetition is the
site's rhythm — do not invent alternative section openers.

**The Big Number Rule.** Figures pulled from real data are set in the display face at
weight 800 and count up from zero when they scroll into view. They are never decorated,
never gradient-filled, and never rounded to look better than they are.

## Layout

A single centred column, `max-w-7xl` (80rem), with gutters stepping 1rem → 1.5rem → 2rem
across the breakpoints. This container is used unchanged on every page; nothing bleeds
past it except background bands, which run full width and hold their own inner container.

Vertical rhythm is section-driven: 4rem of padding on compact sections, 5rem rising to
6rem at the large breakpoint on major ones. Sections alternate between Paper, Card White,
and Forest Floor grounds so the page reads as bands rather than as a scroll of cards.

Grids are one column on phones and three on `sm` and up, with a 1.5rem gap; feature rows
split two columns at `lg`. Content is mobile-first and the header collapses to a sheet
menu below `md`. Horizontal overflow is clipped at the root (`overflow-x: clip`, chosen so
the sticky header keeps working) — nothing is allowed to cause a sideways drag.

**The Portal Density Rule.** `/portal` uses the same colours, fonts, and corner language
as the marketing site and a tighter spatial setting: smaller type steps, reduced section
padding, no decorative photography, no mesh or drift backgrounds. Same brand, different
density. It is a working surface, and treating it as one is what makes it credible.

## Elevation & Depth

Surfaces are flat at rest and lift only in response to the cursor. Two soft, layered
shadows carry the whole system, both tinted toward Wet Soil rather than pure black, so
nothing acquires a grey halo on the warm ground. Depth otherwise comes from material
change — paper against white, light band against forest band — and from a faint noise
grain on dark sections.

### Shadow Vocabulary
- **Card at rest** (`0 1px 2px rgba(43,42,38,0.04), 0 4px 16px rgba(43,42,38,0.06)`):
  Barely there. Enough to separate a white card from Paper.
- **Card lifted** (`0 2px 4px rgba(43,42,38,0.06), 0 16px 40px rgba(43,42,38,0.12)`): The
  hover state, paired with a 4px rise over 0.35s.
- **Action** (`0 1px 2px rgba(43,42,38,0.10), 0 4px 10px rgba(43,42,38,0.12)`): Under
  orange pills. Deliberately neutral — a coloured shadow here produced a hazy glow.
- **Hairline ring** (`0 0 0 1px rgba(31,138,76,0.08)`): A green-tinted edge for surfaces
  that need definition without a visible border.

### Named Rules

**The Flat-At-Rest Rule.** Nothing floats until it is pointed at. A card that carries a
heavy shadow in its default state is wrong, no matter how good it looks in isolation.

## Shapes

Two corner languages, split by function. **Anything clickable is a pill** — full-radius
buttons, links, and floating actions, which is why the orange CTA reads as a button from
across the page. **Anything readable is a soft rectangle** — 1rem on cards, rising to
1.5rem on the largest feature panels, 0.5rem on form fields and menu rows.

Borders are hairlines at very low opacity (`soil/8` to `soil/20` on light,
`white/10` on dark) and exist to define an edge, never to draw a line. Dark sections layer
translucent white fills (`white/5` to `white/15`) instead of borrowing the light palette.

## Components

### Buttons
- **Shape:** Fully rounded pill (`9999px`), at every size.
- **Primary:** Kiln Orange fill, white text, weight 600–700, 28px horizontal by 14px
  vertical padding, Action shadow.
- **Hover / Focus:** Fill deepens to Kiln Orange Deep; the trailing arrow icon slides out
  as the internal gap widens; a 0.5px rise on the larger variants. All transitions
  0.2–0.3s.
- **Outline:** Canterbury Green 1px border and text on transparent, filling to a 5% green
  tint on hover. Used for the secondary path, e.g. Client Login.
- **Ghost on dark:** `white/10` fill with a `white/25` border and backdrop blur, brightening
  to `white/20`. Used for the secondary hero action only.

### Cards / Containers
- **Corner Style:** 1rem, rising to 1.5rem on hero-scale feature panels.
- **Background:** Card White on Paper sections; Paper on white sections; `white/5` over
  Forest Floor on dark ones.
- **Shadow Strategy:** Card at rest, swapping to Card lifted on hover — see Elevation.
- **Border:** `soil/8` hairline on light, `white/10` on dark.
- **Internal Padding:** 1.5rem standard, 1.75–2rem on feature cards.
- **Behaviour:** Cards that link somewhere carry `card-lift` — 4px rise, deepened shadow,
  border warming toward `green-leaf/30`. Static cards do not.

### Inputs / Fields
- **Style:** Paper fill inside a `soil/20` hairline, 0.5rem radius, 14px by 10px padding,
  0.875rem text.
- **Focus:** Border shifts to Canterbury Green with a 2px `green-primary/20` ring; the
  native outline is removed only because that ring replaces it.
- **Disabled:** 60% opacity with a not-allowed cursor, used on the submitting state of the
  contact form.

### Navigation
- **Style:** Sticky, translucent white with backdrop blur. Below 8px of scroll it sits at
  60% white with no border; past that it firms to 85% white with a `soil/10` border and a
  soft shadow — the header announces that the page has moved.
- **Links:** 0.875rem medium in `soil/80`, warming to Canterbury Green on hover with a 2px
  underline that wipes in from the left. The active route is green and semibold.
- **Mobile:** Full-width sheet below the header; rows are 0.5rem-radius blocks that tint
  green at 5% when active, with the two CTAs stacked as full-width pills at the bottom.

### Stat Card (signature)
The hero's live impact figures. A translucent `white/7` panel with a `white/10` border and
backdrop blur, laid over the Forest Floor hero. Inside, in fixed order: the figure in
display weight 800 with tabular numerals, the unit as a New Leaf uppercase Label, then a
plain white/65 description. A single outlined icon sits in the top-right corner at 30%
opacity, warming to 60% when the card is hovered. Figures count up from zero on entry,
staggered ~90ms apart, and the server renders the final value so the real number is present
before any script runs.

### Section Eyebrow (signature)
Uppercase Label at 0.75rem with `0.2em` tracking, Canterbury Green on light ground and New
Leaf on dark, sitting directly above a Headline with 0.75rem of space. It appears on every
major section and is the most repeated element in the system.

## Do's and Don'ts

### Do:
- **Do** open every section with the eyebrow → headline → one-sentence stack.
- **Do** keep Kiln Orange (`#E07A2F`) for conversion actions only, and expect at most one
  orange element in view at a time.
- **Do** set data figures in the display face at weight 800 with tabular numerals, and
  count them up from zero when they enter the viewport.
- **Do** render real values server-side before animating them, so crawlers and no-JS
  visitors see the number.
- **Do** keep surfaces flat at rest and reserve the 4px lift and deepened shadow for hover.
- **Do** put full-radius pills on anything clickable and 1rem soft rectangles on anything
  readable.
- **Do** tint every shadow toward Wet Soil (`rgba(43,42,38,…)`) rather than black.
- **Do** carry the same palette and type into `/portal` at a tighter density, with the
  decoration removed.
- **Do** honour `prefers-reduced-motion` — reveals, count-ups, and drifts all stop.

### Don't:
- **Don't** introduce violet or blue gradients, neon glows, or dark glassy hero panels.
  This is the single most likely drift and it is out of the palette entirely.
- **Don't** use grey. There is Paper and there is Wet Soil.
- **Don't** put New Leaf text on a light background — it fails contrast.
- **Don't** use fluorescent safety orange or yellow, or lead with truck and industrial
  plant imagery.
- **Don't** use stock corporate photography, or dense unstyled tables, in place of the real
  Canterbury site and produce photography.
- **Don't** nest a card inside a card; use whitespace and a rule to separate instead.
- **Don't** add a second display or accent typeface. Plus Jakarta Sans and Inter are the
  whole set.
- **Don't** add bouncing or overshooting easings. Motion is short, decelerating, and stops
  cleanly.
- **Don't** state an impact figure that does not come from the pickup log, and don't round
  one to look better than it is.
