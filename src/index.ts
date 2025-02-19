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

type Bindings = {
  DB: D1Database
  "kv-store": KVNamespace,
  ISSUER_URL: string,
}
const app = new OpenAPIHono<{ Bindings: Bindings }>()

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

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'OpenID ConnectのAPI',
    version: '1.0.0'
  }
})
export default app
