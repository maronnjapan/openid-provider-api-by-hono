export interface IKeyTextValueStoreRepositoryInterface {
    get(key: string): Promise<string | null>
    set(key: string, value: string): Promise<void>
    delete(key: string): Promise<void>
}

export const IKeyTextValueStoreRepositoryInterfaceType = {
    IKeyTextValueStoreRepositoryInterface: Symbol.for('IKeyTextValueStoreRepositoryInterface'),
};

export interface IKeyJsonValueStoreRepositoryInterface {
    get<T extends Record<string, unknown>>(key: string): Promise<T | null>
    set(key: string, value: Record<string, unknown>, expirationTtl?: number): Promise<void>
    delete(key: string): Promise<void>
}

export const IKeyJsonValueStoreRepositoryInterfaceType = {
    IKeyJsonValueStoreRepositoryInterface: Symbol.for('IKeyJsonValueStoreRepositoryInterface'),
};
