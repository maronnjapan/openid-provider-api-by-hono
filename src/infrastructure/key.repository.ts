import { v4 as uuidv4 } from 'uuid'
import type { IKeyRepositoryInterface, KeySetType } from '../domain/key.repository.interface';
import { inject, injectable } from 'inversify';
import { HTTPException } from 'hono/http-exception';
import type { PrismaClient } from '@prisma/client';
import { PrismaClientType } from './prisma';

@injectable()
export class KeyRepository implements IKeyRepositoryInterface {
    readonly _kid: string
    @inject(PrismaClientType.PrismaClient)
    private readonly prisma: PrismaClient;

    private readonly signAlg = 'RSASSA-PKCS1-v1_5'
    private readonly hashAlg = 'SHA-256'

    constructor(prisma: PrismaClient, kid?: string) {
        this._kid = kid ?? uuidv4()
        this.prisma = prisma;
    }

    async generateSignKeys() {

        const keyPair = await crypto.subtle.generateKey(
            {
                name: this.signAlg,
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]).buffer,
                hash: this.hashAlg
            },
            true,
            ['sign', 'verify']
        );

        if (keyPair instanceof CryptoKey) {
            throw new HTTPException(500, { message: 'Failed to generate key pair' })
        }

        // const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
        // const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
        // if (!(publicKey instanceof ArrayBuffer) || !(privateKey instanceof ArrayBuffer)) {
        //     throw new HTTPException(500, { message: 'Failed to export key' })
        // }

        return {
            kid: this._kid,
            ...keyPair,
        }
    }

    async saveKeys(kid: string, keys: { publicKey: CryptoKey, privateKey: CryptoKey }): Promise<void> {
        const publicKey = await crypto.subtle.exportKey('jwk', keys.publicKey);
        const privateKey = await crypto.subtle.exportKey('jwk', keys.privateKey);
        if ((publicKey instanceof ArrayBuffer) || (privateKey instanceof ArrayBuffer)) {
            throw new HTTPException(500, { message: 'Failed to export key' })
        }

        await this.prisma.signKey.create({
            data: {
                kid,
                privateKey: JSON.stringify(privateKey),
                publicKey: JSON.stringify(publicKey)
            }
        })
    }

    async getKeys(kid?: string[]) {
        const keys = await this.prisma.signKey.findMany({ where: { kid: { in: kid } } });

        const exec = keys.map(async (key) => {
            const publicKey = await crypto.subtle.importKey('jwk', JSON.parse(key.publicKey), { name: this.signAlg, hash: this.hashAlg }, true, ['verify']);
            const privateKey = await crypto.subtle.importKey('jwk', JSON.parse(key.privateKey), { name: this.signAlg, hash: this.hashAlg }, true, ['sign']);
            if (!(publicKey instanceof CryptoKey) || !(privateKey instanceof CryptoKey)) {
                throw new HTTPException(500, { message: 'Failed to import key' })
            }
            return {
                kid: key.kid,
                publicKey,
                privateKey
            }
        });

        return Promise.all(exec)
    }

    async exportPublicKeys() {
        const alreadyExistKeys = await this.prisma.signKey.findMany();
        const keys = alreadyExistKeys.map((key) => {
            return {
                kid: key.kid,
                ...JSON.parse(key.publicKey)
            }
        });

        return { keys }
    }
}