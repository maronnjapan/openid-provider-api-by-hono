export interface CreateTokenInput {
    code_verifier: string;
    code: string;
    client_id?: string;
    redirect_uri?: string;
}