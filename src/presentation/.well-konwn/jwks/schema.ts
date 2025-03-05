import { z } from '@hono/zod-openapi'
import type { JsonWebKeyWithKid, toZod } from '../../../utils/types'


export const JwksResponseSchema = z.object({
    keys: z.array(z.object<toZod<JsonWebKeyWithKid>>({
        kid: z.string().openapi({ title: 'Key ID' }),
        kty: z.string().openapi({ title: 'Key Type' }),
        use: z.string().optional().openapi({ title: 'Public Key Use' }),
        key_ops: z.array(z.string()).optional().openapi({ title: 'Key Operations' }),
        alg: z.string().optional().openapi({ title: 'Algorithm' }),
        n: z.string().optional().openapi({ title: 'RSA Modulus' }),
        e: z.string().optional().openapi({ title: 'RSA Exponent' }),
        d: z.string().optional().openapi({ title: 'RSA Private Exponent' }),
        p: z.string().optional().openapi({ title: 'RSA Prime Factor' }),
        q: z.string().optional().openapi({ title: 'RSA Prime Factor' }),
        dp: z.string().optional().openapi({ title: 'RSA First Factor CRT Exponent' }),
        dq: z.string().optional().openapi({ title: 'RSA Second Factor CRT Exponent' }),
        qi: z.string().optional().openapi({ title: 'RSA First CRT Coefficient' }),
        oth: z.array(z.object({
            r: z.string().optional().openapi({ title: 'RSA Other Prime Info' }),
            d: z.string().optional().openapi({ title: 'RSA Other Prime Info' }),
            t: z.string().optional().openapi({ title: 'RSA Other Prime Info' })
        })).optional().openapi({ title: 'Other Primes Info' }),
        crv: z.string().optional().openapi({ title: 'Elliptic Curve' }),
        x: z.string().optional().openapi({ title: 'Elliptic Curve X Coordinate' }),
        y: z.string().optional().openapi({ title: 'Elliptic Curve Y Coordinate' }),
        ext: z.boolean().optional().openapi({ title: 'RSA Public Exponent' }),
        k: z.string().optional().openapi({ title: 'Symmetric Key' }),
    })).openapi({ title: 'Keys' }),
})

export const VerifyTokenRequestSchema = z.object({
    token: z.string().openapi({ title: 'Token' }),
});