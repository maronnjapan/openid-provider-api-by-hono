import { IKeyJsonValueStoreRepositoryInterfaceType, IKeyTextValueStoreRepositoryInterfaceType } from "../domain/key-value-store.repository.interface";
import { IKeyRepositoryInterfaceType } from "../domain/key.repository.interface";
import { ISignRepositoryInterfaceType } from "../domain/sign.repository.interface";

export const KeyRepositoryType = {
    // ...IKeyRepositoryInterfaceType,
    IKeyRepositoryInterface: Symbol.for('IKeyRepositoryInterface'),
    KeyRepository: Symbol.for('KeyRepository')
}

export const KeyValueStoreRepositoryType = {
    ...IKeyTextValueStoreRepositoryInterfaceType,
    ...IKeyJsonValueStoreRepositoryInterfaceType,
    KeyValueStoreRepository: Symbol.for('KeyValueStoreRepository'),
    KVNamespace: Symbol.for('KVNamespace')
}

export const SignRepositoryType = {
    ...ISignRepositoryInterfaceType,
    SignRepository: Symbol.for('SignRepository')
}

