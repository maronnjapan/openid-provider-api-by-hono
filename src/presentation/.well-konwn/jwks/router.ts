import { createRoute, z } from "@hono/zod-openapi";
import { JwksResponseSchema, VerifyTokenRequestSchema } from "./schema";

export const jwksRouter = createRoute({
    method: 'get',
    path: '.well-known/jwks.json',
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: JwksResponseSchema
                }
            },
            description: 'JWKSの返却'
        }
    }
})

export const verifyTokenRouter = createRoute({
    method: 'post',
    path: 'verify',
    request: {
        body: {
            content: {
                "application/json": {
                    schema: VerifyTokenRequestSchema
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.object({
                        result: z.boolean().openapi({ title: 'Result' })
                    })
                }
            },
            description: 'トークンの検証'
        }
    }
})