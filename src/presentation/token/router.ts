import { createRoute } from "@hono/zod-openapi";
import { CreateTokenParamSchema, CreateTokenResponseSchema } from "./schema";

export const createPostRouter = createRoute({
    method: 'post',
    path: 'oauth/token',
    request: {
        body: { content: { "application/json": { schema: CreateTokenParamSchema } } }
    },
    responses: {
        201: {
            content: {
                "application/json": {
                    schema: CreateTokenResponseSchema
                }
            },
            description: 'トークンの返却'
        }
    }
})