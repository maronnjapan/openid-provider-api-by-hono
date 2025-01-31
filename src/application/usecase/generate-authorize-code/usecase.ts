import { inject } from "inversify";
import { KeyValueStoreRepositoryType } from "../../../infrastructure/types.provider";
import type { IKeyJsonValueStoreRepositoryInterface } from "../../../domain/key-value-store.repository.interface";
import type { PrismaClient } from "@prisma/client";
import type { AuthorizationInfo, GenerateAuthorizeCodeInput } from "./types";
import { HTTPException } from "hono/http-exception";
import { v4 as uuidv4 } from "uuid";
import { Scope } from "../../../domain/value-objects/scope";
import { PrismaClientType } from "../../../infrastructure/prisma";
import { CodeChallenge } from "../../../domain/value-objects/code-challenge";
import { CodeVerifier } from "../../../domain/value-objects/code-verifier";
import { hashSha256 } from "../../../utils/hash";

export class GenerateAuthorizeCodeUseCase {
    @inject(KeyValueStoreRepositoryType.IKeyJsonValueStoreRepositoryInterface)
    private kvStoreRepository: IKeyJsonValueStoreRepositoryInterface;

    @inject(PrismaClientType.PrismaClient)
    private readonly prisma: PrismaClient;

    constructor(
        kvStoreRepository: IKeyJsonValueStoreRepositoryInterface,
        prisma: PrismaClient,
    ) {
        this.kvStoreRepository = kvStoreRepository;
        this.prisma = prisma;
    }

    async execute(request: GenerateAuthorizeCodeInput) {
        const client = await this.prisma.client.findUnique({ where: { clientId: request.clientId }, include: { allowRedirectUrls: true, allowScopes: true } })

        if (!client) {
            throw new HTTPException(401, { message: 'Unauthorized client' });
        }
        if (client.allowRedirectUrls.length === 0 || client.allowScopes.length === 0) {
            throw new HTTPException(401, { message: 'Not Allowed URL' });
        }
        if (request.redirectUri && !client.allowRedirectUrls.some(redirectUrl => redirectUrl.url === request.redirectUri)) {
            throw new HTTPException(401, { message: 'Unauthorized url' });
        }
        if (!client.allowScopes.some(allowScope => request.scope.includes(allowScope.name))) {
            throw new HTTPException(401, { message: 'Unauthorized scope' });
        }

        const scopes = request.scope.map(s => new Scope(s))

        const code = uuidv4()
        const authInfoValue: AuthorizationInfo = {
            clientId: request.clientId,
            redirectUri: request.redirectUri ?? client.allowRedirectUrls[0].url,
            state: request.state,
            codeChallenge: request.codeChallenge,
            codeChallengeMethod: request.codeChallengeMethod,
            code,
            scope: scopes.map(s => s._value),
            nonce: request.nonce,
        }

        const codeChallenge = request.codeChallengeMethod === 'S256' ? new CodeChallenge(request.codeChallenge, request.codeChallengeMethod) : await CodeChallenge.fromVerifier(new CodeVerifier(request.codeChallenge), 'S256')

        const key = await hashSha256(codeChallenge.toString())
        await this.kvStoreRepository.set(key, authInfoValue, 3600)

        return {
            code,
            state: request.state,
            redirectUri: request.redirectUri ?? client.allowRedirectUrls[0].url,
        } as const;
    }
}