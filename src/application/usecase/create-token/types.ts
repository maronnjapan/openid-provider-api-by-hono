export interface CreateTokenInput {
    issuerUrl: string;
    codeVerifier: string;
    code: string;
    clientId?: string;
    redirectUri?: string;
}

export const CreateTokenType = {
    CreateTokenUseCase: Symbol.for('CreateTokenUseCase')
}