export interface IKeyRepositoryInterface {
    readonly _kid: string
    generateSignKeys(): { kid: string, privateKey: CryptoKey, publicKey: CryptoKey } | Promise<{ kid: string, privateKey: CryptoKey, publicKey: CryptoKey }>
}

export const IKeyRepositoryInterfaceType = {
    IKeyRepositoryInterface: Symbol.for('IKeyRepositoryInterface'),

};