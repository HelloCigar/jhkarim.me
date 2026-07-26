import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import '@antfu/design/styles/base.css'
import '@antfu/design/styles/scrollbar.css'
import '@antfu/design/styles/animations.css'
import './css/app.css'
import { client } from './client'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '~/hooks/use_theme'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
    return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'))
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <TuyauProvider client={client}>
        <ThemeProvider>
          <App {...props} />
        </ThemeProvider>
      </TuyauProvider>
    )
  },
  progress: {
    color: '#4B5563',
  },
})
