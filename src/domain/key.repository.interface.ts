export interface IKeyRepositoryInterface {
    readonly _kid: string
    generateSignKeys(): { kid: string } & KeySetType | Promise<{ kid: string } & KeySetType>

    saveKeys(kid: string, keys: KeySetType): Promise<void>
    getKeys(kid?: string[]): Promise<(KeySetType & { kid: string })[]>

    exportPublicKeys(): Promise<{ keys: JsonWebKeyWithKid[] }>
}

export type KeySetType = { publicKey: CryptoKey, privateKey: CryptoKey }

export const IKeyRepositoryInterfaceType = {
    IKeyRepositoryInterface: Symbol.for('IKeyRepositoryInterface'),

};