import type { Context } from "hono";
import { container } from "../infrastructure/provider";
import { KeyValueStoreRepositoryType } from "../infrastructure/types.provider";



export const bindContainerMiddleware = async (context: Context, next: () => Promise<void>) => {
    if (!container.isBound(KeyValueStoreRepositoryType.KVNamespace)) {
        console.log('KVNamespace is not bound')
        container.bind(KeyValueStoreRepositoryType.KVNamespace).toConstantValue(context.env.MY_KV_NAMESPACE);
    }
    await next()
}