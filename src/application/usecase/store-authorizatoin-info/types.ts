export type codeChallengeMethod = 'S256' | 'plain';

export type AuthorizationInfo = {
    nonce?: string;
    code_challenge: string;
    code_challenge_method: codeChallengeMethod;
    client_id: string;
    redirect_uri: string;
    state: string;
}