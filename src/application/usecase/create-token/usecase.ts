import { inject, injectable } from "inversify";
import type { CreateTokenInput } from "./types";
import { KeyRepositoryType, KeyValueStoreRepositoryType, SignRepositoryType } from "../../../infrastructure/types.provider";
import type { IKeyJsonValueStoreRepositoryInterface } from "../../../domain/key-value-store.repository.interface";
import { AuthorizationCode } from "../../../domain/value-objects/authrization-code";
import { HTTPException } from "hono/http-exception";
import { CodeVerifier } from "../../../domain/value-objects/code-verifier";
import { CodeChallenge } from "../../../domain/value-objects/code-challenge";
import type { IKeyRepositoryInterface } from "../../../domain/key.repository.interface";
import { AccessToken } from "../../../domain/access-token";
import type { ISignRepositoryInterface } from "../../../domain/sign.repository.interface";
import { IdToken } from "../../../domain/id-token";
import type { PrismaClient } from "@prisma/client";
import type { AuthorizationInfo } from "../generate-authorize-code/types";
import { Scope } from "../../../domain/value-objects/scope";
import { PrismaClientType } from "../../../infrastructure/prisma";
import { hashSha256 } from "../../../utils/hash";

@injectable()
export class CreateTokenUseCase {
    @inject(KeyRepositoryType.IKeyRepositoryInterface)
    private keyRepository: IKeyRepositoryInterface;
    @inject(KeyValueStoreRepositoryType.IKeyJsonValueStoreRepositoryInterface)
    private kvStoreRepository: IKeyJsonValueStoreRepositoryInterface;
    @inject(SignRepositoryType.ISignRepositoryInterface)
    private signRepository: ISignRepositoryInterface;
    @inject(PrismaClientType.PrismaClient)
    private readonly prisma: PrismaClient;

    constructor(
        keyRepository: IKeyRepositoryInterface,
        kvStoreRepository: IKeyJsonValueStoreRepositoryInterface,
        signRepository: ISignRepositoryInterface,
        prisma: PrismaClient
    ) {
        this.keyRepository = keyRepository;
        this.kvStoreRepository = kvStoreRepository;
        this.signRepository = signRepository;
        this.prisma = prisma;
    }

    async execute(request: CreateTokenInput) {
        const keyPrevHash = await CodeChallenge.fromVerifier(new CodeVerifier(request.codeVerifier), 'S256')
        const key = await hashSha256(keyPrevHash.toString())
        const authInfo = await this.kvStoreRepository.get<AuthorizationInfo>(key);
        if (!authInfo) {
            throw new HTTPException(401, { message: '認可情報が見つかりません' });
        }

        const client = await this.prisma.client.findUnique({ where: { clientId: authInfo.clientId } })
        if (!client) {
            throw new HTTPException(401, { message: '一致するクライアントが存在しません' });
        }

        const storedCode = AuthorizationCode.from(authInfo.code);
        const requestCode = AuthorizationCode.from(request.code)


        const codeVErifier = new CodeVerifier(request.codeVerifier);

        const codeChallenge = new CodeChallenge(authInfo.codeChallenge, authInfo.codeChallengeMethod);
        const codeChallengeByRequest = await CodeChallenge.fromVerifier(codeVErifier, authInfo.codeChallengeMethod);
        if (!codeChallenge.equals(codeChallengeByRequest)) {
            throw new HTTPException(401, { message: 'Invalid code_verifier' });
        }

        if (!storedCode.equals(requestCode)) {
            throw new HTTPException(401, { message: 'Invalid code' });
        }

        const alreadyExistKeys = await this.keyRepository.getKeys()
        const keys = [...alreadyExistKeys]
        if (keys.length < 3) {
            const { kid, privateKey, publicKey } = await this.keyRepository.generateSignKeys();
            await this.keyRepository.saveKeys(kid, { privateKey, publicKey });
            keys.push({ kid, privateKey, publicKey });
        }

        const { kid, privateKey } = keys[0];


        const accessToken = new AccessToken('Bearer', 3600, authInfo.scope.map(s => new Scope(s)));
        const header = accessToken.generateHeader(kid);
        const payload = accessToken.generatePayload();

        const signAccessToken = await this.signRepository.sign(payload, header, privateKey);

        const idToken = new IdToken({
            aud: authInfo.clientId,
            sub: 'sub',
            exp: Math.floor(Date.now() / 1000) + 3600,
            iat: Math.floor(Date.now() / 1000),
            iss: request.issuerUrl,
            nonce: authInfo.nonce
        });

        const idTokenPayload = idToken.toJSONPayload();
        const idTokenHeader = idToken.toJsonHeader(kid);

        const signIdToken = await this.signRepository.sign(idTokenPayload, idTokenHeader, privateKey);

        return {
            access_token: signAccessToken,
            token_type: 'Bearer',
            expires_in: accessToken.expiresIn,
            scope: authInfo.scope.join(' '),
            id_token: signIdToken
        } as const;
    }
}