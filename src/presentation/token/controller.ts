import { createPostRouter } from "./router";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import type app from "../..";

export const registerTokenRoutes = (baseApp: typeof app) => {

    baseApp.use(createPostRouter.path, cors({
        origin: '*',
        allowMethods: ['POST', 'OPTIONS'],
        allowHeaders: ['Content-Type'],
        maxAge: 600,
    }))

    baseApp.openapi(createPostRouter, async (c) => {
        const kv = c.env.MY_KV_NAMESPACE;
        const prismaClient = c.get('prisma')
        const { code, code_verifier, grant_type, client_id, redirect_uri } = c.req.valid('json')

        const existedCode = await kv.get(code)
        if (!existedCode) {
            throw new HTTPException(401, { message: 'Invalid Code' })
        }
        const codeValue: CodeValue = JSON.parse(existedCode)

        const codeChallenge = await generateCodeChallenge(code_verifier, codeValue.code_challenge_method)
        if (codeValue.code_challenge !== codeChallenge) {
            throw new HTTPException(401, { message: 'Invalid Code Verifier' })
        }

        if (!codeValue.is_client_authed) {
            if (!client_id || !redirect_uri) {
                throw new HTTPException(400, { message: 'Invalid Request' })
            }
            if (client_id !== codeValue.client_id || redirect_uri !== codeValue.redirect_uri) {
                throw new HTTPException(401, { message: 'Unauthorized' })
            }
        }

        const user = await prismaClient.user.findUnique({ where: { id: codeValue.user_id } })
        const client = await prismaClient.client.findUnique({ where: { clientId: codeValue.client_id } })
        if (!user || !client) {
            throw new HTTPException(401, { message: 'Unauthorized' })
        }

        const nonceObj = codeValue.nonce ? { nonce: codeValue.nonce } : {}

        const idTokenPayload = {
            iss: `${c.req.header('Referer')}/`,
            sub: '1234567890',
            name: user.name,
            iat: Date.now(),
            exp: Date.now() + 3600,
            aud: codeValue.client_id,
            ...nonceObj
        }

        return c.json({}, 201, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache',
        })
    })
}
