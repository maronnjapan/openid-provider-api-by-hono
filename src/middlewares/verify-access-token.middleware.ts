import type { Context } from "hono";
import { env } from "hono/adapter";
import { HTTPException } from "hono/http-exception";
import jwksRsa from "jwks-rsa";
import * as jsonwebtoken from 'jsonwebtoken'


export const verifyAccessTokenMiddleware = async (context: Context, next: () => Promise<void>) => {

    const authorizationHeader = context.req.header('Authorization')
    if (!authorizationHeader?.startsWith('Bearer ')) {
        throw new HTTPException(401, { message: 'Not Exist Access Token' })
    }

    const token = jsonwebtoken.decode(authorizationHeader, { complete: true })
    if (!token) {
        throw new HTTPException(401, { message: 'Not Exist Access Token' })
    }
    const { JWKS_URI } = env<{ JWKS_URI: string }>(context)
    const jwksClient = jwksRsa({ jwksUri: JWKS_URI, jwksRequestsPerMinute: 5, timeout: 5000 })
    const key = await jwksClient.getSigningKey(token.header.kid)

    try {
        const res = jsonwebtoken.verify(authorizationHeader, key.getPublicKey(), { audience: context.req.url, complete: true, algorithms: ['RS256'] })

        return await next();
    } catch (e) {
        throw new HTTPException(401, { message: 'Invalid Access Token' })
    }
}

// declare module 'hono' {
//     interface ContextVariableMap {
//         userContext: jsonwebtoken.JwtPayload
//     }
// }