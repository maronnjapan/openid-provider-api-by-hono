import { createPostRouter } from "./router";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import type app from "../..";
import type { Container } from "inversify";
import type { CreateTokenUseCase } from "../../application/usecase/create-token/usecase";
import { CreateTokenType } from "../../application/usecase/create-token/types";
import type { CreateTokenParamType } from "./schema";

export const registerTokenRoutes = (baseApp: typeof app, container: Container) => {

    baseApp.use(createPostRouter.path, cors({
        origin: '*',
        allowMethods: ['POST', 'OPTIONS'],
        allowHeaders: ['*'],
        maxAge: 600,
    }))

    baseApp.openapi(createPostRouter, async (c) => {
        const createToken = container.get<CreateTokenUseCase>(CreateTokenType.CreateTokenUseCase)
        const issuerUrl = c.env.ISSUER_URL

        const body = await c.req.json() as CreateTokenParamType
        const res = await createToken.execute({ issuerUrl, code: body.code, codeVerifier: body.code_verifier, redirectUri: body.redirect_uri, clientId: body.client_id })

        return c.json({ ...res }, 201, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache',
        })
    })
}
