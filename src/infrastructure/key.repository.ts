import { v4 as uuidv4 } from 'uuid'
import type { IKeyRepositoryInterface, KeySetType } from '../domain/key.repository.interface';
import { inject, injectable } from 'inversify';
import { HTTPException } from 'hono/http-exception';
import type { PrismaClient } from '@prisma/client';
import { PrismaClientType } from './prisma';
import { KEY_BASE_OPTIONS } from '../utils/const';

const pemHeader = "-----BEGIN PRIVATE KEY-----";
const pemFooter = "-----END PRIVATE KEY-----";


@injectable()
export class KeyRepository implements IKeyRepositoryInterface {
    readonly _kid: string
    @inject(PrismaClientType.PrismaClient)
    private readonly prisma: PrismaClient;

    constructor(prisma: PrismaClient, kid?: string) {
        this._kid = kid ?? uuidv4()
        this.prisma = prisma;
    }

    async generateSignKeys() {
        const keyPair = await crypto.subtle.generateKey(
            {
                ...KEY_BASE_OPTIONS,
                modulusLength: 2048,
            },
            true,
            ['sign', 'verify']
        );

        if (keyPair instanceof CryptoKey) {
            throw new HTTPException(500, { message: 'Failed to generate key pair' })
        }

        return {
            kid: this._kid,
            ...keyPair,
        }
    }

    async saveKeys(kid: string, keys: { publicKey: CryptoKey, privateKey: CryptoKey }): Promise<void> {
        const publicKey = await crypto.subtle.exportKey('jwk', keys.publicKey);
        const privateKey = await crypto.subtle.exportKey('pkcs8', keys.privateKey);
        if ((publicKey instanceof ArrayBuffer) || !(privateKey instanceof ArrayBuffer)) {
            throw new HTTPException(500, { message: 'Failed to export key' })
        }

        const pemExported = `${pemHeader}\n${this.encodeBase64(privateKey)}\n${pemFooter}`;

        await this.prisma.signKey.create({
            data: {
                kid,
                privateKey: pemExported,
                publicKey: JSON.stringify(publicKey)
            }
        })
    }

    async getKeys(kid?: string[]) {

        await this.prisma.signKey.deleteMany();
        const keys = await this.prisma.signKey.findMany({ where: { kid: { in: kid } } });

        const exec = keys.map(async (key) => {
            const publicKey = await crypto.subtle.importKey('jwk', JSON.parse(key.publicKey), KEY_BASE_OPTIONS, true, ['verify']);
            const privateKey = await crypto.subtle.importKey('pkcs8', this.convertStringToArrayBufferView(key.privateKey), KEY_BASE_OPTIONS, true, ['sign']);

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

    private encodeBase64(buffer: ArrayBuffer) {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    }

    private convertStringToArrayBufferView(str: string) {
        const decodeString = atob(str);
        const buf = new ArrayBuffer(decodeString.length);
        const bufView = new Uint8Array(buf);
        for (let i = 0, strLen = decodeString.length; i < strLen; i++) {
            bufView[i] = decodeString.charCodeAt(i);
        }
        return buf;
    }

}