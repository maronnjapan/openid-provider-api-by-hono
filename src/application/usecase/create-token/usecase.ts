import { inject, injectable } from "inversify";
import { KeyRepositoryType } from "../../infrastructure/types.provider";
import type { IKeyRepositoryInterface } from "../../domain/key.repository.interface";
import type { CreateTokenInput } from "./types";
import { KeyValueStoreRepositoryType } from "../../../infrastructure/types.provider";
import type { IKeyJsonValueStoreRepositoryInterface } from "../../../domain/key-value-store.repository.interface";
import { AuthorizationCode } from "../../../domain/authrization-code";
import { HTTPException } from "hono/http-exception";
import { CodeVerifier } from "../../../domain/value-objects/code-verifier";
import { AuthorizationInfo } from "../store-authorizatoin-info/types";
import { CodeChallenge } from "../../../domain/value-objects/code-challenge";

@injectable()
export class CreateTokenUseCase {
    @inject(KeyRepositoryType.IKeyRepositoryInterface)
    private _keyRepository: IKeyRepositoryInterface;
    @inject(KeyValueStoreRepositoryType.IKeyJsonValueStoreRepositoryInterface)
    private _kvStoreRepository: IKeyJsonValueStoreRepositoryInterface;

    constructor(
        private readonly keyRepository: IKeyRepositoryInterface,
        private readonly kvStoreRepository: IKeyJsonValueStoreRepositoryInterface
    ) {
        this._keyRepository = keyRepository;
        this._kvStoreRepository = kvStoreRepository;
    }

    async execute(request: CreateTokenInput) {
        const code = AuthorizationCode.from(request.code);
        const authInfo = await this._kvStoreRepository.get<AuthorizationInfo>(code.value);
        if (!authInfo) {
            throw new HTTPException(401, { message: 'Invalid code' });
        }
        const codeVErifier = new CodeVerifier(request.code_verifier);
        const codeChallenge = new CodeChallenge(authInfo.code_challenge, authInfo.code_challenge_method);
        const codeChallengeByRequest = await CodeChallenge.fromVerifier(codeVErifier, authInfo.code_challenge_method);
        if (!codeChallenge.equals(codeChallengeByRequest)) {
            throw new HTTPException(401, { message: 'Invalid code_verifier' });
        }

        // authInfo.




        const storedCodeChallenge = authInfo.code_challenge

    }
}