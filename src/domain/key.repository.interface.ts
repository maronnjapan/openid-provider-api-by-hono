export interface IKeyRepositoryInterface {
    readonly _kid: string
    generateSignKeys(): { kid: string, privateKey: string, publicKey: string } | Promise<{ kid: string, privateKey: string, publicKey: string }>
}

export const IKeyRepositoryInterfaceType = {
    IKeyRepositoryInterface: Symbol.for('IKeyRepositoryInterface'),

};