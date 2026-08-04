import { registry } from '@generated/registry'
import { createTuyau } from '@tuyau/core/client'
import { superjson } from '@tuyau/superjson/plugin'

export const client = createTuyau({
  baseUrl: '/',
  registry,
  plugins: [superjson()],
})

export const urlFor = client.urlFor
