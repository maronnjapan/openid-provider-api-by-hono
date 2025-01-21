import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import type { Context } from 'hono'
import { env, getRuntimeKey } from 'hono/adapter'

let prisma: PrismaClient | null = null

export const getPrismaClient = (c: Context) => {
    if (!prisma) {
        const runtime = getRuntimeKey()
        if (runtime === 'workerd') {
            const { DB } = env<{ DB: D1Database }>(c)
            const adapter = new PrismaD1(DB)
            prisma = new PrismaClient({ adapter })
        } else {
            const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)
            prisma = new PrismaClient({
                datasources: {
                    db: {
                        url: DATABASE_URL
                    }
                }
            })
        }


    }
    return prisma
}

export const prismaMiddleware = async (c: Context, next: () => Promise<void>) => {
    c.set('prisma', getPrismaClient(c))
    await next()
}

declare module 'hono' {
    interface ContextVariableMap {
        prisma: PrismaClient
    }
}