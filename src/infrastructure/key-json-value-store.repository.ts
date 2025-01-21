import { injectable } from "inversify"
import type { IKeyJsonValueStoreRepositoryInterface } from "../domain/key-value-store.repository.interface"

@injectable()
export class KeyJsonValueStoreRepository implements IKeyJsonValueStoreRepositoryInterface {
    constructor(private readonly store: KVNamespace) { }

    async get<T extends Record<string, unknown>>(key: string) {
        return await this.store.get<T>(key, 'json')
    }

    async set(key: string, value: Record<string, unknown>) {
        return this.store.put(key, JSON.stringify(value))
    }

    async delete(key: string) {
        return this.store.delete(key)
    }
}