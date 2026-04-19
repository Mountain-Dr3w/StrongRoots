# Primitive Components — Slot Contract

This directory contains the project's primitive components. They are deliberately
thin wrappers around native HTML elements. The design system team owns the visual
layer; this contract keeps the seam clean so tokens can be swapped without refactoring.

## Rules

1. **Token-only styling.** Components may only reference colors, radii, spacing, and
   typography through CSS variables defined in `src/app/globals.css`. No hardcoded
   hex values. No raw pixel magic numbers in components (they belong in tokens).
2. **Forward `className`.** Every component accepts and merges a `className` prop via
   `cn()` from `src/lib/cn.ts`. This is how consumers override or extend styling.
3. **Forward refs.** Every component uses `forwardRef` and exposes the underlying
   DOM element's ref.
4. **No hidden state.** Primitives are controlled by their parent. If a component
   needs open/close state (e.g. `Dialog`), it's lifted to props (`open`, `onClose`).

## Swapping in the real design system

To replace placeholder visuals with the real design system:

1. Update tokens in `src/app/globals.css` (both `:root` and `[data-theme="dark"]`).
2. If additional tokens are needed, add them to both blocks and expose them via
   `@theme inline`.
3. Optionally extend primitives here with new variants. Keep variant names stable.
4. Do NOT fork these primitives into a parallel tree. Edit in place.

## Variant inventory

- `Button` — variants: `primary | secondary | tertiary | ghost | accent | danger`;
  sizes: `sm | md | lg`. Primary + tertiary get a trailing arrow glyph by default;
  override with `arrow={false}`. `ghost` is an alias for `secondary` kept for
  backward compat.
- `Input` — single variant; accepts optional `label`, `hint`, `error` slots.
  Error state swaps the border to `--sr-error`; focus swaps it to 2px `--sr-accent`.
- `Card` + `CardImage` + `CardBody` + `CardTitle` — 16:9 image slot (striped
  placeholder background until real photography lands), 24px content padding,
  `--sr-font-display` title.
- `Dialog` — wraps the native `<dialog>` element; controlled via `open` + `onClose`.
  Uses `--sr-surface`, `--sr-line-soft`, `--sr-shadow-lift`.
- `FaqAccordion` — hairline dividers (`--sr-line-soft`), serif question, sans answer.

When adding a new variant, add the token first, then the variant class that
references it. Do not short-circuit with inline color values.
