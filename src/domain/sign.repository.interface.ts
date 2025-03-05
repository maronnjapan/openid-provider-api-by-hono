export type TokenHeader = {
    alg: 'RS256' | 'HS256' | 'ES256',
    typ: 'JWT'
    kid: string
}

export interface ISignRepositoryInterface {
    sign(payload: Record<string, unknown>, header: TokenHeader, secretKey: CryptoKey): string | Promise<string>
}

export const ISignRepositoryInterfaceType = {
    ISignRepositoryInterface: Symbol.for('ISignRepositoryInterface'),
};