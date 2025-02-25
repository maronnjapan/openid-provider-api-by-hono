import { OpenAPIHono } from '@hono/zod-openapi'
import { prismaMiddleware } from './middlewares/init-prisma-client.middleware'
import { logger } from 'hono/logger'
import { requestId } from 'hono/request-id'
import { loggerMiddleware } from './middlewares/logger.middleware'
import { bindContainerMiddleware } from './middlewares/bind-container.middleware'
import { setCookiesMiddleware } from './middlewares/set-cookies.middleware'
import { registerTokenRoutes } from './presentation/token/controller'
import { container } from './provider'
import { authorizeRoutes } from './presentation/authorize/controller'
import { loginRoute } from './presentation/login/controller'
import { jwksRoutes } from './presentation/.well-konwn/jwks/controller'
import { rotationKeyRoutes } from './jobs/rotation-key'

export type Bindings = {
  DB: D1Database
  "kv-store": KVNamespace,
  ISSUER_URL: string,
}
const app = new OpenAPIHono<{ Bindings: Bindings }>()
export type AppType = typeof app

console.dir(container, { depth: null })
app.use(logger())
app.use('*', requestId())
app.use('*', loggerMiddleware)
app.use('*', prismaMiddleware)
app.use('*', bindContainerMiddleware)
app.use('*', setCookiesMiddleware)
registerTokenRoutes(app, container)
authorizeRoutes(app, container)
loginRoute(app, container);
jwksRoutes(app, container);

const scheduled: ExportedHandlerScheduledHandler<Bindings> = async (event, env, ctx) => {
  ctx.waitUntil(rotationKeyRoutes(env))
}

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'OpenID ConnectのAPI',
    version: '1.0.0'
  }
})
export default { fetch: app.fetch, scheduled }
