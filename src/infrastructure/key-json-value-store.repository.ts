import { inject, injectable } from "inversify"
import type { IKeyJsonValueStoreRepositoryInterface } from "../domain/key-value-store.repository.interface"
import { KeyValueStoreRepositoryType } from "./types.provider"

@injectable()
export class KeyJsonValueStoreRepository implements IKeyJsonValueStoreRepositoryInterface {
    @inject(KeyValueStoreRepositoryType.KVNamespace) private readonly store: KVNamespace
    constructor(store: KVNamespace) {
        this.store = store
    }

    async get<T extends Record<string, unknown>>(key: string) {
        return await this.store.get<T>(key, 'json')
    }

    async set(key: string, value: Record<string, unknown>, expirationTtl?: number) {
        return this.store.put(key, JSON.stringify(value), { expirationTtl })
    }

    async delete(key: string) {
        return this.store.delete(key)
    }
}