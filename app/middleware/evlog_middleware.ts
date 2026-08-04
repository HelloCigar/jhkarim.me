// middleware/evlog_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import {
  createLoggerStorage,
  defineFrameworkIntegration,
  type BaseEvlogOptions,
} from 'evlog/toolkit'
import type { RequestLogger } from 'evlog'

// Augment HttpContext so `ctx.log` is typed everywhere
declare module '@adonisjs/core/http' {
  interface HttpContext {
    evlog: RequestLogger
  }
}

export type AdonisEvlogOptions = BaseEvlogOptions

const { storage, useLogger } = createLoggerStorage(
  'Cannot access logger outside of middleware context. Make sure EvlogMiddleware is registered before your routes.'
)

export { useLogger }

const integration = defineFrameworkIntegration<HttpContext>({
  name: 'adonisjs',
  extractRequest: (ctx) => ({
    method: ctx.request.method(),
    path: ctx.request.url(),
    headers: ctx.request.headers(),
    requestId: ctx.request.header('x-request-id'),
  }),
  attachLogger: (ctx, logger) => {
    ctx.evlog = logger
  },
  storage,
})

const options: AdonisEvlogOptions = {}

export default class EvlogMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { skipped, finish, runWith } = integration.start(ctx, options)
    if (skipped) {
      return next()
    }

    try {
      const output = await runWith(() => next())
      await finish({ status: ctx.response.getStatus() })
      return output
    } catch (error) {
      await finish({ error: error as Error })
      throw error
    }
  }
}
