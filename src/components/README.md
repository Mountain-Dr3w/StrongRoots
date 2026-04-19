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

- `Button` — variants: `primary | accent | ghost | danger`; sizes: `sm | md | lg`.
- `Input` — single variant; theming via tokens.
- `Card` + `CardTitle` + `CardBody` — compose into content blocks.
- `Dialog` — wraps the native `<dialog>` element; controlled via `open` + `onClose`.

When adding a new variant, add the token first, then the variant class that
references it. Do not short-circuit with inline color values.
