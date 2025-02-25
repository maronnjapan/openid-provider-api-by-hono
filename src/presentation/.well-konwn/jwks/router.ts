import { createRoute } from "@hono/zod-openapi";
import { JwksResponseSchema } from "./schema";

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