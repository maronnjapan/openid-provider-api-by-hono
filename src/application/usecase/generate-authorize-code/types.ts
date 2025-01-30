import type { CodeChallengeMethod } from "../../../domain/value-objects/code-challenge-method";
import type { ScopeValue } from "../../../domain/value-objects/scope";

export interface GenerateAuthorizeCodeInput {
    clientId: string;
    redirectUri?: string;
    scope: string[];
    state: string;
    codeChallenge: string;
    codeChallengeMethod: CodeChallengeMethod
    nonce?: string;
}

export type AuthorizationInfo = {
    nonce?: string;
    codeChallenge: string;
    codeChallengeMethod: CodeChallengeMethod;
    clientId: string;
    redirectUri: string;
    state: string;
    code: string;
    scope: ScopeValue[];
}

export const GenerateAuthorizeCodeType = {
    GenerateAuthorizeCode: Symbol.for('GenerateAuthorizeCode')
}