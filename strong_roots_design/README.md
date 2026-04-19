# Handoff: Strong Roots — Design System v1

## Overview

Strong Roots is an online training practice run by Ashlyn — digital workout plans, 1:1 consulting, and nutrition guidance. This handoff contains the complete design system (Loam direction, light + dark) for building the marketing site and companion mobile app.

## About the design files

The HTML/JSX files in this bundle (`design_source/`) are **design references** — prototypes that show the intended look, typography, spacing, and interactions. They are not production code to copy directly.

Your task is to **recreate these designs in your target codebase** using its existing patterns and component library. If no codebase exists yet, pick the most appropriate framework (React/Next.js is a reasonable default for the marketing web, React Native/Expo or SwiftUI for the mobile app) and implement there.

The design tokens under `tokens/` are framework-agnostic (CSS custom properties + W3C design tokens JSON) and should be the source of truth for all color, type, spacing, and motion values.

## Fidelity

**High-fidelity.** All colors, typography, spacing, and component proportions are final. Match them exactly. Photography is placeholder'd with striped swatches — Ashlyn will supply real imagery during build.

## Brand direction

**Loam** — quiet luxury / earthy grounded. Sand, oat, and charcoal. Serif display (Instrument Serif, italic-capable), sans body (Manrope), mono for labels (JetBrains Mono). Near-black is the accent color, brass (#b8955a) is the only chroma.

Voice: "training practice," "long arc," "sustainable strength." Not "crush it," "beast mode," "transformation."

## Logo — Grove

Three geometric trees on a baseline. Files in `brand/`:

- `logo-grove-mark-light.svg` — mark only, for use on light backgrounds
- `logo-grove-mark-dark.svg` — mark only, for use on dark backgrounds
- `logo-grove-horizontal-light.svg` — horizontal lockup, light bg
- `logo-grove-horizontal-dark.svg` — horizontal lockup, dark bg

Minimum mark size: 20px. Clear space: at least the height of one tree circle on all sides.

## Design tokens

Everything lives in `tokens/`:

- **`tokens.css`** — drop-in CSS custom properties. Switch modes with `data-theme="light"` or `data-theme="dark"` on `<html>`.
- **`tokens.json`** — W3C design tokens format. Feeds Figma Tokens plugin, Style Dictionary, Tokens Studio.

### Color roles (semantic, same across modes)

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `bg` | `#ebe6dc` | `#17150f` | Page background |
| `surface` | `#f4efe4` | `#1f1c14` | Cards, inputs, raised panels |
| `surface-alt` | `#dcd5c5` | `#29251c` | Hovered/secondary surface |
| `line` | `#c9c1ad` | `#2d2920` | Borders, dividers |
| `line-soft` | `#dcd5c5` | `#29251c` | Subtle hairlines |
| `ink` | `#1c1a16` | `#e6ddc8` | Primary text |
| `ink-soft` | `#4a463d` | `#b3a88e` | Secondary text |
| `ink-muted` | `#867f70` | `#857b67` | Labels, captions |
| `accent` | `#1c1a16` | `#e6ddc8` | Primary buttons (ink IS the accent in Loam) |
| `accent-ink` | `#ebe6dc` | `#17150f` | Text on accent |
| `signal` | `#b8955a` | `#c9a66b` | "Best seller" tags, highlights |
| `error` | `#b54836` | `#b54836` | Form validation |

### Typography

- **Display** — Instrument Serif, 400 weight. Used for h1/h2/h3, hero, card titles.
- **Body** — Manrope, 400/500/600. Paragraphs, UI text.
- **Mono** — JetBrains Mono, 400/500. Numeric (reps, weights, prices), meta.
- **Labels/eyebrows** — Manrope 500, uppercase, `0.28em` tracking.

Type scale (px): 11, 12, 13, 15, 17, 18, 22, 28, 36, 48, 64, 88. Line heights: tight 1.05, snug 1.2, normal 1.5, relaxed 1.65.

### Spacing

4pt base: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.

### Radius

Loam uses medium curvature: buttons/inputs/cards `md` (6px). Pills/tags use `pill` (999px).

### Elevation

Four levels: whisper, rest, lift, float. Shadow values in `tokens.css`. Use sparingly — Loam is quiet; a hairline border is often better than a shadow.

### Motion

| Token | Duration | Easing | Use |
|---|---|---|---|
| `instant` | 80ms | ease-out | State echoes |
| `quick` | 180ms | `cubic-bezier(0.2, 0, 0, 1)` | Hover, press |
| `settle` | 320ms | `cubic-bezier(0.2, 0, 0, 1)` | Panels, nav |
| `breathe` | 640ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Reveal, hero |

## Components

All components documented in `design_source/components.jsx` and `design_source/applications.jsx`.

### Button
- Primary: `bg: var(--sr-accent)`, `color: var(--sr-accent-ink)`, padding `14px 26px`, radius `md`.
- Secondary: transparent bg, 1px border `var(--sr-ink)`.
- Tertiary/link: transparent, bottom border only.
- Sizes: sm (10px 18px / 12px font), md (14px 26px / 13px font), lg (18px 32px / 15px font).
- Primary has a trailing 12px arrow glyph (see `applications.jsx` — `Arrow` component).
- States: rest, hover (shift -1px + `shadow-rest`), pressed (shift +1px + 0.9 opacity), disabled (line bg + muted ink).

### Input
- Padding `14px 16px`, radius `md`, 1px border `var(--sr-line)`.
- Focus: border becomes 2px `var(--sr-accent)`.
- Error: border `var(--sr-error)`, 12px error message below.
- Field label: Manrope 500, 10px, uppercase, `0.28em` tracking, `var(--sr-ink-soft)`, 8px above input.

### Radio / Checkbox / Toggle
- 18×18 for radio/check. Radio is fully round; checkbox radius `xs` (2px).
- Toggle: 40×22 track, 18×18 thumb, transition `quick`.

### Tag / Badge
- Padding `6px 12px`, radius `pill`.
- Variants: outline (1px line), solid (accent fill), soft (surface-alt bg), signal (brass fill, for "Best seller").
- Always uppercase, Manrope 500, 10px, `0.28em` tracking.

### Card (plan / tier)
- `var(--sr-surface)` bg, 1px `var(--sr-line-soft)` border, radius `md`, overflow hidden.
- Image area at top (16:9), padding 24px below.

### Progress
- Linear: 2px tall, `var(--sr-line)` track, `var(--sr-accent)` fill.
- Dotted: 14×14 dots, filled accent if done, line if pending.

## Screens

### Web — Hero (split-tri selected by default)

Three vertical image panes with a content card overlay bottom-left. Panes are 3:4 ratio, 20px gap. Overlay card: `var(--sr-bg)` with 28×32 padding, h1 at 72px/0.98, primary + secondary buttons.

Alternative layouts available in `applications.jsx`: `editorial` (asymmetric portrait-right split) and `stacked` (centered).

### Web — Plans grid

3-column grid, 24px gap. Each card: placeholder image (striped), meta row (Program №, weeks, level), 30px serif title, tag chips, price + "View plan →" row separated by a hairline.

### Web — Consulting tiers

3-column grid, 24px gap. Middle tier is "featured" — filled with `var(--sr-ink)`, inverted. Features list with em-dash bullets, primary CTA "Book intake call →".

### Mobile — Home / Workout / Plan detail

Three iOS screens in `applications.jsx` → `MobileArtboard`:

1. **Home** — greeting h2, today's session card, weekly dot strip, "from Ashlyn" message card, bottom tab nav (Home · Train · Eat · You).
2. **Workout in progress** — demo video placeholder, exercise title, sets list with weight/reps/status, primary "Log set →" button pinned bottom.
3. **Plan detail** — hero image, program meta, description, tag chips, price + period, primary CTA.

Minimum hit targets: 44px. All buttons, radios, tabs meet this.

## State

The marketing site is mostly static. For the app, state needs include:
- `user` (auth, profile, program enrollment)
- `program` (current, progress by week/day, completed sessions)
- `session` (active workout: exercise index, set logs)
- `messages` (Ashlyn ↔ client async thread)
- `nutrition` (targets, daily log)

## Services (Ashlyn sells these)

1. **Digital workout plans** — one-time purchase, lifetime access. Three flagship plans: "Built to Last" ($129, 12 wks), "Return to Lifting" ($89, 8 wks), "Off-Season Build" ($179, 16 wks).
2. **1:1 consulting** — monthly subscription. Three tiers: Foundation ($89), Practice ($249, featured), Performance ($495).
3. **Nutrition guidance** — bundled into Practice and Performance tiers; standalone offering TBD.

## Files in this bundle

```
design_handoff_strong_roots/
├── README.md                        ← you are here
├── tokens/
│   ├── tokens.css                   ← CSS custom properties
│   └── tokens.json                  ← W3C design tokens
├── brand/
│   ├── logo-grove-mark-light.svg
│   ├── logo-grove-mark-dark.svg
│   ├── logo-grove-horizontal-light.svg
│   └── logo-grove-horizontal-dark.svg
└── design_source/
    ├── index.html                   ← design system preview shell
    ├── tokens.jsx                   ← palette + type definitions
    ├── foundations.jsx              ← color/type/spacing/elevation artboards
    ├── components.jsx               ← button/input/tag artboards
    ├── applications.jsx             ← hero/plans/tiers/mobile artboards
    ├── logos.jsx                    ← all 12 logo marks; grove is selected
    ├── tweaks.jsx                   ← live tweak panel (preview-only)
    └── design-canvas.jsx            ← pannable/zoomable canvas (preview-only)
```

Open `design_source/index.html` in a browser to interact with the full system. Use the Tweaks panel bottom-right to see dark mode, alternate hero layouts, and the other logo marks Ashlyn chose from (for reference — grove is the selected one).

## Implementation notes for Claude Code / Cursor

- Start by porting `tokens/tokens.css` into your codebase as the single source of color/type/space. Reference via `var(--sr-*)`.
- If using Tailwind, extend `theme` with the token values (hex strings, not CSS vars, so JIT picks them up) and keep a small `globals.css` that applies the tokens too — Tailwind for utility, vars for component-level overrides.
- **Do not** reconstruct the logo from scratch — use the SVG files. They are authoritative.
- **Do not** introduce new colors. If a surface is needed that isn't in the token list, push back or propose a new semantic name first.
- Respect minimum type sizes: body 15px, captions 12px. Never go below.
- Photography is intentionally absent — treat striped placeholders as "image goes here" and leave the slot structured until real photography arrives.
