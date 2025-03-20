export interface IKeyRepositoryInterface {
    generateSignKeys(): { kid: string } & KeySetType | Promise<{ kid: string } & KeySetType>
    findOrCreateWrapKey(): Promise<string>

    saveKeys(kid: string, keys: KeySetType): Promise<void>
    getPrivateKeys(buffer: string, kid?: string[]): Promise<(PrivateKeyType & { kid: string })[]>

    exportPublicKeys(): Promise<{ keys: JsonWebKeyWithKid[] }>
}

export type PrivateKeyType = { privateKey: CryptoKey }
export type publicKeyType = { publicKey: CryptoKey }
export type KeySetType = publicKeyType & PrivateKeyType

export const IKeyRepositoryInterfaceType = {
    IKeyRepositoryInterface: Symbol.for('IKeyRepositoryInterface'),

};