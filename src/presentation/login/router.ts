import { createRoute } from "@hono/zod-openapi";
import { loginRequestSchema, loginResponseSchema } from "./schema";

export const loginRouter = createRoute({
    method: 'post',
    path: '/login',
    request: {
        body: {
            content: {
                "application/json": {
                    schema: loginRequestSchema
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: loginResponseSchema
                }
            },
            description: 'ログイン成功'
        }
    }
})