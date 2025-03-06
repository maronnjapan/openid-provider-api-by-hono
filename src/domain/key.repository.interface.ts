export interface IKeyRepositoryInterface {
    readonly _kid: string
    generateSignKeys(): { kid: string } & KeySetType | Promise<{ kid: string } & KeySetType>
    findOrCreateWrapKey(): Promise<string>

    saveKeys(kid: string, keys: KeySetType): Promise<void>
    getKeys(buffer: string, kid?: string[]): Promise<(KeySetType & { kid: string })[]>

    exportPublicKeys(): Promise<{ keys: JsonWebKeyWithKid[] }>
}

export type KeySetType = { publicKey: CryptoKey, privateKey: CryptoKey }

export const IKeyRepositoryInterfaceType = {
    IKeyRepositoryInterface: Symbol.for('IKeyRepositoryInterface'),

};