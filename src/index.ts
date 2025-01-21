import { OpenAPIHono } from '@hono/zod-openapi'
import { registerTokenRoutes } from './token/controller'
import { prismaMiddleware } from './middlewares/init-prisma-client.middleware'
import { logger } from 'hono/logger'
import { requestId } from 'hono/request-id'
import { loggerMiddleware } from './middlewares/logger.middleware'
import { bindContainerMiddleware } from './middlewares/bind-container.middleware'

type Bindings = {
  DB: D1Database
  MY_KV_NAMESPACE: KVNamespace
}
const app = new OpenAPIHono<{ Bindings: Bindings }>()

app.use(logger())
app.use('*', requestId())
app.use('*', loggerMiddleware)
app.use('*', prismaMiddleware)
app.use('*', bindContainerMiddleware)
registerTokenRoutes(app)

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'Todo アプリのAPI',
    version: '1.0.0'
  }
})
export default app
