import { createRoute } from "@hono/zod-openapi";
import { AuthorizeParamSchema, AuthorizeResponseSchema } from "./schema";

export const authorizeRouter = createRoute({
    method: 'post',
    path: 'authorize',
    request: {
        body: { content: { "application/json": { schema: AuthorizeParamSchema } } }
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: AuthorizeResponseSchema
                }
            },
            description: '認可コードを返却します'
        }
    }
})