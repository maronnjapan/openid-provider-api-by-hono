import type { Context } from "hono";
import { KeyValueStoreRepositoryType } from "../infrastructure/types.provider";
import { container } from "../provider";
import { PrismaClientType } from "../infrastructure/prisma";
import type { PrismaClient } from "@prisma/client";



export const bindContainerMiddleware = async (context: Context, next: () => Promise<void>) => {
    console.log(context.env.MY_KV_NAMESPACE, 'context.env.MY_KV_NAMESPACE')
    if (!container.isBound(KeyValueStoreRepositoryType.KVNamespace)) {
        container.bind(KeyValueStoreRepositoryType.KVNamespace).toConstantValue(context.env.MY_KV_NAMESPACE);
    }

    if (!container.isBound(PrismaClientType.PrismaClient)) {
        container.bind<PrismaClient>(PrismaClientType.PrismaClient)
            .toConstantValue(context.get('prisma'))
    }

    await next()
}