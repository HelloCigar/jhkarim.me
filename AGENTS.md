# Agent guidelines

## Design system

This project follows the `@antfu/design` system: the UnoCSS preset
(`presetAnthonyDesign` in `uno.config.ts`) provides the semantic token
vocabulary (`bg-base`, `bg-secondary`, `bg-hover`, `bg-active`, `color-base`,
`color-muted`, `color-faint`, `color-active`, `border-base`, `op-fade`,
`badge`, `badge-color-<name>`, `color-scale-*`, ...). Use these tokens instead
of raw colors: every token carries a dark variant, so a hand-written
`bg-white` or `text-gray-800` is a dark-mode bug.

The React components in `inertia/components/ui/` are styled with this
vocabulary. Some of them carry AdonisJS + Inertia integrations (for example
`inertia/components/ui/form.tsx`) - keep those intact when editing.

z-index always goes through the named layers defined in `uno.config.ts`
(`z-nav`, `z-dropdown`, `z-tooltip`, `z-toast`, `z-modal-backdrop`,
`z-modal-content`, `z-drawer-backdrop`, `z-drawer-content`); plain `z-<n>` is
blocked by the preset.

Technical values (numbers, sizes, durations, dates, money) render in
`font-mono tabular-nums`.

When making UI or using components, always check if components from
`@antfu/design` can be reused, before making new components or creating
inline DOM elements.
