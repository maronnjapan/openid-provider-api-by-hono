export type TokenHeader = {
    alg: 'RS256' | 'HS256',
    typ: 'JWT'
    kid: string
}

export interface ISignRepositoryInterface {
    sign(payload: Record<string, unknown>, header: TokenHeader, secret_key: string): string
}

export const ISignRepositoryInterfaceType = {
    ISignRepositoryInterface: Symbol.for('ISignRepositoryInterface'),
};