import type { GenerateAuthorizeCodeInput } from "../../../application/usecase/generate-authorize-code/types";
import type { AuthorizeParamSchemaType } from "../schema";

export const convertRequestToGenerateAuthorizationCodeInput = (req: AuthorizeParamSchemaType): GenerateAuthorizeCodeInput => ({
    clientId: req.client_id,
    redirectUri: req.redirect_uri,
    scope: req.scope.split(' '),
    state: req.state,
    codeChallenge: req.code_challenge,
    codeChallengeMethod: req.code_challenge_method,
    nonce: req.nonce,
})