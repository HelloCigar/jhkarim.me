import { presetAnthonyDesign } from '@antfu/design/unocss'
import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig, presetIcons, presetWebFonts, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetAnthonyDesign({
      darkBackground: '#111',
    }),
    // A base preset is required — the semantic shortcuts expand into its utilities
    presetWind4(),
    presetIcons(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        mono: 'DM Mono',
      },
    }),
  ],

  // Expands the `--at-apply` token directives used by `@antfu/design/styles/*.css`
  // and our own css/app.css
  transformers: [transformerDirectives()],

  content: {
    // Edge templates are server-rendered and never enter the Vite module graph,
    // so their classes must be scanned from disk
    filesystem: ['resources/views/**/*.edge'],
  },

  // Named z-index layers — the preset blocks plain `z-<n>`; ordering is the contract
  shortcuts: {
    'z-nav': 'z-[30]',
    'z-dropdown': 'z-[40]',
    'z-tooltip': 'z-[45]',
    'z-toast': 'z-[50]',
    'z-modal-backdrop': 'z-[60]',
    'z-modal-content': 'z-[70]',
    'z-drawer-backdrop': 'z-[80]',
    'z-drawer-content': 'z-[90]',
  },
})
