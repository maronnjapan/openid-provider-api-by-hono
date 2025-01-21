import { injectable } from "inversify"
import type { IKeyTextValueStoreRepositoryInterface } from "../domain/key-value-store.repository.interface"

@injectable()
export class KeyTextValueStoreRepository implements IKeyTextValueStoreRepositoryInterface {
    constructor(private readonly store: KVNamespace) { }

    async get(key: string) {
        return await this.store.get(key, 'text')
    }

    async set(key: string, value: string) {
        return this.store.put(key, value)
    }

    async delete(key: string) {
        return this.store.delete(key)
    }
}